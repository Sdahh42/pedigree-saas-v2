import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reproduction/heats - Liste des chaleurs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dogId = searchParams.get('dogId');
    const status = searchParams.get('status');

    const heats = await prisma.heat.findMany({
      where: {
        AND: [
          dogId ? { dogId } : {},
          status ? { status: status as any } : {},
        ],
      },
      include: {
        dog: {
          select: {
            id: true,
            name: true,
            registeredName: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json(heats);
  } catch (error) {
    console.error('Error fetching heats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des chaleurs' },
      { status: 500 }
    );
  }
}

// POST /api/reproduction/heats - Créer une chaleur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const heat = await prisma.heat.create({
      data: {
        dogId: body.dogId,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: body.status || 'IN_PROGRESS',
        intensity: body.intensity,
        symptoms: body.symptoms,
        notes: body.notes,
      },
      include: {
        dog: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(heat, { status: 201 });
  } catch (error) {
    console.error('Error creating heat:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la chaleur' },
      { status: 500 }
    );
  }
}
