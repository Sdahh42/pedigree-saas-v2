import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
    });

    // Créer l'élevage par défaut avec l'utilisateur comme propriétaire
    const kennel = await prisma.kennel.create({
      data: {
        name: 'Mon élevage',
        ownerId: user.id,
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Compte créé avec succès',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
