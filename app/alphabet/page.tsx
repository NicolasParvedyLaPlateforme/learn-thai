'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useProgressStore } from '../lib/store';
import { getAlphabetLessons, AlphabetLessonDef, formatCombiningChar } from '../lib/alphabet-utils';
import { playThaiTTS } from '../lib/tts';
import { BookOpen, CheckCircle, Star, Play, Crown, X, Unlock, Lock, ChevronLeft, ChevronRight, Clock, Volume2 } from 'lucide-react';
import Image from 'next/image';

import { useGlobalSuggestedLesson } from '../lib/useGlobalSuggestedLesson';

export default function AlphabetMenuPage() {
  const router = useRouter();
  const { completedLessons, unlockedLessons, lessonLevels, lessonStars, xp, resetLessonLevel, unlockLessonManual, language, setLanguage, autoDetectLanguage } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const levelsScrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const [selectedLesson, setSelectedLesson] = useState<{lesson: AlphabetLessonDef, isCompleted: boolean, unitColor: string, unitBorder: string} | null>(null);
  const [modalLevel, setModalLevel] = useState(0);
  const [cols, setCols] = useState(5);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  const globalSuggested = useGlobalSuggestedLesson();
  
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

  const suggestedLessonId = globalSuggested?.type === 'alphabet' ? globalSuggested.id : null;

  const handleUnitSelect = (index: number) => {
    setActiveUnitIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
     
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
             // Differentiate mobile and desktop elements
            const baseId = hash.substring(1).replace('lesson-', ''); // just the ID
            const isDesktop = window.innerWidth >= 768; // md breakpoint
            const targetId = isDesktop ? `#desktop-lesson-${baseId}` : `#mobile-lesson-${baseId}`;
            
            let el = document.querySelector(targetId);
            if (!el) {
               el = document.querySelector(hash); // Fallback
            }

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
                    <div className="flex flex-col mb-3">
                      <div className="flex justify-between text-sm font-bold text-white/90 mb-1 px-1">
                        <span>{language === 'en' ? 'Mastery' : 'Maîtrise'}</span>
                        <span>{completedInUnit} / {unitLessons.length} {language === 'en' ? 'letters' : 'lettres'}</span>
                      </div>
                      <div className="text-white/70 text-xs font-medium px-1 text-left">
                        {language === 'en' ? '4 levels per letter = Total mastery' : '4 niveaux par lettre = Maîtrise totale'}
                      </div>
                    </div>
                    <div className="w-full bg-black/10 rounded-full h-4 overflow-hidden mb-6 shadow-inner">
                      <div 
                        className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.7)]" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
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
                   // All alphabet lessons are unlocked horizontally
                   const isUnlocked = true;
                   const isMaxLevel = level >= 4;

                   const showLineToNext = idx < unitLessons.length - 1;
                   const lineToNextColor = level > 0 ? unit.colorClass : "bg-slate-200";

                   return (
                     <div id={`mobile-lesson-${lesson.id}`} key={`mobile-node-${lesson.id}`} className="relative flex flex-col items-center w-full scroll-mt-24 z-10 mb-8 sm:mb-12 group">
                        {/* Circle Node */}
                        <div 
                          className={`relative shrink-0 mb-4 z-10 cursor-pointer hover:scale-105 active:scale-95 transition-all`}
                          onClick={() => {
                            setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                            setModalLevel(Math.min(level, 3));
                          }}
                        >
                          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-b-[6px] relative z-10 text-4xl sm:text-5xl font-thai shadow-sm overflow-hidden
                            ${isMaxLevel 
                              ? unit.colorClass + ' text-white ' + unit.borderClass 
                              : level >= 3 ? unit.shades.l3 : level >= 2 ? unit.shades.l2 : level >= 1 ? unit.shades.l1
                              : 'bg-white ' + unit.textClass + ' border-slate-200 border-2 active:border-b-2 active:translate-y-1'}`}
                          >
                            {lesson.imageUrl ? (
                              <>
                                <Image src={lesson.imageUrl} alt={lesson.title} fill className={`object-cover ${level === 0 && suggestedLessonId !== lesson.id ? 'grayscale opacity-70' : ''}`} sizes="(max-width: 640px) 5rem, 6rem" />
                                {isMaxLevel && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20"><CheckCircle size={40} className="stroke-[3] text-white" /></div>}
                              </>
                            ) : (
                              <>
                                {lesson.items[0] ? formatCombiningChar(lesson.items[0].letter) : ''}
                                {isMaxLevel ? (
                                  <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full p-0.5 shadow-sm border border-emerald-200 z-20">
                                    <div className="bg-emerald-500 rounded-full flex items-center justify-center w-6 h-6">
                                      <CheckCircle size={14} className="text-white fill-emerald-500" />
                                    </div>
                                  </div>
                                ) : level > 0 ? (
                                  <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full p-0.5 shadow-sm border border-slate-200 z-20">
                                    <div className={`${unit.colorClass} rounded-full flex items-center justify-center w-6 h-6`}>
                                      <span className="text-white text-[10px] font-bold tracking-tight">{level}/4</span>
                                    </div>
                                  </div>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Card */}
                        <div 
                          className={`w-full max-w-[280px] sm:max-w-[320px] rounded-[1.5rem] p-5 flex flex-col items-center text-center transition-all z-10 border-2 border-b-[6px] cursor-pointer active:translate-y-[4px] active:border-b-2 shadow-sm relative ${isMaxLevel ? 'bg-emerald-50 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : suggestedLessonId === lesson.id ? 'bg-white border-amber-300 shadow-[0_0_15px_rgba(252,211,77,0.5)]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                          onClick={() => {
                            setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                            setModalLevel(Math.min(level, 3));
                          }}
                        >
                           {isMaxLevel ? (
                             <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                               <CheckCircle size={14} className="fill-current text-white stroke-emerald-500" /> {language === 'en' ? 'MASTERED' : 'MAÎTRISÉ'}
                             </div>
                           ) : suggestedLessonId === lesson.id && (
                             <div className="absolute -top-3.5 left-6 bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                               <Star size={12} fill="currentColor" /> {language === 'en' ? 'SUGGESTED' : 'SUGGÉRÉ'}
                             </div>
                           )}
                           <h4 className={`font-extrabold text-xl text-slate-800`}>
                             {mounted && language === 'en' ? lesson.titleEn : lesson.title}
                           </h4>
                           <span className={`text-base font-bold mt-1 tracking-wide text-slate-500 font-thai`}>
                             {lesson.items.map(i => formatCombiningChar(i.letter)).join(' • ')}
                           </span>
                           
                           {/* Lesson Progress Bar (Out of 4) */}
                           <div className="w-full mt-4">
                             {level === 0 ? (
                                suggestedLessonId === lesson.id ? (
                                  <div className="text-sm font-bold text-slate-400 mt-2 py-1">
                                    {language === 'en' ? 'Start learning' : 'Commencer'}
                                  </div>
                                ) : null
                             ) : (
                               <>
                                 <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 px-1">
                                   <span>{language === 'en' ? 'Mastery' : 'Maîtrise'}</span>
                                   <span className={unit.textClass}>{level}/4</span>
                                 </div>
                                 <div className="flex justify-between gap-[2px] w-full">
                                   {Array.from({length: 4}).map((_, i) => (
                                     <div key={i} className={`h-2.5 flex-1 rounded-sm first:rounded-l-full last:rounded-r-full ${i < level ? unit.colorClass : 'bg-slate-100'}`}></div>
                                   ))}
                                 </div>
                               </>
                             )}
                           </div>
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
                          <div className={`flex flex-col mb-3`}>
                            <div className={`text-sm ${unit.lightTextClass} font-bold mb-1 flex justify-between`}>
                              <span>{language === 'en' ? 'Mastery' : 'Maîtrise'}</span>
                              <span>{completedInUnit} / {unitLessons.length} {language === 'en' ? 'letters' : 'lettres'}</span>
                            </div>
                            <div className={`text-xs ${unit.lightTextClass} opacity-80 font-medium`}>
                              {language === 'en' ? '4 levels per letter = Total mastery' : '4 niveaux par lettre = Maîtrise totale'}
                            </div>
                          </div>
                          <div className={`w-full ${unit.bgMutedClass} rounded-full h-4 overflow-hidden shadow-inner`}>
                            <div 
                              className="bg-emerald-300 h-full rounded-full transition-all duration-1000 origin-left" 
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
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
                       
                       // All alphabet lessons are unlocked horizontally
                       const isUnlocked = true;
                       const isMaxLevel = level >= 4;

                       const showLineToNext = idx < unitLessons.length - 1;
                       const lineToNextColor = level > 0 ? unit.colorClass : "bg-slate-200";

                       return (
                         <div id={`desktop-lesson-${lesson.id}`} key={`desktop-node-${lesson.id}`} className="relative flex items-center w-full z-10 gap-6 md:gap-8 min-h-[8.5rem] py-3">
                            {/* Circle Node */}
                            <div 
                              className={`relative shrink-0 py-6 cursor-pointer hover:brightness-95 hover:scale-105 active:scale-95 transition-all`}
                              onClick={() => {
                                setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                setModalLevel(Math.min(level, 3));
                              }}
                            >
                              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center border-b-[6px] relative z-10 transition-transform text-3xl font-thai overflow-hidden ${isMaxLevel ? unit.colorClass + ' text-white ' + unit.borderClass : level >= 3 ? unit.shades.l3 : level >= 2 ? unit.shades.l2 : level >= 1 ? unit.shades.l1 : 'bg-white ' + unit.textClass + ' border-slate-200 border-2 active:border-b-2 active:translate-y-1'}`}>
                                {lesson.imageUrl ? (
                                  <>
                                    <Image src={lesson.imageUrl} alt={lesson.title} fill className={`object-cover ${level === 0 && suggestedLessonId !== lesson.id ? 'grayscale opacity-70' : ''}`} sizes="(max-width: 768px) 4rem, 5rem" />
                                    {isMaxLevel && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20"><CheckCircle size={32} className="stroke-[3] text-white" /></div>}
                                  </>
                                ) : (
                                  <>
                                    {lesson.items[0] ? formatCombiningChar(lesson.items[0].letter) : ''}
                                    {isMaxLevel ? (
                                      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full p-0.5 shadow-sm border border-emerald-200 z-20">
                                        <div className="bg-emerald-500 rounded-full flex items-center justify-center w-5 h-5">
                                          <CheckCircle size={12} className="text-white fill-emerald-500" />
                                        </div>
                                      </div>
                                    ) : level > 0 ? (
                                      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full p-0.5 shadow-sm border border-slate-200 z-20">
                                        <div className={`${unit.colorClass} rounded-full flex items-center justify-center w-5 h-5`}>
                                          <span className="text-white text-[9px] font-bold tracking-tight">{level}/4</span>
                                        </div>
                                      </div>
                                    ) : null}
                                  </>
                                )}
                              </div>
                              
                              {showLineToNext && (
                                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-2.5 h-[calc(100%+1rem)] ${lineToNextColor} z-0`}></div>
                              )}
                            </div>
                            
                            {/* Horizontal Card */}
                            <div 
                              className={`flex-1 rounded-[1.5rem] border-2 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all group border-b-[6px] cursor-pointer active:translate-y-[4px] active:border-b-2 shadow-sm relative ${isMaxLevel ? 'bg-emerald-50 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : suggestedLessonId === lesson.id ? 'bg-white border-amber-300 shadow-[0_0_15px_rgba(252,211,77,0.5)]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                              onClick={() => {
                                setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                setModalLevel(Math.min(level, 3));
                              }}
                            >
                               {isMaxLevel ? (
                                 <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                                   <CheckCircle size={14} className="fill-current text-white stroke-emerald-500" /> {language === 'en' ? 'MASTERED' : 'MAÎTRISÉ'}
                                 </div>
                               ) : suggestedLessonId === lesson.id && (
                                 <div className="absolute -top-3.5 left-6 bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                                   <Star size={12} fill="currentColor" /> {language === 'en' ? 'SUGGESTED' : 'SUGGÉRÉ'}
                                 </div>
                               )}
                               <div className="flex flex-col items-start text-left flex-1 md:pr-4">
                                 <h4 className="font-extrabold text-xl text-slate-800">
                                   {language === 'en' ? lesson.titleEn : lesson.title}
                                 </h4>
                                 <span className={`text-base font-bold mt-1 text-slate-500 font-thai tracking-wide`}>
                                   {lesson.items.map(i => formatCombiningChar(i.letter)).join(' • ')}
                                 </span>
                               </div>
                               
                               {/* Lesson Progress Bar (Out of 4) desktop */}
                               <div className="w-full md:w-48 shrink-0 mt-4 md:mt-0 flex flex-col justify-center">
                                 {level === 0 ? (
                                    suggestedLessonId === lesson.id ? (
                                      <div className="text-sm font-bold text-slate-400 text-left md:text-right">
                                        {language === 'en' ? 'Start learning' : 'Commencer'}
                                      </div>
                                    ) : null
                                 ) : (
                                   <>
                                     <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 px-1">
                                       <span>{language === 'en' ? 'Mastery' : 'Maîtrise'}</span>
                                       <span className={unit.textClass}>{level}/4</span>
                                     </div>
                                     <div className="flex justify-between gap-[2px] w-full">
                                       {Array.from({length: 4}).map((_, i) => (
                                         <div key={i} className={`h-3 flex-1 rounded-sm first:rounded-l-full last:rounded-r-full ${i < level ? unit.colorClass : 'bg-slate-100'}`}></div>
                                       ))}
                                     </div>
                                   </>
                                 )}
                               </div>
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
          <div className="w-80 flex-shrink-0 relative hidden xl:block z-40">
            {/* Sticky wrapper */}
            <div className="sticky top-24 w-full">
              <div 
                className="w-full relative flex flex-col gap-4 pb-4 group"
              >
              <div className="flex items-center gap-3 px-2 mb-2 text-slate-800 font-bold text-xl shrink-0">
                <BookOpen size={24} className="shrink-0" />
                <h2 className="whitespace-nowrap">
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
                      <div className="shrink-0 flex items-center justify-center font-black text-2xl w-16">
                         {i + 1}
                      </div>

                      <div className="relative z-10 flex flex-col justify-center whitespace-nowrap overflow-hidden pr-4 w-auto">
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
      {mounted && createPortal(
        <AnimatePresence>
          {selectedLesson && (
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setSelectedLesson(null)}
              />
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col mb-0 md:mb-12 relative border-t-8 z-10 max-h-[90vh] md:max-h-[85vh] overflow-hidden ${selectedLesson.unitColor.replace('500', '700').replace('bg-', 'border-')} ${selectedLesson.unitColor.replace('400', '600').replace('bg-', 'border-')} ${selectedLesson.unitColor.replace('600', '800').replace('bg-', 'border-')}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`p-6 ${selectedLesson.unitColor} flex flex-col items-start text-white relative shrink-0`}>
                  <button 
                    onClick={() => setSelectedLesson(null)} 
                    className="absolute top-4 right-4 text-white/80 hover:text-white rounded-full p-2 transition-colors z-10"
                  >
                    <X size={20} />
                  </button>
                  <p className="font-bold text-white/80 uppercase tracking-widest text-sm mb-1 pr-6">
                    Alphabet
                  </p>
                  <h3 className="text-2xl font-extrabold mb-1 pr-6">
                    {language === 'en' ? selectedLesson.lesson.titleEn : selectedLesson.lesson.title}
                  </h3>

                  <div className="flex items-center gap-3 w-full mt-4">
                     <div className="bg-white/20 text-white rounded-full px-3 py-1 flex items-center gap-1.5 text-sm font-bold shrink-0">
                        <CheckCircle size={14} className="stroke-[3]" />
                        {lessonLevels[selectedLesson.lesson.id] || 0}/4 {language === 'en' ? 'levels' : 'niveaux'}
                     </div>
                     <div className="h-2 flex-1 bg-black/15 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${((lessonLevels[selectedLesson.lesson.id] || 0) / 4) * 100}%` }}></div>
                     </div>
                  </div>
                </div>

                <div className="p-6 pt-4 overflow-y-auto hide-scrollbar flex-1">
                  <div className="flex items-center justify-between gap-2 py-2 mb-6">
                     <button 
                        className="h-10 w-10 shrink-0 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed" 
                        disabled={modalLevel === 0} 
                        onClick={() => {
                           setModalLevel(Math.max(0, modalLevel - 1));
                           levelsScrollRef.current?.scrollBy({ left: -84, behavior: 'smooth' });
                        }}
                     >
                        <ChevronLeft size={20}/>
                     </button>
                     
                     <div 
                        ref={(el) => {
                           levelsScrollRef.current = el;
                           if (el && !el.dataset.scrolled) {
                             el.scrollTo({ left: modalLevel * 84, behavior: 'instant' });
                             el.dataset.scrolled = 'true';
                           }
                        }} 
                        onMouseDown={(e) => {
                           dragRef.current.isDragging = true;
                           if (levelsScrollRef.current) {
                             dragRef.current.startX = e.pageX - levelsScrollRef.current.offsetLeft;
                             dragRef.current.scrollLeft = levelsScrollRef.current.scrollLeft;
                           }
                        }}
                        onMouseLeave={() => { dragRef.current.isDragging = false; }}
                        onMouseUp={() => { dragRef.current.isDragging = false; }}
                        onMouseMove={(e) => {
                           if (!dragRef.current.isDragging) return;
                           e.preventDefault();
                           if (levelsScrollRef.current) {
                             const x = e.pageX - levelsScrollRef.current.offsetLeft;
                             const walk = (x - dragRef.current.startX) * 1.5;
                             levelsScrollRef.current.scrollLeft = dragRef.current.scrollLeft - walk;
                           }
                        }}
                        className="flex gap-3 overflow-x-auto hide-scrollbar flex-1 snap-x py-2 px-1 mx-1 scroll-smooth cursor-grab active:cursor-grabbing"
                     >
                        {[0, 1, 2, 3].map((levelIndex) => {
                          const currentProgress = lessonLevels[selectedLesson.lesson.id] || 0;
                          const starsArray = lessonStars[selectedLesson.lesson.id] || Array(10).fill(0);
                          const earnedStars = starsArray[levelIndex] || 0;
                          
                          const isCompletedLevel = levelIndex < currentProgress;
                          const isAccessible = levelIndex <= currentProgress;
                          const isSelected = modalLevel === levelIndex;
                          
                          if (!isAccessible) {
                            return (
                              <button key={levelIndex} disabled className="shrink-0 h-16 w-16 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                                <Lock size={20} />
                              </button>
                            );
                          }
                          
                          return (
                            <button
                              key={levelIndex}
                              onClick={() => setModalLevel(levelIndex)}
                              className={`shrink-0 h-16 w-[4.5rem] flex flex-col items-center justify-center rounded-2xl border-2 transition-all snap-center relative
                                ${isSelected 
                                  ? `bg-white ${selectedLesson.unitBorder} text-slate-800 scale-105 shadow-md` 
                                  : `bg-white border-slate-200 text-slate-600 hover:border-slate-300`
                                }`}
                            >
                              <span className={`font-extrabold text-lg ${isSelected ? selectedLesson.unitColor.replace('bg-', 'text-') : 'text-slate-700'}`}>{levelIndex + 1}</span>
                              {levelIndex === currentProgress ? (
                                <span className={`text-[9px] font-black uppercase mt-0.5 ${isSelected ? selectedLesson.unitColor.replace('bg-', 'text-') : 'text-amber-500'}`}>
                                  {language === 'en' ? 'IN PROGRESS' : 'EN COURS'}
                                </span>
                              ) : (
                                <div className="flex gap-0.5 mt-0.5">
                                  {Array.from({ length: 3 }).map((_, i) => (
                                    <Star key={i} size={10} className={i < earnedStars ? "fill-amber-400 text-amber-500" : "fill-slate-200 text-slate-300"} />
                                  ))}
                                </div>
                              )}
                            </button>
                          );
                        })}
                     </div>
                     
                     <button 
                        className="h-10 w-10 shrink-0 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed" 
                        disabled={modalLevel === 3 || modalLevel >= (lessonLevels[selectedLesson.lesson.id] || 0)} 
                        onClick={() => {
                           setModalLevel(Math.min(3, modalLevel + 1));
                           levelsScrollRef.current?.scrollBy({ left: 84, behavior: 'smooth' });
                        }}
                     >
                        <ChevronRight size={20}/>
                     </button>
                  </div>
                  
                  {(() => {
                    const letterCount = selectedLesson.lesson.items.length;
                    const stepsCount = 10 + letterCount;
                    let secsPerStep = 5;
                    
                    let estimatedSecs = stepsCount * secsPerStep;
                    let estimatedMins = Math.max(1, Math.ceil(estimatedSecs / 60));
                    
                    return (
                      <div className="mb-2">
                        <div className="flex flex-row gap-2 mb-6">
                           <div className="flex-1 bg-blue-50/50 rounded-2xl p-3 flex items-center gap-2 border border-blue-100 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                                <BookOpen size={16} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-blue-500 text-[10px] font-bold mb-0.5 uppercase tracking-wider truncate">{language === 'en' ? 'Letters' : 'Lettres'}</div>
                                <div className="text-blue-900 font-extrabold text-sm sm:text-base truncate">{letterCount}</div>
                              </div>
                           </div>
                           <div className="flex-1 bg-purple-50/50 rounded-2xl p-3 flex items-center gap-2 border border-purple-100 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500 shrink-0">
                                <Clock size={16} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-purple-500 text-[10px] font-bold mb-0.5 uppercase tracking-wider truncate">{language === 'en' ? 'Time' : 'Durée estimée'}</div>
                                <div className="text-purple-900 font-extrabold text-sm sm:text-base truncate">{estimatedMins} min</div>
                              </div>
                           </div>
                        </div>

                        <div>
                           <h4 className="border-b text-slate-500 font-bold mb-3 pb-2 flex text-sm">{language === 'en' ? 'Letters preview' : 'Aperçu des lettres'}</h4>
                           <div className="flex flex-nowrap overflow-x-auto hide-scrollbar gap-2 pb-2">
                               {selectedLesson.lesson.items.slice(0, 3).map(i => (
                                  <button onClick={() => playThaiTTS(i.letter)} key={i.letter} className="shrink-0 bg-white border-2 border-slate-100 rounded-xl px-3 py-1.5 flex items-center justify-center gap-2 font-thai text-xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer active:scale-95">
                                     {formatCombiningChar(i.letter)} <Volume2 size={16} className="text-slate-300"/>
                                  </button>
                               ))}
                               {letterCount > 3 && (
                                 <div className="shrink-0 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl px-3 py-1.5 flex items-center justify-center font-bold text-sm">
                                    +{letterCount - 3} {language === 'en' ? 'others' : 'autres'}
                                 </div>
                               )}
                           </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                <div className="shrink-0 p-6 pt-2 bg-white/90 backdrop-blur border-t border-slate-50 flex flex-col gap-3">
                    <Link
                      href={`/alphabet/lesson/${selectedLesson.lesson.id}?level=${modalLevel + 1}`}
                      className={`w-full py-4 rounded-xl border-b-4 font-bold text-lg text-white shadow-lg flex items-center justify-center hover:opacity-90 active:translate-y-1 transition-all ${selectedLesson.unitColor} ${selectedLesson.unitBorder}`}
                    >
                      <Play size={20} className="mr-2 fill-current" />
                      {language === 'en' ? `Start level ${modalLevel + 1}` : `Démarrer le niveau ${modalLevel + 1}`}
                    </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}

