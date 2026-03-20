'use client';

import { Conversation } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
  selectedId?: string;
}

const statusConfig: Record<Conversation['status'], { label: string; classes: string }> = {
  open: { label: 'Abierta', classes: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  closed_won: { label: 'Ganada', classes: 'bg-green-500/20 text-green-400 border-green-500/30' },
  closed_lost: { label: 'Perdida', classes: 'bg-red-500/20 text-red-400 border-red-500/30' },
  follow_up: { label: 'Seguimiento', classes: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
};

function ChannelIcon({ channel }: { channel: Conversation['channel'] }) {
  if (channel === 'voice') {
    return (
      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ConversationList({ conversations, onSelect, selectedId }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/60 p-10 text-center">
        <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-slate-400 text-sm">No hay conversaciones todavia.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300">Conversaciones</h3>
      </div>
      <ul className="divide-y divide-slate-700/40 max-h-[600px] overflow-y-auto">
        {conversations.map((conv) => {
          const status = statusConfig[conv.status];
          const isSelected = conv.id === selectedId;

          return (
            <li key={conv.id}>
              <button
                onClick={() => onSelect(conv)}
                className={`w-full text-left px-5 py-4 transition-colors hover:bg-slate-700/40 focus:outline-none focus:bg-slate-700/40 ${
                  isSelected ? 'bg-slate-700/50 border-l-2 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {conv.prospect_name || 'Prospecto sin nombre'}
                      </p>
                      <ChannelIcon channel={conv.channel} />
                    </div>
                    {conv.prospect_email && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{conv.prospect_email}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${status.classes}`}
                    >
                      {status.label}
                    </span>
                    <span className="text-[11px] text-slate-500">{formatDate(conv.started_at)}</span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
