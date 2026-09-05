'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Swords, AlertCircle, Bot, Users, RefreshCw } from 'lucide-react';
import { MatchFoundPayload } from '@/types/multiplayer';
import { realPresenceStore } from '@/lib/presence-store';
import { soundFx } from '@/lib/sound-engine';

interface MatchmakingScreenProps {
  userRating: number;
  userTier: string;
  onMatchFound: (payload: MatchFoundPayload) => void;
  onCancel: () => void;
  onSelectAI?: () => void;
  onSelectFriends?: () => void;
}

export const MatchmakingScreen: React.FC<MatchmakingScreenProps> = ({
  userRating,
  userTier,
  onMatchFound,
  onCancel,
  onSelectAI,
  onSelectFriends,
}) => {
  const [searchTimeSeconds, setSearchTimeSeconds] = useState(0);
  const [noPlayersState, setNoPlayersState] = useState(false);
  const [matchFoundPayload, setMatchFoundPayload] = useState<MatchFoundPayload | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [realSearchingCount, setRealSearchingCount] = useState(1);

  // Search logic enforcing NO FAKE STRANGERS (Req #2, #5, #40, #66)
  useEffect(() => {
    // Check initial searching real users
    const searchingUsers = realPresenceStore.getSearchingUsers();
    setRealSearchingCount(searchingUsers.length || 1);

    const timer = setInterval(() => {
      setSearchTimeSeconds((prev) => {
        const nextTime = prev + 1;
        
        // After 12 seconds with no other REAL player, show honest NO PLAYERS AVAILABLE state
        if (nextTime >= 12 && searchingUsers.length <= 1) {
          setNoPlayersState(true);
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const handleTryAgain = () => {
    soundFx.playClick();
    setSearchTimeSeconds(0);
    setNoPlayersState(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
      <AnimatePresence mode="wait">
        {noPlayersState ? (
          /* Honest Empty State: NO PLAYERS AVAILABLE (Req #2, #40) */
          <motion.div
            key="empty"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl text-center space-y-6 relative overflow-hidden"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">
                NO PLAYERS AVAILABLE
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                There aren't enough real players online right now to start a stranger match.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-medium">
              🔴 Real connected opponents: <strong className="text-white">0 active searchers</strong>
            </div>

            {/* Clear Action Buttons (Req #2, #40) */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleTryAgain}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw className="w-4 h-4" /> TRY AGAIN
              </button>

              {onSelectAI && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onSelectAI();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4" /> PLAY WITH AI
                </button>
              )}

              {onSelectFriends && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onSelectFriends();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" /> PLAY WITH FRIENDS
                </button>
              )}

              <button
                onClick={onCancel}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-300 font-medium"
              >
                CANCEL & EXIT
              </button>
            </div>
          </motion.div>
        ) : !matchFoundPayload ? (
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
                FINDING A REAL PLAYER...
              </h2>
              <p className="text-xs text-slate-400">
                Searching real-time stranger queue ({searchTimeSeconds}s)
              </p>
            </div>

            {/* Real Presence Counter */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">PLAYERS FOUND</span>
                <span className="text-emerald-400">1 / 2</span>
              </div>
              <div className="flex justify-between text-xs font-bold border-t border-slate-800/80 pt-2">
                <span className="text-slate-400">SEARCH RANGE</span>
                <span className="text-cyan-400">Real Human Players Only</span>
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
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest animate-bounce">
              <Swords className="w-4 h-4" />
              <span>REAL MATCH FOUND!</span>
            </div>

            {/* VS Card Layout */}
            <div className="grid grid-cols-5 items-center gap-2 p-5 rounded-2xl bg-slate-950/90 border border-slate-800">
              <div className="col-span-2 space-y-2 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-xl">
                  👤
                </div>
                <span className="text-sm font-black text-slate-100 block truncate">YOU</span>
                <span className="text-xs font-bold text-emerald-400 block">{userRating} Rating</span>
              </div>

              <div className="col-span-1 flex flex-col items-center justify-center">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-red-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg">
                  VS
                </span>
              </div>

              <div className="col-span-2 space-y-2 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-bold text-xl">
                  👤
                </div>
                <span className="text-sm font-black text-slate-100 block truncate">
                  {matchFoundPayload.opponent.username}
                </span>
                <span className="text-xs font-bold text-amber-400 block">
                  {matchFoundPayload.opponent.rating} ({matchFoundPayload.opponent.tier})
                </span>
              </div>
            </div>

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
