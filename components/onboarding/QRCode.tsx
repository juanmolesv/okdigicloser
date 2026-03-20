'use client';

import { useState, useRef } from 'react';
import { generateQRCodeURL } from '@/lib/qr/generator';

interface QRCodeProps {
  closerId: string;
}

const COLOR_PRESETS = [
  { label: 'Azul', fg: '#3b82f6', bg: '#0f172a' },
  { label: 'Verde', fg: '#22c55e', bg: '#0f172a' },
  { label: 'Morado', fg: '#a855f7', bg: '#0f172a' },
  { label: 'Blanco', fg: '#ffffff', bg: '#000000' },
  { label: 'Negro', fg: '#000000', bg: '#ffffff' },
];

export default function QRCode({ closerId }: QRCodeProps) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const closerURL = `https://okdigicloser.com/closer/${closerId}`;
  const preset = COLOR_PRESETS[selectedColor];
  const qrImageURL = generateQRCodeURL(closerURL, 400);

  async function handleDownload() {
    setDownloading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = 500;
      const padding = 40;
      const labelHeight = 60;
      canvas.width = size;
      canvas.height = size + labelHeight;

      // Background
      ctx.fillStyle = preset.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load and draw QR image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(
            img,
            padding,
            padding,
            size - padding * 2,
            size - padding * 2
          );
          resolve();
        };
        img.onerror = reject;
        img.src = qrImageURL;
      });

      // Draw label
      ctx.fillStyle = preset.fg;
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Escanea para hablar con tu asesor IA',
        size / 2,
        size + labelHeight / 2 + 4
      );

      // Trigger download
      const link = document.createElement('a');
      link.download = `qr-closer-${closerId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error downloading QR:', err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-slate-100">
            Codigo QR de tu Closer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparte este QR para que tus leads accedan a tu closer IA
          </p>
        </div>

        {/* QR Preview */}
        <div className="flex flex-col items-center px-5 pb-4">
          <div
            className="relative rounded-xl p-6 mb-3 border border-slate-700/50"
            style={{ backgroundColor: preset.bg }}
          >
            <img
              src={qrImageURL}
              alt={`QR Code para closer ${closerId}`}
              className="w-52 h-52"
              crossOrigin="anonymous"
            />
          </div>

          <p
            className="text-sm font-semibold mb-4"
            style={{ color: preset.fg }}
          >
            Escanea para hablar con tu asesor IA
          </p>

          {/* Color presets */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs text-slate-500">Color:</span>
            <div className="flex gap-2">
              {COLOR_PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setSelectedColor(i)}
                  title={p.label}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selectedColor === i
                      ? 'border-blue-500 scale-110'
                      : 'border-slate-600 hover:border-slate-400'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${p.fg} 50%, ${p.bg} 50%)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* URL display */}
          <div className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 mb-4">
            <p className="text-xs text-slate-500 font-mono truncate">
              {closerURL}
            </p>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {downloading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
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
                Generando...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Descargar PNG
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hidden canvas for PNG generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
