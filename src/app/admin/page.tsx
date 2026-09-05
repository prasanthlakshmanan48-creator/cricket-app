'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  GitMerge, 
  Database, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  UserCheck, 
  FileSpreadsheet
} from 'lucide-react';
import { soundFx } from '@/lib/sound-engine';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'merge' | 'sources' | 'challenges'>('overview');
  const [isMerging, setIsMerging] = useState(false);
  const [mergeMessage, setMergeMessage] = useState<string | null>(null);

  const duplicateCandidates = [
    {
      p1: { id: 'player-virat-kohli-001', name: 'Virat Kohli', country: 'IN', era: '2010s' },
      p2: { id: 'player-v-kohli-dup', name: 'V Kohli', country: 'IN', era: '2010s' },
      score: 0.94,
      reasons: ['High name similarity (94%)', 'Same country code (IN)', 'Same playing era (2010s)'],
    },
    {
      p1: { id: 'player-ms-dhoni-012', name: 'MS Dhoni', country: 'IN', era: '2000s' },
      p2: { id: 'player-mahendra-dhoni-dup', name: 'Mahendra Singh Dhoni', country: 'IN', era: '2000s' },
      score: 0.88,
      reasons: ['High name similarity (88%)', 'Same country code (IN)', 'Same era (2000s)'],
    },
  ];

  const handleMergeAction = async (primaryId: string, duplicateId: string) => {
    setIsMerging(true);
    soundFx.playClick();
    try {
      const res = await fetch('/api/admin/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryPlayerId: primaryId, duplicatePlayerId: duplicateId }),
      });
      if (res.ok) {
        const data = await res.json();
        setMergeMessage(data.message);
        soundFx.playCorrect();
      }
    } catch (err) {
      console.error('Merge failed:', err);
    } finally {
      setIsMerging(false);
    }
  };

  const handleRunImportSync = async () => {
    soundFx.playClick();
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceName: 'Cricsheet Register' }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Data Ingestion Complete! Imported ${data.importedCount} records from Cricsheet Register.`);
      }
    } catch (err) {
      console.error('Import sync error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4" /> ADMIN CONTROL CENTER
          </div>
          <h1 className="font-display font-extrabold text-3xl text-white mt-1">
            CRICKET IDENTITY & DATA MANAGEMENT
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Identity resolution, duplicate merges, Cricsheet data sync, and daily challenge scheduling.
          </p>
        </div>

        <button
          onClick={handleRunImportSync}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <RefreshCw className="w-4 h-4" /> SYNC CRICSHEET REGISTER
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'overview', label: 'System Overview', icon: Database },
          { id: 'merge', label: 'Identity Resolution & Merge', icon: GitMerge },
          { id: 'sources', label: 'Data Sources & Licensing', icon: Layers },
          { id: 'challenges', label: 'Daily Challenge Scheduler', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: System Overview */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-panel border border-white/10 text-center">
              <div className="text-xs text-gray-400 uppercase font-semibold">Total Players</div>
              <div className="font-display font-extrabold text-3xl text-white mt-1">18,507</div>
            </div>
            <div className="p-5 rounded-2xl glass-panel border border-white/10 text-center">
              <div className="text-xs text-gray-400 uppercase font-semibold">External Identifiers</div>
              <div className="font-display font-extrabold text-3xl text-amber-400 mt-1">42,180</div>
            </div>
            <div className="p-5 rounded-2xl glass-panel border border-white/10 text-center">
              <div className="text-xs text-gray-400 uppercase font-semibold">Pending Merge Reviews</div>
              <div className="font-display font-extrabold text-3xl text-emerald-400 mt-1">738</div>
            </div>
            <div className="p-5 rounded-2xl glass-panel border border-white/10 text-center">
              <div className="text-xs text-gray-400 uppercase font-semibold">Data Quality Score</div>
              <div className="font-display font-extrabold text-3xl text-amber-500 mt-1">99.4%</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Recent System Audit Logs
            </h3>
            <div className="divide-y divide-white/5 text-xs text-gray-300">
              <div className="py-3 flex justify-between">
                <span>[DAILY_CHALLENGE] Scheduled Challenge #284 (Virat Kohli)</span>
                <span className="text-gray-500">Today 00:00</span>
              </div>
              <div className="py-3 flex justify-between">
                <span>[DATA_SYNC] Cricsheet Register ingest job completed (18,507 records)</span>
                <span className="text-gray-500">Yesterday 18:30</span>
              </div>
              <div className="py-3 flex justify-between">
                <span>[IMAGE_ASSET] Approved primary photo license for Don Bradman</span>
                <span className="text-gray-500">Yesterday 14:15</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Identity Resolution & Merge Tool */}
      {activeTab === 'merge' && (
        <div className="flex flex-col gap-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 font-semibold flex items-center justify-between">
            <span>Non-Destructive Player Deduplication Engine active. Merging transfers external IDs, stats, and aliases safely.</span>
          </div>

          {mergeMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {mergeMessage}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Flagged Duplicate Candidates ({duplicateCandidates.length})
            </h3>

            {duplicateCandidates.map((candidate, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[140px]">
                    <div className="font-display font-bold text-sm text-white">{candidate.p1.name}</div>
                    <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                      {candidate.p1.country} • {candidate.p1.era}
                    </div>
                    <div className="text-[9px] text-gray-500 mt-1 font-mono">{candidate.p1.id}</div>
                  </div>

                  <div className="text-center font-bold text-xs text-amber-400">
                    <span className="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/30">
                      {Math.round(candidate.score * 100)}% Match
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[140px]">
                    <div className="font-display font-bold text-sm text-white">{candidate.p2.name}</div>
                    <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                      {candidate.p2.country} • {candidate.p2.era}
                    </div>
                    <div className="text-[9px] text-gray-500 mt-1 font-mono">{candidate.p2.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleMergeAction(candidate.p1.id, candidate.p2.id)}
                    disabled={isMerging}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    <GitMerge className="w-4 h-4" /> MERGE RECORDS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Data Sources */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">Cricsheet Player Register</h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Provides canonical unique player IDs and cross-references for Cricinfo, Cricbuzz, and domestic boards.
            </p>
            <div className="text-xs text-gray-300 flex justify-between border-t border-white/10 pt-3">
              <span>Records Imported: <strong>18,507</strong></span>
              <span>Last Sync: <strong>Today 00:00</strong></span>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">Image Assets & Licensing</h3>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Enforces public-domain and licensed image attribution. Unapproved assets are held in review before publishing.
            </p>
            <div className="text-xs text-gray-300 flex justify-between border-t border-white/10 pt-3">
              <span>Approved Photos: <strong>18,507</strong></span>
              <span>Pending Review: <strong>0</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Challenges */}
      {activeTab === 'challenges' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-4">
          <h3 className="font-display font-bold text-base text-white">Daily Challenge Schedule</h3>
          <div className="divide-y divide-white/5 text-xs text-gray-300">
            <div className="py-3 flex justify-between items-center">
              <div>
                <strong className="text-white">Daily #284 (2026-09-05)</strong>
                <div className="text-amber-400 text-[11px]">Target: Virat Kohli (India • Top-order Batter)</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                LIVE NOW
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div>
                <strong className="text-white">Daily #285 (2026-09-06)</strong>
                <div className="text-gray-400 text-[11px]">Target: Ellyse Perry (Australia • All-rounder)</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 text-gray-400 font-bold text-[10px]">
                SCHEDULED
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
