import Fuse from 'fuse.js';
import { PlayerSearchResult } from '@/types/game';

interface SearchablePlayer {
  id: string;
  uuid: string;
  displayName: string;
  fullName: string;
  shortName: string;
  countryCode: string;
  nationality: string;
  role: string;
  playingEra: string;
  profileImage: string;
  gender: string;
  aliases: string[];
}

/**
 * Fuse.js configuration for fuzzy matching player queries.
 */
export function searchPlayers(
  players: SearchablePlayer[],
  query: string,
  limit: number = 8
): PlayerSearchResult[] {
  if (!query || query.trim().length === 0) {
    return players.slice(0, limit).map(mapToSearchResult);
  }

  const normalizedQuery = query.trim().toLowerCase();

  const options = {
    includeScore: true,
    threshold: 0.4, // Allows typos (e.g., "Virat Kholi")
    distance: 100,
    keys: [
      { name: 'displayName', weight: 0.5 },
      { name: 'fullName', weight: 0.4 },
      { name: 'shortName', weight: 0.3 },
      { name: 'aliases', weight: 0.4 },
      { name: 'nationality', weight: 0.2 },
    ],
  };

  const fuse = new Fuse(players, options);
  const results = fuse.search(normalizedQuery);

  return results.slice(0, limit).map((res) => mapToSearchResult(res.item));
}

function mapToSearchResult(player: SearchablePlayer): PlayerSearchResult {
  return {
    id: player.id,
    uuid: player.uuid,
    displayName: player.displayName,
    fullName: player.fullName,
    shortName: player.shortName,
    countryCode: player.countryCode,
    nationality: player.nationality,
    role: player.role,
    playingEra: player.playingEra,
    profileImage: player.profileImage,
    gender: player.gender,
    aliases: player.aliases || [],
  };
}
