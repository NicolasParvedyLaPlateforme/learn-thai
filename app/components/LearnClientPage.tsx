'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useProgressStore } from '../lib/store';
import { playThaiTTS } from '../lib/tts';
import { BookOpen, CheckCircle, Star, Play, Crown, RotateCcw, Pencil, X, Unlock, Brain, MessageCircle, Lock, ChevronLeft, ChevronRight, Clock, Volume2, Heart } from 'lucide-react';
import { Lesson } from '../types';
import Image from 'next/image';

import { WritingConfigModal } from '../components/WritingConfigModal';
import { DesktopSidebarRight } from '../components/DesktopSidebarRight';
import PWAInstallButton from '../components/PWAInstallButton';

const UNITS = [
  {
    id: 'unit-1', title: "Unité 1 : Les bases", titleEn: "Unit 1: The Basics", description: "Commencez votre voyage en thaï !", descriptionEn: "Start your Thai journey!", colorClass: "bg-emerald-500", borderClass: "border-emerald-700", textClass: "text-emerald-500", hoverClass: "hover:bg-emerald-400", lightTextClass: "text-emerald-100", bgMutedClass: "bg-emerald-700/50",
    shades: {
      l1: "bg-emerald-200 border-emerald-400 text-emerald-800 hover:bg-emerald-300",
      l2: "bg-emerald-300 border-emerald-500 text-emerald-900 hover:bg-emerald-400",
      l3: "bg-emerald-400 border-emerald-600 text-white hover:bg-emerald-500",
      l4: "bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-600"
    },
    startIndex: 0, endIndex: 22
  },
  {
    id: 'unit-2', title: "Unité 2 : Vie quotidienne", titleEn: "Unit 2: Daily Life", description: "Se déplacer, se repérer et communiquer davantage.", descriptionEn: "Getting around, finding your way and communicating more.", colorClass: "bg-blue-500", borderClass: "border-blue-700", textClass: "text-blue-500", hoverClass: "hover:bg-blue-400", lightTextClass: "text-blue-100", bgMutedClass: "bg-blue-700/50",
    shades: {
      l1: "bg-blue-200 border-blue-400 text-blue-800 hover:bg-blue-300",
      l2: "bg-blue-300 border-blue-500 text-blue-900 hover:bg-blue-400",
      l3: "bg-blue-400 border-blue-600 text-white hover:bg-blue-500",
      l4: "bg-blue-500 border-blue-700 text-white hover:bg-blue-600"
    },
    startIndex: 22, endIndex: 32
  },
  {
    id: 'unit-3', title: "Unité 3 : Nourriture & Boissons", titleEn: "Unit 3: Food & Drinks", description: "Saveurs, viandes et commander au restaurant.", descriptionEn: "Flavors, meats, and ordering at a restaurant.", colorClass: "bg-orange-500", borderClass: "border-orange-700", textClass: "text-orange-500", hoverClass: "hover:bg-orange-400", lightTextClass: "text-orange-100", bgMutedClass: "bg-orange-700/50",
    shades: {
      l1: "bg-orange-200 border-orange-400 text-orange-800 hover:bg-orange-300",
      l2: "bg-orange-300 border-orange-500 text-orange-900 hover:bg-orange-400",
      l3: "bg-orange-400 border-orange-600 text-white hover:bg-orange-500",
      l4: "bg-orange-500 border-orange-700 text-white hover:bg-orange-600"
    },
    startIndex: 32, endIndex: 42
  },
  {
    id: 'unit-4', title: "Unité 4 : Verbes d'action", titleEn: "Unit 4: Action Verbs", description: "Regarder, jouer, travailler et apprendre.", descriptionEn: "Watching, playing, working, and learning.", colorClass: "bg-purple-500", borderClass: "border-purple-700", textClass: "text-purple-500", hoverClass: "hover:bg-purple-400", lightTextClass: "text-purple-100", bgMutedClass: "bg-purple-700/50",
    shades: {
      l1: "bg-purple-200 border-purple-400 text-purple-800 hover:bg-purple-300",
      l2: "bg-purple-300 border-purple-500 text-purple-900 hover:bg-purple-400",
      l3: "bg-purple-400 border-purple-600 text-white hover:bg-purple-500",
      l4: "bg-purple-500 border-purple-700 text-white hover:bg-purple-600"
    },
    startIndex: 42, endIndex: 52
  },
  {
    id: 'unit-5', title: "Unité 5 : Le temps & Météo", titleEn: "Unit 5: Time & Weather", description: "Jours, heures, pluie et chaleur.", descriptionEn: "Days, hours, rain, and heat.", colorClass: "bg-cyan-500", borderClass: "border-cyan-700", textClass: "text-cyan-500", hoverClass: "hover:bg-cyan-400", lightTextClass: "text-cyan-100", bgMutedClass: "bg-cyan-700/50",
    shades: {
      l1: "bg-cyan-200 border-cyan-400 text-cyan-800 hover:bg-cyan-300",
      l2: "bg-cyan-300 border-cyan-500 text-cyan-900 hover:bg-cyan-400",
      l3: "bg-cyan-400 border-cyan-600 text-white hover:bg-cyan-500",
      l4: "bg-cyan-500 border-cyan-700 text-white hover:bg-cyan-600"
    },
    startIndex: 52, endIndex: 62
  },
  {
    id: 'unit-6', title: "Unité 6 : En Ville & Trajets", titleEn: "Unit 6: In the City & Commuting", description: "Bâtiments, école et moyens de transports.", descriptionEn: "Buildings, schools, and transportation.", colorClass: "bg-pink-500", borderClass: "border-pink-700", textClass: "text-pink-500", hoverClass: "hover:bg-pink-400", lightTextClass: "text-pink-100", bgMutedClass: "bg-pink-700/50",
    shades: {
      l1: "bg-pink-200 border-pink-400 text-pink-800 hover:bg-pink-300",
      l2: "bg-pink-300 border-pink-500 text-pink-900 hover:bg-pink-400",
      l3: "bg-pink-400 border-pink-600 text-white hover:bg-pink-500",
      l4: "bg-pink-500 border-pink-700 text-white hover:bg-pink-600"
    },
    startIndex: 62, endIndex: 72
  },
  {
    id: 'unit-7', title: "Unité 7 : Achats & Vêtements", titleEn: "Unit 7: Shopping & Clothes", description: "Couleurs, vêtements et argent.", descriptionEn: "Colors, clothes, and money.", colorClass: "bg-yellow-500", borderClass: "border-yellow-700", textClass: "text-yellow-500", hoverClass: "hover:bg-yellow-400", lightTextClass: "text-yellow-100", bgMutedClass: "bg-yellow-700/50",
    shades: {
      l1: "bg-yellow-200 border-yellow-400 text-yellow-800 hover:bg-yellow-300",
      l2: "bg-yellow-300 border-yellow-500 text-yellow-900 hover:bg-yellow-400",
      l3: "bg-yellow-400 border-yellow-600 text-yellow-900 hover:bg-yellow-500",
      l4: "bg-yellow-500 border-yellow-700 text-yellow-900 hover:bg-yellow-600"
    },
    startIndex: 72, endIndex: 82
  },
  {
    id: 'unit-8', title: "Unité 8 : Description & Famille", titleEn: "Unit 8: Description & Family", description: "Apparence, frères, sœurs et amis.", descriptionEn: "Appearance, siblings, and friends.", colorClass: "bg-indigo-500", borderClass: "border-indigo-700", textClass: "text-indigo-500", hoverClass: "hover:bg-indigo-400", lightTextClass: "text-indigo-100", bgMutedClass: "bg-indigo-700/50",
    shades: {
      l1: "bg-indigo-200 border-indigo-400 text-indigo-800 hover:bg-indigo-300",
      l2: "bg-indigo-300 border-indigo-500 text-indigo-900 hover:bg-indigo-400",
      l3: "bg-indigo-400 border-indigo-600 text-white hover:bg-indigo-500",
      l4: "bg-indigo-500 border-indigo-700 text-white hover:bg-indigo-600"
    },
    startIndex: 82, endIndex: 92
  },
  {
    id: 'unit-9', title: "Unité 9 : Santé & Émotions", titleEn: "Unit 9: Health & Emotions", description: "Docteur, tristesse, douleur et joie.", descriptionEn: "Doctor, sadness, pain, and joy.", colorClass: "bg-rose-500", borderClass: "border-rose-700", textClass: "text-rose-500", hoverClass: "hover:bg-rose-400", lightTextClass: "text-rose-100", bgMutedClass: "bg-rose-700/50",
    shades: {
      l1: "bg-rose-200 border-rose-400 text-rose-800 hover:bg-rose-300",
      l2: "bg-rose-300 border-rose-500 text-rose-900 hover:bg-rose-400",
      l3: "bg-rose-400 border-rose-600 text-white hover:bg-rose-500",
      l4: "bg-rose-500 border-rose-700 text-white hover:bg-rose-600"
    },
    startIndex: 92, endIndex: 102
  },
  {
    id: 'unit-10', title: "Unité 10 : Le Grand Bilan A1", titleEn: "Unit 10: The Grand A1 Review", description: "Expressions, habitudes et tests finaux !", descriptionEn: "Expressions, habits, and final tests!", colorClass: "bg-teal-500", borderClass: "border-teal-700", textClass: "text-teal-500", hoverClass: "hover:bg-teal-400", lightTextClass: "text-teal-100", bgMutedClass: "bg-teal-700/50",
    shades: {
      l1: "bg-teal-200 border-teal-400 text-teal-800 hover:bg-teal-300",
      l2: "bg-teal-300 border-teal-500 text-teal-900 hover:bg-teal-400",
      l3: "bg-teal-400 border-teal-600 text-white hover:bg-teal-500",
      l4: "bg-teal-500 border-teal-700 text-white hover:bg-teal-600"
    },
    startIndex: 102, endIndex: 112
  }
];

