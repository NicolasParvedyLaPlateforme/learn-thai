'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, BookOpen, Pencil, Star } from 'lucide-react';
import { useProgressStore } from '../lib/store';
import { WritingConfigModal } from '../components/WritingConfigModal';

export default function PracticePage() {
  const { language, xp, setLanguage } = useProgressStore();
  const [isWritingConfigModalOpen, setWritingConfigModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 pb-28 md:pb-20">
      
      {/* Mobile Top Header */}
      <header className="bg-[#FAFAFA]/95 backdrop-blur-sm z-50 h-[3.75rem] md:hidden">
        <div className="flex items-center justify-between w-full h-full px-4 md:px-8 gap-2 sm:gap-6">
          <div className="flex items-center gap-3">
            <Link href="/learn" className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm md:hidden">
              <BookOpen size={20} />
            </Link>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight md:hidden">
              {language === 'en' ? 'Practice' : 'Pratique'}
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

      <WritingConfigModal isOpen={isWritingConfigModalOpen} onClose={() => setWritingConfigModalOpen(false)} />
      
      <div className="max-w-4xl mx-auto space-y-8 mt-8 px-4 md:px-8">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
            {language === 'en' ? 'Practice' : 'Pratique'}
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">
            {language === 'en' 
              ? 'Reinforce your skills with targeted exercises. Choose a mode below to start practicing.' 
              : 'Renforcez vos compétences avec des exercices ciblés. Choisissez un mode ci-dessous pour commencer à pratiquer.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Review Card */}
          <Link href="/review" className="group flex flex-col bg-white border-2 border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 active:translate-y-0 active:shadow-md transition-all duration-300">
            <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-6 group-hover:scale-110 transition-transform">
              <Brain size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {language === 'en' ? 'Review' : 'Rappel'}
            </h3>
            <p className="text-slate-500 font-medium">
              {language === 'en' 
                ? 'Test your memory and reinforce what you have learned with spaced repetition.' 
                : 'Testez votre mémoire et renforcez ce que vous avez appris avec la répétition espacée.'}
            </p>
          </Link>
          
          {/* Pairs Card */}
          <Link href="/review-pairs" className="group flex flex-col bg-white border-2 border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-fuchsia-300 active:translate-y-0 active:shadow-md transition-all duration-300">
            <div className="bg-fuchsia-100 text-fuchsia-600 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {language === 'en' ? 'Pairs' : 'Paires'}
            </h3>
            <p className="text-slate-500 font-medium">
              {language === 'en' 
                ? 'Match words with their translations to improve your vocabulary recognition.' 
                : 'Associez les mots avec leurs traductions pour améliorer votre reconnaissance du vocabulaire.'}
            </p>
          </Link>

          {/* Writing Card */}
          <button 
            onClick={() => setWritingConfigModalOpen(true)}
            className="group flex flex-col bg-white border-2 border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-sky-300 active:translate-y-0 active:shadow-md transition-all duration-300 text-left"
          >
            <div className="bg-sky-100 text-sky-600 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-6 group-hover:scale-110 transition-transform">
              <Pencil size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {language === 'en' ? 'Writing' : 'Écriture'}
            </h3>
            <p className="text-slate-500 font-medium">
              {language === 'en' 
                ? 'Practice structural sentence building and spelling with the virtual keyboard.' 
                : 'Pratiquez l\'écriture des mots et des phrases avec le clavier virtuel.'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
