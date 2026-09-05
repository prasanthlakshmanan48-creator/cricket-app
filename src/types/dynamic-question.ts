import { QuestionFormatType, FactClue } from '@/types/game-extension';

export interface AIDynamicQuestionRequest {
  targetPlayerId: string;
  targetPlayerName: string;
  verifiedFacts: {
    country: string;
    role: string;
    battingStyle: string;
    bowlingStyle?: string;
    debutYear?: string;
    playingEra?: string;
    careerSpan?: string;
    teams?: string[];
    achievements?: string[];
  };
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  questionType: QuestionFormatType;
  excludeSignatures?: string[];
}

export interface AIStructuredQuestionResponse {
  questionType: QuestionFormatType;
  questionText: string;
  difficulty: string;
  factsUsed: string[];
  hints: string[];
  clueWording: string;
}

export interface FactValidationResult {
  isValid: boolean;
  qualityScore: number; // 0 to 100
  matchedFactsCount: number;
  unverifiedClaims: string[];
  matchingCandidateCount: number; // Number of DB players matching these clues
  rejectionReason?: string;
}

export interface ValidatedQuestionRecord {
  questionId: string;
  playerId: string;
  playerName: string;
  questionType: QuestionFormatType;
  questionText: string;
  imageUrl?: string;
  clues: FactClue[];
  options: string[];
  hints: string[];
  factsUsed: string[];
  questionSignature: string;
  difficulty: string;
  qualityScore: number;
  isValidated: boolean;
  matchingCandidateCount: number;
  generatedAt: number;
  usedAt?: number;
  gameSessionId?: string;
  userId?: string;
  isFallback?: boolean;
}

export interface AdminAISettings {
  aiQuestionGenerationEnabled: boolean;
  aiModel: string;
  qualityThreshold: number; // default 80
  generationBatchSize: number; // default 5
  maxRetries: number; // default 3
  fallbackMode: 'TEMPLATES' | 'STATIC_POOL';
}
