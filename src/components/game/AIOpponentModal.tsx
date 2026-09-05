'use client';

import React, { useState } from 'react';
import { AIDifficulty } from '@/types/game-extension';
import { soundFx } from '@/lib/sound-engine';
import { Bot, Zap, ShieldAlert, Award, Play } from 'lucide-react';

interface AIOpponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (difficulty: AIDifficulty, questionCount: number) => void;
}

export const AIOpponentModal: React.FC<AIOpponentModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty>('MEDIUM');
  const [questionCount, setQuestionCount] = useState<number>(8);

  if (!isOpen) return null;

  const difficultyLevels: { id: AIDifficulty; label: string; desc: string; delay: string; color: string }[] = [
    {
      id: 'EASY',
      label: 'EASY',
      desc: 'Frequent mistakes, casual response speed.',
      delay: '8–20s response delay',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'MEDIUM',
      label: 'MEDIUM',
      desc: 'Balanced accuracy and realistic thinking time.',
      delay: '5–15s response delay',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400',
    },
    {
      id: 'HARD',
      label: 'HARD',
      desc: 'High accuracy, sharp candidate filtering.',
      delay: '3–10s response delay',
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/40 text-rose-400',
    },
    {
      id: 'EXPERT',
      label: 'EXPERT',
      desc: 'Fast reaction, highly competitive master AI.',
      delay: '1–6s response delay',
      color: 'from-purple-500/20 to-violet-500/10 border-purple-500/40 text-purple-400',
    },
  ];

  const handleStart = () => {
    soundFx.playClick();
    onStartGame(selectedDifficulty, questionCount);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col gap-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-white flex items-center gap-2">
                PLAY WITH <span className="text-amber-400">CRICKET AI</span>
              </h2>
              <p className="text-xs text-slate-400">
                Single-player offline match against an intelligent bot opponent.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="text-xs font-black text-slate-300 uppercase tracking-wider block mb-3">
            Select AI Difficulty
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {difficultyLevels.map((lvl) => {
              const isSelected = selectedDifficulty === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedDifficulty(lvl.id);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                    isSelected
                      ? `bg-gradient-to-br ${lvl.color} ring-2 ring-amber-400/50 shadow-lg`
                      : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm">{lvl.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">{lvl.delay}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{lvl.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Count Selection */}
        <div>
          <label className="text-xs font-black text-slate-300 uppercase tracking-wider block mb-3">
            Game Length (Questions)
          </label>
          <div className="flex items-center gap-2">
            {[5, 8, 10, 15, 20].map((num) => (
              <button
                key={num}
                onClick={() => setQuestionCount(num)}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-black transition-all ${
                  questionCount === num
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {num} Qs
              </button>
            ))}
          </div>
        </div>

        {/* Action CTA */}
        <div className="pt-2">
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all"
          >
            <Play className="w-5 h-5 fill-slate-950" /> START MATCH VS CRICKET AI
          </button>
        </div>
      </div>
    </div>
  );
};
