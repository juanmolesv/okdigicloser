'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <nav className="border-b border-slate-800 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-white">
          OkDigi<span className="text-blue-500">Closer</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">
            Dashboard
          </Link>
          <Link href="/dashboard/closer" className="text-sm text-slate-400 hover:text-white">
            Mi Cerrador
          </Link>
          <Link href="/dashboard/whatsapp" className="text-sm text-slate-400 hover:text-white">
            WhatsApp
          </Link>
          <Link href="/dashboard/billing" className="text-sm text-slate-400 hover:text-white">
            Facturación
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
