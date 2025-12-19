/**
 * Provider pour le thème (clair/sombre)
 * Utilise next-themes pour la gestion du thème
 */

'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

/**
 * Provider de thème qui enveloppe l'application
 * Permet le switch entre mode clair et sombre
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
