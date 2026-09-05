'use client';

import React from 'react';
import { QuizBoard } from '@/components/quiz/QuizBoard';

export default function DecadeModePage() {
  return (
    <div className="py-4">
      <QuizBoard initialRound={1} modeKey="DECADE" modeTitle="📅 Decade & Career Eras 4-Round Quiz" />
    </div>
  );
}
