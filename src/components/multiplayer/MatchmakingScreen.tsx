'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Zap, X, Swords } from 'lucide-react';
import { MatchFoundPayload } from '@/types/multiplayer';

interface MatchmakingScreenProps {
  userRating: number;
  userTier: string;
  onMatchFound: (payload: MatchFoundPayload) => void;
  onCancel: () => void;
}

export const MatchmakingScreen: React.FC<MatchmakingScreenProps> = ({
  userRating,
  userTier,
  onMatchFound,
  onCancel,
}) => {
  const [searchTimeSeconds, setSearchTimeSeconds] = useState(0);
  const [searchRange, setSearchRange] = useState(100);
  const [matchFoundPayload, setMatchFoundPayload] = useState<MatchFoundPayload | null>(null);
  const [countdown, setCountdown] = useState(3);

  // Simulate matchmaking search & range expansion
  useEffect(() => {
    const timer = setInterval(() => {
      setSearchTimeSeconds((prev) => {
        const nextTime = prev + 1;
        if (nextTime > 20) setSearchRange(400);
        else if (nextTime > 10) setSearchRange(200);
        return nextTime;
      });
    }, 1000);

    // Simulate opponent found after 4 seconds
    const matchTimer = setTimeout(() => {
      const payload: MatchFoundPayload = {
        matchId: `match_${Date.now()}`,
        roomCode: 'CRIC-MATCH1',
        opponent: {
          id: 'op_8492',
          username: 'Master Spinner 🏏',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MasterSpinner',
          rating: userRating + 24,
          tier: 'GOLD',
          countryCode: 'AU',
          winRate: 68,
          streak: 4,
        },
        countdownSeconds: 3,
      };
      setMatchFoundPayload(payload);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimer);
    };
  }, [userRating]);

  // Countdown timer after match found
  useEffect(() => {
    if (!matchFoundPayload) return;

    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countInterval);
          onMatchFound(matchFoundPayload);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countInterval);
  }, [matchFoundPayload, onMatchFound]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
      <AnimatePresence mode="wait">
        {!matchFoundPayload ? (
          /* Searching State */
          <motion.div
            key="searching"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Radar Animation */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-400"
              />
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center">
                <Search className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-100">
                FINDING OPPONENT...
              </h2>
              <p className="text-xs text-slate-400">
                Searching ranked 1v1 queue ({searchTimeSeconds}s)
              </p>
            </div>

            {/* Search Range Meter */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">YOUR RATING</span>
                <span className="text-emerald-400">{userRating} ({userTier})</span>
              </div>
              <div className="flex justify-between text-xs font-bold border-t border-slate-800/80 pt-2">
                <span className="text-slate-400">SEARCH RANGE</span>
                <span className="text-cyan-400">±{searchRange} Rating Points</span>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>CANCEL MATCHMAKING</span>
            </button>
          </motion.div>
        ) : (
          /* Match Found State */
          <motion.div
            key="found"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-lg p-8 rounded-3xl bg-slate-900 border-2 border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.3)] text-center space-y-6 relative overflow-hidden"
          >
            {/* Match Found Banner */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest animate-bounce">
              <Swords className="w-4 h-4" />
              <span>MATCH FOUND!</span>
            </div>

            {/* VS Card Layout */}
            <div className="grid grid-cols-5 items-center gap-2 p-5 rounded-2xl bg-slate-950/90 border border-slate-800">
              {/* You */}
              <div className="col-span-2 space-y-2 text-center">
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=You"
                  alt="You"
                  className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 p-1 border-2 border-emerald-400"
                />
                <span className="text-sm font-black text-slate-100 block truncate">YOU</span>
                <span className="text-xs font-bold text-emerald-400 block">{userRating} Rating</span>
              </div>

              {/* VS Icon */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-red-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg">
                  VS
                </span>
              </div>

              {/* Opponent */}
              <div className="col-span-2 space-y-2 text-center">
                <img
                  src={matchFoundPayload.opponent.avatar}
                  alt={matchFoundPayload.opponent.username}
                  className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 p-1 border-2 border-amber-400"
                />
                <span className="text-sm font-black text-slate-100 block truncate">
                  {matchFoundPayload.opponent.username}
                </span>
                <span className="text-xs font-bold text-amber-400 block">
                  {matchFoundPayload.opponent.rating} ({matchFoundPayload.opponent.tier})
                </span>
              </div>
            </div>

            {/* 3-2-1 Countdown */}
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block">
                GET READY... MATCH STARTING IN
              </span>
              <span className="text-5xl font-black text-emerald-400 font-mono block">
                {countdown}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
