import type { Metadata } from 'next';
import { Hanken_Grotesk, Libre_Caslon_Text } from 'next/font/google';
import './globals.css';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
});

const libreCaslon = Libre_Caslon_Text({
  subsets: ['latin'],
  variable: '--font-libre-caslon',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'El País Más Rapero',
  description: 'Cartografía visual del rap chileno: artistas, discos, ciudades, eras y colaboraciones.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${hankenGrotesk.variable} ${libreCaslon.variable}`}>{children}</body>
    </html>
  );
}
