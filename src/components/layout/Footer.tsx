'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Globe, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 glass-panel mt-20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Brand Details */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-white">
            <span className="text-xl">🏏</span>
            <span>WHO'S THAT <span className="text-amber-400">CRICKETER?</span></span>
          </div>
          <p className="text-xs text-gray-400 max-w-sm mt-1">
            The premier worldwide cricket player guessing game. Synchronized daily challenges, legends era, franchise stars, and associate nation icons.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
          <Link href="/daily" className="hover:text-amber-400 transition-colors">Daily Challenge</Link>
          <Link href="/practice" className="hover:text-amber-400 transition-colors">Practice Mode</Link>
          <Link href="/players" className="hover:text-amber-400 transition-colors">Player Directory</Link>
          <Link href="/compare" className="hover:text-amber-400 transition-colors">Player Compare</Link>
          <Link href="/leaderboard" className="hover:text-amber-400 transition-colors">Leaderboard</Link>
          <Link href="/how-to-play" className="hover:text-amber-400 transition-colors">Rules & How To Play</Link>
          <Link href="/admin" className="hover:text-amber-400 transition-colors">Admin Portal</Link>
        </div>

        {/* Copyright & Status Badge */}
        <div className="flex flex-col items-center md:items-end text-xs text-gray-500 gap-1">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Daily #284 Live</span>
          </div>
          <p>© 2026 Who's That Cricketer. Production Grade.</p>
        </div>
      </div>
    </footer>
  );
};
