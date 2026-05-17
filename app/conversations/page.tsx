'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProgressStore } from '../lib/store';
import { ArrowLeft, MessageCircle, Star, BookOpen, Info, ChevronRight, Play, X } from 'lucide-react';
import conversationsData from '../data/conversations.json';

const UNITS: Record<string, { en: string, fr: string, emoji: string }> = {
  'unit-1': { en: 'Basics & Greetings', fr: 'Bases & Salutations', emoji: '👋' },
  'unit-2': { en: 'Numbers & Quantities', fr: 'Nombres et Quantités', emoji: '🔢' },
  'unit-3': { en: 'Food & Restaurant', fr: 'Nourriture & Restaurant', emoji: '🍜' },
  'unit-4': { en: 'Getting to know people', fr: 'Faire connaissance', emoji: '🤝' },
};

export default function ConversationsPage() {
  const [mounted, setMounted] = useState(false);
  const { language, xp, setLanguage } = useProgressStore();
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // On desktop, auto-select first conversation
    if (window.innerWidth >= 768 && conversationsData.conversations.length > 0) {
       setSelectedConvId(conversationsData.conversations[0].id);
    }
  }, []);

  if (!mounted) return null;

  // Group conversations by unit
  const groupedConvs = conversationsData.conversations.reduce((acc, conv) => {
    if (!acc[conv.unitId]) acc[conv.unitId] = [];
    acc[conv.unitId].push(conv);
    return acc;
  }, {} as Record<string, typeof conversationsData.conversations>);

  const selectedConv = conversationsData.conversations.find(c => c.id === selectedConvId);

  return (
    <div className="relative h-[100dvh] md:h-screen bg-[#F5F7FA] font-sans text-slate-800 flex flex-col md:flex-row overflow-hidden pb-[72px] md:pb-0">
      
      {/* LEFT PANEL : Inbox List */}
      <div className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0 transition-transform duration-300 ${selectedConvId ? 'max-md:-translate-x-full max-md:hidden' : ''}`}>
        {/* Header Desktop */}
        <div className="hidden md:flex h-16 items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
             <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {language === 'en' ? 'Discussions' : 'Discussions'}
             </h1>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-500 font-bold text-xs hover:bg-slate-200 transition-colors"
             >
                {language === 'fr' ? 'FR' : 'EN'}
             </button>
          </div>
        </div>

        {/* Mobile Header (Same as /learn) */}
        <header className="bg-[#FAFAFA]/95 backdrop-blur-sm z-50 h-[3.75rem] md:hidden shrink-0 border-b border-slate-100">
          <div className="flex items-center justify-between w-full h-full px-4 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm md:hidden">
                <BookOpen size={20} />
              </div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight md:hidden">ThaiLearn</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                 onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                 className="flex items-center justify-center px-4 py-2 rounded-full bg-slate-100 text-slate-500 font-extrabold text-sm hover:bg-slate-200 transition-colors"
                 title={language === 'fr' ? "Switch to English" : "Passer en Français"}
              >
                 {language === 'fr' ? 'FR' : 'EN'}
              </button>
              
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl font-extrabold text-sm">
                <Star size={18} className="fill-amber-400 stroke-amber-400" />
                <span>{mounted ? xp : 0} XP</span>
              </div>
            </div>
          </div>
        </header>

        {/* List of Conversations */}
        <div className="flex-1 overflow-y-auto w-full">
          {Object.entries(groupedConvs).map(([unitId, convs]) => (
            <div key={unitId} className="mb-6">
              {/* Unit Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur z-10 px-4 sm:px-6 py-2 border-y border-slate-100 bg-slate-50/50">
                 <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span>{UNITS[unitId]?.emoji || '📚'}</span>
                    {language === 'en' ? UNITS[unitId]?.en || unitId : UNITS[unitId]?.fr || unitId}
                 </h2>
              </div>
              
              <div className="flex flex-col">
                {convs.map((conv) => {
                   const isSelected = selectedConvId === conv.id;
                   return (
                     <button
                       key={conv.id}
                       onClick={() => setSelectedConvId(conv.id)}
                       className={`w-full flex items-center gap-4 px-4 sm:px-6 py-4 text-left transition-colors border-b border-slate-50 last:border-0 hover:bg-slate-50 ${isSelected ? 'bg-orange-50/50 hover:bg-orange-50/80' : ''}`}
                     >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                           <MessageCircle size={24} className={isSelected ? 'fill-orange-100' : ''} />
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                           <h3 className={`font-bold truncate text-base ${isSelected ? 'text-orange-600' : 'text-slate-700'}`}>
                              {language === 'en' && conv.titleEn ? conv.titleEn : conv.title}
                           </h3>
                           <p className="text-sm text-slate-400 truncate mt-0.5">
                              {conv.dialogs[0] ? (language === 'en' ? conv.dialogs[0].en : conv.dialogs[0].fr) : ''}
                           </p>
                        </div>
                     </button>
                   );
                })}
              </div>
            </div>
          ))}
          <div className="h-6"></div>
        </div>
      </div>

      {/* RIGHT PANEL : Detail & Action */}
      {selectedConv && (
        <div className={`flex-1 flex flex-col h-full bg-[#F5F7FA] md:bg-white md:border-l border-slate-200 transition-transform duration-300 absolute md:static top-0 left-0 w-full z-20 ${selectedConvId ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
           {/* Detail Header (Mobile has back button) */}
           <div className="h-[3.75rem] md:h-16 flex items-center px-4 sm:px-8 bg-white border-b border-slate-200 shrink-0">
              <button 
                onClick={() => setSelectedConvId(null)}
                className="w-10 h-10 -ml-2 mr-2 bg-slate-100 rounded-full flex justify-center items-center text-slate-600 md:hidden"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 hidden md:flex">
                    <MessageCircle size={16} className="fill-current" />
                 </div>
                 <h2 className="text-lg font-extrabold text-slate-800 truncate">
                    {language === 'en' && selectedConv.titleEn ? selectedConv.titleEn : selectedConv.title}
                 </h2>
              </div>
           </div>

           {/* Content Box */}
           <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-[100px] md:pb-8 flex flex-col w-full">
              
              <div className="w-full max-w-lg mx-auto bg-white rounded-3xl md:shadow-sm border border-slate-200 overflow-hidden flex flex-col shrink-0 my-auto md:my-0 pb-2">
                 <div className="p-6 md:p-8 text-center border-b border-slate-100 bg-slate-50/50">
                    <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-5 rotate-3 shadow-inner">
                       <MessageCircle size={40} className="fill-orange-200/50" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                       {language === 'en' && selectedConv.titleEn ? selectedConv.titleEn : selectedConv.title}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium px-4">
                       {language === 'en' 
                          ? 'Choose a difficulty level to start practicing this dialogue.' 
                          : 'Choisissez un niveau de difficulté pour commencer à pratiquer ce dialogue.'}
                    </p>
                 </div>

                 <div className="p-4 sm:p-6 flex flex-col gap-3">
                    <Link 
                       href={`/conversations/${selectedConv.id}`}
                       className="group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] transition-all"
                    >
                       <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <BookOpen size={24} className="fill-current" />
                       </div>
                       <div className="flex-1">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                             {language === 'en' ? 'Base conversation' : 'Conversation de base'}
                          </div>
                          <div className="font-extrabold text-slate-700 text-base">
                             {language === 'en' ? 'Read & Listen' : 'Écouter et lire'}
                          </div>
                       </div>
                       <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                    </Link>

                    <div className="h-px w-full bg-slate-100 my-1"></div>

                    <Link 
                       href={`/conversations/${selectedConv.id}?level=1`}
                       className="group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-200 active:scale-[0.98] transition-all"
                    >
                       <div className="w-12 h-12 rounded-xl bg-white text-emerald-500 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Star size={24} className="fill-current" />
                       </div>
                       <div className="flex-1">
                          <div className="text-[11px] font-bold text-emerald-600/80 uppercase tracking-wider mb-0.5">
                             {language === 'en' ? 'Level 1' : 'Niveau 1'}
                          </div>
                          <div className="font-extrabold text-emerald-900 text-base">
                             {language === 'en' ? 'Fill in the blanks' : 'Remplir la conversation'}
                          </div>
                       </div>
                       <ChevronRight size={20} className="text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link 
                       href={`/conversations/${selectedConv.id}?level=2`}
                       className="group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-purple-100 bg-purple-50 hover:bg-purple-100 hover:border-purple-200 active:scale-[0.98] transition-all"
                    >
                       <div className="w-12 h-12 rounded-xl bg-white text-purple-500 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Star size={24} className="fill-current" />
                       </div>
                       <div className="flex-1">
                          <div className="text-[11px] font-bold text-purple-600/80 uppercase tracking-wider mb-0.5">
                             {language === 'en' ? 'Level 2' : 'Niveau 2'}
                          </div>
                          <div className="font-extrabold text-purple-900 text-base">
                             {language === 'en' ? 'Fill in the word' : 'Remplir le mot'}
                          </div>
                       </div>
                       <ChevronRight size={20} className="text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link 
                       href={`/conversations/${selectedConv.id}?level=3`}
                       className="group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-200 active:scale-[0.98] transition-all"
                    >
                       <div className="w-12 h-12 rounded-xl bg-white text-blue-500 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Star size={24} className="fill-current" />
                       </div>
                       <div className="flex-1">
                          <div className="text-[11px] font-bold text-blue-600/80 uppercase tracking-wider mb-0.5">
                             {language === 'en' ? 'Level 3' : 'Niveau 3'}
                          </div>
                          <div className="font-extrabold text-blue-900 text-base">
                             {language === 'en' ? 'Choose the phrase' : 'Choisir la phrase'}
                          </div>
                       </div>
                       <ChevronRight size={20} className="text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
}

