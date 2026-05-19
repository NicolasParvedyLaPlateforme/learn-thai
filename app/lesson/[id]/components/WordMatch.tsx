import { useState } from 'react';
import { Exercise } from '../../../types';
import { playThaiTTS } from '../../../lib/tts';
import { formatCombiningChar } from '../../../lib/alphabet-utils';

interface Props {
  exercise: Exercise;
  selected: string;
  onChange: (val: string) => void;
  disabled: boolean;
  isChecking?: boolean;
  isCorrect?: boolean | null;
  onAutoCheck?: (val?: string) => void;
  language?: string;
}

export default function WordMatch({ exercise, selected, onChange, disabled, onAutoCheck, isChecking, isCorrect, language = 'fr' }: Props) {
  const isDense = exercise.options.length > 6;
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
        {localErrors.length > 0 && !(isChecking && isCorrect === false) && (
          <div className="text-rose-500 font-bold animate-pulse text-base sm:text-lg py-0.5 sm:py-1 px-3 sm:px-4 bg-rose-50 rounded-full border border-rose-200 shadow-sm">
            Incorrect
          </div>
        )}
      </div>
      <div className={`grid gap-2 sm:gap-3 ${isDense ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'} w-full max-w-2xl mx-auto`}>
        {exercise.options.map((opt) => {
          const isSelected = selected === opt.th;
          const isLocalError = localErrors.includes(opt.th);
          const isFailedState = isChecking && isCorrect === false;
          const isActualAnswer = opt.th === exercise.answer;
          
          let buttonClass = 'bg-white border-slate-200 border-b-4 text-slate-700 hover:bg-slate-50 active:border-b-2 active:translate-y-0.5';
          let textClass = '';
          
          if (isFailedState) {
            if (isActualAnswer) {
              buttonClass = 'bg-emerald-50 border-emerald-500 text-emerald-700 border-b-4 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]';
            } else {
              buttonClass = 'bg-rose-50 border-rose-300 text-rose-400 opacity-70 translate-y-0.5 border-b-2';
              textClass = 'line-through decoration-rose-300';
            }
          } else {
            if (isSelected) {
              buttonClass = 'bg-indigo-50 border-indigo-500 text-indigo-700 border-b-2 translate-y-0.5 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]';
            } else if (isLocalError) {
              buttonClass = 'bg-rose-50 border-rose-200 text-rose-300 opacity-50 translate-y-0.5 border-b-2';
              textClass = 'line-through decoration-rose-300';
            }
          }

          const displayValue = exercise.reverse 
            ? (language === 'en' ? ((opt as any).en || (opt as any).fr) : (opt as any).fr) || opt.th
            : formatCombiningChar(opt.th);

          return (
            <button
              key={opt.id}
              onClick={() => {
                if (!disabled) {
                  if (!exercise.reverse) {
                    playThaiTTS(opt.th);
                  }
                  onChange(opt.th);
                  if (onAutoCheck) {
                    onAutoCheck(opt.th);
                  }
                }
              }}
              disabled={disabled || isLocalError}
              className={`
                relative rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center
                ${isDense ? 'p-2 sm:p-3 min-h-[50px] sm:min-h-[60px]' : 'p-3 sm:p-5 min-h-[60px] sm:min-h-[80px]'}
                ${buttonClass}
                ${disabled && !isSelected && !isLocalError && !isFailedState ? 'opacity-50' : ''}
                ${(disabled || isLocalError) ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <div className="w-full flex items-center justify-center relative">
                 <span className={`${!exercise.reverse ? 'font-thai' : ''} font-semibold sm:font-normal ${
                   exercise.reverse 
                     ? (isDense ? 'text-base sm:text-lg' : 'text-lg sm:text-xl')
                     : (isDense ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl')
                 } ${textClass}`}>{displayValue}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
