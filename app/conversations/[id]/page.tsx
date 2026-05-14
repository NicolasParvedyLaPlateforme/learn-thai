'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, Play, RotateCcw, Volume2, Star, MessageCircle } from 'lucide-react';
import { useProgressStore } from '../../lib/store';
import { playThaiTTS, playThaiTTSAsync } from '../../lib/tts';
import conversationsData from '../../data/conversations.json';

export default function ConversationExercisePage() {
  const { id } = useParams();
  const { language, addXp, showRomanization } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  
  const conversation = conversationsData.conversations.find(c => c.id === id);
  
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // We use a ref to track if we should continue playing (handles component unmount or stop)
  const isPlayingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      isPlayingRef.current = false;
    };
  }, []);

  if (!mounted) return null;

  if (!conversation) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-sans text-slate-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{language === 'en' ? 'Conversation not found' : 'Conversation introuvable'}</h2>
          <Link href="/conversations" className="text-orange-500 font-bold hover:underline">
            {language === 'en' ? 'Return to Conversations' : 'Retour aux Dialogues'}
          </Link>
        </div>
      </div>
    );
  }

  const startConversation = async () => {
    setHasStarted(true);
    setIsPlaying(true);
    setIsFinished(false);
    setCurrentLineIndex(0);
    isPlayingRef.current = true;
    
    for (let i = 0; i < conversation.dialogs.length; i++) {
      if (!isPlayingRef.current) break;
      setCurrentLineIndex(i);
      await playThaiTTSAsync(conversation.dialogs[i].th);
      
      // Small pause between lines
      if (isPlayingRef.current && i < conversation.dialogs.length - 1) {
        await new Promise(r => setTimeout(r, 600));
      }
    }
    
    if (isPlayingRef.current) {
      setIsPlaying(false);
      setIsFinished(true);
      setCurrentLineIndex(conversation.dialogs.length);
      // Give some XP when you finish listening
      if (!isFinished) {
        addXp(10);
      }
    }
  };

  const replayConversation = () => {
    startConversation();
  };

  const replayLine = (text: string) => {
    playThaiTTS(text);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 pb-32">
      <header className="bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4 max-w-2xl mx-auto w-full border-slate-200 relative">
          <Link href="/conversations" className="text-slate-400 hover:text-slate-600 transition-colors z-10">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <div className="h-3 bg-slate-200 rounded-full w-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${Math.max(5, (currentLineIndex / conversation.dialogs.length) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 mt-8 flex flex-col gap-6">
        <div className="text-center mb-4">
            <h1 className="text-2xl font-black text-slate-800">
                {language === 'en' && conversation.titleEn ? conversation.titleEn : conversation.title}
            </h1>
        </div>

        {!hasStarted ? (
          <div className="flex flex-col items-center justify-center mt-12 gap-6 bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm">
            <div className="bg-orange-100 text-orange-500 p-6 rounded-full">
              <MessageCircle size={48} />
            </div>
            <p className="text-center text-slate-600 font-medium">
              {language === 'en' 
                ? 'Listen to the conversation to understand the context.' 
                : 'Écoutez la conversation pour comprendre le contexte.'}
            </p>
            <button 
              onClick={startConversation}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl w-full border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
            >
              <Play size={24} className="fill-white" />
              {language === 'en' ? 'Start Conversation' : 'Démarrer la conversation'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-20">
            {conversation.dialogs.map((dialog, index) => {
              // Hide lines that haven't been reached yet
              if (index > currentLineIndex && !isFinished) return null;
              
              const isSpeakerA = dialog.speaker === 'A';
              const isActive = index === currentLineIndex && isPlaying;
              
              return (
                <div 
                  key={index} 
                  className={`flex w-full gap-3 py-1 ${isSpeakerA ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                >
                  {/* Speaker A avatar */}
                  {isSpeakerA && (
                    <div className="flex-shrink-0 mt-2">
                       <Image 
                         src="/homme.png" 
                         alt="Male avatar" 
                         width={40} 
                         height={40} 
                         className="rounded-full border border-slate-200 object-cover bg-white shadow-sm"
                         referrerPolicy="no-referrer"
                       />
                    </div>
                  )}

                  {/* Speaker bubble */}
                  <div className={`relative max-w-[75%] flex flex-col gap-2`}>
                    <div 
                      className={`
                        p-4 rounded-3xl shadow-sm border-2
                        ${isSpeakerA 
                          ? 'bg-white border-slate-200 text-slate-800 rounded-tl-sm' 
                          : 'bg-orange-50 border-orange-200 text-orange-900 rounded-tr-sm'
                        }
                        ${isActive ? 'ring-4 ring-orange-400 ring-opacity-50 !border-orange-400' : ''}
                        transition-all duration-300
                      `}
                    >
                      <div className="text-2xl font-medium font-thai leading-relaxed">
                        {dialog.th}
                      </div>
                    </div>
                    
                    {/* Replay button next to the bubble during review mode */}
                    {isFinished && (
                      <button 
                        onClick={() => replayLine(dialog.th)}
                        className={`absolute ${isSpeakerA ? '-right-12' : '-left-12'} top-4 p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors`}
                      >
                        <Volume2 size={24} />
                      </button>
                    )}
                    
                    {/* Phonetics and translation (shown when finished) */}
                    {isFinished && (
                      <div className={`px-2 flex flex-col gap-1 ${isSpeakerA ? 'text-left' : 'text-right'}`}>
                        {showRomanization && <span className="text-sm font-bold text-orange-500">{dialog.phonetic}</span>}
                        <span className="text-sm font-medium text-slate-500">
                          {language === 'en' ? dialog.en : dialog.fr}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Speaker B avatar */}
                  {!isSpeakerA && (
                    <div className="flex-shrink-0 mt-2">
                       <Image 
                         src="/femme.png" 
                         alt="Female avatar" 
                         width={40} 
                         height={40} 
                         className="rounded-full border border-orange-200 object-cover bg-white shadow-sm"
                         referrerPolicy="no-referrer"
                       />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer controls when finished */}
      {isFinished && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-40">
          <div className="max-w-2xl mx-auto flex gap-4">
            <button 
              onClick={replayConversation}
              className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-2xl border-b-4 active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={24} />
              <span className="hidden sm:inline">{language === 'en' ? 'Listen Again' : 'Réécouter'}</span>
            </button>
            <Link 
              href="/conversations"
              className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl border-b-4 border-orange-700 active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center text-center"
            >
              {language === 'en' ? 'Great, continue!' : 'Super, continuer !'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
