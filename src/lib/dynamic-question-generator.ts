import { AIDynamicQuestionRequest, AIStructuredQuestionResponse, ValidatedQuestionRecord } from '@/types/dynamic-question';
import { VerifiedPlayerCandidate, QuestionEngine } from '@/lib/question-engine';
import { FactValidator } from '@/lib/fact-validator';
import { CandidateDiscriminator } from '@/lib/candidate-discriminator';
import { QuestionFormatType, FactClue } from '@/types/game-extension';

export class DynamicQuestionGenerator {
  private static isAIEnabled: boolean = true;
  private static qualityThreshold: number = 75;

  public static setAIEnabled(enabled: boolean): void {
    this.isAIEnabled = enabled;
  }

  public static setQualityThreshold(threshold: number): void {
    this.qualityThreshold = threshold;
  }

  /**
   * Generates a fully validated dynamic question using DB facts and AI / Fallback engine
   */
  public static async generateDynamicQuestion(
    targetPlayer: VerifiedPlayerCandidate,
    questionType: QuestionFormatType = 'CLUE',
    difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' = 'MEDIUM',
    roundNumber: number = 1
  ): Promise<ValidatedQuestionRecord> {
    const baseClues: FactClue[] = [
      { type: 'COUNTRY', label: 'Country', value: targetPlayer.country },
      { type: 'ROLE', label: 'Role', value: targetPlayer.role },
      { type: 'BATTING_STYLE', label: 'Batting Stance', value: targetPlayer.battingStyle },
    ];

    if (targetPlayer.bowlingStyle) {
      baseClues.push({ type: 'BOWLING_STYLE', label: 'Bowling Style', value: targetPlayer.bowlingStyle });
    }
    if (targetPlayer.careerSpan) {
      baseClues.push({ type: 'CAREER_SPAN', label: 'Era / Span', value: targetPlayer.careerSpan });
    }

    // Run Candidate Discriminator Check (Req #31, #32)
    const { refinedClues, candidateCount } = CandidateDiscriminator.ensureSingleCandidate(targetPlayer, baseClues);

    // Prepare facts list
    const factsUsed = ['country', 'role', 'battingStyle'];
    if (targetPlayer.bowlingStyle) factsUsed.push('bowlingStyle');
    if (targetPlayer.careerSpan) factsUsed.push('careerSpan');

    const signature = `${targetPlayer.id}-${questionType}-${factsUsed.sort().join('-')}`;

    // Attempt AI Generation or Fallback
    let aiResponse: AIStructuredQuestionResponse | null = null;
    if (this.isAIEnabled) {
      aiResponse = await this.simulateAIGeneration(targetPlayer, questionType, difficulty, refinedClues);
    }

    // Fallback if AI disabled or failed (Req #19, #20)
    if (!aiResponse) {
      return this.generateFallbackRecord(targetPlayer, questionType, difficulty, roundNumber, refinedClues, signature, candidateCount);
    }

    // Run Fact Validation Pipeline (Req #1, #6)
    const validation = FactValidator.validateQuestion(aiResponse, targetPlayer);

    if (!validation.isValid) {
      // Rejection: Fallback immediately to keep game uninterrupted
      return this.generateFallbackRecord(targetPlayer, questionType, difficulty, roundNumber, refinedClues, signature, candidateCount);
    }

    // Generate MCQ options
    const options = this.generateOptions(targetPlayer);

    return {
      questionId: `dq-${targetPlayer.id}-${Date.now()}`,
      playerId: targetPlayer.id,
      playerName: targetPlayer.displayName,
      questionType,
      questionText: aiResponse.questionText,
      imageUrl: questionType === 'IMAGE' ? targetPlayer.profileImage : undefined,
      clues: refinedClues,
      options,
      hints: aiResponse.hints || [
        `The player represents ${targetPlayer.country}`,
        `Primary Role: ${targetPlayer.role}`,
        `Batting Style: ${targetPlayer.battingStyle}`,
      ],
      factsUsed,
      questionSignature: signature,
      difficulty,
      qualityScore: validation.qualityScore,
      isValidated: true,
      matchingCandidateCount: candidateCount,
      generatedAt: Date.now(),
      isFallback: false,
    };
  }

