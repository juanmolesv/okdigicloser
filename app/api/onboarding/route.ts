import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSetupFeeCheckout } from '@/lib/stripe/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create_checkout') {
      const { email, company_name, contact_name, phone, plan } = body;

      // Create client
      const { data: client, error } = await supabase
        .from('clients')
        .insert({ email, company_name, contact_name, phone, plan })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Email ya registrado' }, { status: 409 });
        }
        throw error;
      }

      // Create Stripe checkout
      const session = await createSetupFeeCheckout(client.id, plan);
      return NextResponse.json({ checkoutUrl: session.url, clientId: client.id });
    }

    if (action === 'configure_closer') {
      const { clientId, ...closerData } = body;

      const { data: closer, error } = await supabase
        .from('closers')
        .insert({ client_id: clientId, ...closerData })
        .select()
        .single();

      if (error) throw error;

      // Send welcome email
      try {
        const { data: client } = await supabase
          .from('clients')
          .select('email, company_name')
          .eq('id', clientId)
          .single();

        if (client) {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'welcome',
              to: client.email,
              companyName: client.company_name,
              closerId: closer.id,
            }),
          });
        }
      } catch (emailErr) {
        console.error('Error sending welcome email:', emailErr);
      }

      return NextResponse.json({ closer });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('[Onboarding Error]', err);
    return NextResponse.json({ error: 'Error en onboarding' }, { status: 500 });
  }
}
