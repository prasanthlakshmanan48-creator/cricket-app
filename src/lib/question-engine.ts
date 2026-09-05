import { ClientQuestionPayload, FactClue, QuestionFormatType } from '@/types/game-extension';

export interface VerifiedPlayerCandidate {
  id: string;
  displayName: string;
  fullName: string;
  country: string;
  countryCode: string;
  role: string;
  battingStyle: string;
  bowlingStyle?: string;
  playingEra: string;
  careerSpan: string;
  profileImage: string;
  difficultyScore: number;
  teams: string[];
  achievements: string[];
}

export const VERIFIED_PLAYER_POOL: VerifiedPlayerCandidate[] = [
  {
    id: 'p-vk-18',
    displayName: 'Virat Kohli',
    fullName: 'Virat Kohli',
    country: 'India',
    countryCode: 'IN',
    role: 'Batter',
    battingStyle: 'Right-hand batter',
    bowlingStyle: 'Right-arm medium',
    playingEra: '2010s-2020s',
    careerSpan: '2008-Present',
    profileImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 1.0,
    teams: ['India', 'Royal Challengers Bengaluru'],
    achievements: ['80+ International Centuries', '2011 ODI World Cup Champion', '2024 T20 World Cup Champion'],
  },
  {
    id: 'p-ba-56',
    displayName: 'Babar Azam',
    fullName: 'Mohammad Babar Azam',
    country: 'Pakistan',
    countryCode: 'PK',
    role: 'Batter',
    battingStyle: 'Right-hand batter',
    bowlingStyle: 'Right-arm off spin',
    playingEra: '2010s-2020s',
    careerSpan: '2015-Present',
    profileImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 2.0,
    teams: ['Pakistan', 'Peshawar Zalmi', 'Karachi Kings'],
    achievements: ['#1 ICC ODI Batter Ranking', 'Fastest to 5000 ODI Runs'],
  },
  {
    id: 'p-ep-8',
    displayName: 'Ellyse Perry',
    fullName: 'Ellyse Alexandra Perry',
    country: 'Australia',
    countryCode: 'AU',
    role: 'All-rounder',
    battingStyle: 'Right-hand batter',
    bowlingStyle: 'Right-arm fast-medium',
    playingEra: '2000s-2020s',
    careerSpan: '2007-Present',
    profileImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 2.0,
    teams: ['Australia', 'Royal Challengers Bengaluru W', 'Sydney Sixers'],
    achievements: ['Multi-time World Cup Winner', 'Represented Australia in Cricket & Soccer'],
  },
  {
    id: 'p-jb-93',
    displayName: 'Jasprit Bumrah',
    fullName: 'Jasprit Jasbirsingh Bumrah',
    country: 'India',
    countryCode: 'IN',
    role: 'Bowler',
    battingStyle: 'Right-hand batter',
    bowlingStyle: 'Right-arm fast',
    playingEra: '2010s-2020s',
    careerSpan: '2016-Present',
    profileImage: 'https://images.unsplash.com/photo-1508801939453-2254637d745f?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 1.5,
    teams: ['India', 'Mumbai Indians'],
    achievements: ['Player of Tournament 2024 T20 World Cup', 'Unique hyperextension bowling action'],
  },
  {
    id: 'p-ml-17',
    displayName: 'Meg Lanning',
    fullName: 'Meghann Moira Lanning',
    country: 'Australia',
    countryCode: 'AU',
    role: 'Batter',
    battingStyle: 'Right-hand batter',
    bowlingStyle: 'Right-arm medium',
    playingEra: '2010s-2020s',
    careerSpan: '2010-2023',
    profileImage: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 2.5,
    teams: ['Australia', 'Delhi Capitals W', 'Melbourne Stars'],
    achievements: ['7 ICC World Titles as Captain', 'Youngest Australian to score an ODI century'],
  },
  {
    id: 'p-pc-30',
    displayName: 'Pat Cummins',
    fullName: 'Patrick James Cummins',
    country: 'Australia',
    countryCode: 'AU',
    role: 'Bowler',
    battingStyle: 'Right-hand batter',
    bowlingStyle: 'Right-arm fast',
    playingEra: '2010s-2020s',
    careerSpan: '2011-Present',
    profileImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 2.0,
    teams: ['Australia', 'Sunrisers Hyderabad', 'Kolkata Knight Riders'],
    achievements: ['2023 WTC Champion Captain', '2023 ODI World Cup Champion Captain'],
  },
  {
    id: 'p-msd-7',
    displayName: 'MS Dhoni',
    fullName: 'Mahendra Singh Dhoni',
    country: 'India',
    countryCode: 'IN',
    role: 'Wicketkeeper Batter',
    battingStyle: 'Right-hand batter',
    bowlingStyle: 'Right-arm medium',
    playingEra: '2000s-2010s',
    careerSpan: '2004-2019',
    profileImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 1.0,
    teams: ['India', 'Chennai Super Kings'],
    achievements: ['Won 2007 T20 WC, 2011 ODI WC & 2013 Champions Trophy', '5 IPL Titles with CSK'],
  },
  {
    id: 'p-st-10',
    displayName: 'Sachin Tendulkar',
    fullName: 'Sachin Ramesh Tendulkar',
    country: 'India',
    countryCode: 'IN',
    role: 'Batter',
    battingStyle: 'Right-hand batter',
    bowlingStyle: 'Right-arm leg spin',
    playingEra: '1990s-2010s',
    careerSpan: '1989-2013',
    profileImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 1.0,
    teams: ['India', 'Mumbai Indians'],
    achievements: ['100 International Centuries', '34,357 International Runs', '2011 World Cup Winner'],
  },
  {
    id: 'p-rs-45',
    displayName: 'Rohit Sharma',
    fullName: 'Rohit Gurunath Sharma',
    country: 'India',
    countryCode: 'IN',
    role: 'Batter',
    battingStyle: 'Right-hand batter',
    bowlingStyle: 'Right-arm off spin',
    playingEra: '2000s-2020s',
    careerSpan: '2007-Present',
    profileImage: 'https://images.unsplash.com/photo-1508801939453-2254637d745f?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 1.2,
    teams: ['India', 'Mumbai Indians'],
    achievements: ['Three ODI Double Centuries', '264 Highest Individual ODI Score', '2024 T20 WC Champion Captain'],
  },
  {
    id: 'p-rk-19',
    displayName: 'Rashid Khan',
    fullName: 'Rashid Khan Arman',
    country: 'Afghanistan',
    countryCode: 'AF',
    role: 'Bowler',
    battingStyle: 'Right-hand batter',
    bowlingStyle: 'Right-arm leg spin',
    playingEra: '2010s-2020s',
    careerSpan: '2015-Present',
    profileImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 2.0,
    teams: ['Afghanistan', 'Gujarat Titans', 'Sunrisers Hyderabad', 'Adelaide Strikers'],
    achievements: ['Fastest to 100 ODI Wickets', 'Global Franchise T20 Icon'],
  },
  {
    id: 'p-sm-18',
    displayName: 'Smriti Mandhana',
    fullName: 'Smriti Shriniwas Mandhana',
    country: 'India',
    countryCode: 'IN',
    role: 'Batter',
    battingStyle: 'Left-hand batter',
    bowlingStyle: 'Right-arm off spin',
    playingEra: '2010s-2020s',
    careerSpan: '2013-Present',
    profileImage: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 2.0,
    teams: ['India', 'Royal Challengers Bengaluru W'],
    achievements: ['ICC Women\'s Cricketer of the Year', 'WPL 2024 Winning Captain'],
  },
  {
    id: 'p-bs-55',
    displayName: 'Ben Stokes',
    fullName: 'Benjamin Andrew Stokes',
    country: 'England',
    countryCode: 'ENG',
    role: 'All-rounder',
    battingStyle: 'Left-hand batter',
    bowlingStyle: 'Right-arm fast-medium',
    playingEra: '2010s-2020s',
    careerSpan: '2011-Present',
    profileImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    difficultyScore: 1.8,
    teams: ['England', 'Chennai Super Kings', 'Rajasthan Royals'],
    achievements: ['2019 ODI World Cup Final Hero', '2019 Headingley Miracle 135*'],
  },
];

