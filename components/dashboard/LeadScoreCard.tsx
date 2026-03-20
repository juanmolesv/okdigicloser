interface LeadScoreCardProps {
  score: number;
  temperature: 'cold' | 'warm' | 'hot' | 'ready';
  signals: string[];
  objections: string[];
}

const tempConfig: Record<
  LeadScoreCardProps['temperature'],
  { label: string; color: string; bgColor: string; barColor: string }
> = {
  cold: {
    label: 'Frio',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    barColor: 'bg-blue-500',
  },
  warm: {
    label: 'Tibio',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    barColor: 'bg-yellow-500',
  },
  hot: {
    label: 'Caliente',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    barColor: 'bg-orange-500',
  },
  ready: {
    label: 'Listo',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    barColor: 'bg-green-500',
  },
};

function Thermometer({
  score,
  temperature,
}: {
  score: number;
  temperature: LeadScoreCardProps['temperature'];
}) {
  const config = tempConfig[temperature];
  const clampedScore = Math.min(100, Math.max(0, score));

  return (
    <div className="flex items-center gap-3">
      {/* Score number */}
      <div className="text-center">
        <span className={`text-2xl font-bold ${config.color}`}>
          {clampedScore}
        </span>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">
          Score
        </p>
      </div>

      {/* Vertical gauge */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-3 h-16 rounded-full bg-slate-700 overflow-hidden flex flex-col-reverse">
          <div
            className={`w-full rounded-full transition-all duration-700 ease-out ${config.barColor}`}
            style={{ height: `${clampedScore}%` }}
          />
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}

export default function LeadScoreCard({
  score,
  temperature,
  signals,
  objections,
}: LeadScoreCardProps) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
      <div className="flex items-start gap-3">
        {/* Thermometer */}
        <Thermometer score={score} temperature={temperature} />

        {/* Chips */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Buying signals */}
          {signals.length > 0 && (
            <div>
              <p className="text-[10px] text-green-500 font-semibold uppercase tracking-wider mb-1">
                Senales
              </p>
              <div className="flex flex-wrap gap-1">
                {signals.map((signal, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] text-green-400 truncate max-w-[140px]"
                    title={signal}
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Objections */}
          {objections.length > 0 && (
            <div>
              <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wider mb-1">
                Objeciones
              </p>
              <div className="flex flex-wrap gap-1">
                {objections.map((objection, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] text-red-400 truncate max-w-[140px]"
                    title={objection}
                  >
                    {objection}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {signals.length === 0 && objections.length === 0 && (
            <p className="text-[10px] text-slate-500 italic">
              Sin senales detectadas aun
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
