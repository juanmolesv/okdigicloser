'use client';

import { useEffect, useState } from 'react';
import StepIndicator from '@/components/onboarding/StepIndicator';
import EmbedCode from '@/components/onboarding/EmbedCode';
import QRCode from '@/components/onboarding/QRCode';
import Link from 'next/link';

export default function DeployPage() {
  const [closerId, setCloserId] = useState<string | null>(null);

  useEffect(() => {
    setCloserId(localStorage.getItem('okdc_closer_id'));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold text-white">
          OkDigi<span className="text-blue-500">Closer</span>
        </Link>

        <StepIndicator currentStep={3} />

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="mb-2 text-2xl font-bold">Luna está lista para cerrar</h1>
          <p className="mb-6 text-slate-400">
            Comparte el link, embebe el widget o usa el QR. Luna IA empezará a cerrar ventas por ti 24/7.
          </p>

          {closerId ? (
            <>
              <EmbedCode closerId={closerId} />

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold">QR Code</h3>
                <QRCode closerId={closerId} />
              </div>
            </>
          ) : (
            <p className="text-slate-500">Cargando...</p>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              Dashboard
            </Link>
            <Link
              href={closerId ? `/closer/${closerId}` : '#'}
              className="rounded-lg border border-slate-700 px-6 py-3 text-center font-semibold text-white hover:bg-slate-800"
            >
              Probar Chat
            </Link>
            <Link
              href="/dashboard/whatsapp"
              className="rounded-lg border border-green-700 px-6 py-3 text-center font-semibold text-green-400 hover:bg-green-900/20"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
