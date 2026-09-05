import { VerifiedPlayerCandidate, VERIFIED_PLAYER_POOL } from '@/lib/question-engine';
import { FactClue } from '@/types/game-extension';

export class CandidateDiscriminator {
  /**
   * Refines clue combinations to ensure exactly 1 matching candidate player in the database (Req #31, #32).
   */
  public static ensureSingleCandidate(
    targetPlayer: VerifiedPlayerCandidate,
    initialClues: FactClue[]
  ): { refinedClues: FactClue[]; candidateCount: number; factsAdded: string[] } {
    let currentClues = [...initialClues];
    const factsAdded: string[] = [];

    // Helper to count matching candidates in DB
    const getMatches = (clues: FactClue[]) => {
      return VERIFIED_PLAYER_POOL.filter((p) => {
        for (const clue of clues) {
          if (clue.type === 'COUNTRY' && p.country.toLowerCase() !== clue.value.toLowerCase()) return false;
          if (clue.type === 'ROLE' && p.role.toLowerCase() !== clue.value.toLowerCase()) return false;
          if (clue.type === 'BATTING_STYLE' && p.battingStyle.toLowerCase() !== clue.value.toLowerCase()) return false;
        }
        return true;
      });
    };

    let matching = getMatches(currentClues);

    // If more than 1 player matches, progressively add discriminator clues
    if (matching.length > 1) {
      // Add Career Span / Era
      if (!currentClues.some((c) => c.type === 'CAREER_SPAN') && targetPlayer.careerSpan) {
        currentClues.push({
          type: 'CAREER_SPAN',
          label: 'Era / Span',
          value: targetPlayer.careerSpan,
        });
        factsAdded.push('careerSpan');
        matching = getMatches(currentClues);
      }

      // Add Bowling Style if still > 1
      if (matching.length > 1 && !currentClues.some((c) => c.type === 'BOWLING_STYLE') && targetPlayer.bowlingStyle) {
        currentClues.push({
          type: 'BOWLING_STYLE',
          label: 'Bowling Style',
          value: targetPlayer.bowlingStyle,
        });
        factsAdded.push('bowlingStyle');
        matching = getMatches(currentClues);
      }

      // Add Team / Franchise if still > 1
      if (matching.length > 1 && !currentClues.some((c) => c.type === 'TEAM') && targetPlayer.teams.length > 0) {
        currentClues.push({
          type: 'TEAM',
          label: 'Franchise / Team',
          value: targetPlayer.teams.join(', '),
        });
        factsAdded.push('teams');
        matching = getMatches(currentClues);
      }
    }

    return {
      refinedClues: currentClues,
      candidateCount: Math.max(1, matching.length),
      factsAdded,
    };
  }
}
