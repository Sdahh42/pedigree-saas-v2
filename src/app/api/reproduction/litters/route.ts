import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reproduction/litters - Liste des portées
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const litters = await prisma.litter.findMany({
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
        puppies: {
          select: {
            id: true,
            name: true,
            sex: true,
            color: true,
            status: true,
          },
        },
        mating: {
          select: {
            id: true,
            matingDate: true,
          },
        },
      },
      orderBy: { birthDate: 'desc' },
    });

    return NextResponse.json(litters);
  } catch (error) {
    console.error('Error fetching litters:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des portées' },
      { status: 500 }
    );
  }
}

// POST /api/reproduction/litters - Créer une portée
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const litter = await prisma.litter.create({
      data: {
        damId: body.damId,
        sireId: body.sireId,
        matingId: body.matingId,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        expectedDate: body.expectedDate ? new Date(body.expectedDate) : null,
        puppyCount: body.puppyCount || 0,
        maleCount: body.maleCount || 0,
        femaleCount: body.femaleCount || 0,
        status: body.status || 'EXPECTED',
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

    return NextResponse.json(litter, { status: 201 });
  } catch (error) {
    console.error('Error creating litter:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la portée' },
      { status: 500 }
    );
  }
}
