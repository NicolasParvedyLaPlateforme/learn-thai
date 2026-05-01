'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProgressStore } from './lib/store';
import courseData from './data/course.json';
import { BookOpen, CheckCircle, Flame, Star, Play, Crown, RotateCcw, Pencil } from 'lucide-react';
import { CourseData } from './types';

const data = courseData as CourseData;

const UNITS = [
  {
    id: 'unit-1', title: "Unité 1 : Les bases", description: "Commencez votre voyage en thaï !", colorClass: "bg-emerald-500", borderClass: "border-emerald-700", textClass: "text-emerald-500", hoverClass: "hover:bg-emerald-400", lightTextClass: "text-emerald-100", bgMutedClass: "bg-emerald-700/50",
    startIndex: 0, endIndex: 11
  },
  {
    id: 'unit-2', title: "Unité 2 : Vie quotidienne", description: "Se déplacer, se repérer et communiquer davantage.", colorClass: "bg-blue-500", borderClass: "border-blue-700", textClass: "text-blue-500", hoverClass: "hover:bg-blue-400", lightTextClass: "text-blue-100", bgMutedClass: "bg-blue-700/50",
    startIndex: 11, endIndex: 20
  },
  {
    id: 'unit-3', title: "Unité 3 : Nourriture & Boissons", description: "Saveurs, viandes et commander au restaurant.", colorClass: "bg-orange-500", borderClass: "border-orange-700", textClass: "text-orange-500", hoverClass: "hover:bg-orange-400", lightTextClass: "text-orange-100", bgMutedClass: "bg-orange-700/50",
    startIndex: 20, endIndex: 25
  },
  {
    id: 'unit-4', title: "Unité 4 : Verbes d'action", description: "Regarder, jouer, travailler et apprendre.", colorClass: "bg-purple-500", borderClass: "border-purple-700", textClass: "text-purple-500", hoverClass: "hover:bg-purple-400", lightTextClass: "text-purple-100", bgMutedClass: "bg-purple-700/50",
    startIndex: 25, endIndex: 30
  },
  {
    id: 'unit-5', title: "Unité 5 : Le temps & Météo", description: "Jours, heures, pluie et chaleur.", colorClass: "bg-cyan-500", borderClass: "border-cyan-700", textClass: "text-cyan-500", hoverClass: "hover:bg-cyan-400", lightTextClass: "text-cyan-100", bgMutedClass: "bg-cyan-700/50",
    startIndex: 30, endIndex: 35
  },
  {
    id: 'unit-6', title: "Unité 6 : En Ville & Trajets", description: "Bâtiments, école et moyens de transports.", colorClass: "bg-pink-500", borderClass: "border-pink-700", textClass: "text-pink-500", hoverClass: "hover:bg-pink-400", lightTextClass: "text-pink-100", bgMutedClass: "bg-pink-700/50",
    startIndex: 35, endIndex: 40
  },
  {
    id: 'unit-7', title: "Unité 7 : Achats & Vêtements", description: "Couleurs, vêtements et argent.", colorClass: "bg-yellow-500", borderClass: "border-yellow-700", textClass: "text-yellow-500", hoverClass: "hover:bg-yellow-400", lightTextClass: "text-yellow-100", bgMutedClass: "bg-yellow-700/50",
    startIndex: 40, endIndex: 45
  },
  {
    id: 'unit-8', title: "Unité 8 : Description & Famille", description: "Apparence, frères, sœurs et amis.", colorClass: "bg-indigo-500", borderClass: "border-indigo-700", textClass: "text-indigo-500", hoverClass: "hover:bg-indigo-400", lightTextClass: "text-indigo-100", bgMutedClass: "bg-indigo-700/50",
    startIndex: 45, endIndex: 50
  },
  {
    id: 'unit-9', title: "Unité 9 : Santé & Émotions", description: "Docteur, tristesse, douleur et joie.", colorClass: "bg-rose-500", borderClass: "border-rose-700", textClass: "text-rose-500", hoverClass: "hover:bg-rose-400", lightTextClass: "text-rose-100", bgMutedClass: "bg-rose-700/50",
    startIndex: 50, endIndex: 55
  },
  {
    id: 'unit-10', title: "Unité 10 : Le Grand Bilan A1", description: "Expressions, habitudes et tests finaux !", colorClass: "bg-teal-500", borderClass: "border-teal-700", textClass: "text-teal-500", hoverClass: "hover:bg-teal-400", lightTextClass: "text-teal-100", bgMutedClass: "bg-teal-700/50",
    startIndex: 55, endIndex: 60
  }
];

