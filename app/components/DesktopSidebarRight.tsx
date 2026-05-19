import React from 'react';
import { BookOpen } from 'lucide-react';

interface Unit {
  id: string;
  title: string;
  titleEn?: string;
  colorClass: string;
  textClass: string;
  startIndex?: number;
  endIndex?: number;
  lessons?: any[];
}

interface DesktopSidebarRightProps {
  units: Unit[];
  activeUnitIndex: number;
  onUnitSelect: (index: number) => void;
  language: 'fr' | 'en';
  globalSuggested?: any;
  lessons: any[];
  lessonLevels: Record<string, number>;
  mounted: boolean;
  maxLevelPerLesson?: number;
  suggestionType?: 'learn' | 'alphabet' | string;
}

export function DesktopSidebarRight({
  units,
  activeUnitIndex,
  onUnitSelect,
  language,
  globalSuggested,
  lessons,
  lessonLevels,
  mounted,
  maxLevelPerLesson = 10,
  suggestionType = 'learn'
}: DesktopSidebarRightProps) {
  return (
    <div className="w-[20rem] flex-shrink-0 relative hidden xl:block z-40 pl-8 ml-2 border-l-2 border-slate-100/60 pb-16">
      <div className="w-full relative flex flex-col gap-4 group">
        <div className="flex items-center gap-3 mb-2 text-slate-800 font-bold px-1 shrink-0">
          <BookOpen size={20} className="text-slate-400 shrink-0" />
          <h2 className="whitespace-nowrap text-lg text-slate-600">
            {language === 'en' ? 'Units' : 'Unités'}
          </h2>
        </div>
        <div className="flex flex-col gap-3 pb-6 w-full">
          {units.map((u, i) => {
            const isCurrent = i === activeUnitIndex;
            const status = isCurrent ? (language === 'en' ? 'In progress' : 'En cours') : '';
            const unitLessons = u.lessons ? u.lessons : lessons.slice(u.startIndex || 0, u.endIndex || 0);
            
            const hasSuggestion = globalSuggested?.type === suggestionType && 
                                  globalSuggested.id && 
                                  unitLessons.some(l => l.id === globalSuggested.id);
            const maxLevelsInUnit = unitLessons.length * maxLevelPerLesson;
            const completedLevelsInUnit = mounted ? unitLessons.reduce((acc, l) => acc + (lessonLevels[l.id] || 0), 0) : 0;
            const progressPercent = mounted && maxLevelsInUnit > 0 ? Math.min(100, (completedLevelsInUnit / maxLevelsInUnit) * 100) : 0;
            const completedLessonsCount = mounted ? unitLessons.filter(l => (lessonLevels[l.id] || 0) >= maxLevelPerLesson).length : 0;
            const totalLessonsCount = unitLessons.length;

            if (isCurrent) {
              return (
                <div 
                  key={u.id}
                  className={`w-full text-left rounded-2xl transition-all relative overflow-hidden flex flex-col p-4 shrink-0 bg-white border-2 cursor-default ${u.colorClass.replace('bg-', 'border-')} shadow-sm`}
                >
                  {hasSuggestion && (
                    <span className="absolute top-3 right-3 w-3 h-3 bg-amber-400 border-2 border-white rounded-full z-10"></span>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[16px] text-white ${u.colorClass} shadow-sm shrink-0`}>
                      {i + 1}
                    </div>
                    <div className="flex flex-col min-w-0 pr-2">
                      <h3 className="font-bold text-[15px] text-slate-800 truncate leading-tight mb-0.5">{language === 'en' ? (u.titleEn || u.title) : u.title}</h3>
                      <span className={`text-[13px] font-semibold ${u.textClass} tracking-tight`}>{status}</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                     <div className={`h-full rounded-full transition-all duration-1000 ${u.colorClass}`} style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <div className="text-[12px] font-medium text-slate-400 select-none">
                     {completedLessonsCount}/{totalLessonsCount} {language === 'en' ? 'lessons' : 'leçons'}
                  </div>
                </div>
              );
            }

            return (
              <button 
                key={u.id}
                onClick={() => onUnitSelect(i)}
                className="w-full text-left rounded-2xl transition-all relative flex flex-row items-center p-3 shrink-0 bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-slate-100 active:scale-[0.98] group/btn"
              >
                {hasSuggestion && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-400 rounded-full z-10"></span>
                )}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[15px] bg-white text-slate-400 group-hover/btn:bg-white group-hover/btn:text-slate-500 shrink-0 mr-3 transition-colors shadow-sm">
                   {i + 1}
                </div>

                <div className="flex flex-col justify-center min-w-0 overflow-hidden pr-2">
                  <h3 className="font-bold text-[14px] truncate text-slate-400 group-hover/btn:text-slate-500 transition-colors">{language === 'en' ? (u.titleEn || u.title) : u.title}</h3>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
