'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, MessageCircle, Brain, Globe, Star } from 'lucide-react';
import { useProgressStore } from '../lib/store';

export default function DesktopSidebarLeft() {
  const pathname = usePathname();
  const { language, setLanguage, xp, completedLessons, isExerciseRunning } = useProgressStore();

  // Hidden on routes where we don't want the app shell
  const isLearnActive = pathname === '/learn';
  const isAlphabetActive = pathname === '/alphabet';
  const isConversationsActive = pathname === '/conversations';
  const isReviewActive = pathname === '/review';
  const isPairsActive = pathname === '/review-pairs';
  const isPracticeActive = pathname === '/practice';
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Decide whether to show navigation
  const isVisible = (isLearnActive || isAlphabetActive || isConversationsActive || isReviewActive || isPairsActive || pathname === '/writing' || isPracticeActive) && !isExerciseRunning;

  if (!isVisible || !mounted) return null;

  // Compute a simple level based on completed lessons 
  const userLevel = Math.floor(completedLessons.length / 5) + 1;
  const levelTitle = userLevel < 5 ? (language === 'en' ? 'Beginner' : 'Débutant') : userLevel < 10 ? 'Intermediate' : 'Advanced';

  return (
    <>
      {/* Spacer for desktop layout so content doesn't get hidden behind absolute sidebar depending on setup we want */}
      <div className="hidden md:block w-20 xl:w-64 shrink-0 transition-all duration-300 ease-in-out"></div>

      <nav 
        className="hidden md:flex fixed top-0 left-0 h-screen bg-[#F0FDF4] border-r border-emerald-100 flex-col py-6 transition-all duration-300 ease-in-out z-50 shadow-sm w-20 px-2 hover:w-64 hover:px-4 xl:w-64 xl:px-4 group"
      >
        <div className="flex items-center gap-3 mb-10 overflow-hidden shrink-0 px-2 justify-center group-hover:justify-start xl:justify-start relative">
          <div className="bg-emerald-500 text-white p-2 rounded-xl shrink-0 absolute left-1/2 -translate-x-1/2 transition-all duration-300 xl:translate-x-0 xl:relative xl:left-auto group-hover:translate-x-0 group-hover:relative group-hover:left-auto">
            <BookOpen size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight whitespace-nowrap transition-opacity duration-300 opacity-0 group-hover:opacity-100 xl:opacity-100 xl:ml-2 group-hover:ml-2">
            ThaiLearn
          </h1>
        </div>

        <div className="flex flex-col gap-2 flex-1 w-full">
          <NavItem href="/learn" icon={<BookOpen size={24} />} label={language === 'en' ? 'Home' : 'Accueil'} active={isLearnActive} />
          <NavItem href="/alphabet" icon={<Globe size={24} />} label="Alphabet" active={isAlphabetActive} />
          <NavItem href="/conversations" icon={<MessageCircle size={24} />} label={language === 'en' ? 'Discussions' : 'Discussions'} active={isConversationsActive} />
          <NavItem href="/practice" icon={<Brain size={24} />} label={language === 'en' ? 'Practice' : 'Pratique'} active={isPracticeActive} />
        </div>

        {/* User Summary / Level */}
        <div className="mt-auto shrink-0 border-t border-emerald-200/60 pt-6 overflow-hidden flex flex-col items-center gap-4 px-0 group-hover:px-2 xl:px-2 transition-all">
          <div className="flex items-center group-hover:gap-3 xl:gap-3 justify-center group-hover:justify-start xl:justify-start w-full transition-all">
            <div className="shrink-0 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold relative w-12 h-12 transition-all">
              U
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <div className="bg-emerald-500 w-3 h-3 rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col whitespace-nowrap transition-all duration-300 overflow-hidden opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto xl:opacity-100 xl:w-auto">
              <span className="font-bold text-slate-800">Level {userLevel}</span>
              <span className="text-xs text-slate-500 font-medium">
                {completedLessons.length} {language === 'en' ? 'lessons' : 'leçons terminées'}
              </span>
            </div>
          </div>
          
          <div className="bg-amber-100 text-amber-600 font-bold rounded-2xl shadow-sm w-full h-12 shrink-0 flex items-center justify-center whitespace-nowrap px-0 group-hover:px-4 xl:px-4 group overflow-hidden border border-amber-200">
            <span className="transition-all duration-300 overflow-hidden opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto xl:opacity-100 xl:w-auto flex items-center gap-2">
              <Star size={18} fill="currentColor" />
              {xp} XP {language === 'en' ? 'Earned' : 'Gagnés'}
            </span>
            <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 group-hover:opacity-0 group-hover:w-0 xl:opacity-0 xl:w-0 overflow-hidden shrink-0 relative">
               <Star size={24} fill="currentColor" />
               <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white" style={{ marginTop: '2px' }}>{xp > 99 ? '99+' : xp}</span>
            </div>
          </div>

          <button 
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="mt-2 w-full h-10 flex items-center justify-center rounded-xl font-bold border-2 border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors shadow-sm overflow-hidden px-0 group-hover:px-3 xl:px-3"
            title={language === 'fr' ? "Switch to English" : "Passer en Français"}
          >
            <span className="transition-all duration-300 overflow-hidden opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto xl:opacity-100 xl:w-auto mr-0 group-hover:mr-2 xl:mr-2 text-sm whitespace-nowrap">
              {language === 'fr' ? 'Langue' : 'Language'}
            </span>
            <div className="flex items-center justify-center shrink-0 w-6 h-6 bg-slate-200 text-slate-700 rounded text-xs">
              {language === 'fr' ? 'FR' : 'EN'}
            </div>
          </button>
        </div>
      </nav>
    </>
  );
}

function NavItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center rounded-xl transition-all h-12 overflow-hidden w-12 mx-auto justify-center group-hover:w-full group-hover:justify-start group-hover:px-4 group-hover:gap-4 xl:gap-4 xl:w-full xl:justify-start xl:px-4 ${active ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-600 font-medium hover:bg-emerald-50 hover:text-emerald-700'}`}
    >
      <div className={`shrink-0 flex items-center justify-center w-6 h-6 transition-transform duration-300 ${active ? 'scale-110 group-hover:scale-100 xl:scale-100' : ''}`}>{icon}</div>
      <span className="whitespace-nowrap transition-all duration-300 overflow-hidden opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto xl:opacity-100 xl:w-auto">
        {label}
      </span>
    </Link>
  );
}
