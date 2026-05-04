'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useProgressStore } from '../../lib/store';
import courseData from '../../data/course.json';
import { generateExercises } from '../../lib/exercise-generator';
import { Exercise, Lesson, CourseData, Word, Phrase } from '../../types';
import { X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playThaiTTS, preloadThaiVoices } from '../../lib/tts';

// Exercise Components
import WordMatch from './components/WordMatch';
import SentenceBuilder from './components/SentenceBuilder';
import { TooltipHint, SentenceWithHints } from '../../components/Hints';

const data = courseData as CourseData;

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeLesson, lessonLevels, language } = useProgressStore();
  
  const lessonId = params.id as string;
  const requestedLevelStr = searchParams.get('level');
  
  // Resolve lesson and exercises directly to avoid useEffect setState
  const lesson = data.lessons.find((l) => l.id === lessonId) || null;
  const savedLevel = lesson ? (lessonLevels[lesson.id] || 0) : 0;
  
  // Use requested level if provided, otherwise the saved level
  const currentLevel = requestedLevelStr ? Math.max(0, parseInt(requestedLevelStr, 10) - 1) : savedLevel;
  
  // We need to stabilize exercises generation since it shuffles.
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    return lesson ? generateExercises(lesson, data.lessons, currentLevel, language) : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Interaction State
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (!lesson) {
      router.push('/');
    }
    preloadThaiVoices();
  }, [lesson, router]);


  if (!lesson || exercises.length === 0) return <div className="p-8 text-center">Chargement...</div>;

  const currentExercise = exercises[currentIndex];
  const progress = (currentIndex / exercises.length) * 100;

  const handleCheck = () => {
    if (currentExercise.type === 'intro') {
       if (currentIndex < exercises.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsChecking(false);
          setIsCorrect(null);
          setSelectedAnswer(null);
       } else {
          setIsFinished(true);
          completeLesson(lesson.id, 10 + exercises.length);
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }});
       }
       return;
    }

    if (isChecking) {
      // Move to next exercise
      if (isCorrect) {
        if (currentIndex < exercises.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsChecking(false);
          setIsCorrect(null);
          setSelectedAnswer(null);
        } else {
          // Finished
          setIsFinished(true);
          completeLesson(lesson.id, 10 + exercises.length);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        // If wrong, we re-add the exercise to the end!
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
    playThaiTTS(currentExercise.answer);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFA] font-sans">
        <div className="text-orange-500 mb-6">
          <Check size={120} className="mx-auto" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2 text-center">
          {language === 'en' ? `Level ${Math.min(currentLevel + 1, 4)} completed!` : `Niveau ${Math.min(currentLevel + 1, 4)} terminé !`}
        </h1>
        <p className="text-slate-500 mb-8 text-center text-lg font-medium">+ {10 + exercises.length} XP</p>
        <button 
          onClick={() => router.push('/')}
          className="px-12 py-3 rounded-xl bg-emerald-500 border-b-4 border-emerald-700 text-white font-bold text-lg shadow-lg hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest w-full max-w-sm"
        >
          {language === 'en' ? 'Continue' : 'Continuer'}
        </button>
      </div>
    );
  }

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
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-bold text-slate-400 flex items-center gap-3">
            <span>{language === 'en' ? 'Lvl.' : 'Niv.'} {Math.min(currentLevel + 1, 4)}</span>
            <button 
              onClick={() => setShowInfoModal(true)}
              className="text-slate-400 hover:text-indigo-500 transition-colors p-1"
              title={language === 'en' ? 'Vocabulary List' : 'Liste de vocabulaire'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Exercise Area */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center py-6 md:py-12 px-4 w-full relative">
        <div className="w-full max-w-3xl flex flex-col justify-center flex-1">
        
          {/* Glossary Modal */}
          {showInfoModal && (
            <div className="absolute inset-0 z-50 flex flex-col bg-white">
              <header className="h-16 px-8 flex items-center shrink-0 border-b border-slate-200 justify-between bg-white sticky top-0">
                <h2 className="text-xl font-bold text-slate-800">{language === 'en' ? 'Vocabulary List' : 'Liste de vocabulaire'}</h2>
                <button onClick={() => setShowInfoModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
                  <X size={24} strokeWidth={2.5} />
                </button>
              </header>
              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
                <div className="max-w-3xl mx-auto space-y-4">
                   {lesson.words.map((word) => (
                      <div key={word.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer" onClick={() => playThaiTTS(word.th)}>
                         <div>
                            <div className="text-xl font-thai font-semibold text-emerald-600">{word.th}</div>
                            <div className="text-sm font-bold text-slate-500 mt-1">{word.phonetic}</div>
                         </div>
                         <div className="text-right text-slate-700 font-medium">
                            {language === 'en' ? (word.en || word.fr) : word.fr}
                         </div>
                      </div>
                   ))}
                   {lesson.phrases.map((phrase) => (
                      <div key={phrase.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer gap-2" onClick={() => playThaiTTS(phrase.th)}>
                         <div>
                            <div className="text-xl font-thai font-semibold text-emerald-600">{phrase.th}</div>
                            <div className="text-sm font-bold text-slate-500 mt-1">{phrase.phonetic}</div>
                         </div>
                         <div className="sm:text-right text-slate-700 font-medium">
                            {language === 'en' ? (phrase.en || phrase.fr) : phrase.fr}
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            </div>
          )}
        
          {/* The Question / Hint System */}
          <div className="flex items-start gap-4 md:gap-8 mb-4 md:mb-8">
            <div className="hidden md:flex w-32 h-32 bg-emerald-100 rounded-3xl items-center justify-center text-5xl shadow-sm border border-emerald-200 relative flex-shrink-0">
               <span className="animate-bounce">🐘</span>
               <div className="absolute -right-2 -top-2 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="flex-1 mt-2 md:mt-0">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 md:mb-6">
                {currentExercise.type === 'intro'
                  ? (language === 'en' ? "New expression!" : "Nouvelle expression !")
                  : currentExercise.type === 'word-match' 
                    ? (language === 'en' ? "Select the correct translation" : "Sélectionnez la bonne traduction")
                    : (language === 'en' ? "Translate this sentence" : "Traduisez cette phrase")}
              </h2>
              <div className="relative inline-block pb-1">
                {currentExercise.type === 'intro' ? (
                  <div className="flex flex-col items-start gap-4">
                    <p className="text-2xl text-slate-600 font-medium">{currentExercise.question}</p>
                    <div 
                      className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border-2 border-emerald-100 shadow-sm cursor-pointer hover:bg-emerald-50 transition-colors"
                      onClick={() => playThaiTTS(currentExercise.answer)}
                    >
                      <span className="font-thai text-3xl md:text-4xl text-emerald-600 font-semibold">{currentExercise.answer}</span>
                      {currentExercise.introItem && (
                        <div className="flex flex-col border-l-2 border-emerald-100 pl-3">
                           <span className="font-medium text-slate-500 text-sm">{language === 'en' ? 'Pronunciation' : 'Prononciation'}</span>
                           <span className="font-bold text-slate-700">{currentExercise.introItem.phonetic}</span>
                        </div>
                      )}
                      <div className="ml-2 bg-emerald-100 text-emerald-600 p-2 rounded-full">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <SentenceWithHints 
                    text={currentExercise.question} 
                    dictionary={lesson.words} 
                    phrases={lesson.phrases}
                    isSentence={currentExercise.type === 'sentence-builder'}
                    exerciseOptions={currentExercise.options as Word[]}
                    hideHints={currentExercise.hideHints}
                    alwaysShowPhonetic={true}
                    answerTh={currentExercise.answer}
                    correctComponents={currentExercise.correctComponents}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Exercise Options */}
          <div className="mt-8">
            {currentExercise.type === 'intro' ? null : currentExercise.type === 'word-match' ? (
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
      <footer className={`shrink-0 min-h-[100px] md:h-32 py-4 md:py-0 border-t-2 border-slate-200 flex items-center justify-center px-4 md:px-8 transition-colors duration-300 ${isChecking ? (isCorrect ? 'bg-emerald-50' : 'bg-rose-50 border-rose-200') : 'bg-white'}`}>
        <div className="w-full max-w-4xl flex sm:flex-row flex-col items-center justify-between gap-4">
          
          <div className="flex-1 w-full text-center sm:text-left">
            {isChecking && isCorrect && (
              <div className="flex items-center justify-center sm:justify-start gap-3 text-emerald-600 font-extrabold text-xl">
                <div className="bg-white text-emerald-500 rounded-full p-1"><Check size={24} strokeWidth={3} /></div>
                {language === 'en' ? 'Excellent!' : 'Excellent !'}
              </div>
            )}
            {isChecking && !isCorrect && (
              <div className="flex flex-col text-rose-600 font-extrabold text-xl gap-1 items-center sm:items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-rose-500 rounded-full p-1"><X size={24} strokeWidth={3} /></div>
                  {language === 'en' ? 'Incorrect.' : 'Incorrect.'}
                </div>
                <div className="text-rose-800 text-sm mt-1 uppercase tracking-widest hidden sm:block">
                  {language === 'en' ? 'Correct answer:' : 'Réponse correcte :'}
                </div>
                <div className="text-rose-900 font-medium font-thai text-xl md:text-2xl mt-1 sm:mt-0">{currentExercise.answer}</div>
              </div>
            )}
          </div>

          <button
            onClick={handleCheck}
            disabled={currentExercise.type !== 'intro' && (!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0))}
            className={`w-full sm:w-auto px-12 py-3 rounded-xl border-b-4 font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 disabled:scale-100 disabled:shadow-none
              ${currentExercise.type === 'intro' ? 'bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400' :
              isChecking 
                ? (isCorrect 
                  ? 'bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400' 
                  : 'bg-rose-500 border-rose-700 text-white hover:bg-rose-400') 
                : 'bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400'}
            `}
          >
            {currentExercise.type === 'intro' || isChecking ? (language === 'en' ? 'Continue' : 'Continuer') : (language === 'en' ? 'Check' : 'Vérifier')}
          </button>
        </div>
      </footer>
    </div>
  );
}
