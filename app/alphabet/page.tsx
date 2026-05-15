'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useProgressStore } from '../lib/store';
import { getAlphabetLessons, AlphabetLessonDef, formatCombiningChar } from '../lib/alphabet-utils';
import { BookOpen, CheckCircle, Star, Play, Crown, X, Unlock, Lock } from 'lucide-react';

export default function AlphabetMenuPage() {
  const router = useRouter();
  const { completedLessons, unlockedLessons, lessonLevels, xp, resetLessonLevel, unlockLessonManual, language, setLanguage, autoDetectLanguage } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{lesson: AlphabetLessonDef, isCompleted: boolean, unitColor: string, unitBorder: string} | null>(null);
  const [lessonToUnlock, setLessonToUnlock] = useState<{lesson: AlphabetLessonDef, unitColor: string, unitBorder: string} | null>(null);
  const [modalLevel, setModalLevel] = useState(0);
  const [cols, setCols] = useState(5);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

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

  const handleUnitSelect = (index: number) => {
    setActiveUnitIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    autoDetectLanguage();
    
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const unitParam = params.get('unit');
      if (unitParam && parseInt(unitParam) >= 0 && parseInt(unitParam) <= 1) {
        setActiveUnitIndex(parseInt(unitParam));
        window.history.replaceState({}, '', '/alphabet');
      }
    }
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
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 pb-28 md:pb-20">
      
      {/* Header */}
      {/* Mobile Top Header */}
      <header className="bg-[#FAFAFA]/95 backdrop-blur-sm z-50 h-[3.75rem] md:hidden">
        <div className="flex items-center justify-between w-full h-full px-4 md:px-8 gap-2 sm:gap-6">
          <div className="flex items-center gap-3">
            <Link href="/learn" className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm md:hidden">
              <BookOpen size={20} />
            </Link>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight md:hidden">Alphabet</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {mounted && (
              <button 
                 onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                 className="flex items-center justify-center px-4 py-2 rounded-full bg-slate-100 text-slate-500 font-extrabold text-sm hover:bg-slate-200 transition-colors"
                 title={language === 'fr' ? "Switch to English" : "Passer en Français"}
              >
                 {language === 'fr' ? 'FR' : 'EN'}
              </button>
            )}
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl font-extrabold text-sm">
              <Star size={18} className="fill-amber-400 stroke-amber-400" />
              <span>{mounted ? xp : 0} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content (Mobile Only) */}
      <main className="max-w-2xl mx-auto px-4 mt-2 flex flex-col gap-8 md:hidden">
        {/* Mobile Unit Selector */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-4 -mx-4 px-4 sticky top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-sm pt-2 transition-all duration-300">
          {UNITS.map((u, i) => (
            <button
              key={`nav-m-${u.id}`}
              onClick={() => handleUnitSelect(i)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-sm ${
                i === activeUnitIndex 
                  ? `${u.colorClass} text-white` 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {language === 'en' ? u.titleEn : u.title}
            </button>
          ))}
        </div>

        {(() => {
          const unit = UNITS[activeUnitIndex];
          const unitLessons = unit.lessons;
          const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
          const progressPercent = mounted && unitLessons.length > 0 ? (completedInUnit / unitLessons.length) * 100 : 0;
          
          return (
            <div key={unit.id} className="relative z-0">
              <div className={`mb-10 p-6 sm:p-8 ${unit.colorClass} rounded-[2rem] text-white shadow-lg relative overflow-hidden border-b-[6px] ${unit.borderClass}`}>
                <div className="relative z-10 w-full flex flex-col items-center text-center">
                  <h2 className="text-3xl font-extrabold mb-2 text-white drop-shadow-sm">{mounted && language === 'en' ? unit.titleEn : unit.title}</h2>
                  <p className="text-white/90 mb-8 font-medium text-lg leading-snug">{mounted && language === 'en' ? unit.descriptionEn : unit.description}</p>
                  
                  <div className="w-full max-w-[280px]">
                    <div className="w-full bg-black/10 rounded-full h-4 overflow-hidden mb-6 shadow-inner">
                      <div 
                        className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.7)]" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    
                    {unlockedLessons && progressPercent < 100 && (
                      <button 
                        className="w-full bg-white text-slate-800 font-black tracking-widest uppercase py-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-[4px] active:shadow-none transition-all"
                        onClick={() => {
                           let firstUncompletedIdx = unitLessons.findIndex(l => !completedLessons.includes(l.id));
                           if (firstUncompletedIdx === -1) firstUncompletedIdx = 0;
                           const l = unitLessons[firstUncompletedIdx];
                           const level = lessonLevels[l.id] || 0;
                           setSelectedLesson({lesson: l, isCompleted: completedLessons.includes(l.id), unitColor: unit.colorClass, unitBorder: unit.borderClass});
                           setModalLevel(Math.min(level, 3));
                        }}
                      >
                        {mounted && language === 'en' ? 'Continue' : 'Continuer'}
                      </button>
                    )}
                  </div>
                </div>
                <div className={`absolute -bottom-12 -left-12 opacity-10 drop-shadow-2xl text-black rotate-[-15deg] pointer-events-none`}>
                  <BookOpen size={240} />
                </div>
                <div className={`absolute -top-12 -right-12 opacity-10 drop-shadow-2xl text-white rotate-[15deg] pointer-events-none`}>
                  <Star size={160} />
                </div>
              </div>

              {/* Vertical Timeline of Lessons (Mobile) */}
              <div className="flex flex-col relative w-full items-center mt-4 pb-20">
                 <div className="absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 bg-slate-200 rounded-full z-0"></div>
                 
                 {unitLessons.map((lesson, idx) => {
                   const isCompleted = mounted ? completedLessons.includes(lesson.id) : false;
                   const level = mounted ? (lessonLevels[lesson.id] || 0) : 0;
                   const prevLessonInUnit = idx > 0 ? unitLessons[idx - 1] : null;
                   const isUnlocked = idx === 0 || (mounted && prevLessonInUnit && completedLessons.includes(prevLessonInUnit.id)) || (mounted && unlockedLessons?.includes(lesson.id));
                   const isMaxLevel = level >= 4;

                   const nextLesson = idx < unitLessons.length - 1 ? unitLessons[idx + 1] : null;
                   const nextUnlocked = nextLesson && (mounted && (completedLessons.includes(nextLesson.id) || unlockedLessons?.includes(nextLesson.id)));
                   const showLineToNext = idx < unitLessons.length - 1;
                   const lineToNextColor = isUnlocked && nextUnlocked ? unit.colorClass : "bg-slate-200";

                   return (
                     <div id={`lesson-${lesson.id}`} key={`mobile-node-${lesson.id}`} className="relative flex flex-col items-center w-full scroll-mt-24 z-10 mb-8 sm:mb-12 group">
                        {/* Circle Node */}
                        <div 
                          className={`relative shrink-0 mb-4 z-10 ${isUnlocked ? 'cursor-pointer hover:scale-105 active:scale-95 transition-all' : ''}`}
                          onClick={() => {
                            if (isUnlocked) {
                              setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                              setModalLevel(Math.min(level, 3));
                            } else {
                              setLessonToUnlock({lesson, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                            }
                          }}
                        >
                          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-b-[6px] relative z-10 text-4xl sm:text-5xl font-thai shadow-sm
                            ${isMaxLevel 
                              ? unit.colorClass + ' text-white ' + unit.borderClass 
                              : level >= 3 ? unit.shades.l3 : level >= 2 ? unit.shades.l2 : level >= 1 ? unit.shades.l1
                              : isUnlocked ? 'bg-white ' + unit.textClass + ' border-slate-200 border-2 active:border-b-2 active:translate-y-1' 
                              : 'bg-slate-100 text-slate-300 border-slate-200 border-2 shadow-none'}`}
                          >
                            {!isUnlocked ? <Lock size={32} className="text-slate-300" /> : isMaxLevel ? <Crown size={40} className="stroke-[3]" fill="currentColor" /> : level > 0 ? <CheckCircle size={40} className="stroke-current stroke-[2.5]" /> : lesson.items[0] ? formatCombiningChar(lesson.items[0].letter) : ''}
                          </div>
                          
                          {(level > 0 && level <= 4) && (
                            <div className={`absolute -bottom-2 -right-2 z-20 bg-white border-2 border-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-sm ${unit.textClass}`}>
                              {level}
                            </div>
                          )}
                        </div>
                        
                        {/* Card */}
                        <div 
                          className={`w-full max-w-[280px] sm:max-w-[320px] rounded-[1.5rem] p-5 flex flex-col items-center text-center transition-all z-10 
                            ${isUnlocked 
                              ? 'bg-white border-2 border-slate-200 border-b-[6px] cursor-pointer hover:border-slate-300 active:translate-y-[4px] active:border-b-2 shadow-sm relative' 
                              : 'bg-slate-50 border-2 border-slate-100 opacity-90'}`}
                          onClick={() => {
                            if (isUnlocked) {
                              setSelectedLesson({lesson, isCompleted, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                              setModalLevel(Math.min(level, 3));
                            } else {
                              setLessonToUnlock({lesson, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                            }
                          }}
                        >
                           <h4 className={`font-extrabold text-xl ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                             {mounted && language === 'en' ? lesson.titleEn : lesson.title}
                           </h4>
                           <span className={`text-base font-bold mt-1 tracking-wide ${isUnlocked ? 'text-slate-500 font-thai' : 'text-slate-400'}`}>
                             {lesson.items.map(i => formatCombiningChar(i.letter)).join(' • ')}
                           </span>
                           
                           {isUnlocked && (
                             <>
                               <div className="bg-slate-100 rounded-full px-3 py-1 text-xs font-bold text-slate-500 mt-3 mb-4">
                                 {mounted && language === 'en' ? 'Level' : 'Niveau'} {level}/4
                               </div>
                               
                               <button className={`w-full py-3.5 rounded-2xl font-black tracking-widest text-sm transition-all uppercase ${isMaxLevel ? 'bg-slate-100 text-slate-500 active:bg-slate-200' : unit.colorClass + ' text-white shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[4px]'}`}>
                                 {isMaxLevel ? (mounted && language === 'en' ? 'Review' : 'Réviser') : (mounted && language === 'en' ? 'Continue' : 'Continuer')}
                               </button>
                             </>
                           )}
                        </div>

                        {showLineToNext && (
                           <div className={`absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-3 h-[calc(100%+2rem)] sm:h-[calc(100%+3rem)] ${lineToNextColor} z-0`}></div>
                        )}
                     </div>
                   )
                 })}
                 
                 {activeUnitIndex < UNITS.length - 1 && (
                     <div className="mt-8 z-10 w-full px-4 relative flex justify-center">
                         <button 
                             onClick={() => handleUnitSelect(activeUnitIndex + 1)}
                             className="px-8 py-4 rounded-2xl bg-amber-50 text-amber-500 border-b-4 border-amber-200 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-600 font-extrabold shadow-sm transition-all text-center active:border-b-0 active:translate-y-1 w-full max-w-[280px] sm:max-w-[320px]"
                         >
                            {mounted && language === 'en' ? 'Next Unit' : 'Unité Suivante'}
                         </button>
                     </div>
                 )}
              </div>
            </div>
          );
        })()}
      </main>

      {/* Main Content (Desktop Only) */}
      {mounted && (
        <div className="hidden md:flex flex-row w-full max-w-[100rem] mx-auto px-6 lg:px-8 py-8 items-start relative min-h-screen">
          {/* Center Curriculum Content */}
          <div className="flex-1 flex justify-center w-full pr-8">
            <div className="flex flex-col gap-10 w-full max-w-4xl">
            {(()=>{
              const unit = UNITS[activeUnitIndex];
              const unitLessons = unit.lessons;
              const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
              const progressPercent = unitLessons.length > 0 ? (completedInUnit / unitLessons.length) * 100 : 0;
              
              return (
                <div key={`desktop-unit-${unit.id}`} className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                  {/* Unit Hero Card */}
                  <div className={`p-8 md:p-10 ${unit.colorClass} rounded-3xl text-white shadow-xl relative overflow-hidden border-b-[6px] ${unit.borderClass}`}>
                    <div className="relative z-10">
                      <h2 className="text-4xl font-extrabold mb-3">{language === 'en' ? unit.titleEn : unit.title}</h2>
                      <p className={`${unit.lightTextClass} mb-8 font-medium text-lg`}>{language === 'en' ? unit.descriptionEn : unit.description}</p>
                                         {/* Progress Bar + Continue Button */}
                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <div className={`w-full ${unit.bgMutedClass} rounded-full h-4 overflow-hidden shadow-inner`}>
                            <div 
                              className="bg-emerald-300 h-full rounded-full transition-all duration-1000 origin-left" 
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                          <div className={`text-sm ${unit.lightTextClass} font-bold mt-2`}>
                            {language === 'en' ? 'Lesson' : 'Leçon'} {completedInUnit}/{unitLessons.length}
                          </div>
                        </div>
                        {unlockedLessons && progressPercent < 100 && (
                          <button 
                            className="bg-white text-slate-800 font-bold px-8 py-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all hidden lg:block border-2 border-transparent cursor-pointer"
                            onClick={() => {
                               let firstUncompletedIdx = unitLessons.findIndex(l => !completedLessons.includes(l.id));
                               if (firstUncompletedIdx === -1) firstUncompletedIdx = 0;
                               const l = unitLessons[firstUncompletedIdx];
                               const level = lessonLevels[l.id] || 0;
                               setSelectedLesson({lesson: l, isCompleted: completedLessons.includes(l.id), unitColor: unit.colorClass, unitBorder: unit.borderClass});
                               setModalLevel(Math.min(level, 3));
                            }}
                          >
                            {language === 'en' ? 'Continue' : 'Continuer'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className={`absolute -bottom-10 -right-10 opacity-20 drop-shadow-2xl text-black rotate-[-15deg] pointer-events-none`}>
                      <BookOpen size={200} />
                    </div>
                  </div>
                  
                  {/* Vertical Timeline of Lessons */}
                  <div className="flex flex-col relative w-full pl-6 md:pl-10 mt-4 pb-32">
                     <div className="absolute left-[3.25rem] md:left-[4.25rem] top-8 bottom-0 w-2.5 bg-slate-200 rounded-full z-0"></div>
                     
                     {unitLessons.map((lesson, idx) => {
                       const itemIndex = idx;
                       const isCompleted = completedLessons.includes(lesson.id);
                       const level = lessonLevels[lesson.id] || 0;
                       
                       const prevLessonInUnit = itemIndex > 0 ? unitLessons[itemIndex - 1] : null;
                       const isUnlocked = itemIndex === 0 || (prevLessonInUnit && completedLessons.includes(prevLessonInUnit.id)) || unlockedLessons?.includes(lesson.id);
                       
                       const nextLesson = idx < unitLessons.length - 1 ? unitLessons[idx + 1] : null;
                       const nextUnlocked = nextLesson && (completedLessons.includes(nextLesson.id) || unlockedLessons?.includes(nextLesson.id));

                       const showLineToNext = idx < unitLessons.length - 1;
                       const lineToNextColor = isUnlocked && nextUnlocked ? unit.colorClass : "bg-slate-200";
                       
                       const isMaxLevel = level >= 4;

                       return (
                         <div key={`desktop-node-${lesson.id}`} className="relative flex items-center w-full z-10 gap-6 md:gap-8 min-h-[7rem] mb-4">
                            {/* Circle Node */}
                            <div 
                              className={`relative shrink-0 py-6 ${isUnlocked ? 'cursor-pointer hover:brightness-95 hover:scale-105 active:scale-95 transition-all' : 'cursor-not-allowed'}`}
                              onClick={() => {
                                if (isUnlocked) {
                                  setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                  setModalLevel(Math.min(level, 3));
                                } else {
                                  setLessonToUnlock({lesson, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                }
                              }}
                            >
                              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center border-b-[6px] relative z-10 transition-transform text-3xl font-thai ${isMaxLevel ? unit.colorClass + ' text-white ' + unit.borderClass : level >= 3 ? unit.shades.l3 : level >= 2 ? unit.shades.l2 : level >= 1 ? unit.shades.l1 : isUnlocked ? 'bg-white ' + unit.textClass + ' border-slate-200 border-2 active:border-b-2 active:translate-y-1' : 'bg-slate-100 text-slate-300 border-slate-200 border-2 shadow-none'}`}>
                                {isMaxLevel ? <Crown size={32} className="stroke-[3]" fill="currentColor" /> : isUnlocked ? (level > 0 ? <CheckCircle size={32} className="stroke-current stroke-[2.5]" /> : (lesson.items[0] ? formatCombiningChar(lesson.items[0].letter) : '')) : (lesson.items[0] ? formatCombiningChar(lesson.items[0].letter) : '')}
                              </div>
                              
                              {(level > 0 && level <= 4) && (
                                <div className={`absolute bottom-4 -right-2 z-20 bg-white border-2 border-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-sm ${unit.textClass}`}>
                                  {level}
                                </div>
                              )}
                              
                              {showLineToNext && (
                                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-2.5 h-[calc(100%+1rem)] ${lineToNextColor} z-0`}></div>
                              )}
                            </div>
                            
                            {/* Horizontal Card */}
                            <div 
                              className={`flex-1 rounded-[1.5rem] border-2 p-5 md:p-6 flex items-center justify-between transition-all group ${isUnlocked ? 'bg-white border-slate-200 border-b-[6px] cursor-pointer hover:border-slate-300 active:translate-y-[4px] active:border-b-2 shadow-sm' : 'bg-transparent border-transparent opacity-80 cursor-not-allowed'}`}
                              onClick={() => {
                                if (isUnlocked) {
                                  setSelectedLesson({lesson, isCompleted, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                  setModalLevel(Math.min(level, 3));
                                } else {
                                  setLessonToUnlock({lesson, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                }
                              }}
                            >
                               <div className="flex flex-col items-start text-left">
                                 <h4 className="font-extrabold text-xl text-slate-800">
                                   {language === 'en' ? lesson.titleEn : lesson.title}
                                 </h4>
                                 <span className={`text-base font-bold mt-1 text-slate-500 font-thai tracking-wide`}>
                                   {lesson.items.map(i => formatCombiningChar(i.letter)).join(' • ')}
                                 </span>
                                 <span className={`text-sm font-bold mt-2 ${isMaxLevel ? unit.textClass : level > 0 ? unit.textClass : isUnlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                                   {isMaxLevel ? (language === 'en' ? 'Completed' : 'Complété') : level > 0 ? `${(level * 25)}%` : isUnlocked ? (language === 'en' ? 'In progress' : 'En cours') : (language === 'en' ? 'Locked' : 'Verrouillé')}
                                 </span>
                               </div>
                               
                               <button className={`shrink-0 px-6 py-3 rounded-2xl font-bold tracking-wider text-sm transition-all hidden sm:block ${isMaxLevel ? 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 cursor-pointer text-slate-600' : isUnlocked ? unit.colorClass + ' text-white group-hover:brightness-110 shadow-[0_2px_0_rgba(0,0,0,0.1)] group-active:shadow-none group-active:translate-y-[2px] cursor-pointer' : 'bg-slate-100 text-slate-300'}`}>
                                 {isMaxLevel ? (language === 'en' ? 'Review' : 'Réviser') : isUnlocked ? (language === 'en' ? 'Continue' : 'Continuer') : (language === 'en' ? 'Start' : 'Commencer')}
                               </button>
                            </div>
                         </div>
                       )
                     })}
                     
                     {activeUnitIndex < UNITS.length - 1 && (
                        <div className="mt-12 z-10 w-full pl-0 md:pl-[6rem] relative flex justify-start">
                             <button 
                                 onClick={() => handleUnitSelect(activeUnitIndex + 1)}
                                 className="px-8 py-4 rounded-2xl bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-600 font-extrabold shadow-sm transition-all text-center border-2 border-amber-200 border-b-4 active:border-b-2 active:translate-y-1 text-lg group w-full max-w-[280px]"
                             >
                                {language === 'en' ? 'Next Unit' : 'Unité Suivante'}
                             </button>
                        </div>
                     )}
                  </div>
                </div>
              );
            })()}
            </div>
          </div>
          
          {/* Right Sidebar Wrap */}
          <div className="w-20 xl:w-80 flex-shrink-0 relative hidden md:block z-40">
            {/* Sticky wrapper */}
            <div className="sticky top-24 w-full">
              {/* Container that expands on hover CSS when below xl, but static on xl */}
              <div 
                className="absolute top-0 right-0 max-h-[calc(100vh-8rem)] flex flex-col gap-4 transition-[width,background-color,padding,border-radius,box-shadow,opacity] duration-300 ease-in-out pb-4 group w-20 hover:w-80 hover:bg-white hover:shadow-2xl hover:rounded-2xl hover:p-4 hover:border hover:border-slate-100 xl:w-full xl:bg-transparent xl:shadow-none xl:rounded-none xl:p-0 xl:border-none xl:hover:bg-transparent xl:hover:shadow-none xl:hover:rounded-none xl:hover:p-0 xl:hover:border-none xl:relative"
              >
              <div className="flex items-center gap-3 px-2 mb-2 text-slate-800 font-bold text-xl overflow-hidden shrink-0">
                <BookOpen size={24} className="shrink-0" />
                <h2 className="transition-opacity duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 xl:opacity-100">
                  {language === 'en' ? 'Units' : 'Unités'}
                </h2>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-6 w-full">
                {UNITS.map((u, i) => {
                  const isCurrent = i === activeUnitIndex;
                  const status = isCurrent ? (language === 'en' ? 'In progress' : 'En cours') : '';

                  return (
                    <button 
                      key={u.id}
                      onClick={() => handleUnitSelect(i)}
                      className={`w-full text-left rounded-2xl transition-all relative overflow-hidden flex items-center h-[5.5rem] shrink-0 ${isCurrent ? `bg-emerald-50 text-emerald-800 border-2 border-emerald-200 shadow-sm` : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 border-2 border-b-4 active:border-b-2 active:translate-y-1'}`}
                    >
                      <div className="shrink-0 flex items-center justify-center font-black text-2xl transition-all duration-300 w-full group-hover:w-16 xl:w-16">
                         {i + 1}
                      </div>

                      <div className="relative z-10 flex flex-col justify-center transition-all duration-300 whitespace-nowrap overflow-hidden pr-4 opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto xl:opacity-100 xl:w-auto">
                        <h3 className="font-extrabold text-[15px] mb-0.5 truncate w-[12rem]">{language === 'en' ? u.titleEn : u.title}</h3>
                        <span className={`text-xs font-bold ${isCurrent ? 'text-emerald-500' : 'text-slate-400'}`}>{status}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Selected Lesson Modal */}
      {selectedLesson && mounted && createPortal(
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
                  {[0, 1, 2, 3].map((levelIndex) => {
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
        </div>,
        document.body
      )}

      {/* Unlock Lesson Modal */}
      {lessonToUnlock && mounted && createPortal(
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
        </div>,
        document.body
      )}

    </div>
  );
}

