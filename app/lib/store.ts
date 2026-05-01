import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedLessons: string[];
  lessonLevels: Record<string, number>;
  xp: number;
  seenAlphabets: string[]; // Keep track of seen alphabet letters
  completeLesson: (lessonId: string, earnedXp: number) => void;
  resetProgress: () => void;
  resetLessonLevel: (lessonId: string) => void;
  markAlphabetSeen: (letter: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      lessonLevels: {},
      xp: 0,
      seenAlphabets: [],
      completeLesson: (lessonId, earnedXp) => set((state) => {
        const currentLevel = state.lessonLevels[lessonId] || 0;
        const newLevel = Math.min(currentLevel + 1, 4); // Max level 4
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
