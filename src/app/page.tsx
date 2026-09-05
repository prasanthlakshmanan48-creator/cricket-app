'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Users, 
  Globe, 
  Bot, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Zap, 
  Flame,
  Clock,
  Lightbulb,
  Radio
} from 'lucide-react';
import { realPresenceStore } from '@/lib/presence-store';
import { AIOpponentModal } from '@/components/game/AIOpponentModal';
import { AIBoard } from '@/components/game/AIBoard';
import { MatchmakingScreen } from '@/components/multiplayer/MatchmakingScreen';
import { AIDifficulty } from '@/types/game-extension';
import { soundFx } from '@/lib/sound-engine';

export default function LandingPage() {
  const [onlineStats, setOnlineStats] = useState({ onlineCount: 14, searchingCount: 3 });
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeAIMatch, setActiveAIMatch] = useState<{ difficulty: AIDifficulty; questionCount: number } | null>(null);
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);

  useEffect(() => {
    // Fetch honest real-time presence
    const stats = realPresenceStore.getPresenceStats();
    setOnlineStats({
      onlineCount: Math.max(1, stats.onlineCount),
      searchingCount: stats.searchingCount,
    });
  }, []);

  const handleStartAI = (difficulty: AIDifficulty, questionCount: number) => {
    setAiModalOpen(false);
    setActiveAIMatch({ difficulty, questionCount });
  };

  if (activeAIMatch) {
    return (
      <div className="pt-8 pb-16 px-4 max-w-5xl mx-auto">
        <AIBoard
          difficulty={activeAIMatch.difficulty}
          totalQuestions={activeAIMatch.questionCount}
          onExit={() => setActiveAIMatch(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center max-w-5xl mx-auto">
        
        {/* Live Presence Pill (Req #3) */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs font-bold shadow-xl mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-mono font-black">{onlineStats.onlineCount} Players Online</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">{onlineStats.searchingCount} Searching</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white leading-none">
          WHO'S THAT <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
            CRICKETER?
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl font-medium leading-relaxed">
          The ultimate cricket guessing platform with intelligent question engine, per-question timers, smart hints & honest real-time matchmaking.
        </p>

        {/* Primary 4 Game Modes Grid (Req #1, #39, #70) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full text-left">
          
          {/* Mode 1: PLAY SOLO */}
          <Link
            href="/practice"
            onClick={() => soundFx.playClick()}
            className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 bg-gradient-to-b from-emerald-500/10 to-transparent flex flex-col justify-between gap-6 transition-all hover:-translate-y-1 shadow-xl group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl">
                👤
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                SOLO
              </span>
            </div>
            <div>
              <h3 className="font-black text-xl text-white group-hover:text-emerald-400 transition-colors">
                PLAY SOLO
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Test your knowledge alone. Per-question timer, smart hints & non-repeating player pool.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>START SOLO GAME</span> <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Mode 2: PLAY WITH FRIENDS */}
          <Link
            href="/online?mode=friends"
            onClick={() => soundFx.playClick()}
            className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-500/60 bg-gradient-to-b from-cyan-500/10 to-transparent flex flex-col justify-between gap-6 transition-all hover:-translate-y-1 shadow-xl group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl">
                👥
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                FRIENDS
              </span>
            </div>
            <div>
              <h3 className="font-black text-xl text-white group-hover:text-cyan-400 transition-colors">
                PLAY WITH FRIENDS
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Create a private room with join code. Play together with real friends in real-time.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>CREATE ROOM</span> <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Mode 3: PLAY WITH STRANGERS */}
          <button
            onClick={() => {
              soundFx.playClick();
              setMatchmakingOpen(true);
            }}
            className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-500/60 bg-gradient-to-b from-purple-500/10 to-transparent flex flex-col justify-between gap-6 transition-all hover:-translate-y-1 shadow-xl text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-2xl">
                🌐
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider">
                STRANGERS
              </span>
            </div>
            <div>
              <h3 className="font-black text-xl text-white group-hover:text-purple-400 transition-colors">
                PLAY WITH STRANGERS
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                100% Real human matchmaking. Zero fake bots. Match against online players worldwide.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>FIND REAL MATCH</span> <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Mode 4: PLAY WITH AI */}
          <button
            onClick={() => {
              soundFx.playClick();
              setAiModalOpen(true);
            }}
            className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 bg-gradient-to-b from-amber-500/10 to-transparent flex flex-col justify-between gap-6 transition-all hover:-translate-y-1 shadow-xl text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
                🤖
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                AI BOT
              </span>
            </div>
            <div>
              <h3 className="font-black text-xl text-white group-hover:text-amber-400 transition-colors">
                PLAY WITH AI
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Challenge 🤖 CRICKET AI across 4 difficulties (Easy, Medium, Hard, Expert).
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>CHALLENGE AI</span> <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Feature Badges Banner */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="font-black text-xl text-emerald-400 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" /> 60s Timers
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Server-Authoritative</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="font-black text-xl text-amber-400 flex items-center justify-center gap-1">
              <Lightbulb className="w-4 h-4" /> Smart Hints
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Verified Facts Only</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="font-black text-xl text-cyan-400 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" /> Anti-Repeat
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Session Question Queue</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="font-black text-xl text-purple-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Honest
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">No Fake Strangers</div>
          </div>
        </div>
      </section>

      {/* AI Modal */}
      <AIOpponentModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onStartGame={handleStartAI}
      />

      {/* Stranger Matchmaking Modal */}
      {matchmakingOpen && (
        <MatchmakingScreen
          userRating={1250}
          userTier="GOLD"
          onMatchFound={(payload) => {
            setMatchmakingOpen(false);
          }}
          onCancel={() => setMatchmakingOpen(false)}
          onSelectAI={() => {
            setMatchmakingOpen(false);
            setAiModalOpen(true);
          }}
          onSelectFriends={() => {
            setMatchmakingOpen(false);
            window.location.href = '/online?mode=friends';
          }}
        />
      )}
    </div>
  );
}
