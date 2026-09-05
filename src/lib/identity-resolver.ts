/**
 * Identity Resolution Engine for Player Deduplication & Merge Analysis.
 */

export interface MatchCandidate {
  player1: { id: string; name: string; country: string; era: string };
  player2: { id: string; name: string; country: string; era: string };
  similarityScore: number; // 0.0 to 1.0
  reasons: string[];
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

export function calculateNameSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1.0;

  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;

  const dist = levenshteinDistance(s1, s2);
  return 1 - dist / maxLen;
}

export function analyzeDuplicateCandidates(
  players: { id: string; displayName: string; countryCode: string; playingEra: string }[]
): MatchCandidate[] {
  const candidates: MatchCandidate[] = [];

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const p1 = players[i];
      const p2 = players[j];

      // Only check players from same country or era
      if (p1.countryCode !== p2.countryCode && p1.playingEra !== p2.playingEra) continue;

      const simScore = calculateNameSimilarity(p1.displayName, p2.displayName);
      const reasons: string[] = [];

      if (simScore >= 0.7) {
        reasons.push(`High name similarity (${Math.round(simScore * 100)}%)`);
      }
      if (p1.countryCode === p2.countryCode) {
        reasons.push(`Same country code (${p1.countryCode})`);
      }
      if (p1.playingEra === p2.playingEra) {
        reasons.push(`Same playing era (${p1.playingEra})`);
      }

      if (simScore >= 0.65 || (p1.countryCode === p2.countryCode && simScore >= 0.5)) {
        candidates.push({
          player1: { id: p1.id, name: p1.displayName, country: p1.countryCode, era: p1.playingEra },
          player2: { id: p2.id, name: p2.displayName, country: p2.countryCode, era: p2.playingEra },
          similarityScore: parseFloat(simScore.toFixed(2)),
          reasons,
        });
      }
    }
  }

  return candidates.sort((a, b) => b.similarityScore - a.similarityScore);
}
