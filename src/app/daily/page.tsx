'use client';

import React from 'react';
import { QuizBoard } from '@/components/quiz/QuizBoard';

export default function DailyPage() {
  return (
    <div className="py-4">
      <QuizBoard initialRound={1} modeTitle="Daily Cricket Quiz Tournament (4 Rounds)" />
    </div>
  );
}
