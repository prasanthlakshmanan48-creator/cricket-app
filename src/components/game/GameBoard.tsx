'use client';

import React, { useState, useEffect } from 'react';
import { ProgressivePlayerImage } from './ProgressivePlayerImage';
import { PlayerSearchInput } from './PlayerSearchInput';
import { GuessHistoryRow } from './GuessHistoryRow';
import { ClueList } from './ClueList';
import { ResultModal } from './ResultModal';
import { ShareCardModal } from './ShareCardModal';
import { PlayerSearchResult, GuessFeedback, GameClue } from '@/types/game';
import { soundFx } from '@/lib/sound-engine';
import { HelpCircle, Sparkles, RefreshCw, Trophy } from 'lucide-react';

interface GameBoardProps {
  mode?: string;
  initialTargetPlayer?: any;
  challengeNumber?: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  mode = 'DAILY',
  initialTargetPlayer,
  challengeNumber = 284,
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [targetPlayer, setTargetPlayer] = useState<any>(initialTargetPlayer || null);
  const [guesses, setGuesses] = useState<GuessFeedback[]>([]);
  const [clues, setClues] = useState<GameClue[]>([]);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const maxAttempts = 8;
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);

  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize Game Session
  useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch('/api/games/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, targetId: initialTargetPlayer?.id }),
        });
        if (res.ok) {
          const data = await res.json();
          setSessionId(data.sessionId);
          setTargetPlayer(data.targetPlayer);
          setClues(data.clues || []);
        }
      } catch (err) {
        console.error('Failed to start session:', err);
      }
    }
    initSession();
  }, [mode, initialTargetPlayer]);

  const handleGuessSubmit = async (selectedPlayer: PlayerSearchResult) => {
    if (isCompleted || isSubmitting || !sessionId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/games/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          guessedPlayerId: selectedPlayer.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newGuess: GuessFeedback = data.feedback;
        setGuesses((prev) => [newGuess, ...prev]);
        setAttemptsCount(data.attemptsCount);
        setClues(data.unlockedClues || []);

        if (data.isCompleted) {
          setIsCompleted(true);
          setIsWon(data.isWon);
          setTimeout(() => setResultModalOpen(true), 800);
        } else {
          soundFx.playWrong();
        }
      }
    } catch (err) {
      console.error('Guess submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestartGame = async () => {
    setResultModalOpen(false);
    setGuesses([]);
    setAttemptsCount(0);
    setIsCompleted(false);
    setIsWon(false);

    try {
      const res = await fetch('/api/games/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'PRACTICE' }),
      });
      if (res.ok) {
        const data = await res.json();
        setSessionId(data.sessionId);
        setTargetPlayer(data.targetPlayer);
        setClues(data.clues || []);
      }
    } catch (err) {
      console.error('Restart failed:', err);
    }
  };

  if (!targetPlayer) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-3 text-center">
        <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-sm font-semibold text-gray-300">Initializing Cricket Match Engine...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8">
      
      {/* Header Info Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            {mode} CHALLENGE #{challengeNumber}
          </span>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white">
            WHO IS THIS CRICKETER?
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center gap-2">
            <span>Attempts:</span>
            <span className="text-amber-400 text-sm font-extrabold">{attemptsCount} / {maxAttempts}</span>
          </div>

          {isCompleted && (
            <button
              onClick={() => setResultModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-lg"
            >
              <Trophy className="w-4 h-4" /> VIEW RESULTS
            </button>
          )}
        </div>
      </div>

      {/* Main Gameplay Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Progressive Reveal Image & Search Box */}
        <div className="lg:col-span-5 flex flex-col items-center gap-6">
          <ProgressivePlayerImage
            imageUrl={targetPlayer.profileImage}
            attemptCount={attemptsCount}
            maxAttempts={maxAttempts}
            isGameWon={isWon}
            isGameCompleted={isCompleted}
            playerName={targetPlayer.displayName}
          />

          {/* Player Search Input */}
          <PlayerSearchInput
            onSelectPlayer={handleGuessSubmit}
            disabled={isCompleted || isSubmitting}
          />
        </div>

        {/* Right Column: Clues Panel & Attempt History */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Smart Clues Panel */}
          <ClueList clues={clues} attemptsCount={attemptsCount} maxAttempts={maxAttempts} />

          {/* Attempt History List */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gray-400 px-1">
              Your Guess History ({guesses.length})
            </h3>

            {guesses.length === 0 ? (
              <div className="p-8 rounded-2xl glass-panel border border-white/10 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                <HelpCircle className="w-6 h-6 text-amber-400/60" />
                <p className="font-medium text-gray-300">No guesses submitted yet!</p>
                <p>Type a cricketer's name in the search box above to make your 1st attempt.</p>
              </div>
            ) : (
              guesses.map((g) => <GuessHistoryRow key={g.guessedPlayerId + g.attemptNumber} guess={g} />)
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ResultModal
        isOpen={resultModalOpen}
        isWon={isWon}
        attemptsCount={attemptsCount}
        maxAttempts={maxAttempts}
        playerName={targetPlayer.displayName}
        playerCountry={targetPlayer.nationality}
        playerRole={targetPlayer.role}
        playerSpan={targetPlayer.careerSpan}
        playerImage={targetPlayer.profileImage}
        statsOverview={targetPlayer.statsOverview || []}
        onShare={() => {
          setResultModalOpen(false);
          setShareModalOpen(true);
        }}
        onRestart={handleRestartGame}
        mode={mode}
      />

      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        guesses={guesses}
        isWon={isWon}
        attemptsCount={attemptsCount}
        maxAttempts={maxAttempts}
        challengeNumber={challengeNumber}
      />
    </div>
  );
};
