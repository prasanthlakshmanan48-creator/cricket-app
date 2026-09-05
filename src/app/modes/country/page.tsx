'use client';

import React from 'react';
import { QuizBoard } from '@/components/quiz/QuizBoard';

export default function CountryModePage() {
  return (
    <div className="py-4">
      <QuizBoard initialRound={1} modeTitle="Global ICC Nations Cricket Quiz" />
    </div>
  );
}
