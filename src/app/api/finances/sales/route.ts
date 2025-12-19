import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/finances/sales - Liste des ventes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const sales = await prisma.sale.findMany({
      where: status ? { status: status as any } : {},
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        dog: {
          select: {
            id: true,
            name: true,
          },
        },
        litter: {
          select: {
            id: true,
            dam: { select: { name: true } },
            sire: { select: { name: true } },
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des ventes' },
      { status: 500 }
    );
  }
}

// POST /api/finances/sales - Créer une vente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sale = await prisma.sale.create({
      data: {
        clientId: body.clientId,
        dogId: body.dogId,
        litterId: body.litterId,
        saleDate: new Date(body.saleDate),
        totalAmount: parseFloat(body.totalAmount),
        depositAmount: body.depositAmount ? parseFloat(body.depositAmount) : null,
        balanceAmount: body.balanceAmount ? parseFloat(body.balanceAmount) : null,
        status: body.status || 'PENDING',
        paymentMethod: body.paymentMethod,
        contractSigned: body.contractSigned || false,
        notes: body.notes,
        kennelId: body.kennelId,
      },
      include: {
        client: {
          select: { firstName: true, lastName: true },
        },
        dog: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la vente' },
      { status: 500 }
    );
  }
}
