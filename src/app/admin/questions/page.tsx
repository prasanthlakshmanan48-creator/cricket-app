'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ShieldAlert, 
  Sliders, 
  Sparkles, 
  Check, 
  X,
  ArrowLeft
} from 'lucide-react';
import { ValidatedQuestionRecord } from '@/types/dynamic-question';
import { soundFx } from '@/lib/sound-engine';
import Link from 'next/link';

export default function AdminQuestionsPage() {
  const [records, setRecords] = useState<ValidatedQuestionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiEnabled, setAiEnabled] = useState<boolean>(true);
  const [qualityThreshold, setQualityThreshold] = useState<number>(75);
  const [message, setMessage] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/questions');
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleToggleAI = async (enabled: boolean) => {
    soundFx.playClick();
    setAiEnabled(enabled);
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_AI', aiEnabled: enabled, qualityThreshold }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessage(data.message);
      }
    } catch (err) {
      console.error('Failed to toggle AI:', err);
    }
  };

  const handleUpdateStatus = async (questionId: string, isValidated: boolean) => {
    soundFx.playClick();
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_STATUS', questionId, isValidated }),
      });
      if (res.ok) {
        setRecords((prev) =>
          prev.map((r) => (r.questionId === questionId ? { ...r, isValidated } : r))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Header Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <Link href="/admin" className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Bot className="w-4 h-4" /> AI QUESTION REVIEW & CONTROL
          </div>
          <h1 className="font-display font-extrabold text-3xl text-white mt-1">
            DYNAMIC QUESTION ENGINE MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inspect AI generated questions, verify 100% factual accuracy against DB, review candidate discriminators, and adjust AI control settings.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            fetchRecords();
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> REFRESH RECORDS
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          {message}
        </div>
      )}

      {/* AI Controls Panel (Req #38) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-lg text-white">AI Question Generator Control</h3>
            <p className="text-xs text-slate-400">
              Toggle dynamic AI generation on/off. Fallback mode uses DB verified templates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => handleToggleAI(true)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                aiEnabled
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AI GENERATION ON
            </button>
            <button
              onClick={() => handleToggleAI(false)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                !aiEnabled
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FALLBACK ONLY
            </button>
          </div>
        </div>
      </div>

      {/* AI Question Records Review Table (Req #39) */}
      <div className="rounded-3xl bg-slate-900 border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-black text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Generated Question Records ({records.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Showing all pre-validated and history records
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading question records...
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No AI questions recorded yet. Start a new game to populate live records!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-white/10">
                  <th className="py-3.5 px-4">Player & Format</th>
                  <th className="py-3.5 px-4">Question Text</th>
                  <th className="py-3.5 px-4">Facts Used</th>
                  <th className="py-3.5 px-4">Candidates</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {records.map((rec) => (
                  <tr key={rec.questionId} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">
                      <div>{rec.playerName}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
                        {rec.questionType}
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-xs font-medium text-slate-200">
                      "{rec.questionText}"
                      {rec.isFallback && (
                        <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                          FALLBACK
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                      {rec.factsUsed.join(', ')}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-cyan-400">
                      {rec.matchingCandidateCount} Match
                    </td>
                    <td className="py-4 px-4 font-mono font-black text-emerald-400">
                      {rec.qualityScore}/100
                    </td>
                    <td className="py-4 px-4">
                      {rec.isValidated ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                          <XCircle className="w-4 h-4" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      {!rec.isValidated ? (
                        <button
                          onClick={() => handleUpdateStatus(rec.questionId, true)}
                          className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          title="Approve Question"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(rec.questionId, false)}
                          className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                          title="Reject Question"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
