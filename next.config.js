/**
 * Configuration Next.js pour PedigreeApp SaaS
 * 
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Activer le mode strict de React pour détecter les problèmes potentiels
  reactStrictMode: true,

  // Configuration des images externes autorisées
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io', // UploadThing
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth avatars
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub avatars
      },
    ],
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirections
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: true,
      },
    ];
  },

  // Variables d'environnement exposées au client
  env: {
    NEXT_PUBLIC_APP_NAME: 'PedigreeApp',
    NEXT_PUBLIC_APP_VERSION: '2.0.0',
  },

  // Optimisation du build
  experimental: {
    // Optimiser les imports de packages
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Logging en production
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
