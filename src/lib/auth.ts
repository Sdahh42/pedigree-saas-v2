/**
 * Configuration NextAuth.js
 * Gère l'authentification avec credentials et OAuth
 */

import { PrismaAdapter } from '@auth/prisma-adapter';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

/**
 * Configuration NextAuth
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  // Providers d'authentification
  providers: [
    // Authentification par email/mot de passe
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        // Rechercher l'utilisateur
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Email ou mot de passe incorrect');
        }

        // Vérifier le mot de passe
        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error('Email ou mot de passe incorrect');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),

    // Google OAuth (optionnel)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  // Configuration des sessions
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  // Pages personnalisées
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
    newUser: '/onboarding',
  },

  // Callbacks
  callbacks: {
    // Ajouter des infos au JWT
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }

      // Mise à jour de session
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.image = session.image;
      }

      return token;
    },

    // Ajouter des infos à la session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // Events
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        // Créer un élevage par défaut pour les nouveaux utilisateurs
        await prisma.kennel.create({
          data: {
            name: 'Mon élevage',
            ownerId: user.id!,
            subscription: {
              create: {
                plan: 'FREE',
                status: 'ACTIVE',
              },
            },
          },
        });
      }
    },
  },

  // Debug en développement
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Hash un mot de passe
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Vérifie un mot de passe
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
