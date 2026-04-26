import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedLessons: string[];
  lessonLevels: Record<string, number>;
  xp: number;
  completeLesson: (lessonId: string, earnedXp: number) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      lessonLevels: {},
      xp: 0,
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
    }),
    {
      name: 'thai-learning-progress',
    }
  )
);
