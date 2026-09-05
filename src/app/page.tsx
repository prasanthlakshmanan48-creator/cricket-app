'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Play, 
  Flame, 
  Trophy, 
  Zap, 
  Sparkles, 
  Globe, 
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const roundTiers = [
    {
      round: 1,
      title: 'Round 1: Easy',
      badge: '🟢 12 Questions',
      description: 'Fundamentals, famous world cup records, iconic player nicknames & general cricket trivia.',
      icon: '🟢',
      href: '/practice?round=1',
      color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    {
      round: 2,
      title: 'Round 2: Medium',
      badge: '🟡 12 Questions',
      description: 'Tournament statistics, debut years, jersey numbers, bowling styles & milestone feats.',
      icon: '🟡',
      href: '/practice?round=2',
      color: 'from-amber-500/20 to-orange-600/10 border-amber-500/30',
      textColor: 'text-amber-400',
    },
    {
      round: 3,
      title: 'Round 3: Hard',
      badge: '🔴 12 Questions',
      description: 'Obscure international records, venue feats, head-to-head stats & associate milestones.',
      icon: '🔴',
      href: '/practice?round=3',
      color: 'from-pink-500/20 to-purple-600/10 border-pink-500/30',
      textColor: 'text-pink-400',
    },
    {
      round: 4,
      title: 'Round 4: Very Difficult',
      badge: '🟣 12 Questions',
      description: 'Deep expert trivia, vintage 19th/20th-century feats, rare bowling figures & historical quirks.',
      icon: '🟣',
      href: '/practice?round=4',
      color: 'from-violet-600/20 to-fuchsia-600/10 border-violet-500/30',
      textColor: 'text-violet-400',
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center max-w-5xl mx-auto">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10 mb-6">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>4-ROUND TRIVIA TOURNAMENT</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white leading-none">
          CHOOSE THE <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            CORRECT CRICKET ANSWER
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl font-medium leading-relaxed">
          4 Progressive Difficulty Rounds. 12 Questions per Round. 48 Questions in total. No image spoilers — pure cricket intelligence & intuition.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/daily"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all"
          >
            <Play className="w-5 h-5 fill-slate-950" /> START 4-ROUND TOURNAMENT
          </Link>

          <Link
            href="/practice"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-base flex items-center justify-center gap-2 backdrop-blur-md hover:scale-105 transition-all"
          >
            SELECT A ROUND
          </Link>
        </div>

        {/* Quick Stats Banner */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="font-black text-2xl text-emerald-400">4 Rounds</div>
            <div className="text-xs text-slate-400 mt-0.5">Progressive Levels</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="font-black text-2xl text-cyan-400">12 Qs / Round</div>
            <div className="text-xs text-slate-400 mt-0.5">48 Questions Total</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="font-black text-2xl text-amber-400">4 Options</div>
            <div className="text-xs text-slate-400 mt-0.5">MCQ Format</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="font-black text-2xl text-purple-400">Text-Based</div>
            <div className="text-xs text-slate-400 mt-0.5">No Question Images</div>
          </div>
        </div>
      </section>

      {/* 4 Rounds Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-black text-2xl sm:text-4xl text-slate-100">
            THE 4 TOURNAMENT ROUNDS
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Each round contains exactly 12 multiple choice questions of increasing difficulty.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roundTiers.map((tier) => (
            <Link
              key={tier.round}
              href={tier.href}
              className={`p-6 rounded-3xl bg-gradient-to-br ${tier.color} border bg-slate-900/90 flex flex-col justify-between gap-6 transition-all hover:-translate-y-1 hover:shadow-2xl group`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{tier.icon}</span>
                <span className={`px-2.5 py-1 rounded-full bg-slate-950/60 border border-slate-800 text-[10px] font-black uppercase tracking-wider ${tier.textColor}`}>
                  {tier.badge}
                </span>
              </div>

              <div>
                <h3 className={`font-black text-xl text-slate-100 group-hover:${tier.textColor} transition-colors`}>
                  {tier.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className={`flex items-center gap-1 text-xs font-black ${tier.textColor} group-hover:translate-x-1 transition-transform`}>
                <span>Start Round {tier.round}</span> <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
