import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendMessage } from '@/lib/whatsapp/client';
import type { Message, Closer } from '@/types';

// Cliente Supabase con service role para operaciones del servidor
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST — Enviar un mensaje de WhatsApp manualmente desde el dashboard.
 * Usado para follow-ups y mensajes directos a prospectos.
 *
 * Body: { to: string, message: string, closerId: string, conversationId?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { to, message, closerId, conversationId } = await req.json();

    // Validar parametros requeridos
    if (!to || !message || !closerId) {
      return NextResponse.json(
        { error: 'Faltan parametros requeridos: to, message, closerId' },
        { status: 400 }
      );
    }

    // Buscar el closer para obtener su phone_number_id de WhatsApp
    const { data: closer, error: closerError } = await supabase
      .from('closers')
      .select('*')
      .eq('id', closerId)
      .single();

    if (closerError || !closer) {
      return NextResponse.json(
        { error: 'Closer no encontrado' },
        { status: 404 }
      );
    }

    const closerData = closer as Closer & { whatsapp_phone_number_id?: string };

    // Usar el phone_number_id del closer o el por defecto del env
    const phoneNumberId =
      closerData.whatsapp_phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!phoneNumberId) {
      return NextResponse.json(
        { error: 'No hay WhatsApp Phone Number ID configurado para este closer' },
        { status: 400 }
      );
    }

    // Limpiar el numero de telefono (solo digitos)
    const cleanPhone = to.replace(/\D/g, '');

    // Enviar el mensaje por WhatsApp
    const { messageId } = await sendMessage(phoneNumberId, cleanPhone, message);

    // Si hay una conversacion, agregar el mensaje al historial
    if (conversationId) {
      const { data: conversation } = await supabase
        .from('conversations')
        .select('messages')
        .eq('id', conversationId)
        .single();

      const currentMessages: Message[] = conversation?.messages || [];
      const updatedMessages: Message[] = [
        ...currentMessages,
        {
          role: 'assistant' as const,
          content: message,
          timestamp: new Date().toISOString(),
        },
      ];

      await supabase
        .from('conversations')
        .update({
          messages: updatedMessages,
          status: 'follow_up',
        })
        .eq('id', conversationId);
    } else {
      // Crear nueva conversacion para el follow-up si no existe una
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id, messages')
        .eq('closer_id', closerId)
        .eq('prospect_phone', cleanPhone)
        .in('status', ['open', 'follow_up'])
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (existingConv) {
        // Agregar mensaje a conversacion existente
        const currentMessages: Message[] = existingConv.messages || [];
        const updatedMessages: Message[] = [
          ...currentMessages,
          {
            role: 'assistant' as const,
            content: message,
            timestamp: new Date().toISOString(),
          },
        ];

        await supabase
          .from('conversations')
          .update({
            messages: updatedMessages,
            status: 'follow_up',
          })
          .eq('id', existingConv.id);
      } else {
        // Crear nueva conversacion
        await supabase.from('conversations').insert({
          closer_id: closerId,
          client_id: closerData.client_id,
          prospect_phone: cleanPhone,
          channel: 'whatsapp',
          status: 'follow_up',
          messages: [
            {
              role: 'assistant' as const,
              content: message,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }
    }

    return NextResponse.json({
      success: true,
      messageId,
      phone: cleanPhone,
    });
  } catch (err) {
    console.error('[WhatsApp Send Error]', err);
    const errorMessage =
      err instanceof Error ? err.message : 'Error al enviar mensaje de WhatsApp';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
