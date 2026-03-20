'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(ellipse at 20% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background:
              'radial-gradient(ellipse at 60% 40%, rgba(37, 99, 235, 0.08) 0%, transparent 60%)',
            animationDuration: '4s',
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          IA de ventas activa 24/7
        </div>

        {/* Headline */}
        <h1
          className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6 transition-all duration-700 delay-150 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Tu Cerrador de Ventas IA{' '}
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            que Trabaja 24/7
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Cualquier empresa. Cualquier producto.{' '}
          <span className="text-white font-semibold">La IA cierra por ti.</span>
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/onboarding"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-lg transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Empieza Ahora
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-8 py-4 text-slate-300 hover:text-white font-medium rounded-xl text-lg transition-colors border border-slate-700 hover:border-slate-600 bg-slate-800/50 hover:bg-slate-800"
          >
            Ver como funciona
          </Link>
        </div>

        {/* Stats */}
        <div
          className={`mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto transition-all duration-700 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {[
            { value: '24/7', label: 'Disponibilidad' },
            { value: '+40%', label: 'Tasa de cierre' },
            { value: '<2min', label: 'Respuesta' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
