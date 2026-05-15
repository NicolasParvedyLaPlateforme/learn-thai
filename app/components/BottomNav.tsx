'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, MessageCircle, Brain } from 'lucide-react';
import { useProgressStore } from '../lib/store';

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useProgressStore();

  // Define visibility logic
  const isLearnActive = pathname === '/learn';
  const isAlphabetActive = pathname === '/alphabet';
  const isConversationsActive = pathname === '/conversations';
  const isPracticeActive = pathname === '/practice';
  
  const isVisible = isLearnActive || isAlphabetActive || isConversationsActive || isPracticeActive;

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex justify-around items-center h-[72px] pb-[env(safe-area-inset-bottom)]">
        <Link href="/learn" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isLearnActive ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <BookOpen size={24} className={isLearnActive ? 'fill-emerald-100 mb-1' : 'mb-1'} />
          <span className="text-[10px] font-bold">{language === 'en' ? 'Path' : 'Parcours'}</span>
        </Link>
        <Link href="/alphabet" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isAlphabetActive ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <div className="w-6 h-6 flex items-center justify-center font-black text-xl mb-1">A</div>
          <span className="text-[10px] font-bold">Alphabet</span>
        </Link>
        <Link href="/conversations" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isConversationsActive ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <MessageCircle size={24} className={isConversationsActive ? 'fill-emerald-100 mb-1' : 'mb-1'} />
          <span className="text-[10px] font-bold">{language === 'en' ? 'Dialogs' : 'Dialogues'}</span>
        </Link>
        <Link href="/practice" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isPracticeActive ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <Brain size={24} className={isPracticeActive ? 'fill-emerald-100 mb-1' : 'mb-1'} />
          <span className="text-[10px] font-bold">{language === 'en' ? 'Practice' : 'Pratique'}</span>
        </Link>
      </nav>
    </>
  );
}
