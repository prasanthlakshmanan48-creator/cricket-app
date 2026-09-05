import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getCountryFlag } from '@/lib/game-engine';
import { Search, Filter, Globe, Trophy, ChevronRight } from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    take: 50,
    orderBy: { popularityRank: 'asc' },
    include: {
      statistics: true,
      competitions: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            DATABASE EXPLORER
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
            GLOBAL CRICKET DIRECTORY
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Explore 18,500+ worldwide players across ICC Full Members, Associate Nations, and Legends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/compare"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            COMPARE PLAYERS
          </Link>
        </div>
      </div>

      {/* Players Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {players.map((p) => (
          <Link
            key={p.id}
            href={`/players/${p.uuid}`}
            className="p-5 rounded-3xl glass-panel border border-white/10 glass-panel-hover flex flex-col justify-between gap-4 transition-all group"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.profileImage}
                alt={p.displayName}
                className="w-14 h-14 rounded-2xl object-cover border border-amber-500/30 shadow-md group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="font-display font-bold text-base text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>{p.displayName}</span>
                  <span className="text-sm">{getCountryFlag(p.countryCode)}</span>
                </div>
                <p className="text-xs text-amber-400 font-medium mt-0.5">{p.role}</p>
                <p className="text-[10px] text-gray-400">{p.nationality} • {p.playingEra}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <span>Span: <strong className="text-gray-200">{p.careerSpan}</strong></span>
              <span className="flex items-center gap-0.5 text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                Profile <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
