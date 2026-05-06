'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Volume2 } from 'lucide-react';
import { useProgressStore } from '../lib/store';
import { THAI_ALPHABET, AlphabetItem } from '../lib/alphabet-data';

import { playThaiTTS, preloadThaiVoices } from '../lib/tts';
import { ColoredPhonetic } from '../components/ColoredPhonetic';

export default function AlphabetPage() {
  const router = useRouter();
  const { seenAlphabets, markAlphabetSeen, language } = useProgressStore();
  
  const [mounted, setMounted] = useState(false);
  const [currentItem, setCurrentItem] = useState<AlphabetItem | null>(null);
  const [isLessonPhase, setIsLessonPhase] = useState(false);
  
  // Exercise state
  const [options, setOptions] = useState<AlphabetItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<AlphabetItem | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateOptions = useCallback((correctItem: AlphabetItem) => {
    // Pick 1 distractor of the same type
    const samesTypeDistractors = THAI_ALPHABET.filter(i => i.type === correctItem.type && i.letter !== correctItem.letter);
    const distractor = samesTypeDistractors[Math.floor(Math.random() * samesTypeDistractors.length)];
    
    // Shuffle the two options
    const newOptions = [correctItem, distractor].sort(() => Math.random() - 0.5);
    setOptions(newOptions);
  }, []);

  const pickNextItem = useCallback((currentSeen: string[]) => {
    // Basic progression: maybe prioritize unseen, or just totally random?
    // Let's do 30% chance for a new one, 70% for review, unless no reviews available.
    let itemToPick: AlphabetItem;
    
    const unseen = THAI_ALPHABET.filter(i => !currentSeen.includes(i.letter));
    const seen = THAI_ALPHABET.filter(i => currentSeen.includes(i.letter));
    
    const isNew = unseen.length > 0 && (seen.length === 0 || Math.random() < 0.3);

    if (isNew) {
      // Pick unseen
      itemToPick = unseen[Math.floor(Math.random() * unseen.length)];
      setIsLessonPhase(true);
    } else {
      // Pick seen
      itemToPick = seen[Math.floor(Math.random() * seen.length)];
      setIsLessonPhase(false);
    }

    setCurrentItem(itemToPick);
    generateOptions(itemToPick);
    setSelectedOption(null);
    setIsCorrect(null);
  }, [generateOptions]);

  useEffect(() => {
    let initialized = false;
    const timer = setTimeout(() => {
      setMounted(true)
      if(!initialized) {
        pickNextItem(seenAlphabets);
        initialized = true;
      }
    }, 0);
    
    // Pre-load voices for Safari/Chrome so they are ready when the user clicks
    preloadThaiVoices();
    return () => clearTimeout(timer);
  }, [pickNextItem, seenAlphabets]);

  const handleNextInLesson = () => {
    if (currentItem) {
      markAlphabetSeen(currentItem.letter);
      // We know it is now seen, we switch to exercise phase for this item
      setIsLessonPhase(false);
    }
  };

  const handleCheck = () => {
    if (selectedOption?.letter === currentItem?.letter) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleContinue = () => {
    pickNextItem(useProgressStore.getState().seenAlphabets);
  };

  const playTTS = (text: string) => {
    playThaiTTS(text);
  };

  if (!mounted || !currentItem) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="h-14 px-4 flex items-center border-b border-slate-200 bg-white">
        <Link href="/learn" className="text-slate-400 hover:text-slate-600">
          <X size={24} />
        </Link>
        <div className="flex-1 px-8">
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-full" />
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col p-4 md:p-8">
        {isLessonPhase ? (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800 text-center mb-8">
              {language === 'en' ? 'New letter!' : 'Nouvelle lettre !'}
            </h1>
            
            <div className="flex-1 flex flex-col items-center justify-center -mt-8">
              <div className="w-48 h-48 bg-white rounded-3xl shadow-sm border-2 border-slate-100 flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform" onClick={() => playTTS(currentItem.exampleWord)}>
                <span className="text-7xl font-medium text-slate-800">{currentItem.letter}</span>
                <div className="absolute top-4 right-4 text-slate-300">
                  <Volume2 size={24} />
                </div>
              </div>
              
              <div className="mt-12 space-y-4 text-center">
                <p className="text-2xl font-bold text-slate-800"><ColoredPhonetic phonetic={currentItem.pronunciation} /></p>
                <div className="text-xl text-slate-600">
                  <span className="font-bold">{currentItem.exampleWord}</span> 
                  <span className="opacity-75"> ({language === 'en' ? currentItem.exampleTranslationEn : currentItem.exampleTranslation})</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextInLesson}
              className="w-full bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_4px_0_#4338ca] hover:shadow-[0_4px_0_#4338ca] active:shadow-[0_0px_0_#4338ca] active:translate-y-[4px] mt-auto"
            >
              {language === 'en' ? 'Next' : 'Suivant'}
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">
              {language === 'en' ? 'Find the correct letter for:' : 'Complétez le mot'} (<ColoredPhonetic phonetic={currentItem.pronunciation} />)
            </h2>

            <div className="flex-1 flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-medium text-slate-800 mb-12 flex items-center gap-2">
                <span>{currentItem.exampleWord.substring(0, currentItem.exampleWord.indexOf(currentItem.letter))}</span>
                <div className="w-16 h-20 md:w-20 md:h-24 border-b-4 border-slate-300 flex items-center justify-center text-indigo-500 pb-2">
                  {selectedOption ? selectedOption.letter : ''}
                </div>
                <span>{currentItem.exampleWord.substring(currentItem.exampleWord.indexOf(currentItem.letter) + currentItem.letter.length)}</span>
                
                <button 
                  onClick={() => playTTS(currentItem.exampleWord)}
                  className="ml-2 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Volume2 size={24} />
                </button>
              </div>

              <div className="w-full max-w-sm grid grid-cols-2 gap-4">
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (isCorrect === null) setSelectedOption(opt);
                    }}
                    className={`
                      aspect-[4/3] rounded-2xl border-2 text-4xl font-medium flex items-center justify-center transition-all
                      ${isCorrect !== null ? 'cursor-default' : 'hover:bg-slate-50 cursor-pointer active:scale-95'}
                      ${
                        selectedOption === opt
                          ? isCorrect === true
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                            : isCorrect === false
                            ? 'border-rose-500 bg-rose-50 text-rose-600'
                            : 'border-indigo-500 bg-indigo-50 text-indigo-600'
                          : 'border-slate-200 bg-white text-slate-700'
                      }
                    `}
                  >
                    {opt.letter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8">
              <button
                onClick={handleCheck}
                disabled={!selectedOption || isCorrect !== null}
                className={`w-full font-bold py-4 rounded-2xl transition-all ${
                  isCorrect !== null 
                    ? 'opacity-0 pointer-events-none' 
                    : selectedOption
                      ? 'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white shadow-[0_4px_0_#059669] hover:shadow-[0_4px_0_#059669] active:shadow-[0_0px_0_#059669] active:translate-y-[4px]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {language === 'en' ? 'Check' : 'Vérifier'}
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Feedback Banner */}
      {isCorrect !== null && (
        <div className={`fixed bottom-0 left-0 right-0 p-4 md:p-6 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] border-t z-50 ${isCorrect ? 'bg-emerald-100 border-emerald-200/50' : 'bg-rose-100 border-rose-200/50'}`}>
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
            <div className="flex items-center gap-4">
              <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isCorrect ? 'bg-white text-emerald-500' : 'bg-white text-rose-500'}`}>
                {isCorrect ? <span className="text-2xl">✓</span> : <X size={24} />}
              </div>
              <div className={`font-bold text-lg md:text-xl ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isCorrect ? (language === 'en' ? 'Excellent!' : 'Excellent !') : (language === 'en' ? 'The correct answer was: ' : 'La bonne réponse était : ') + currentItem.letter}
              </div>
            </div>
            <button
               onClick={handleContinue}
               className={`w-full md:w-auto font-bold py-4 md:py-3 px-8 rounded-xl md:rounded-2xl transition-all shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-[0_0px_0] active:translate-y-[4px] ${
                 isCorrect ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-rose-500 text-white hover:bg-rose-400'
               }`}
            >
              {language === 'en' ? 'Continue' : 'Continuer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
