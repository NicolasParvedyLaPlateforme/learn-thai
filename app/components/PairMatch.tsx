import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { Volume2 } from 'lucide-react';
import { playThaiTTS } from '../lib/tts';
import { useProgressStore } from '../lib/store';
import { motion, AnimatePresence } from 'motion/react';

interface PairMatchProps {
  pairs: Word[];
  mode?: 'normal' | 'audio-only' | 'script-only';
  onComplete: () => void;
}

export default function PairMatch({ pairs, mode = 'normal', onComplete }: PairMatchProps) {
  const { language } = useProgressStore();
  const [leftCards, setLeftCards] = useState<{id: string, text: string, type: 'left'}[]>([]);
  const [rightCards, setRightCards] = useState<{id: string, text: string, phonetic: string, type: 'right'}[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set()); // IDs that recently failed

  useEffect(() => {
    // Initialize cards and shuffle them independently
    const lefts = pairs.map(p => ({
      id: p.id,
      text: language === 'en' ? (p.en || p.fr) : p.fr,
      type: 'left' as const
    }));
    const rights = pairs.map(p => ({
      id: p.id,
      text: p.th,
      phonetic: p.phonetic,
      type: 'right' as const
    }));

    // shuffle
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeftCards([...lefts].sort(() => Math.random() - 0.5));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRightCards([...rights].sort(() => Math.random() - 0.5));
  }, [pairs, language]);

  const handleSelectLeft = (id: string) => {
    if (matchedIds.has(id)) return;
    setSelectedLeft(id);
    checkMatch(id, selectedRight);
  };

  const handleSelectRight = (id: string) => {
    if (matchedIds.has(id)) return;
    setSelectedRight(id);
    playThaiTTS(pairs.find(p => p.id === id)?.th || '');
    checkMatch(selectedLeft, id);
  };

  const checkMatch = (leftId: string | null, rightId: string | null) => {
    if (!leftId || !rightId) return;

    if (leftId === rightId) {
      // Match!
      setTimeout(() => {
        setMatchedIds(prev => new Set(prev).add(leftId));
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500); // short delay to show both selected
    } else {
      // Mismatch! Show error state briefly
      const errList = new Set([leftId, rightId]);
      setErrorIds(errList);
      setTimeout(() => {
        setErrorIds(new Set());
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600); // delay before resetting selection
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (matchedIds.size > 0 && matchedIds.size === pairs.length) {
      timeout = setTimeout(() => {
        onComplete();
      }, 400);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedIds.size, pairs.length]); // Removed onComplete to prevent infinite renders

  const isAllMatched = matchedIds.size > 0 && matchedIds.size === pairs.length;

  return (
    <div className="relative w-full py-2 sm:py-8">
      <div className={`w-full flex justify-between gap-4 transition-opacity duration-500 ${isAllMatched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Left Column (FR/EN) */}
        <div className="flex flex-col gap-3 sm:gap-4 flex-1">
          {leftCards.map(card => {
            const isMatched = matchedIds.has(card.id);
            const isSelected = selectedLeft === card.id;
            const isError = errorIds.has(card.id) && isSelected;
            
            return (
              <motion.button
                key={`L-${card.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isMatched ? 0 : 1, scale: isMatched ? 0.9 : 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => handleSelectLeft(card.id)}
                disabled={isMatched}
                style={{ WebkitTapHighlightColor: 'transparent', willChange: 'opacity, transform' }}
                className={`px-2 py-4 rounded-xl text-base sm:text-lg font-medium border-b-4 transition-colors h-24 sm:h-32 flex items-center justify-center text-center leading-tight transform-gpu backface-hidden
                  ${isMatched ? 'pointer-events-none' : ''}
                  ${isSelected 
                    ? isError 
                      ? 'bg-rose-100 border-rose-300 text-rose-700' 
                      : 'bg-indigo-100 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                {card.text}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column (TH) */}
        <div className="flex flex-col gap-3 sm:gap-4 flex-1">
          {rightCards.map(card => {
            const isMatched = matchedIds.has(card.id);
            const isSelected = selectedRight === card.id;
            const isError = errorIds.has(card.id) && isSelected;
            
            return (
              <motion.button
                key={`R-${card.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isMatched ? 0 : 1, scale: isMatched ? 0.9 : 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => handleSelectRight(card.id)}
                disabled={isMatched}
                style={{ WebkitTapHighlightColor: 'transparent', willChange: 'opacity, transform' }}
                className={`px-2 py-4 rounded-xl text-base sm:text-lg font-medium border-b-4 transition-colors h-24 sm:h-32 flex items-center justify-center text-center leading-tight transform-gpu backface-hidden
                  ${isMatched ? 'pointer-events-none' : ''}
                  ${isSelected 
                    ? isError 
                      ? 'bg-rose-100 border-rose-300 text-rose-700' 
                      : 'bg-indigo-100 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  {mode === 'audio-only' ? (
                    <Volume2 className={`w-8 h-8 sm:w-10 sm:h-10 ${isSelected || isMatched ? 'text-indigo-600' : 'text-slate-400'}`} />
                  ) : (
                    <>
                      <span className="text-xl sm:text-2xl">{card.text}</span>
                      {mode !== 'script-only' && (
                        <span className="text-xs sm:text-sm opacity-60 font-mono mt-1 text-slate-500">[{card.phonetic}]</span>
                      )}
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isAllMatched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="bg-emerald-500 text-white font-black text-3xl md:text-5xl px-8 py-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border-b-[6px] border-emerald-700">
              <span className="text-4xl md:text-5xl">✨</span>
              {language === 'en' ? 'Excellent!' : 'Bravo !'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
