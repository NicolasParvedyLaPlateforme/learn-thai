import { Exercise } from '../../../types';

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
  };

  const handleRemove = (index: number) => {
    if (disabled) return;
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    onChange(newSelected);
  };

  // Keep track of which options are currently in the selected array
  // We match by string, so if there are duplicate words we need to be careful,
  // but for now we assume unique words or just count how many times it was used.
  const getAvailableCount = (th: string) => {
    const totalInOptions = exercise.options.filter(o => o.th === th).length;
    const used = selected.filter(s => s === th).length;
    return totalInOptions - used;
  };

  const isDense = exercise.options.length > 7;

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      
      {/* Target area (Answer) */}
      <div className={`min-h-[100px] border-y-2 border-slate-200 py-4 flex flex-wrap gap-2 items-center justify-center`}>
        {selected.length === 0 && (
          <span className="text-slate-400 p-2 font-medium">Formez la phrase ici...</span>
        )}
        {selected.map((word, idx) => (
          <button
            key={`sel-${idx}`}
            onClick={() => handleRemove(idx)}
            disabled={disabled}
            className={`bg-white border-2 border-b-4 border-slate-200 rounded-xl font-semibold text-emerald-600 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 font-thai ${isDense ? 'px-3 py-1.5 text-base sm:px-4 sm:py-2 sm:text-lg' : 'px-4 py-2 text-lg sm:px-5 sm:py-3 sm:text-xl'}`}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {exercise.options.map((opt, idx) => {
          const availableCount = getAvailableCount(opt.th);
          return (
            <button
              key={`opt-${idx}`}
              onClick={() => handleSelect(opt.th)}
              disabled={disabled || availableCount <= 0}
              className={`
                rounded-xl font-semibold font-thai select-none transition-all
                ${isDense ? 'px-3 py-1.5 text-base sm:px-4 sm:py-2 sm:text-lg' : 'px-4 py-2 text-lg sm:px-5 sm:py-3 sm:text-xl'}
                ${availableCount > 0 
                  ? 'bg-white border-2 border-b-4 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer active:translate-y-0.5 active:border-b-2' 
                  : 'bg-slate-100 border-2 border-slate-100 text-transparent pointer-events-none'}
              `}
            >
              {opt.th}
            </button>
          );
        })}
      </div>

    </div>
  );
}