export class QuestionEngine {
  private static sessionUsedPlayers: Map<string, Set<string>> = new Map();
  private static sessionUsedQuestionKeys: Map<string, Set<string>> = new Map();

  /**
   * Reset tracking for a session
   */
  public static resetSession(sessionId: string): void {
    this.sessionUsedPlayers.set(sessionId, new Set());
    this.sessionUsedQuestionKeys.set(sessionId, new Set());
  }

  /**
   * Select a candidate player who has not appeared yet in this game session.
   * Prevents duplicates per Requirement #11 and #18.
   */
  public static selectNextTargetPlayer(sessionId: string): VerifiedPlayerCandidate {
    let usedPlayers = this.sessionUsedPlayers.get(sessionId);
    if (!usedPlayers) {
      usedPlayers = new Set();
      this.sessionUsedPlayers.set(sessionId, usedPlayers);
    }

    // Filter candidate pool
    const unusedCandidates = VERIFIED_PLAYER_POOL.filter((p) => !usedPlayers!.has(p.id));

    let chosenPlayer: VerifiedPlayerCandidate;
    if (unusedCandidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * unusedCandidates.length);
      chosenPlayer = unusedCandidates[randomIndex];
    } else {
      // If pool is exhausted, pick random candidate (graceful fallback per Req #53)
      const randomIndex = Math.floor(Math.random() * VERIFIED_PLAYER_POOL.length);
      chosenPlayer = VERIFIED_PLAYER_POOL[randomIndex];
    }

