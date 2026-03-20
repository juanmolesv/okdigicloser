import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';
import Link from 'next/link';
import CloserManager from './closer-manager';

export default async function CloserEditorPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: closers } = await supabase
    .from('closers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  const closer = closers?.[0];

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-8 text-3xl font-bold">Mi Cerrador IA</h1>

        {closer ? (
          <CloserManager
            initialCloser={closer}
            appUrl={process.env.NEXT_PUBLIC_APP_URL || 'https://okdigicloser.com'}
          />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">No tienes un cerrador configurado.</p>
            <Link
              href="/onboarding/configure"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Configurar Cerrador
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
