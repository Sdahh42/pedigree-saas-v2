/**
 * Provider pour React Query
 * Gère le cache et la synchronisation des données serveur
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * Provider React Query avec configuration optimisée
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Créer le client une seule fois par instance du provider
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Durée de cache par défaut: 5 minutes
            staleTime: 5 * 60 * 1000,
            // Garder les données en cache 10 minutes après qu'elles soient inutilisées
            gcTime: 10 * 60 * 1000,
            // Retry automatique en cas d'erreur
            retry: 1,
            // Refetch au focus de la fenêtre
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Retry pour les mutations
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools uniquement en développement */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
