import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppLanguage = 'fr' | 'en';

interface ProgressState {
  language: AppLanguage;
  completedLessons: string[];
  lessonLevels: Record<string, number>;
  xp: number;
  seenAlphabets: string[]; // Keep track of seen alphabet letters
  setLanguage: (lang: AppLanguage) => void;
  completeLesson: (lessonId: string, earnedXp: number, playedLevel?: number) => void;
  resetProgress: () => void;
  resetLessonLevel: (lessonId: string) => void;
  markAlphabetSeen: (letter: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      language: 'fr',
      completedLessons: [],
      lessonLevels: {},
      xp: 0,
      seenAlphabets: [],
      setLanguage: (lang) => set({ language: lang }),
      completeLesson: (lessonId, earnedXp, playedLevel) => set((state) => {
        const currentLevel = state.lessonLevels[lessonId] || 0;
        // If playedLevel is provided, only unlock the next level if we played the currently available max level
        let newLevel = currentLevel;
        if (playedLevel !== undefined) {
          if (playedLevel === currentLevel) {
             newLevel = Math.min(currentLevel + 1, 10); // Max level 10
          }
        } else {
           // Fallback if not provided
           newLevel = Math.min(currentLevel + 1, 10);
        }
        
        return {
          completedLessons: state.completedLessons.includes(lessonId) 
            ? state.completedLessons 
            : [...state.completedLessons, lessonId],
          lessonLevels: {
            ...state.lessonLevels,
            [lessonId]: newLevel
          },
          xp: state.xp + earnedXp
        };
      }),
      resetProgress: () => set({ completedLessons: [], lessonLevels: {}, xp: 0 }),
      resetLessonLevel: (lessonId) => set((state) => ({
        lessonLevels: {
          ...state.lessonLevels,
          [lessonId]: 0
        }
      })),
      markAlphabetSeen: (letter) => set((state) => ({
        seenAlphabets: state.seenAlphabets.includes(letter) 
          ? state.seenAlphabets 
          : [...state.seenAlphabets, letter]
      })),
    }),
    {
      name: 'thai-learning-progress',
    }
  )
);
