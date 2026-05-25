'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProgressStore } from '../lib/store';
import PWAInstallButton from '../components/PWAInstallButton';
import { ArrowLeft, MessageCircle, Star, BookOpen, Info, ChevronRight, Play, X, Book, Image as ImageIcon, Lock } from 'lucide-react';
import conversationsData from '../data/conversations.json';
import CONVERSATION_UNITS from '../data/conversation_units.json';

const UNITS: Record<string, { en: string, fr: string, emoji: string, imageUrl?: string, description?: { en: string, fr: string } }> = CONVERSATION_UNITS;

interface Conversation {
  id: string;
  unitId: string;
  title: string;
  titleEn?: string;
  imageUrl?: string;
  dialogs: Array<{
    en: string;
    fr: string;
  }>;
}

export default function ConversationsPage() {
  const [mounted, setMounted] = useState(false);
  const { language, xp, setLanguage, completedConversations } = useProgressStore();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // On desktop, auto-select first story
    if (window.innerWidth >= 768) {
       const firstUnit = Object.keys(UNITS)[0];
       if (firstUnit) {
           setSelectedStoryId(firstUnit);
       }
    }
  }, []);

  if (!mounted) return null;

  // Group conversations by unit
  const groupedConvs = (conversationsData.conversations as Conversation[]).reduce((acc, conv) => {
    if (!acc[conv.unitId]) acc[conv.unitId] = [];
    acc[conv.unitId].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

  const selectedConv = conversationsData.conversations.find(c => c.id === selectedConvId) as Conversation | undefined;
  const currentStoryConvs = selectedStoryId ? (groupedConvs[selectedStoryId] || []) : [];
  const selectedStory = selectedStoryId ? UNITS[selectedStoryId] : null;

  // Determine what is shown on mobile based on state hierarchy
  const mobileView = selectedConvId 
                     ? 'conversation' 
                     : (selectedStoryId ? 'story' : 'stories_list');

  return (
    <div className="relative h-[100dvh] md:h-screen bg-[#F5F7FA] font-sans text-slate-800 flex flex-col md:flex-row overflow-hidden pb-[72px] md:pb-0">
      
      {/* LEFT PANEL : Stories or Conversations List */}
      <div className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0 transition-transform duration-300 ${mobileView !== 'stories_list' && mobileView !== 'story' ? 'max-md:-translate-x-full max-md:hidden' : ''} ${mobileView === 'conversation' ? 'max-md:hidden' : ''}`}>
        
        {/* Desktop Header */}
        <div className="hidden md:flex h-16 items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
             {selectedStoryId && (
               <button 
                 onClick={() => { setSelectedStoryId(null); setSelectedConvId(null); }}
                 className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600 mr-2"
               >
                 <ArrowLeft size={18} />
               </button>
             )}
             <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {language === 'en' ? 'Stories' : 'Histoires'}
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

        {/* Mobile Header */}
        <header className="bg-[#FAFAFA]/95 backdrop-blur-sm z-50 h-[3.75rem] md:hidden shrink-0 border-b border-slate-100">
          <div className="flex items-center justify-between w-full h-full px-4 gap-2">
            <div className="flex items-center gap-3">
              {mobileView === 'story' && (
                 <button 
                    onClick={() => { setSelectedStoryId(null); setSelectedConvId(null); }}
                    className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm"
                 >
                    <ArrowLeft size={20} />
                 </button>
              )}
              {mobileView === 'stories_list' && (
                 <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm md:hidden">
                    <BookOpen size={20} />
                 </div>
              )}
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight md:hidden">
                 {mobileView === 'stories_list' ? 'ThaiLearn' : (selectedStory ? (language === 'en' ? selectedStory.en : selectedStory.fr) : '')}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {mobileView === 'stories_list' && <PWAInstallButton />}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl font-extrabold text-sm">
                <Star size={18} className="fill-amber-400 stroke-amber-400" />
                <span>{mounted ? xp : 0} XP</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main List Area */}
        <div className="flex-1 overflow-y-auto w-full p-4">
          
          {/* View: Stories List */}
          {!selectedStoryId && (
             <div className="grid grid-cols-1 gap-4">
               {Object.entries(UNITS).map(([unitId, unit]) => {
                  const hasConversations = groupedConvs[unitId] && groupedConvs[unitId].length > 0;
                  if (!hasConversations) return null;
                  return (
                    <button
                      key={unitId}
                      onClick={() => {
                        setSelectedStoryId(unitId);
                        if (window.innerWidth >= 768 && groupedConvs[unitId]?.length > 0) {
                           setSelectedConvId(groupedConvs[unitId][0].id);
                        }
                      }}
                      className="group flex flex-col items-start gap-4 p-4 rounded-3xl border-2 border-slate-100 bg-white hover:border-emerald-200 transition-all text-left shadow-sm hover:shadow-md h-full w-full relative overflow-hidden"
                    >
                       {unit.imageUrl && (
                          <div className="w-full h-32 md:h-40 rounded-2xl bg-slate-100 overflow-hidden relative mb-2">
                            <Image src={unit.imageUrl} alt={unit.en} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                       )}
                       <div className="flex flex-col gap-1 w-full">
                         <div className="flex items-center gap-2">
                           <span className="text-2xl">{unit.emoji}</span>
                           <h2 className="text-lg font-extrabold text-slate-800">
                             {language === 'en' ? unit.en : unit.fr}
                           </h2>
                         </div>
                         {unit.description && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                              {language === 'en' ? unit.description.en : unit.description.fr}
                            </p>
                         )}
                         <div className="mt-3 flex items-center text-emerald-600 font-bold text-sm">
                            {language === 'en' ? 'Explore Story' : 'Explorer l\'histoire'}
                            <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                         </div>
                       </div>
                    </button>
                  );
               })}
             </div>
          )}

          {/* View: Conversations List for Selected Story */}
          {selectedStoryId && (
             <div className="flex flex-col gap-3">
               {selectedStory && (
                  <div className="mb-4">
                     <h2 className="text-2xl font-extrabold text-slate-900 px-2 flex items-center gap-3">
                       {selectedStory.emoji} {language === 'en' ? selectedStory.en : selectedStory.fr}
                     </h2>
                     {selectedStory.description && (
                       <p className="mt-2 text-sm text-slate-500 px-2">
                         {language === 'en' ? selectedStory.description.en : selectedStory.description.fr}
                       </p>
                     )}
                     {selectedStory.imageUrl && (
                        <div className="w-full h-48 rounded-3xl overflow-hidden mt-4 shadow-sm border border-slate-100 relative">
                           <Image src={selectedStory.imageUrl} alt="story" fill className="object-cover" />
                        </div>
                     )}
                  </div>
               )}
               {currentStoryConvs.map((conv, index) => {
                  const isSelected = selectedConvId === conv.id;
                  const isLocked = index > 0 && (completedConversations[currentStoryConvs[index - 1].id] || 0) < 2;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => !isLocked && setSelectedConvId(conv.id)}
                      disabled={isLocked}
                      className={`w-full flex items-center justify-center p-4 rounded-2xl transition-all border-2 relative overflow-hidden ${isSelected ? 'bg-orange-50 border-orange-200' : isLocked ? 'bg-slate-50 border-slate-100 cursor-not-allowed' : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                    >
                       <div className={`w-full flex items-center gap-4 ${isLocked ? 'opacity-40 blur-[1px]' : ''}`}>
                         {/* THUMBNAIL OR ICON */}
                         {conv.imageUrl ? (
                            <div className={`w-14 h-14 rounded-xl overflow-hidden relative shrink-0 border-2 ${isSelected ? 'border-orange-300' : 'border-slate-200'}`}>
                              <Image src={conv.imageUrl} alt={conv.title} fill className="object-cover" />
                            </div>
                         ) : (
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                               <MessageCircle size={24} className={isSelected ? 'fill-orange-100' : ''} />
                            </div>
                         )}
                         
                         <div className="flex-1 min-w-0 pr-2 text-left">
                            <h3 className={`font-bold truncate text-base ${isSelected ? 'text-orange-600' : 'text-slate-700'}`}>
                               {index + 1}. {language === 'en' && conv.titleEn ? conv.titleEn : conv.title}
                            </h3>
                            <p className={`text-sm truncate mt-0.5 ${isSelected ? 'text-orange-500/80' : 'text-slate-400'}`}>
                               {conv.dialogs[0] ? (language === 'en' ? conv.dialogs[0].en : conv.dialogs[0].fr) : ''}
                            </p>
                         </div>
                       </div>
                       
                       {isLocked && (
                         <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
                            <div className="bg-slate-800/90 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 max-w-full text-center">
                               <Lock size={16} className="shrink-0" />
                               <span className="truncate">{language === 'en' ? 'Complete Level 2 of previous conversation' : 'Terminer le Niveau 2 de la précédente conversation'}</span>
                            </div>
                         </div>
                       )}
                    </button>
                  );
               })}
             </div>
          )}

          <div className="h-6"></div>
        </div>
      </div>

      {/* RIGHT PANEL : Detail & Action */}
      <div className={`flex-1 flex flex-col h-full bg-[#F5F7FA] md:bg-slate-50 md:border-l border-slate-200 z-20 ${mobileView === 'conversation' ? 'translate-x-0 absolute inset-0' : 'max-md:hidden'} md:relative`}>
         {selectedConv ? (
             <>
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
                  <div className="w-full max-w-lg mx-auto bg-white rounded-3xl md:shadow-md border border-slate-200 overflow-hidden flex flex-col shrink-0 my-auto md:my-0 pb-2">
                     <div className="p-6 md:p-8 text-center border-b border-slate-100 bg-slate-50 relative">
                        {selectedConv.imageUrl ? (
                           <div className="w-24 h-24 rounded-3xl overflow-hidden mx-auto mb-5 shadow-lg border-4 border-white rotate-3 relative">
                              <Image src={selectedConv.imageUrl} alt={selectedConv.title} fill className="object-cover" />
                           </div>
                        ) : (
                           <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-5 rotate-3 shadow-inner">
                              <MessageCircle size={40} className="fill-orange-200/50" />
                           </div>
                        )}
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

                        {(() => {
                           const highestCompleted = completedConversations[selectedConv.id] ?? -1;
                           const isLevel1Locked = highestCompleted < 0;
                           const isLevel2Locked = highestCompleted < 1;
                           const isLevel3Locked = highestCompleted < 2;

                           return (
                              <>
                                 <Link 
                                    href={isLevel1Locked ? '#' : `/conversations/${selectedConv.id}?level=1`}
                                    className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 overflow-hidden transition-all ${isLevel1Locked ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-80' : 'border-emerald-100 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-200 active:scale-[0.98]'}`}
                                 >
                                    <div className={`w-full flex items-center gap-4 ${isLevel1Locked ? 'opacity-40 blur-[1px]' : ''}`}>
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
                                    </div>
                                    {isLevel1Locked && (
                                       <div className="absolute inset-0 flex items-center justify-center z-10 p-4 font-sans font-bold">
                                          <div className="bg-slate-800/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 max-w-full text-center">
                                             <Lock size={12} className="shrink-0" />
                                             <span className="truncate">{language === 'en' ? 'Listen to the conversation to unlock' : 'Écouter la conversation pour débloquer'}</span>
                                          </div>
                                       </div>
                                    )}
                                 </Link>

                                 <Link 
                                    href={isLevel2Locked ? '#' : `/conversations/${selectedConv.id}?level=2`}
                                    className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 overflow-hidden transition-all ${isLevel2Locked ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-80' : 'border-purple-100 bg-purple-50 hover:bg-purple-100 hover:border-purple-200 active:scale-[0.98]'}`}
                                 >
                                    <div className={`w-full flex items-center gap-4 ${isLevel2Locked ? 'opacity-40 blur-[1px]' : ''}`}>
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
                                    </div>
                                    {isLevel2Locked && (
                                       <div className="absolute inset-0 flex items-center justify-center z-10 p-4 font-sans font-bold">
                                          <div className="bg-slate-800/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 max-w-full text-center">
                                             <Lock size={12} className="shrink-0" />
                                             <span className="truncate">{language === 'en' ? 'Complete Level 1 to unlock' : 'Terminer le Niveau 1 pour débloquer'}</span>
                                          </div>
                                       </div>
                                    )}
                                 </Link>

                                 <Link 
                                    href={isLevel3Locked ? '#' : `/conversations/${selectedConv.id}?level=3`}
                                    className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 overflow-hidden transition-all ${isLevel3Locked ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-80' : 'border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-200 active:scale-[0.98]'}`}
                                 >
                                    <div className={`w-full flex items-center gap-4 ${isLevel3Locked ? 'opacity-40 blur-[1px]' : ''}`}>
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
                                    </div>
                                    {isLevel3Locked && (
                                       <div className="absolute inset-0 flex items-center justify-center z-10 p-4 font-sans font-bold">
                                          <div className="bg-slate-800/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 max-w-full text-center">
                                             <Lock size={12} className="shrink-0" />
                                             <span className="truncate">{language === 'en' ? 'Complete Level 2 to unlock' : 'Terminer le Niveau 2 pour débloquer'}</span>
                                          </div>
                                       </div>
                                    )}
                                 </Link>
                              </>
                           );
                        })()}
                     </div>
                  </div>
               </div>
             </>
         ) : (
             <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                <div className="max-w-sm text-center">
                   <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-6">
                      <Book size={48} className="opacity-50" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-700 mb-2">
                       {language === 'en' ? 'Select a conversation' : 'Sélectionnez une conversation'}
                   </h3>
                   <p className="text-slate-500">
                       {language === 'en' 
                          ? 'Choose a story from the menu, then pick a conversation to start practicing.'
                          : 'Choisissez une histoire dans le menu, puis choisissez une conversation pour commencer la pratique.'}
                   </p>
                </div>
             </div>
         )}
      </div>
    </div>
  );
}


