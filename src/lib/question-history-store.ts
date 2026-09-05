import { ValidatedQuestionRecord } from '@/types/dynamic-question';
import { ClientQuestionPayload } from '@/types/game-extension';
import { DynamicQuestionGenerator } from '@/lib/dynamic-question-generator';
import { QuestionEngine, VerifiedPlayerCandidate, VERIFIED_PLAYER_POOL } from '@/lib/question-engine';

class QuestionHistoryAndQueueStore {
  private history: Map<string, ValidatedQuestionRecord> = new Map(); // questionId -> record
  private userSeenSignatures: Map<string, Set<string>> = new Map(); // userId/sessionId -> Set<signature>
  private sessionQueues: Map<string, ValidatedQuestionRecord[]> = new Map(); // sessionId -> upcoming queue

  /**
   * Add question record to global history store
   */
  public addRecord(record: ValidatedQuestionRecord, userIdOrSession: string = 'global'): void {
    this.history.set(record.questionId, record);

    let set = this.userSeenSignatures.get(userIdOrSession);
    if (!set) {
      set = new Set();
      this.userSeenSignatures.set(userIdOrSession, set);
    }
    set.add(record.questionSignature);
  }

  /**
   * Check if user/session has seen a question signature
   */
  public hasSeenSignature(userIdOrSession: string, signature: string): boolean {
    const set = this.userSeenSignatures.get(userIdOrSession);
    return set ? set.has(signature) : false;
  }

  /**
   * Pre-generate and enqueue 3-5 upcoming validated questions asynchronously (Req #17, #18)
   */
  public async pregenerateQueue(
    sessionId: string,
    roundNumber: number = 1,
    desiredCount: number = 5
  ): Promise<ValidatedQuestionRecord[]> {
    let queue = this.sessionQueues.get(sessionId);
    if (!queue) {
      queue = [];
      this.sessionQueues.set(sessionId, queue);
    }

    while (queue.length < desiredCount) {
      const targetPlayer = QuestionEngine.selectNextTargetPlayer(sessionId);
      const formats = ['CLUE', 'CAREER', 'STAT', 'COUNTRY', 'ERA', 'TEAM'] as const;
      const format = formats[queue.length % formats.length];

      const record = await DynamicQuestionGenerator.generateDynamicQuestion(
        targetPlayer,
        format,
        'MEDIUM',
        roundNumber
      );

      this.addRecord(record, sessionId);
      queue.push(record);
    }

    return queue;
  }

  /**
   * Pops the next pre-validated question from queue and triggers background pre-generation
   */
  public async popNextQuestion(
    sessionId: string,
    roundNumber: number = 1,
    timerSeconds: number = 60
  ): Promise<{ record: ValidatedQuestionRecord; payload: ClientQuestionPayload }> {
    let queue = this.sessionQueues.get(sessionId);
    if (!queue || queue.length === 0) {
      queue = await this.pregenerateQueue(sessionId, roundNumber, 5);
    }

    const record = queue.shift()!;
    record.usedAt = Date.now();
    record.gameSessionId = sessionId;

    // Trigger background pre-generation of replacement question asynchronously
    this.pregenerateQueue(sessionId, roundNumber, 5).catch(() => {});

    // Convert to sanitized Client payload (strips sensitive answer info per Req #5, #18, #40)
    const now = Date.now();
    const payload: ClientQuestionPayload = {
      questionId: record.questionId,
      roundNumber,
      questionType: record.questionType,
      questionText: record.questionText,
      imageUrl: record.imageUrl,
      clues: record.clues,
      options: record.options,
      questionStartedAt: now,
      questionEndsAt: now + timerSeconds * 1000,
      timerSeconds,
    };

    return { record, payload };
  }

  /**
   * Get all stored records for Admin Review
   */
  public getAllRecords(): ValidatedQuestionRecord[] {
    return Array.from(this.history.values());
  }

  /**
   * Update question record status (for Admin Review actions: APPROVE, REJECT)
   */
  public updateRecordStatus(questionId: string, isValidated: boolean): void {
    const record = this.history.get(questionId);
    if (record) {
      record.isValidated = isValidated;
      this.history.set(questionId, record);
    }
  }
}

export const questionHistoryStore = new QuestionHistoryAndQueueStore();
