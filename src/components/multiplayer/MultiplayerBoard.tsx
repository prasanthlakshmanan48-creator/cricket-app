'use client';

import React, { useState, useEffect } from 'react';
import { Room, RoomPlayer, ReactionEmote } from '@/types/multiplayer';
import { QuizCard } from '@/components/quiz/QuizCard';
import { MatchResultPodium } from './MatchResultPodium';
import { getQuestionsForRound, getRoundMetadata } from '@/lib/quiz-engine';
import { QuizQuestion } from '@/types/quiz';
import { soundEngine } from '@/lib/sound-engine';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Zap, MessageSquare, ShieldCheck, Flame, Send } from 'lucide-react';

interface MultiplayerBoardProps {
  room: Room;
  currentPlayerId: string;
  onMatchComplete: () => void;
}

const EMOTE_OPTIONS: ReactionEmote['emoji'][] = ['🔥', '👏', '😂', '😮', '🏏', '💯'];

export const MultiplayerBoard: React.FC<MultiplayerBoardProps> = ({
  room: initialRoom,
  currentPlayerId,
  onMatchComplete,
}) => {
  const [room, setRoom] = useState<Room>(initialRoom);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [emotes, setEmotes] = useState<ReactionEmote[]>([]);
  const [firstCorrectPlayer, setFirstCorrectPlayer] = useState<string | null>(null);
  const [isMatchFinished, setIsMatchFinished] = useState<boolean>(false);

  // Initialize questions for current round
  useEffect(() => {
    const roundQs = getQuestionsForRound(currentRound, 12);
    setQuestions(roundQs);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setTimerSeconds(room.settings.timeLimitSeconds || 60);
    setFirstCorrectPlayer(null);
  }, [currentRound, room.settings.timeLimitSeconds]);

  // Round Countdown Timer
  useEffect(() => {
    if (isMatchFinished) return;

    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return room.settings.timeLimitSeconds || 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, currentRound, isMatchFinished]);

  const currentQuestion = questions[currentQuestionIndex];
  const roundMeta = getRoundMetadata(currentRound);

  // Handle Option Selection
  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted || !currentQuestion) return;

    setSelectedOptionIndex(optionIndex);
    setIsSubmitted(true);

    const isCorrect = optionIndex === currentQuestion.correctOptionIndex;
    const pointsEarned = isCorrect ? currentQuestion.points + (firstCorrectPlayer === null ? 250 : 0) : 0;

    if (isCorrect) {
      soundEngine.playCorrect();
      if (firstCorrectPlayer === null) {
        setFirstCorrectPlayer('YOU');
      }
    } else {
      soundEngine.playWrong();
    }

    // Update player score in room
    setRoom((prev) => {
      const updatedPlayers = prev.players.map((p) => {
        if (p.id === currentPlayerId) {
          return {
            ...p,
            score: p.score + pointsEarned,
            status: isCorrect ? ('CORRECT' as const) : ('WRONG' as const),
          };
        }
        return p;
      });
      return { ...prev, players: updatedPlayers };
    });
  };

  // Handle Next Question or Round Transition
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < 12) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
      setTimerSeconds(room.settings.timeLimitSeconds || 60);
    } else if (currentRound < room.totalRounds) {
      setCurrentRound((prev) => prev + 1);
    } else {
      soundEngine.playWin();
      setIsMatchFinished(true);
    }
  };

  // Dispatch Emote
  const handleSendEmote = (emoji: ReactionEmote['emoji']) => {
    const newEmote: ReactionEmote = {
      id: `e_${Date.now()}`,
      senderId: currentPlayerId,
      senderName: 'YOU',
      emoji,
      timestamp: Date.now(),
    };
    setEmotes((prev) => [newEmote, ...prev.slice(0, 4)]);
  };

  if (isMatchFinished) {
    return (
      <MatchResultPodium
        players={room.players}
        currentPlayerId={currentPlayerId}
        onRematch={() => {
          setIsMatchFinished(false);
          setCurrentRound(1);
        }}
        onExit={onMatchComplete}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 font-bold">
        Loading Multiplayer Round...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      {/* Real-time Floating Live Scoreboard Header */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Match Timer */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
          <span className="text-xs font-bold text-slate-400">TIMER:</span>
          <span className="text-sm font-black text-emerald-400 font-mono">{timerSeconds}s</span>
        </div>

        {/* Live Leaderboard Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          {room.players
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((p, idx) => (
              <div
                key={p.id}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center space-x-2 border transition-all ${
                  p.id === currentPlayerId
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <span>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                <span>{p.username}</span>
                <span className="text-emerald-400 font-black">{p.score}</span>
              </div>
            ))}
        </div>

        {/* Emote Reaction Bar */}
        <div className="flex items-center space-x-1">
          {EMOTE_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSendEmote(emoji)}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-sm transition-transform hover:scale-125 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* First-Correct Bonus Banner */}
      <AnimatePresence>
        {firstCorrectPlayer && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black text-center flex items-center justify-center space-x-2 shadow-lg"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>🥇 FIRST TO GUESS CORRECTLY: {firstCorrectPlayer}! (+250 BONUS POINTS)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Active Reaction Emotes */}
      <div className="relative">
        <div className="absolute right-4 top-2 z-30 flex flex-col space-y-2 pointer-events-none">
          <AnimatePresence>
            {emotes.map((e) => (
              <motion.div
                key={e.id}
                initial={{ scale: 0, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200 flex items-center space-x-2 shadow-xl"
              >
                <span className="text-base">{e.emoji}</span>
                <span>{e.senderName}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Main Quiz Card */}
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
          streak={0}
          score={room.players.find((p) => p.id === currentPlayerId)?.score || 0}
          totalPoints={room.players.find((p) => p.id === currentPlayerId)?.score || 0}
          onSelectOption={handleSelectOption}
          onNextQuestion={handleNextQuestion}
        />
      </div>
    </div>
  );
};
