'use client';

import React from 'react';
import { Lock, Sparkles, HelpCircle } from 'lucide-react';
import { GameClue } from '@/types/game';

interface ClueListProps {
  clues: GameClue[];
  attemptsCount: number;
  maxAttempts?: number;
}

export const ClueList: React.FC<ClueListProps> = ({
  clues,
  attemptsCount,
  maxAttempts = 8,
}) => {
  const totalClueSlots = [
    { attempt: 2, label: 'Country Hint' },
    { attempt: 3, label: 'Role & Skill Hint' },
    { attempt: 4, label: 'Batting Technique' },
    { attempt: 5, label: 'Debut Year & Era' },
    { attempt: 6, label: 'Leagues & Tournaments' },
    { attempt: 7, label: 'Signature Detail / Jersey' },
  ];

  return (
    <div className="w-full glass-panel border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Smart Clues Engine
          </h3>
        </div>
        <span className="text-xs text-gray-400">
          {clues.length} / {totalClueSlots.length} Unlocked
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {totalClueSlots.map((slot, idx) => {
          const unlockedClue = clues.find((c) => c.unlockedAtAttempt === slot.attempt);
          const isUnlocked = !!unlockedClue;

          return (
            <div
              key={slot.attempt}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                isUnlocked
                  ? 'bg-amber-500/10 border-amber-500/30 text-white'
                  : 'bg-white/5 border-white/5 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isUnlocked ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {isUnlocked ? unlockedClue.icon : <Lock className="w-3.5 h-3.5" />}
                </div>

                <div>
                  <div className="text-xs font-semibold">
                    {isUnlocked ? unlockedClue.label : slot.label}
                  </div>
                  <div className="text-xs text-amber-300 font-bold mt-0.5">
                    {isUnlocked ? unlockedClue.value : `Unlocks on Guess #${slot.attempt}`}
                  </div>
                </div>
              </div>

              {!isUnlocked && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                  Locked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
