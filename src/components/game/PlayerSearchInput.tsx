'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, CornerDownLeft, X, Sparkles } from 'lucide-react';
import { PlayerSearchResult } from '@/types/game';
import { getCountryFlag } from '@/lib/game-engine';
import { soundFx } from '@/lib/sound-engine';

interface PlayerSearchInputProps {
  onSelectPlayer: (player: PlayerSearchResult) => void;
  disabled?: boolean;
}

export const PlayerSearchInput: React.FC<PlayerSearchInputProps> = ({
  onSelectPlayer,
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/players/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setIsOpen(true);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Global Keyboard Shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
      soundFx.playClick();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      soundFx.playClick();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (player: PlayerSearchResult) => {
    onSelectPlayer(player);
    setQuery('');
    setIsOpen(false);
    soundFx.playClick();
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          disabled={disabled}
          placeholder={disabled ? 'Game Ended' : 'Search a cricketer... (e.g. Virat, VK, Smith, Dhoni)'}
          className="w-full pl-12 pr-28 py-3.5 bg-black/60 border border-white/15 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 text-sm sm:text-base font-medium shadow-xl transition-all disabled:opacity-50"
        />

        {/* Clear & Shortcut Kbd Badge */}
        <div className="absolute right-3 flex items-center gap-2">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] font-mono font-semibold text-gray-400 bg-white/5 border border-white/10 rounded-md">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Autocomplete Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl glass-panel border border-white/15 shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" /> Searching global database...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((player, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <li
                    key={player.id}
                    onClick={() => handleSelect(player)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors border-b border-white/5 last:border-0 ${
                      isSelected ? 'bg-amber-500/20 text-white' : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={player.profileImage}
                        alt={player.displayName}
                        className="w-9 h-9 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                          <span>{player.displayName}</span>
                          <span className="text-xs">{getCountryFlag(player.countryCode)}</span>
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <span>{player.nationality}</span>
                          <span>•</span>
                          <span className="text-amber-400">{player.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                        {player.playingEra}
                      </span>
                      {isSelected && <CornerDownLeft className="w-4 h-4 text-amber-400" />}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center text-xs text-gray-400">
              No cricketers matching "{query}". Check spelling or try nickname.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
