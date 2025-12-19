import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/clients - Liste des clients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';

    const clients = await prisma.client.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
            ],
          } : {},
          type ? { clientType: type as any } : {},
        ],
      },
      include: {
        sales: {
          select: { id: true, totalAmount: true },
        },
        waitingListEntries: {
          where: { status: 'WAITING' },
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clients' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Créer un client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const client = await prisma.client.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country || 'FR',
        clientType: body.clientType || 'BUYER',
        notes: body.notes,
        kennelId: body.kennelId,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    );
  }
}
