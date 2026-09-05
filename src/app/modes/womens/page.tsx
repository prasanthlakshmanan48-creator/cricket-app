'use client';

import React from 'react';
import { QuizBoard } from '@/components/quiz/QuizBoard';

export default function WomensModePage() {
  return (
    <div className="py-4">
      <QuizBoard initialRound={1} modeKey="WOMENS" modeTitle="🏏 Women's Cricket 4-Round Quiz" />
    </div>
  );
}
