import { FactClue, HintChoice } from '@/types/game-extension';

export interface PlayerFactSource {
  id: string;
  displayName: string;
  country: string;
  role: string;
  battingStyle: string;
  bowlingStyle?: string;
  debutYear?: string;
  playingEra?: string;
  careerSpan?: string;
  teams?: string[];
}

export class HintEngine {
  /**
   * Generates available hint options for a target player, excluding clues already revealed.
   */
  public static getAvailableHints(
    player: PlayerFactSource,
    revealedHintTypes: Set<string>,
    hintCountUsed: number
  ): HintChoice[] {
    const candidates: HintChoice[] = [];
    const penalty = (hintCountUsed + 1) * 100; // -100 for 1st, -200 for 2nd, -300 for 3rd

    // Country Hint
    if (!revealedHintTypes.has('COUNTRY') && player.country) {
      candidates.push({
        id: `hint-country-${player.id}`,
        type: 'COUNTRY',
        label: 'Reveal Player Country',
        value: `Plays for ${player.country}`,
        pointPenalty: penalty,
        timePenaltySeconds: 10,
      });
    }

    // Role Hint
    if (!revealedHintTypes.has('ROLE') && player.role) {
      candidates.push({
        id: `hint-role-${player.id}`,
        type: 'ROLE',
        label: 'Reveal Primary Role',
        value: `Primary Role: ${player.role}`,
        pointPenalty: penalty,
        timePenaltySeconds: 10,
      });
    }

    // Batting Style Hint
    if (!revealedHintTypes.has('BATTING_STYLE') && player.battingStyle) {
      candidates.push({
        id: `hint-batting-${player.id}`,
        type: 'BATTING_STYLE',
        label: 'Reveal Batting Stance',
        value: `Batting Style: ${player.battingStyle}`,
        pointPenalty: penalty,
        timePenaltySeconds: 10,
      });
    }

    // Bowling Style Hint
    if (!revealedHintTypes.has('BOWLING_STYLE') && player.bowlingStyle) {
      candidates.push({
        id: `hint-bowling-${player.id}`,
        type: 'BOWLING_STYLE',
        label: 'Reveal Bowling Style',
        value: `Bowling Action: ${player.bowlingStyle}`,
        pointPenalty: penalty,
        timePenaltySeconds: 10,
      });
    }

    // Debut Era / Career Span
    if (!revealedHintTypes.has('CAREER_SPAN') && (player.careerSpan || player.debutYear || player.playingEra)) {
      const eraValue = player.careerSpan || (player.debutYear ? `Debuted around ${player.debutYear}` : `Active in ${player.playingEra}`);
      candidates.push({
        id: `hint-era-${player.id}`,
        type: 'CAREER_SPAN',
        label: 'Reveal Career Era',
        value: `Career Span: ${eraValue}`,
        pointPenalty: penalty,
        timePenaltySeconds: 10,
      });
    }

    // Teams / Franchise
    if (!revealedHintTypes.has('TEAM') && player.teams && player.teams.length > 0) {
      candidates.push({
        id: `hint-team-${player.id}`,
        type: 'TEAM',
        label: 'Reveal Key Team/Franchise',
        value: `Represented: ${player.teams.slice(0, 2).join(', ')}`,
        pointPenalty: penalty,
        timePenaltySeconds: 10,
      });
    }

    return candidates;
  }

  /**
   * Pick the single smartest hint recommendation based on information value
   */
  public static selectBestSmartHint(
    player: PlayerFactSource,
    revealedHintTypes: Set<string>,
    hintCountUsed: number
  ): HintChoice | null {
    const available = this.getAvailableHints(player, revealedHintTypes, hintCountUsed);
    if (available.length === 0) return null;

    // Prioritize Country -> Role -> Career Span -> Batting Style -> Team -> Bowling Style
    const priorityOrder = ['COUNTRY', 'ROLE', 'CAREER_SPAN', 'BATTING_STYLE', 'TEAM', 'BOWLING_STYLE'];
    for (const pType of priorityOrder) {
      const match = available.find((h) => h.type === pType);
      if (match) return match;
    }

    return available[0];
  }
}
