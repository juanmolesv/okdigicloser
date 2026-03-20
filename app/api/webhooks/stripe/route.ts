import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { clientId, type, plan } = session.metadata || {};

      if (type === 'setup_fee' && clientId) {
        await supabase
          .from('clients')
          .update({
            setup_paid: true,
            plan,
            stripe_customer_id: session.customer as string,
          })
          .eq('id', clientId);

        await supabase.from('payments').insert({
          client_id: clientId,
          type: 'setup_fee',
          amount: (session.amount_total || 0) / 100,
          currency: session.currency || 'eur',
          stripe_payment_id: session.payment_intent as string,
          status: 'paid',
        });
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent;
      if (intent.metadata?.type === 'commission') {
        await supabase
          .from('payments')
          .update({ status: 'paid' })
          .eq('stripe_payment_id', intent.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
