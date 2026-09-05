'use client';

import React from 'react';
import { QuizBoard } from '@/components/quiz/QuizBoard';

export default function FranchiseModePage() {
  return (
    <div className="py-4">
      <QuizBoard initialRound={2} modeTitle="Franchise Stars & T20 Quiz" />
    </div>
  );
}
