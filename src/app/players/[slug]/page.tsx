import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCountryFlag } from '@/lib/game-engine';
import { Trophy, Calendar, Award, Shield, ArrowLeft, GitCompare } from 'lucide-react';

interface PlayerProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const player = await prisma.player.findFirst({
    where: {
      OR: [{ uuid: slug }, { id: slug }],
    },
    include: {
      statistics: true,
      competitions: true,
      aliases: true,
      identifiers: true,
    },
  });

  if (!player) {
    notFound();
  }

  // Related players from same country
  const relatedPlayers = await prisma.player.findMany({
    where: {
      countryCode: player.countryCode,
      NOT: { id: player.id },
    },
    take: 3,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      
      {/* Top Back Link */}
      <Link
        href="/players"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-amber-400 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Player Directory
      </Link>

      {/* Hero Banner Card */}
      <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-white/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <img
          src={player.profileImage}
          alt={player.displayName}
          className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-2 border-amber-500/40 shadow-2xl relative z-10"
        />

        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCountryFlag(player.countryCode)}</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-amber-400">
              {player.nationality} • {player.playingEra}
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
            {player.displayName}
          </h1>

          <p className="text-sm font-semibold text-emerald-400">
            {player.role} ({player.battingStyle} {player.bowlingStyle ? `• ${player.bowlingStyle}` : ''})
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-xs text-gray-300">
            <div>Career Span: <strong className="text-white">{player.careerSpan}</strong></div>
            <div>Gender: <strong className="text-white">{player.gender}</strong></div>
            <div>Difficulty Score: <strong className="text-amber-400">{player.difficultyScore} / 10</strong></div>
          </div>
        </div>
      </div>

      {/* Career Statistics Table */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> CAREER STATISTICS
        </h2>

        <div className="rounded-2xl glass-panel border border-white/10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">Format</th>
                <th className="p-4">Matches</th>
                <th className="p-4">Runs</th>
                <th className="p-4">Wickets</th>
                <th className="p-4">Batting Avg</th>
                <th className="p-4">Strike Rate</th>
                <th className="p-4">100s / 50s</th>
                <th className="p-4">Catches</th>
              </tr>
            </thead>
            <tbody>
              {player.statistics.map((st) => (
                <tr key={st.format} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">{st.format}</td>
                  <td className="p-4">{st.matches}</td>
                  <td className="p-4 font-bold text-amber-400">{st.runs}</td>
                  <td className="p-4 font-bold text-emerald-400">{st.wickets}</td>
                  <td className="p-4">{st.battingAvg ? st.battingAvg : 'N/A'}</td>
                  <td className="p-4">{st.strikeRate ? st.strikeRate : 'N/A'}</td>
                  <td className="p-4">{st.hundreds} / {st.fifties}</td>
                  <td className="p-4">{st.catches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* External Identifiers & Aliases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-3">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Player Identifiers & Sources
          </h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {player.identifiers.map((ident) => (
              <span key={ident.id} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                <strong className="text-amber-400">{ident.sourceName}</strong>: {ident.externalId}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-3">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
            Aliases & Historical Names
          </h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {player.aliases.map((al) => (
              <span key={al.id} className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300">
                {al.alias}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
