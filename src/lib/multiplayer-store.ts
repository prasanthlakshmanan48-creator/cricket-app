import {
  Room,
  RoomPlayer,
  MatchSettings,
  MatchMode,
  MatchmakingTicket,
  EloTier,
  ReactionEmote,
} from '@/types/multiplayer';

// In-memory persistent data store for multiplayer sessions
class MultiplayerStore {
  private rooms: Map<string, Room> = new Map(); // RoomCode -> Room
  private queue: MatchmakingTicket[] = [];
  private playerRooms: Map<string, string> = new Map(); // PlayerId -> RoomCode
  private roomEmotes: Map<string, ReactionEmote[]> = new Map(); // RoomCode -> ReactionEmote[]

  constructor() {
    // Seed initial demo rooms for instant testing
    this.createRoom('user-demo-host', 'Arun Cricket', Matchmode('FRIENDS'), {
      rounds: 5,
      timeLimitSeconds: 60,
      difficulty: 'MEDIUM',
      playerPool: 'Worldwide',
      allowGuests: true,
      scoringMode: 'COMPETITIVE',
    }, 'CRIC-7K4P8X');
  }

  /**
   * Helper to derive Elo Tier from rating
   */
  public getEloTier(rating: number): EloTier {
    if (rating >= 2400) return 'LEGEND';
    if (rating >= 2000) return 'MASTER';
    if (rating >= 1700) return 'DIAMOND';
    if (rating >= 1400) return 'PLATINUM';
    if (rating >= 1200) return 'GOLD';
    if (rating >= 1000) return 'SILVER';
    return 'BRONZE';
  }

  /**
   * Calculate Elo rating change (+24 / -18)
   */
  public calculateEloChange(
    playerRating: number,
    opponentRating: number,
    isWinner: boolean
  ): number {
    const K = 32;
    const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const actual = isWinner ? 1 : 0;
    return Math.round(K * (actual - expected));
  }

