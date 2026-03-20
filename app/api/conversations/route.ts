import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { closer_id, client_id } = await req.json();

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        closer_id,
        client_id,
        channel: 'chat',
        status: 'open',
        messages: [],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error('[Conversation Error]', err);
    return NextResponse.json({ error: 'Error al crear conversación' }, { status: 500 });
  }
}
