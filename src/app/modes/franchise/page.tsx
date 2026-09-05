'use client';

import React from 'react';
import { QuizBoard } from '@/components/quiz/QuizBoard';

export default function FranchiseModePage() {
  return (
    <div className="py-4">
      <QuizBoard initialRound={1} modeKey="FRANCHISE" modeTitle="💥 IPL & Franchise League 4-Round Quiz" />
    </div>
  );
}
