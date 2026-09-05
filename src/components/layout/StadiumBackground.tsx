'use client';

import React from 'react';

export const StadiumBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0d12]">
      {/* Stadium Top Floodlight Ambiance */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-amber-500/15 via-emerald-500/10 to-transparent blur-3xl rounded-full" />

      {/* Subtle Pitch Oval Geometric Graphics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.03] rounded-full pitch-grid opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-emerald-500/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-amber-500/10 rounded-full" />

      {/* Bottom Subtle Turf Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#0f2419]/40 via-transparent to-transparent" />
    </div>
  );
};
