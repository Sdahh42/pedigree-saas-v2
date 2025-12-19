import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/dogs - Liste des chiens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kennelId = searchParams.get('kennelId');
    const sex = searchParams.get('sex');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Pour la démo, on retourne des données fictives
    // En production, on utiliserait le kennelId de l'utilisateur connecté
    const dogs = [
      {
        id: '1',
        name: 'Luna',
        registeredName: 'Luna du Domaine des Étoiles',
        breed: 'Golden Retriever',
        birthDate: '2022-03-15',
        sex: 'FEMALE',
        color: 'Doré',
        breedingStatus: 'ACTIVE',
        microchip: '250269812345678',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Rex',
        registeredName: 'Rex vom Königsberg',
        breed: 'Berger Allemand',
        birthDate: '2021-06-20',
        sex: 'MALE',
        color: 'Noir et feu',
        breedingStatus: 'ACTIVE',
        microchip: '250269812345679',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Bella',
        registeredName: 'Bella des Jardins Fleuris',
        breed: 'Golden Retriever',
        birthDate: '2023-01-10',
        sex: 'FEMALE',
        color: 'Crème',
        breedingStatus: 'PROSPECT',
        microchip: '250269812345680',
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      dogs,
      pagination: {
        page,
        limit,
        total: dogs.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error('Get dogs error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST /api/dogs - Créer un chien
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      registeredName,
      breed,
      birthDate,
      sex,
      color,
      microchip,
      kennelId,
    } = body;

    // Validation
    if (!name || !breed || !birthDate || !sex) {
      return NextResponse.json(
        { error: 'Nom, race, date de naissance et sexe sont requis' },
        { status: 400 }
      );
    }

    // Pour la démo, on simule la création
    const newDog = {
      id: Date.now().toString(),
      name,
      registeredName,
      breed,
      birthDate,
      sex,
      color,
      microchip,
      breedingStatus: 'PROSPECT',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Chien créé avec succès',
      dog: newDog,
    });
  } catch (error) {
    console.error('Create dog error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