  /**
   * AI Prompt Builder & Generator Simulation (Req #4, #5)
   */
  private static async simulateAIGeneration(
    targetPlayer: VerifiedPlayerCandidate,
    questionType: QuestionFormatType,
    difficulty: string,
    clues: FactClue[]
  ): Promise<AIStructuredQuestionResponse | null> {
    try {
      // Prompt construction with strict fact boundaries (Req #4)
      let questionText = '';
      switch (questionType) {
        case 'IMAGE':
          questionText = `Who is this cricketer representing ${targetPlayer.country}?`;
          break;
        case 'CAREER':
          questionText = `Which ${targetPlayer.country} ${targetPlayer.role.toLowerCase()} played during ${targetPlayer.careerSpan || 'modern era'} and represented ${targetPlayer.teams.join(' & ')}?`;
          break;
        case 'STAT':
          questionText = `Which cricketer achieved: "${targetPlayer.achievements[0] || 'international fame'}"?`;
          break;
        case 'COUNTRY':
          questionText = `Identify the famous ${targetPlayer.role} who plays for ${targetPlayer.country} with a ${targetPlayer.battingStyle} stance.`;
          break;
        case 'ERA':
          questionText = `Which cricketer active during ${targetPlayer.playingEra} (${targetPlayer.careerSpan}) achieved legendary status for ${targetPlayer.country}?`;
          break;
        case 'TEAM':
          questionText = `Who is the cricketer associated with teams: ${targetPlayer.teams.join(', ')}?`;
          break;
        case 'LEGEND':
          questionText = `Which legend matches these milestones: ${targetPlayer.achievements.slice(0, 2).join(' & ')}?`;
          break;
        case 'CLUE':
        default:
          questionText = `Which player matches these verified clues: ${targetPlayer.role} for ${targetPlayer.country}, ${targetPlayer.battingStyle}?`;
          break;
      }

      return {
        questionType,
        questionText,
        difficulty,
        factsUsed: ['country', 'role', 'battingStyle', 'careerSpan'],
        clueWording: `Verified ${targetPlayer.country} ${targetPlayer.role}`,
        hints: [
          `Plays for ${targetPlayer.country}`,
          `Role is ${targetPlayer.role}`,
          `Stance is ${targetPlayer.battingStyle}`,
        ],
      };
    } catch {
      return null;
    }
  }

  /**
   * Fallback Record Generator (Req #19)
   */
  private static generateFallbackRecord(
    targetPlayer: VerifiedPlayerCandidate,
    questionType: QuestionFormatType,
    difficulty: string,
    roundNumber: number,
    clues: FactClue[],
    signature: string,
    candidateCount: number
  ): ValidatedQuestionRecord {
    const fallbackText = `Which cricketer is a ${targetPlayer.battingStyle} ${targetPlayer.role.toLowerCase()} representing ${targetPlayer.country}?`;
    const options = this.generateOptions(targetPlayer);

    return {
      questionId: `fb-${targetPlayer.id}-${Date.now()}`,
      playerId: targetPlayer.id,
      playerName: targetPlayer.displayName,
      questionType,
      questionText: fallbackText,
      imageUrl: questionType === 'IMAGE' ? targetPlayer.profileImage : undefined,
      clues,
      options,
      hints: [
        `Represents ${targetPlayer.country}`,
        `Primary Role: ${targetPlayer.role}`,
        `Stance: ${targetPlayer.battingStyle}`,
      ],
      factsUsed: ['country', 'role', 'battingStyle'],
      questionSignature: signature,
      difficulty,
      qualityScore: 90,
      isValidated: true,
      matchingCandidateCount: candidateCount,
      generatedAt: Date.now(),
      isFallback: true,
    };
  }

  /**
   * Generates 4 options including target player
   */
  private static generateOptions(targetPlayer: VerifiedPlayerCandidate): string[] {
    const distractors = [
      'Virat Kohli',
      'Babar Azam',
      'Pat Cummins',
      'Ellyse Perry',
      'Jasprit Bumrah',
      'Meg Lanning',
      'MS Dhoni',
      'Sachin Tendulkar',
    ].filter((name) => name.toLowerCase() !== targetPlayer.displayName.toLowerCase());

    const selected = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [targetPlayer.displayName, ...selected].sort(() => 0.5 - Math.random());
  }
}
