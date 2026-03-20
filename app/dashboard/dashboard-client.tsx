'use client';

import { useState } from 'react';
import ConversationList from '@/components/dashboard/ConversationList';
import ConversationDetail from '@/components/dashboard/ConversationDetail';
import type { Conversation } from '@/types';

export default function DashboardClient({
  conversations,
}: {
  conversations: Conversation[];
}) {
  const [selected, setSelected] = useState<Conversation | null>(null);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div>
        <h2 className="mb-4 text-xl font-semibold">Conversaciones</h2>
        <ConversationList
          conversations={conversations}
          onSelect={setSelected}
          selectedId={selected?.id}
        />
      </div>
      <div>
        {selected ? (
          <ConversationDetail conversation={selected} />
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
            <p className="text-slate-500">Selecciona una conversación</p>
          </div>
        )}
      </div>
    </div>
  );
}
