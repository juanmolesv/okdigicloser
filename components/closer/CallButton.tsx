'use client';

import { useState } from 'react';
import { startCall, endCall } from '@/lib/vapi/client';

interface CallButtonProps {
  assistantId: string;
  closerContext: Record<string, string>;
}

export default function CallButton({ assistantId, closerContext }: CallButtonProps) {
  const [isOnCall, setIsOnCall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleCall = async () => {
    setIsLoading(true);
    try {
      if (isOnCall) {
        await endCall();
        setIsOnCall(false);
      } else {
        await startCall(assistantId, closerContext);
        setIsOnCall(true);
      }
    } catch (error) {
      console.error('Error en llamada:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleCall}
      disabled={isLoading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
        isOnCall
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-green-500 hover:bg-green-600 text-white'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Phone SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
          clipRule="evenodd"
        />
      </svg>
      {isLoading
        ? 'Conectando...'
        : isOnCall
        ? 'Colgar'
        : 'Llamar ahora'}
    </button>
  );
}
