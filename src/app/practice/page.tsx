'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuizBoard } from '@/components/quiz/QuizBoard';

function PracticeContent() {
  const searchParams = useSearchParams();
  const roundParam = searchParams ? parseInt(searchParams.get('round') || '1') : 1;
  const [selectedRound, setSelectedRound] = useState<number>(
    isNaN(roundParam) || roundParam < 1 || roundParam > 4 ? 1 : roundParam
  );

  useEffect(() => {
    if (roundParam >= 1 && roundParam <= 4) {
      setSelectedRound(roundParam);
    }
  }, [roundParam]);

  return (
    <div className="py-4 space-y-6">
      {/* Round Selection Tabs */}
      <div className="max-w-4xl mx-auto w-full px-4 flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <span className="text-xs font-black text-slate-400 tracking-wider uppercase hidden sm:inline">
          START AT ROUND:
        </span>
        <div className="grid grid-cols-4 gap-2 w-full sm:w-auto">
          {[
            { round: 1, label: 'Round 1: Easy', badge: '🟢 Easy' },
            { round: 2, label: 'Round 2: Medium', badge: '🟡 Medium' },
            { round: 3, label: 'Round 3: Hard', badge: '🔴 Hard' },
            { round: 4, label: 'Round 4: Very Difficult', badge: '🟣 Expert' },
          ].map((r) => (
            <button
              key={r.round}
              onClick={() => setSelectedRound(r.round)}
              className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                selectedRound === r.round
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {r.badge}
            </button>
          ))}
        </div>
      </div>

      <QuizBoard key={selectedRound} initialRound={selectedRound} modeTitle={`Cricket Quiz (Round ${selectedRound} of 4)`} />
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Practice Quiz...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
