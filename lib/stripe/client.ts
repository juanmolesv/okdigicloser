import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
});

export async function createSetupFeeCheckout(clientId: string, plan: string) {
  const prices: Record<string, number> = {
    starter: 29700,
    pro: 49700,
    enterprise: 99700,
  };

  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: prices[plan] || prices.starter,
          product_data: { name: `OkDigiCloser — Setup ${plan}` },
        },
        quantity: 1,
      },
    ],
    metadata: { clientId, type: 'setup_fee', plan },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/configure?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });
}

export async function chargeCommission(
  stripeCustomerId: string,
  saleValue: number,
  commissionRate: number,
  description: string
) {
  const amount = Math.round(saleValue * (commissionRate / 100) * 100);
  return stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    customer: stripeCustomerId,
    description,
    automatic_payment_methods: { enabled: true },
  });
}
