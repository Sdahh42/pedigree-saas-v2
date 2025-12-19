import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/health/records - Liste des dossiers de santé
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dogId = searchParams.get('dogId');
    const type = searchParams.get('type');

    const records = await prisma.healthRecord.findMany({
      where: {
        AND: [
          dogId ? { dogId } : {},
          type ? { type: type as any } : {},
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
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching health records:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des dossiers de santé' },
      { status: 500 }
    );
  }
}

// POST /api/health/records - Créer un dossier de santé
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const record = await prisma.healthRecord.create({
      data: {
        dogId: body.dogId,
        type: body.type,
        date: new Date(body.date),
        description: body.description,
        veterinarian: body.veterinarian,
        clinic: body.clinic,
        cost: body.cost ? parseFloat(body.cost) : null,
        nextDueDate: body.nextDueDate ? new Date(body.nextDueDate) : null,
        documents: body.documents,
      },
      include: {
        dog: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating health record:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du dossier de santé' },
      { status: 500 }
    );
  }
}
