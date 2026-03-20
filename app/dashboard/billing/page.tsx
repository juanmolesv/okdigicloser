import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';

export default async function BillingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: client } = await supabase
    .from('clients')
    .select('plan, commission_rate')
    .single();

  const allPayments = payments || [];
  const totalPaid = allPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-8 text-3xl font-bold">Facturación</h1>

        {client && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
              <p className="text-2xl font-bold text-white capitalize">{client.plan}</p>
              <p className="text-sm text-slate-400">Plan actual</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
              <p className="text-2xl font-bold text-white">{client.commission_rate}%</p>
              <p className="text-sm text-slate-400">Comisión por cierre</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{totalPaid.toFixed(2)}€</p>
              <p className="text-sm text-slate-400">Total pagado</p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-4">
            <h2 className="font-semibold">Historial de pagos</h2>
          </div>
          {allPayments.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No hay pagos registrados todavía.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-left text-sm text-slate-400">
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Monto</th>
                  <th className="px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {allPayments.map(payment => (
                  <tr key={payment.id} className="border-b border-slate-800/50">
                    <td className="px-6 py-4 text-sm">
                      {new Date(payment.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {payment.type === 'setup_fee' ? 'Setup Fee' : 'Comisión'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {payment.amount.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          payment.status === 'paid'
                            ? 'bg-green-900/30 text-green-400'
                            : payment.status === 'pending'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-red-900/30 text-red-400'
                        }`}
                      >
                        {payment.status === 'paid'
                          ? 'Pagado'
                          : payment.status === 'pending'
                            ? 'Pendiente'
                            : 'Fallido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
