'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useProgressStore } from '../lib/store';
import courseData from '../data/course.json';
import { BookOpen, CheckCircle, Star, Play, Crown, RotateCcw, Pencil, X, Unlock, Brain, MessageCircle, Lock } from 'lucide-react';
import { CourseData, Lesson } from '../types';

import { WritingConfigModal } from '../components/WritingConfigModal';

const data = courseData as CourseData;

const UNITS = [
  {
    id: 'unit-1', title: "Unité 1 : Les bases", titleEn: "Unit 1: The Basics", description: "Commencez votre voyage en thaï !", descriptionEn: "Start your Thai journey!", colorClass: "bg-emerald-500", borderClass: "border-emerald-700", textClass: "text-emerald-500", hoverClass: "hover:bg-emerald-400", lightTextClass: "text-emerald-100", bgMutedClass: "bg-emerald-700/50",
    shades: {
      l1: "bg-emerald-200 border-emerald-400 text-emerald-800 hover:bg-emerald-300",
      l2: "bg-emerald-300 border-emerald-500 text-emerald-900 hover:bg-emerald-400",
      l3: "bg-emerald-400 border-emerald-600 text-white hover:bg-emerald-500",
      l4: "bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-600"
    },
    startIndex: 0, endIndex: 11
  },
  {
    id: 'unit-2', title: "Unité 2 : Vie quotidienne", titleEn: "Unit 2: Daily Life", description: "Se déplacer, se repérer et communiquer davantage.", descriptionEn: "Getting around, finding your way and communicating more.", colorClass: "bg-blue-500", borderClass: "border-blue-700", textClass: "text-blue-500", hoverClass: "hover:bg-blue-400", lightTextClass: "text-blue-100", bgMutedClass: "bg-blue-700/50",
    shades: {
      l1: "bg-blue-200 border-blue-400 text-blue-800 hover:bg-blue-300",
      l2: "bg-blue-300 border-blue-500 text-blue-900 hover:bg-blue-400",
      l3: "bg-blue-400 border-blue-600 text-white hover:bg-blue-500",
      l4: "bg-blue-500 border-blue-700 text-white hover:bg-blue-600"
    },
    startIndex: 11, endIndex: 20
  },
  {
    id: 'unit-3', title: "Unité 3 : Nourriture & Boissons", titleEn: "Unit 3: Food & Drinks", description: "Saveurs, viandes et commander au restaurant.", descriptionEn: "Flavors, meats, and ordering at a restaurant.", colorClass: "bg-orange-500", borderClass: "border-orange-700", textClass: "text-orange-500", hoverClass: "hover:bg-orange-400", lightTextClass: "text-orange-100", bgMutedClass: "bg-orange-700/50",
    shades: {
      l1: "bg-orange-200 border-orange-400 text-orange-800 hover:bg-orange-300",
      l2: "bg-orange-300 border-orange-500 text-orange-900 hover:bg-orange-400",
      l3: "bg-orange-400 border-orange-600 text-white hover:bg-orange-500",
      l4: "bg-orange-500 border-orange-700 text-white hover:bg-orange-600"
    },
    startIndex: 20, endIndex: 30
  },
  {
    id: 'unit-4', title: "Unité 4 : Verbes d'action", titleEn: "Unit 4: Action Verbs", description: "Regarder, jouer, travailler et apprendre.", descriptionEn: "Watching, playing, working, and learning.", colorClass: "bg-purple-500", borderClass: "border-purple-700", textClass: "text-purple-500", hoverClass: "hover:bg-purple-400", lightTextClass: "text-purple-100", bgMutedClass: "bg-purple-700/50",
    shades: {
      l1: "bg-purple-200 border-purple-400 text-purple-800 hover:bg-purple-300",
      l2: "bg-purple-300 border-purple-500 text-purple-900 hover:bg-purple-400",
      l3: "bg-purple-400 border-purple-600 text-white hover:bg-purple-500",
      l4: "bg-purple-500 border-purple-700 text-white hover:bg-purple-600"
    },
    startIndex: 30, endIndex: 40
  },
  {
    id: 'unit-5', title: "Unité 5 : Le temps & Météo", titleEn: "Unit 5: Time & Weather", description: "Jours, heures, pluie et chaleur.", descriptionEn: "Days, hours, rain, and heat.", colorClass: "bg-cyan-500", borderClass: "border-cyan-700", textClass: "text-cyan-500", hoverClass: "hover:bg-cyan-400", lightTextClass: "text-cyan-100", bgMutedClass: "bg-cyan-700/50",
    shades: {
      l1: "bg-cyan-200 border-cyan-400 text-cyan-800 hover:bg-cyan-300",
      l2: "bg-cyan-300 border-cyan-500 text-cyan-900 hover:bg-cyan-400",
      l3: "bg-cyan-400 border-cyan-600 text-white hover:bg-cyan-500",
      l4: "bg-cyan-500 border-cyan-700 text-white hover:bg-cyan-600"
    },
    startIndex: 40, endIndex: 50
  },
  {
    id: 'unit-6', title: "Unité 6 : En Ville & Trajets", titleEn: "Unit 6: In the City & Commuting", description: "Bâtiments, école et moyens de transports.", descriptionEn: "Buildings, schools, and transportation.", colorClass: "bg-pink-500", borderClass: "border-pink-700", textClass: "text-pink-500", hoverClass: "hover:bg-pink-400", lightTextClass: "text-pink-100", bgMutedClass: "bg-pink-700/50",
    shades: {
      l1: "bg-pink-200 border-pink-400 text-pink-800 hover:bg-pink-300",
      l2: "bg-pink-300 border-pink-500 text-pink-900 hover:bg-pink-400",
      l3: "bg-pink-400 border-pink-600 text-white hover:bg-pink-500",
      l4: "bg-pink-500 border-pink-700 text-white hover:bg-pink-600"
    },
    startIndex: 50, endIndex: 60
  },
  {
    id: 'unit-7', title: "Unité 7 : Achats & Vêtements", titleEn: "Unit 7: Shopping & Clothes", description: "Couleurs, vêtements et argent.", descriptionEn: "Colors, clothes, and money.", colorClass: "bg-yellow-500", borderClass: "border-yellow-700", textClass: "text-yellow-500", hoverClass: "hover:bg-yellow-400", lightTextClass: "text-yellow-100", bgMutedClass: "bg-yellow-700/50",
    shades: {
      l1: "bg-yellow-200 border-yellow-400 text-yellow-800 hover:bg-yellow-300",
      l2: "bg-yellow-300 border-yellow-500 text-yellow-900 hover:bg-yellow-400",
      l3: "bg-yellow-400 border-yellow-600 text-yellow-900 hover:bg-yellow-500",
      l4: "bg-yellow-500 border-yellow-700 text-yellow-900 hover:bg-yellow-600"
    },
    startIndex: 60, endIndex: 70
  },
  {
    id: 'unit-8', title: "Unité 8 : Description & Famille", titleEn: "Unit 8: Description & Family", description: "Apparence, frères, sœurs et amis.", descriptionEn: "Appearance, siblings, and friends.", colorClass: "bg-indigo-500", borderClass: "border-indigo-700", textClass: "text-indigo-500", hoverClass: "hover:bg-indigo-400", lightTextClass: "text-indigo-100", bgMutedClass: "bg-indigo-700/50",
    shades: {
      l1: "bg-indigo-200 border-indigo-400 text-indigo-800 hover:bg-indigo-300",
      l2: "bg-indigo-300 border-indigo-500 text-indigo-900 hover:bg-indigo-400",
      l3: "bg-indigo-400 border-indigo-600 text-white hover:bg-indigo-500",
      l4: "bg-indigo-500 border-indigo-700 text-white hover:bg-indigo-600"
    },
    startIndex: 70, endIndex: 80
  },
  {
    id: 'unit-9', title: "Unité 9 : Santé & Émotions", titleEn: "Unit 9: Health & Emotions", description: "Docteur, tristesse, douleur et joie.", descriptionEn: "Doctor, sadness, pain, and joy.", colorClass: "bg-rose-500", borderClass: "border-rose-700", textClass: "text-rose-500", hoverClass: "hover:bg-rose-400", lightTextClass: "text-rose-100", bgMutedClass: "bg-rose-700/50",
    shades: {
      l1: "bg-rose-200 border-rose-400 text-rose-800 hover:bg-rose-300",
      l2: "bg-rose-300 border-rose-500 text-rose-900 hover:bg-rose-400",
      l3: "bg-rose-400 border-rose-600 text-white hover:bg-rose-500",
      l4: "bg-rose-500 border-rose-700 text-white hover:bg-rose-600"
    },
    startIndex: 80, endIndex: 90
  },
  {
    id: 'unit-10', title: "Unité 10 : Le Grand Bilan A1", titleEn: "Unit 10: The Grand A1 Review", description: "Expressions, habitudes et tests finaux !", descriptionEn: "Expressions, habits, and final tests!", colorClass: "bg-teal-500", borderClass: "border-teal-700", textClass: "text-teal-500", hoverClass: "hover:bg-teal-400", lightTextClass: "text-teal-100", bgMutedClass: "bg-teal-700/50",
    shades: {
      l1: "bg-teal-200 border-teal-400 text-teal-800 hover:bg-teal-300",
      l2: "bg-teal-300 border-teal-500 text-teal-900 hover:bg-teal-400",
      l3: "bg-teal-400 border-teal-600 text-white hover:bg-teal-500",
      l4: "bg-teal-500 border-teal-700 text-white hover:bg-teal-600"
    },
    startIndex: 90, endIndex: 100
  }
];

