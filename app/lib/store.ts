import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppLanguage = 'fr' | 'en';

export interface WritingConfig {
  lessonId: string | 'all';
  selectedWordIds: string[] | null; // null means all words from the lesson/lessons
  hideThai: boolean;
  hideTranslation: boolean;
  disableDictionaryClick: boolean;
  hideCharacterHints: boolean;
}

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
  languageSetByUser: boolean;
  completedLessons: string[];
  unlockedLessons: string[];
  lessonLevels: Record<string, number>;
  xp: number;
  seenAlphabets: string[]; // Keep track of seen alphabet letters
  isExerciseRunning: boolean;
  setExerciseRunning: (state: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  setLanguage: (lang: AppLanguage) => void;
  autoDetectLanguage: () => void;
  completeLesson: (lessonId: string, earnedXp: number, playedLevel?: number) => void;
  addXp: (amount: number) => void;
  unlockLessonManual: (lessonId: string) => void;
  resetProgress: () => void;
  resetLessonLevel: (lessonId: string) => void;
  markAlphabetSeen: (letter: string) => void;
  showRomanization: boolean;
  setShowRomanization: (show: boolean) => void;
  writingConfig: WritingConfig;
  setWritingConfig: (config: Partial<WritingConfig>) => void;
  lastActiveUnitIndex: number;
  setLastActiveUnitIndex: (index: number) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      language: 'fr',
      languageSetByUser: false,
      completedLessons: [],
      unlockedLessons: [],
      lessonLevels: {},
      xp: 0,
      seenAlphabets: [],
      isExerciseRunning: false,
      setExerciseRunning: (state) => set({ isExerciseRunning: state }),
      showRomanization: true,
      setShowRomanization: (show) => set({ showRomanization: show }),
      writingConfig: {
        lessonId: 'all',
        selectedWordIds: null,
        hideThai: false,
        hideTranslation: false,
        disableDictionaryClick: false,
        hideCharacterHints: false,
      },
      lastActiveUnitIndex: 0,
      setLastActiveUnitIndex: (index) => set({ lastActiveUnitIndex: index }),
      setWritingConfig: (config) => set((state) => ({ writingConfig: { ...state.writingConfig, ...config } })),
      setLanguage: (lang) => set({ language: lang, languageSetByUser: true }),
      autoDetectLanguage: () => {
        const state = get();
        if (!state.languageSetByUser && typeof window !== 'undefined' && window.navigator && window.navigator.language) {
          const browserLang = window.navigator.language.toLowerCase();
          if (browserLang.startsWith('en')) {
            set({ language: 'en' });
          } else if (browserLang.startsWith('fr')) {
            set({ language: 'fr' });
          }
        }
      },
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
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
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
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['_hasHydrated', 'isExerciseRunning'].includes(key))
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
