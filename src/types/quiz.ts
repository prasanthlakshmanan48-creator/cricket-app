export type QuizDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_DIFFICULT';

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: [string, string, string, string]; // Exactly 4 options
  correctOptionIndex: number; // 0, 1, 2, or 3
  explanation: string;
  difficulty: QuizDifficulty;
  category: string;
  points: number;
  modeTags?: string[]; // e.g. ['LEGENDS', 'FRANCHISE', 'COUNTRY', 'DECADE', 'WOMENS']
}

export interface UserQuestionAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeTakenSeconds: number;
  pointsEarned: number;
}

export interface RoundSummary {
  roundNumber: number; // 1, 2, 3, 4
  roundName: string; // 'Easy', 'Medium', 'Hard', 'Very Difficult'
  difficulty: QuizDifficulty;
  score: number; // out of 12
  totalQuestions: number; // 12
  accuracyPercentage: number;
  totalPoints: number;
}

export interface QuizSessionState {
  currentRound: number; // 1 to 4
  currentQuestionIndex: number; // 0 to 11 (12 questions per round)
  questions: QuizQuestion[]; // 12 questions for current round
  userAnswers: UserQuestionAnswer[];
  score: number;
  streak: number;
  maxStreak: number;
  totalPoints: number;
  isAnswerSubmitted: boolean;
  selectedOptionIndex: number | null;
  roundSummaries: RoundSummary[];
  isRoundCompleted: boolean;
  isQuizFinished: boolean;
}
