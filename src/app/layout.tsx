/**
 * Layout racine de l'application
 * Configure les providers globaux, les fonts et les métadonnées
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// Configuration de la police Inter
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Métadonnées SEO
export const metadata: Metadata = {
  title: {
    default: 'PedigreeApp - Gestion d\'élevage canin',
    template: '%s | PedigreeApp',
  },
  description:
    'Application professionnelle de gestion d\'élevage canin. Gérez vos chiens, portées, pedigrees, clients et finances en un seul endroit.',
  keywords: [
    'élevage canin',
    'pedigree',
    'gestion élevage',
    'chiens',
    'portées',
    'LOF',
    'génétique canine',
    'COI',
  ],
  authors: [{ name: 'PedigreeApp' }],
  creator: 'PedigreeApp',
  publisher: 'PedigreeApp',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://pedigreeapp.com',
    siteName: 'PedigreeApp',
    title: 'PedigreeApp - Gestion d\'élevage canin',
    description:
      'Application professionnelle de gestion d\'élevage canin. Gérez vos chiens, portées, pedigrees, clients et finances.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PedigreeApp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PedigreeApp - Gestion d\'élevage canin',
    description: 'Application professionnelle de gestion d\'élevage canin.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

// Configuration du viewport
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

/**
 * Layout racine
 * Enveloppe toute l'application avec les providers nécessaires
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Provider pour le thème (clair/sombre) */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Provider pour React Query (cache et requêtes) */}
          <QueryProvider>
            {/* Contenu de l'application */}
            {children}
            
            {/* Notifications toast */}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
