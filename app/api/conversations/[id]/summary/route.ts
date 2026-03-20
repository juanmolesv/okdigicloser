import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { summarizeConversation } from '@/lib/ai/analyzer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Se requiere el ID de conversacion' },
        { status: 400 }
      );
    }

    // Fetch conversation from Supabase
    const { data: conversation, error: dbError } = await supabase
      .from('conversations')
      .select('id, messages, prospect_name, closer_id')
      .eq('id', id)
      .single();

    if (dbError || !conversation) {
      return NextResponse.json(
        { error: 'Conversacion no encontrada' },
        { status: 404 }
      );
    }

    const messages = Array.isArray(conversation.messages)
      ? conversation.messages
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'La conversacion no tiene mensajes' },
        { status: 400 }
      );
    }

    // Get product name from closer config for context
    let productName = 'Producto/Servicio';
    if (conversation.closer_id) {
      const { data: closer } = await supabase
        .from('closers')
        .select('product_name')
        .eq('id', conversation.closer_id)
        .single();

      if (closer?.product_name) {
        productName = closer.product_name;
      }
    }

    // Generate summary using AI
    const summary = await summarizeConversation(messages, productName);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('[API /conversations/[id]/summary] Error:', error);
    return NextResponse.json(
      { error: 'Error interno al generar el resumen' },
      { status: 500 }
    );
  }
}
