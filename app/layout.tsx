import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Laiba Qazi - AI Web Developer & Automation Architect Portfolio',
  description: 'Interactive portfolio of Laiba Qazi, a Full-Stack Developer & Automation Expert specializing in Next.js, Supabase, n8n databases, and PostgreSQL interfaces.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">{children}</body>
    </html>
  );
}