    usedPlayers.add(chosenPlayer.id);
    return chosenPlayer;
  }

  /**
   * Generates a verified multi-format question for a target player.
   */
  public static generateQuestion(
    sessionId: string,
    roundNumber: number,
    timerSeconds: number = 60,
    forcedFormat?: QuestionFormatType
  ): { targetPlayer: VerifiedPlayerCandidate; payload: ClientQuestionPayload } {
    const targetPlayer = this.selectNextTargetPlayer(sessionId);

    // Pick question format
    const formats: QuestionFormatType[] = [
      'IMAGE',
      'CLUE',
      'CAREER',
      'STAT',
      'COUNTRY',
      'ERA',
      'TEAM',
      'LEGEND',
    ];
    const format = forcedFormat || formats[(roundNumber - 1) % formats.length];

    // Facts array
    const clues: FactClue[] = [
      { type: 'COUNTRY', label: 'Country', value: targetPlayer.country },
      { type: 'ROLE', label: 'Role', value: targetPlayer.role },
      { type: 'BATTING_STYLE', label: 'Batting Stance', value: targetPlayer.battingStyle },
      { type: 'CAREER_SPAN', label: 'Era / Span', value: targetPlayer.careerSpan },
    ];

    if (targetPlayer.bowlingStyle) {
      clues.push({ type: 'BOWLING_STYLE', label: 'Bowling Style', value: targetPlayer.bowlingStyle });
    }

    if (targetPlayer.teams.length > 0) {
      clues.push({ type: 'TEAM', label: 'Teams Represented', value: targetPlayer.teams.join(', ') });
    }

    let questionText = '';
    let imageUrl: string | undefined = undefined;

    switch (format) {
      case 'IMAGE':
        questionText = `Who is this legendary cricketer?`;
        imageUrl = targetPlayer.profileImage;
        break;
      case 'CAREER':
        questionText = `Which ${targetPlayer.country} ${targetPlayer.role.toLowerCase()} played during ${targetPlayer.careerSpan} and represented ${targetPlayer.teams.join(' & ')}?`;
        break;
      case 'STAT':
        questionText = `Which cricketer achieved: "${targetPlayer.achievements[0]}"?`;
        break;
      case 'COUNTRY':
        questionText = `Identify the famous ${targetPlayer.role} who plays for ${targetPlayer.country} with a ${targetPlayer.battingStyle} style.`;
        break;
      case 'ERA':
        questionText = `Which cricketer active during ${targetPlayer.playingEra} (${targetPlayer.careerSpan}) achieved legendary status for ${targetPlayer.country}?`;
        break;
      case 'TEAM':
        questionText = `Who is the cricketer associated with teams: ${targetPlayer.teams.join(', ')}?`;
        break;
      case 'LEGEND':
        questionText = `Which icon holds these career milestones: ${targetPlayer.achievements.slice(0, 2).join(' & ')}?`;
        break;
      case 'CLUE':
      default:
        questionText = `Which player matches these clues: ${targetPlayer.role} for ${targetPlayer.country}, ${targetPlayer.battingStyle}?`;
        break;
    }

    // Generate MCQ options from pool
    const options = this.generateMCQOptions(targetPlayer);

    const now = Date.now();
    const payload: ClientQuestionPayload = {
      questionId: `q-${sessionId}-${roundNumber}-${Date.now()}`,
      roundNumber,
      questionType: format,
      questionText,
      imageUrl,
      clues,
      options,
      questionStartedAt: now,
      questionEndsAt: now + timerSeconds * 1000,
      timerSeconds,
    };

    return { targetPlayer, payload };
  }

  /**
   * Generates 4 MCQ options including the correct target player
   */
  private static generateMCQOptions(targetPlayer: VerifiedPlayerCandidate): string[] {
    const distractors = VERIFIED_PLAYER_POOL.filter((p) => p.id !== targetPlayer.id);
    // Shuffle distractors
    const shuffled = [...distractors].sort(() => 0.5 - Math.random());
    const selectedDistractors = shuffled.slice(0, 3).map((p) => p.displayName);

    const allOptions = [targetPlayer.displayName, ...selectedDistractors];
    // Shuffle 4 options
    return allOptions.sort(() => 0.5 - Math.random());
  }

  /**
   * Verify if a guess matches the target player
   */
  public static verifyAnswer(guessName: string, targetPlayer: VerifiedPlayerCandidate): boolean {
    if (!guessName || !targetPlayer) return false;
    const cleanGuess = guessName.trim().toLowerCase();
    const cleanTarget = targetPlayer.displayName.trim().toLowerCase();
    const cleanFull = targetPlayer.fullName.trim().toLowerCase();

    return cleanGuess === cleanTarget || cleanGuess === cleanFull;
  }
}
