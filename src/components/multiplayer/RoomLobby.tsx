'use client';

import React, { useState } from 'react';
import { Room, RoomPlayer, MatchSettings } from '@/types/multiplayer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Share2,
  Users,
  Settings,
  Play,
  Crown,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Globe,
  Clock,
  Flame,
  UserCheck,
  Plus
} from 'lucide-react';

interface RoomLobbyProps {
  room: Room;
  currentPlayerId: string;
  onStartGame: () => void;
  onUpdateSettings: (settings: Partial<MatchSettings>) => void;
  onLeaveRoom: () => void;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({
  room,
  currentPlayerId,
  onStartGame,
  onUpdateSettings,
  onLeaveRoom,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  const isHost = room.hostId === currentPlayerId;
  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/online?join=${room.code}` : `http://localhost:3001/online?join=${room.code}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`🏏 Join my Cricket Multiplayer Room! Code: ${room.code} - Link: ${inviteLink}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`🏏 Join my Cricket Multiplayer Room! Code: ${room.code}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Room Header Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>REAL-TIME MULTIPLAYER LOBBY</span>
        </div>

        {/* Room Code Showcase */}
        <div className="space-y-3">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block">
            ROOM CODE
          </span>
          <div className="inline-flex items-center justify-center space-x-3 px-6 py-3 rounded-2xl bg-slate-950/80 border-2 border-emerald-500/50 shadow-2xl">
            <span className="text-3xl md:text-5xl font-black tracking-widest text-emerald-400 font-mono">
              {room.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
              title="Copy Room Code"
            >
              {copiedCode ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Quick Invite Share Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer border border-slate-700"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
            <span>{copiedLink ? 'LINK COPIED!' : 'COPY INVITE LINK'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>💬 WHATSAPP</span>
          </button>

          <button
            onClick={handleShareTelegram}
            className="px-4 py-2.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-400 text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>✈️ TELEGRAM</span>
          </button>
        </div>
      </div>

      {/* Players List Grid (2 to 8 Players) */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-black text-slate-100">
              JOINED PLAYERS ({room.players.length} / {room.maxPlayers})
            </h3>
          </div>

          {isHost && (
            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>ROOM SETTINGS</span>
            </button>
          )}
        </div>

        {/* Host Settings Drawer */}
        <AnimatePresence>
          {showSettingsDrawer && isHost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4"
            >
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                HOST MATCH CONFIGURATION
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Rounds */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold block">Rounds</label>
                  <select
                    value={room.settings.rounds}
                    onChange={(e) => onUpdateSettings({ rounds: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold"
                  >
                    <option value={3}>3 Rounds</option>
                    <option value={5}>5 Rounds</option>
                    <option value={8}>8 Rounds</option>
                  </select>
                </div>

                {/* Timer Limit */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold block">Time Limit</label>
                  <select
                    value={room.settings.timeLimitSeconds}
                    onChange={(e) => onUpdateSettings({ timeLimitSeconds: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold"
                  >
                    <option value={30}>30 Seconds</option>
                    <option value={45}>45 Seconds</option>
                    <option value={60}>60 Seconds</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold block">Difficulty</label>
                  <select
                    value={room.settings.difficulty}
                    onChange={(e) => onUpdateSettings({ difficulty: e.target.value as MatchSettings['difficulty'] })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2 to 8 Player Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {room.players.map((p) => (
            <div
              key={p.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                p.id === currentPlayerId
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={p.avatar}
                    alt={p.username}
                    className="w-11 h-11 rounded-xl bg-slate-800 p-1 border border-slate-700 object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-slate-100 text-sm">{p.username}</span>
                    {p.isHost && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-black uppercase">
                        HOST
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Rating: {p.rating} ({p.tier})</span>
                </div>
              </div>
            </div>
          ))}

          {/* Empty Player Slots */}
          {Array.from({ length: room.maxPlayers - room.players.length }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/20 flex items-center justify-center text-slate-600 text-xs font-bold space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>WAITING FOR PLAYER...</span>
            </div>
          ))}
        </div>

        {/* Start Game Footer Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <button
            onClick={onLeaveRoom}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
          >
            LEAVE ROOM
          </button>

          {isHost ? (
            <button
              onClick={onStartGame}
              disabled={room.players.length < 1}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-3 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>START MULTIPLAYER MATCH</span>
            </button>
          ) : (
            <div className="text-xs font-bold text-amber-400 flex items-center space-x-2 bg-amber-500/10 px-4 py-3 rounded-xl border border-amber-500/30">
              <Clock className="w-4 h-4 animate-spin text-amber-400" />
              <span>WAITING FOR HOST TO START GAME...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
