import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { playThaiTTS } from '../lib/tts';
import { useProgressStore } from '../lib/store';
import { motion, AnimatePresence } from 'motion/react';

interface PairMatchProps {
  pairs: Word[];
  onComplete: () => void;
}

export default function PairMatch({ pairs, onComplete }: PairMatchProps) {
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
    setLeftCards([...lefts].sort(() => Math.random() - 0.5));
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
      }, 800);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [matchedIds.size, pairs.length]); // Removed onComplete to prevent infinite renders

  return (
    <div className="w-full flex justify-between gap-4 py-8">
      {/* Left Column (FR/EN) */}
      <div className="flex flex-col gap-4 flex-1">
        <AnimatePresence>
          {leftCards.map(card => {
            const isMatched = matchedIds.has(card.id);
            const isSelected = selectedLeft === card.id;
            const isError = errorIds.has(card.id) && isSelected;
            
            return (
              <motion.button
                key={`L-${card.id}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isMatched ? 0 : 1, scale: isMatched ? 0.9 : 1 }}
                onClick={() => handleSelectLeft(card.id)}
                disabled={isMatched}
                className={`p-4 rounded-xl text-lg font-medium border-b-4 transition-all min-h-[80px] sm:min-h-[100px] flex items-center justify-center
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
        </AnimatePresence>
      </div>

      {/* Right Column (TH) */}
      <div className="flex flex-col gap-4 flex-1">
        <AnimatePresence>
          {rightCards.map(card => {
            const isMatched = matchedIds.has(card.id);
            const isSelected = selectedRight === card.id;
            const isError = errorIds.has(card.id) && isSelected;
            
            return (
              <motion.button
                key={`R-${card.id}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isMatched ? 0 : 1, scale: isMatched ? 0.9 : 1 }}
                onClick={() => handleSelectRight(card.id)}
                disabled={isMatched}
                className={`p-4 rounded-xl text-lg font-medium border-b-4 transition-all min-h-[80px] sm:min-h-[100px] flex items-center justify-center
                  ${isMatched ? 'pointer-events-none' : ''}
                  ${isSelected 
                    ? isError 
                      ? 'bg-rose-100 border-rose-300 text-rose-700' 
                      : 'bg-indigo-100 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xl">{card.text}</span>
                  <span className="text-sm opacity-60 font-mono mt-1 text-slate-500">[{card.phonetic}]</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
