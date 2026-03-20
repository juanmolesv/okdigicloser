'use client';

import { useState } from 'react';

interface EmbedCodeProps {
  closerId: string;
}

export default function EmbedCode({ closerId }: EmbedCodeProps) {
  const embedScript = `<script src="https://okdigicloser.com/widget.js" data-closer-id="${closerId}" async></script>`;
  const directLink = `okdigicloser.com/closer/${closerId}`;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h3 className="text-lg font-semibold text-slate-100">
        Integra tu closer
      </h3>

      {/* Embed script */}
      <CodeBlock
        label="Codigo embed"
        description="Pega este codigo en tu web, justo antes de cerrar la etiqueta </body>."
        code={embedScript}
      />

      {/* Direct link */}
      <CodeBlock
        label="Enlace directo"
        description="Comparte este enlace para que tus leads hablen con tu closer."
        code={directLink}
      />
    </div>
  );
}

function CodeBlock({
  label,
  description,
  code,
}: {
  label: string;
  description: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/60 overflow-hidden">
      <div className="px-5 pt-4 pb-2">
        <p className="text-sm font-semibold text-slate-100">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>

      <div className="px-5 pb-4">
        <div className="relative group">
          <pre className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-sm text-blue-400 overflow-x-auto font-mono leading-relaxed">
            {code}
          </pre>

          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 flex items-center gap-1.5 rounded-md bg-slate-700 hover:bg-slate-600 active:bg-slate-500 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {copied ? (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copiado
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copiar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