import { useGlobalSuggestedLesson } from '../lib/useGlobalSuggestedLesson';

export default function LearnClientPage({ lightweightLessons }: { lightweightLessons: any[] }) {
  const data = { lessons: lightweightLessons };
  const router = useRouter();
  const { completedLessons, unlockedLessons, lessonLevels, lessonStars, xp, resetLessonLevel, language, setLanguage, unlockLessonManual, autoDetectLanguage, lastActiveUnitIndex, setLastActiveUnitIndex } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [isWritingConfigModalOpen, setWritingConfigModalOpen] = useState(false);
  const [isPracticeModalOpen, setPracticeModalOpen] = useState(false);
  const levelsScrollRef = useRef<HTMLDivElement>(null);
  const [selectedLesson, setSelectedLesson] = useState<{lesson: any, isCompleted: boolean, unitColor: string, unitBorder: string} | null>(null);
  const [modalLevel, setModalLevel] = useState(0);
  const [cols, setCols] = useState(5);
  const dragRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  const globalSuggested = useGlobalSuggestedLesson(lightweightLessons);
  const suggestedLessonId = globalSuggested?.type === 'learn' ? globalSuggested.id : null;

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
    if (mounted) {
      const el = document.getElementById(`unit-tab-${activeUnitIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [mounted, activeUnitIndex]);

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
      <header className="bg-[#FAFAFA]/95 backdrop-blur-sm z-50 h-[3.75rem] md:hidden">
        <div className="flex items-center justify-between w-full h-full px-4 md:px-8 gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm md:hidden">
              <BookOpen size={20} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight md:hidden">ThaiLearn</h1>
            <button 
              onClick={() => useProgressStore.getState().setShowCommunityModal(true)}
              className="ml-1 text-rose-500 bg-rose-50 p-2 rounded-full hover:bg-rose-100 transition-colors"
            >
              <Heart size={18} fill="currentColor" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {mounted && <PWAInstallButton />}
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
          {UNITS.map((u, i) => {
            const hasSuggestion = globalSuggested?.type === 'learn' && globalSuggested.id && data.lessons.findIndex(l => l.id === globalSuggested.id) >= u.startIndex && data.lessons.findIndex(l => l.id === globalSuggested.id) < u.endIndex;
            return (
            <button
              id={`unit-tab-${i}`}
              key={`nav-m-${u.id}`}
              onClick={() => handleUnitSelect(i)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-sm relative ${
                i === activeUnitIndex 
                  ? `${u.colorClass} text-white` 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {hasSuggestion && i !== activeUnitIndex && (
                 <span className="absolute top-0 right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full"></span>
              )}
              {language === 'en' ? `Unit ${i + 1}` : `Unité ${i + 1}`}
            </button>
          )})}
        </div>

        {(() => {
          const unit = UNITS[activeUnitIndex];
          const unitLessons = data.lessons.slice(unit.startIndex, unit.endIndex);
          const maxLevelsInUnit = unitLessons.length * 10;
          const completedLevelsInUnit = mounted ? unitLessons.reduce((acc, l) => acc + (lessonLevels[l.id] || 0), 0) : 0;
          const progressPercent = mounted ? (completedLevelsInUnit / maxLevelsInUnit) * 100 : 0;
          
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
                        <span>{completedLevelsInUnit} / {maxLevelsInUnit} {language === 'en' ? 'levels' : 'niveaux'}</span>
                      </div>
                      <div className="text-white/70 text-xs font-medium px-1">
                        {language === 'en' ? '10 levels per lesson = Total mastery' : '10 niveaux par leçon = Maîtrise totale'}
                      </div>
                    </div>
                    <div className="w-full bg-black/15 rounded-full h-4 overflow-hidden mb-2 shadow-inner">
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
                   const globalIndex = unit.startIndex + idx;
                   const level = mounted ? (lessonLevels[lesson.id] || 0) : 0;
                   // All lessons are fully unlocked horizontally
                   const isUnlocked = true;
                   const isMaxLevel = level >= 10;

                   const showLineToNext = idx < unitLessons.length - 1;
                   const lineToNextColor = level > 0 ? unit.colorClass : "bg-slate-200";

                   return (
                     <div id={`mobile-lesson-${lesson.id}`} key={`mobile-node-${lesson.id}`} className="relative flex flex-col items-center w-full scroll-mt-24 z-10 mb-8 sm:mb-12 group">
                        {/* Circle Node */}
                        <div 
                          className={`relative shrink-0 mb-4 z-10 cursor-pointer hover:scale-105 active:scale-95 transition-all`}
                          onClick={() => {
                            setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                            setModalLevel(Math.min(level, 9));
                          }}
                        >
                          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-b-[6px] relative z-10 text-4xl sm:text-5xl font-thai shadow-sm overflow-hidden
                            ${isMaxLevel 
                              ? unit.colorClass + ' text-white ' + unit.borderClass 
                              : level >= 8 ? unit.shades.l4 : level >= 6 ? unit.shades.l3 : level >= 3 ? unit.shades.l2 : level >= 1 ? unit.shades.l1
                              : 'bg-white ' + unit.textClass + ' border-slate-200 border-2 active:border-b-2 active:translate-y-1'}`}
                          >
                            {lesson.imageUrl ? (
                              <>
                                <Image src={lesson.imageUrl} alt={lesson.title} fill className={`object-cover ${level === 0 && suggestedLessonId !== lesson.id ? 'grayscale opacity-70' : ''}`} sizes="(max-width: 640px) 5rem, 6rem" />
                                {isMaxLevel && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20"><CheckCircle size={40} className="stroke-[3] text-white" /></div>}
                              </>
                            ) : (
                              isMaxLevel ? <CheckCircle size={40} className="stroke-[3]" /> : level > 0 ? <CheckCircle size={40} className="stroke-current stroke-[2.5]" /> : lesson.isReview ? <Star size={40} className="fill-current stroke-current" /> : <Play size={40} className="ml-1 fill-current stroke-[2]" />
                            )}
                          </div>
                        </div>
                        
                        {/* Card */}
                        <div 
                          className={`w-full max-w-[280px] sm:max-w-[320px] rounded-[1.5rem] p-5 flex flex-col items-center text-center transition-all z-10 border-2 border-b-[6px] cursor-pointer active:translate-y-[4px] active:border-b-2 shadow-sm relative ${isMaxLevel ? 'bg-emerald-50 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : suggestedLessonId === lesson.id ? 'bg-white border-amber-300 shadow-[0_0_15px_rgba(252,211,77,0.5)]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                          onClick={() => {
                            setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                            setModalLevel(Math.min(level, 9));
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
                             {mounted && language === 'en' ? (lesson.titleEn || lesson.title) : lesson.title}
                           </h4>
                           <span className={`text-sm font-bold mt-1 tracking-wide text-slate-500`}>
                             {mounted && language === 'en' ? (lesson.descriptionEn || lesson.description) : lesson.description}
                           </span>
                           
                           {/* Lesson Progress Bar (Out of 10) */}
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
                                   <span className={unit.textClass}>{level}/10</span>
                                 </div>
                                 <div className="flex justify-between gap-[2px] w-full">
                                   {Array.from({length: 10}).map((_, i) => (
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
              const unitLessons = data.lessons.slice(unit.startIndex, unit.endIndex);
              const maxLevelsInUnit = unitLessons.length * 10;
              const completedLevelsInUnit = mounted ? unitLessons.reduce((acc, l) => acc + (lessonLevels[l.id] || 0), 0) : 0;
              const progressPercent = mounted ? (completedLevelsInUnit / maxLevelsInUnit) * 100 : 0;
              
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
                          <div className={`flex flex-col mb-3`}>
                            <div className={`text-sm ${unit.lightTextClass} font-bold mb-1 flex justify-between`}>
                              <span>{language === 'en' ? 'Mastery' : 'Maîtrise'}</span>
                              <span>{completedLevelsInUnit} / {maxLevelsInUnit} {language === 'en' ? 'levels' : 'niveaux'}</span>
                            </div>
                            <div className={`text-xs ${unit.lightTextClass} opacity-80 font-medium`}>
                              {language === 'en' ? '10 levels per lesson = Total mastery' : '10 niveaux par leçon = Maîtrise totale'}
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
                       const globalIndex = unit.startIndex + idx;
                       const level = lessonLevels[lesson.id] || 0;
                       const isUnlocked = true;
                       
                       const showLineToNext = idx < unitLessons.length - 1;
                       const lineToNextColor = level > 0 ? unit.colorClass : "bg-slate-200";
                       
                       const isMaxLevel = level >= 10;

                       return (
                         <div id={`desktop-lesson-${lesson.id}`} key={`desktop-node-${lesson.id}`} className="relative flex items-center w-full z-10 gap-6 md:gap-8 min-h-[8.5rem] py-3 group">
                            {/* Circle Node */}
                            <div 
                              className={`relative shrink-0 py-6 cursor-pointer hover:brightness-95 hover:scale-105 active:scale-95 transition-all`}
                              onClick={() => {
                                setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                setModalLevel(Math.min(level, 9));
                              }}
                            >
                              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center border-b-[6px] relative z-10 transition-transform overflow-hidden ${isMaxLevel ? unit.colorClass + ' text-white ' + unit.borderClass : level >= 8 ? unit.shades.l4 : level >= 6 ? unit.shades.l3 : level >= 3 ? unit.shades.l2 : level >= 1 ? unit.shades.l1 : 'bg-white ' + unit.textClass + ' border-slate-200 border-2 active:border-b-2 active:translate-y-1'}`}>
                                {(lesson as any).imageUrl ? (
                                  <>
                                    <Image src={(lesson as any).imageUrl} alt={lesson.title} fill className={`object-cover ${level === 0 && suggestedLessonId !== lesson.id ? 'grayscale opacity-70' : ''}`} sizes="(max-width: 768px) 4rem, 5rem" />
                                    {isMaxLevel && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20"><CheckCircle size={32} className="stroke-[3] text-white" /></div>}
                                  </>
                                ) : (
                                  isMaxLevel ? <CheckCircle size={32} className="stroke-[3]" /> : <Play size={32} className="ml-1 fill-current stroke-[2]" />
                                )}
                              </div>
                              
                              {showLineToNext && (
                                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-2.5 h-full ${lineToNextColor} z-0`}></div>
                              )}
                            </div>
                            
                            {/* Horizontal Card */}
                            <div 
                              className={`flex-1 rounded-[1.5rem] border-2 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all group border-b-[6px] cursor-pointer active:translate-y-[4px] active:border-b-2 shadow-sm relative ${isMaxLevel ? 'bg-emerald-50 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : suggestedLessonId === lesson.id ? 'bg-white border-amber-300 shadow-[0_0_15px_rgba(252,211,77,0.5)]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                              onClick={() => {
                                setSelectedLesson({lesson, isCompleted: isMaxLevel, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                setModalLevel(Math.min(level, 9));
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
                                   {language === 'en' ? (lesson.titleEn || lesson.title) : lesson.title}
                                 </h4>
                                 <span className={`text-sm font-bold mt-1 tracking-wide text-slate-500`}>
                                   {language === 'en' ? (lesson.descriptionEn || lesson.description) : lesson.description}
                                 </span>
                               </div>
                               
                               {/* Lesson Progress Bar (Out of 10) desktop */}
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
                                       <span className={unit.textClass}>{level}/10</span>
                                     </div>
                                     <div className="flex justify-between gap-[2px] w-full">
                                       {Array.from({length: 10}).map((_, i) => (
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
                                 className="px-8 py-4 rounded-2xl bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-600 font-extrabold shadow-sm transition-all text-center border-2 border-amber-200 border-b-4 active:border-b-2 active:translate-y-1 text-lg w-full max-w-[280px]"
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
          
          <DesktopSidebarRight 
            units={UNITS}
            activeUnitIndex={activeUnitIndex}
            onUnitSelect={handleUnitSelect}
            language={language}
            globalSuggested={globalSuggested}
            lessons={data.lessons}
            lessonLevels={lessonLevels}
            mounted={mounted}
            maxLevelPerLesson={10}
            suggestionType="learn"
          />
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
                    {selectedLesson.lesson.isReview 
                      ? (language === 'en' ? 'Review Test' : 'Test Bilan') 
                      : (language === 'en' ? 'Lesson' : 'Leçon')}
                  </p>
                  <h3 className="text-2xl font-extrabold mb-1 pr-6">
                    {language === 'en' ? (selectedLesson.lesson.titleEn || selectedLesson.lesson.title) : selectedLesson.lesson.title}
                  </h3>
                  <p className="text-white/90 font-medium text-sm mb-4">
                    {language === 'en' ? (selectedLesson.lesson.descriptionEn || selectedLesson.lesson.description) : selectedLesson.lesson.description}
                  </p>

                  <div className="flex items-center gap-3 w-full">
                     <div className="bg-white/20 text-white rounded-full px-3 py-1 flex items-center gap-1.5 text-sm font-bold shrink-0">
                        <CheckCircle size={14} className="stroke-[3]" />
                        {lessonLevels[selectedLesson.lesson.id] || 0}/10 {language === 'en' ? 'levels' : 'niveaux'}
                     </div>
                     <div className="h-2 flex-1 bg-black/15 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${((lessonLevels[selectedLesson.lesson.id] || 0) / 10) * 100}%` }}></div>
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
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((levelIndex) => {
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
                        disabled={modalLevel === 9 || modalLevel >= (lessonLevels[selectedLesson.lesson.id] || 0)} 
                        onClick={() => {
                           setModalLevel(Math.min(9, modalLevel + 1));
                           levelsScrollRef.current?.scrollBy({ left: 84, behavior: 'smooth' });
                        }}
                     >
                        <ChevronRight size={20}/>
                     </button>
                  </div>
                  
                  {(() => {
                    const wordCount = selectedLesson.lesson.words?.length || 0;
                    const stepsCount = 10 + wordCount + (selectedLesson.lesson.phrases?.length || 0);
                    let secsPerStep = 5;
                    if (modalLevel <= 1) secsPerStep = 5;
                    else if (modalLevel <= 3) secsPerStep = 7;
                    else if (modalLevel <= 6) secsPerStep = 10;
                    else if (modalLevel === 7) secsPerStep = 20;
                    else secsPerStep = 40;
                    
                    let estimatedSecs = stepsCount * secsPerStep;
                    let estimatedMins = Math.ceil(estimatedSecs / 60);
                    if (modalLevel === 9) estimatedMins = Math.max(30, estimatedMins);
                    else estimatedMins = Math.max(1, estimatedMins);
                    
                    return (
                      <div className="mb-2">
                        <div className="flex flex-row gap-2 mb-6">
                           <div className="flex-1 bg-blue-50/50 rounded-2xl p-3 flex items-center gap-2 border border-blue-100 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                                <BookOpen size={16} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-blue-500 text-[10px] font-bold mb-0.5 uppercase tracking-wider truncate">{language === 'en' ? 'Vocab' : 'Vocabulaire'}</div>
                                <div className="text-blue-900 font-extrabold text-sm sm:text-base truncate">{wordCount} {language === 'en' ? 'words' : 'mots'}</div>
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
                           <h4 className="border-b text-slate-500 font-bold mb-3 pb-2 flex text-sm">{language === 'en' ? 'Vocabulary preview' : 'Aperçu du vocabulaire'}</h4>
                           <div className="flex flex-nowrap overflow-x-auto hide-scrollbar gap-2 pb-2">
                               {selectedLesson.lesson.words?.map((w: any) => (
                                  <button onClick={() => playThaiTTS(w.th)} key={w.id} className="shrink-0 bg-white border-2 border-slate-100 rounded-xl px-3 py-1.5 flex items-center justify-center gap-2 font-thai text-xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer active:scale-95">
                                     {w.th} <Volume2 size={16} className="text-slate-300"/>
                                  </button>
                               ))}
                           </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                <div className="shrink-0 p-6 pt-2 bg-white/90 backdrop-blur border-t border-slate-50 flex flex-col gap-3">
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
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
      <WritingConfigModal isOpen={isWritingConfigModalOpen} onClose={() => setWritingConfigModalOpen(false)} />
    </div>
  );
}
