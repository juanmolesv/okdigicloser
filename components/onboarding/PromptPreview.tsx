'use client';

export interface CloserConfig {
  company_name: string;
  product_name: string;
  product_description: string;
  product_price: string;
  product_benefits: string;
  common_objections: string;
  closing_goal: string;
  closing_action: string;
  tone: string;
  avatar_name: string;
}

interface PromptPreviewProps {
  closerConfig: CloserConfig;
}

function toneToGreeting(tone: string, avatarName: string): string {
  switch (tone) {
    case 'Cercano y amigable':
      return `Hola! Soy ${avatarName}, encantado/a de hablar contigo. Estoy aqui para ayudarte a resolver cualquier duda que tengas.`;
    case 'Urgente':
      return `Hola, soy ${avatarName}. Tengo algo importante que compartir contigo y no quiero que pierdas esta oportunidad.`;
    case 'Consultivo':
      return `Hola, soy ${avatarName}. Me gustaria entender mejor tu situacion para poder ofrecerte la mejor solucion posible.`;
    default:
      return `Buenos dias, soy ${avatarName}. Estoy aqui para presentarte una solucion que puede transformar tu negocio.`;
  }
}

export default function PromptPreview({ closerConfig }: PromptPreviewProps) {
  const {
    product_name,
    product_price,
    closing_goal,
    closing_action,
    tone,
    avatar_name,
  } = closerConfig;

  const greeting = toneToGreeting(tone, avatar_name || 'tu closer');

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">
        Vista previa de tu closer
      </h3>

      {/* Chat-style preview card */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/60 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-700 bg-slate-800">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {(avatar_name || 'C').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">
              {avatar_name || 'Closer'}
            </p>
            <p className="text-xs text-green-400">En linea</p>
          </div>
        </div>

        {/* Chat bubble */}
        <div className="p-5 space-y-4">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-700 px-4 py-3">
            <p className="text-sm text-slate-200 leading-relaxed">
              {greeting}
            </p>
          </div>
        </div>

        {/* Config summary */}
        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 gap-3">
            <InfoBadge label="Producto" value={product_name} />
            <InfoBadge label="Precio" value={product_price} />
            <InfoBadge label="Tono" value={tone} />
            <InfoBadge label="Accion" value={closing_action} />
          </div>

          {closing_goal && (
            <div className="mt-3 rounded-lg bg-slate-800 border border-slate-700 px-4 py-3">
              <p className="text-xs text-slate-500 mb-1">Objetivo de cierre</p>
              <p className="text-sm text-slate-300">{closing_goal}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 font-medium truncate">
        {value || '---'}
      </p>
    </div>
  );
}
