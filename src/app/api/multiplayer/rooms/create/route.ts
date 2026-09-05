import { NextRequest, NextResponse } from 'next/server';
import { multiplayerStore } from '@/lib/multiplayer-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { hostId = `host_${Date.now()}`, username = 'Cricket Master', settings, mode = 'FRIENDS' } = body;

    const room = multiplayerStore.createRoom(hostId, username, mode, settings);

    return NextResponse.json({
      success: true,
      roomCode: room.code,
      room,
    });
  } catch (error) {
    console.error('API Error /api/multiplayer/rooms/create:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
