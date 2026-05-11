import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppLanguage = 'fr' | 'en';

const safeStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(name);
    } catch (e) {
      console.warn("localStorage not available, defaulting to empty", e);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(name, value);
    } catch (e) {
      console.warn("localStorage not available, unable to save state", e);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(name);
    } catch (e) {
      console.warn("localStorage not available", e);
    }
  },
};

interface ProgressState {
  _hasHydrated: boolean;
  language: AppLanguage;
  completedLessons: string[];
  unlockedLessons: string[];
  lessonLevels: Record<string, number>;
  xp: number;
  seenAlphabets: string[]; // Keep track of seen alphabet letters
  setHasHydrated: (state: boolean) => void;
  setLanguage: (lang: AppLanguage) => void;
  completeLesson: (lessonId: string, earnedXp: number, playedLevel?: number) => void;
  unlockLessonManual: (lessonId: string) => void;
  resetProgress: () => void;
  resetLessonLevel: (lessonId: string) => void;
  markAlphabetSeen: (letter: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      language: 'fr',
      completedLessons: [],
      unlockedLessons: [],
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
      unlockLessonManual: (lessonId) => set((state) => ({
        unlockedLessons: state.unlockedLessons 
          ? (state.unlockedLessons.includes(lessonId) ? state.unlockedLessons : [...state.unlockedLessons, lessonId])
          : [lessonId]
      })),
      resetProgress: () => set({ completedLessons: [], unlockedLessons: [], lessonLevels: {}, xp: 0 }),
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
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