  /**
   * Generate 6-character unique room code e.g. CRIC-7K4P
   */
  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'CRIC-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Create a new room with host
   */
  public createRoom(
    hostId: string,
    hostUsername: string,
    mode: MatchMode = 'FRIENDS',
    customSettings?: Partial<MatchSettings>,
    presetCode?: string
  ): Room {
    const code = presetCode || this.generateRoomCode();
    const defaultSettings: MatchSettings = {
      rounds: 5,
      timeLimitSeconds: 60,
      difficulty: 'MEDIUM',
      playerPool: 'Worldwide',
      allowGuests: true,
      scoringMode: 'COMPETITIVE',
      ...customSettings,
    };

    const hostPlayer: RoomPlayer = {
      id: hostId,
      username: hostUsername,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${hostUsername}`,
      countryCode: 'IN',
      isHost: true,
      isReady: true,
      score: 0,
      rating: 1248,
      tier: 'GOLD',
      streak: 0,
      attemptsCount: 0,
      status: 'IDLE',
      connected: true,
    };

    const room: Room = {
      id: `room_${Date.now()}`,
      code,
      hostId,
      mode,
      status: 'LOBBY',
      maxPlayers: 8,
      players: [hostPlayer],
      settings: defaultSettings,
      currentRound: 1,
      totalRounds: defaultSettings.rounds,
      createdAt: Date.now(),
    };

    this.rooms.set(code, room);
    this.playerRooms.set(hostId, code);
    this.roomEmotes.set(code, []);
    return room;
  }

  /**
   * Get room by code
   */
  public getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  /**
   * Join room by code
   */
  public joinRoom(
    code: string,
    playerId: string,
    username: string,
    countryCode: string = 'IN'
  ): { success: boolean; room?: Room; error?: string } {
    const formattedCode = code.toUpperCase();
    const room = this.rooms.get(formattedCode);

    if (!room) {
      return { success: false, error: 'Room not found. Check your 6-character room code.' };
    }

    if (room.players.length >= room.maxPlayers) {
      return { success: false, error: 'Room is full (Maximum 8 players).' };
    }

    const existingPlayer = room.players.find((p) => p.id === playerId);
    if (!existingPlayer) {
      const newPlayer: RoomPlayer = {
        id: playerId,
        username,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        countryCode,
        isHost: false,
        isReady: false,
        score: 0,
        rating: 1180,
        tier: 'SILVER',
        streak: 0,
        attemptsCount: 0,
        status: 'IDLE',
        connected: true,
      };
      room.players.push(newPlayer);
    } else {
      existingPlayer.connected = true;
    }

    this.playerRooms.set(playerId, formattedCode);
    return { success: true, room };
  }

  /**
   * Add player to 1v1 matchmaking queue
   */
  public addToMatchmakingQueue(
    playerId: string,
    username: string,
    rating: number = 1200,
    mode: MatchMode = 'RANKED_1V1'
  ): MatchmakingTicket {
    // Remove existing ticket if any
    this.queue = this.queue.filter((t) => t.playerId !== playerId);

    const ticket: MatchmakingTicket = {
      ticketId: `ticket_${Date.now()}_${playerId}`,
      playerId,
      username,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      rating,
      tier: this.getEloTier(rating),
      countryCode: 'IN',
      mode,
      searchRange: 100,
      joinedAt: Date.now(),
    };

    this.queue.push(ticket);
    return ticket;
  }

  /**
   * Process matchmaking & match compatible 1v1 players
   */
  public findMatch(playerId: string): Room | null {
    const myTicketIndex = this.queue.findIndex((t) => t.playerId === playerId);
    if (myTicketIndex === -1) return null;

    const myTicket = this.queue[myTicketIndex];
    const waitTimeSec = (Date.now() - myTicket.joinedAt) / 1000;

    // Expanding rating search range dynamically
    if (waitTimeSec > 40) myTicket.searchRange = 800;
    else if (waitTimeSec > 20) myTicket.searchRange = 400;
    else if (waitTimeSec > 10) myTicket.searchRange = 200;

    // Find compatible opponent
    const opponentIndex = this.queue.findIndex(
      (t) =>
        t.playerId !== playerId &&
        t.mode === myTicket.mode &&
        Math.abs(t.rating - myTicket.rating) <= myTicket.searchRange
    );

    if (opponentIndex !== -1) {
      const opponent = this.queue[opponentIndex];

      // Remove both from queue
      this.queue = this.queue.filter(
        (t) => t.playerId !== playerId && t.playerId !== opponent.playerId
      );

      // Create 1v1 Ranked Room
      const room = this.createRoom(myTicket.playerId, myTicket.username, myTicket.mode, {
        rounds: 5,
        timeLimitSeconds: 45,
        difficulty: 'MEDIUM',
      });
      room.maxPlayers = 2;
      room.status = 'IN_GAME';

      // Join opponent
      this.joinRoom(room.code, opponent.playerId, opponent.username, opponent.countryCode);
      return room;
    }

    return null;
  }

  /**
   * Dispatch Reaction Emote
   */
  public sendEmote(
    roomCode: string,
    senderId: string,
    senderName: string,
    emoji: ReactionEmote['emoji']
  ): ReactionEmote {
    const emote: ReactionEmote = {
      id: `emote_${Date.now()}_${Math.random()}`,
      senderId,
      senderName,
      emoji,
      timestamp: Date.now(),
    };
    const list = this.roomEmotes.get(roomCode.toUpperCase()) || [];
    list.push(emote);
    if (list.length > 20) list.shift();
    this.roomEmotes.set(roomCode.toUpperCase(), list);
    return emote;
  }

  /**
   * Get emotes for room
   */
  public getEmotes(roomCode: string): ReactionEmote[] {
    return this.roomEmotes.get(roomCode.toUpperCase()) || [];
  }
}

function Matchmode(modeStr: string): MatchMode {
  return modeStr as MatchMode;
}

export const multiplayerStore = new MultiplayerStore();
