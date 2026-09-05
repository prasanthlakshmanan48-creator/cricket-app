import { NextRequest, NextResponse } from 'next/server';
import { multiplayerStore } from '@/lib/multiplayer-store';
import { ReactionEmote } from '@/types/multiplayer';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code') || 'CRIC-7K4P8X';

  const room = multiplayerStore.getRoom(code);
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  const emotes = multiplayerStore.getEmotes(code);

  return NextResponse.json({
    room,
    emotes,
    timestamp: Date.now(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, roomCode, senderId, senderName, emoji } = body;

    if (action === 'SEND_EMOTE' && roomCode && emoji) {
      const emote = multiplayerStore.sendEmote(
        roomCode,
        senderId || 'user',
        senderName || 'Player',
        emoji as ReactionEmote['emoji']
      );
      return NextResponse.json({ success: true, emote });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error /api/multiplayer/events:', error);
    return NextResponse.json({ error: 'Failed to process event' }, { status: 500 });
  }
}
