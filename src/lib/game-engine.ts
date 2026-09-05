import { Player } from '@prisma/client';
import { GuessFeedback, MatchStatus, GameClue } from '@/types/game';

// Country Region Mappings for CLOSE (🟨) match hints
const CONTINENT_REGIONS: Record<string, string> = {
  IN: 'SOUTH_ASIA',
  PK: 'SOUTH_ASIA',
  SL: 'SOUTH_ASIA',
  BD: 'SOUTH_ASIA',
  AF: 'SOUTH_ASIA',
  NP: 'SOUTH_ASIA',
  AU: 'OCEANIA',
  NZ: 'OCEANIA',
  PNG: 'OCEANIA',
  ENG: 'EUROPE',
  IE: 'EUROPE',
  NL: 'EUROPE',
  SCO: 'EUROPE',
  SA: 'AFRICA',
  ZIM: 'AFRICA',
  NA: 'AFRICA',
  WI: 'AMERICAS',
  US: 'AMERICAS',
  CAN: 'AMERICAS',
};

// Map country codes to country flags
const COUNTRY_FLAGS: Record<string, string> = {
  IN: '🇮🇳',
  AU: '🇦🇺',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  SA: '🇿🇦',
  NZ: '🇳🇿',
  PK: '🇵🇰',
  SL: '🇱🇰',
  BD: '🇧🇩',
  AF: '🇦🇫',
  WI: '🌴',
  NP: '🇳🇵',
  NA: '🇳🇦',
  NL: '🇳🇱',
  US: '🇺🇸',
  IE: '🇮🇪',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  PNG: '🇵🇬',
};

export function getCountryFlag(countryCode: string): string {
  return COUNTRY_FLAGS[countryCode] || '🏏';
}

/**
 * Evaluate a player guess against the target player.
 */
export function evaluateGuess(
  guessedPlayer: Player & { competitions?: { competition: string }[] },
  targetPlayer: Player & { competitions?: { competition: string }[] },
  attemptNumber: number
): GuessFeedback {
  const isCorrect = guessedPlayer.id === targetPlayer.id;

  // 1. Country Comparison
  let countryStatus: MatchStatus = 'MISMATCH';
  if (guessedPlayer.countryCode === targetPlayer.countryCode) {
    countryStatus = 'MATCH';
  } else if (
    CONTINENT_REGIONS[guessedPlayer.countryCode] &&
    CONTINENT_REGIONS[guessedPlayer.countryCode] === CONTINENT_REGIONS[targetPlayer.countryCode]
  ) {
    countryStatus = 'CLOSE';
  }

  // 2. Gender Comparison
  const genderStatus: MatchStatus =
    guessedPlayer.gender === targetPlayer.gender ? 'MATCH' : 'MISMATCH';

  // 3. Role Comparison
  let roleStatus: MatchStatus = 'MISMATCH';
  if (guessedPlayer.role === targetPlayer.role) {
    roleStatus = 'MATCH';
  } else if (
    (guessedPlayer.role.includes('Batter') && targetPlayer.role.includes('Batter')) ||
    (guessedPlayer.role.includes('Bowler') && targetPlayer.role.includes('Bowler')) ||
    (guessedPlayer.role.includes('All-rounder') && targetPlayer.role.includes('All-rounder'))
  ) {
    roleStatus = 'CLOSE';
  }

  // 4. Batting Style Comparison
  const battingStatus: MatchStatus =
    guessedPlayer.battingStyle === targetPlayer.battingStyle ? 'MATCH' : 'MISMATCH';

  // 5. Bowling Style Comparison
  let bowlingStatus: MatchStatus = 'MISMATCH';
  if (guessedPlayer.bowlingStyle === targetPlayer.bowlingStyle) {
    bowlingStatus = 'MATCH';
  } else if (
    guessedPlayer.bowlingArm === targetPlayer.bowlingArm &&
    guessedPlayer.bowlingArm !== null
  ) {
    bowlingStatus = 'CLOSE';
  }

  // 6. Era Comparison
  const eraStatus: MatchStatus =
    guessedPlayer.playingEra === targetPlayer.playingEra ? 'MATCH' : 'MISMATCH';

  // 7. Debut Decade Comparison
  const guessedDebutYear = parseInt(
    guessedPlayer.debutTest || guessedPlayer.debutODI || guessedPlayer.debutT20I || '2000'
  );
  const targetDebutYear = parseInt(
    targetPlayer.debutTest || targetPlayer.debutODI || targetPlayer.debutT20I || '2000'
  );
  const guessedDecade = Math.floor(guessedDebutYear / 10) * 10;
  const targetDecade = Math.floor(targetDebutYear / 10) * 10;

  let debutStatus: MatchStatus = 'MISMATCH';
  if (guessedDecade === targetDecade) {
    debutStatus = 'MATCH';
  } else if (Math.abs(guessedDecade - targetDecade) <= 10) {
    debutStatus = 'CLOSE';
  }

  // 8. Competition / Franchise Participation
  const guessedComps = guessedPlayer.competitions?.map((c: { competition: string }) => c.competition) || [];
  const targetComps = targetPlayer.competitions?.map((c: { competition: string }) => c.competition) || [];
  const sharedComps = guessedComps.filter((c: string) => targetComps.includes(c));

  let competitionStatus: MatchStatus = 'MISMATCH';
  if (sharedComps.length > 0) {
    competitionStatus = sharedComps.length === targetComps.length ? 'MATCH' : 'CLOSE';
  }

  return {
    guessedPlayerId: guessedPlayer.id,
    guessedPlayerName: guessedPlayer.displayName,
    guessedPlayerCountry: guessedPlayer.nationality,
    guessedPlayerFlag: getCountryFlag(guessedPlayer.countryCode),
    guessedPlayerImage: guessedPlayer.profileImage,
    attemptNumber,
    isCorrect,
    attributes: {
      country: {
        label: 'Country',
        value: `${getCountryFlag(guessedPlayer.countryCode)} ${guessedPlayer.nationality}`,
        targetDisplayValue: getCountryFlag(targetPlayer.countryCode),
        status: countryStatus,
        hintMessage: countryStatus === 'CLOSE' ? 'Same Region' : undefined,
      },
      gender: {
        label: 'Gender',
        value: guessedPlayer.gender === 'FEMALE' ? 'Women\'s' : 'Men\'s',
        status: genderStatus,
      },
      role: {
        label: 'Role',
        value: guessedPlayer.role,
        status: roleStatus,
      },
      battingStyle: {
        label: 'Batting',
        value: guessedPlayer.battingStyle,
        status: battingStatus,
      },
      bowlingStyle: {
        label: 'Bowling',
        value: guessedPlayer.bowlingStyle || 'N/A',
        status: bowlingStatus,
      },
      playingEra: {
        label: 'Era',
        value: guessedPlayer.playingEra,
        status: eraStatus,
      },
      debutDecade: {
        label: 'Debut',
        value: `${guessedDecade}s`,
        status: debutStatus,
        hintMessage:
          debutStatus === 'CLOSE'
            ? guessedDecade < targetDecade
              ? 'Debut Later ⬆️'
              : 'Debut Earlier ⬇️'
            : undefined,
      },
      competition: {
        label: 'Leagues',
        value: sharedComps.length > 0 ? sharedComps.slice(0, 2).join(', ') : 'None Shared',
        status: competitionStatus,
      },
    },
  };
}

