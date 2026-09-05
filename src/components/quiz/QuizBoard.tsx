'use client';

import React, { useState, useEffect } from 'react';
import { QuizQuestion, RoundSummary, UserQuestionAnswer } from '@/types/quiz';
import { getQuestionsForRound, getRoundMetadata } from '@/lib/quiz-engine';
import { QuizCard } from './QuizCard';
import { RoundSummaryModal } from './RoundSummaryModal';
import { QuizVictoryModal } from './QuizVictoryModal';
import { soundEngine } from '@/lib/sound-engine';
import { Volume2, VolumeX, ShieldCheck, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizBoardProps {
  initialRound?: number; // default 1
  modeTitle?: string;
}

export const QuizBoard: React.FC<QuizBoardProps> = ({
  initialRound = 1,
  modeTitle = '4-Round Cricket Quiz Tournament',
}) => {
  const [currentRound, setCurrentRound] = useState<number>(initialRound);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Tournament Stats
  const [totalScore, setTotalScore] = useState<number>(0); // total correct answers
  const [roundScore, setRoundScore] = useState<number>(0); // correct answers in current round (out of 12)
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserQuestionAnswer[]>([]);
  const [roundSummaries, setRoundSummaries] = useState<RoundSummary[]>([]);

  // Modals
  const [showRoundSummary, setShowRoundSummary] = useState<boolean>(false);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  // Load 12 questions for current round
  useEffect(() => {
    const roundQs = getQuestionsForRound(currentRound, 12);
    setQuestions(roundQs);
    setCurrentQuestionIndex(0);
    setRoundScore(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
  }, [currentRound]);

  const currentQuestion = questions[currentQuestionIndex];
  const roundMeta = getRoundMetadata(currentRound);

  // Handle Option Selection
  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted || !currentQuestion) return;

    setSelectedOptionIndex(optionIndex);
    setIsSubmitted(true);

    const isCorrect = optionIndex === currentQuestion.correctOptionIndex;
    const earnedPoints = isCorrect ? currentQuestion.points * (streak > 1 ? streak : 1) : 0;

    if (isCorrect) {
      if (!isSoundMuted) soundEngine.playCorrect();
      setTotalScore((prev) => prev + 1);
      setRoundScore((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setTotalPoints((prev) => prev + earnedPoints);
    } else {
      if (!isSoundMuted) soundEngine.playWrong();
      setStreak(0);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedOptionIndex: optionIndex,
        isCorrect,
        timeTakenSeconds: 5,
        pointsEarned: earnedPoints,
      },
    ]);
  };

  // Handle Next Question or End of Round
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < 12) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
    } else {
      // Completed 12 questions of current round!
      if (!isSoundMuted) soundEngine.playWin();

      const summary: RoundSummary = {
        roundNumber: currentRound,
        roundName: roundMeta.badge,
        difficulty: currentQuestion.difficulty,
        score: roundScore,
        totalQuestions: 12,
        accuracyPercentage: Math.round((roundScore / 12) * 100),
        totalPoints,
      };

      setRoundSummaries((prev) => [...prev, summary]);
      setShowRoundSummary(true);
    }
  };

  // Proceed from Round Summary to Next Round or Final Victory
  const handleProceedToNextRound = () => {
    setShowRoundSummary(false);
    if (currentRound < 4) {
      setCurrentRound((prev) => prev + 1);
    } else {
      // Completed all 4 rounds!
      setShowVictoryModal(true);
    }
  };

  // Reset & Play Again
  const handlePlayAgain = () => {
    setShowVictoryModal(false);
    setShowRoundSummary(false);
    setTotalScore(0);
    setRoundScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalPoints(0);
    setUserAnswers([]);
    setRoundSummaries([]);
    setCurrentRound(1);
  };

  const toggleSound = () => {
    setIsSoundMuted(!isSoundMuted);
    soundEngine.setMuted(!isSoundMuted);
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 font-bold">
        Loading 12 Cricket Trivia Questions...
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-between py-6 px-4">
      {/* Sound & Navigation Controls Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h1 className="text-lg font-black text-slate-100 tracking-tight">
            {modeTitle}
          </h1>
        </div>

        {/* Round Indicators & Sound Toggle */}
        <div className="flex items-center space-x-3">
          {/* Round Selector Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400">
            {[1, 2, 3, 4].map((rNum) => (
              <span
                key={rNum}
                className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-black transition-colors ${
                  rNum === currentRound
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : rNum < currentRound
                    ? 'bg-slate-800 text-emerald-400'
                    : 'bg-slate-800/40 text-slate-600'
                }`}
              >
                R{rNum}
              </span>
            ))}
          </div>

          {/* Mute Sound Button */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isSoundMuted ? 'Unmute Sounds' : 'Mute Sounds'}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main MCQ Question Card Component */}
      <QuizCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestionsInRound={12}
        roundNumber={currentRound}
        roundTitle={roundMeta.title}
        roundBadge={roundMeta.badge}
        roundColor={roundMeta.color}
        selectedOptionIndex={selectedOptionIndex}
        isSubmitted={isSubmitted}
        streak={streak}
        score={totalScore}
        totalPoints={totalPoints}
        onSelectOption={handleSelectOption}
        onNextQuestion={handleNextQuestion}
      />

      {/* Round Summary Modal */}
      {showRoundSummary && roundSummaries.length > 0 && (
        <RoundSummaryModal
          summary={roundSummaries[roundSummaries.length - 1]}
          onProceedToNextRound={handleProceedToNextRound}
        />
      )}

      {/* Tournament Victory Modal */}
      {showVictoryModal && (
        <QuizVictoryModal
          totalScore={totalScore}
          totalPoints={totalPoints}
          maxStreak={maxStreak}
          roundSummaries={roundSummaries}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};
