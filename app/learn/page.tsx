'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '../lib/store';
import courseData from '../data/course.json';
import { BookOpen, CheckCircle, Star, Play, Crown, RotateCcw, Pencil, X } from 'lucide-react';
import { CourseData, Lesson } from '../types';

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
  const { completedLessons, lessonLevels, xp, resetLessonLevel, language, setLanguage } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{lesson: Lesson, isCompleted: boolean, unitColor: string, unitBorder: string} | null>(null);
  const [modalLevel, setModalLevel] = useState(0);
  const [cols, setCols] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 pb-20 overflow-hidden">
      
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-50 px-4 md:px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto flex-1 gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-white p-2 rounded-xl">
              <BookOpen size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden md:block">ThaiLearn</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 font-bold">
            <Link href="/alphabet" className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <span className="font-extrabold text-lg sm:text-xl leading-none">A</span>
              <span className="hidden sm:block">Alphabet</span>
            </Link>
            <Link href="/review" className="text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <RotateCcw size={18} />
              <span className="hidden sm:inline">Rappel</span>
            </Link>
            <Link href="/review-pairs" className="text-fuchsia-500 hover:text-fuchsia-600 bg-fuchsia-50 hover:bg-fuchsia-100 px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <BookOpen size={18} />
              <span className="hidden sm:inline">{mounted && language === 'en' ? 'Pairs' : 'Paires'}</span>
            </Link>
            <Link href="/writing" className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <Pencil size={18} />
              <span className="hidden sm:inline">{mounted && language === 'en' ? "Writing" : "Écriture"}</span>
            </Link>
            
            {/* Language Switcher */}
            {mounted && (
              <button 
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="ml-2 w-10 h-10 flex flex-col items-center justify-center rounded-xl font-bold border-2 border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors shadow-sm"
                title={language === 'fr' ? "Switch to English" : "Passer en Français"}
              >
                {language === 'fr' ? 'FR' : 'EN'}
              </button>
            )}

            <div className="flex items-center gap-1 text-rose-500 text-base sm:text-lg">
              <Star size={20} className="fill-rose-500 sm:w-[22px] sm:h-[22px]" />
              <span>{mounted ? xp : 0}<span className="ml-1 hidden sm:inline">XP</span></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 mt-8 flex flex-col gap-12">
        {UNITS.map((unit) => {
          const unitLessons = data.lessons.slice(unit.startIndex, unit.endIndex);
          const completedInUnit = unitLessons.filter(l => completedLessons.includes(l.id)).length;
          const progressPercent = mounted ? (completedInUnit / unitLessons.length) * 100 : 0;
          
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
                          const globalIndex = unit.startIndex + itemIndex;
                          const isCompleted = mounted ? completedLessons.includes(lesson.id) : false;
                          const level = mounted ? (lessonLevels[lesson.id] || 0) : 0;
                          const isUnlocked = globalIndex === 0 || (mounted && completedLessons.includes(data.lessons[globalIndex - 1].id));
                          
                          const isLastOverall = itemIndex === unitLessons.length - 1;
                          const isLastInRow = indexInRow === row.length - 1;
                          
                          const pathRight = !isLastOverall && !isLastInRow && rIndex % 2 === 0;
                          const pathLeft = !isLastOverall && !isLastInRow && rIndex % 2 === 1;
                          const pathDown = !isLastOverall && isLastInRow;

                          const nextGlobalIndex = globalIndex + 1;
                          const nextUnlocked = nextGlobalIndex < data.lessons.length && (mounted && completedLessons.includes(data.lessons[nextGlobalIndex - 1].id));
                          
                          const pathColorClass = (isUnlocked && nextUnlocked) ? unit.colorClass : "bg-slate-200";

                          return (
                            <div key={lesson.id} className="relative py-6 md:py-8" style={{ flex: `0 0 ${100 / cols}%` }}>
                              
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
                                    if (isUnlocked) {
                                      e.preventDefault();
                                      setSelectedLesson({lesson, isCompleted, unitColor: unit.colorClass, unitBorder: unit.borderClass});
                                      setModalLevel(Math.min(lessonLevels[lesson.id] || 0, 4));
                                    }
                                  }}
                                  className="group flex flex-col items-center relative z-10"
                                >
                                  
                                  {/* Tooltip on hover */}
                                  <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-3 rounded-2xl shadow-xl border-2 border-slate-200 whitespace-nowrap z-50 pointer-events-none">
                                    <p className="font-extrabold text-slate-800 uppercase tracking-wide text-sm flex items-center gap-2">
                                      {mounted && language === 'en' ? (lesson.titleEn || lesson.title) : lesson.title}
                                      {lesson.isReview && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px]">TEST</span>}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                      {mounted && language === 'en' ? (lesson.descriptionEn || lesson.description) : lesson.description}
                                    </p>
                                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-200 rotate-45"></div>
                                  </div>

                                  <div className="relative">
                                    <div className={
                                      `w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center border-b-[6px] transition-transform shadow-sm relative z-0
                                      ${level >= 5
                                        ? unit.shades.l4
                                        : level === 4 || level === 3
                                          ? unit.shades.l3
                                          : level === 2
                                            ? unit.shades.l2
                                            : level === 1
                                              ? unit.shades.l1
                                              : isUnlocked 
                                                ? `bg-white border-2 border-slate-200 ${unit.textClass} hover:bg-slate-50 active:translate-y-1 active:border-b-2` 
                                                : 'bg-slate-100 border-2 border-slate-200 text-slate-300 shadow-none pointer-events-none cursor-not-allowed'}`
                                    }>
                                      {lesson.isReview ? (
                                        <Star size={40} className={level > 0 || isUnlocked ? `fill-current stroke-current` : `stroke-slate-300 stroke-[2.5]`} />
                                      ) : (
                                        level >= 5 ? <Crown size={40} className="stroke-current stroke-[2.5]" fill="currentColor" /> :
                                        level > 0 ? <CheckCircle size={40} className="stroke-current stroke-[2.5]" /> : <Play size={40} className="ml-1 fill-current stroke-current" />
                                      )}
                                    </div>

                                    {/* Crown/Level Badge */}
                                    {(level > 0 && level <= 7) && (
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
                  {[0, 1, 2, 3, 4, 5, 6].map((levelIndex) => {
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
        </div>
      )}

    </div>
  );
}
