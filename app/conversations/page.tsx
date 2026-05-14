'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProgressStore } from '../lib/store';
import { ArrowLeft, MessageCircle, Star } from 'lucide-react';
import conversationsData from '../data/conversations.json';

export default function ConversationsPage() {
  const [mounted, setMounted] = useState(false);
  const { language, xp } = useProgressStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 pb-28 md:pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 shadow-sm sticky top-0 z-50 md:hidden">
        <div className="flex items-center gap-4 max-w-2xl mx-auto h-full px-4 w-full">
          <Link href="/learn" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold flex-1">{language === 'en' ? 'Dialogs' : 'Discussions'}</h1>
          <div className="flex items-center gap-1 text-rose-500 font-bold">
            <Star size={20} className="fill-rose-500" />
            <span>{xp}</span>
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
