'use client';

import React from 'react';
import { Flame, Trophy, Award, BarChart3, CheckCircle2, Clock } from 'lucide-react';

export default function ProfilePage() {
  const stats = {
    gamesPlayed: 48,
    gamesWon: 45,
    winRate: 93.7,
    currentStreak: 12,
    bestStreak: 18,
    avgGuesses: 3.4,
    guessDistribution: { 1: 3, 2: 9, 3: 18, 4: 11, 5: 3, 6: 1 },
  };

  const achievements = [
    { code: 'FIRST_GUESS', title: '🏏 Ace Identifier', desc: 'Solve a daily challenge in 1 guess', unlocked: true },
    { code: 'HOT_STREAK', title: '🔥 On Fire', desc: 'Maintain a 7-day daily winning streak', unlocked: true },
    { code: 'PERFECT_WEEK', title: '👑 Royalty', desc: 'Complete 7 daily challenges in a row', unlocked: true },
    { code: 'WORLD_TOUR', title: '🌍 World Tour', desc: 'Identify players from 15 different countries', unlocked: false },
    { code: 'LEGEND', title: '🏛 Time Traveler', desc: 'Identify 10 historical legends from before 2000', unlocked: true },
    { code: 'QUICK_THINKER', title: '⚡ Lightning Fast', desc: 'Solve a challenge under 20 seconds', unlocked: true },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      
      {/* Header Profile Info */}
      <div className="p-8 rounded-3xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/20">
          👑
        </div>
        <div className="text-center sm:text-left">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">Your Cricket Profile</h1>
          <p className="text-xs text-gray-400 mt-1">Joined September 2026 • Premier Cricket Guesser</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-white/10 text-center">
          <div className="text-xs text-gray-400 uppercase font-semibold">Played</div>
          <div className="font-display font-extrabold text-3xl text-white mt-1">{stats.gamesPlayed}</div>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-white/10 text-center">
          <div className="text-xs text-gray-400 uppercase font-semibold">Win Rate</div>
          <div className="font-display font-extrabold text-3xl text-emerald-400 mt-1">{stats.winRate}%</div>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-white/10 text-center">
          <div className="text-xs text-gray-400 uppercase font-semibold">Current Streak</div>
          <div className="font-display font-extrabold text-3xl text-amber-400 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-6 h-6 fill-amber-400" /> {stats.currentStreak}
          </div>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-white/10 text-center">
          <div className="text-xs text-gray-400 uppercase font-semibold">Best Streak</div>
          <div className="font-display font-extrabold text-3xl text-amber-500 mt-1">{stats.bestStreak}</div>
        </div>
      </div>

      {/* Guess Distribution Bar Chart */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-4">
        <h2 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" /> GUESS DISTRIBUTION
        </h2>

        <div className="flex flex-col gap-2">
          {Object.entries(stats.guessDistribution).map(([guessNum, count]) => {
            const maxCount = 18;
            const widthPct = Math.max((count / maxCount) * 100, 8);
            return (
              <div key={guessNum} className="flex items-center gap-3 text-xs">
                <span className="w-4 font-bold text-gray-300">{guessNum}</span>
                <div className="flex-1 bg-white/5 rounded-lg h-6 overflow-hidden">
                  <div
                    style={{ width: `${widthPct}%` }}
                    className="h-full bg-amber-500 rounded-lg flex items-center justify-end px-2 font-bold text-black text-[11px]"
                  >
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> UNLOCKED ACHIEVEMENTS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.code}
              className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                ach.unlocked
                  ? 'bg-amber-500/10 border-amber-500/30 text-white'
                  : 'bg-white/5 border-white/5 text-gray-500 opacity-60'
              }`}
            >
              <div className="text-2xl">{ach.title.split(' ')[0]}</div>
              <div>
                <div className="font-display font-bold text-sm">{ach.title}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{ach.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
