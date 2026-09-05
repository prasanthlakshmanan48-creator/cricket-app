'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Lock } from 'lucide-react';

interface ProgressivePlayerImageProps {
  imageUrl: string;
  attemptCount: number;
  maxAttempts?: number;
  isGameWon?: boolean;
  isGameCompleted?: boolean;
  playerName?: string;
}

export const ProgressivePlayerImage: React.FC<ProgressivePlayerImageProps> = ({
  imageUrl,
  attemptCount,
  maxAttempts = 8,
  isGameWon = false,
  isGameCompleted = false,
  playerName = 'Unknown Cricketer',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // If game is completed/won, force full clarity stage (Level 8)
  const currentStage = isGameCompleted || isGameWon ? 8 : Math.min(attemptCount, maxAttempts);

  // Stage CSS class filter mapping
  const stageClassMap: Record<number, string> = {
    1: 'reveal-stage-1',
    2: 'reveal-stage-2',
    3: 'reveal-stage-3',
    4: 'reveal-stage-4',
    5: 'reveal-stage-5',
    6: 'reveal-stage-6',
    7: 'reveal-stage-7',
    8: 'reveal-stage-8',
  };

  return (
    <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex items-center justify-center bg-black/40 group">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />

      {/* Progressive Canvas & Image Renderer */}
      <div className="relative w-full h-full flex items-center justify-center p-2">
        <img
          src={imageUrl}
          alt={isGameCompleted ? playerName : 'Mysterious Cricketer'}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover rounded-xl transition-all duration-700 ease-out ${
            stageClassMap[currentStage]
          } ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        />

        {/* Silhouette Overlay for Attempt 3 */}
        {currentStage === 3 && !isGameCompleted && (
          <div className="absolute inset-0 bg-black/60 backdrop-brightness-50 mix-blend-multiply rounded-xl pointer-events-none" />
        )}
      </div>

      {/* Stage Badge & Attempt Counter Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-black/70 border border-white/15 text-xs font-bold text-amber-400 flex items-center gap-1.5 backdrop-blur-md">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Reveal Level {currentStage} / {maxAttempts}</span>
        </div>
      </div>

      {/* If Game Completed, Display Winner Ribbon */}
      {isGameCompleted && (
        <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-xl bg-black/80 border border-amber-500/40 backdrop-blur-md text-center">
          <p className="text-xs uppercase tracking-widest text-amber-400 font-bold">Identified Player</p>
          <p className="text-lg font-display font-extrabold text-white mt-0.5">{playerName}</p>
        </div>
      )}
    </div>
  );
};
