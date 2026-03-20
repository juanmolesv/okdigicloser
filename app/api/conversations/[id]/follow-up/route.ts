import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*, closers(product_name)')
      .eq('id', id)
      .single();

    if (error || !conversation) {
      return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
    }

    const { generateFollowUp } = await import('@/lib/ai/analyzer');

    const daysSince = Math.floor(
      (Date.now() - new Date(conversation.started_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    const followUp = await generateFollowUp(
      conversation.messages || [],
      conversation.closers?.product_name || 'el producto',
      daysSince
    );

    return NextResponse.json(followUp);
  } catch (err) {
    console.error('[Follow-up Error]', err);
    return NextResponse.json({ error: 'Error al generar follow-up' }, { status: 500 });
  }
}
