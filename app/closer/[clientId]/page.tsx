import { createClient } from '@supabase/supabase-js';
import CloserChat from './closer-chat';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function CloserPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  const { data: closer } = await supabase
    .from('closers')
    .select('*')
    .eq('id', clientId)
    .eq('is_active', true)
    .single();

  if (!closer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Cerrador no disponible</h1>
          <p className="mt-2 text-slate-400">Este cerrador no existe o ha sido desactivado.</p>
        </div>
      </div>
    );
  }

  return <CloserChat closer={closer} />;
}
