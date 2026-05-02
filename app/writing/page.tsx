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
    let initialized = false;
    const timer = setTimeout(() => {
      setMounted(true);
      if(!initialized) {
        const params = new URLSearchParams(window.location.search);
        const lessonId = params.get('lessonId');
        
        let targetLessons = completedLessons;
        
        if (lessonId) {
           targetLessons = [lessonId];
        }
        
        if (targetLessons.length > 0) {
           setExercises(generateWritingExercises(data.lessons, targetLessons));
        }
        initialized = true;
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [completedLessons]);

  if (!mounted) return <div className="p-8 text-center text-slate-500 font-medium">Chargement...</div>;

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const hasLessonId = !!params?.get('lessonId');

  if (completedLessons.length === 0 && !hasLessonId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFA] font-sans">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4 text-center">Aucune leçon complétée</h1>
        <p className="text-slate-500 mb-8 text-center text-lg font-medium">Vous devez compléter au moins une leçon pour pratiquer l&apos;écriture !</p>
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
            const params = new URLSearchParams(window.location.search);
            const lessonId = params.get('lessonId');
            const targetLessons = lessonId ? [lessonId] : completedLessons;
            setExercises(generateWritingExercises(data.lessons, targetLessons));
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
                  alwaysShowPhonetic={true}
                />
              </div>
              <div className="mt-8 md:mt-10">
                <div className="text-4xl md:text-5xl font-thai font-medium flex flex-wrap gap-x-1 gap-y-3 leading-normal">
                  {(() => {
                    if (!currentExercise.correctComponents) return <span>{currentExercise.answer}</span>;

                    const groupedComponents: { cluster: string; idx: number; groupIndex: number }[][] = [];
                    let currentGroup: { cluster: string; idx: number; groupIndex: number }[] = [];
                    let currentGroupIndex = currentExercise.componentGroups?.[0] ?? -1;

                    currentExercise.correctComponents.forEach((cluster, idx) => {
                       const groupIndex = currentExercise.componentGroups?.[idx] ?? idx;
                       if (groupIndex === currentGroupIndex) {
                           currentGroup.push({ cluster, idx, groupIndex });
                       } else {
                           if (currentGroup.length > 0) groupedComponents.push(currentGroup);
                           currentGroup = [{ cluster, idx, groupIndex }];
                           currentGroupIndex = groupIndex;
                       }
                    });
                    if (currentGroup.length > 0) groupedComponents.push(currentGroup);

                    return groupedComponents.map((group, gIdx) => (
                      <span 
                        key={gIdx} 
                        className={`inline-block mx-[2px] px-[6px] py-[4px] rounded-xl transition-colors ${group.length > 1 ? (gIdx % 2 === 0 ? 'bg-slate-100/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-200' : 'bg-slate-50 border border-slate-200/50') : 'bg-transparent'}`}
                      >
                        {group.map(({ cluster, idx }) => {
                          let color = "text-slate-300"; // remaining
                          if (idx < selectedAnswer.length) {
                            if (selectedAnswer[idx] === cluster) {
                              color = "text-emerald-500"; // correctly typed
                            } else {
                              color = "text-rose-500"; // incorrectly typed
                            }
                          } else if (idx === selectedAnswer.length) {
                            color = "text-orange-500"; // to be typed
                          }
                          
                          const isCombining = (charStr: string) => {
                            const code = charStr.charCodeAt(0);
                            // True vertical combining marks that lack horizontal advance:
                            // 0x0E31: Mai Han-Akat
                            // 0x0E34 to 0x0E3A: top/bottom vowels (I, Ii, Ue, Uee, U, Uu, Phinthu)
                            // 0x0E47 to 0x0E4E: tone marks and other diacritics
                            return code === 0x0E31 || (code >= 0x0E34 && code <= 0x0E3A) || (code >= 0x0E47 && code <= 0x0E4E);
                          };

                          let displayCluster = cluster;
                          // If it's the active character and it's a combining mark, add a dotted circle to prevent overlapping!
                          // But only if it's currently active (orange) or remaining (slate), so they separate out nicely.
                          // Wait, if it's already typed (emerald), we WANT it to combine!
                          if (idx >= selectedAnswer.length && isCombining(cluster)) {
                             // Zero-width non-joiner prevents it from combining with the previous span.
                             // Actually, let's explicitly use a dotted circle so the user can see it's a mark
                             displayCluster = '\u25CC' + cluster;
                          }

                          return (
                            <span key={idx} className={`${color}`}>
                              {displayCluster}
                            </span>
                          );
                        })}
                      </span>
                    ));
                  })()}
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
