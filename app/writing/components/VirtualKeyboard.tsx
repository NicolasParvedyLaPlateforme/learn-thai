import { Exercise } from '../../types';
import { playThaiTTS } from '../../lib/tts';

interface Props {
  exercise: Exercise;
  selected: string[];
  onChange: (val: string[]) => void;
  disabled: boolean;
}

export default function VirtualKeyboard({ exercise, selected, onChange, disabled }: Props) {
  
  const handleSelect = (charTh: string) => {
    if (disabled) return;
    onChange([...selected, charTh]);
    // Optionally play TTS, characters might not have valid TTS audio alone though
    try {
      playThaiTTS(charTh);
    } catch(e) {}
  };

  const isDense = exercise.options.length > 7;

  // Track used counts to disable keys if they have all been used
  const usedCounts: Record<string, number> = {};
  selected.forEach(s => {
    usedCounts[s] = (usedCounts[s] || 0) + 1;
  });

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      {/* Keyboard area */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {exercise.options.map((opt, idx) => {
          let isUsed = false;
          if (usedCounts[opt.th] > 0) {
            isUsed = true;
            usedCounts[opt.th]--;
          }
          
          return (
            <button
              key={`key-${idx}`}
              onClick={() => handleSelect(opt.th)}
              disabled={disabled || isUsed}
              className={`
                rounded-xl font-medium font-thai select-none transition-all
                ${isDense ? 'px-3 py-1.5 text-3xl sm:px-4 sm:py-2 flex items-center h-14 sm:h-16 sm:text-4xl' : 'px-4 py-2 text-4xl sm:px-5 sm:py-3 sm:text-5xl flex items-center h-16 sm:h-20'}
                ${!isUsed 
                  ? 'bg-white border-2 border-b-4 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer active:translate-y-0.5 active:border-b-2' 
                  : 'bg-slate-100 border-2 border-slate-100 text-transparent pointer-events-none'}
              `}
            >
              <span className="leading-none">{opt.th}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
