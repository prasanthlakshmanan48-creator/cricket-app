'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Trophy, 
  Flame, 
  Search, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  ShieldAlert, 
  Users, 
  GitCompare, 
  HelpCircle,
  Award,
  ChevronDown
} from 'lucide-react';
import { soundFx } from '@/lib/sound-engine';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modesDropdownOpen, setModesDropdownOpen] = useState(false);
  const [streakCount, setStreakCount] = useState(12);

  useEffect(() => {
    setIsMuted(soundFx.getMutedState());
  }, []);

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playClick();
  };

  const navLinks = [
    { href: '/online', label: 'PLAY ONLINE', badge: 'LIVE' },
    { href: '/daily', label: 'Daily Challenge', badge: '#284' },
    { href: '/practice', label: 'Practice' },
    { href: '/players', label: 'Players' },
    { href: '/compare', label: 'Compare' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/profile', label: 'Stats' },
  ];

  const modeLinks = [
    { href: '/modes/legends', label: '🏛 Legends Era' },
    { href: '/modes/franchise', label: '💥 IPL / Franchise' },
    { href: '/modes/country', label: '🌍 Country Mode' },
    { href: '/modes/decade', label: '📅 Decade Mode' },
    { href: '/modes/womens', label: '🏏 Women\'s Cricket' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group" onClick={() => soundFx.playClick()}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🏏</span>
          </div>
          <div>
            <div className="font-display font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
              WHO'S THAT <span className="text-amber-400">CRICKETER?</span>
            </div>
            <p className="text-[10px] text-emerald-400 uppercase font-semibold tracking-widest -mt-1 hidden sm:block">
              Worldwide Guessing Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => soundFx.playClick()}
                className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-amber-500 text-black font-bold rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Modes Dropdown */}
          <div className="relative">
            <button
              onClick={() => setModesDropdownOpen(!modesDropdownOpen)}
              className="px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1"
            >
              Modes <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {modesDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-xl glass-panel p-2 shadow-xl border border-white/10 z-50"
                onMouseLeave={() => setModesDropdownOpen(false)}
              >
                {modeLinks.map((mode) => (
                  <Link
                    key={mode.href}
                    href={mode.href}
                    onClick={() => {
                      soundFx.playClick();
                      setModesDropdownOpen(false);
                    }}
                    className="block px-3 py-2 text-xs font-medium text-gray-300 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                  >
                    {mode.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/admin"
            onClick={() => soundFx.playClick()}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-all flex items-center gap-1"
            title="Admin Suite"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Admin
          </Link>
        </nav>

        {/* Right Section: Streak & Audio Controls */}
        <div className="flex items-center gap-3">
          {/* Daily Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs sm:text-sm">
            <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
            <span>{streakCount} Streak</span>
          </div>

          {/* Audio Toggle Button */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-amber-400 transition-all"
            title={isMuted ? 'Unmute FX' : 'Mute FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 glass-panel p-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-200 hover:bg-amber-500/10 hover:text-amber-400 flex items-center justify-between"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="px-2 py-0.5 text-xs bg-amber-500 text-black font-bold rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="h-px bg-white/10 my-1" />
          <p className="px-4 text-xs font-semibold text-emerald-400 uppercase tracking-wider">Extra Modes</p>
          {modeLinks.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-amber-400"
            >
              {mode.label}
            </Link>
          ))}

          <div className="h-px bg-white/10 my-1" />
          <Link
            href="/admin"
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(false);
            }}
            className="px-4 py-2 rounded-lg text-xs font-medium text-amber-400 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" /> Admin Dashboard
          </Link>
        </div>
      )}
    </header>
  );
};
