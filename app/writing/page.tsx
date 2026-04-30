'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '../lib/store';
import courseData from '../data/course.json';
import { generateWritingExercises } from '../lib/exercise-generator';
import { Exercise, CourseData, Word } from '../types';
import { X, Check } from 'lucide-react';

// Reusing SentenceBuilder as it fits the "builder" pattern
import SentenceBuilder from '../lesson/[id]/components/SentenceBuilder';
import { SentenceWithHints } from '../components/Hints';

const data = courseData as CourseData;

export default function WritingPage() {
  const router = useRouter();
  const { completedLessons, completeLesson } = useProgressStore();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Interaction State
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (completedLessons.length > 0) {
       setExercises(generateWritingExercises(data.lessons, completedLessons));
    }
  }, [completedLessons]);

  if (!mounted) return <div className="p-8 text-center text-slate-500 font-medium">Chargement...</div>;

  if (completedLessons.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFA] font-sans">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4 text-center">Aucune leçon complétée</h1>
        <p className="text-slate-500 mb-8 text-center text-lg font-medium">Vous devez compléter au moins une leçon pour pratiquer l'écriture !</p>
        <button 
          onClick={() => router.push('/')}
          className="px-12 py-3 rounded-xl bg-emerald-500 border-b-4 border-emerald-700 text-white font-bold text-lg shadow-lg hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest w-full max-w-sm"
        >
          Retour
        </button>
      </div>
    );
  }

  if (exercises.length === 0) return <div className="p-8 text-center text-slate-500 font-medium">Génération des exercices...</div>;

  const currentExercise = exercises[currentIndex];
  // Loop back or refill if needed
  const progress = ((currentIndex % 10) / 10) * 100;

  const handleCheck = () => {
    if (isChecking) {
      if (isCorrect) {
          completeLesson('writing-dummy', 1);
          
          if (currentIndex >= exercises.length - 1) {
            setExercises(generateWritingExercises(data.lessons, completedLessons));
            setCurrentIndex(0);
          } else {
            setCurrentIndex(currentIndex + 1);
          }
          
          setIsChecking(false);
          setIsCorrect(null);
          setSelectedAnswer([]);
      } else {
        // If wrong, re-add to end
        setExercises([...exercises, currentExercise]);
        setCurrentIndex(currentIndex + 1);
        setIsChecking(false);
        setIsCorrect(null);
        setSelectedAnswer([]);
      }
      return;
    }

    if (selectedAnswer.length === 0) return;
    
    const builtValue = selectedAnswer.join('').replace(/\s+/g, '');
    const targetValue = currentExercise.answer.replace(/\s+/g, '');
    const correct = builtValue === targetValue;

    setIsCorrect(correct);
    setIsChecking(true);
  };

  const getDictionaryForExercise = () => {
     return data.lessons.flatMap(l => l.words);
  };

  const getPhrasesForExercise = () => {
     return data.lessons.flatMap(l => l.phrases);
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-[#FAFAFA] font-sans text-slate-800 overflow-hidden">
      {/* Header */}
      <header className="h-16 px-8 flex items-center shrink-0 justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-6 w-full max-w-4xl mx-auto flex-1">
          <button onClick={() => router.push('/')} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} strokeWidth={2.5} />
          </button>
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-bold text-slate-400">Écriture ∞</div>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center py-6 md:py-12 px-4 w-full">
        <div className="w-full max-w-3xl flex flex-col justify-center flex-1">
        
          <div className="flex items-start gap-4 md:gap-8 mb-4 md:mb-8">
            <div className="hidden md:flex w-32 h-32 bg-emerald-100 rounded-3xl items-center justify-center text-5xl shadow-sm border border-emerald-200 flex-shrink-0">
               <span>✍️</span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 md:mb-6">
                Écrivez ce mot en thaï
              </h2>
              <div className="relative inline-block pb-1">
                <SentenceWithHints 
                  text={currentExercise.question} 
                  dictionary={getDictionaryForExercise()} 
                  phrases={getPhrasesForExercise()}
                  isSentence={false}
                  exerciseOptions={[]} // No vocab needed for hints here as it's writing
                  hideHints={false}
                />
              </div>
              <div className="mt-6">
                <div className="text-3xl md:text-5xl font-thai font-medium text-emerald-600 tracking-wide">
                  {currentExercise.answer}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <SentenceBuilder 
              exercise={currentExercise}
              selected={selectedAnswer}
              onChange={setSelectedAnswer}
              disabled={isChecking}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`shrink-0 min-h-[100px] md:h-32 py-4 md:py-0 border-t-2 border-slate-200 flex items-center justify-center px-4 md:px-8 transition-colors duration-300 ${isChecking ? (isCorrect ? 'bg-emerald-50' : 'bg-rose-50 border-rose-200') : 'bg-white'}`}>
        <div className="w-full max-w-4xl flex sm:flex-row flex-col items-center justify-between gap-4">
          
          <div className="flex-1 w-full text-center sm:text-left">
            {isChecking && isCorrect && (
              <div className="flex items-center justify-center sm:justify-start gap-3 text-emerald-600 font-extrabold text-xl">
                <div className="bg-white text-emerald-500 rounded-full p-1"><Check size={24} strokeWidth={3} /></div>
                Parfait !
              </div>
            )}
            {isChecking && !isCorrect && (
              <div className="flex flex-col text-rose-600 font-extrabold text-xl gap-1 items-center sm:items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-rose-500 rounded-full p-1"><X size={24} strokeWidth={3} /></div>
                  Presque...
                </div>
                <div className="text-rose-800 text-sm mt-1 uppercase tracking-widest hidden sm:block">La bonne écriture était :</div>
                <div className="text-rose-900 font-medium font-thai text-2xl md:text-3xl mt-1 tracking-wider">{currentExercise.answer}</div>
              </div>
            )}
          </div>

          <button
            onClick={handleCheck}
            disabled={selectedAnswer.length === 0}
            className={`w-full sm:w-auto px-12 py-3 rounded-xl border-b-4 font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 disabled:scale-100 disabled:shadow-none
              ${isChecking 
                ? (isCorrect 
                  ? 'bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400' 
                  : 'bg-rose-500 border-rose-700 text-white hover:bg-rose-400') 
                : 'bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400'}
            `}
          >
            {isChecking ? 'Continuer' : 'Vérifier'}
          </button>
        </div>
      </footer>
    </div>
  );
}
