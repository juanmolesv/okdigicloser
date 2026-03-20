'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Conversation } from '@/types';

interface Stats {
  totalConversations: number;
  openConversations: number;
  closedWon: number;
  closedLost: number;
  totalRevenue: number;
  totalCommission: number;
}

interface AIInsightsData {
  overallAssessment: 'excelente' | 'bueno' | 'mejorable' | 'critico';
  overallSummary: string;
  strengths: string[];
  opportunities: string[];
  recommendations: string[];
  projectedCloseRate: number;
  generatedAt: string;
}

interface AIInsightsProps {
  stats: Stats;
  conversations: Conversation[];
}

const assessmentConfig: Record<
  AIInsightsData['overallAssessment'],
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  excelente: {
    label: 'Excelente',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/20',
    dotColor: 'bg-green-400',
  },
  bueno: {
    label: 'Bueno',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    dotColor: 'bg-blue-400',
  },
  mejorable: {
    label: 'Mejorable',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    dotColor: 'bg-yellow-400',
  },
  critico: {
    label: 'Critico',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    dotColor: 'bg-red-400',
  },
};

function Skeleton() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-48 bg-slate-700 rounded" />
        <div className="h-8 w-8 bg-slate-700 rounded" />
      </div>
      <div className="h-16 w-full bg-slate-700/50 rounded-lg mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="h-28 bg-slate-700/30 rounded-lg" />
        <div className="h-28 bg-slate-700/30 rounded-lg" />
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-slate-700/30 rounded-lg" />
        <div className="h-10 bg-slate-700/30 rounded-lg" />
        <div className="h-10 bg-slate-700/30 rounded-lg" />
      </div>
    </div>
  );
}

function GaugeBar({ value }: { value: number }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const getColor = () => {
    if (clampedValue >= 70) return 'bg-green-500';
    if (clampedValue >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">Tasa de cierre proyectada</span>
        <span className="text-sm font-bold text-white">{clampedValue}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getColor()}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

export default function AIInsights({ stats, conversations }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const recentConversations = conversations.slice(0, 10).map((c) => ({
        id: c.id,
        status: c.status,
        messages: c.messages,
        sale_value: c.sale_value,
        prospect_name: c.prospect_name,
      }));

      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats, recentConversations }),
      });

      if (!res.ok) {
        throw new Error('Error al obtener insights');
      }

      const data: AIInsightsData = await res.json();
      setInsights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [stats, conversations]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-red-400 shrink-0"
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
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchInsights}
            className="ml-auto text-xs text-red-300 hover:text-white underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  const assessment = assessmentConfig[insights.overallAssessment];

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-slate-100">
            Insights de Luna IA
          </h3>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          title="Actualizar insights"
          className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <svg
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
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

      <div className="p-5 space-y-5">
        {/* Overall Assessment */}
        <div className={`rounded-lg border p-4 ${assessment.bgColor}`}>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${assessment.dotColor}`}
            />
            <span className={`text-sm font-bold ${assessment.color}`}>
              {assessment.label}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {insights.overallSummary}
          </p>
        </div>

        {/* Strengths & Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fortalezas */}
          <div>
            <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2.5">
              Fortalezas
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {insights.strengths.length > 0 ? (
                insights.strengths.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-1 text-xs text-green-400"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">
                  Sin datos suficientes
                </span>
              )}
            </div>
          </div>

          {/* Oportunidades */}
          <div>
            <h4 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2.5">
              Oportunidades de Mejora
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {insights.opportunities.length > 0 ? (
                insights.opportunities.map((o, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 text-xs text-yellow-400"
                  >
                    {o}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">
                  Sin datos suficientes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2.5">
            Recomendaciones de Luna
          </h4>
          <div className="space-y-2">
            {insights.recommendations.length > 0 ? (
              insights.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg bg-slate-900/50 border border-slate-700/30 px-3.5 py-2.5"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-[10px] font-bold text-blue-400">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">
                Sin recomendaciones disponibles
              </p>
            )}
          </div>
        </div>

        {/* Projected Close Rate Gauge */}
        <div className="rounded-lg bg-slate-900/50 border border-slate-700/30 p-4">
          <GaugeBar value={insights.projectedCloseRate} />
        </div>

        {/* Generated at */}
        {insights.generatedAt && (
          <p className="text-[11px] text-slate-600 text-right">
            Generado:{' '}
            {new Date(insights.generatedAt).toLocaleString('es-ES', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
}
