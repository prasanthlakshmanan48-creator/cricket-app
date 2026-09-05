'use client';

import React from 'react';
import { RoundSummary } from '@/types/quiz';
import { getRoundMetadata } from '@/lib/quiz-engine';
import { motion } from 'framer-motion';
import { Trophy, Award, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

interface RoundSummaryModalProps {
  summary: RoundSummary;
  onProceedToNextRound: () => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  summary,
  onProceedToNextRound,
}) => {
  const nextRoundNumber = summary.roundNumber + 1;
  const isFinalRound = summary.roundNumber >= 4;
  const nextRoundMeta = getRoundMetadata(nextRoundNumber);

  let performanceTitle = 'Solid Effort!';
  let badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  if (summary.accuracyPercentage >= 90) {
    performanceTitle = '👑 Cricket Genius!';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (summary.accuracyPercentage >= 70) {
    performanceTitle = '⚡ Outstanding Knowledge!';
    badgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-lg p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Round Badge */}
        <div className="flex justify-center">
          <div className={`px-4 py-1.5 rounded-full border text-xs font-black tracking-widest uppercase ${badgeColor}`}>
            {summary.roundName} Complete
          </div>
        </div>

        {/* Icon & Title */}
        <div className="space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Trophy className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-100">
            {performanceTitle}
          </h2>
          <p className="text-sm text-slate-400">
            You completed 12 questions in {summary.roundName}!
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 block">Score</span>
            <span className="text-xl md:text-2xl font-black text-emerald-400">
              {summary.score} / {summary.totalQuestions}
            </span>
          </div>

          <div className="space-y-1 border-x border-slate-800">
            <span className="text-xs font-medium text-slate-400 block">Accuracy</span>
            <span className="text-xl md:text-2xl font-black text-cyan-400">
              {summary.accuracyPercentage}%
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 block">Points</span>
            <span className="text-xl md:text-2xl font-black text-amber-400 flex items-center justify-center space-x-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>+{summary.totalPoints}</span>
            </span>
          </div>
        </div>

        {/* Next Round Info Box */}
        {!isFinalRound && (
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-left space-y-1">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block">
              UP NEXT: ROUND {nextRoundNumber} OF 4
            </span>
            <h4 className="text-base font-bold text-slate-100 flex items-center justify-between">
              <span>{nextRoundMeta.title}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 font-extrabold">
                12 QUESTIONS
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              {nextRoundMeta.subtitle}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onProceedToNextRound}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base tracking-wide shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-3 transition-all cursor-pointer"
        >
          <span>
            {!isFinalRound ? `PROCEED TO ROUND ${nextRoundNumber}` : 'VIEW TOURNAMENT SUMMARY'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
