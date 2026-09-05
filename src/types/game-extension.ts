export type GameModeType = 'SOLO' | 'FRIENDS' | 'STRANGERS' | 'AI';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export type QuestionFormatType = 
  | 'IMAGE'
  | 'CLUE'
  | 'CAREER'
  | 'STAT'
  | 'COUNTRY'
  | 'ERA'
  | 'TEAM'
  | 'LEGEND';

export type PresenceStatus = 'ONLINE' | 'SEARCHING' | 'IN_LOBBY' | 'IN_GAME' | 'OFFLINE';

export interface PresenceUser {
  socketId: string;
  userId?: string;
  username: string;
  avatar?: string;
  status: PresenceStatus;
  joinedAt: number;
  lastActiveAt: number;
}

export interface FactClue {
  type: 'COUNTRY' | 'ROLE' | 'BATTING_STYLE' | 'BOWLING_STYLE' | 'DEBUT_DECADE' | 'TEAM' | 'CAREER_SPAN' | 'STATISTIC';
  label: string;
  value: string;
}

export interface ClientQuestionPayload {
  questionId: string;
  roundNumber: number;
  questionType: QuestionFormatType;
  questionText: string;
  imageUrl?: string;
  clues: FactClue[];
  options?: string[]; // Optional for MCQ format
  questionStartedAt: number; // Server timestamp (ms)
  questionEndsAt: number;    // Server timestamp (ms)
  timerSeconds: number;
}

export interface HintChoice {
  id: string;
  type: string;
  label: string;
  value: string;
  pointPenalty: number;
  timePenaltySeconds: number;
}

export interface AIOpponentState {
  name: string;
  avatar: string;
  difficulty: AIDifficulty;
  thinkingDelayMs: number;
  isThinking: boolean;
  score: number;
  correctAnswers: number;
  guesses: number;
  lastGuess?: string;
  lastGuessCorrect?: boolean;
}

export interface MatchSummaryPlayer {
  id: string;
  username: string;
  avatar?: string;
  isAI?: boolean;
  score: number;
  correctAnswers: number;
  avgResponseTimeSeconds: number;
  hintsUsed: number;
}

export interface GameSessionQuestionQueue {
  sessionId: string;
  usedPlayerIds: Set<string>;
  usedQuestionKeys: Set<string>;
  questions: ClientQuestionPayload[];
  currentIndex: number;
}
