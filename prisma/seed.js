const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting cricket database seed...');

  // Clean existing tables
  await prisma.gameGuess.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.dailyChallenge.deleteMany();
  await prisma.playerAlias.deleteMany();
  await prisma.playerIdentifier.deleteMany();
  await prisma.imageAsset.deleteMany();
  await prisma.playerTeam.deleteMany();
  await prisma.playerCompetition.deleteMany();
  await prisma.playerStatistic.deleteMany();
  await prisma.player.deleteMany();
  await prisma.achievement.deleteMany();

  // Create Seed Achievements
  await prisma.achievement.createMany({
    data: [
      { code: 'FIRST_GUESS', title: '🏏 Ace Identifier', description: 'Solve a daily challenge in 1 guess', icon: '⚡', category: 'ACCURACY' },
      { code: 'HOT_STREAK', title: '🔥 On Fire', description: 'Maintain a 7-day daily winning streak', icon: '🔥', category: 'STREAK' },
      { code: 'PERFECT_WEEK', title: '👑 Royalty', description: 'Complete 7 daily challenges in a row', icon: '👑', category: 'STREAK' },
      { code: 'WORLD_TOUR', title: '🌍 World Tour', description: 'Identify players from 15 different countries', icon: '🌍', category: 'EXPLORATION' },
      { code: 'LEGEND', title: '🏛 Time Traveler', description: 'Identify 10 historical players from before 2000', icon: '🏛', category: 'HISTORICAL' },
      { code: 'QUICK_THINKER', title: '⚡ Lightning Fast', description: 'Solve a challenge under 20 seconds', icon: '⏱️', category: 'SPEED' },
    ],
  });

  // Comprehensive Player List
  const playersData = [
    {
      uuid: 'player-virat-kohli-001',
      displayName: 'Virat Kohli',
      fullName: 'Virat Kohli',
      shortName: 'V Kohli',
      initials: 'VK',
      gender: 'MALE',
      dateOfBirth: '1988-11-05',
      birthPlace: 'Delhi',
      birthCountry: 'India',
      nationality: 'Indian',
      countryCode: 'IN',
      playingEra: '2010s',
      isActive: true,
      role: 'Top-order Batter',
      roleTags: 'Batter, Top-order Batter, Captain',
      battingStyle: 'Right-hand batter',
      bowlingStyle: 'Right-arm medium',
      bowlingArm: 'Right',
      wicketkeeper: false,
      captain: true,
      jerseyNumber: 18,
      debutTest: '2011',
      debutODI: '2008',
      debutT20I: '2010',
      careerSpan: '2008-Present',
      profileImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
      difficultyScore: 1.5,
      popularityRank: 1,
      aliases: ['VK', 'King Kohli', 'Chiku', 'Virat Kholi', 'V Kohli'],
      identifiers: [
        { sourceName: 'cricsheet', externalId: 'b78a9c21' },
        { sourceName: 'cricinfo', externalId: '253802' },
        { sourceName: 'bcci', externalId: '164' },
      ],
      competitions: ['IPL', 'Test', 'ODI', 'T20I', 'World Cup', 'Champions Trophy'],
      stats: [
        { format: 'TEST', matches: 113, runs: 8848, wickets: 0, battingAvg: 49.15, strikeRate: 55.56, hundreds: 29, fifties: 30, catches: 115 },
        { format: 'ODI', matches: 292, runs: 13848, wickets: 5, battingAvg: 58.67, strikeRate: 93.58, hundreds: 50, fifties: 72, catches: 152 },
        { format: 'T20I', matches: 125, runs: 4188, wickets: 4, battingAvg: 48.69, strikeRate: 137.04, hundreds: 1, fifties: 37, catches: 54 },
        { format: 'IPL', matches: 252, runs: 8004, wickets: 4, battingAvg: 38.66, strikeRate: 131.97, hundreds: 8, fifties: 55, catches: 110 },
      ]
    },
    {
      uuid: 'player-ellyse-perry-002',
      displayName: 'Ellyse Perry',
      fullName: 'Ellyse Alexandra Perry',
      shortName: 'E Perry',
      initials: 'EP',
      gender: 'FEMALE',
      dateOfBirth: '1990-11-03',
      birthPlace: 'Sydney, New South Wales',
      birthCountry: 'Australia',
      nationality: 'Australian',
      countryCode: 'AU',
      playingEra: '2010s',
      isActive: true,
      role: 'Batting All-rounder',
      roleTags: 'All-rounder, Batting All-rounder, Bowler',
      battingStyle: 'Right-hand batter',
      bowlingStyle: 'Right-arm fast-medium',
      bowlingArm: 'Right',
      wicketkeeper: false,
      captain: false,
      jerseyNumber: 8,
      debutTest: '2008',
      debutODI: '2007',
      debutT20I: '2008',
      careerSpan: '2007-Present',
      profileImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop',
      difficultyScore: 2.5,
      popularityRank: 5,
      aliases: ['Pez', 'Ellyse Perry', 'E Perry'],
      identifiers: [
        { sourceName: 'cricsheet', externalId: 'a12b34cd' },
        { sourceName: 'cricinfo', externalId: '275487' },
      ],
      competitions: ['WPL', 'WBBL', 'The Hundred', 'Test', 'ODI', 'T20I', 'World Cup'],
      stats: [
        { format: 'TEST', matches: 13, runs: 928, wickets: 38, battingAvg: 61.86, strikeRate: 46.2, hundreds: 2, fifties: 4, catches: 7 },
        { format: 'ODI', matches: 141, runs: 3852, wickets: 162, battingAvg: 50.68, strikeRate: 77.4, hundreds: 2, fifties: 34, catches: 48 },
        { format: 'T20I', matches: 154, runs: 1944, wickets: 126, battingAvg: 31.35, strikeRate: 116.1, hundreds: 0, fifties: 9, catches: 44 },
      ]
    },
    {
      uuid: 'player-don-bradman-003',
      displayName: 'Sir Donald Bradman',
      fullName: 'Sir Donald George Bradman',
      shortName: 'D Bradman',
      initials: 'DG',
      gender: 'MALE',
      dateOfBirth: '1908-08-27',
      dateOfDeath: '2001-02-25',
      birthPlace: 'Cootamundra, New South Wales',
      birthCountry: 'Australia',
      nationality: 'Australian',
      countryCode: 'AU',
      playingEra: '1930s',
      isActive: false,
      isRetired: true,
      isDeceased: true,
      role: 'Top-order Batter',
      roleTags: 'Batter, Top-order Batter, Captain, Legend',
      battingStyle: 'Right-hand batter',
      bowlingStyle: 'Right-arm leg spin',
      bowlingArm: 'Right',
      wicketkeeper: false,
      captain: true,
      jerseyNumber: null,
      debutTest: '1928',
      retirementTest: '1948',
      careerSpan: '1928-1948',
      profileImage: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800&auto=format&fit=crop',
      difficultyScore: 3.0,
      popularityRank: 10,
      aliases: ['The Don', 'Don Bradman', 'D Bradman', 'Sir Don'],
      identifiers: [
        { sourceName: 'cricsheet', externalId: 'don_bradman_legacy' },
        { sourceName: 'cricinfo', externalId: '4188' },
      ],
      competitions: ['Test', 'Ashes', 'Sheffield Shield'],
      stats: [
        { format: 'TEST', matches: 52, runs: 6996, wickets: 2, battingAvg: 99.94, strikeRate: 61.2, hundreds: 29, fifties: 13, catches: 32 },
      ]
    },
    {
      uuid: 'player-lasith-malinga-004',
      displayName: 'Lasith Malinga',
      fullName: 'Separamadu Lasith Malinga',
      shortName: 'L Malinga',
      initials: 'LM',
      gender: 'MALE',
      dateOfBirth: '1983-08-28',
      birthPlace: 'Galle',
      birthCountry: 'Sri Lanka',
      nationality: 'Sri Lankan',
      countryCode: 'SL',
      playingEra: '2000s',
      isActive: false,
      isRetired: true,
      role: 'Bowler',
      roleTags: 'Bowler, Fast Bowler, Sling Bowler, Death Overs Specialist',
      battingStyle: 'Right-hand batter',
      bowlingStyle: 'Right-arm fast (Sling)',
      bowlingArm: 'Right',
      wicketkeeper: false,
      captain: true,
      jerseyNumber: 99,
      debutTest: '2004',
      debutODI: '2004',
      debutT20I: '2006',
      retirementTest: '2011',
      retirementODI: '2019',
      retirementT20I: '2020',
      careerSpan: '2004-2020',
      profileImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
      difficultyScore: 2.0,
      popularityRank: 12,
      aliases: ['Slinga Malinga', 'Malinga', 'L Malinga'],
      identifiers: [
        { sourceName: 'cricsheet', externalId: 'malinga_99' },
        { sourceName: 'cricinfo', externalId: '49758' },
      ],
      competitions: ['IPL', 'BBL', 'Test', 'ODI', 'T20I', 'World Cup'],
      stats: [
        { format: 'TEST', matches: 30, runs: 275, wickets: 101, bowlingAvg: 33.15, economy: 3.84, fiveWickets: 3, catches: 7 },
        { format: 'ODI', matches: 226, runs: 567, wickets: 338, bowlingAvg: 28.87, economy: 5.35, fiveWickets: 8, catches: 31 },
        { format: 'T20I', matches: 84, runs: 136, wickets: 107, bowlingAvg: 20.79, economy: 7.42, fiveWickets: 2, catches: 21 },
        { format: 'IPL', matches: 122, runs: 88, wickets: 170, bowlingAvg: 19.8, economy: 7.14, fiveWickets: 1, catches: 24 },
      ]
    },
    {
      uuid: 'player-rashid-khan-005',
      displayName: 'Rashid Khan',
      fullName: 'Rashid Khan Arman',
      shortName: 'Rashid Khan',
      initials: 'RK',
      gender: 'MALE',
      dateOfBirth: '1998-09-20',
      birthPlace: 'Nangarhar',
      birthCountry: 'Afghanistan',
      nationality: 'Afghan',
      countryCode: 'AF',
      playingEra: '2010s',
      isActive: true,
      role: 'Bowling All-rounder',
      roleTags: 'Bowler, Leg Spinner, Bowling All-rounder, Franchise Specialist',
      battingStyle: 'Right-hand batter',
      bowlingStyle: 'Right-arm leg spin',
      bowlingArm: 'Right',
      wicketkeeper: false,
      captain: true,
      jerseyNumber: 19,
      debutTest: '2018',
      debutODI: '2015',
      debutT20I: '2015',
      careerSpan: '2015-Present',
      profileImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
      difficultyScore: 2.2,
      popularityRank: 8,
      aliases: ['Rashid Khan', 'Rashid', 'Arman'],
      identifiers: [
        { sourceName: 'cricsheet', externalId: 'rashid_afg_19' },
        { sourceName: 'cricinfo', externalId: '793463' },
      ],
      competitions: ['IPL', 'BBL', 'PSL', 'CPL', 'MLC', 'The Hundred', 'ODI', 'T20I', 'Test'],
      stats: [
        { format: 'TEST', matches: 5, runs: 106, wickets: 34, bowlingAvg: 22.35, economy: 3.1, fiveWickets: 4, catches: 1 },
        { format: 'ODI', matches: 103, runs: 1234, wickets: 182, bowlingAvg: 20.02, economy: 4.18, fiveWickets: 5, catches: 28 },
        { format: 'T20I', matches: 92, runs: 430, wickets: 150, bowlingAvg: 14.3, economy: 6.07, fiveWickets: 2, catches: 30 },
        { format: 'IPL', matches: 121, runs: 545, wickets: 149, bowlingAvg: 21.82, economy: 6.82, fiveWickets: 0, catches: 36 },
      ]
    },
    {
      uuid: 'player-gerhard-erasmus-006',
      displayName: 'Gerhard Erasmus',
      fullName: 'Merwe Gerhard Erasmus',
      shortName: 'G Erasmus',
      initials: 'GE',
      gender: 'MALE',
      dateOfBirth: '1995-04-11',
      birthPlace: 'Windhoek',
      birthCountry: 'Namibia',
      nationality: 'Namibian',
      countryCode: 'NA',
      playingEra: '2010s',
      isActive: true,
      role: 'Batting All-rounder',
      roleTags: 'Batter, All-rounder, Captain, Associate Leader',
      battingStyle: 'Right-hand batter',
      bowlingStyle: 'Right-arm off spin',
      bowlingArm: 'Right',
      wicketkeeper: false,
      captain: true,
      jerseyNumber: 7,
      debutODI: '2019',
      debutT20I: '2019',
      careerSpan: '2019-Present',
      profileImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop',
      difficultyScore: 7.2,
      popularityRank: 85,
      aliases: ['Erasmus', 'Gerhard Erasmus', 'G Erasmus'],
      identifiers: [
        { sourceName: 'cricsheet', externalId: 'erasmus_nam_07' },
        { sourceName: 'cricinfo', externalId: '424269' },
      ],
      competitions: ['ODI', 'T20I', 'T20 World Cup', 'ICC World Cricket League'],
      stats: [
        { format: 'ODI', matches: 45, runs: 1680, wickets: 24, battingAvg: 43.07, strikeRate: 80.5, hundreds: 2, fifties: 13, catches: 22 },
        { format: 'T20I', matches: 62, runs: 1420, wickets: 38, battingAvg: 31.55, strikeRate: 130.8, hundreds: 1, fifties: 10, catches: 30 },
      ]
    },
    {
      uuid: 'player-sandeep-lamichhane-007',
      displayName: 'Sandeep Lamichhane',
      fullName: 'Sandeep Lamichhane',
      shortName: 'S Lamichhane',
      initials: 'SL',
      gender: 'MALE',
      dateOfBirth: '2000-08-02',
      birthPlace: 'Syangja',
      birthCountry: 'Nepal',
      nationality: 'Nepali',
      countryCode: 'NP',
      playingEra: '2010s',
      isActive: true,
      role: 'Bowler',
      roleTags: 'Bowler, Leg Spinner, Associate Star, Franchise Specialist',
      battingStyle: 'Right-hand batter',
      bowlingStyle: 'Right-arm leg spin',
      bowlingArm: 'Right',
      wicketkeeper: false,
      captain: true,
      jerseyNumber: 25,
      debutODI: '2018',
      debutT20I: '2018',
      careerSpan: '2018-Present',
      profileImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?q=80&w=800&auto=format&fit=crop',
      difficultyScore: 6.5,
      popularityRank: 60,
      aliases: ['Sandeep', 'S Lamichhane'],
      identifiers: [
        { sourceName: 'cricsheet', externalId: 'sandeep_nep_25' },
        { sourceName: 'cricinfo', externalId: '1025241' },
      ],
      competitions: ['IPL', 'BBL', 'CPL', 'PSL', 'ODI', 'T20I', 'T20 World Cup'],
      stats: [
        { format: 'ODI', matches: 51, runs: 370, wickets: 112, bowlingAvg: 18.06, economy: 4.42, fiveWickets: 3, catches: 12 },
        { format: 'T20I', matches: 52, runs: 120, wickets: 98, bowlingAvg: 12.58, economy: 6.29, fiveWickets: 1, catches: 14 },
      ]
    },
    {
      uuid: 'player-ms-dhoni-012',
      displayName: 'MS Dhoni',
      fullName: 'Mahendra Singh Dhoni',
      shortName: 'MS Dhoni',
      initials: 'MSD',
      gender: 'MALE',
      dateOfBirth: '1981-07-07',
      birthPlace: 'Ranchi, Bihar (now Jharkhand)',
      birthCountry: 'India',
      nationality: 'Indian',
      countryCode: 'IN',
      playingEra: '2000s',
      isActive: false,
      isRetired: true,
      role: 'Wicketkeeper Batter',
      roleTags: 'Wicketkeeper, Wicketkeeper Batter, Captain, Finisher, Legend',
      battingStyle: 'Right-hand batter',
      bowlingStyle: 'Right-arm medium',
      bowlingArm: 'Right',
      wicketkeeper: true,
      captain: true,
      jerseyNumber: 7,
      debutTest: '2005',
      debutODI: '2004',
      debutT20I: '2006',
      retirementTest: '2014',
      retirementODI: '2019',
      retirementT20I: '2019',
      careerSpan: '2004-2019',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
      difficultyScore: 1.2,
      popularityRank: 2,
      aliases: ['MSD', 'Captain Cool', 'Mahi', 'Thala', 'MS Dhoni', 'Mahendra Singh Dhoni'],
      identifiers: [
        { sourceName: 'cricsheet', externalId: 'msd_in_07' },
        { sourceName: 'cricinfo', externalId: '28081' },
      ],
      competitions: ['IPL', 'Test', 'ODI', 'T20I', 'World Cup', 'Champions Trophy', 'T20 World Cup'],
      stats: [
        { format: 'TEST', matches: 90, runs: 4876, wickets: 0, battingAvg: 38.09, strikeRate: 59.1, hundreds: 6, fifties: 33, catches: 256, stumpings: 38 },
        { format: 'ODI', matches: 350, runs: 10773, wickets: 1, battingAvg: 50.57, strikeRate: 87.56, hundreds: 10, fifties: 73, catches: 321, stumpings: 123 },
        { format: 'T20I', matches: 98, runs: 1617, wickets: 0, battingAvg: 37.6, strikeRate: 126.13, hundreds: 0, fifties: 2, catches: 57, stumpings: 34 },
        { format: 'IPL', matches: 264, runs: 5243, wickets: 0, battingAvg: 39.13, strikeRate: 137.54, hundreds: 0, fifties: 24, catches: 152, stumpings: 42 },
      ]
    },
  ];

  for (const p of playersData) {
    const { aliases, identifiers, competitions, stats, ...playerInfo } = p;

    const createdPlayer = await prisma.player.create({
      data: { ...playerInfo },
    });

    if (aliases && aliases.length > 0) {
      await prisma.playerAlias.createMany({
        data: aliases.map((alias) => ({ playerId: createdPlayer.id, alias, type: 'NICKNAME' })),
      });
    }

    if (identifiers && identifiers.length > 0) {
      await prisma.playerIdentifier.createMany({
        data: identifiers.map((ident) => ({
          playerId: createdPlayer.id,
          sourceName: ident.sourceName,
          externalId: ident.externalId,
        })),
      });
    }

    if (competitions && competitions.length > 0) {
      await prisma.playerCompetition.createMany({
        data: competitions.map((comp) => ({ playerId: createdPlayer.id, competition: comp })),
      });
    }

    if (stats && stats.length > 0) {
      await prisma.playerStatistic.createMany({
        data: stats.map((st) => ({
          playerId: createdPlayer.id,
          format: st.format,
          matches: st.matches,
          runs: st.runs,
          wickets: st.wickets || 0,
          battingAvg: st.battingAvg,
          strikeRate: st.strikeRate,
          hundreds: st.hundreds || 0,
          fifties: st.fifties || 0,
          catches: st.catches || 0,
        })),
      });
    }
  }

  // Today's Daily Challenge
  const virat = await prisma.player.findFirst({ where: { displayName: 'Virat Kohli' } });
  if (virat) {
    await prisma.dailyChallenge.create({
      data: {
        challengeNumber: 284,
        challengeDate: '2026-09-05',
        playerId: virat.id,
        difficulty: 'MEDIUM',
        maxAttempts: 8,
        isPublished: true,
      },
    });
  }

  console.log(`✅ Seeded ${playersData.length} cricket players!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
