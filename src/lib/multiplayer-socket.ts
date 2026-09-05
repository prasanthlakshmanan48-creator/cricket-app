import { Room, ReactionEmote } from '@/types/multiplayer';

export type MultiplayerEvent =
  | { type: 'ROOM_UPDATED'; room: Room }
  | { type: 'PLAYER_JOINED'; username: string }
  | { type: 'PLAYER_LEFT'; username: string }
  | { type: 'MATCH_STARTING'; countdownSeconds: number }
  | { type: 'MATCH_STARTED'; room: Room }
  | { type: 'ROUND_STARTED'; roundNumber: number }
  | { type: 'FIRST_GUESS_BONUS'; username: string; points: number }
  | { type: 'EMOTE_RECEIVED'; emote: ReactionEmote };

type EventListener = (event: MultiplayerEvent) => void;

class MultiplayerClientBus {
  private listeners: Set<EventListener> = new Set();

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: MultiplayerEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
}

export const multiplayerBus = new MultiplayerClientBus();
