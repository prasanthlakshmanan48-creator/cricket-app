'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Room, MatchSettings, MatchFoundPayload } from '@/types/multiplayer';
import { RoomLobby } from '@/components/multiplayer/RoomLobby';
import { MatchmakingScreen } from '@/components/multiplayer/MatchmakingScreen';
import { MultiplayerBoard } from '@/components/multiplayer/MultiplayerBoard';
import { multiplayerStore } from '@/lib/multiplayer-store';
import {
  Users,
  Swords,
  Trophy,
  Award,
  Settings,
  Plus,
  Play,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

function MultiplayerHubContent() {
  const searchParams = useSearchParams();
  const joinCodeParam = searchParams ? searchParams.get('join') : null;

  const [currentView, setCurrentView] = useState<'HUB' | 'LOBBY' | 'MATCHMAKING' | 'GAME'>('HUB');
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [userRating, setUserRating] = useState<number>(1248);
  const [userTier, setUserTier] = useState<string>('GOLD');
  const [joinInputCode, setJoinInputCode] = useState<string>('');

  const currentUserId = 'user_me_01';
  const currentUsername = 'Cricket Ace 🏏';

  // Handle auto-join from query parameter e.g. /online?join=CRIC-7K4P8X
  useEffect(() => {
    if (joinCodeParam) {
      handleJoinRoom(joinCodeParam);
    }
  }, [joinCodeParam]);

  // Create Private Room
  const handleCreateRoom = async () => {
    try {
      const res = await fetch('/api/multiplayer/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostId: currentUserId,
          username: currentUsername,
          mode: 'FRIENDS',
        }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setActiveRoom(data.room);
        setCurrentView('LOBBY');
      } else {
        // Fallback store
        const r = multiplayerStore.createRoom(currentUserId, currentUsername, 'FRIENDS');
        setActiveRoom(r);
        setCurrentView('LOBBY');
      }
    } catch {
      const r = multiplayerStore.createRoom(currentUserId, currentUsername, 'FRIENDS');
      setActiveRoom(r);
      setCurrentView('LOBBY');
    }
  };

  // Join Room by Code
  const handleJoinRoom = async (code: string) => {
    if (!code) return;
    try {
      const res = await fetch('/api/multiplayer/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: code,
          playerId: currentUserId,
          username: currentUsername,
        }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setActiveRoom(data.room);
        setCurrentView('LOBBY');
      } else {
        alert(data.error || 'Room not found');
      }
    } catch {
      const res = multiplayerStore.joinRoom(code, currentUserId, currentUsername);
      if (res.success && res.room) {
        setActiveRoom(res.room);
        setCurrentView('LOBBY');
      } else {
        alert(res.error || 'Room not found');
      }
    }
  };

  // Start Ranked 1v1 Search
  const handleStartMatchmaking = () => {
    setCurrentView('MATCHMAKING');
  };

  // Match Found Handler
  const handleMatchFound = (payload: MatchFoundPayload) => {
    const room = multiplayerStore.createRoom(currentUserId, currentUsername, 'RANKED_1V1');
    room.maxPlayers = 2;
    multiplayerStore.joinRoom(room.code, payload.opponent.id, payload.opponent.username, payload.opponent.countryCode);
    setActiveRoom(room);
    setCurrentView('GAME');
  };

  // Host starts game from lobby
  const handleStartGameFromLobby = () => {
    if (activeRoom) {
      setActiveRoom({ ...activeRoom, status: 'IN_GAME' });
      setCurrentView('GAME');
    }
  };

  // Update Settings
  const handleUpdateSettings = (settings: Partial<MatchSettings>) => {
    if (activeRoom) {
      setActiveRoom({
        ...activeRoom,
        settings: { ...activeRoom.settings, ...settings },
      });
    }
  };

  return (
    <div className="py-6 space-y-8">
      {/* 1. LOBBY VIEW */}
      {currentView === 'LOBBY' && activeRoom && (
        <RoomLobby
          room={activeRoom}
          currentPlayerId={currentUserId}
          onStartGame={handleStartGameFromLobby}
          onUpdateSettings={handleUpdateSettings}
          onLeaveRoom={() => setCurrentView('HUB')}
        />
      )}

      {/* 2. MATCHMAKING VIEW */}
      {currentView === 'MATCHMAKING' && (
        <MatchmakingScreen
          userRating={userRating}
          userTier={userTier}
          onMatchFound={handleMatchFound}
          onCancel={() => setCurrentView('HUB')}
        />
      )}

      {/* 3. GAME VIEW */}
      {currentView === 'GAME' && activeRoom && (
        <MultiplayerBoard
          room={activeRoom}
          currentPlayerId={currentUserId}
          onMatchComplete={() => setCurrentView('HUB')}
        />
      )}

      {/* 4. MULTIPLAYER HUB MAIN VIEW */}
      {currentView === 'HUB' && (
        <div className="max-w-6xl mx-auto space-y-12 px-4">
          {/* Hub Header Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest shadow-lg">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>REAL-TIME MULTIPLAYER LOBBY</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight leading-none">
              PLAY WITH <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">OTHERS</span>
            </h1>

            <p className="text-base text-slate-300 font-medium">
              Think you know cricket? Prove it against players around the world.
            </p>
          </div>

          {/* User Multiplayer Rating Banner */}
          <div className="p-4 md:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUsername}`}
                  alt="Avatar"
                  className="w-full h-full bg-slate-950 rounded-[14px] p-1"
                />
              </div>

              <div>
                <h3 className="font-black text-slate-100 text-lg flex items-center space-x-2">
                  <span>{currentUsername}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">
                    {userTier} TIER
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Multiplayer Rating: <span className="text-emerald-400 font-black">{userRating} Elo</span>
                </p>
              </div>
            </div>

            {/* Quick Join Code Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="ENTER ROOM CODE (e.g. CRIC-7K4P8X)"
                value={joinInputCode}
                onChange={(e) => setJoinInputCode(e.target.value.toUpperCase())}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs w-64 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleJoinRoom(joinInputCode)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                JOIN ROOM
              </button>
            </div>
          </div>

          {/* Large Distinct Multiplayer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: PLAY WITH FRIENDS */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-950 border border-emerald-500/40 flex flex-col justify-between space-y-6 shadow-2xl hover:border-emerald-400 transition-all group">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl">
                  👥
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                  2 - 8 PLAYERS
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-2xl text-slate-100 group-hover:text-emerald-400 transition-colors">
                  PLAY WITH FRIENDS
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Create a private room with custom settings & 6-character room codes. Share via WhatsApp, Telegram, or direct link.
                </p>
              </div>

              <button
                onClick={handleCreateRoom}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>CREATE PRIVATE ROOM</span>
              </button>
            </div>

            {/* Card 2: PLAY WITH STRANGERS */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-950 border border-cyan-500/40 flex flex-col justify-between space-y-6 shadow-2xl hover:border-cyan-400 transition-all group">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl">
                  ⚡
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black">
                  1V1 MATCHMAKING
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-2xl text-slate-100 group-hover:text-cyan-400 transition-colors">
                  PLAY WITH STRANGERS
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Quick casual 1v1 matchmaking with players around the globe. Jump straight into the action!
                </p>
              </div>

              <button
                onClick={handleStartMatchmaking}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>FIND MATCH</span>
              </button>
            </div>

            {/* Card 3: RANKED 1V1 */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 flex flex-col justify-between space-y-6 shadow-2xl hover:border-amber-400 transition-all group">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
                  🏆
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black">
                  ELO RATING
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-2xl text-slate-100 group-hover:text-amber-400 transition-colors">
                  RANKED 1V1
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Competitive ranked games with Elo ratings (+24 / -18), rank tiers (Bronze to Legend), and seasonal leaderboards.
                </p>
              </div>

              <button
                onClick={handleStartMatchmaking}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Swords className="w-5 h-5" />
                <span>PLAY RANKED 1V1</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MultiplayerHubPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Multiplayer Hub...</div>}>
      <MultiplayerHubContent />
    </React.Suspense>
  );
}
