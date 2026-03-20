import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    switch (event.message?.type) {
      case 'end-of-call-report': {
        const { call } = event.message;
        const conversationId = call?.assistantOverrides?.variableValues?.conversationId;

        if (conversationId) {
          const transcript = call.transcript
            ?.map((t: { role: string; content: string }) =>
              `${t.role}: ${t.content}`
            )
            .join('\n');

          await supabase
            .from('conversations')
            .update({
              notes: `Transcripción de voz:\n${transcript}`,
              channel: 'voice',
            })
            .eq('id', conversationId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[Vapi Webhook Error]', err);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
