'use client';

import React, { useState, useEffect } from 'react';
import { AIDifficulty, AIOpponentState, ClientQuestionPayload } from '@/types/game-extension';
import { QuestionEngine, VerifiedPlayerCandidate } from '@/lib/question-engine';
import { AIEngine } from '@/lib/ai-engine';
import { QuestionCard } from '@/components/game/QuestionCard';
import { soundFx } from '@/lib/sound-engine';
import { Bot, User, Trophy, ArrowRight, RotateCcw, Award, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

interface AIBoardProps {
  difficulty: AIDifficulty;
  totalQuestions: number;
  onExit: () => void;
}

export const AIBoard: React.FC<AIBoardProps> = ({
  difficulty,
  totalQuestions = 8,
  onExit,
}) => {
  const [sessionId] = useState<string>(`ai-session-${Date.now()}`);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [userScore, setUserScore] = useState<number>(0);
  const [userCorrectCount, setUserCorrectCount] = useState<number>(0);

  const [aiState, setAiState] = useState<AIOpponentState>(() =>
    AIEngine.createAIOpponent(difficulty)
  );

  const [currentQuestionData, setCurrentQuestionData] = useState<{
    targetPlayer: VerifiedPlayerCandidate;
    payload: ClientQuestionPayload;
  } | null>(null);

  const [roundCompleted, setRoundCompleted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  // Initialize first question
  useEffect(() => {
    QuestionEngine.resetSession(sessionId);
    loadNextQuestion(1);
  }, []);

  const loadNextQuestion = (roundNum: number) => {
    const qData = QuestionEngine.generateQuestion(sessionId, roundNum, 60);
    setCurrentQuestionData(qData);
    setRoundCompleted(false);

    // Reset AI turn state
    setAiState((prev) => ({
      ...prev,
      isThinking: true,
      lastGuess: undefined,
      lastGuessCorrect: undefined,
    }));

    // Trigger AI thinking process with realistic server-side delay (Req #8, #10)
    const thinkingDelay = AIEngine.getThinkingDelayMs(difficulty);
    setTimeout(() => {
      if (qData) {
        const aiResult = AIEngine.makeAIGuess(
          qData.targetPlayer,
          qData.payload.options || [],
          difficulty
        );
        const points = AIEngine.calculateAIScore(
          aiResult.isCorrect,
          aiResult.timeTakenSeconds,
          60
        );

        setAiState((prev) => ({
          ...prev,
          isThinking: false,
          score: prev.score + points,
          correctAnswers: prev.correctAnswers + (aiResult.isCorrect ? 1 : 0),
          guesses: prev.guesses + 1,
          lastGuess: aiResult.guessedName,
          lastGuessCorrect: aiResult.isCorrect,
        }));
      }
    }, thinkingDelay);
  };

  // User submits an answer
  const handleUserAnswerSubmit = (
    answerName: string,
    isCorrect: boolean,
    timeRemainingSeconds: number,
    pointsEarned: number
  ) => {
    setUserScore((prev) => prev + pointsEarned);
    if (isCorrect) setUserCorrectCount((prev) => prev + 1);
    setRoundCompleted(true);
  };

  // Question Timer Expired
  const handleTimeExpired = () => {
    setRoundCompleted(true);
  };

  // Next Round Trigger
  const handleNextRound = () => {
    soundFx.playClick();
    if (currentRound >= totalQuestions) {
      setGameCompleted(true);
    } else {
      const nextR = currentRound + 1;
      setCurrentRound(nextR);
      loadNextQuestion(nextR);
    }
  };

  if (gameCompleted) {
    const userWon = userScore > aiState.score;
    const isTie = userScore === aiState.score;

    return (
      <div className="w-full max-w-3xl mx-auto p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-3xl shadow-xl shadow-amber-500/20 animate-bounce">
          🏆
        </div>

        <div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            MATCH COMPLETE
          </h2>
          <p className="text-emerald-400 font-bold text-lg mt-1">
            {userWon ? '🏆 YOU DEFEATED CRICKET AI!' : isTie ? '🤝 IT IS A TIE!' : '🤖 CRICKET AI WINS!'}
          </p>
        </div>

        {/* Podium Comparison */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-4">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-emerald-500/30 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-black mb-1">
              <User className="w-4 h-4" /> YOU
            </div>
            <div className="font-black text-3xl text-white">{userScore}</div>
            <div className="text-xs text-slate-400 mt-1">
              {userCorrectCount} / {totalQuestions} Correct
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-amber-500/30 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-black mb-1">
              <Bot className="w-4 h-4" /> CRICKET AI
            </div>
            <div className="font-black text-3xl text-white">{aiState.score}</div>
            <div className="text-xs text-slate-400 mt-1">
              {aiState.correctAnswers} / {totalQuestions} Correct
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mt-6">
          <button
            onClick={() => {
              setGameCompleted(false);
              setCurrentRound(1);
              setUserScore(0);
              setUserCorrectCount(0);
              setAiState(AIEngine.createAIOpponent(difficulty));
              QuestionEngine.resetSession(sessionId);
              loadNextQuestion(1);
            }}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <RotateCcw className="w-4 h-4" /> PLAY AGAIN
          </button>
          <button
            onClick={onExit}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm"
          >
            EXIT TO MENU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Top Match Bar: You vs CRICKET AI */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
        {/* Human Player */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
            👤
          </div>
          <div>
            <div className="font-black text-sm text-white">YOU</div>
            <div className="font-mono text-emerald-400 font-bold text-xs">{userScore} pts</div>
          </div>
        </div>

        {/* Round Progress Pill */}
        <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-black">
          ROUND {currentRound} / {totalQuestions}
        </div>

        {/* AI Opponent (Explicitly Disclosed per Req #7, #46) */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="font-black text-sm text-amber-400 flex items-center gap-1 justify-end">
              <span>🤖 CRICKET AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                {difficulty}
              </span>
            </div>
            <div className="font-mono text-amber-400 font-bold text-xs">{aiState.score} pts</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-lg">
            {aiState.avatar}
          </div>
        </div>
      </div>

      {/* AI Real-time Status Indicator */}
      <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs px-5">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-medium">
            {aiState.isThinking ? (
              <span className="text-amber-400 animate-pulse">🤖 AI is thinking...</span>
            ) : aiState.lastGuess ? (
              <span>
                🤖 AI guessed <strong className="text-white">"{aiState.lastGuess}"</strong>{' '}
                {aiState.lastGuessCorrect ? (
                  <span className="text-emerald-400 font-bold">(Correct)</span>
                ) : (
                  <span className="text-rose-400 font-bold">(Wrong)</span>
                )}
              </span>
            ) : (
              <span>AI Ready</span>
            )}
          </span>
        </div>
      </div>

      {/* Question Card */}
      {currentQuestionData && (
        <QuestionCard
          question={currentQuestionData.payload}
          targetPlayer={currentQuestionData.targetPlayer}
          onAnswerSubmit={handleUserAnswerSubmit}
          onTimeExpired={handleTimeExpired}
          disabled={roundCompleted}
        />
      )}

      {/* Next Question CTA */}
      {roundCompleted && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleNextRound}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base flex items-center gap-3 shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all"
          >
            <span>NEXT QUESTION</span> <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
