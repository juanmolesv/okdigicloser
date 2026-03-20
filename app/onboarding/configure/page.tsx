'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/onboarding/StepIndicator';
import BusinessForm, { type BusinessFormData } from '@/components/onboarding/BusinessForm';
import PromptPreview from '@/components/onboarding/PromptPreview';
import Link from 'next/link';

export default function ConfigurePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewConfig, setPreviewConfig] = useState<BusinessFormData | null>(null);

  const handleSubmit = async (data: BusinessFormData) => {
    setLoading(true);
    setError('');

    try {
      const clientId = localStorage.getItem('okdc_client_id');
      if (!clientId) {
        setError('No se encontró tu cuenta. Vuelve al paso 1.');
        return;
      }

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'configure_closer',
          clientId,
          name: `Cerrador ${data.product_name}`,
          ...data,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Error al configurar cerrador');
        return;
      }

      localStorage.setItem('okdc_closer_id', result.closer.id);
      router.push('/onboarding/deploy');
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold text-white">
          OkDigi<span className="text-blue-500">Closer</span>
        </Link>

        <StepIndicator currentStep={2} />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h1 className="mb-2 text-2xl font-bold">Configura tu cerrador</h1>
            <p className="mb-6 text-slate-400">
              Cuéntanos sobre tu producto y la IA se convertirá en tu mejor vendedor.
            </p>

            <BusinessForm
              onSubmit={handleSubmit}
              onChange={setPreviewConfig}
              loading={loading}
            />

            {error && (
              <p className="mt-4 rounded-lg bg-red-900/30 p-3 text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="hidden lg:block">
            {previewConfig && <PromptPreview closerConfig={previewConfig} />}
          </div>
        </div>
      </div>
    </main>
  );
}
