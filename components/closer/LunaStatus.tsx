'use client';

import { useEffect, useState } from 'react';

type LunaPhase = 'idle' | 'debating' | 'synthesizing';

interface LunaStatusProps {
  phase?: LunaPhase;
  name?: string;
}

const phaseConfig: Record<LunaPhase, { label: string; dotClass: string }> = {
  idle: {
    label: 'En línea',
    dotClass: 'bg-green-400',
  },
  debating: {
    label: 'está analizando tu situación',
    dotClass: 'bg-amber-400 animate-pulse',
  },
  synthesizing: {
    label: 'está preparando la mejor respuesta',
    dotClass: 'bg-blue-400 animate-pulse',
  },
};

export default function LunaStatus({
  phase = 'idle',
  name = 'Luna',
}: LunaStatusProps) {
  const [displayPhase, setDisplayPhase] = useState<LunaPhase>(phase);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (phase === displayPhase) return;

    // Fade out, swap text, fade in
    setTransitioning(true);
    const timeout = setTimeout(() => {
      setDisplayPhase(phase);
      setTransitioning(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [phase, displayPhase]);

  const config = phaseConfig[displayPhase];
  const isActive = displayPhase !== 'idle';

  return (
    <div className="flex items-center gap-2 min-w-0">
      {/* Status dot */}
      <span
        className={`inline-block w-2 h-2 rounded-full shrink-0 transition-colors duration-300 ${config.dotClass}`}
      />

      {/* Label */}
      <span
        className={`text-xs truncate transition-opacity duration-200 ${
          transitioning ? 'opacity-0' : 'opacity-100'
        } ${isActive ? 'text-slate-400' : 'text-slate-500'}`}
      >
        {isActive ? (
          <>
            <span className="font-medium text-slate-300">{name}</span>{' '}
            {config.label}
            <span className="inline-flex ml-0.5">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </>
        ) : (
          <>
            <span className="font-medium text-slate-300">{name}</span>
            {' · '}
            {config.label}
          </>
        )}
      </span>
    </div>
  );
}
