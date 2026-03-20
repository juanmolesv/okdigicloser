import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMessage, markAsRead } from '@/lib/whatsapp/client';
import { runDebate } from '@/lib/ai/orchestrator';
import type { Message, Closer, Conversation } from '@/types';

// Cliente Supabase con service role para operaciones del servidor
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET — Verificacion del webhook de WhatsApp.
 * Meta envia hub.mode, hub.verify_token y hub.challenge al configurar el webhook.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Validar que el token coincida con nuestro verify token
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verificacion exitosa');
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn('[WhatsApp Webhook] Verificacion fallida — token invalido');
  return NextResponse.json({ error: 'Token de verificacion invalido' }, { status: 403 });
}

// Interfaces para tipado del payload de WhatsApp Cloud API
interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

interface WhatsAppValue {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: Array<{ profile: { name: string }; wa_id: string }>;
  messages?: WhatsAppMessage[];
  statuses?: Array<{ id: string; status: string }>;
}

interface WhatsAppEntry {
  id: string;
  changes: Array<{
    value: WhatsAppValue;
    field: string;
  }>;
}

interface WhatsAppPayload {
  object: string;
  entry: WhatsAppEntry[];
}

/**
 * POST — Recibe mensajes entrantes de WhatsApp.
 * Procesa el mensaje, ejecuta el debate IA, y responde al prospecto.
 */
export async function POST(req: NextRequest) {
  try {
    const payload: WhatsAppPayload = await req.json();

    // WhatsApp requiere respuesta 200 inmediata para no reintentar
    // Procesamos en el mismo request ya que Next.js no soporta background fns nativamente

    if (payload.object !== 'whatsapp_business_account') {
      return NextResponse.json({ received: true });
    }

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field !== 'messages') continue;

        const value = change.value;
        const phoneNumberId = value.metadata.phone_number_id;
        const messages = value.messages;

        if (!messages || messages.length === 0) continue;

        for (const msg of messages) {
          // Solo procesamos mensajes de texto por ahora
          if (msg.type !== 'text' || !msg.text?.body) {
            continue;
          }

          const senderPhone = msg.from;
          const messageText = msg.text.body;
          const messageId = msg.id;
          const contactName = value.contacts?.[0]?.profile?.name || 'Prospecto';

          console.log(
            `[WhatsApp] Mensaje de ${contactName} (${senderPhone}): ${messageText.substring(0, 100)}`
          );

          // 1. Buscar el closer asociado a este numero de WhatsApp
          const closerConfig = await findCloserByPhoneNumberId(phoneNumberId);
          if (!closerConfig) {
            console.error(
              `[WhatsApp] No se encontro closer para phone_number_id: ${phoneNumberId}`
            );
            continue;
          }

          // 2. Buscar o crear la conversacion en Supabase
          const conversation = await findOrCreateConversation(
            closerConfig,
            senderPhone,
            contactName
          );

          // 3. Agregar mensaje del usuario al historial
          const history: Message[] = conversation.messages || [];
          const updatedMessages: Message[] = [
            ...history,
            {
              role: 'user' as const,
              content: messageText,
              timestamp: new Date().toISOString(),
            },
          ];

          // 4. Ejecutar el debate multi-IA para generar la respuesta
          const debateResult = await runDebate(closerConfig, history, messageText);
          const aiResponse = debateResult.finalResponse;

          console.log(
            `[WhatsApp] Respuesta IA (${debateResult.processingMs}ms): ${aiResponse.substring(0, 100)}`
          );

          // 5. Agregar la respuesta de la IA al historial
          updatedMessages.push({
            role: 'assistant' as const,
            content: aiResponse,
            timestamp: new Date().toISOString(),
          });

          // 6. Actualizar la conversacion en Supabase
          await supabase
            .from('conversations')
            .update({
              messages: updatedMessages,
              prospect_name: contactName,
              prospect_phone: senderPhone,
            })
            .eq('id', conversation.id);

          // 7. Enviar la respuesta al prospecto por WhatsApp
          await sendMessage(phoneNumberId, senderPhone, aiResponse);

          // 8. Marcar el mensaje entrante como leido
          await markAsRead(phoneNumberId, messageId);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[WhatsApp Webhook Error]', err);
    // Siempre retornar 200 para evitar reintentos de Meta
    return NextResponse.json({ received: true });
  }
}

/**
 * Busca el closer configurado para un phone_number_id de WhatsApp.
 * Busca en la tabla closers un registro cuyo campo whatsapp_phone_number_id coincida,
 * o usa el WHATSAPP_PHONE_NUMBER_ID por defecto del env.
 */
async function findCloserByPhoneNumberId(
  phoneNumberId: string
): Promise<Closer | null> {
  // Primero intentar buscar por el campo whatsapp_phone_number_id en la tabla closers
  const { data: closerByWA } = await supabase
    .from('closers')
    .select('*')
    .eq('whatsapp_phone_number_id', phoneNumberId)
    .eq('is_active', true)
    .limit(1)
    .single();

  if (closerByWA) return closerByWA as Closer;

  // Si el phoneNumberId coincide con el env por defecto, buscar el primer closer activo
  if (phoneNumberId === process.env.WHATSAPP_PHONE_NUMBER_ID) {
    const { data: defaultCloser } = await supabase
      .from('closers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    return (defaultCloser as Closer) || null;
  }

  return null;
}

/**
 * Busca una conversacion abierta con el mismo prospecto y closer,
 * o crea una nueva si no existe.
 */
async function findOrCreateConversation(
  closer: Closer,
  prospectPhone: string,
  prospectName: string
): Promise<Conversation> {
  // Buscar conversacion abierta existente con este prospecto
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('closer_id', closer.id)
    .eq('prospect_phone', prospectPhone)
    .in('status', ['open', 'follow_up'])
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  if (existing) return existing as Conversation;

  // Crear nueva conversacion
  const { data: newConversation, error } = await supabase
    .from('conversations')
    .insert({
      closer_id: closer.id,
      client_id: closer.client_id,
      prospect_phone: prospectPhone,
      prospect_name: prospectName,
      channel: 'whatsapp',
      status: 'open',
      messages: [],
    })
    .select()
    .single();

  if (error) {
    console.error('[WhatsApp] Error al crear conversacion:', error);
    throw new Error('No se pudo crear la conversacion');
  }

  return newConversation as Conversation;
}
