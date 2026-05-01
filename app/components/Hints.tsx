import { useState, useRef, useEffect } from 'react';
import { Word, Phrase } from '../types';
import { playThaiTTS } from '../lib/tts';

// A simple component to render tooltips with tap support for mobile
export function TooltipHint({ children, tooltipContent, className = '', audioText }: { children: React.ReactNode, tooltipContent: React.ReactNode, className?: string, audioText?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<'center' | 'left' | 'right'>('center');

  const onOpen = () => {
    setIsOpen(true);
    if (audioText) {
      playThaiTTS(audioText);
    }
  };

  const handleTap = () => {
    onOpen();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !spanRef.current) return;

    if (window.innerWidth >= 768) {
      setPosition('center');
      return;
    }

    const rect = spanRef.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const threshold = window.innerWidth * 0.4;

    if (center < threshold) {
      setPosition('left');
    } else if (center > window.innerWidth - threshold) {
      setPosition('right');
    } else {
      setPosition('center');
    }
  }, [isOpen]);

  return (
    <span 
      ref={spanRef}
      className={`relative cursor-help ${className}`} 
      onClick={handleTap}
      onMouseEnter={onOpen}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <div 
          className={`absolute bottom-full mb-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap z-[100] shadow-xl animate-in fade-in duration-200
            ${position === 'left' ? 'left-0' : position === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'}
          `}
        >
          {tooltipContent}
          <div 
            className={`absolute top-full border-8 border-transparent border-t-slate-800
              ${position === 'left' ? 'left-4' : position === 'right' ? 'right-4' : 'left-1/2 -translate-x-1/2'}
            `}
          ></div>
        </div>
      )}
    </span>
  );
}

// A simple component to render the french question with tooltips (hints)
export function SentenceWithHints({text, dictionary, phrases, isSentence, exerciseOptions, hideHints, alwaysShowPhonetic}: {text: string, dictionary: Word[], phrases: Phrase[], isSentence: boolean, exerciseOptions: Word[], hideHints?: boolean, alwaysShowPhonetic?: boolean}) {
  // Try to match the ENTIRE phrase/word first
  const exactPhrase = phrases.find(p => p.fr.toLowerCase() === text.toLowerCase());
  const exactWord = dictionary.find(w => w.fr.toLowerCase() === text.toLowerCase());
  const exactMatch = exactPhrase || exactWord;
  
  if (hideHints) {
    return <div className="text-xl md:text-2xl font-medium">{text}</div>;
  }
  
  return (
    <div className="flex flex-col gap-4">
      <span className="flex flex-wrap items-end gap-x-2 gap-y-4 leading-relaxed text-xl md:text-2xl font-medium">
        {exactMatch ? (
           alwaysShowPhonetic ? (
             <span className="inline-flex flex-col">
               <span>{text}</span>
               <span className="text-sm md:text-base text-emerald-600 font-medium tracking-wide">[{exactMatch.phonetic}]</span>
             </span>
           ) : (
             <TooltipHint 
               className="border-b-2 border-dotted border-slate-300 inline-block"
               tooltipContent={<><span className="font-thai text-lg font-bold">{exactMatch.th}</span> <span className="text-slate-300 text-xs">({exactMatch.phonetic})</span></>}
               audioText={exactMatch.th}
             >
               {text}
             </TooltipHint>
           )
        ) : (
          text.split(' ').map((w, i) => {
            // fallback word-by-word
            const cleanW = w.toLowerCase().replace(/[,?!.()]/g, '').trim();
            if (!cleanW) return <span key={i} className="self-start">{w}</span>;

            const match = dictionary.find(d => {
              const frWords = d.fr.toLowerCase().split(/[\s/'.()]+/);
              return frWords.includes(cleanW);
            });
            
            if (match) {
              return alwaysShowPhonetic ? (
                 <span key={i} className="inline-flex flex-col">
                    <span>{w}</span>
                    <span className="text-xs md:text-sm text-emerald-600 font-medium tracking-wide">[{match.phonetic}]</span>
                 </span>
              ) : (
                <TooltipHint 
                  key={i} 
                  className="border-b-2 border-dotted border-slate-300 inline-block"
                  tooltipContent={<><span className="font-thai text-lg font-bold">{match.th}</span> <span className="text-slate-300 text-xs">({match.phonetic})</span></>}
                  audioText={match.th}
                >
                  {w}
                </TooltipHint>
              );
            }
            return <span key={i} className="self-start">{w}</span>;
          })
        )}
      </span>

      
      {isSentence && (
        <div className="mt-2 text-sm text-slate-500 bg-slate-100 p-3 rounded-xl border-2 border-slate-200">
          <span className="font-bold text-slate-600 block mb-2 uppercase tracking-wide text-xs">💡 Vocabulaire utile :</span>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {exerciseOptions.map((w, i) => (
              <TooltipHint 
                key={i}
                className="inline-flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm"
                tooltipContent={<><span className="text-slate-200 font-medium">Prononciation :</span> <span className="font-bold">{w.phonetic}</span></>}
                audioText={w.th}
              >
                <span className="font-thai text-emerald-600 font-semibold">{w.th}</span> 
                <span className="text-slate-400">=</span> 
                <span className="italic">{w.fr}</span>
              </TooltipHint>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
