import { NextRequest, NextResponse } from 'next/server';
import { multiplayerStore } from '@/lib/multiplayer-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { playerId = `p_${Date.now()}`, username = 'Challenger', rating = 1200, action = 'SEARCH' } = body;

    if (action === 'SEARCH') {
      const ticket = multiplayerStore.addToMatchmakingQueue(playerId, username, rating, 'RANKED_1V1');
      const match = multiplayerStore.findMatch(playerId);

      if (match) {
        return NextResponse.json({
          status: 'MATCH_FOUND',
          roomCode: match.code,
          room: match,
        });
      }

      return NextResponse.json({
        status: 'SEARCHING',
        ticket,
      });
    } else if (action === 'POLL') {
      const match = multiplayerStore.findMatch(playerId);
      if (match) {
        return NextResponse.json({
          status: 'MATCH_FOUND',
          roomCode: match.code,
          room: match,
        });
      }
      return NextResponse.json({ status: 'SEARCHING' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error /api/multiplayer/matchmaking:', error);
    return NextResponse.json({ error: 'Matchmaking failed' }, { status: 500 });
  }
}
