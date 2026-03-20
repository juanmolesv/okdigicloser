'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LUNA_PERSONALITY } from '@/lib/ai/luna';

const demoMessages = [
  {
    role: 'user' as const,
    text: 'No sé si es el momento adecuado para invertir en esto...',
  },
  {
    role: 'luna' as const,
    text: 'Entiendo perfectamente. Invertir siempre genera esa sensación... Pero déjame preguntarte algo: ¿cuánto te está costando **no** tener esto resuelto cada mes?',
  },
  {
    role: 'user' as const,
    text: 'La verdad, bastante. Pierdo como 3 horas al día en eso.',
  },
  {
    role: 'luna' as const,
    text: '3 horas al día son 90 horas al mes. Si tu hora vale aunque sea $20, eso son **$1,800 que ya estás gastando**. La inversión se paga sola desde el primer mes.',
  },
  {
    role: 'user' as const,
    text: 'Wow, no lo había visto así. ¿Cómo empiezo?',
  },
];

const traitIcons: Record<string, React.ReactNode> = {
  Empática: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Persuasiva: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  Analítica: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v-5.5m3 5.5V8.25m3 3v-2" />
    </svg>
  ),
  Persistente: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
    </svg>
  ),
  Natural: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  ),
};

export default function LunaShowcase() {
  const [mounted, setMounted] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Progressively reveal demo messages when section is in view
  useEffect(() => {
    if (!mounted) return;

    const timers: NodeJS.Timeout[] = [];
    demoMessages.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleMessages((v) => Math.max(v, i + 1)), 800 + i * 1200)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [mounted]);

  return (
    <section id="luna" className="relative py-24 overflow-hidden bg-slate-950">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.10) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Potenciada por 3 IAs
          </div>

          <h2
            className={`text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Conoce a{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Luna
            </span>
            , tu cerrador IA
          </h2>

          <p
            className={`text-lg text-slate-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {LUNA_PERSONALITY.description}
          </p>
        </div>

        {/* Main grid: Avatar + Traits | Demo chat */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left column: Avatar + Traits */}
          <div
            className={`flex flex-col items-center lg:items-start gap-10 transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Large Luna avatar */}
            <div className="relative">
              <span className="absolute -inset-4 rounded-full bg-blue-500/20 blur-2xl" />
              <Image
                src={LUNA_PERSONALITY.avatar}
                alt={LUNA_PERSONALITY.fullName}
                width={140}
                height={140}
                className="relative z-10 rounded-full ring-2 ring-blue-500/30"
                priority
              />
            </div>

            {/* Traits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              {LUNA_PERSONALITY.traits.map((trait, i) => (
                <div
                  key={trait}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 transition-all duration-500 ${
                    mounted
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  <span className="text-blue-400 shrink-0">
                    {traitIcons[trait]}
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    {trait}
                  </span>
                </div>
              ))}
            </div>

            {/* AI stack badge */}
            <div className="px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center lg:text-left">
              <p className="text-sm text-slate-400 leading-relaxed">
                Luna combina{' '}
                <span className="text-blue-400 font-semibold">3 IAs</span>{' '}
                (Claude + Gemini + GPT-4o) para darte la{' '}
                <span className="text-white font-semibold">
                  respuesta perfecta
                </span>
                .
              </p>
            </div>
          </div>

          {/* Right column: Demo chat */}
          <div
            className={`transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-2xl shadow-blue-900/10">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-800 bg-slate-900">
                <Image
                  src={LUNA_PERSONALITY.avatar}
                  alt="Luna"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white leading-none">
                    Luna
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[11px] text-slate-500">
                      En línea
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 min-h-[340px]">
                {demoMessages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  const visible = i < visibleMessages;

                  return (
                    <div
                      key={i}
                      className={`flex ${
                        isUser ? 'justify-end' : 'justify-start'
                      } transition-all duration-500 ${
                        visible
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-3'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-slate-800 text-slate-200 rounded-bl-md'
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: msg.text
                            .replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="text-white font-semibold">$1</strong>'
                            ),
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Fake input */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 rounded-xl bg-slate-800/60 border border-slate-700 px-4 py-2.5">
                  <span className="text-sm text-slate-500 select-none">
                    Escribe un mensaje...
                  </span>
                  <span className="ml-auto">
                    <svg
                      className="w-5 h-5 text-slate-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
