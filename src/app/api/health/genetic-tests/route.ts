import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/health/genetic-tests - Liste des tests génétiques
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dogId = searchParams.get('dogId');

    const tests = await prisma.geneticTest.findMany({
      where: dogId ? { dogId } : {},
      include: {
        dog: {
          select: {
            id: true,
            name: true,
            registeredName: true,
          },
        },
      },
      orderBy: { testDate: 'desc' },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error('Error fetching genetic tests:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tests génétiques' },
      { status: 500 }
    );
  }
}

// POST /api/health/genetic-tests - Créer un test génétique
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const test = await prisma.geneticTest.create({
      data: {
        dogId: body.dogId,
        testName: body.testName,
        testDate: new Date(body.testDate),
        laboratory: body.laboratory,
        result: body.result,
        resultDate: body.resultDate ? new Date(body.resultDate) : null,
        certificateNumber: body.certificateNumber,
        notes: body.notes,
      },
      include: {
        dog: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error('Error creating genetic test:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du test génétique' },
      { status: 500 }
    );
  }
}
