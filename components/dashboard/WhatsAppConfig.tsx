'use client';

import { useState, useEffect } from 'react';

interface WhatsAppConfigProps {
  closerId: string;
}

interface ConfigState {
  phoneNumberId: string;
  businessAccountId: string;
}

export default function WhatsAppConfig({ closerId }: WhatsAppConfigProps) {
  const [config, setConfig] = useState<ConfigState>({
    phoneNumberId: '',
    businessAccountId: '',
  });
  const [testPhone, setTestPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // URL del webhook que se debe configurar en Meta Developer Portal
  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/webhooks/whatsapp`
      : '';

  // Cargar configuracion existente del closer
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch(`/api/closer?id=${closerId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.whatsapp_phone_number_id) {
            setConfig({
              phoneNumberId: data.whatsapp_phone_number_id || '',
              businessAccountId: data.whatsapp_business_account_id || '',
            });
            setIsConnected(true);
          }
        }
      } catch {
        // Si falla la carga, simplemente dejamos los campos vacios
      }
    }
    loadConfig();
  }, [closerId]);

  // Guardar la configuracion de WhatsApp en el closer
  async function handleSave() {
    setStatus('saving');
    setMessage('');

    try {
      const res = await fetch('/api/closer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: closerId,
          whatsapp_phone_number_id: config.phoneNumberId,
          whatsapp_business_account_id: config.businessAccountId,
        }),
      });

      if (!res.ok) throw new Error('Error al guardar');

      setIsConnected(!!config.phoneNumberId);
      setStatus('success');
      setMessage('Configuracion guardada correctamente');
    } catch {
      setStatus('error');
      setMessage('Error al guardar la configuracion');
    }
  }

  // Enviar mensaje de prueba
  async function handleTestMessage() {
    if (!testPhone.trim()) {
      setStatus('error');
      setMessage('Ingresa un numero de telefono para la prueba');
      return;
    }

    setStatus('testing');
    setMessage('');

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testPhone,
          message: 'Hola! Este es un mensaje de prueba de OkDigiCloser. Tu integracion con WhatsApp esta funcionando correctamente.',
          closerId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al enviar');

      setStatus('success');
      setMessage(`Mensaje de prueba enviado exitosamente (ID: ${data.messageId})`);
    } catch (err) {
      setStatus('error');
      setMessage(
        err instanceof Error ? err.message : 'Error al enviar mensaje de prueba'
      );
    }
  }

  // Copiar webhook URL al portapapeles
  async function copyWebhookUrl() {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setMessage('URL del webhook copiada al portapapeles');
      setStatus('success');
    } catch {
      setMessage('No se pudo copiar. Selecciona y copia manualmente.');
      setStatus('error');
    }
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900 p-6 backdrop-blur-sm">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-600/20 p-2">
            <svg
              className="w-6 h-6 text-green-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Integracion WhatsApp Business
            </h3>
            <p className="text-sm text-slate-400">
              Conecta tu numero de WhatsApp Business para cerrar ventas automaticamente
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            isConnected
              ? 'bg-green-600/20 text-green-400'
              : 'bg-slate-700/50 text-slate-400'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isConnected ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
          {isConnected ? 'Conectado' : 'No configurado'}
        </span>
      </div>

      {/* Campos de configuracion */}
      <div className="space-y-4">
        {/* Phone Number ID */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Phone Number ID
          </label>
          <input
            type="text"
            value={config.phoneNumberId}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, phoneNumberId: e.target.value }))
            }
            placeholder="Ej: 123456789012345"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
          />
          <p className="mt-1 text-xs text-slate-500">
            Lo encuentras en Meta Developer Portal &gt; WhatsApp &gt; API Setup
          </p>
        </div>

        {/* WhatsApp Business Account ID */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            WhatsApp Business Account ID
          </label>
          <input
            type="text"
            value={config.businessAccountId}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, businessAccountId: e.target.value }))
            }
            placeholder="Ej: 987654321098765"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
          />
          <p className="mt-1 text-xs text-slate-500">
            ID de tu cuenta de WhatsApp Business en Meta Business Suite
          </p>
        </div>

        {/* Webhook URL (solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Webhook URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={webhookUrl}
              readOnly
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-300 cursor-default focus:outline-none"
            />
            <button
              onClick={copyWebhookUrl}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Copiar URL"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Configura esta URL como Callback URL en Meta Developer Portal &gt; WhatsApp &gt; Configuration
          </p>
        </div>

        {/* Verificacion Token (informativo) */}
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4">
          <p className="text-sm text-slate-300">
            <span className="font-medium text-slate-200">Verify Token:</span>{' '}
            Usa el valor de la variable <code className="rounded bg-slate-700 px-1.5 py-0.5 text-xs text-blue-400">WHATSAPP_VERIFY_TOKEN</code>{' '}
            de tu archivo <code className="rounded bg-slate-700 px-1.5 py-0.5 text-xs text-blue-400">.env.local</code>{' '}
            al configurar el webhook en Meta.
          </p>
        </div>

        {/* Boton guardar */}
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'saving' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Guardando...
            </span>
          ) : (
            'Guardar Configuracion'
          )}
        </button>
      </div>

      {/* Separador */}
      <div className="my-6 border-t border-slate-700/50" />

      {/* Seccion de prueba */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">
          Enviar mensaje de prueba
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="Numero con codigo de pais (ej: 5491155551234)"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
          />
          <button
            onClick={handleTestMessage}
            disabled={status === 'testing' || !isConnected}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'testing' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando...
              </span>
            ) : (
              'Enviar Prueba'
            )}
          </button>
        </div>
        {!isConnected && (
          <p className="mt-1.5 text-xs text-amber-400">
            Guarda la configuracion primero para poder enviar mensajes de prueba.
          </p>
        )}
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            status === 'success'
              ? 'bg-green-600/10 border border-green-600/20 text-green-400'
              : 'bg-red-600/10 border border-red-600/20 text-red-400'
          }`}
        >
          {message}
        </div>
      )}

      {/* Instrucciones de configuracion */}
      <div className="mt-6 rounded-lg border border-slate-700/50 bg-slate-800/40 p-4">
        <h4 className="text-sm font-semibold text-slate-200 mb-2">
          Pasos para configurar
        </h4>
        <ol className="space-y-1.5 text-xs text-slate-400 list-decimal list-inside">
          <li>
            Crea una app en{' '}
            <span className="text-blue-400">developers.facebook.com</span> con el producto WhatsApp
          </li>
          <li>
            En API Setup, copia el <span className="text-slate-300">Phone Number ID</span> y el{' '}
            <span className="text-slate-300">Business Account ID</span>
          </li>
          <li>
            Ve a Configuration y agrega la Webhook URL con tu Verify Token
          </li>
          <li>
            Suscribete al campo <code className="rounded bg-slate-700 px-1 text-blue-400">messages</code>
          </li>
          <li>
            Genera un token permanente en Business Settings &gt; System Users
          </li>
          <li>
            Agrega el token como <code className="rounded bg-slate-700 px-1 text-blue-400">WHATSAPP_API_TOKEN</code> en tu .env.local
          </li>
        </ol>
      </div>
    </div>
  );
}
