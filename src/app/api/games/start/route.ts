import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCluesForAttempt } from '@/lib/game-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const mode = body.mode || 'DAILY';

    let targetPlayer: any = null;

    if (mode === 'DAILY') {
      // Find today's daily challenge (2026-09-05)
      const daily = await prisma.dailyChallenge.findFirst({
        where: { challengeDate: '2026-09-05' },
        include: { player: { include: { competitions: true, statistics: true } } },
      });
      if (daily) {
        targetPlayer = daily.player;
      }
    }

    // Fallback or modes like PRACTICE, LEGENDS, FRANCHISE, WOMENS
    if (!targetPlayer) {
      const whereClause: any = {};
      if (mode === 'LEGENDS') {
        whereClause.isRetired = true;
      } else if (mode === 'WOMENS') {
        whereClause.gender = 'FEMALE';
      } else if (mode === 'FRANCHISE') {
        whereClause.competitions = { some: { competition: { in: ['IPL', 'BBL', 'PSL', 'WPL', 'CPL'] } } };
      }

      const count = await prisma.player.count({ where: whereClause });
      const skip = Math.floor(Math.random() * (count > 0 ? count : 1));
      targetPlayer = await prisma.player.findFirst({
        where: whereClause,
        skip,
        include: { competitions: true, statistics: true },
      });
    }

    if (!targetPlayer) {
      // General fallback
      targetPlayer = await prisma.player.findFirst({
        include: { competitions: true, statistics: true },
      });
    }

    // Create Game Session record
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const session = await prisma.gameSession.create({
      data: {
        sessionToken,
        mode,
        targetPlayerId: targetPlayer.id,
        attemptsCount: 0,
        maxAttempts: 8,
      },
    });

    // Return sanitized target info (only profile image for image reveal!)
    const initialClues = generateCluesForAttempt(targetPlayer, 1);

    return NextResponse.json({
      sessionId: session.id,
      mode,
      targetPlayer: {
        id: targetPlayer.id,
        profileImage: targetPlayer.profileImage,
        statsOverview: targetPlayer.statistics?.map((st: any) => ({
          format: st.format,
          matches: st.matches,
          runs: st.runs,
          wickets: st.wickets,
          avg: st.battingAvg,
        })),
      },
      clues: initialClues,
    });
  } catch (error) {
    console.error('API Error /api/games/start:', error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}
