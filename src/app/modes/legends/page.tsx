'use client';

import React from 'react';
import { QuizBoard } from '@/components/quiz/QuizBoard';

export default function LegendsModePage() {
  return (
    <div className="py-4">
      <QuizBoard initialRound={3} modeTitle="Legends Era Quiz (Hard & Expert Rounds)" />
    </div>
  );
}
