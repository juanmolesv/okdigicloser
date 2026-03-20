'use client';

import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      description: 'Ideal para negocios que quieren probar la IA de ventas.',
      setup: '297',
      commission: '10%',
      highlighted: false,
      features: [
        '1 cerrador IA',
        'Chat en web',
        'Dashboard basico',
        'Soporte por email',
        'Hasta 500 conversaciones/mes',
      ],
    },
    {
      name: 'Pro',
      description: 'Para negocios serios que quieren maximizar conversiones.',
      setup: '497',
      commission: '8%',
      highlighted: true,
      badge: 'Mas popular',
      features: [
        '3 cerradores IA',
        'Chat + Voz IA',
        'Dashboard avanzado',
        'Soporte prioritario',
        'Conversaciones ilimitadas',
        'Integracion WhatsApp',
        'A/B testing de argumentos',
      ],
    },
    {
      name: 'Enterprise',
      description: 'Solucion completa para empresas con alto volumen.',
      setup: '997',
      commission: '5%',
      highlighted: false,
      features: [
        'Cerradores ilimitados',
        'Chat + Voz + Video IA',
        'Dashboard personalizado',
        'Account manager dedicado',
        'Conversaciones ilimitadas',
        'API completa',
        'IA entrenada con tus datos',
        'SLA garantizado',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Precios
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Solo pagas si la IA cierra
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Setup unico + comision por venta cerrada. Sin mensualidades. Sin sorpresas.
          </p>
        </div>

        {/* Plans */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? 'border-blue-500/50 bg-slate-800/80 shadow-xl shadow-blue-600/10 scale-[1.02] lg:scale-105'
                  : 'border-slate-800 bg-slate-800/40'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-white">{plan.setup}</span>
                  <span className="text-lg text-slate-400 font-medium">&euro;</span>
                </div>
                <p className="text-sm text-slate-500">setup unico</p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-700">
                  <span className="text-sm font-semibold text-blue-400">{plan.commission}</span>
                  <span className="text-sm text-slate-400">comision por venta</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/onboarding"
                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 mb-8 ${
                  plan.highlighted
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                Empezar con {plan.name}
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <svg
                      className="w-5 h-5 text-blue-400 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-slate-300 text-sm">
              <span className="font-semibold text-white">Garantia de resultados:</span> si no cierras en 30 dias, te devolvemos el setup.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
