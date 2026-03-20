'use client';

import { useEffect, useState } from 'react';
import ChatInterface from '@/components/closer/ChatInterface';
import UnifiedBadge from '@/components/closer/UnifiedBadge';
import type { Closer } from '@/types';

export default function CloserChat({ closer }: { closer: Closer }) {
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const initConversation = async () => {
      try {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            closer_id: closer.id,
            client_id: closer.client_id,
          }),
        });
        const data = await res.json();
        if (data?.id) {
          setConversationId(data.id);
        }
      } catch (err) {
        console.error('Error creating conversation:', err);
      }
    };

    initConversation();
  }, [closer.id, closer.client_id]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-lg font-semibold text-white">{closer.avatar_name}</h1>
          <p className="text-sm text-slate-400">{closer.product_name}</p>
        </div>
      </header>

      <div className="flex-1">
        {conversationId ? (
          <ChatInterface
            closerId={closer.id}
            conversationId={conversationId}
            welcomeMessage={
              closer.welcome_message ||
              `¡Hola! Soy ${closer.avatar_name}. ¿En qué puedo ayudarte con ${closer.product_name}?`
            }
            vapiAssistantId={closer.vapi_assistant_id}
          />
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>

      <UnifiedBadge />
    </div>
  );
}
