'use client';

import { useState } from 'react';
import StepIndicator from '@/components/onboarding/StepIndicator';
import Link from 'next/link';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    company_name: '',
    contact_name: '',
    phone: '',
    plan: 'starter',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_checkout', ...form }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al crear cuenta');
        return;
      }

      if (data.checkoutUrl) {
        localStorage.setItem('okdc_client_id', data.clientId);
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold text-white">
          OkDigi<span className="text-blue-500">Closer</span>
        </Link>

        <StepIndicator currentStep={1} />

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="mb-2 text-2xl font-bold">Crea tu cuenta</h1>
          <p className="mb-6 text-slate-400">
            Paso 1: Regístrate y paga el setup fee para activar tu cerrador IA.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder="tu@empresa.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Nombre de empresa</label>
              <input
                type="text"
                required
                value={form.company_name}
                onChange={e => setForm({ ...form, company_name: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder="Mi Empresa S.L."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Tu nombre</label>
              <input
                type="text"
                required
                value={form.contact_name}
                onChange={e => setForm({ ...form, contact_name: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder="Juan García"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Teléfono (opcional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                placeholder="+34 600 123 456"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Plan</label>
              <select
                value={form.plan}
                onChange={e => setForm({ ...form, plan: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="starter">Starter — 297€ setup + 10% comisión</option>
                <option value="pro">Pro — 497€ setup + 8% comisión + Voz</option>
                <option value="enterprise">Enterprise — 997€ setup + 5% comisión + Custom</option>
              </select>
            </div>

            {error && (
              <p className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Continuar al pago'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
