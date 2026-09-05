import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchPlayers } from '@/lib/search-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    // Fetch players with aliases
    const players = await prisma.player.findMany({
      take: 200,
      include: {
        aliases: true,
      },
    });

    const searchableData = players.map((p) => ({
      id: p.id,
      uuid: p.uuid,
      displayName: p.displayName,
      fullName: p.fullName,
      shortName: p.shortName,
      countryCode: p.countryCode,
      nationality: p.nationality,
      role: p.role,
      playingEra: p.playingEra,
      profileImage: p.profileImage,
      gender: p.gender,
      aliases: p.aliases.map((a) => a.alias),
    }));

    const results = searchPlayers(searchableData, query, 8);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('API Error /api/players/search:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
