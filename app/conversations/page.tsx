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

      <main className="max-w-4xl mx-auto space-y-8 mt-8 px-4 md:px-8">
        <header className="mb-10 text-center md:text-left border-b-2 border-slate-100 pb-8 md:border-b-0 md:pb-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
            {language === 'en' ? 'Dialogs' : 'Discussions'}
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto md:mx-0">
            {language === 'en' 
              ? 'Practice real dialogues based on the units you learned.' 
              : 'Pratiquez de vrais dialogues selon les unités apprises.'}
          </p>
        </header>

        <div className="flex flex-col gap-8 max-w-2xl mx-auto md:mx-0 w-full">
          {conversationsData.conversations.map((conv, index) => {
          return (
            <div key={conv.id} className="flex flex-col gap-3">
              <Link 
                href={`/conversations/${conv.id}`}
                className="bg-white p-6 rounded-3xl border-2 border-slate-200 border-b-4 hover:-translate-y-1 hover:border-orange-300 transition-all flex items-center gap-6 group"
              >
                <div className="bg-orange-100 text-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors">
                  <MessageCircle size={32} />
                </div>
                <div>
                  <div className="text-sm font-bold text-orange-500 mb-1 uppercase tracking-wide">
                    {language === 'en' ? `Conversation ${index + 1}` : `Conversation ${index + 1}`}
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-orange-500 transition-colors">
                    {language === 'en' && conv.titleEn ? conv.titleEn : conv.title}
                  </h2>
                </div>
              </Link>
              
              <div className="pl-8 pr-2 flex flex-col gap-3">
                <Link 
                  href={`/conversations/${conv.id}?level=1`}
                  className="bg-white p-4 rounded-2xl border-2 border-slate-200 border-b-4 hover:-translate-y-1 hover:border-emerald-300 transition-all flex items-center gap-4 group"
                >
                  <div className="bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-500 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <Star size={20} className={1 ? "fill-current" : ""} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 group-hover:text-emerald-500 mb-0.5 uppercase tracking-wide transition-colors">
                      {language === 'en' ? 'Level 1' : 'Niveau 1'}
                    </div>
                    <h3 className="text-base font-bold text-slate-700">
                      {language === 'en' ? 'Fill in the blanks' : 'Remplir la conversation'}
                    </h3>
                  </div>
                </Link>
              </div>
              
              <div className="pl-8 pr-2 flex flex-col gap-3 mt-1">
                <Link 
                  href={`/conversations/${conv.id}?level=2`}
                  className="bg-white p-4 rounded-2xl border-2 border-slate-200 border-b-4 hover:-translate-y-1 hover:border-purple-300 transition-all flex items-center gap-4 group"
                >
                  <div className="bg-slate-100 text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-500 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <Star size={20} className={1 ? "fill-current" : ""} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 group-hover:text-purple-500 mb-0.5 uppercase tracking-wide transition-colors">
                      {language === 'en' ? 'Level 2' : 'Niveau 2'}
                    </div>
                    <h3 className="text-base font-bold text-slate-700">
                      {language === 'en' ? 'Fill in the word' : 'Remplir le mot'}
                    </h3>
                  </div>
                </Link>
                
                <Link 
                  href={`/conversations/${conv.id}?level=3`}
                  className="bg-white p-4 rounded-2xl border-2 border-slate-200 border-b-4 hover:-translate-y-1 hover:border-blue-300 transition-all flex items-center gap-4 group"
                >
                  <div className="bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <Star size={20} className={1 ? "fill-current" : ""} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 group-hover:text-blue-500 mb-0.5 uppercase tracking-wide transition-colors">
                      {language === 'en' ? 'Level 3' : 'Niveau 3'}
                    </div>
                    <h3 className="text-base font-bold text-slate-700">
                      {language === 'en' ? 'Choose the phrase' : 'Choisir la phrase'}
                    </h3>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
        </div>
      </main>
    </div>
  );
}
