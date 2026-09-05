import { NextRequest, NextResponse } from 'next/server';
import { multiplayerStore } from '@/lib/multiplayer-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { roomCode, playerId = `player_${Date.now()}`, username = 'Cricket Fan', countryCode = 'IN' } = body;

    if (!roomCode) {
      return NextResponse.json({ error: 'Room code is required' }, { status: 400 });
    }

    const result = multiplayerStore.joinRoom(roomCode, playerId, username, countryCode);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      room: result.room,
    });
  } catch (error) {
    console.error('API Error /api/multiplayer/rooms/join:', error);
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
  }
}
