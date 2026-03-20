import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OkDigiCloser — Tu Cerrador de Ventas IA',
  description: 'Plataforma B2B de cierre de ventas con IA multi-modelo. Cualquier empresa contrata el servicio, configura su cerrador y la IA cierra por ellos.',
  keywords: 'cerrador ventas IA, sales closer AI, cierre automático, ventas automatizadas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
