import Navbar from '@/components/landing/Navbar';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-28">
        <h1 className="mb-8 text-3xl font-bold">Términos y Condiciones</h1>
        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
          <p>Última actualización: Marzo 2026</p>

          <h2 className="text-xl font-semibold text-white">1. Descripción del servicio</h2>
          <p>OkDigiCloser es una plataforma SaaS B2B que proporciona cerradores de ventas basados en inteligencia artificial. El servicio es operado por OkDigiMax LLC.</p>

          <h2 className="text-xl font-semibold text-white">2. Registro y cuenta</h2>
          <p>Para usar el servicio debes crear una cuenta proporcionando información veraz. Eres responsable de mantener la seguridad de tu cuenta.</p>

          <h2 className="text-xl font-semibold text-white">3. Precios y pagos</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Setup fee: pago único al contratar, no reembolsable una vez configurado el cerrador</li>
            <li>Comisión por cierre: porcentaje sobre cada venta cerrada por la IA, cobrado automáticamente</li>
            <li>Los precios pueden actualizarse con 30 días de preaviso</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">4. Uso aceptable</h2>
          <p>No podrás usar el servicio para actividades ilegales, fraudulentas, spam o cualquier uso que infrinja derechos de terceros.</p>

          <h2 className="text-xl font-semibold text-white">5. IA y resultados</h2>
          <p>Los resultados del cerrador IA son generados automáticamente. OkDigiCloser no garantiza resultados específicos de ventas. El rendimiento depende de la calidad de la configuración y del producto vendido.</p>

          <h2 className="text-xl font-semibold text-white">6. Propiedad intelectual</h2>
          <p>La plataforma, tecnología y marca OkDigiCloser son propiedad de OkDigiMax LLC. El contenido de tu cerrador (producto, argumentarios) sigue siendo tuyo.</p>

          <h2 className="text-xl font-semibold text-white">7. Cancelación</h2>
          <p>Puedes cancelar tu cuenta en cualquier momento. Las comisiones pendientes al momento de cancelación siguen siendo exigibles.</p>

          <h2 className="text-xl font-semibold text-white">8. Limitación de responsabilidad</h2>
          <p>OkDigiMax LLC no será responsable por daños indirectos, pérdida de beneficios o daños consecuentes derivados del uso del servicio.</p>

          <h2 className="text-xl font-semibold text-white">9. Ley aplicable</h2>
          <p>Estos términos se rigen por las leyes del Estado de Florida, Estados Unidos.</p>

          <h2 className="text-xl font-semibold text-white">10. Contacto</h2>
          <p>Para consultas legales: legal@okdigicloser.com</p>
        </div>
      </div>
    </main>
  );
}
