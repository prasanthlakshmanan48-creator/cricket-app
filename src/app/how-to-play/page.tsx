import React from 'react';
import Link from 'next/link';
import { HelpCircle, Check, AlertCircle, X, Sparkles, ArrowRight } from 'lucide-react';

export default function HowToPlayPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      <div className="text-center">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          RULES & GUIDE
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
          HOW TO PLAY
        </h1>
        <p className="text-xs text-gray-400 mt-2">
          Learn how to interpret progressive image reveals, attribute indicators, and smart clues.
        </p>
      </div>

      {/* Rules Breakdown */}
      <div className="flex flex-col gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-3">
          <h2 className="font-display font-extrabold text-lg text-amber-400">1. The Goal</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Identify the mystery cricketer in 8 attempts or fewer. A new mystery player is generated every day for the Daily Challenge!
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-3">
          <h2 className="font-display font-extrabold text-lg text-emerald-400">2. Understanding Attribute Feedback</h2>
          <p className="text-xs text-gray-400">After submitting a player, each attribute box provides instant color + text + icon indicators:</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Check className="w-4 h-4" /> Green (🟩 Match)
              </div>
              <p className="text-[11px] text-gray-300 mt-1">Exact match for Country, Role, Batting, or Era.</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="w-4 h-4" /> Yellow (🟨 Close)
              </div>
              <p className="text-[11px] text-gray-300 mt-1">Same geographical region (e.g. South Asia) or off by 1 decade.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-400">
              <div className="flex items-center gap-2 font-bold text-sm">
                <X className="w-4 h-4" /> White (⬜ Mismatch)
              </div>
              <p className="text-[11px] text-gray-300 mt-1">Different attribute value.</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-3">
          <h2 className="font-display font-extrabold text-lg text-amber-400">3. Progressive Image & Clue Unlocks</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            The player photo becomes clearer with every guess. Starting at Guess #2, metadata hints (Country, Role, Batting Hand, Debut Year, Leagues) unlock automatically in the Smart Clues panel.
          </p>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link
          href="/daily"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all"
        >
          START PLAYING NOW <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
