'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '../lib/store';
import { getAlphabetLessons, AlphabetLessonDef, formatCombiningChar } from '../lib/alphabet-utils';
import { BookOpen, CheckCircle, Star, Play, Crown, X, Unlock } from 'lucide-react';

export default function AlphabetMenuPage() {
  const router = useRouter();
  const { completedLessons, unlockedLessons, lessonLevels, xp, resetLessonLevel, unlockLessonManual, language, autoDetectLanguage } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{lesson: AlphabetLessonDef, isCompleted: boolean, unitColor: string, unitBorder: string} | null>(null);
  const [lessonToUnlock, setLessonToUnlock] = useState<{lesson: AlphabetLessonDef, unitColor: string, unitBorder: string} | null>(null);
  const [modalLevel, setModalLevel] = useState(0);
  const [cols, setCols] = useState(5);

  const { consonants, vowels } = getAlphabetLessons();

  const UNITS = [
    {
      id: 'unit-alpha-1', title: "Les Consonnes", titleEn: "Consonants", description: "Mémorisez les consonnes thaïes", descriptionEn: "Memorize the Thai consonants", colorClass: "bg-indigo-500", borderClass: "border-indigo-700", textClass: "text-indigo-500", hoverClass: "hover:bg-indigo-400", lightTextClass: "text-indigo-100", bgMutedClass: "bg-indigo-700/50",
      shades: {
        l1: "bg-indigo-200 border-indigo-400 text-indigo-800 hover:bg-indigo-300",
        l2: "bg-indigo-300 border-indigo-500 text-indigo-900 hover:bg-indigo-400",
        l3: "bg-indigo-400 border-indigo-600 text-white hover:bg-indigo-500",
        l4: "bg-indigo-500 border-indigo-700 text-white hover:bg-indigo-600"
      },
      lessons: consonants
    },
    {
      id: 'unit-alpha-2', title: "Les Voyelles", titleEn: "Vowels", description: "Apprenez les sons de voyelles", descriptionEn: "Learn the vowel sounds", colorClass: "bg-fuchsia-500", borderClass: "border-fuchsia-700", textClass: "text-fuchsia-500", hoverClass: "hover:bg-fuchsia-400", lightTextClass: "text-fuchsia-100", bgMutedClass: "bg-fuchsia-700/50",
      shades: {
        l1: "bg-fuchsia-200 border-fuchsia-400 text-fuchsia-800 hover:bg-fuchsia-300",
        l2: "bg-fuchsia-300 border-fuchsia-500 text-fuchsia-900 hover:bg-fuchsia-400",
        l3: "bg-fuchsia-400 border-fuchsia-600 text-white hover:bg-fuchsia-500",
        l4: "bg-fuchsia-500 border-fuchsia-700 text-white hover:bg-fuchsia-600"
      },
      lessons: vowels
    }
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    autoDetectLanguage();
  }, [autoDetectLanguage]);

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1024) setCols(5);
      else if (window.innerWidth >= 768) setCols(4);
      else if (window.innerWidth >= 640) setCols(3);
      else setCols(2);
    };
    
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  useEffect(() => {
    if (mounted) {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          try {
            const el = document.querySelector(hash);
            if (el) {
              const y = el.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          } catch (e) {
            console.error(e);
          }
        }, 100);
      }
    }
  }, [mounted]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 pb-20 overflow-hidden">
      
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-50 px-4 md:px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto flex-1 gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <Link href="/learn" className="bg-emerald-500 text-white p-2 rounded-xl shadow-md border-b-4 border-emerald-700 hover:translate-y-px hover:border-b-2 active:border-b-0 active:translate-y-[4px] transition-all">
              <BookOpen size={24} />
            </Link>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden md:block">Alphabet</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 font-bold">
            <Link href="/learn" className="text-slate-500 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <X size={18} />
              <span className="hidden sm:inline">{mounted && language === 'en' ? 'Close' : 'Fermer'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 mt-8 flex flex-col gap-12">
        {UNITS.map((unit) => {
          const unitLessons = unit.lessons;
          const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
          const progressPercent = mounted && unitLessons.length > 0 ? (completedInUnit / unitLessons.length) * 100 : 0;
          
          return (
            <div key={unit.id} className="relative z-0">
              <div className={`mb-8 p-6 ${unit.colorClass} rounded-3xl text-white shadow-md relative overflow-hidden border-b-4 ${unit.borderClass}`}>
                <div className="relative z-10">
                  <h2 className="text-3xl font-extrabold mb-2">{mounted && language === 'en' ? unit.titleEn : unit.title}</h2>
                  <p className={`${unit.lightTextClass} mb-6 font-medium`}>{mounted && language === 'en' ? unit.descriptionEn : unit.description}</p>
                  <div className={`w-full ${unit.bgMutedClass} rounded-full h-3 overflow-hidden shadow-inner`}>
                    <div 
                      className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`absolute -bottom-8 -right-8 opacity-20 drop-shadow-xl text-black`}>
                  <BookOpen size={160} />
                </div>
              </div>

              {/* Lesson Path Grid */}
              <div className="flex justify-center relative w-full mb-12">
                <div className="flex flex-col items-center w-full max-w-5xl">
                  {(() => {
                    const rows = [];
                    for (let i = 0; i < unitLessons.length; i += cols) {
                      rows.push(unitLessons.slice(i, i + cols));
                    }
                    
                    return rows.map((row, rIndex) => (
                      <div key={rIndex} className={`flex w-full justify-start ${rIndex % 2 === 1 ? 'flex-row-reverse' : 'flex-row'}`}>
                        {row.map((lesson, indexInRow) => {
                          const itemIndex = rIndex * cols + indexInRow;
                          const isCompleted = mounted ? completedLessons.includes(lesson.id) : false;
                          const level = mounted ? (lessonLevels[lesson.id] || 0) : 0;
                          
                          // Unlock if it's the very first alphabet lesson in this unit, or previous is complete
                          const prevLessonInUnit = itemIndex > 0 ? unitLessons[itemIndex - 1] : null;
                          const isUnlocked = itemIndex === 0 || (mounted && prevLessonInUnit && completedLessons.includes(prevLessonInUnit.id)) || (mounted && unlockedLessons?.includes(lesson.id));
                          
                          const isLastOverall = itemIndex === unitLessons.length - 1;
                          const isLastInRow = indexInRow === row.length - 1;
                          
                          const pathRight = !isLastOverall && !isLastInRow && rIndex % 2 === 0;
                          const pathLeft = !isLastOverall && !isLastInRow && rIndex % 2 === 1;
                          const pathDown = !isLastOverall && isLastInRow;

                          const nextLesson = !isLastOverall ? unitLessons[itemIndex + 1] : null;
                          const nextUnlocked = nextLesson && (mounted && (completedLessons.includes(nextLesson.id) || unlockedLessons?.includes(nextLesson.id)));
                          
                          const pathColorClass = (isUnlocked && nextUnlocked) ? unit.colorClass : "bg-slate-200";

                          return (
                            <div id={`lesson-${lesson.id}`} key={lesson.id} className="relative py-6 md:py-8 scroll-mt-24" style={{ flex: `0 0 ${100 / cols}%` }}>
                              
                              {/* Path Connections */}
                              {pathRight && (
                                <div className={`absolute top-1/2 left-1/2 w-full h-[16px] -translate-y-1/2 -z-10 rounded-full transition-colors duration-500 opacity-80 ${pathColorClass}`} />
                              )}
                              {pathLeft && (
                                <div className={`absolute top-1/2 right-1/2 w-full h-[16px] -translate-y-1/2 -z-10 rounded-full transition-colors duration-500 opacity-80 ${pathColorClass}`} />
                              )}
                              {pathDown && (
                                <div className={`absolute top-1/2 left-1/2 w-[16px] h-full -translate-x-1/2 -z-10 rounded-full transition-colors duration-500 opacity-80 ${pathColorClass}`} />
                              )}

                              <div className="relative group/lesson flex justify-center w-full">
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (isUnlocked) {
                                      setSelectedLesson({lesson, isCompleted, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                      setModalLevel(Math.min(lessonLevels[lesson.id] || 0, 1)); // Max level 2 for alphabet
                                    } else {
                                      setLessonToUnlock({lesson, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                    }
                                  }}
                                  className="group flex flex-col items-center relative z-10 cursor-pointer"
                                >
                                  
                                  <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-3 rounded-2xl shadow-xl border-2 border-slate-200 whitespace-nowrap z-50 pointer-events-none">
                                    <p className="font-extrabold text-slate-800 uppercase tracking-wide text-sm flex items-center gap-2">
                                      {mounted && language === 'en' ? lesson.titleEn : lesson.title}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                      {lesson.items.map(i => formatCombiningChar(i.letter)).join(' • ')}
                                    </p>
                                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-200 rotate-45"></div>
                                  </div>

                                  <div className="relative">
                                    <div className={
                                      `w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center border-b-[6px] transition-transform shadow-sm relative z-0 text-3xl font-thai
                                      ${level >= 2
                                        ? unit.shades.l4
                                        : level === 1
                                          ? unit.shades.l2
                                            : isUnlocked 
                                              ? `bg-white border-2 border-slate-200 ${unit.textClass} hover:bg-slate-50 active:translate-y-1 active:border-b-2` 
                                              : 'bg-slate-100 border-2 border-slate-200 text-slate-300 shadow-none hover:bg-slate-200 active:translate-y-1 active:border-b-2'}`
                                    }>
                                      {level >= 2 ? <Crown size={40} className="stroke-current stroke-[2.5]" fill="currentColor" /> :
                                      level > 0 ? <CheckCircle size={40} className="stroke-current stroke-[2.5]" /> : lesson.items[0] ? formatCombiningChar(lesson.items[0].letter) : ''}
                                    </div>

                                    {/* Crown/Level Badge */}
                                    {(level > 0 && level <= 2) && (
                                      <div className={`absolute -bottom-2 -right-3 z-20 bg-white border-2 border-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-sm ${unit.textClass}`}>
                                        {level}
                                      </div>
                                    )}
                                  </div>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Selected Lesson Modal */}
      {selectedLesson && (
        <div 
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 md:p-4 transition-all"
          onClick={() => setSelectedLesson(null)}
        >
          <div 
            className="w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-0 md:mb-12 animate-in slide-in-from-bottom-full duration-300 relative border-t-8 border-slate-200"
            style={{ borderTopColor: 'var(--tw-colors-emerald-500)' }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 ${selectedLesson.unitColor} flex justify-between items-start text-white`}>
              <div>
                <p className="font-bold text-white/80 uppercase tracking-widest text-sm mb-1">
                  Alphabet
                </p>
                <h3 className="text-2xl font-extrabold">
                  {language === 'en' ? selectedLesson.lesson.titleEn : selectedLesson.lesson.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLesson(null)} 
                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors -mr-2 -mt-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-600 font-medium mb-8 text-lg">
                {language === 'en' ? 'Learn these letters:' : 'Apprenez ces lettres :'} <strong className="text-3xl font-thai ml-2">{selectedLesson.lesson.items.map(i => formatCombiningChar(i.letter)).join(' ')}</strong>
              </p>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {language === 'en' ? 'Choose a level' : 'Choisir un niveau'}
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {[0, 1].map((levelIndex) => {
                    const currentProgress = lessonLevels[selectedLesson.lesson.id] || 0;
                    const isCompletedLevel = levelIndex < currentProgress;
                    const isAccessible = levelIndex <= currentProgress;
                    const isSelected = modalLevel === levelIndex;
                    return (
                      <button
                        key={levelIndex}
                        onClick={() => {
                          if (isAccessible) {
                            setModalLevel(levelIndex);
                          }
                        }}
                        disabled={!isAccessible}
                        className={`flex-1 min-w-[3.5rem] sm:min-w-[4rem] flex flex-col items-center justify-center py-3 rounded-2xl border-b-4 transition-all
                          ${isSelected 
                            ? `${selectedLesson.unitColor} ${selectedLesson.unitBorder} text-white scale-105 shadow-md` 
                            : isCompletedLevel 
                              ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200' 
                              : isAccessible
                                ? 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300'
                                : 'bg-slate-50 border-2 border-slate-100 text-slate-300 opacity-50 cursor-not-allowed'
                          }`}
                      >
                        <span className="font-extrabold text-lg mb-1">{levelIndex + 1}</span>
                        {isCompletedLevel && !isSelected ? (
                          <CheckCircle size={16} className={isSelected ? "text-white" : "text-emerald-500"} />
                        ) : (
                          <Crown size={16} className={isSelected ? "text-white opacity-80" : "opacity-40"} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href={`/alphabet/lesson/${selectedLesson.lesson.id}?level=${modalLevel + 1}`}
                  className={`w-full py-4 rounded-xl border-b-4 font-bold text-lg text-white shadow-lg flex items-center justify-center hover:opacity-90 active:translate-y-1 transition-all ${selectedLesson.unitColor} ${selectedLesson.unitBorder}`}
                >
                  <Play size={20} className="mr-2 fill-current" />
                  {language === 'en' ? `Start level ${modalLevel + 1}` : `Démarrer le niveau ${modalLevel + 1}`}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unlock Lesson Modal */}
      {lessonToUnlock && (
        <div 
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 md:p-4 transition-all"
          onClick={() => setLessonToUnlock(null)}
        >
          <div 
            className="w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-0 md:mb-12 animate-in slide-in-from-bottom-full duration-300 relative border-t-8 border-slate-200"
            style={{ borderTopColor: 'var(--tw-colors-slate-400)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 bg-slate-100 flex justify-between items-start text-slate-800`}>
              <div>
                <p className="font-bold text-slate-500 uppercase tracking-widest text-sm mb-1">
                  {language === 'en' ? 'Lesson Locked' : 'Leçon Verrouillée'}
                </p>
                <h3 className="text-2xl font-extrabold flex items-center gap-2">
                  {language === 'en' ? lessonToUnlock.lesson.titleEn : lessonToUnlock.lesson.title}
                </h3>
              </div>
              <button 
                onClick={() => setLessonToUnlock(null)} 
                className="bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full p-2 transition-colors -mr-2 -mt-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-slate-100 text-slate-400 flex items-center justify-center rounded-2xl mb-4 text-3xl font-thai font-bold">
                {lessonToUnlock.lesson.items[0]?.letter}
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">
                {language === 'en' ? 'Unlock this level?' : 'Débloquer ce niveau ?'}
              </h4>
              <p className="text-slate-500 font-medium mb-8">
                {language === 'en' 
                  ? 'You can manually unlock this level. You will be able to play level 1, and you will need to complete it to access the next levels.' 
                  : 'Vous pouvez débloquer manuellement ce niveau. Vous aurez accès au niveau 1 et vous devrez le terminer pour accéder aux suivants.'}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    unlockLessonManual(lessonToUnlock.lesson.id);
                    setLessonToUnlock(null);
                    // Also immediately select it to open the play menu
                    setSelectedLesson({
                      lesson: lessonToUnlock.lesson, 
                      isCompleted: false, 
                      unitColor: lessonToUnlock.unitColor, 
                      unitBorder: lessonToUnlock.unitBorder
                    });
                    setModalLevel(0);
                  }}
                  className={`w-full py-4 rounded-xl border-b-4 font-bold text-lg text-white shadow-lg flex items-center justify-center hover:opacity-90 active:translate-y-1 transition-all ${lessonToUnlock.unitColor} ${lessonToUnlock.unitBorder}`}
                >
                  <Unlock size={20} className="mr-2" />
                  {language === 'en' ? 'Yes, unlock it' : 'Oui, débloquer'}
                </button>
                <button
                  onClick={() => setLessonToUnlock(null)}
                  className="w-full py-4 rounded-xl bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  {language === 'en' ? 'Cancel' : 'Annuler'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

