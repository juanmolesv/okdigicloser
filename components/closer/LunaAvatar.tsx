'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LUNA_PERSONALITY } from '@/lib/ai/luna';

interface LunaAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
  name?: string;
}

const sizeMap = {
  sm: { px: 32, text: 'text-[10px]' },
  md: { px: 48, text: 'text-xs' },
  lg: { px: 72, text: 'text-sm' },
} as const;

export default function LunaAvatar({
  size = 'md',
  isThinking = false,
  name = LUNA_PERSONALITY.name,
}: LunaAvatarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { px, text } = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Avatar container with glow */}
      <div
        className={`relative rounded-full transition-all duration-700 ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        {/* Pulsing glow ring when thinking */}
        {isThinking && (
          <span
            className="absolute inset-0 rounded-full animate-ping bg-blue-400/30"
            style={{ animationDuration: '1.5s' }}
          />
        )}

        {/* Static subtle glow */}
        <span
          className={`absolute -inset-1 rounded-full transition-opacity duration-500 ${
            isThinking
              ? 'opacity-100 bg-blue-500/25 blur-md'
              : 'opacity-40 bg-blue-500/15 blur-sm'
          }`}
        />

        {/* Avatar image */}
        <Image
          src={LUNA_PERSONALITY.avatar}
          alt={name}
          width={px}
          height={px}
          className="relative z-10 rounded-full"
          priority
        />
      </div>

      {/* Name label */}
      <span
        className={`${text} font-medium text-slate-500 transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}
      >
        {name}
      </span>
    </div>
  );
}
