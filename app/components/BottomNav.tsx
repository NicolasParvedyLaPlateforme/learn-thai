'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, MessageCircle, Brain, Pencil, X } from 'lucide-react';
import { useProgressStore } from '../lib/store';
import { WritingConfigModal } from './WritingConfigModal';

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useProgressStore();
  const [isPracticeModalOpen, setPracticeModalOpen] = useState(false);
  const [isWritingConfigModalOpen, setWritingConfigModalOpen] = useState(false);

  // Define visibility logic
  const isLearnActive = pathname === '/learn';
  const isAlphabetActive = pathname === '/alphabet';
  const isConversationsActive = pathname === '/conversations';
  
  const isVisible = isLearnActive || isAlphabetActive || isConversationsActive;

  if (!isVisible) return null;

  return (
    <>
      <WritingConfigModal isOpen={isWritingConfigModalOpen} onClose={() => setWritingConfigModalOpen(false)} />

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
        <button onClick={() => setPracticeModalOpen(true)} className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-600 transition-colors">
          <Brain size={24} className="mb-1" />
          <span className="text-[10px] font-bold">{language === 'en' ? 'Practice' : 'Pratique'}</span>
        </button>
      </nav>

      {/* Mobile Practice Modal */}
      {isPracticeModalOpen && (
        <div 
          className="md:hidden fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm transition-all"
          onClick={() => setPracticeModalOpen(false)}
        >
          <div 
            className="w-full bg-[#FAFAFA] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col pt-3 pb-8 px-4 animate-in slide-in-from-bottom-full duration-300 relative border-t-2 border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-2xl font-extrabold text-slate-800">
                {language === 'en' ? 'Practice' : 'Pratique'}
              </h3>
              <button 
                onClick={() => setPracticeModalOpen(false)} 
                className="bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full p-2 transition-colors"
               >
                 <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link href="/review" className="flex items-center gap-4 p-4 bg-white border-2 border-slate-200 border-b-4 rounded-2xl active:translate-y-1 active:border-b-2 transition-all">
                <div className="bg-indigo-100 text-indigo-500 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                  <Brain size={28} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-800 text-lg">{language === 'en' ? 'Review' : 'Rappel'}</span>
                  <span className="text-sm text-slate-500 font-medium">{language === 'en' ? 'Test your memory' : 'Testez votre mémoire'}</span>
                </div>
              </Link>
              
              <Link href="/review-pairs" className="flex items-center gap-4 p-4 bg-white border-2 border-slate-200 border-b-4 rounded-2xl active:translate-y-1 active:border-b-2 transition-all">
                <div className="bg-fuchsia-100 text-fuchsia-500 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen size={28} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-800 text-lg">{language === 'en' ? 'Pairs' : 'Paires'}</span>
                  <span className="text-sm text-slate-500 font-medium">{language === 'en' ? 'Match words' : 'Associez les mots'}</span>
                </div>
              </Link>

              <button 
                onClick={() => {
                  setPracticeModalOpen(false);
                  setWritingConfigModalOpen(true);
                }}
                className="flex items-center gap-4 p-4 bg-white border-2 border-slate-200 border-b-4 rounded-2xl active:translate-y-1 active:border-b-2 transition-all text-left"
              >
                <div className="bg-sky-100 text-sky-500 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                  <Pencil size={28} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-800 text-lg">{language === 'en' ? 'Writing' : 'Écriture'}</span>
                  <span className="text-sm text-slate-500 font-medium">{language === 'en' ? 'Practice writing' : 'Pratiquez l\'écriture'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
