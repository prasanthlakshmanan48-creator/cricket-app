'use client';

import React from 'react';
import { GameBoard } from '@/components/game/GameBoard';

export default function DecadePage() {
  return (
    <div className="py-6">
      <GameBoard mode="DECADE" />
    </div>
  );
}
