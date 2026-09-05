declare module '@prisma/client' {
  export class PrismaClient {
    [key: string]: any;
    $disconnect(): Promise<void>;
  }

  export interface Player {
    id: string;
    uuid: string;
    displayName: string;
    fullName: string;
    shortName: string;
    initials: string | null;
    gender: string;
    dateOfBirth: string | null;
    dateOfDeath?: string | null;
    birthPlace: string | null;
    birthCountry: string | null;
    nationality: string;
    countryCode: string;
    playingEra: string;
    isActive: boolean;
    isRetired: boolean;
    isDeceased?: boolean;
    role: string;
    roleTags: string;
    battingStyle: string;
    bowlingStyle: string | null;
    bowlingArm: string | null;
    wicketkeeper: boolean;
    captain: boolean;
    jerseyNumber: number | null;
    debutTest?: string | null;
    debutODI?: string | null;
    debutT20I?: string | null;
    retirementTest?: string | null;
    retirementODI?: string | null;
    retirementT20I?: string | null;
    careerSpan: string;
    profileImage: string;
    heroImage?: string | null;
    silhouetteImage?: string | null;
    difficultyScore: number;
    popularityRank: number;
    dataQualityScore: number;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface PlayerStatistic {
    id: string;
    playerId: string;
    format: string;
    matches: number;
    runs: number;
    wickets: number;
    battingAvg: number | null;
    strikeRate: number | null;
    bowlingAvg: number | null;
    economy: number | null;
    hundreds: number;
    fifties: number;
    fiveWickets: number;
    catches: number;
    stumpings: number;
  }
}
