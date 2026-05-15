'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '../lib/store';
import courseData from '../data/course.json';
import { generateEndlessReviewExercises } from '../lib/exercise-generator';
import type { ReviewOptions } from '../lib/exercise-generator';
import { Exercise, CourseData, Word } from '../types';
import { X, Check, Settings, Play } from 'lucide-react';
import { playThaiTTS, preloadThaiVoices } from '../lib/tts';
import { motion, AnimatePresence } from 'motion/react';

// Exercise Components
import WordMatch from '../lesson/[id]/components/WordMatch';
import SentenceBuilder from '../lesson/[id]/components/SentenceBuilder';
import { SentenceWithHints } from '../components/Hints';

const data = courseData as CourseData;

export default function ReviewPage() {
  const router = useRouter();
  const { completedLessons, xp, completeLesson, language, setExerciseRunning } = useProgressStore();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Options State
  const [showOptions, setShowOptions] = useState(true);
  
  useEffect(() => {
    // Return to default state when exiting component
    return () => setExerciseRunning(false);
  }, [setExerciseRunning]);

  const [options, setOptions] = useState<ReviewOptions>({
    showWordHints: true,
    showUsefulVocab: true,
    includeDistractors: true,
    limitDistractors: 2,
  });
  
  // Interaction State
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    let initialized = false;
    const timer = setTimeout(() => {
      setMounted(true);
      // We don't generate exercises right away anymore, we wait for user to click Start
    }, 0);
    
    preloadThaiVoices();
    return () => clearTimeout(timer);
  }, [completedLessons, language]);

  const handleStartReview = () => {
    if (completedLessons.length > 0) {
      setExercises(generateEndlessReviewExercises(data.lessons, completedLessons, language, options));
      setShowOptions(false);
      setExerciseRunning(true);
    }
  };

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
          onClick={() => router.push('/practice')}
          className="px-12 py-3 rounded-xl bg-indigo-500 border-b-4 border-indigo-700 text-white font-bold text-lg shadow-lg hover:bg-indigo-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest w-full max-w-sm"
        >
          {language === 'en' ? 'Back' : 'Retour'}
        </button>
      </div>
    );
  }

  if (showOptions) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 flex flex-col items-center p-4">
        <header className="w-full max-w-2xl mt-4 flex items-center justify-between mb-8">
          <button onClick={() => router.push('/practice')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={28} />
          </button>
          <div className="text-xl font-bold text-slate-700 flex items-center gap-2">
            <Settings size={20} className="text-indigo-500" />
            {language === 'en' ? 'Review Options' : 'Options de rappel'}
          </div>
          <div className="w-11"></div>
        </header>

        <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <div className="space-y-6">
            
            {/* Option 1: Tooltips (Aide au survol) */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{language === 'en' ? 'Word hints on hover' : 'Aide au survol (points soulignés)'}</h3>
                <p className="text-slate-500 text-sm mt-1">{language === 'en' ? 'Show translation and audio when you hover over words' : 'Afficher la traduction et le son au survol des mots'}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={options.showWordHints} onChange={() => setOptions({...options, showWordHints: !options.showWordHints})} />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>

            <div className="w-full h-px bg-slate-100"></div>

            {/* Option 2: Useful Vocab */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{language === 'en' ? 'Useful vocabulary block' : 'Bloc vocabulaire utile'}</h3>
                <p className="text-slate-500 text-sm mt-1">{language === 'en' ? 'Show the list of words involved under the exercise' : 'Afficher la liste des mots impliqués sous l\'exercice'}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={options.showUsefulVocab} onChange={() => setOptions({...options, showUsefulVocab: !options.showUsefulVocab})} />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>

            <div className="w-full h-px bg-slate-100"></div>

            {/* Option 3: Distractors */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{language === 'en' ? 'False answers (Distractors)' : 'Faux choix (Distracteurs)'}</h3>
                <p className="text-slate-500 text-sm mt-1">{language === 'en' ? 'Include wrong choices in options' : 'Inclure de mauvaises réponses dans les choix'}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={options.includeDistractors} onChange={() => setOptions({...options, includeDistractors: !options.includeDistractors})} />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>

          </div>

          <div className="mt-10">
            <button 
              onClick={handleStartReview}
              className="w-full py-4 rounded-2xl bg-indigo-500 border-b-4 border-indigo-700 text-white font-extrabold text-xl shadow-sm hover:bg-indigo-400 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2"
            >
              <Play size={24} className="fill-white" />
              {language === 'en' ? 'START REVIEW' : 'COMMENCER LE RAPPEL'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) return <div className="p-8 text-center text-slate-500 font-medium">{language === 'en' ? 'Loading...' : 'Chargement...'}</div>;

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
            setExercises(prev => [...prev, ...generateEndlessReviewExercises(data.lessons, completedLessons, language, options)]);
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
      const expectedSentence = currentExercise.answer.replace(/\s+/g, '').replace(/\.\.\./g, '');
      correct = builtSentence === expectedSentence;
    }

    setIsCorrect(correct);
    setIsChecking(true);
    playThaiTTS(currentExercise.answer);
  };

  const getDictionaryForExercise = () => {
     return data.lessons.flatMap(l => l.words);
  };

  const getPhrasesForExercise = () => {
     return data.lessons.flatMap(l => l.phrases);
  };

  const isAnswerComplete = currentExercise.type === 'sentence-builder' && currentExercise.correctComponents
      ? Array.isArray(selectedAnswer) && selectedAnswer.length === currentExercise.correctComponents.filter(c => c !== 'w_dots').length
      : selectedAnswer !== null && (!Array.isArray(selectedAnswer) || (selectedAnswer as any[]).length > 0);

  const showFooter = isChecking || isAnswerComplete;

  return (
    <div className="h-[100dvh] flex flex-col bg-[#FAFAFA] font-sans text-slate-800 overflow-hidden">
      {/* Header / Progress bar */}
      <header className="h-16 flex items-center shrink-0 justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-6 w-full max-w-2xl mx-auto h-full px-4 flex-1">
          <button onClick={() => router.push('/practice')} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} strokeWidth={2.5} />
          </button>
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-bold text-slate-400">{language === 'en' ? 'Review ∞' : 'Rappel ∞'}</div>
        </div>
      </header>

      {/* Main Exercise Area */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center py-2 sm:py-6 md:py-12 px-4 w-full">
        <div className="w-full max-w-3xl flex flex-col justify-center flex-1">
        
          {/* The Question / Hint System */}
          <div className="flex items-start gap-4 md:gap-8 mb-4 md:mb-8">
            <div className="hidden md:flex w-32 h-32 bg-indigo-100 rounded-3xl items-center justify-center text-5xl shadow-sm border border-indigo-200 relative flex-shrink-0">
               <span className="animate-pulse">🧠</span>
               <div className="absolute -right-2 -top-2 w-6 h-6 bg-indigo-500 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="flex-1 mt-2 md:mt-0">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 md:mb-6 text-center md:text-left">
                {currentExercise.type === 'word-match' 
                  ? (language === 'en' ? "Select the correct translation:" : "Sélectionnez la bonne traduction")
                  : (language === 'en' ? "Translate this sentence:" : "Traduisez cette phrase")}
              </h2>
              <div className="relative inline-block pb-1 w-full text-center md:text-left">
                <SentenceWithHints 
                  text={currentExercise.question} 
                  dictionary={getDictionaryForExercise()} 
                  phrases={getPhrasesForExercise()}
                  isSentence={currentExercise.type === 'sentence-builder'}
                  exerciseOptions={currentExercise.options as Word[]}
                  hideHints={currentExercise.hideHints}
                  disableTooltips={currentExercise.disableTooltips}
                  hideColors={currentExercise.hideColors}
                  alwaysShowPhonetic={currentExercise.type === 'writing'}
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
      <>
        <div className="shrink-0 min-h-[100px] md:min-h-[128px] w-full bg-transparent"></div>
        <AnimatePresence>
          {showFooter && (
            <motion.footer 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed bottom-0 left-0 right-0 w-full min-h-[100px] md:min-h-[128px] py-4 md:py-0 border-t-2 items-center justify-center flex transition-colors duration-300 z-50 overflow-y-auto max-h-[50vh] ${isChecking ? (isCorrect ? 'bg-indigo-50 border-indigo-200' : 'bg-rose-50 border-rose-200 shadow-[0_-10px_40px_rgba(244,63,94,0.1)]') : 'bg-white border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'}`}
            >
              <div className="w-full max-w-2xl px-4 flex sm:flex-row flex-col items-center justify-between gap-4">
              
              <div className="flex-1 w-full text-center sm:text-left">
                {isChecking && isCorrect && (
                  <div className="flex items-center justify-center sm:justify-start gap-3 text-indigo-600 font-extrabold text-xl">
                    <div className="bg-white text-indigo-500 rounded-full p-1"><Check size={24} strokeWidth={3} /></div>
                    {language === 'en' ? 'Excellent!' : 'Excellent !'}
                  </div>
                )}
                {isChecking && !isCorrect && (
                  <div className="flex flex-col text-rose-600 font-extrabold text-xl gap-1 items-center sm:items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-white text-rose-500 rounded-full p-1"><X size={24} strokeWidth={3} /></div>
                      {language === 'en' ? 'Incorrect.' : 'Incorrect.'}
                    </div>
                    <div className="text-rose-800 text-sm mt-1 uppercase tracking-widest">
                      {language === 'en' ? 'Correct answer:' : 'Réponse correcte :'}
                    </div>
                    <div className="text-rose-900 font-medium font-thai text-xl md:text-2xl mt-1 sm:mt-0">{currentExercise.answer}</div>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheck}
                disabled={!isChecking && (!selectedAnswer || (Array.isArray(selectedAnswer) && (currentExercise.type === 'sentence-builder' && currentExercise.correctComponents ? selectedAnswer.length !== currentExercise.correctComponents.length : selectedAnswer.length === 0)))}
                className={`w-full sm:w-auto px-12 py-3 rounded-xl border-b-4 font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 disabled:scale-100 disabled:shadow-none
                  ${isChecking 
                    ? (isCorrect 
                      ? 'bg-indigo-500 border-indigo-700 text-white hover:bg-indigo-400' 
                      : 'bg-rose-500 border-rose-700 text-white hover:bg-rose-400') 
                    : 'bg-indigo-500 border-indigo-700 text-white hover:bg-indigo-400'}
                `}
              >
                {isChecking ? (language === 'en' ? 'Continue' : 'Continuer') : (language === 'en' ? 'Check' : 'Vérifier')}
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
      </>
    </div>
  );
}
