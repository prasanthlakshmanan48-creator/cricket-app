'use client';

import React from 'react';
import { Check, AlertCircle, X } from 'lucide-react';
import { GuessFeedback, MatchStatus } from '@/types/game';

interface GuessHistoryRowProps {
  guess: GuessFeedback;
}

export const GuessHistoryRow: React.FC<GuessHistoryRowProps> = ({ guess }) => {
  const getBadgeStyle = (status: MatchStatus) => {
    switch (status) {
      case 'MATCH':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'CLOSE':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MISMATCH':
      default:
        return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  const getStatusIcon = (status: MatchStatus) => {
    switch (status) {
      case 'MATCH':
        return <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />;
      case 'CLOSE':
        return <AlertCircle className="w-3 h-3 text-amber-400 stroke-[3]" />;
      case 'MISMATCH':
      default:
        return <X className="w-3 h-3 text-gray-500" />;
    }
  };

  const attrs = guess.attributes;

  return (
    <div className="w-full glass-panel border border-white/10 rounded-2xl p-4 flex flex-col gap-3 animate-row-slide">
      {/* Header Row: Attempt Number & Player Name */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-bold text-xs text-amber-400">
            0{guess.attemptNumber}
          </div>
          <img
            src={guess.guessedPlayerImage}
            alt={guess.guessedPlayerName}
            className="w-8 h-8 rounded-full object-cover border border-white/10"
          />
          <span className="font-display font-bold text-sm sm:text-base text-white">
            {guess.guessedPlayerName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {guess.isCorrect ? (
            <span className="px-3 py-1 bg-emerald-500 text-black font-extrabold text-xs rounded-full flex items-center gap-1 shadow-lg shadow-emerald-500/20">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> CORRECT TARGET
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 text-xs rounded-full">
              Attempt {guess.attemptNumber} / 8
            </span>
          )}
        </div>
      </div>

      {/* Grid of Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Country */}
        <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${getBadgeStyle(attrs.country.status)}`}>
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-75 flex items-center justify-between">
            <span>Country</span>
            {getStatusIcon(attrs.country.status)}
          </div>
          <div className="text-xs font-semibold truncate">{attrs.country.value}</div>
          {attrs.country.hintMessage && (
            <div className="text-[9px] font-bold text-amber-300">{attrs.country.hintMessage}</div>
          )}
        </div>

        {/* Role */}
        <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${getBadgeStyle(attrs.role.status)}`}>
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-75 flex items-center justify-between">
            <span>Role</span>
            {getStatusIcon(attrs.role.status)}
          </div>
          <div className="text-xs font-semibold truncate">{attrs.role.value}</div>
        </div>

        {/* Batting Style */}
        <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${getBadgeStyle(attrs.battingStyle.status)}`}>
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-75 flex items-center justify-between">
            <span>Batting</span>
            {getStatusIcon(attrs.battingStyle.status)}
          </div>
          <div className="text-xs font-semibold truncate">{attrs.battingStyle.value}</div>
        </div>

        {/* Debut Decade */}
        <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${getBadgeStyle(attrs.debutDecade.status)}`}>
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-75 flex items-center justify-between">
            <span>Debut Era</span>
            {getStatusIcon(attrs.debutDecade.status)}
          </div>
          <div className="text-xs font-semibold truncate">{attrs.debutDecade.value}</div>
          {attrs.debutDecade.hintMessage && (
            <div className="text-[9px] font-bold text-amber-300">{attrs.debutDecade.hintMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};
