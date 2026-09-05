'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Share2, RotateCcw, Clock, Flame, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '@/lib/sound-engine';

interface ResultModalProps {
  isOpen: boolean;
  isWon: boolean;
  attemptsCount: number;
  maxAttempts?: number;
  playerName: string;
  playerCountry: string;
  playerRole: string;
  playerSpan: string;
  playerImage: string;
  statsOverview?: { format: string; matches: number; runs: number; wickets: number; avg: number | null }[];
  onShare: () => void;
  onRestart: () => void;
  mode?: string;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  isWon,
  attemptsCount,
  maxAttempts = 8,
  playerName,
  playerCountry,
  playerRole,
  playerSpan,
  playerImage,
  statsOverview = [],
  onShare,
  onRestart,
  mode = 'DAILY',
}) => {
  const [countdown, setCountdown] = useState('14:22:08');

  useEffect(() => {
    if (isOpen && isWon) {
      soundFx.playCorrect();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#ffffff', '#eab308'],
      });
    } else if (isOpen && !isWon) {
      soundFx.playWrong();
    }
  }, [isOpen, isWon]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-reveal-pop">
      <div className="relative w-full max-w-lg glass-panel border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="text-center flex flex-col items-center gap-2">
          {isWon ? (
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <Trophy className="w-7 h-7 animate-bounce" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <XCircle className="w-7 h-7" />
            </div>
          )}

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            {isWon ? '🎯 YOU GOT IT!' : 'OUT OF ATTEMPTS!'}
          </h2>

          <p className="text-xs text-gray-400 font-medium">
            {isWon
              ? `Solved in ${attemptsCount} ${attemptsCount === 1 ? 'guess' : 'guesses'}!`
              : `The correct cricketer was...`}
          </p>
        </div>

        {/* Player Profile Snapshot Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <img
            src={playerImage}
            alt={playerName}
            className="w-20 h-20 rounded-2xl object-cover border border-amber-500/30 shadow-lg"
          />
          <div>
            <h3 className="font-display font-extrabold text-lg text-white">{playerName}</h3>
            <p className="text-xs text-amber-400 font-semibold">{playerCountry} • {playerRole}</p>
            <p className="text-xs text-gray-400 mt-1">Career Span: {playerSpan}</p>
          </div>
        </div>

        {/* Career Stats Grid */}
        {statsOverview.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {statsOverview.slice(0, 3).map((st) => (
              <div key={st.format} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{st.format}</div>
                <div className="font-display font-bold text-sm text-white mt-1">{st.runs} Runs</div>
                <div className="text-[10px] text-gray-400">{st.wickets} Wkts • {st.avg ? `${st.avg} Avg` : ''}</div>
              </div>
            ))}
          </div>
        )}

        {/* Mode Specific Timer / Info */}
        {mode === 'DAILY' && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-400 font-bold">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Next Daily Challenge:
            </div>
            <span className="font-mono tabular-nums text-sm text-white">{countdown}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={() => {
              soundFx.playClick();
              onShare();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
          >
            <Share2 className="w-4 h-4" /> SHARE RESULT
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onRestart();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> {mode === 'DAILY' ? 'PRACTICE MODE' : 'PLAY AGAIN'}
          </button>
        </div>
      </div>
    </div>
  );
};
