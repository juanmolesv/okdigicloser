import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { scoreLeadAI } from '@/lib/ai/analyzer';

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
      .select('id, messages, prospect_name')
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

    // Score the lead using AI
    const score = await scoreLeadAI(messages);

    return NextResponse.json(score);
  } catch (error) {
    console.error('[API /conversations/[id]/score] Error:', error);
    return NextResponse.json(
      { error: 'Error interno al evaluar el lead' },
      { status: 500 }
    );
  }
}
