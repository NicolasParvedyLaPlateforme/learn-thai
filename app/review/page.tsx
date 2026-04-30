'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '../lib/store';
import courseData from '../data/course.json';
import { generateEndlessReviewExercises } from '../lib/exercise-generator';
import { Exercise, CourseData, Word } from '../types';
import { X, Check } from 'lucide-react';

// Exercise Components
import WordMatch from '../lesson/[id]/components/WordMatch';
import SentenceBuilder from '../lesson/[id]/components/SentenceBuilder';
import { SentenceWithHints } from '../components/Hints';

const data = courseData as CourseData;

export default function ReviewPage() {
  const router = useRouter();
  const { completedLessons, xp, completeLesson } = useProgressStore();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Interaction State
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (completedLessons.length > 0) {
       setExercises(generateEndlessReviewExercises(data.lessons, completedLessons));
    }
  }, [completedLessons]);

  if (!mounted) return <div className="p-8 text-center text-slate-500 font-medium">Chargement...</div>;

  if (completedLessons.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFA] font-sans">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4 text-center">Aucune leçon complétée</h1>
        <p className="text-slate-500 mb-8 text-center text-lg font-medium">Vous devez compléter au moins une leçon pour pouvoir y accéder !</p>
        <button 
          onClick={() => router.push('/')}
          className="px-12 py-3 rounded-xl bg-indigo-500 border-b-4 border-indigo-700 text-white font-bold text-lg shadow-lg hover:bg-indigo-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest w-full max-w-sm"
        >
          Retour
        </button>
      </div>
    );
  }

  if (exercises.length === 0) return <div className="p-8 text-center text-slate-500 font-medium">Chargement...</div>;

  const currentExercise = exercises[currentIndex];
  // Since it's endless, the progress is just cosmetic, let's keep it fixed or bouncing
  const progress = ((currentIndex % 10) / 10) * 100;

  const handleCheck = () => {
    if (isChecking) {
      // Move to next exercise
      if (isCorrect) {
          // Give 1 XP per correct answer
          completeLesson('review-dummy', 1);
          
          if (currentIndex >= exercises.length - 3) {
            // Refill exercises when running low
            setExercises(prev => [...prev, ...generateEndlessReviewExercises(data.lessons, completedLessons)]);
          }
          
          setCurrentIndex(currentIndex + 1);
          setIsChecking(false);
          setIsCorrect(null);
          setSelectedAnswer(null);
      } else {
        // If wrong, we re-add the exercise to the end of the current batch
        setExercises([...exercises, currentExercise]);
        setCurrentIndex(currentIndex + 1);
        setIsChecking(false);
        setIsCorrect(null);
        setSelectedAnswer(null);
      }
      return;
    }

    // Validate
    if (!selectedAnswer) return;
    
    let correct = false;
    if (currentExercise.type === 'word-match') {
      correct = selectedAnswer === currentExercise.answer;
    } else if (currentExercise.type === 'sentence-builder') {
      const builtSentence = (selectedAnswer as string[]).join('').replace(/\s+/g, '');
      const expectedSentence = currentExercise.answer.replace(/\s+/g, '');
      correct = builtSentence === expectedSentence;
    }

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
      {/* Header / Progress bar */}
      <header className="h-16 px-8 flex items-center shrink-0 justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-6 w-full max-w-4xl mx-auto flex-1">
          <button onClick={() => router.push('/')} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} strokeWidth={2.5} />
          </button>
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-bold text-slate-400">Rappel ∞</div>
        </div>
      </header>

      {/* Main Exercise Area */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center py-6 md:py-12 px-4 w-full">
        <div className="w-full max-w-3xl flex flex-col justify-center flex-1">
        
          {/* The Question / Hint System */}
          <div className="flex items-start gap-4 md:gap-8 mb-4 md:mb-8">
            <div className="hidden md:flex w-32 h-32 bg-indigo-100 rounded-3xl items-center justify-center text-5xl shadow-sm border border-indigo-200 relative flex-shrink-0">
               <span className="animate-pulse">🧠</span>
               <div className="absolute -right-2 -top-2 w-6 h-6 bg-indigo-500 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="flex-1 mt-2 md:mt-0">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 md:mb-6">
                {currentExercise.type === 'word-match' ? "Sélectionnez la bonne traduction" : "Traduisez cette phrase"}
              </h2>
              <div className="relative inline-block pb-1">
                <SentenceWithHints 
                  text={currentExercise.question} 
                  dictionary={getDictionaryForExercise()} 
                  phrases={getPhrasesForExercise()}
                  isSentence={currentExercise.type === 'sentence-builder'}
                  exerciseOptions={currentExercise.options as Word[]}
                  hideHints={currentExercise.hideHints}
                />
              </div>
            </div>
          </div>

          {/* Exercise Options */}
          <div className="mt-8">
            {currentExercise.type === 'word-match' ? (
              <WordMatch 
                exercise={currentExercise} 
                selected={selectedAnswer as string} 
                onChange={setSelectedAnswer}
                disabled={isChecking}
              />
            ) : (
              <SentenceBuilder 
                exercise={currentExercise}
                selected={selectedAnswer as string[] || []}
                onChange={setSelectedAnswer}
                disabled={isChecking}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className={`shrink-0 min-h-[100px] md:h-32 py-4 md:py-0 border-t-2 border-slate-200 flex items-center justify-center px-4 md:px-8 transition-colors duration-300 ${isChecking ? (isCorrect ? 'bg-indigo-50' : 'bg-rose-50 border-rose-200') : 'bg-white'}`}>
        <div className="w-full max-w-4xl flex sm:flex-row flex-col items-center justify-between gap-4">
          
          <div className="flex-1 w-full text-center sm:text-left">
            {isChecking && isCorrect && (
              <div className="flex items-center justify-center sm:justify-start gap-3 text-indigo-600 font-extrabold text-xl">
                <div className="bg-white text-indigo-500 rounded-full p-1"><Check size={24} strokeWidth={3} /></div>
                Excellent !
              </div>
            )}
            {isChecking && !isCorrect && (
              <div className="flex flex-col text-rose-600 font-extrabold text-xl gap-1 items-center sm:items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-rose-500 rounded-full p-1"><X size={24} strokeWidth={3} /></div>
                  Incorrect.
                </div>
                <div className="text-rose-800 text-sm mt-1 uppercase tracking-widest hidden sm:block">Réponse correcte :</div>
                <div className="text-rose-900 font-medium font-thai text-xl md:text-2xl mt-1 sm:mt-0">{currentExercise.answer}</div>
              </div>
            )}
          </div>

          <button
            onClick={handleCheck}
            disabled={!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)}
            className={`w-full sm:w-auto px-12 py-3 rounded-xl border-b-4 font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 disabled:scale-100 disabled:shadow-none
              ${isChecking 
                ? (isCorrect 
                  ? 'bg-indigo-500 border-indigo-700 text-white hover:bg-indigo-400' 
                  : 'bg-rose-500 border-rose-700 text-white hover:bg-rose-400') 
                : 'bg-indigo-500 border-indigo-700 text-white hover:bg-indigo-400'}
            `}
          >
            {isChecking ? 'Continuer' : 'Vérifier'}
          </button>
        </div>
      </footer>
    </div>
  );
}
