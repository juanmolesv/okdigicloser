import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StatsCards from '@/components/dashboard/StatsCards';
import Navbar from '@/components/dashboard/Navbar';
import AIInsights from '@/components/dashboard/AIInsights';
import DashboardClient from './dashboard-client';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .order('started_at', { ascending: false });

  const allConvs = conversations || [];
  const stats = {
    totalConversations: allConvs.length,
    openConversations: allConvs.filter(c => c.status === 'open').length,
    closedWon: allConvs.filter(c => c.status === 'closed_won').length,
    closedLost: allConvs.filter(c => c.status === 'closed_lost').length,
    totalRevenue: allConvs.reduce((sum, c) => sum + (c.sale_value || 0), 0),
    totalCommission: allConvs.reduce((sum, c) => sum + (c.commission_amount || 0), 0),
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">Powered by Luna IA</p>
          </div>
        </div>

        <StatsCards stats={stats} />

        {/* AI Insights Section */}
        <div className="mt-8">
          <AIInsights stats={stats} conversations={allConvs} />
        </div>

        {/* Conversations */}
        <DashboardClient conversations={allConvs} />
      </div>
    </main>
  );
}
