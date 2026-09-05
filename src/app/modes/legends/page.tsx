'use client';

import React from 'react';
import { QuizBoard } from '@/components/quiz/QuizBoard';

export default function LegendsModePage() {
  return (
    <div className="py-4">
      <QuizBoard initialRound={1} modeKey="LEGENDS" modeTitle="🏛 Legends Era 4-Round Quiz" />
    </div>
  );
}
