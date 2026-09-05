'use client';

import React from 'react';
import { RoomPlayer } from '@/types/multiplayer';
import { motion } from 'framer-motion';
import { Trophy, Award, RotateCcw, Share2, Star, TrendingUp, Users } from 'lucide-react';

interface MatchResultPodiumProps {
  players: RoomPlayer[];
  currentPlayerId: string;
  onRematch: () => void;
  onExit: () => void;
}

export const MatchResultPodium: React.FC<MatchResultPodiumProps> = ({
  players,
  currentPlayerId,
  onRematch,
  onExit,
}) => {
  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const first = sortedPlayers[0];
  const second = sortedPlayers[1];
  const third = sortedPlayers[2];

  const currentPlayer = players.find((p) => p.id === currentPlayerId) || sortedPlayers[0];
  const isWinner = first?.id === currentPlayerId;
  const ratingChange = isWinner ? +24 : -18;
  const newRating = Math.max(800, currentPlayer.rating + ratingChange);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Top Victory Banner */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 backdrop-blur-2xl shadow-2xl text-center space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Rating Change Banner */}
        <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-slate-950/80 border border-emerald-500/50 shadow-xl">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">RATING UPDATE:</span>
          <span className="text-sm font-black text-slate-100">{currentPlayer.rating}</span>
          <span className={`text-xs font-black ${ratingChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {ratingChange >= 0 ? `+${ratingChange}` : ratingChange}
          </span>
          <span className="text-sm font-black text-emerald-400">➔ {newRating}</span>
        </div>

        {/* 3D Podium Display */}
        <div className="pt-6 pb-2 flex items-end justify-center gap-3 sm:gap-6 max-w-xl mx-auto">
          {/* 2nd Place */}
          {second && (
            <div className="flex flex-col items-center flex-1 space-y-2">
              <img
                src={second.avatar}
                alt={second.username}
                className="w-12 h-12 rounded-2xl bg-slate-800 p-1 border-2 border-slate-400 shadow-lg"
              />
              <span className="text-xs font-black text-slate-200 truncate max-w-[90px]">{second.username}</span>
              <span className="text-xs font-extrabold text-slate-400">{second.score} pts</span>
              <div className="w-full h-28 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700/80 border-t-2 border-slate-400 flex items-center justify-center font-black text-xl text-slate-300">
                🥈 2nd
              </div>
            </div>
          )}

          {/* 1st Place */}
          {first && (
            <div className="flex flex-col items-center flex-1 space-y-2 -mt-4">
              <div className="relative">
                <Trophy className="w-6 h-6 text-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
                <img
                  src={first.avatar}
                  alt={first.username}
                  className="w-16 h-16 rounded-2xl bg-slate-800 p-1 border-2 border-amber-400 shadow-2xl"
                />
              </div>
              <span className="text-sm font-black text-amber-400 truncate max-w-[100px]">{first.username}</span>
              <span className="text-sm font-black text-emerald-400">{first.score} pts</span>
              <div className="w-full h-36 rounded-t-2xl bg-gradient-to-t from-amber-500/30 via-emerald-600/30 to-teal-500/40 border-t-2 border-amber-400 flex items-center justify-center font-black text-2xl text-amber-300 shadow-2xl">
                🥇 1st
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {third && (
            <div className="flex flex-col items-center flex-1 space-y-2">
              <img
                src={third.avatar}
                alt={third.username}
                className="w-12 h-12 rounded-2xl bg-slate-800 p-1 border-2 border-amber-700 shadow-lg"
              />
              <span className="text-xs font-black text-slate-200 truncate max-w-[90px]">{third.username}</span>
              <span className="text-xs font-extrabold text-slate-400">{third.score} pts</span>
              <div className="w-full h-20 rounded-t-2xl bg-gradient-to-t from-slate-900 to-amber-950/60 border-t-2 border-amber-700 flex items-center justify-center font-black text-lg text-amber-600">
                🥉 3rd
              </div>
            </div>
          )}
        </div>

        {/* Detailed Leaderboard List */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-left">
          <span className="text-xs font-black text-slate-400 tracking-wider uppercase block">
            FINAL MATCH STANDINGS
          </span>
          <div className="space-y-2">
            {sortedPlayers.map((p, idx) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold ${
                  p.id === currentPlayerId
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-black">
                    #{idx + 1}
                  </span>
                  <span>{p.username}</span>
                </div>
                <span className="font-black text-emerald-400 text-sm">{p.score} Points</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onExit}
            className="py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border border-slate-700"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>MULTIPLAYER HUB</span>
          </button>

          <button
            onClick={onRematch}
            className="py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs tracking-wide flex items-center justify-center space-x-2 transition-all shadow-xl shadow-emerald-500/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>QUICK REMATCH</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
