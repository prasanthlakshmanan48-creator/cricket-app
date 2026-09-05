import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const p1Id = searchParams.get('p1');
    const p2Id = searchParams.get('p2');

    if (!p1Id || !p2Id) {
      return NextResponse.json({ error: 'Please provide p1 and p2 player IDs' }, { status: 400 });
    }

    const player1 = await prisma.player.findUnique({
      where: { id: p1Id },
      include: { statistics: true, competitions: true },
    });

    const player2 = await prisma.player.findUnique({
      where: { id: p2Id },
      include: { statistics: true, competitions: true },
    });

    if (!player1 || !player2) {
      return NextResponse.json({ error: 'One or both players not found' }, { status: 404 });
    }

    return NextResponse.json({ player1, player2 });
  } catch (error) {
    console.error('API Error /api/players/compare:', error);
    return NextResponse.json({ error: 'Player comparison failed' }, { status: 500 });
  }
}
