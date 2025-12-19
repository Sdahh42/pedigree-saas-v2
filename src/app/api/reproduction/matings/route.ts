import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reproduction/matings - Liste des accouplements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const matings = await prisma.mating.findMany({
      where: status ? { status: status as any } : {},
      include: {
        dam: {
          select: {
            id: true,
            name: true,
            registeredName: true,
          },
        },
        sire: {
          select: {
            id: true,
            name: true,
            registeredName: true,
          },
        },
        litter: {
          select: {
            id: true,
            birthDate: true,
            puppyCount: true,
          },
        },
      },
      orderBy: { matingDate: 'desc' },
    });

    return NextResponse.json(matings);
  } catch (error) {
    console.error('Error fetching matings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des accouplements' },
      { status: 500 }
    );
  }
}

// POST /api/reproduction/matings - Créer un accouplement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const mating = await prisma.mating.create({
      data: {
        damId: body.damId,
        sireId: body.sireId,
        matingDate: new Date(body.matingDate),
        matingType: body.matingType || 'NATURAL',
        status: body.status || 'PLANNED',
        expectedDueDate: body.expectedDueDate ? new Date(body.expectedDueDate) : null,
        notes: body.notes,
        kennelId: body.kennelId,
      },
      include: {
        dam: {
          select: { id: true, name: true },
        },
        sire: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(mating, { status: 201 });
  } catch (error) {
    console.error('Error creating mating:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'accouplement' },
      { status: 500 }
    );
  }
}
