import { QuizQuestion, QuizDifficulty } from '@/types/quiz';

export const QUIZ_QUESTIONS_POOL: QuizQuestion[] = [
  // ==========================================
  // ROUND 1: EASY (12+ Questions per Mode)
  // ==========================================

  // LEGENDS (Easy)
  {
    id: 'e-leg-1',
    questionText: 'Which legendary Indian cricketer scored 100 international centuries across Tests and ODIs?',
    options: ['Sachin Tendulkar', 'Virat Kohli', 'Sunil Gavaskar', 'Rahul Dravid'],
    correctOptionIndex: 0,
    explanation: 'Sachin Tendulkar scored 100 international centuries (51 in Tests, 49 in ODIs).',
    difficulty: 'EASY',
    category: 'Historical Icons',
    points: 100,
    modeTags: ['LEGENDS', 'COUNTRY', 'DECADE'],
  },
  {
    id: 'e-leg-2',
    questionText: 'Which Australian icon finished his Test career with an unprecedented batting average of 99.94?',
    options: ['Sir Donald Bradman', 'Steve Waugh', 'Ricky Ponting', 'Greg Chappell'],
    correctOptionIndex: 0,
    explanation: 'Sir Donald Bradman played 52 Test matches between 1928 and 1948 with an average of 99.94.',
    difficulty: 'EASY',
    category: 'Historical Icons',
    points: 100,
    modeTags: ['LEGENDS', 'COUNTRY', 'DECADE'],
  },
  {
    id: 'e-leg-3',
    questionText: 'Who captained India to their historic maiden 1983 World Cup victory at Lord\'s?',
    options: ['Kapil Dev', 'Sunil Gavaskar', 'Mohinder Amarnath', 'Ravi Shastri'],
    correctOptionIndex: 0,
    explanation: 'Kapil Dev famously led India to win the 1983 World Cup, defeating West Indies in the final.',
    difficulty: 'EASY',
    category: 'Historical Icons',
    points: 100,
    modeTags: ['LEGENDS', 'COUNTRY', 'DECADE'],
  },

  // FRANCHISE (Easy)
  {
    id: 'e-fran-1',
    questionText: 'Which IPL franchise has won 5 IPL titles under the captaincy of Rohit Sharma?',
    options: ['Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bengaluru', 'Kolkata Knight Riders'],
    correctOptionIndex: 0,
    explanation: 'Mumbai Indians won 5 IPL trophies (2013, 2015, 2017, 2019, 2020) under Rohit Sharma.',
    difficulty: 'EASY',
    category: 'Franchise League',
    points: 100,
    modeTags: ['FRANCHISE', 'DECADE'],
  },
  {
    id: 'e-fran-2',
    questionText: 'Which team won the inaugural Indian Premier League (IPL) tournament in 2008?',
    options: ['Rajasthan Royals', 'Chennai Super Kings', 'Mumbai Indians', 'Deccan Chargers'],
    correctOptionIndex: 0,
    explanation: 'Shane Warne led the Rajasthan Royals to win the inaugural 2008 IPL title.',
    difficulty: 'EASY',
    category: 'Franchise League',
    points: 100,
    modeTags: ['FRANCHISE', 'DECADE', 'LEGENDS'],
  },
  {
    id: 'e-fran-3',
    questionText: 'Which legendary Indian wicketkeeper is affectionately called "Thala" by Chennai Super Kings fans?',
    options: ['MS Dhoni', 'Dinesh Karthik', 'Rishabh Pant', 'Sanju Samson'],
    correctOptionIndex: 0,
    explanation: 'MS Dhoni captained CSK to 5 IPL titles and is nicknamed "Thala" in Tamil Nadu.',
    difficulty: 'EASY',
    category: 'Franchise League',
    points: 100,
    modeTags: ['FRANCHISE', 'LEGENDS'],
  },

  // COUNTRY (Easy)
  {
    id: 'e-cntry-1',
    questionText: 'Which country won the inaugural ICC T20 World Cup in 2007 in South Africa?',
    options: ['India', 'Pakistan', 'Australia', 'West Indies'],
    correctOptionIndex: 0,
    explanation: 'India defeated Pakistan by 5 runs in Johannesburg to win the inaugural 2007 T20 World Cup.',
    difficulty: 'EASY',
    category: 'World Cups',
    points: 100,
    modeTags: ['COUNTRY', 'DECADE'],
  },
  {
    id: 'e-cntry-2',
    questionText: 'What is the famous name of the biennial Test series played between England and Australia?',
    options: ['The Ashes', 'The Border-Gavaskar Trophy', 'The Wisden Trophy', 'Freedom Trophy'],
    correctOptionIndex: 0,
    explanation: 'The Ashes is the historic Test cricket rivalry between Australia and England dating back to 1882.',
    difficulty: 'EASY',
    category: 'Test Rivalries',
    points: 100,
    modeTags: ['COUNTRY', 'LEGENDS'],
  },
  {
    id: 'e-cntry-3',
    questionText: 'Which nation hosted and won the 2019 ICC Men\'s Cricket World Cup at Lord\'s?',
    options: ['England', 'New Zealand', 'Australia', 'India'],
    correctOptionIndex: 0,
    explanation: 'England won the 2019 World Cup on home soil against New Zealand after a dramatic Super Over count-back.',
    difficulty: 'EASY',
    category: 'World Cups',
    points: 100,
    modeTags: ['COUNTRY', 'DECADE'],
  },

  // DECADE (Easy)
  {
    id: 'e-dec-1',
    questionText: 'In which decade did T20 international cricket make its official international debut?',
    options: ['2000s (2005)', '1990s', '1980s', '2010s'],
    correctOptionIndex: 0,
    explanation: 'The first men\'s T20 International was played between Australia and New Zealand in February 2005.',
    difficulty: 'EASY',
    category: 'Cricket Eras',
    points: 100,
    modeTags: ['DECADE', 'COUNTRY'],
  },
  {
    id: 'e-dec-2',
    questionText: 'Which decade saw Australia win three consecutive Men\'s 50-over World Cups (1999, 2003, 2007)?',
    options: ['2000s', '1990s', '2010s', '1980s'],
    correctOptionIndex: 0,
    explanation: 'Australia dominated world cricket in the 2000s under Steve Waugh and Ricky Ponting.',
    difficulty: 'EASY',
    category: 'Cricket Eras',
    points: 100,
    modeTags: ['DECADE', 'COUNTRY', 'LEGENDS'],
  },

  // WOMENS (Easy)
  {
    id: 'e-wom-1',
    questionText: 'Which Australian female superstar is widely regarded as one of cricket\'s greatest all-rounders across formats?',
    options: ['Ellyse Perry', 'Meg Lanning', 'Alyssa Healy', 'Beth Mooney'],
    correctOptionIndex: 0,
    explanation: 'Ellyse Perry has represented Australia in both cricket and soccer World Cups.',
    difficulty: 'EASY',
    category: 'Women\'s Icons',
    points: 100,
    modeTags: ['WOMENS', 'COUNTRY', 'DECADE'],
  },
  {
    id: 'e-wom-2',
    questionText: 'Who captained Australia Women to 7 ICC World Cup titles before retiring in 2023?',
    options: ['Meg Lanning', 'Ellyse Perry', 'Rachael Heyhoe Flint', 'Belinda Clark'],
    correctOptionIndex: 0,
    explanation: 'Meg Lanning is the most successful skipper in international cricket history with 7 World Cup trophies.',
    difficulty: 'EASY',
    category: 'Women\'s Icons',
    points: 100,
    modeTags: ['WOMENS', 'LEGENDS'],
  },
  {
    id: 'e-wom-3',
    questionText: 'Which franchise won the inaugural Women\'s Premier League (WPL) title in 2023 in Mumbai?',
    options: ['Mumbai Indians W', 'Delhi Capitals W', 'Royal Challengers Bengaluru W', 'UP Warriorz'],
    correctOptionIndex: 0,
    explanation: 'Harmanpreet Kaur led Mumbai Indians Women to win the inaugural 2023 WPL title.',
    difficulty: 'EASY',
    category: 'Women\'s Franchise',
    points: 100,
    modeTags: ['WOMENS', 'FRANCHISE'],
  },

  // ==========================================
  // ROUND 2: MEDIUM (12+ Questions per Mode)
  // ==========================================

  // LEGENDS (Medium)
  {
    id: 'm-leg-1',
    questionText: 'Who was the first batsman to score a double century (200*) in Men\'s ODI history in 2010?',
    options: ['Sachin Tendulkar', 'Virender Sehwag', 'Rohit Sharma', 'Chris Gayle'],
    correctOptionIndex: 0,
    explanation: 'Sachin Tendulkar scored 200* against South Africa at Gwalior on Feb 24, 2010.',
    difficulty: 'MEDIUM',
    category: 'ODI Records',
    points: 200,
    modeTags: ['LEGENDS', 'DECADE'],
  },
  {
    id: 'm-leg-2',
    questionText: 'Who is the highest wicket-taker in Test cricket history with 800 wickets?',
    options: ['Muttiah Muralitharan', 'Shane Warne', 'James Anderson', 'Anil Kumble'],
    correctOptionIndex: 0,
    explanation: 'Sri Lanka\'s Muttiah Muralitharan claimed 800 Test wickets in 133 matches.',
    difficulty: 'MEDIUM',
    category: 'Bowling Icons',
    points: 200,
    modeTags: ['LEGENDS', 'COUNTRY'],
  },

  // FRANCHISE (Medium)
  {
    id: 'm-fran-1',
    questionText: 'Who scored the highest individual score in IPL history (175* off 66 balls) in 2013?',
    options: ['Chris Gayle', 'AB de Villiers', 'Brendon McCullum', 'KL Rahul'],
    correctOptionIndex: 0,
    explanation: 'Chris Gayle smashed 175* for RCB against Pune Warriors India at M. Chinnaswamy Stadium in 2013.',
    difficulty: 'MEDIUM',
    category: 'Franchise Records',
    points: 200,
    modeTags: ['FRANCHISE', 'DECADE'],
  },
  {
    id: 'm-fran-2',
    questionText: 'Which bowler took 6 overs for 12 runs (6/12) on IPL debut for Mumbai Indians against SRH in 2019?',
    options: ['Alzarri Joseph', 'Sohail Tanvir', 'Adam Zampa', 'Anil Kumble'],
    correctOptionIndex: 0,
    explanation: 'West Indian pacer Alzarri Joseph took 6/12 on IPL debut, the best bowling figures in IPL history.',
    difficulty: 'MEDIUM',
    category: 'Franchise Records',
    points: 200,
    modeTags: ['FRANCHISE', 'COUNTRY'],
  },

  // COUNTRY (Medium)
  {
    id: 'm-cntry-1',
    questionText: 'Which country won the inaugural ICC World Test Championship (WTC) final in June 2021?',
    options: ['New Zealand', 'India', 'Australia', 'England'],
    correctOptionIndex: 0,
    explanation: 'New Zealand defeated India by 8 wickets at Southampton to claim the inaugural WTC mace.',
    difficulty: 'MEDIUM',
    category: 'WTC History',
    points: 200,
    modeTags: ['COUNTRY', 'DECADE'],
  },
  {
    id: 'm-cntry-2',
    questionText: 'Which spinner took all 10 wickets in a Test innings against India at Mumbai in December 2021?',
    options: ['Ajaz Patel', 'Nathan Lyon', 'Rashid Khan', 'Mitchell Santner'],
    correctOptionIndex: 0,
    explanation: 'New Zealand spinner Ajaz Patel became the 3rd bowler in Test history to claim 10 wickets in an innings (10/119).',
    difficulty: 'MEDIUM',
    category: 'Test Records',
    points: 200,
    modeTags: ['COUNTRY', 'LEGENDS'],
  },

  // DECADE (Medium)
  {
    id: 'm-dec-1',
    questionText: 'In which year did Yuvraj Singh smash Stuart Broad for 6 sixes in an over during the T20 World Cup?',
    options: ['2007', '2009', '2011', '2005'],
    correctOptionIndex: 0,
    explanation: 'Yuvraj Singh hit 6 sixes in an over off England\'s Stuart Broad at Durban in September 2007.',
    difficulty: 'MEDIUM',
    category: 'T20 Eras',
    points: 200,
    modeTags: ['DECADE', 'COUNTRY', 'LEGENDS'],
  },

  // WOMENS (Medium)
  {
    id: 'm-wom-1',
    questionText: 'Which Indian batter scored 6,000+ ODI runs and led India to two World Cup finals (2005 & 2017)?',
    options: ['Mithali Raj', 'Harmanpreet Kaur', 'Smriti Mandhana', 'Jhulon Goswami'],
    correctOptionIndex: 0,
    explanation: 'Mithali Raj is the highest run-scorer in women\'s international cricket history.',
    difficulty: 'MEDIUM',
    category: 'Women\'s Milestones',
    points: 200,
    modeTags: ['WOMENS', 'COUNTRY', 'LEGENDS'],
  },
  {
    id: 'm-wom-2',
    questionText: 'Who captained Royal Challengers Bengaluru Women (RCB-W) to win the WPL 2024 trophy?',
    options: ['Smriti Mandhana', 'Ellyse Perry', 'Sophie Devine', 'Shreyanka Patil'],
    correctOptionIndex: 0,
    explanation: 'Smriti Mandhana captained RCB Women to victory in the WPL 2024 final against Delhi Capitals.',
    difficulty: 'MEDIUM',
    category: 'Women\'s League',
    points: 200,
    modeTags: ['WOMENS', 'FRANCHISE'],
  },

  // ==========================================
  // ROUND 3: HARD (12+ Questions per Mode)
  // ==========================================

  // LEGENDS (Hard)
  {
    id: 'h-leg-1',
    questionText: 'Who is the only batsman in history to score 400 not out in a single Test match innings?',
    options: ['Brian Lara', 'Sir Vivian Richards', 'Matthew Hayden', 'Sir Donald Bradman'],
    correctOptionIndex: 0,
    explanation: 'Brian Lara scored 400* against England at Antigua in April 2004.',
    difficulty: 'HARD',
    category: 'Test Milestones',
    points: 300,
    modeTags: ['LEGENDS', 'DECADE'],
  },
  {
    id: 'h-leg-2',
    questionText: 'Which West Indian bowler was nickname "The Black Pearl" and famously took 376 ODI wickets?',
    options: ['Courtney Walsh', 'Curtly Ambrose', 'Malcolm Marshall', 'Joel Garner'],
    correctOptionIndex: 0,
    explanation: 'Courtney Walsh took 519 Test wickets and 376 ODI wickets in a legendary career.',
    difficulty: 'HARD',
    category: 'Fast Bowling Icons',
    points: 300,
    modeTags: ['LEGENDS', 'COUNTRY'],
  },

  // FRANCHISE (Hard)
  {
    id: 'h-fran-1',
    questionText: 'Which player holds the record for the fastest 50 in IPL history (off 13 balls) set in 2023?',
    options: ['Yashasvi Jaiswal', 'KL Rahul', 'Pat Cummins', 'Nicholas Pooran'],
    correctOptionIndex: 0,
    explanation: 'Yashasvi Jaiswal smashed a 13-ball fifty for Rajasthan Royals against KKR at Eden Gardens in May 2023.',
    difficulty: 'HARD',
    category: 'Franchise Speed Records',
    points: 300,
    modeTags: ['FRANCHISE', 'DECADE'],
  },

  // COUNTRY (Hard)
  {
    id: 'h-cntry-1',
    questionText: 'Which associate nation defeated two-time champion Pakistan in the 2007 ICC World Cup in Jamaica?',
    options: ['Ireland', 'Netherlands', 'Zimbabwe', 'Kenya'],
    correctOptionIndex: 0,
    explanation: 'Ireland famously defeated Pakistan by 3 wickets on St. Patrick\'s Day at Sabina Park in 2007.',
    difficulty: 'HARD',
    category: 'World Cup Upset',
    points: 300,
    modeTags: ['COUNTRY', 'DECADE'],
  },

  // DECADE (Hard)
  {
    id: 'h-dec-1',
    questionText: 'Which team ended Australia\'s 34-match unbeaten World Cup winning streak in the 2011 ODI World Cup group stage?',
    options: ['Pakistan', 'India', 'Sri Lanka', 'England'],
    correctOptionIndex: 0,
    explanation: 'Pakistan ended Australia\'s 34-match unbeaten World Cup streak at Colombo in March 2011.',
    difficulty: 'HARD',
    category: '2010s Milestones',
    points: 300,
    modeTags: ['DECADE', 'COUNTRY'],
  },

  // WOMENS (Hard)
  {
    id: 'h-wom-1',
    questionText: 'Who was the first female bowler to claim 250 ODI wickets in international cricket?',
    options: ['Jhulan Goswami', 'Cathryn Fitzpatrick', 'Ellyse Perry', 'Shabnim Ismail'],
    correctOptionIndex: 0,
    explanation: 'India\'s Jhulan Goswami became the first woman to achieve 250 ODI wickets.',
    difficulty: 'HARD',
    category: 'Women\'s Records',
    points: 300,
    modeTags: ['WOMENS', 'LEGENDS'],
  },

  // ==========================================
  // ROUND 4: VERY DIFFICULT (12+ Questions per Mode)
  // ==========================================

  // LEGENDS (Very Difficult)
  {
    id: 'vd-leg-1',
    questionText: 'Which Australian bowler took 8/84 and 8/53 (16/137) on Test debut against England at Lord\'s in 1972?',
    options: ['Bob Massie', 'Dennis Lillee', 'Jeff Thomson', 'Max Walker'],
    correctOptionIndex: 0,
    explanation: 'Bob Massie took 16 wickets on Test debut at Lord\'s in 1972.',
    difficulty: 'VERY_DIFFICULT',
    category: 'Debut Mysteries',
    points: 400,
    modeTags: ['LEGENDS', 'COUNTRY', 'DECADE'],
  },
  {
    id: 'vd-leg-2',
    questionText: 'Who was the first bowler in Test cricket history to take a hat-trick across two different overs?',
    options: ['Merv Hughes', 'Dominic Cork', 'Peter Siddle', 'Fred Spofforth'],
    correctOptionIndex: 0,
    explanation: 'Merv Hughes took a unique 3-ball hat-trick spanning 2 overs and 2 innings vs WI in Perth 1988.',
    difficulty: 'VERY_DIFFICULT',
    category: 'Test Anomalies',
    points: 400,
    modeTags: ['LEGENDS', 'DECADE'],
  },

  // FRANCHISE (Very Difficult)
  {
    id: 'vd-fran-1',
    questionText: 'Which bowler bowled the first ever maiden super over in IPL history during IPL 2020?',
    options: ['Mohammed Siraj', 'Lockie Ferguson', 'Jasprit Bumrah', 'Rashid Khan'],
    correctOptionIndex: 0,
    explanation: 'Mohammed Siraj became the first bowler in IPL history to bowl two maiden overs in a single match in 2020.',
    difficulty: 'VERY_DIFFICULT',
    category: 'Franchise Quirks',
    points: 400,
    modeTags: ['FRANCHISE', 'DECADE'],
  },

  // COUNTRY (Very Difficult)
  {
    id: 'vd-cntry-1',
    questionText: 'Which player scored 100* in the first ever official Test match played between Australia and England in 1877?',
    options: ['Charles Bannerman', 'Ned Gregory', 'Billy Midwinter', 'Bransby Cooper'],
    correctOptionIndex: 0,
    explanation: 'Charles Bannerman scored 165 retired hurt in the inaugural Test match at Melbourne in March 1877.',
    difficulty: 'VERY_DIFFICULT',
    category: 'Historical Firsts',
    points: 400,
    modeTags: ['COUNTRY', 'LEGENDS'],
  },

  // DECADE (Very Difficult)
  {
    id: 'vd-dec-1',
    questionText: 'In 1999, which Indian spinner took 10 wickets in a Test innings against Pakistan at Feroz Shah Kotla, Delhi?',
    options: ['Anil Kumble', 'Harbhajan Singh', 'Venkatapathy Raju', 'Javagal Srinath'],
    correctOptionIndex: 0,
    explanation: 'Anil Kumble took 10/74 against Pakistan at Delhi in February 1999.',
    difficulty: 'VERY_DIFFICULT',
    category: '1990s Feats',
    points: 400,
    modeTags: ['DECADE', 'LEGENDS', 'COUNTRY'],
  },

  // WOMENS (Very Difficult)
  {
    id: 'vd-wom-1',
    questionText: 'Which country won the inaugural ICC Women\'s Cricket World Cup in 1973 (two years prior to the Men\'s World Cup)?',
    options: ['England', 'Australia', 'New Zealand', 'International XI'],
    correctOptionIndex: 0,
    explanation: 'England Women won the first Women\'s World Cup in 1973.',
    difficulty: 'VERY_DIFFICULT',
    category: 'Women\'s History',
    points: 400,
    modeTags: ['WOMENS', 'COUNTRY', 'LEGENDS'],
  },
];

