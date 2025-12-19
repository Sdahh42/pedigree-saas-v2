/**
 * Client Prisma singleton
 * Évite les connexions multiples en développement (hot reload)
 */

import { PrismaClient } from '@prisma/client';

// Déclaration globale pour TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Instance Prisma singleton
 * En développement, réutilise l'instance existante pour éviter
 * d'épuiser les connexions lors du hot reload
 */
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// En développement, stocker l'instance dans global
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