/**
 * Generate dynamic clues available based on attempts used.
 */
export function generateCluesForAttempt(
  targetPlayer: Player & { competitions?: { competition: string }[] },
  attemptsCount: number
): GameClue[] {
  const clues: GameClue[] = [];

  if (attemptsCount >= 2) {
    clues.push({
      level: 1,
      type: 'COUNTRY',
      label: 'Country Representation',
      value: `${getCountryFlag(targetPlayer.countryCode)} ${targetPlayer.nationality}`,
      icon: '🌍',
      unlockedAtAttempt: 2,
    });
  }

  if (attemptsCount >= 3) {
    clues.push({
      level: 2,
      type: 'ROLE',
      label: 'Primary Role',
      value: targetPlayer.role,
      icon: '🏏',
      unlockedAtAttempt: 3,
    });
  }

  if (attemptsCount >= 4) {
    clues.push({
      level: 3,
      type: 'BATTING',
      label: 'Batting Style',
      value: targetPlayer.battingStyle,
      icon: '➡️',
      unlockedAtAttempt: 4,
    });
  }

  if (attemptsCount >= 5) {
    const debutYear =
      targetPlayer.debutTest || targetPlayer.debutODI || targetPlayer.debutT20I || 'N/A';
    clues.push({
      level: 4,
      type: 'DEBUT',
      label: 'Debut Year',
      value: `Debut: ${debutYear} (${targetPlayer.playingEra})`,
      icon: '📅',
      unlockedAtAttempt: 5,
    });
  }

  if (attemptsCount >= 6) {
    const comps = targetPlayer.competitions?.map((c: { competition: string }) => c.competition).join(', ') || 'International Cricket';
    clues.push({
      level: 5,
      type: 'COMPETITION',
      label: 'Competitions & Leagues',
      value: comps,
      icon: '🏆',
      unlockedAtAttempt: 6,
    });
  }

  if (attemptsCount >= 7) {
    const jerseyText = targetPlayer.jerseyNumber
      ? `Jersey #${targetPlayer.jerseyNumber}`
      : `Career: ${targetPlayer.careerSpan}`;
    clues.push({
      level: 6,
      type: 'JERSEY',
      label: 'Signature Detail',
      value: jerseyText,
      icon: '🔢',
      unlockedAtAttempt: 7,
    });
  }

  return clues;
}
