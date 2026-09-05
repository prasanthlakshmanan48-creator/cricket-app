export type RoomStatus = 'LOBBY' | 'IN_GAME' | 'ROUND_SUMMARY' | 'FINISHED';
export type PlayerStatus = 'IDLE' | 'GUESSING' | 'CORRECT' | 'WRONG' | 'DISCONNECTED';
export type MatchMode = 'FRIENDS' | 'STRANGERS_1V1' | 'RANKED_1V1' | 'TOURNAMENT' | 'CUSTOM';
export type EloTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER' | 'LEGEND';

export interface MatchSettings {
  rounds: number; // 3, 5, 8
  timeLimitSeconds: number; // 30, 45, 60
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  playerPool: string; // 'Worldwide', 'International', 'IPL', 'Legends', 'Womens', 'Country'
  allowGuests: boolean;
  scoringMode: 'COMPETITIVE' | 'CASUAL';
}

export interface RoomPlayer {
  id: string;
  username: string;
  avatar: string;
  countryCode: string;
  isHost: boolean;
  isReady: boolean;
  score: number;
  rating: number;
  tier: EloTier;
  streak: number;
  attemptsCount: number;
  status: PlayerStatus;
  lastResponseTimeSeconds?: number;
  connected: boolean;
}

export interface Room {
  id: string;
  code: string; // e.g. "CRIC-7K4P8X"
  hostId: string;
  mode: MatchMode;
  status: RoomStatus;
  maxPlayers: number; // 2 to 8
  players: RoomPlayer[];
  settings: MatchSettings;
  currentRound: number;
  totalRounds: number;
  roundStartTime?: number;
  roundEndTime?: number;
  targetPlayerId?: string;
  firstCorrectPlayerId?: string;
  winnerPlayerId?: string;
  createdAt: number;
}

export interface MatchmakingTicket {
  ticketId: string;
  playerId: string;
  username: string;
  avatar: string;
  rating: number;
  tier: EloTier;
  countryCode: string;
  mode: MatchMode;
  searchRange: number; // e.g. 100, 200, 400
  joinedAt: number;
}

export interface MatchFoundPayload {
  matchId: string;
  roomCode: string;
  opponent: {
    id: string;
    username: string;
    avatar: string;
    rating: number;
    tier: EloTier;
    countryCode: string;
    winRate: number;
    streak: number;
  };
  countdownSeconds: number;
}

export interface ReactionEmote {
  id: string;
  senderId: string;
  senderName: string;
  emoji: '🔥' | '👏' | '😂' | '😮' | '🏏' | '💯';
  timestamp: number;
}
