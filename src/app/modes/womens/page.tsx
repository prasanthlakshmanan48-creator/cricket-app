'use client';

import React from 'react';
import { QuizBoard } from '@/components/quiz/QuizBoard';

export default function WomensModePage() {
  return (
    <div className="py-4">
      <QuizBoard initialRound={2} modeTitle="Women's Cricket Tournament Quiz" />
    </div>
  );
}
