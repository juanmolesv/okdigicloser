import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runDebate } from '@/lib/ai/orchestrator';
import { chargeCommission } from '@/lib/stripe/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { closerId, conversationId, history, message } = await req.json();

    const { data: closer, error } = await supabase
      .from('closers')
      .select('*')
      .eq('id', closerId)
      .eq('is_active', true)
      .single();

    if (error || !closer) {
      return NextResponse.json({ error: 'Cerrador no encontrado' }, { status: 404 });
    }

    // Run debate (main response)
    const result = await runDebate(closer, history || [], message);

    const updatedMessages = [
      ...(history || []),
      { role: 'user' as const, content: message, timestamp: new Date().toISOString() },
      { role: 'assistant' as const, content: result.finalResponse, timestamp: new Date().toISOString() },
    ];

    // Save messages to conversation
    await supabase
      .from('conversations')
      .update({ messages: updatedMessages })
      .eq('id', conversationId);

    // Run AI analysis in background (don't block the response)
    runBackgroundAnalysis(conversationId, updatedMessages, closer, message).catch(console.error);

    return NextResponse.json({
      response: result.finalResponse,
      processingMs: result.processingMs,
    });
  } catch (err) {
    console.error('[OkDigiCloser Error]', err);
    return NextResponse.json({ error: 'Error en el motor IA' }, { status: 500 });
  }
}

async function runBackgroundAnalysis(
  conversationId: string,
  messages: { role: string; content: string }[],
  closer: Record<string, unknown>,
  latestMessage: string
) {
  try {
    // Dynamic import to avoid errors if analyzer isn't ready yet
    const analyzer = await import('@/lib/ai/analyzer');

    // Run sentiment, scoring, and closing detection in parallel
    const [sentiment, score, closing] = await Promise.allSettled([
      analyzer.analyzeSentiment(latestMessage),
      analyzer.scoreLeadAI(messages as { role: 'user' | 'assistant'; content: string }[]),
      analyzer.detectClosing(
        messages as { role: 'user' | 'assistant'; content: string }[],
        closer.closing_action as string
      ),
    ]);

    const metadata: Record<string, unknown> = {};

    if (sentiment.status === 'fulfilled') {
      metadata.last_sentiment = sentiment.value.sentiment;
      metadata.last_emotion = sentiment.value.emotion;
      metadata.buying_intent = sentiment.value.buyingIntent;
    }

    if (score.status === 'fulfilled') {
      metadata.lead_score = score.value.score;
      metadata.lead_temperature = score.value.temperature;
      metadata.buying_signals = score.value.signals;
      metadata.detected_objections = score.value.objections;
      metadata.recommended_action = score.value.nextAction;
    }

    // Update conversation with analysis
    const updateData: Record<string, unknown> = {
      notes: JSON.stringify(metadata),
    };

    // If closing detected with high confidence, mark as closed_won
    if (closing.status === 'fulfilled' && closing.value.isClosed && closing.value.confidence > 75) {
      updateData.status = 'closed_won';
      updateData.closed_at = new Date().toISOString();
      if (closing.value.estimatedValue) {
        updateData.sale_value = closing.value.estimatedValue;
      }

      // Notify client and charge commission
      try {
        const { data: conv } = await supabase
          .from('conversations')
          .select('client_id')
          .eq('id', conversationId)
          .single();

        if (conv) {
          const { data: client } = await supabase
            .from('clients')
            .select('email, stripe_customer_id, commission_rate')
            .eq('id', conv.client_id)
            .single();

          if (client) {
            // Send closed deal email
            fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'closed_deal',
                to: client.email,
                prospectName: 'Prospecto',
                saleValue: closing.value.estimatedValue || 0,
              }),
            }).catch(console.error);

            // Charge commission if client has Stripe customer and there's a sale value
            const saleValue = closing.value.estimatedValue;
            if (client.stripe_customer_id && saleValue && saleValue > 0) {
              const commissionRate = Number(client.commission_rate) || 10;
              const commissionAmount = saleValue * (commissionRate / 100);

              try {
                const intent = await chargeCommission(
                  client.stripe_customer_id,
                  saleValue,
                  commissionRate,
                  `Comision OkDigiCloser — Venta de ${saleValue}EUR`
                );

                // Update conversation with commission info
                await supabase
                  .from('conversations')
                  .update({
                    commission_amount: commissionAmount,
                  })
                  .eq('id', conversationId);

                // Record payment
                await supabase.from('payments').insert({
                  client_id: conv.client_id,
                  conversation_id: conversationId,
                  type: 'commission',
                  amount: commissionAmount,
                  currency: 'eur',
                  stripe_payment_id: intent.id,
                  status: 'pending',
                });
              } catch (stripeErr) {
                console.error('[Commission Charge Error]', stripeErr);
              }
            }
          }
        }
      } catch {
        // Non-critical, don't fail
      }
    }

    await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', conversationId);
  } catch (err) {
    console.error('[Background Analysis Error]', err);
  }
}
