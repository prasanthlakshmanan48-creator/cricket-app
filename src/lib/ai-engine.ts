import { AIDifficulty, AIOpponentState } from '@/types/game-extension';
import { VerifiedPlayerCandidate, VERIFIED_PLAYER_POOL } from '@/lib/question-engine';

export class AIEngine {
  /**
   * Generates initial state for AI opponent
   */
  public static createAIOpponent(difficulty: AIDifficulty = 'MEDIUM'): AIOpponentState {
    const avatarMap: Record<AIDifficulty, string> = {
      EASY: '🤖',
      MEDIUM: '⚙️',
      HARD: '🧠',
      EXPERT: '⚡',
    };

    return {
      name: `CRICKET AI (${difficulty})`,
      avatar: avatarMap[difficulty] || '🤖',
      difficulty,
      thinkingDelayMs: this.getThinkingDelayMs(difficulty),
      isThinking: false,
      score: 0,
      correctAnswers: 0,
      guesses: 0,
    };
  }

  /**
   * Calculates realistic thinking delay in ms based on difficulty (Req #10)
   * Easy: 8-20s, Medium: 5-15s, Hard: 3-10s, Expert: 1-6s
   */
  public static getThinkingDelayMs(difficulty: AIDifficulty): number {
    let minMs = 5000;
    let maxMs = 15000;

    switch (difficulty) {
      case 'EASY':
        minMs = 8000;
        maxMs = 20000;
        break;
      case 'MEDIUM':
        minMs = 5000;
        maxMs = 15000;
        break;
      case 'HARD':
        minMs = 3000;
        maxMs = 10000;
        break;
      case 'EXPERT':
        minMs = 1000;
        maxMs = 6000;
        break;
    }

    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  }

  /**
   * Simulates AI candidate evaluation and guess selection (Req #8, #9, #44)
   */
  public static makeAIGuess(
    targetPlayer: VerifiedPlayerCandidate,
    options: string[],
    difficulty: AIDifficulty
  ): { guessedName: string; isCorrect: boolean; timeTakenSeconds: number } {
    const thinkingMs = this.getThinkingDelayMs(difficulty);
    const timeTakenSeconds = Math.round((thinkingMs / 1000) * 10) / 10;

    // Accuracy rate per difficulty
    let accuracyProbability = 0.65;
    switch (difficulty) {
      case 'EASY':
        accuracyProbability = 0.40;
        break;
      case 'MEDIUM':
        accuracyProbability = 0.65;
        break;
      case 'HARD':
        accuracyProbability = 0.85;
        break;
      case 'EXPERT':
        accuracyProbability = 0.95;
        break;
    }

    const roll = Math.random();
    let isCorrect = roll < accuracyProbability;

    let guessedName = targetPlayer.displayName;

    if (!isCorrect) {
      // Pick a plausible distractor from options or pool
      const distractors = options.filter(
        (opt) => opt.toLowerCase() !== targetPlayer.displayName.toLowerCase()
      );
      if (distractors.length > 0) {
        guessedName = distractors[Math.floor(Math.random() * distractors.length)];
      } else {
        const poolDistractors = VERIFIED_PLAYER_POOL.filter(
          (p) => p.id !== targetPlayer.id
        );
        guessedName = poolDistractors[Math.floor(Math.random() * poolDistractors.length)].displayName;
      }
    }

    return {
      guessedName,
      isCorrect,
      timeTakenSeconds,
    };
  }

  /**
   * Calculates score for AI guess based on time taken & difficulty
   */
  public static calculateAIScore(
    isCorrect: boolean,
    timeTakenSeconds: number,
    timerSeconds: number = 60
  ): number {
    if (!isCorrect) return 0;
    const basePoints = 500;
    const timeRatio = Math.max(0, (timerSeconds - timeTakenSeconds) / timerSeconds);
    const bonus = Math.round(timeRatio * 500);
    return basePoints + bonus;
  }
}
