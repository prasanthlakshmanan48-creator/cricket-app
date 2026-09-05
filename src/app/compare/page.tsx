'use client';

import React, { useState, useEffect } from 'react';
import { GitCompare, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { getCountryFlag } from '@/lib/game-engine';

export default function ComparePage() {
  const [playersList, setPlayersList] = useState<any[]>([]);
  const [p1Id, setP1Id] = useState<string>('');
  const [p2Id, setP2Id] = useState<string>('');
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPlayers() {
      const res = await fetch('/api/players/search?q=a');
      if (res.ok) {
        const data = await res.json();
        setPlayersList(data.results || []);
        if (data.results.length >= 2) {
          setP1Id(data.results[0].id);
          setP2Id(data.results[1].id);
        }
      }
    }
    loadPlayers();
  }, []);

  const handleCompare = async () => {
    if (!p1Id || !p2Id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/players/compare?p1=${p1Id}&p2=${p2Id}`);
      if (res.ok) {
        const data = await res.json();
        setComparisonData(data);
      }
    } catch (err) {
      console.error('Compare failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          HEAD-TO-HEAD
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
          PLAYER COMPARISON TOOL
        </h1>
        <p className="text-xs text-gray-400 mt-2">
          Compare statistics, career longevity, runs, wickets, and averages side-by-side.
        </p>
      </div>

      {/* Selectors */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center gap-4 max-w-3xl mx-auto w-full">
        <select
          value={p1Id}
          onChange={(e) => setP1Id(e.target.value)}
          className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-500 font-semibold"
        >
          <option value="">Select Player A</option>
          {playersList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.displayName} ({p.nationality})
            </option>
          ))}
        </select>

        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-extrabold text-xs">
          VS
        </div>

        <select
          value={p2Id}
          onChange={(e) => setP2Id(e.target.value)}
          className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-500 font-semibold"
        >
          <option value="">Select Player B</option>
          {playersList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.displayName} ({p.nationality})
            </option>
          ))}
        </select>

        <button
          onClick={handleCompare}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
        >
          COMPARE
        </button>
      </div>

      {/* Comparison Grid Results */}
      {comparisonData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full mt-4">
          
          {/* Player 1 Card */}
          <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 flex flex-col items-center text-center gap-4">
            <img
              src={comparisonData.player1.profileImage}
              alt={comparisonData.player1.displayName}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
            />
            <div>
              <h3 className="font-display font-extrabold text-2xl text-white flex items-center justify-center gap-2">
                <span>{comparisonData.player1.displayName}</span>
                <span>{getCountryFlag(comparisonData.player1.countryCode)}</span>
              </h3>
              <p className="text-xs text-amber-400 font-semibold mt-1">
                {comparisonData.player1.nationality} • {comparisonData.player1.role}
              </p>
            </div>

            <div className="w-full flex flex-col gap-2 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-white/5 flex justify-between">
                <span>Career Span</span>
                <strong className="text-white">{comparisonData.player1.careerSpan}</strong>
              </div>
              <div className="p-3 rounded-xl bg-white/5 flex justify-between">
                <span>Primary Era</span>
                <strong className="text-white">{comparisonData.player1.playingEra}</strong>
              </div>
            </div>
          </div>

          {/* Player 2 Card */}
          <div className="p-6 rounded-3xl glass-panel border border-emerald-500/30 flex flex-col items-center text-center gap-4">
            <img
              src={comparisonData.player2.profileImage}
              alt={comparisonData.player2.displayName}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl"
            />
            <div>
              <h3 className="font-display font-extrabold text-2xl text-white flex items-center justify-center gap-2">
                <span>{comparisonData.player2.displayName}</span>
                <span>{getCountryFlag(comparisonData.player2.countryCode)}</span>
              </h3>
              <p className="text-xs text-emerald-400 font-semibold mt-1">
                {comparisonData.player2.nationality} • {comparisonData.player2.role}
              </p>
            </div>

            <div className="w-full flex flex-col gap-2 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-white/5 flex justify-between">
                <span>Career Span</span>
                <strong className="text-white">{comparisonData.player2.careerSpan}</strong>
              </div>
              <div className="p-3 rounded-xl bg-white/5 flex justify-between">
                <span>Primary Era</span>
                <strong className="text-white">{comparisonData.player2.playingEra}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
