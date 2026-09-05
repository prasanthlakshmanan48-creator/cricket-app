import React from 'react';
import { Trophy, Flame, Award, Medal } from 'lucide-react';

export default function LeaderboardPage() {
  const leaderboardEntries = [
    { rank: 1, name: 'CricketMaster99', score: 2840, streak: 42, winRate: 98.2, avgGuesses: 2.8, avatar: '👑' },
    { rank: 2, name: 'KingKohli_Fan', score: 2710, streak: 35, winRate: 95.5, avgGuesses: 3.1, avatar: '🏏' },
    { rank: 3, name: 'SpinWizard_88', score: 2650, streak: 28, winRate: 93.0, avgGuesses: 3.4, avatar: '⚡' },
    { rank: 4, name: 'AussieAshes', score: 2520, streak: 21, winRate: 91.4, avgGuesses: 3.6, avatar: '🇦🇺' },
    { rank: 5, name: 'CoverDrivePro', score: 2480, streak: 19, winRate: 90.1, avgGuesses: 3.8, avatar: '💥' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      <div className="text-center">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          GLOBAL RANKINGS
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
          LEADERBOARD
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Top cricket guessers worldwide. Ranked by accuracy, streak, and speed.
        </p>
      </div>

      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
          <span>Global Top Performers</span>
          <span>Daily #284</span>
        </div>

        <div className="divide-y divide-white/5">
          {leaderboardEntries.map((entry) => (
            <div key={entry.rank} className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs ${
                    entry.rank === 1
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                      : entry.rank === 2
                      ? 'bg-gray-300 text-black'
                      : entry.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {entry.rank}
                </div>

                <div className="text-xl">{entry.avatar}</div>

                <div>
                  <div className="font-display font-bold text-sm sm:text-base text-white">{entry.name}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <span>{entry.winRate}% Win Rate</span>
                    <span>•</span>
                    <span>{entry.avgGuesses} Avg Guesses</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-400" /> {entry.streak}
                </div>
                <div className="font-display font-black text-base text-emerald-400">{entry.score} pts</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