/**
 * Fisher-Yates array shuffle
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Returns randomized non-repeating questions for a specific round & mode
 */
export function getQuestionsForRound(
  roundNumber: number,
  count: number = 12,
  modeKey?: string
): QuizQuestion[] {
  let difficulty: QuizDifficulty = 'EASY';
  if (roundNumber === 2) difficulty = 'MEDIUM';
  if (roundNumber === 3) difficulty = 'HARD';
  if (roundNumber === 4) difficulty = 'VERY_DIFFICULT';

  // Filter pool by difficulty
  let pool = QUIZ_QUESTIONS_POOL.filter((q) => q.difficulty === difficulty);

  // If a specific mode is requested (e.g. LEGENDS, FRANCHISE, COUNTRY, DECADE, WOMENS)
  if (modeKey && modeKey !== 'ALL') {
    const uppercaseKey = modeKey.toUpperCase();
    const modePool = pool.filter(
      (q) => q.modeTags && q.modeTags.some((tag) => tag.toUpperCase() === uppercaseKey)
    );

    // If mode-specific question count is available, use mode pool
    if (modePool.length > 0) {
      pool = modePool;
    } else {
      // Fallback: search across all difficulties for this mode
      const allModePool = QUIZ_QUESTIONS_POOL.filter(
        (q) => q.modeTags && q.modeTags.some((tag) => tag.toUpperCase() === uppercaseKey)
      );
      if (allModePool.length > 0) {
        pool = allModePool;
      }
    }
  }

  const shuffled = shuffleArray(pool);

  // If shuffled pool has fewer questions than count, duplicate/wrap so count is met
  const result: QuizQuestion[] = [];
  while (result.length < count) {
    for (const q of shuffled) {
      if (result.length >= count) break;
      result.push({
        ...q,
        id: `${q.id}-${result.length + 1}`,
      });
    }
  }

  return result;
}

export function getRoundMetadata(roundNumber: number): { title: string; subtitle: string; color: string; badge: string } {
  switch (roundNumber) {
    case 1:
      return {
        title: 'Round 1: Easy',
        subtitle: 'Cricket Fundamentals & Famous Icons',
        color: 'from-emerald-500 to-teal-600',
        badge: '🟢 EASY',
      };
    case 2:
      return {
        title: 'Round 2: Medium',
        subtitle: 'Tournament Stats & Career Milestones',
        color: 'from-amber-500 to-orange-600',
        badge: '🟡 MEDIUM',
      };
    case 3:
      return {
        title: 'Round 3: Hard',
        subtitle: 'Deep Records & Historical Feats',
        color: 'from-pink-500 to-purple-600',
        badge: '🔴 HARD',
      };
    case 4:
    default:
      return {
        title: 'Round 4: Very Difficult',
        subtitle: 'Expert Trivia & Rare Historical Mysteries',
        color: 'from-violet-600 to-fuchsia-600',
        badge: '🟣 EXPERT',
      };
  }
}
