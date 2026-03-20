import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';
import WhatsAppConfig from '@/components/dashboard/WhatsAppConfig';

export default async function WhatsAppPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: closers } = await supabase
    .from('closers')
    .select('id, name, product_name')
    .order('created_at', { ascending: false })
    .limit(1);

  const closerId = closers?.[0]?.id || '';

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-2 text-3xl font-bold">WhatsApp Business</h1>
        <p className="mb-8 text-slate-400">
          Conecta WhatsApp para que Luna IA cierre ventas también por mensajería.
        </p>
        {closerId ? (
          <WhatsAppConfig closerId={closerId} />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">Configura tu cerrador primero para activar WhatsApp.</p>
          </div>
        )}
      </div>
    </main>
  );
}
