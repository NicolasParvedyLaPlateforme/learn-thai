'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProgressStore } from '../lib/store';
import { ArrowLeft, MessageCircle, Star, BookOpen } from 'lucide-react';
import conversationsData from '../data/conversations.json';

export default function ConversationsPage() {
  const [mounted, setMounted] = useState(false);
  const { language, xp, setLanguage } = useProgressStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight md:hidden">
              {language === 'en' ? 'Dialogs' : 'Discussions'}
            </h1>
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

      <main className="max-w-2xl mx-auto px-4 mt-8 flex flex-col gap-6">
        <p className="text-slate-500 font-medium pb-4 border-b-2 border-slate-100">
          {language === 'en' 
            ? 'Practice real dialogues based on the units you learned.' 
            : 'Pratiquez de vrais dialogues selon les unités apprises.'}
        </p>

        {conversationsData.conversations.map(conv => {
          return (
            <Link 
              key={conv.id} 
              href={`/conversations/${conv.id}`}
              className="bg-white p-6 rounded-3xl border-2 border-slate-200 border-b-4 hover:-translate-y-1 hover:border-orange-300 transition-all flex items-center gap-6"
            >
              <div className="bg-orange-100 text-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0">
                <MessageCircle size={32} />
              </div>
              <div>
                <div className="text-sm font-bold text-orange-500 mb-1 uppercase tracking-wide">
                  {language === 'en' ? 'Conversation' : `Niveau ${conv.level}`}
                </div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  {language === 'en' && conv.titleEn ? conv.titleEn : conv.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
