'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '../lib/store';
import courseData from '../data/course.json';
import { generateEndlessPairMatching } from '../lib/exercise-generator';
import { Exercise, CourseData, Word } from '../types';
import { X, Check, Play } from 'lucide-react';
import { playThaiTTS, preloadThaiVoices } from '../lib/tts';
import { motion, AnimatePresence } from 'motion/react';

// Exercise Components
import PairMatch from '../components/PairMatch';

const data = courseData as CourseData;

export default function ReviewPairsPage() {
  const router = useRouter();
  const { completedLessons, xp, completeLesson, language } = useProgressStore();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Interaction State
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    let initialized = false;
    const timer = setTimeout(() => {
      setMounted(true);
      if(!initialized && completedLessons.length > 0) {
        setExercises(generateEndlessPairMatching(data.lessons, completedLessons, language));
        initialized = true;
      }
    }, 0);
    
    preloadThaiVoices();
    return () => clearTimeout(timer);
  }, [completedLessons, language]);


  if (!mounted) return <div className="p-8 text-center text-slate-500 font-medium">{language === 'en' ? 'Loading...' : 'Chargement...'}</div>;

  if (completedLessons.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFA] font-sans">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4 text-center">
          {language === 'en' ? 'No completed lessons' : 'Aucune leçon complétée'}
        </h1>
        <p className="text-slate-500 mb-8 text-center text-lg font-medium">
          {language === 'en' ? 'You must complete at least one lesson to access this!' : 'Vous devez compléter au moins une leçon pour pouvoir y accéder !'}
        </p>
        <button 
          onClick={() => router.push('/learn')}
          className="px-12 py-3 rounded-xl bg-fuchsia-500 border-b-4 border-fuchsia-700 text-white font-bold text-lg shadow-lg hover:bg-fuchsia-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest w-full max-w-sm"
        >
          {language === 'en' ? 'Back' : 'Retour'}
        </button>
      </div>
    );
  }

  if (exercises.length === 0) return <div className="p-8 text-center text-slate-500 font-medium">{language === 'en' ? 'Loading...' : 'Chargement...'}</div>;

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex % 10) / 10) * 100;

  const handleCheck = () => {
    if (isChecking) {
      if (isCorrect) {
          completeLesson('review-dummy', 1); // grant 1 xp
          if (currentIndex >= exercises.length - 3) {
            setExercises(prev => [...prev, ...generateEndlessPairMatching(data.lessons, completedLessons, language)]);
          }
          setCurrentIndex(currentIndex + 1);
          setIsChecking(false);
          setIsCorrect(null);
      }
      return;
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-[#FAFAFA] font-sans text-slate-800 overflow-hidden">
      {/* Header / Progress bar */}
      <header className="h-16 flex items-center shrink-0 justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-6 w-full max-w-2xl mx-auto h-full px-4 flex-1">
          <button onClick={() => router.push('/learn')} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} strokeWidth={2.5} />
          </button>
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="bg-fuchsia-500 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(217,70,239,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-bold text-slate-400">{language === 'en' ? 'Pairs ∞' : 'Paires ∞'}</div>
        </div>
      </header>

      {/* Main Exercise Area */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center py-2 sm:py-6 md:py-12 px-4 w-full">
        <div className="w-full max-w-3xl flex flex-col justify-center flex-1">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentExercise.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="flex items-start gap-4 md:gap-8 mb-4 md:mb-8">
                <div className="hidden md:flex w-32 h-32 bg-fuchsia-100 rounded-3xl items-center justify-center text-5xl shadow-sm border border-fuchsia-200 relative flex-shrink-0">
                   <span className="animate-pulse">🎴</span>
                   <div className="absolute -right-2 -top-2 w-6 h-6 bg-fuchsia-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex-1 mt-2 md:mt-0">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 md:mb-6 text-center md:text-left">
                    {currentExercise.question}
                  </h2>
                </div>
              </div>

              <div className="mt-2">
                <PairMatch 
                  key={currentExercise.id}
                  pairs={currentExercise.pairs as Word[]}
                  mode={currentExercise.pairMatchMode}
                  onComplete={() => {
                    completeLesson('review-dummy', 1); // grant 1 xp
                    if (currentIndex >= exercises.length - 3) {
                      setExercises(prev => [...prev, ...generateEndlessPairMatching(data.lessons, completedLessons, language)]);
                    }
                    setCurrentIndex(prev => prev + 1);
                    setIsChecking(false);
                    setIsCorrect(null);
                  }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className={`shrink-0 min-h-[100px] md:h-32 py-4 md:py-0 border-t-2 border-slate-200 flex flex-col justify-center transition-colors duration-300 hidden`}>
        <div className="w-full max-w-2xl px-4 mx-auto flex sm:flex-row flex-col items-center justify-between gap-4">
          
          <div className="flex-1 w-full text-center sm:text-left">
            {isChecking && isCorrect && (
              <div className="flex items-center justify-center sm:justify-start gap-3 text-emerald-600 font-extrabold text-xl">
                <div className="bg-white text-emerald-500 rounded-full p-1"><Check size={24} strokeWidth={3} /></div>
                {language === 'en' ? 'Excellent!' : 'Excellent !'}
              </div>
            )}
          </div>

          <button
            id="next-btn"
            onClick={handleCheck}
            className={`w-full sm:w-auto px-12 py-3 rounded-xl border-b-4 font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 disabled:scale-100 disabled:shadow-none bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400`}
          >
             {language === 'en' ? 'Continue' : 'Continuer'}
          </button>
        </div>
      </footer>
    </div>
  );
}
