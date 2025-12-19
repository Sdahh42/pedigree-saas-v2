import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/dogs/[id] - Récupérer un chien par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dog = await prisma.dog.findUnique({
      where: { id: params.id },
      include: {
        sire: {
          select: {
            id: true,
            name: true,
            registeredName: true,
          },
        },
        dam: {
          select: {
            id: true,
            name: true,
            registeredName: true,
          },
        },
        photos: true,
        healthRecords: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        geneticTests: {
          orderBy: { testDate: 'desc' },
        },
        heats: {
          orderBy: { startDate: 'desc' },
          take: 5,
        },
        littersAsDam: {
          include: {
            sire: {
              select: { id: true, name: true },
            },
            puppies: {
              select: { id: true, name: true, sex: true, status: true },
            },
          },
          orderBy: { birthDate: 'desc' },
        },
        littersAsSire: {
          include: {
            dam: {
              select: { id: true, name: true },
            },
            puppies: {
              select: { id: true, name: true, sex: true, status: true },
            },
          },
          orderBy: { birthDate: 'desc' },
        },
      },
    });

    if (!dog) {
      return NextResponse.json(
        { error: 'Chien non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(dog);
  } catch (error) {
    console.error('Error fetching dog:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du chien' },
      { status: 500 }
    );
  }
}

// PUT /api/dogs/[id] - Mettre à jour un chien
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const dog = await prisma.dog.update({
      where: { id: params.id },
      data: {
        name: body.name,
        registeredName: body.registeredName,
        breed: body.breed,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        sex: body.sex,
        color: body.color,
        coatType: body.coatType,
        microchip: body.microchip,
        tattoo: body.tattoo,
        registrationNumber: body.registrationNumber,
        breedingStatus: body.breedingStatus,
        healthStatus: body.healthStatus,
        presenceStatus: body.presenceStatus,
        weight: body.weight ? parseFloat(body.weight) : null,
        height: body.height ? parseFloat(body.height) : null,
        titles: body.titles,
        cotation: body.cotation,
        temperament: body.temperament,
        notes: body.notes,
        sireId: body.sireId || null,
        damId: body.damId || null,
      },
    });

    return NextResponse.json(dog);
  } catch (error) {
    console.error('Error updating dog:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du chien' },
      { status: 500 }
    );
  }
}

// DELETE /api/dogs/[id] - Supprimer un chien
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.dog.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dog:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du chien' },
      { status: 500 }
    );
  }
}
