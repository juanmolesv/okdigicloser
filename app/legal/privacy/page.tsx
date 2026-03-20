import Navbar from '@/components/landing/Navbar';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-28">
        <h1 className="mb-8 text-3xl font-bold">Política de Privacidad</h1>
        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
          <p>Última actualización: Marzo 2026</p>

          <h2 className="text-xl font-semibold text-white">1. Responsable del tratamiento</h2>
          <p>OkDigiMax LLC, con sede en Florida, Estados Unidos, es responsable del tratamiento de los datos personales recogidos a través de okdigicloser.com.</p>

          <h2 className="text-xl font-semibold text-white">2. Datos que recopilamos</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Datos de registro: email, nombre, teléfono, nombre de empresa</li>
            <li>Datos de uso: conversaciones con el cerrador IA, métricas de cierre</li>
            <li>Datos de pago: procesados por Stripe (no almacenamos datos de tarjeta)</li>
            <li>Datos técnicos: IP, navegador, cookies necesarias</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">3. Finalidad</h2>
          <p>Usamos tus datos para prestar el servicio de cerrador IA, procesar pagos, enviar comunicaciones sobre tu cuenta y mejorar la plataforma.</p>

          <h2 className="text-xl font-semibold text-white">4. Base legal</h2>
          <p>El tratamiento se basa en la ejecución del contrato de servicio y tu consentimiento al registrarte.</p>

          <h2 className="text-xl font-semibold text-white">5. Terceros</h2>
          <p>Compartimos datos con: Supabase (hosting de datos), Stripe (pagos), Anthropic/Google/OpenAI (procesamiento de IA), Vapi (llamadas de voz), Resend (emails).</p>

          <h2 className="text-xl font-semibold text-white">6. Derechos</h2>
          <p>Puedes ejercer tus derechos de acceso, rectificación, supresión y portabilidad escribiendo a privacy@okdigicloser.com.</p>

          <h2 className="text-xl font-semibold text-white">7. Retención</h2>
          <p>Conservamos tus datos mientras mantengas tu cuenta activa y durante el periodo legal requerido tras la cancelación.</p>

          <h2 className="text-xl font-semibold text-white">8. Contacto</h2>
          <p>Para cualquier consulta sobre privacidad: privacy@okdigicloser.com</p>
        </div>
      </div>
    </main>
  );
}
