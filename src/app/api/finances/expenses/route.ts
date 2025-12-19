import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/finances/expenses - Liste des dépenses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const expenses = await prisma.expense.findMany({
      where: {
        AND: [
          category ? { category: category as any } : {},
          startDate ? { date: { gte: new Date(startDate) } } : {},
          endDate ? { date: { lte: new Date(endDate) } } : {},
        ],
      },
      include: {
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
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des dépenses' },
      { status: 500 }
    );
  }
}

// POST /api/finances/expenses - Créer une dépense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const expense = await prisma.expense.create({
      data: {
        description: body.description,
        amount: parseFloat(body.amount),
        date: new Date(body.date),
        category: body.category,
        dogId: body.dogId || null,
        litterId: body.litterId || null,
        receipt: body.receipt,
        notes: body.notes,
        kennelId: body.kennelId,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la dépense' },
      { status: 500 }
    );
  }
}
