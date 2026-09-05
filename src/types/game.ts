export type MatchStatus = 'MATCH' | 'CLOSE' | 'MISMATCH';

export interface AttributeMatch {
  label: string;
  value: string;
  targetDisplayValue?: string;
  status: MatchStatus;
  hintMessage?: string;
}

export interface GuessFeedback {
  guessedPlayerId: string;
  guessedPlayerName: string;
  guessedPlayerCountry: string;
  guessedPlayerFlag: string;
  guessedPlayerImage: string;
  attemptNumber: number;
  isCorrect: boolean;
  attributes: {
    country: AttributeMatch;
    gender: AttributeMatch;
    role: AttributeMatch;
    battingStyle: AttributeMatch;
    bowlingStyle: AttributeMatch;
    playingEra: AttributeMatch;
    debutDecade: AttributeMatch;
    competition: AttributeMatch;
  };
}

export interface GameClue {
  level: number;
  type: 'COUNTRY' | 'GENDER' | 'ROLE' | 'BATTING' | 'BOWLING' | 'ERA' | 'DEBUT' | 'JERSEY' | 'COMPETITION' | 'IMAGE';
  label: string;
  value: string;
  icon: string;
  unlockedAtAttempt: number;
}

export interface PlayerSearchResult {
  id: string;
  uuid: string;
  displayName: string;
  fullName: string;
  shortName: string;
  countryCode: string;
  nationality: string;
  role: string;
  playingEra: string;
  profileImage: string;
  gender: string;
  aliases: string[];
}

export interface GameSessionState {
  sessionId: string;
  mode: string;
  attemptsCount: number;
  maxAttempts: number;
  isCompleted: Boolean;
  isWon: Boolean;
  guesses: GuessFeedback[];
  unlockedClues: GameClue[];
  targetPlayerRevealed?: {
    id: string;
    displayName: string;
    fullName: string;
    countryCode: string;
    nationality: string;
    role: string;
    playingEra: string;
    careerSpan: string;
    profileImage: string;
    statsOverview: {
      format: string;
      matches: number;
      runs: number;
      wickets: number;
      avg: number | null;
    }[];
  };
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  winRate: number;
  avgGuesses: number;
  guessDistribution: Record<number, number>;
}