export default function Home() {
  const { completedLessons, lessonLevels, xp, resetLessonLevel } = useProgressStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
            <Link href="/review" className="text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <RotateCcw size={18} />
              <span className="hidden sm:inline">Rappel</span>
            </Link>
            <Link href="/writing" className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <Pencil size={18} />
              <span className="hidden sm:inline">Écriture</span>
            </Link>
            <div className="flex items-center gap-1 text-orange-500 text-base sm:text-lg">
              <Flame size={20} className="fill-orange-500 sm:w-[22px] sm:h-[22px]" />
              <span>0</span>
            </div>
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
                  <h2 className="text-3xl font-extrabold mb-2">{unit.title}</h2>
                  <p className={`${unit.lightTextClass} mb-6 font-medium`}>{unit.description}</p>
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

              {/* Lesson Path */}
              <div className="flex justify-center relative -mb-4">
                <div className="flex flex-col items-center gap-6 relative w-full max-w-sm">
                  {/* The Path Line */}
                  <div className="absolute top-8 bottom-8 w-3 bg-slate-200 left-1/2 -translate-x-1/2 -z-10 rounded-full"></div>
                  
                  {unitLessons.map((lesson, index) => {
                    const globalIndex = unit.startIndex + index;
                    const isCompleted = mounted ? completedLessons.includes(lesson.id) : false;
                    const level = mounted ? (lessonLevels[lesson.id] || 0) : 0;
                    const isUnlocked = globalIndex === 0 || (mounted && completedLessons.includes(data.lessons[globalIndex - 1].id));
                    
                    // Slight zig-zag alternating left/right
                    const translateX = index % 2 === 0 ? '-translate-x-8' : 'translate-x-8';
                    const isLastInUnit = index === unitLessons.length - 1;
                    
                    return (
                      <div key={lesson.id} className={`relative z-10 w-full flex justify-center ${translateX}`}>
                        <div className="relative group/lesson">
                          {isCompleted && (
                            <>
                              <div className="absolute top-1/2 -translate-y-1/2 -left-16 flex items-center md:opacity-0 md:group-hover/lesson:opacity-100 z-20 transition-all">
                                <Link
                                  href={`/writing?lessonId=${lesson.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2.5 bg-slate-100 hover:bg-emerald-100 text-slate-400 hover:text-emerald-500 rounded-full transition-all"
                                  title="S'entraîner à écrire"
                                >
                                  <Pencil size={18} />
                                </Link>
                              </div>
                              <div className="absolute top-1/2 -translate-y-1/2 -right-16 flex items-center md:opacity-0 md:group-hover/lesson:opacity-100 z-20 transition-all">
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); resetLessonLevel(lesson.id); }}
                                  className="p-2.5 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-full transition-all"
                                  title="Remettre à zéro"
                                >
                                  <RotateCcw size={18} />
                                </button>
                              </div>
                            </>
                          )}
                          <Link href={isUnlocked ? `/lesson/${lesson.id}` : '#'} className="group flex flex-col items-center">
                            
                            {/* Tooltip on hover */}
                          <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-3 rounded-2xl shadow-xl border-2 border-slate-200 whitespace-nowrap z-50 pointer-events-none">
                            <p className="font-extrabold text-slate-800 uppercase tracking-wide text-sm flex items-center gap-2">
                              {lesson.title}
                              {lesson.isReview && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px]">TEST</span>}
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{lesson.description}</p>
                            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-200 rotate-45"></div>
                          </div>

                          <div className="relative">
                            <div className={
                              `w-24 h-24 rounded-[2rem] flex items-center justify-center border-b-[6px] transition-transform shadow-sm relative z-0
                              ${level >= 4
                                ? `bg-amber-400 border-amber-600 text-white hover:bg-amber-300`
                                : isCompleted 
                                  ? `${unit.colorClass} ${unit.borderClass} text-white ${unit.hoverClass}` 
                                  : isUnlocked 
                                    ? `bg-white border-2 border-slate-200 ${unit.textClass} hover:bg-slate-50 active:translate-y-1 active:border-b-2` 
                                    : 'bg-slate-100 border-2 border-slate-200 text-slate-300 shadow-none pointer-events-none'}`
                            }>
                              {lesson.isReview ? (
                                <Star size={40} className={level > 0 || isUnlocked ? `fill-current stroke-current` : `stroke-slate-300 stroke-[2.5]`} />
                              ) : (
                                level >= 4 ? <Crown size={40} className="stroke-white stroke-[2.5] fill-current" /> :
                                level > 0 ? <CheckCircle size={40} className="stroke-white stroke-[2.5]" /> : <Play size={40} className="ml-1 fill-current stroke-current" />
                              )}
                            </div>

                            {/* Crown/Level Badge */}
                            {(level > 0 && level < 4) && (
                              <div className={`absolute -bottom-2 -right-3 z-20 bg-white border-2 border-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-sm ${unit.textClass}`}>
                                {level}
                              </div>
                            )}
                          </div>
                        </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </main>

    </div>
  );
}
