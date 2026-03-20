'use client';

import { Conversation } from '@/types';

interface ConversationDetailProps {
  conversation: Conversation;
}

const statusLabels: Record<Conversation['status'], string> = {
  open: 'Abierta',
  closed_won: 'Ganada',
  closed_lost: 'Perdida',
  follow_up: 'Seguimiento',
};

const statusColors: Record<Conversation['status'], string> = {
  open: 'bg-yellow-500/20 text-yellow-400',
  closed_won: 'bg-green-500/20 text-green-400',
  closed_lost: 'bg-red-500/20 text-red-400',
  follow_up: 'bg-blue-500/20 text-blue-400',
};

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ConversationDetail({ conversation }: ConversationDetailProps) {
  const { prospect_name, prospect_email, prospect_phone, channel, status, messages, sale_value, started_at, closed_at, notes } = conversation;

  return (
    <div className="flex flex-col rounded-xl border border-slate-700/50 bg-slate-800/60 overflow-hidden h-full">
      {/* Header - Prospect Info */}
      <div className="border-b border-slate-700/50 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {/* Avatar placeholder */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/30 text-blue-400 text-sm font-bold">
                {(prospect_name || 'P')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white truncate">
                  {prospect_name || 'Prospecto sin nombre'}
                </h2>
                <div className="flex items-center gap-3 mt-0.5">
                  {prospect_email && (
                    <span className="text-xs text-slate-400 truncate">{prospect_email}</span>
                  )}
                  {prospect_phone && (
                    <span className="text-xs text-slate-500">{prospect_phone}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              {channel === 'voice' ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              )}
              {channel === 'voice' ? 'Voz' : 'Chat'}
            </span>
          </div>
        </div>

        {/* Sale value banner for closed_won */}
        {status === 'closed_won' && sale_value != null && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-600/10 border border-green-500/20 px-3 py-2">
            <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-green-400">
              Venta cerrada: ${sale_value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Date info */}
        <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500">
          <span>Inicio: {formatFullDate(started_at)}</span>
          {closed_at && <span>Cierre: {formatFullDate(closed_at)}</span>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 max-h-[500px]">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-10">No hay mensajes en esta conversacion.</p>
        ) : (
          messages.map((msg, idx) => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={idx}
                className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isAssistant
                      ? 'bg-slate-700/60 text-slate-200 rounded-bl-md'
                      : 'bg-blue-600 text-white rounded-br-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.timestamp && (
                    <p className={`mt-1 text-[10px] ${isAssistant ? 'text-slate-500' : 'text-blue-200/60'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notes footer */}
      {notes && (
        <div className="border-t border-slate-700/50 px-5 py-3">
          <p className="text-xs font-medium text-slate-400 mb-1">Notas</p>
          <p className="text-xs text-slate-500 leading-relaxed">{notes}</p>
        </div>
      )}
    </div>
  );
}
