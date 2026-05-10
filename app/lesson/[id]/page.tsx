'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useProgressStore } from '../../lib/store';
import courseData from '../../data/course.json';
import { generateExercises } from '../../lib/exercise-generator';
import { Exercise, Lesson, CourseData, Word, Phrase } from '../../types';
import { X, Check, Star, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playThaiTTS, preloadThaiVoices } from '../../lib/tts';
import { motion, AnimatePresence } from 'motion/react';

// Exercise Components
import WordMatch from './components/WordMatch';
import SentenceBuilder from './components/SentenceBuilder';
import PairMatch from '../../components/PairMatch';
import { TooltipHint, SentenceWithHints } from '../../components/Hints';
import VirtualKeyboard from '../../writing/components/VirtualKeyboard';
import FreeTypingInput from './components/FreeTypingInput';
import { Suspense } from 'react';

const data = courseData as CourseData;

function LessonPageContent() {
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
  
  // We generate exercises only on the client inside useEffect to avoid hydration mismatched caused by Math.random().
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Interaction State
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!lesson) {
      router.push('/learn');
      return;
    }
    preloadThaiVoices();
    setExercises((prev) => prev.length === 0 ? generateExercises(lesson, data.lessons, currentLevel, language) : prev);
  }, [lesson, router, currentLevel, language]);

  if (!isClient || !lesson || exercises.length === 0) return <div className="p-8 text-center">Chargement...</div>;

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
          completeLesson(lesson.id, 10 + exercises.length, currentLevel);
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
          completeLesson(lesson.id, 10 + exercises.length, currentLevel);
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
    } else if (currentExercise.type === 'writing') {
      const builtValue = (selectedAnswer as string[]).join('').replace(/\s+/g, '');
      const targetValue = currentExercise.answer.replace(/\s+/g, '');
      correct = builtValue === targetValue;
    } else if (currentExercise.type === 'free-typing') {
      const builtValue = typeof selectedAnswer === 'string' ? selectedAnswer.replace(/\s+/g, '') : '';
      const targetValue = currentExercise.answer.replace(/\s+/g, '');
      
      const levenshtein = (a: string, b: string): number => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
          for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + cost
            );
          }
        }
        return matrix[a.length][b.length];
      };
      
      const editDist = levenshtein(builtValue, targetValue);
      const similarity = 1 - (editDist / Math.max(builtValue.length, targetValue.length));
      correct = similarity >= 0.8;
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
          {language === 'en' ? `Level ${currentLevel + 1} completed!` : `Niveau ${currentLevel + 1} terminé !`}
        </h1>
        <p className="text-slate-500 mb-8 text-center text-lg font-medium">+ {10 + exercises.length} XP</p>
        <button 
          onClick={() => router.push('/learn')}
          className="px-12 py-3 rounded-xl bg-emerald-500 border-b-4 border-emerald-700 text-white font-bold text-lg shadow-lg hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest w-full max-w-sm"
        >
          {language === 'en' ? 'Continue' : 'Continuer'}
        </button>
      </div>
    );
  }

  const isAnswerComplete = currentExercise.type === 'intro' ? true 
    : currentExercise.type === 'free-typing'
      ? typeof selectedAnswer === 'string' && selectedAnswer.trim().length > 0
    : (currentExercise.type === 'writing' || currentExercise.type === 'sentence-builder') && currentExercise.correctComponents
      ? Array.isArray(selectedAnswer) && selectedAnswer.length === currentExercise.correctComponents.length
      : selectedAnswer !== null && (!Array.isArray(selectedAnswer) || (selectedAnswer as any[]).length > 0);

  const showFooter = currentExercise.type !== 'pair-matching' && (
      isChecking || isAnswerComplete
  );

  return (
    <div className="h-[100dvh] flex flex-col bg-[#FAFAFA] font-sans text-slate-800 overflow-hidden">
      {/* Header / Progress bar */}
      <header className="h-16 px-8 flex items-center shrink-0 justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-6 w-full max-w-4xl mx-auto flex-1">
          <button onClick={() => router.push('/learn')} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} strokeWidth={2.5} />
          </button>
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-bold text-slate-400 flex items-center gap-3">
            {currentLevel + 1 < 9 ? (
              <span>{language === 'en' ? 'Lvl.' : 'Niv.'} {currentLevel + 2}</span>
            ) : (
              <span className="flex items-center text-amber-500"><Crown size={18} className="fill-current stroke-[2.5]" /></span>
            )}
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
      <main className="flex-1 overflow-y-auto flex flex-col items-center py-2 sm:py-6 md:py-12 px-4 w-full relative">
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
                <div className="hidden md:flex w-32 h-32 bg-emerald-100 rounded-3xl items-center justify-center text-5xl shadow-sm border border-emerald-200 relative flex-shrink-0">
                   <span className="animate-bounce">🐘</span>
                   <div className="absolute -right-2 -top-2 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex-1 mt-2 md:mt-0">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 md:mb-6 text-center md:text-left">
                    {currentExercise.type === 'intro'
                      ? (language === 'en' ? "New expression!" : "Nouvelle expression !")
                      : currentExercise.type === 'word-match' 
                        ? (language === 'en' ? "Select the correct translation" : "Sélectionnez la bonne traduction")
                        : currentExercise.type === 'pair-matching'
                          ? currentExercise.question
                          : currentExercise.type === 'writing' && currentExercise.blindMode
                            ? (language === 'en' ? "Write this " + (currentExercise.id.includes('phrase') ? "sentence" : "word") + " in Thai" : "Écrivez ce " + (currentExercise.id.includes('phrase') ? "phrase" : "mot") + " en thaï")
                            : (language === 'en' ? "Translate this sentence" : "Traduisez cette phrase")}
                  </h2>
                  <div className="relative inline-block pb-1 w-full text-center md:text-left">
                    {currentExercise.type === 'intro' ? (
                      <div className="flex flex-col items-center md:items-start gap-4">
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
                    ) : currentExercise.type === 'pair-matching' ? null : (
                      <SentenceWithHints 
                        text={currentExercise.question} 
                        dictionary={lesson.words} 
                        phrases={lesson.phrases}
                        isSentence={currentExercise.type === 'sentence-builder'}
                        exerciseOptions={currentExercise.options as Word[]}
                        hideHints={currentExercise.hideHints}
                        disableTooltips={currentExercise.blindMode}
                        alwaysShowPhonetic={true}
                        answerTh={currentExercise.answer}
                        correctComponents={currentExercise.correctComponents}
                      />
                    )}

                    {currentExercise.type === 'writing' && currentExercise.blindMode && currentExercise.correctComponents && !isChecking && (
                       <button 
                         className="mt-4 flex items-center justify-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors"
                         onClick={() => {
                            const selectedLen = (selectedAnswer as string[] || []).length;
                            if (selectedLen < currentExercise.correctComponents!.length) {
                               playThaiTTS(currentExercise.correctComponents![selectedLen]);
                            } else {
                               playThaiTTS(currentExercise.answer); // Fallback to full word if finished typing
                            }
                         }}
                       >
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                         {language === 'en' ? 'Sound of next letter' : 'Son de la prochaine lettre'}
                       </button>
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
                ) : currentExercise.type === 'pair-matching' ? (
                  <PairMatch 
                    key={currentExercise.id}
                    pairs={currentExercise.pairs as Word[]}
                    mode={currentExercise.pairMatchMode}
                    onComplete={() => {
                      if (currentIndex < exercises.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                        setIsChecking(false);
                        setIsCorrect(null);
                        setSelectedAnswer(null);
                      } else {
                        setIsFinished(true);
                        completeLesson(lesson.id, 10 + exercises.length, currentLevel);
                        confetti({
                          particleCount: 150,
                          spread: 70,
                          origin: { y: 0.6 }
                        });
                      }
                    }}
                  />
                ) : currentExercise.type === 'writing' ? (
                  <VirtualKeyboard 
                    exercise={currentExercise}
                    selected={selectedAnswer as string[] || []}
                    onChange={setSelectedAnswer as any}
                    disabled={isChecking}
                  />
                ) : currentExercise.type === 'free-typing' ? (
                  <FreeTypingInput 
                    exercise={currentExercise}
                    selected={(selectedAnswer as string) || ''}
                    onChange={setSelectedAnswer as any}
                    disabled={isChecking}
                  />
                ) : (
                  <SentenceBuilder 
                    exercise={currentExercise}
                    selected={selectedAnswer as string[] || []}
                    onChange={setSelectedAnswer as any}
                    disabled={isChecking}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Actions */}
      {currentExercise.type !== 'pair-matching' && (
        <>
          <div className="shrink-0 min-h-[100px] md:min-h-[128px] w-full bg-transparent"></div>
          <AnimatePresence>
            {showFooter && (
              <motion.footer 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed bottom-0 left-0 right-0 w-full min-h-[100px] md:min-h-[128px] py-4 md:py-0 border-t-2 items-center justify-center px-4 md:px-8 flex transition-colors duration-300 z-50 overflow-y-auto max-h-[50vh] ${isChecking ? (isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200 shadow-[0_-10px_40px_rgba(244,63,94,0.1)]') : 'bg-white border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'}`}
              >
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
                  {currentExercise.type === 'writing' && currentExercise.blindMode && currentExercise.correctComponents && (
                    <span className="text-sm font-bold opacity-80 ml-2">
                       {Math.round(((selectedAnswer as string[] || []).filter((c: string, i: number) => c === currentExercise.correctComponents![i]).length / currentExercise.correctComponents!.length) * 100)}% {language === 'en' ? 'match' : 'réussite'}
                    </span>
                  )}
                  {currentExercise.type === 'free-typing' && typeof selectedAnswer === 'string' && (
                    <span className="text-sm font-bold opacity-80 ml-2">
                      {Math.round((1 - (
                        (() => {
                           const a = selectedAnswer.replace(/\s+/g, '');
                           const b = currentExercise.answer.replace(/\s+/g, '');
                           if (a.length === 0) return b.length / Math.max(1, b.length);
                           if (b.length === 0) return a.length / Math.max(1, a.length);
                           const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
                           for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
                           for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
                           for (let i = 1; i <= a.length; i++) {
                             for (let j = 1; j <= b.length; j++) {
                               const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                               matrix[i][j] = Math.min(
                                 matrix[i - 1][j] + 1,
                                 matrix[i][j - 1] + 1,
                                 matrix[i - 1][j - 1] + cost
                               );
                             }
                           }
                           return matrix[a.length][b.length] / Math.max(a.length, b.length);
                        })()
                      )) * 100)}% {language === 'en' ? 'match' : 'réussite'}
                    </span>
                  )}
                </div>
                <div className="text-rose-800 text-sm mt-1 uppercase tracking-widest">
                  {language === 'en' ? 'Correct answer:' : 'Réponse correcte :'}
                </div>
                <div className="font-medium font-thai text-xl md:text-2xl mt-1 sm:mt-0">
                  {currentExercise.type === 'writing' && currentExercise.blindMode && currentExercise.correctComponents ? (
                    (() => {
                      const isCombiningLocal = (charStr: string) => {
                        if (!charStr) return false;
                        const code = charStr.charCodeAt(0);
                        return code === 0x0E31 || (code >= 0x0E34 && code <= 0x0E3A) || (code >= 0x0E47 && code <= 0x0E4E);
                      };
                      const clusters: { chars: string, isMatch: boolean }[] = [];
                      currentExercise.correctComponents.forEach((char, i) => {
                        const typedChar = (selectedAnswer as string[] || [])[i];
                        const isMatch = typedChar === char;
                        
                        if (clusters.length === 0 || !isCombiningLocal(char)) {
                          clusters.push({ chars: char, isMatch });
                        } else {
                          clusters[clusters.length - 1].chars += char;
                          if (!isMatch) {
                            clusters[clusters.length - 1].isMatch = false;
                          }
                        }
                      });

                      return clusters.map((cluster, idx) => (
                        <span key={`ans-cluster-${idx}`} className={cluster.isMatch ? "text-emerald-600" : "text-rose-600"}>
                          {cluster.chars}
                        </span>
                      ));
                    })()
                  ) : (
                    <span className="text-rose-900">{currentExercise.answer}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            id="next-btn"
            onClick={handleCheck}
            disabled={currentExercise.type !== 'intro' && !isChecking && (!selectedAnswer || (Array.isArray(selectedAnswer) && (currentExercise.type === 'writing' && currentExercise.correctComponents ? selectedAnswer.length !== currentExercise.correctComponents.length : selectedAnswer.length === 0)))}
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
          </motion.footer>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center min-h-screen bg-[#FAFAFA]">Chargement...</div>}>
      <LessonPageContent />
    </Suspense>
  );
}
