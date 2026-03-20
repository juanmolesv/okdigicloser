import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import LunaShowcase from '@/components/landing/LunaShowcase';
import UseCases from '@/components/landing/UseCases';
import Pricing from '@/components/landing/Pricing';
import CTA from '@/components/landing/CTA';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <LunaShowcase />
      <div id="use-cases">
        <UseCases />
      </div>
      <Pricing />
      <CTA />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <p className="text-lg font-bold text-white">
                OkDigi<span className="text-blue-500">Closer</span>
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Powered by Luna IA — tu cerrador de ventas inteligente.
              </p>
              <p className="mt-1 text-xs text-slate-500">OkDigiMax LLC — Florida, USA</p>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-300">Producto</p>
              <div className="flex flex-col gap-2">
                <Link href="/#how-it-works" className="text-sm text-slate-400 hover:text-white">Cómo funciona</Link>
                <Link href="/pricing" className="text-sm text-slate-400 hover:text-white">Precios</Link>
                <Link href="/#use-cases" className="text-sm text-slate-400 hover:text-white">Casos de uso</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-300">Cuenta</p>
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" className="text-sm text-slate-400 hover:text-white">Iniciar sesión</Link>
                <Link href="/auth/register" className="text-sm text-slate-400 hover:text-white">Registrarse</Link>
                <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">Dashboard</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-300">Legal</p>
              <div className="flex flex-col gap-2">
                <Link href="/legal/privacy" className="text-sm text-slate-400 hover:text-white">Privacidad</Link>
                <Link href="/legal/terms" className="text-sm text-slate-400 hover:text-white">Términos</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} OkDigiMax LLC. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}
