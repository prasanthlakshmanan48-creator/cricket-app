'use client';

import React from 'react';
import { QuizQuestion } from '@/types/quiz';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Award, Zap, HelpCircle, ArrowRight } from 'lucide-react';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number; // 1 to 12
  totalQuestionsInRound: number; // 12
  roundNumber: number; // 1 to 4
  roundTitle: string;
  roundBadge: string;
  roundColor: string;
  selectedOptionIndex: number | null;
  isSubmitted: boolean;
  streak: number;
  score: number;
  totalPoints: number;
  onSelectOption: (optionIndex: number) => void;
  onNextQuestion: () => void;
}

const OPTION_PREFIXES = ['A', 'B', 'C', 'D'];

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestionsInRound,
  roundNumber,
  roundTitle,
  roundBadge,
  roundColor,
  selectedOptionIndex,
  isSubmitted,
  streak,
  score,
  totalPoints,
  onSelectOption,
  onNextQuestion,
}) => {
  const isCorrect = selectedOptionIndex !== null && selectedOptionIndex === question.correctOptionIndex;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 text-xs font-extrabold tracking-wider uppercase rounded-full text-white bg-gradient-to-r ${roundColor} shadow-lg`}>
            {roundBadge}
          </span>
          <span className="text-sm font-semibold text-slate-300">
            {roundTitle}
          </span>
        </div>

        {/* Progress Bar & Counters */}
        <div className="flex items-center space-x-6">
          {/* Streak Indicator */}
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak}x Streak</span>
            </motion.div>
          )}

          {/* Points Counter */}
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/40">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{totalPoints} pts</span>
          </div>

          {/* Question Index Counter */}
          <div className="text-xs font-bold text-slate-400 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700">
            Question <span className="text-emerald-400">{questionNumber}</span> / {totalQuestionsInRound}
          </div>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${roundColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${(questionNumber / totalQuestionsInRound) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Main Question Card */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
      >
        {/* Glow Ambient background accent */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Category Tag */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/50 px-3 py-1 rounded-lg border border-emerald-900/50">
            {question.category}
          </span>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> +{question.points} Points
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl md:text-2xl font-black text-slate-100 leading-snug tracking-tight mb-8">
          {question.questionText}
        </h2>

        {/* 4 Multiple Choice Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {question.options.map((option, idx) => {
            const prefix = OPTION_PREFIXES[idx];
            const isSelected = selectedOptionIndex === idx;
            const isCorrectOption = idx === question.correctOptionIndex;

            let optionStyle =
              'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800/80';

            if (isSubmitted) {
              if (isCorrectOption) {
                optionStyle =
                  'border-emerald-500 bg-emerald-950/60 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500';
              } else if (isSelected && !isCorrectOption) {
                optionStyle =
                  'border-red-500 bg-red-950/60 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.3)] ring-2 ring-red-500';
              } else {
                optionStyle = 'border-slate-800/40 bg-slate-950/30 text-slate-500 opacity-50';
              }
            }

            return (
              <motion.button
                key={idx}
                whileHover={!isSubmitted ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                onClick={() => !isSubmitted && onSelectOption(idx)}
                disabled={isSubmitted}
                className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-center space-x-3.5">
                  <span
                    className={`w-9 h-9 flex items-center justify-center rounded-xl font-black text-sm transition-colors ${
                      isSubmitted && isCorrectOption
                        ? 'bg-emerald-500 text-slate-950'
                        : isSubmitted && isSelected && !isCorrectOption
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {prefix}
                  </span>
                  <span className="font-bold text-base md:text-lg">{option}</span>
                </div>

                {isSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 ml-2" />
                )}
                {isSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 ml-2" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Fact / Explanation Box after submission */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5 text-red-400" />}
                </div>
                <div className="space-y-1">
                  <h4 className={`text-sm font-extrabold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Correct Answer! +Points Awarded' : `Incorrect! Correct answer is option ${OPTION_PREFIXES[question.correctOptionIndex]}: ${question.options[question.correctOptionIndex]}`}
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>

              {/* Next Question Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={onNextQuestion}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>{questionNumber < totalQuestionsInRound ? 'NEXT QUESTION' : 'COMPLETE ROUND'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
