'use client';

import React, { useState, useEffect } from 'react';
import { ClientQuestionPayload, FactClue, HintChoice } from '@/types/game-extension';
import { VerifiedPlayerCandidate, QuestionEngine } from '@/lib/question-engine';
import { HintEngine } from '@/lib/hint-engine';
import { soundFx } from '@/lib/sound-engine';
import { Clock, Lightbulb, AlertTriangle, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: ClientQuestionPayload;
  targetPlayer: VerifiedPlayerCandidate;
  onAnswerSubmit: (answerName: string, isCorrect: boolean, timeRemainingSeconds: number, pointsEarned: number) => void;
  onTimeExpired: () => void;
  disabled?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  targetPlayer,
  onAnswerSubmit,
  onTimeExpired,
  disabled = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(question.timerSeconds || 60);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [revealedHints, setRevealedHints] = useState<FactClue[]>([]);
  const [revealedHintTypes, setRevealedHintTypes] = useState<Set<string>>(new Set());
  const [hintModalOpen, setHintModalOpen] = useState<boolean>(false);
  const [penaltyPoints, setPenaltyPoints] = useState<number>(0);

  // Per-Question Server-Authoritative Timer (Req #20, #22, #23, #24)
  useEffect(() => {
    setTimeLeft(question.timerSeconds || 60);
    setIsAnswered(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setRevealedHints([]);
    setRevealedHintTypes(new Set());
    setPenaltyPoints(0);

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = Math.max(0, question.questionEndsAt - now);
      const seconds = Math.ceil(remainingMs / 1000);

      setTimeLeft(seconds);

      if (seconds <= 0) {
        clearInterval(interval);
        if (!isAnswered) {
          setIsAnswered(true);
          soundFx.playWrong();
          onTimeExpired();
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [question.questionId]);

  // Handle Option Click
  const handleSelectOption = (optionName: string) => {
    if (disabled || isAnswered || timeLeft <= 0) return;

    soundFx.playClick();
    setSelectedOption(optionName);
    setIsAnswered(true);

    const correct = QuestionEngine.verifyAnswer(optionName, targetPlayer);
    setIsCorrect(correct);

    if (correct) {
      soundFx.playCorrect();
    } else {
      soundFx.playWrong();
    }

    // Calculate score
    const basePoints = correct ? 500 : 0;
    const timeBonus = correct ? Math.round((timeLeft / question.timerSeconds) * 500) : 0;
    const finalPoints = Math.max(0, basePoints + timeBonus - penaltyPoints);

    onAnswerSubmit(optionName, correct, timeLeft, finalPoints);
  };

  // Handle Smart Hint Reveal
  const handleUseHint = (hintChoice: HintChoice) => {
    soundFx.playClick();
    const newTypes = new Set(revealedHintTypes);
    newTypes.add(hintChoice.type);
    setRevealedHintTypes(newTypes);

    const newClue: FactClue = {
      type: hintChoice.type as any,
      label: hintChoice.label,
      value: hintChoice.value,
    };
    setRevealedHints([...revealedHints, newClue]);
    setPenaltyPoints((prev) => prev + hintChoice.pointPenalty);
    setHintModalOpen(false);
  };

  const availableHintChoices = HintEngine.getAvailableHints(
    {
      id: targetPlayer.id,
      displayName: targetPlayer.displayName,
      country: targetPlayer.country,
      role: targetPlayer.role,
      battingStyle: targetPlayer.battingStyle,
      bowlingStyle: targetPlayer.bowlingStyle,
      playingEra: targetPlayer.playingEra,
      careerSpan: targetPlayer.careerSpan,
      teams: targetPlayer.teams,
    },
    revealedHintTypes,
    revealedHints.length
  );

  const formatTimerString = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isUrgent = timeLeft <= 10;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      {/* Top Header Card: Question Metadata & Timer */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        
        {/* Progress Bar Header */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div
            className={`h-full transition-all duration-300 ${
              isUrgent ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${Math.max(0, (timeLeft / question.timerSeconds) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
              Round {question.roundNumber} • {question.questionType}
            </span>
            {penaltyPoints > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                -{penaltyPoints} pts hint penalty
              </span>
            )}
          </div>

          {/* Premium Server-Authoritative Timer Display (Req #23, #60) */}
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl font-mono font-black text-lg transition-all ${
              isUrgent
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse scale-105 shadow-lg shadow-rose-500/20'
                : 'bg-slate-800/80 text-emerald-400 border border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTimerString(timeLeft)}</span>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="font-display font-black text-xl sm:text-2xl text-white leading-snug tracking-tight">
          {question.questionText}
        </h2>

        {/* Optional Image for IMAGE GUESS Format */}
        {question.imageUrl && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 max-h-64 flex justify-center bg-slate-950">
            <img
              src={question.imageUrl}
              alt="Cricketer Mystery"
              className={`object-cover w-full h-full max-h-64 transition-all ${
                isAnswered ? 'filter-none' : 'brightness-90 hover:brightness-100'
              }`}
            />
          </div>
        )}

        {/* Given Base Clues */}
        {question.clues && question.clues.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {question.clues.map((clue, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-800/50 border border-white/5 text-xs">
                <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">{clue.label}</span>
                <span className="text-white font-bold">{clue.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Revealed Hints Section */}
        {revealedHints.length > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-widest">
              <Lightbulb className="w-3.5 h-3.5 fill-amber-400" />
              <span>REVEALED HINTS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {revealedHints.map((hint, idx) => (
                <div key={idx} className="text-xs text-amber-200 font-semibold bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  {hint.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hint Trigger Button (Req #26, #61) */}
        {!isAnswered && timeLeft > 0 && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setHintModalOpen(true)}
              disabled={availableHintChoices.length === 0}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4 fill-amber-400" />
              <span>💡 USE HINT</span>
            </button>
          </div>
        )}
      </div>

      {/* Options Cards Grid (MCQ Format) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options?.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectTarget = QuestionEngine.verifyAnswer(option, targetPlayer);

          let optionStyle = 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800';
          if (isAnswered) {
            if (isCorrectTarget) {
              optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black shadow-lg shadow-emerald-500/20';
            } else if (isSelected && !isCorrectTarget) {
              optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-black';
            } else {
              optionStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(option)}
              disabled={disabled || isAnswered || timeLeft <= 0}
              className={`p-5 rounded-2xl border text-left font-bold text-base sm:text-lg flex items-center justify-between transition-all duration-200 ${optionStyle}`}
            >
              <span className="text-slate-100">{option}</span>
              {isAnswered && isCorrectTarget && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isAnswered && isSelected && !isCorrectTarget && <XCircle className="w-5 h-5 text-rose-400" />}
            </button>
          );
        })}
      </div>

      {/* Time Expired / Result Banner */}
      {isAnswered && (
        <div
          className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl animate-fade-in ${
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-400" />
            )}
            <div>
              <div className="font-black text-xl text-white">
                {isCorrect ? 'CORRECT ANSWER!' : timeLeft <= 0 ? "TIME'S UP!" : 'INCORRECT'}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                The cricketer is <strong className="text-amber-400">{targetPlayer.displayName}</strong> ({targetPlayer.country})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hint Modal */}
      {hintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-black text-lg">
                <Lightbulb className="w-5 h-5 fill-amber-400" />
                <span>CHOOSE A SMART HINT</span>
              </div>
              <button
                onClick={() => setHintModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select a verified clue to reveal. Points will be deducted from your final question score.
            </p>

            <div className="flex flex-col gap-2.5">
              {availableHintChoices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleUseHint(choice)}
                  className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-amber-500/10 border border-slate-700 hover:border-amber-500/40 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-100 group-hover:text-amber-300">
                      {choice.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Penalty: -{choice.pointPenalty} points
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-black">
                    REVEAL
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setHintModalOpen(false)}
              className="mt-2 w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