export default function Home() {
  const router = useRouter();
  const { completedLessons, unlockedLessons, lessonLevels, xp, resetLessonLevel, language, setLanguage, unlockLessonManual, autoDetectLanguage, lastActiveUnitIndex, setLastActiveUnitIndex } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [isWritingConfigModalOpen, setWritingConfigModalOpen] = useState(false);
  const [isPracticeModalOpen, setPracticeModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{lesson: Lesson, isCompleted: boolean, unitColor: string, unitBorder: string} | null>(null);
  const [lessonToUnlock, setLessonToUnlock] = useState<{lesson: Lesson, unitColor: string, unitBorder: string} | null>(null);
  const [modalLevel, setModalLevel] = useState(0);
  const [cols, setCols] = useState(5);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      autoDetectLanguage();
    }, 0);
    return () => clearTimeout(timer);
  }, [autoDetectLanguage]);
  
  useEffect(() => {
    if (!mounted) return;
    if (lastActiveUnitIndex !== undefined && lastActiveUnitIndex >= 0 && lastActiveUnitIndex < UNITS.length) {
      setActiveUnitIndex(lastActiveUnitIndex);
    } else {
      const lastUnlockedIndex = data.lessons.findIndex(l => !completedLessons.includes(l.id));
      const targetIndex = lastUnlockedIndex === -1 ? data.lessons.length - 1 : lastUnlockedIndex;
      const unitIndex = UNITS.findIndex(u => targetIndex >= u.startIndex && targetIndex < u.endIndex);
      if (unitIndex !== -1) {
        setActiveUnitIndex(unitIndex);
        setLastActiveUnitIndex(unitIndex);
      }
    }
  }, [mounted, lastActiveUnitIndex, setLastActiveUnitIndex]);

  const handleUnitSelect = (index: number) => {
    setActiveUnitIndex(index);
    setLastActiveUnitIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 pb-28 md:pb-20 overflow-hidden">
      
      {/* Header */}
      <header className="sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-sm z-50 h-[3.75rem] md:hidden">
        <div className="flex items-center justify-between w-full h-full px-4 md:px-8 gap-2 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm md:hidden">
              <BookOpen size={20} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight md:hidden">ThaiLearn</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {mounted && (
              <button 
                 onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                 className="flex items-center justify-center px-4 py-2 rounded-full bg-slate-100 text-slate-500 font-extrabold text-xs hover:bg-slate-200 transition-colors shadow-sm"
                 title={language === 'fr' ? "Switch to English" : "Passer en Français"}
              >
                 {language === 'fr' ? 'FR' : 'EN'}
              </button>
            )}
            
            <div className="flex items-center gap-1.5 bg-slate-100 px-4 py-2 rounded-full text-orange-600 font-extrabold text-sm shadow-sm">
              <Star size={16} className="fill-amber-400 stroke-amber-400" />
              <span className="mt-0">{mounted ? xp : 0} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content (Mobile Only) */}
      <main className="max-w-2xl mx-auto px-4 mt-2 flex flex-col gap-8 md:hidden">
        {/* Mobile Unit Selector */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-4 -mx-4 px-4 sticky top-[3.75rem] z-40 bg-[#FAFAFA]/95 backdrop-blur-sm pt-2">
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
              {language === 'en' ? `Unit ${i + 1}` : `Unité ${i + 1}`}
            </button>
          ))}
        </div>

        {(() => {
          const unit = UNITS[activeUnitIndex];
          const unitLessons = data.lessons.slice(unit.startIndex, unit.endIndex);
          const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
          const progressPercent = mounted ? (completedInUnit / unitLessons.length) * 100 : 0;
          
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
                           setModalLevel(Math.min(level, 9));
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
                   const globalIndex = unit.startIndex + idx;
                   const isCompleted = mounted ? completedLessons.includes(lesson.id) : false;
                   const level = mounted ? (lessonLevels[lesson.id] || 0) : 0;
                   const isUnlocked = globalIndex === 0 || (mounted && (completedLessons.includes(data.lessons[globalIndex - 1].id) || unlockedLessons?.includes(lesson.id)));
                   const isMaxLevel = level >= 10;

                   const nextGlobalIndex = globalIndex + 1;
                   const nextUnlocked = nextGlobalIndex < data.lessons.length && (mounted && (completedLessons.includes(data.lessons[nextGlobalIndex - 1].id) || unlockedLessons?.includes(data.lessons[nextGlobalIndex].id)));
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
                              setModalLevel(Math.min(level, 9));
                            } else {
                              setLessonToUnlock({lesson, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                            }
                          }}
                        >
                          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-b-[6px] relative z-10 text-4xl sm:text-5xl font-thai shadow-sm
                            ${isMaxLevel 
                              ? unit.colorClass + ' text-white ' + unit.borderClass 
                              : level >= 8 ? unit.shades.l4 : level >= 6 ? unit.shades.l3 : level >= 3 ? unit.shades.l2 : level >= 1 ? unit.shades.l1
                              : isUnlocked ? 'bg-white ' + unit.textClass + ' border-slate-200 border-2 active:border-b-2 active:translate-y-1' 
                              : 'bg-slate-100 text-slate-300 border-slate-200 border-2 shadow-none'}`}
                          >
                            {!isUnlocked ? <Lock size={32} className="text-slate-300" /> : isMaxLevel ? <CheckCircle size={40} className="stroke-[3]" /> : level > 0 ? <CheckCircle size={40} className="stroke-current stroke-[2.5]" /> : lesson.isReview ? <Star size={40} className="fill-current stroke-current" /> : <Play size={40} className="ml-1 fill-current stroke-[2]" />}
                          </div>
                          
                          {(level > 0 && level <= 10) && (
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
                              setModalLevel(Math.min(level, 9));
                            } else {
                              setLessonToUnlock({lesson, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                            }
                          }}
                        >
                           <h4 className={`font-extrabold text-xl ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                             {mounted && language === 'en' ? (lesson.titleEn || lesson.title) : lesson.title}
                           </h4>
                           <span className={`text-sm font-bold mt-1 tracking-wide ${isUnlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                             {mounted && language === 'en' ? (lesson.descriptionEn || lesson.description) : lesson.description}
                           </span>
                           
                           {isUnlocked && (
                             <>
                               <div className="bg-slate-100 rounded-full px-3 py-1 text-xs font-bold text-slate-500 mt-3 mb-4">
                                 {mounted && language === 'en' ? 'Level' : 'Niveau'} {level}/10
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
              const unitLessons = data.lessons.slice(unit.startIndex, unit.endIndex);
              const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
              const progressPercent = (completedInUnit / unitLessons.length) * 100;
              
              return (
                <div key={`desktop-unit-${unit.id}`} className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                  {/* Unit Hero Card */}
                  <div className={`p-8 md:p-10 ${unit.colorClass} rounded-3xl text-white shadow-xl relative overflow-hidden border-b-[6px] ${unit.borderClass}`}>
                    <div className="relative z-10">
                      <h2 className="text-4xl font-extrabold mb-3">{language === 'en' ? unit.titleEn : unit.title}</h2>
                      <p className={`${unit.lightTextClass} mb-8 font-medium text-lg`}>{language === 'en' ? unit.descriptionEn : unit.description}</p>
                      
                      {/* Progress Bar + "Continuer" Button equivalent */}
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
                               // find first unlocked lesson
                               let firstUncompletedIdx = unitLessons.findIndex(l => !completedLessons.includes(l.id));
                               if (firstUncompletedIdx === -1) firstUncompletedIdx = 0;
                               const l = unitLessons[firstUncompletedIdx];
                               const level = lessonLevels[l.id] || 0;
                               setSelectedLesson({lesson: l, isCompleted: completedLessons.includes(l.id), unitColor: unit.colorClass, unitBorder: unit.borderClass});
                               setModalLevel(Math.min(level, 9));
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
                       const globalIndex = unit.startIndex + idx;
                       const isCompleted = completedLessons.includes(lesson.id);
                       const level = lessonLevels[lesson.id] || 0;
                       const isUnlocked = globalIndex === 0 || completedLessons.includes(data.lessons[globalIndex - 1].id) || unlockedLessons?.includes(lesson.id);
                       
                       const nextGlobalIndex = globalIndex + 1;
                       const nextUnlocked = nextGlobalIndex < data.lessons.length && (completedLessons.includes(data.lessons[nextGlobalIndex - 1].id) || unlockedLessons?.includes(data.lessons[nextGlobalIndex].id));

                       const showLineToNext = idx < unitLessons.length - 1;
                       const lineToNextColor = isUnlocked && nextUnlocked ? unit.colorClass : "bg-slate-200";
                       
                       const isMaxLevel = level >= 10;

                       return (
                         <div key={`desktop-node-${lesson.id}`} className="relative flex items-center w-full z-10 gap-6 md:gap-8 min-h-[7rem]">
                            {/* Circle Node */}
                            <div 
                              className={`relative shrink-0 py-6 ${isUnlocked ? 'cursor-pointer hover:brightness-95 hover:scale-105 active:scale-95 transition-all' : 'cursor-not-allowed'}`}
                              onClick={() => {
                                if (isUnlocked) {
                                  setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                  setModalLevel(Math.min(level, 9));
                                } else {
                                  setLessonToUnlock({lesson, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                }
                              }}
                            >
                              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center border-b-[6px] relative z-10 transition-transform ${isMaxLevel ? unit.colorClass + ' text-white ' + unit.borderClass : level >= 8 ? unit.shades.l4 : level >= 6 ? unit.shades.l3 : level >= 3 ? unit.shades.l2 : level >= 1 ? unit.shades.l1 : isUnlocked ? 'bg-white ' + unit.textClass + ' border-slate-200 border-2 active:border-b-2 active:translate-y-1' : 'bg-slate-100 text-slate-300 border-slate-200 border-2 shadow-none'}`}>
                                {isMaxLevel ? <CheckCircle size={32} className="stroke-[3]" /> : isUnlocked ? <Play size={32} className="ml-1 fill-current stroke-[2]" /> : <Lock size={32} className="stroke-[2.5]" />}
                              </div>
                              
                              {(level > 0 && level <= 10) && (
                                <div className={`absolute bottom-4 -right-2 z-20 bg-white border-2 border-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-sm ${unit.textClass}`}>
                                  {level}
                                </div>
                              )}
                              
                              {showLineToNext && (
                                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-2.5 h-full ${lineToNextColor} z-0`}></div>
                              )}
                            </div>
                            
                            {/* Horizontal Card */}
                            <div 
                              className={`flex-1 rounded-[1.5rem] border-2 p-5 md:p-6 flex items-center justify-between transition-all group ${isUnlocked ? 'bg-white border-slate-200 border-b-[6px] cursor-pointer hover:border-slate-300 active:translate-y-[4px] active:border-b-2 shadow-sm' : 'bg-transparent border-transparent opacity-80 cursor-not-allowed'}`}
                              onClick={() => {
                                if (isUnlocked) {
                                  setSelectedLesson({lesson, isCompleted, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                  setModalLevel(Math.min(level, 9));
                                } else {
                                  setLessonToUnlock({lesson, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                }
                              }}
                            >
                               <div className="flex flex-col items-start text-left">
                                 <h4 className="font-extrabold text-xl text-slate-800">
                                   {language === 'en' ? (lesson.titleEn || lesson.title) : lesson.title}
                                 </h4>
                                 <span className={`text-sm font-bold mt-1 ${isMaxLevel ? unit.textClass : level > 0 ? unit.textClass : isUnlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                                   {isMaxLevel ? (language === 'en' ? 'Completed' : 'Complété') : level > 0 ? `${(level * 10)}%` : isUnlocked ? (language === 'en' ? 'In progress' : 'En cours') : (language === 'en' ? 'Locked' : 'Verrouillé')}
                                 </span>
                               </div>
                               
                               <button className={`shrink-0 px-6 py-3 rounded-2xl font-bold tracking-wider text-sm transition-all hidden sm:block ${isMaxLevel ? 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 cursor-pointer text-slate-600' : isUnlocked ? unit.colorClass + ' text-white group-hover:brightness-110 shadow-[0_2px_0_rgba(0,0,0,0.1)] group-active:shadow-none group-active:translate-y-[2px] cursor-pointer' : 'bg-slate-100 text-slate-300'}`}>
                                 {isMaxLevel ? (language === 'en' ? 'Review' : 'Réviser') : isUnlocked ? (language === 'en' ? 'Continue' : 'Continuer') : (language === 'en' ? 'Start' : 'Commencer')}
                               </button>
                            </div>
                         </div>
                       )
                     })}
                  </div>
                </div>
              );
            })()}
            </div>
          </div>
          
          {/* Right Sidebar Wrap */}
          <div className="w-20 xl:w-80 flex-shrink-0 relative hidden lg:block z-40">
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
            style={{ borderTopColor: 'var(--tw-colors-emerald-500)' }} // Or use the unit's color if we pass raw hex
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 ${selectedLesson.unitColor} flex justify-between items-start text-white`}>
              <div>
                <p className="font-bold text-white/80 uppercase tracking-widest text-sm mb-1">
                  {selectedLesson.lesson.isReview 
                    ? (language === 'en' ? 'Review Test' : 'Test Bilan') 
                    : (language === 'en' ? 'Lesson' : 'Leçon')}
                </p>
                <h3 className="text-2xl font-extrabold">
                  {language === 'en' ? (selectedLesson.lesson.titleEn || selectedLesson.lesson.title) : selectedLesson.lesson.title}
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
                {language === 'en' ? (selectedLesson.lesson.descriptionEn || selectedLesson.lesson.description) : selectedLesson.lesson.description}
              </p>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {language === 'en' ? 'Choose a level' : 'Choisir un niveau'}
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((levelIndex) => {
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
                        ) : levelIndex === 9 ? (
                          <Crown size={16} className={isSelected ? "text-white opacity-80" : "opacity-40"} />
                        ) : (
                          <Star size={16} className={isSelected ? "text-white opacity-80" : "opacity-40"} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href={`/lesson/${selectedLesson.lesson.id}?level=${modalLevel + 1}`}
                  className={`w-full py-4 rounded-xl border-b-4 font-bold text-lg text-white shadow-lg flex items-center justify-center hover:opacity-90 active:translate-y-1 transition-all ${selectedLesson.unitColor} ${selectedLesson.unitBorder}`}
                >
                  <Play size={20} className="mr-2 fill-current" />
                  {language === 'en' ? `Start level ${modalLevel + 1}` : `Démarrer le niveau ${modalLevel + 1}`}
                </Link>

                {selectedLesson.isCompleted && (
                  <div className="flex gap-3 mt-2">
                    <Link
                      href={`/writing?lessonId=${selectedLesson.lesson.id}`}
                      className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                      <Pencil size={18} className="mr-2" />
                      {language === 'en' ? 'Writing' : 'Écriture'}
                    </Link>
                    <button
                      onClick={() => {
                        resetLessonLevel(selectedLesson.lesson.id);
                        setModalLevel(0);
                      }}
                      className="flex-1 py-3 rounded-xl border-2 border-rose-100 text-rose-500 font-bold flex items-center justify-center hover:bg-rose-50 transition-colors"
                    >
                      <RotateCcw size={18} className="mr-2" />
                      {language === 'en' ? 'Reset' : 'Réinitialiser'}
                    </button>
                  </div>
                )}
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
                  {lessonToUnlock.lesson.isReview 
                    ? (language === 'en' ? 'Review Test' : 'Test Bilan') 
                    : (language === 'en' ? 'Lesson Locked' : 'Leçon Verrouillée')}
                </p>
                <h3 className="text-2xl font-extrabold">
                  {language === 'en' ? (lessonToUnlock.lesson.titleEn || lessonToUnlock.lesson.title) : lessonToUnlock.lesson.title}
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
              <div className="mx-auto w-16 h-16 bg-slate-100 text-slate-400 flex items-center justify-center rounded-2xl mb-4">
                <BookOpen size={32} />
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
      <WritingConfigModal isOpen={isWritingConfigModalOpen} onClose={() => setWritingConfigModalOpen(false)} />
    </div>
  );
}
