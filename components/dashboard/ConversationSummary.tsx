'use client';

import { useState } from 'react';

interface SummaryData {
  summary: string;
  keyTopics: string[];
  prospectNeeds: string[];
  outcome: string;
  followUpRecommendation: string;
}

interface ConversationSummaryProps {
  conversationId: string;
}

export default function ConversationSummary({
  conversationId,
}: ConversationSummaryProps) {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/conversations/${conversationId}/summary`,
        {
          method: 'POST',
        }
      );

      if (!res.ok) {
        throw new Error('Error al generar el resumen');
      }

      const data: SummaryData = await res.json();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  // Initial state: show generate button
  if (!summary && !loading && !error) {
    return (
      <button
        onClick={handleGenerate}
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/60 hover:bg-slate-700/60 px-4 py-3 text-sm font-medium text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        <svg
          className="w-4 h-4 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
        Generar resumen con IA
      </button>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-5">
        <div className="flex items-center gap-3 mb-4">
          <svg
            className="w-4 h-4 text-blue-400 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm text-slate-400">
            Luna esta analizando la conversacion...
          </span>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-700 rounded w-full" />
          <div className="h-4 bg-slate-700 rounded w-3/4" />
          <div className="h-4 bg-slate-700 rounded w-1/2" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
        <div className="flex items-center gap-3">
          <svg
            className="w-4 h-4 text-red-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm text-red-400 flex-1">{error}</p>
          <button
            onClick={handleGenerate}
            className="text-xs text-red-300 hover:text-white underline shrink-0"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Summary display
  if (!summary) return null;

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
          <h4 className="text-sm font-semibold text-slate-100">
            Resumen IA
          </h4>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          title="Regenerar resumen"
          className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors focus:outline-none"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
            />
          </svg>
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Summary text */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {summary.summary}
        </p>

        {/* Key topics */}
        {summary.keyTopics.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Temas clave
            </p>
            <div className="flex flex-wrap gap-1.5">
              {summary.keyTopics.map((topic, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs text-blue-400"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Prospect needs */}
        {summary.prospectNeeds.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Necesidades del prospecto
            </p>
            <div className="flex flex-wrap gap-1.5">
              {summary.prospectNeeds.map((need, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-xs text-purple-400"
                >
                  {need}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Outcome */}
        <div className="rounded-lg bg-slate-900/50 border border-slate-700/30 px-3.5 py-2.5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Resultado
          </p>
          <p className="text-sm text-slate-300">{summary.outcome}</p>
        </div>

        {/* Follow-up recommendation */}
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/15 px-3.5 py-2.5">
          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-1">
            Recomendacion de seguimiento
          </p>
          <p className="text-sm text-slate-300">
            {summary.followUpRecommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
