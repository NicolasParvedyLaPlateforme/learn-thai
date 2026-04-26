import { Exercise } from '../../../types';

interface Props {
  exercise: Exercise;
  selected: string;
  onChange: (val: string) => void;
  disabled: boolean;
}

export default function WordMatch({ exercise, selected, onChange, disabled }: Props) {
  const isDense = exercise.options.length > 6;

  return (
    <div className={`grid gap-2 sm:gap-3 ${isDense ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'} mt-4 sm:mt-6 w-full max-w-3xl mx-auto`}>
      {exercise.options.map((opt) => {
        const isSelected = selected === opt.th;
        return (
          <button
            key={opt.id}
            onClick={() => !disabled && onChange(opt.th)}
            disabled={disabled}
            className={`
              relative rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center
              ${isDense ? 'p-2 sm:p-3 min-h-[70px] sm:min-h-[80px]' : 'p-4 sm:p-6 min-h-[100px] sm:min-h-[120px]'}
              ${isSelected 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 border-b-2 translate-y-0.5 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]' 
                : 'bg-white border-slate-200 border-b-4 text-slate-700 hover:bg-slate-50 active:border-b-2 active:translate-y-0.5'}
              ${disabled && !isSelected ? 'opacity-50' : ''}
              ${disabled ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            <span className={`font-thai font-semibold ${isDense ? 'text-xl sm:text-2xl mb-0.5 sm:mb-1' : 'text-2xl sm:text-3xl mb-1 sm:mb-2'}`}>{opt.th}</span>
            <span className={`font-medium opacity-80 ${isDense ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>{opt.phonetic}</span>
          </button>
        );
      })}
    </div>
  );
}
