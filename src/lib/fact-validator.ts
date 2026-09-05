import { FactValidationResult, AIStructuredQuestionResponse } from '@/types/dynamic-question';
import { VerifiedPlayerCandidate, VERIFIED_PLAYER_POOL } from '@/lib/question-engine';

export class FactValidator {
  /**
   * Strictly validates AI-generated question text against verified player database attributes.
   * Rejects any unverified claim (Zero Hallucination Policy per Req #1, #6, #7).
   */
  public static validateQuestion(
    response: AIStructuredQuestionResponse,
    targetPlayer: VerifiedPlayerCandidate
  ): FactValidationResult {
    const text = response.questionText.toLowerCase();
    const unverifiedClaims: string[] = [];
    let matchedCount = 0;

    // 1. Country Check
    const targetCountry = targetPlayer.country.toLowerCase();
    if (text.includes(targetCountry)) {
      matchedCount++;
    } else {
      // Check if AI mentioned a different country from our verified DB list
      for (const p of VERIFIED_PLAYER_POOL) {
        const otherCountry = p.country.toLowerCase();
        if (otherCountry !== targetCountry && text.includes(otherCountry)) {
          unverifiedClaims.push(`Contradictory country mentioned: "${p.country}" instead of "${targetPlayer.country}"`);
        }
      }
    }

    // 2. Role Check
    const targetRole = targetPlayer.role.toLowerCase();
    if (text.includes('batter') && !targetRole.includes('batter') && !targetRole.includes('all-rounder')) {
      unverifiedClaims.push(`Incorrect role claim: claimed batter for role "${targetPlayer.role}"`);
    }
    if (text.includes('bowler') && !targetRole.includes('bowler') && !targetRole.includes('all-rounder')) {
      unverifiedClaims.push(`Incorrect role claim: claimed bowler for role "${targetPlayer.role}"`);
    }
    if (text.includes('wicketkeeper') && !targetRole.includes('wicketkeeper')) {
      unverifiedClaims.push(`Incorrect role claim: claimed wicketkeeper for role "${targetPlayer.role}"`);
    }

    // 3. Batting Style Stance Check
    if (text.includes('left-hand') && !targetPlayer.battingStyle.toLowerCase().includes('left')) {
      unverifiedClaims.push(`Incorrect stance claim: claimed left-hand for "${targetPlayer.battingStyle}"`);
    }
    if (text.includes('right-hand') && !targetPlayer.battingStyle.toLowerCase().includes('right')) {
      unverifiedClaims.push(`Incorrect stance claim: claimed right-hand for "${targetPlayer.battingStyle}"`);
    }

    // 4. Candidate Pool Ambiguity Check (Req #30, #31)
    const matchingCandidateCount = this.countMatchingCandidates(response.factsUsed, targetPlayer);

    // Calculate Quality Score (0 to 100)
    let qualityScore = 100;
    if (unverifiedClaims.length > 0) {
      qualityScore -= unverifiedClaims.length * 40;
    }
    if (matchingCandidateCount > 1) {
      qualityScore -= (matchingCandidateCount - 1) * 10;
    }
    if (text.length < 15) {
      qualityScore -= 20; // Too short/vague
    }

    qualityScore = Math.max(0, Math.min(100, qualityScore));
    const isValid = unverifiedClaims.length === 0 && qualityScore >= 70;

    return {
      isValid,
      qualityScore,
      matchedFactsCount: matchedCount,
      unverifiedClaims,
      matchingCandidateCount,
      rejectionReason: !isValid
        ? unverifiedClaims.join(' | ') || `Ambiguous clue set matches ${matchingCandidateCount} candidates`
        : undefined,
    };
  }

  /**
   * Counts how many DB players match the specified clue facts
   */
  public static countMatchingCandidates(
    factsUsed: string[],
    targetPlayer: VerifiedPlayerCandidate
  ): number {
    return VERIFIED_PLAYER_POOL.filter((p) => {
      let matches = true;
      if (factsUsed.includes('country') && p.country.toLowerCase() !== targetPlayer.country.toLowerCase()) {
        matches = false;
      }
      if (factsUsed.includes('role') && p.role.toLowerCase() !== targetPlayer.role.toLowerCase()) {
        matches = false;
      }
      if (factsUsed.includes('battingStyle') && p.battingStyle.toLowerCase() !== targetPlayer.battingStyle.toLowerCase()) {
        matches = false;
      }
      return matches;
    }).length;
  }
}
