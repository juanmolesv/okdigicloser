'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-white">
          OkDigi<span className="text-blue-500">Closer</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/#how-it-works" className="text-sm text-slate-400 hover:text-white">
            Cómo funciona
          </Link>
          <Link href="/#use-cases" className="text-sm text-slate-400 hover:text-white">
            Casos de uso
          </Link>
          <Link href="/pricing" className="text-sm text-slate-400 hover:text-white">
            Precios
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-slate-300 hover:text-white"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Empezar gratis
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-400 hover:text-white md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/#how-it-works" className="text-sm text-slate-400" onClick={() => setMobileOpen(false)}>
              Cómo funciona
            </Link>
            <Link href="/#use-cases" className="text-sm text-slate-400" onClick={() => setMobileOpen(false)}>
              Casos de uso
            </Link>
            <Link href="/pricing" className="text-sm text-slate-400" onClick={() => setMobileOpen(false)}>
              Precios
            </Link>
            <Link href="/auth/login" className="text-sm text-slate-300" onClick={() => setMobileOpen(false)}>
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
