'use client';

import React from 'react';
import { QuizBoard } from '@/components/quiz/QuizBoard';

export default function CountryModePage() {
  return (
    <div className="py-4">
      <QuizBoard initialRound={1} modeKey="COUNTRY" modeTitle="🌍 Country & International Nations 4-Round Quiz" />
    </div>
  );
}
