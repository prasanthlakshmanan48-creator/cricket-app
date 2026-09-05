'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { GuessFeedback } from '@/types/game';
import { soundFx } from '@/lib/sound-engine';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  guesses: GuessFeedback[];
  isWon: boolean;
  attemptsCount: number;
  maxAttempts?: number;
  streak?: number;
  challengeNumber?: number;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  guesses,
  isWon,
  attemptsCount,
  maxAttempts = 8,
  streak = 12,
  challengeNumber = 284,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build spoiler-free emoji matrix
  const emojiLines = guesses.map((g) => {
    const attrs = g.attributes;
    const countrySymbol = attrs.country.status === 'MATCH' ? '🟩' : attrs.country.status === 'CLOSE' ? '🟨' : '⬜';
    const roleSymbol = attrs.role.status === 'MATCH' ? '🟩' : attrs.role.status === 'CLOSE' ? '🟨' : '⬜';
    const battingSymbol = attrs.battingStyle.status === 'MATCH' ? '🟩' : '⬜';
    const debutSymbol = attrs.debutDecade.status === 'MATCH' ? '🟩' : attrs.debutDecade.status === 'CLOSE' ? '🟨' : '⬜';

    return `${countrySymbol}${roleSymbol}${battingSymbol}${debutSymbol}`;
  }).join('\n');

  const shareText = `WHO'S THAT CRICKETER? 🏏\nDaily #${challengeNumber}\n\n${emojiLines}\n\n${
    isWon ? `Solved in ${attemptsCount}/${maxAttempts} guesses!` : `Failed (X/${maxAttempts})`
  }\n🔥 ${streak} day streak\n\nPlay at: https://whosthatcricketer.com`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      soundFx.playClick();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy share text:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Who\'s That Cricketer?',
          text: shareText,
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel border border-white/15 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="font-display font-extrabold text-xl text-white">SHARE YOUR RESULT</h3>
          <p className="text-xs text-gray-400 mt-1">Spoiler-free emoji summary of your game</p>
        </div>

        {/* Share Preview Box */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
          {shareText}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopyText}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
            {copied ? 'COPIED TO CLIPBOARD!' : 'COPY RESULT'}
          </button>

          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
