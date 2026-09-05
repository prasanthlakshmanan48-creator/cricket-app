'use client';

import React from 'react';
import { RoundSummary } from '@/types/quiz';
import { motion } from 'framer-motion';
import { Trophy, Award, RotateCcw, Share2, Star, CheckCircle2 } from 'lucide-react';

interface QuizVictoryModalProps {
  totalScore: number;
  totalPoints: number;
  maxStreak: number;
  roundSummaries: RoundSummary[];
  onPlayAgain: () => void;
}

export const QuizVictoryModal: React.FC<QuizVictoryModalProps> = ({
  totalScore,
  totalPoints,
  maxStreak,
  roundSummaries,
  onPlayAgain,
}) => {
  const totalQuestions = 48; // 4 rounds x 12 questions
  const overallAccuracy = Math.round((totalScore / totalQuestions) * 100);

  let rankTitle = 'Cricket Enthusiast';
  if (overallAccuracy >= 90) rankTitle = '🏛 Legendary Cricket Scholar';
  else if (overallAccuracy >= 75) rankTitle = '👑 Cricket Grandmaster';
  else if (overallAccuracy >= 60) rankTitle = '⚡ Tactical Master';

  const handleShare = () => {
    const shareText = `🏏 I scored ${totalScore}/48 (${overallAccuracy}%) with a ${maxStreak}x Streak on Who's That Cricketer 4-Round Quiz Tournament! Can you beat my score?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      alert('Tournament score copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-xl p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden my-8"
      >
        {/* Top Trophy Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-72 h-72 bg-gradient-to-br from-amber-500/20 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Big Champion Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-400 p-1 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full shadow-lg">
            4/4 COMPLETE
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-100">
            Tournament Complete!
          </h2>
          <p className="text-sm font-extrabold text-amber-400 tracking-wide">
            {rankTitle}
          </p>
        </div>

        {/* Top Overall Stats Banner */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 block">Total Score</span>
            <span className="text-2xl font-black text-emerald-400">
              {totalScore} / {totalQuestions}
            </span>
          </div>

          <div className="space-y-1 border-x border-slate-800">
            <span className="text-xs font-medium text-slate-400 block">Accuracy</span>
            <span className="text-2xl font-black text-cyan-400">
              {overallAccuracy}%
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 block">Max Streak</span>
            <span className="text-2xl font-black text-amber-400 flex items-center justify-center space-x-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{maxStreak}x</span>
            </span>
          </div>
        </div>

        {/* 4 Round Breakdown Table */}
        <div className="space-y-3 text-left">
          <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            Round-by-Round Breakdown (12 Qs per Round)
          </h4>

          <div className="space-y-2">
            {roundSummaries.map((r, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-800 text-xs font-black text-slate-300">
                    R{r.roundNumber}
                  </span>
                  <div>
                    <span className="font-bold text-slate-200 block">{r.roundName}</span>
                    <span className="text-xs text-slate-500 font-medium">{r.accuracyPercentage}% Accuracy</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-black text-emerald-400">
                    {r.score} / {r.totalQuestions}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleShare}
            className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer border border-slate-700"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>SHARE RESULT</span>
          </button>

          <button
            onClick={onPlayAgain}
            className="py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
