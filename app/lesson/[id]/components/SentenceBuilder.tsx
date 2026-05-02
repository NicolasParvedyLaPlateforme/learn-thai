import { Exercise } from '../../../types';
import { playThaiTTS } from '../../../lib/tts';

interface Props {
  exercise: Exercise;
  selected: string[];
  onChange: (val: string[]) => void;
  disabled: boolean;
}

export default function SentenceBuilder({ exercise, selected, onChange, disabled }: Props) {
  
  const handleSelect = (wordTh: string) => {
    if (disabled) return;
    onChange([...selected, wordTh]);
    playThaiTTS(wordTh);
  };

  const handleRemove = (index: number) => {
    if (disabled) return;
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    onChange(newSelected);
  };

  const isDense = exercise.options.length > 7;

  const usedCounts: Record<string, number> = {};
  selected.forEach(s => {
    usedCounts[s] = (usedCounts[s] || 0) + 1;
  });

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      
      {/* Target area (Answer) */}
      <div className={`min-h-[100px] border-y-2 border-slate-200 py-4 flex flex-wrap gap-2 items-center justify-center`}>
        {selected.length === 0 && (
          <span className="text-slate-400 p-2 font-medium">Formez la phrase ici...</span>
        )}
        {selected.map((word, idx) => {
          let isCorrect = true;
          if (exercise.type === 'sentence-builder' && exercise.correctComponents) {
            const expectedWordId = exercise.correctComponents[idx];
            const expectedWord = exercise.options.find(o => o.id === expectedWordId)?.th;
            isCorrect = word === expectedWord;
          }
          
          const textColorClass = isCorrect ? "text-emerald-600" : "text-rose-500";
          return (
          <button
            key={`sel-${idx}`}
            onClick={() => handleRemove(idx)}
            disabled={disabled}
            className={`bg-white border-2 border-b-4 ${isCorrect ? 'border-slate-200' : 'border-rose-200'} rounded-xl font-medium ${textColorClass} shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 font-thai ${isDense ? 'px-3 py-1.5 text-2xl sm:px-4 sm:py-2 flex items-center h-12 sm:h-14 sm:text-3xl' : 'px-4 py-2 text-3xl sm:px-5 sm:py-3 sm:text-4xl flex items-center h-16 sm:h-20'}`}
          >
            <span className="leading-none pt-1">{word}</span>
          </button>
        )})}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {exercise.options.map((opt, idx) => {
          let isUsed = false;
          if (usedCounts[opt.th] > 0) {
            isUsed = true;
            usedCounts[opt.th]--;
          }
          return (
            <button
              key={`opt-${idx}`}
              onClick={() => handleSelect(opt.th)}
              disabled={disabled || isUsed}
              className={`
                rounded-xl font-medium font-thai select-none transition-all
                ${isDense ? 'px-3 py-1.5 text-xl sm:px-4 sm:py-2 flex items-center h-10 sm:h-12 sm:text-2xl' : 'px-4 py-2 text-2xl sm:px-5 sm:py-3 sm:text-3xl flex items-center h-14 sm:h-16'}
                ${!isUsed 
                  ? 'bg-white border-2 border-b-4 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer active:translate-y-0.5 active:border-b-2' 
                  : 'bg-slate-100 border-2 border-slate-100 text-transparent pointer-events-none'}
              `}
            >
              <span className="leading-none pt-1">{opt.th}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
