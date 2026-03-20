'use client';

export default function UseCases() {
  const cases = [
    {
      title: 'Escuelas y Academias',
      description:
        'Cierra matriculas automaticamente. La IA resuelve dudas de padres y alumnos, compara programas y convierte consultas en inscripciones.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342"
          />
        </svg>
      ),
      stat: '+35% matriculas',
    },
    {
      title: 'Franquicias',
      description:
        'Califica inversores y cierra contratos de franquicia. La IA explica el modelo, la rentabilidad y responde a cada objecion financiera.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 18h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z"
          />
        </svg>
      ),
      stat: '+50% leads cualificados',
    },
    {
      title: 'SaaS y Tech',
      description:
        'Convierte trials en clientes de pago. La IA hace demos personalizadas, compara features vs competencia y cierra upgrades.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
      stat: '+28% conversion',
    },
    {
      title: 'Inmobiliarias',
      description:
        'Gestiona consultas de propiedades 24/7. La IA filtra compradores serios, agenda visitas y presenta ofertas con datos del mercado.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z"
          />
        </svg>
      ),
      stat: '+45% visitas agendadas',
    },
    {
      title: 'Consultorias',
      description:
        'Cierra contratos de servicios profesionales. La IA presenta metodologias, casos de exito y genera propuestas personalizadas al instante.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      ),
      stat: '+60% propuestas aceptadas',
    },
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Casos de uso
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Una IA. Miles de industrias.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            OkDigiCloser se adapta a cualquier negocio que necesite cerrar ventas.
          </p>
        </div>

        {/* Use cases grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((useCase, index) => (
            <div
              key={useCase.title}
              className={`group relative p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 ${
                index >= 3 ? 'lg:col-span-1 sm:col-span-1' : ''
              }`}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 mb-5 group-hover:bg-blue-600/20 transition-colors">
                {useCase.icon}
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{useCase.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{useCase.description}</p>

              {/* Stat badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
                <span className="text-xs font-semibold text-emerald-400">{useCase.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
