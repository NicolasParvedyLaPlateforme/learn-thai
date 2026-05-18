import { useMemo } from 'react';
import { useProgressStore } from './store';
import courseData from '../data/course.json';
import { getAlphabetLessons } from './alphabet-utils';
import { CourseData } from '../types';

const data = courseData as unknown as CourseData;

export type SuggestedLesson = {
  id: string;
  type: 'learn' | 'alphabet';
};

export function useGlobalSuggestedLesson(): SuggestedLesson | null {
  const { lessonLevels, lastPlayedLessonId, lastPlayedLessonType } = useProgressStore();
  
  // Need to compute these outside useMemo, or re-compute them if we want to be pure.
  // getAlphabetLessons returns { consonants, vowels }
  
  return useMemo(() => {
    let furthestInProgress: SuggestedLesson | null = null;
    let firstZeroLevel: SuggestedLesson | null = null;
    let suggestionFromLastPlayed: SuggestedLesson | null = null;

    // We build flat arrays to easily find "next" lesson
    const learnLessons = data.lessons.filter(l => Boolean(l));
    const alphabetRaw = getAlphabetLessons();
    const alphabetLessons = [...alphabetRaw.consonants, ...alphabetRaw.vowels].filter(l => Boolean(l));

    // Priority 1: If we have a lastPlayedLesson, we suggest it if it's not max level.
    // If it is max level, we suggest the next one in the same track.
    if (lastPlayedLessonId && lastPlayedLessonType) {
       const isAlphabet = lastPlayedLessonType === 'alphabet';
       const maxLevel = isAlphabet ? 4 : 10;
       const list = isAlphabet ? alphabetLessons : learnLessons;
       
       const currentIndex = list.findIndex(l => l.id === lastPlayedLessonId);
       if (currentIndex !== -1) {
          const currentLevel = lessonLevels[lastPlayedLessonId] || 0;
          if (currentLevel < maxLevel) {
             suggestionFromLastPlayed = { id: lastPlayedLessonId, type: lastPlayedLessonType };
          } else if (currentIndex + 1 < list.length) {
             suggestionFromLastPlayed = { id: list[currentIndex + 1].id, type: lastPlayedLessonType };
          }
       }
    }

    // Still find the fallback based on progress
    for (const lesson of learnLessons) {
      const level = lessonLevels[lesson.id] || 0;
      if (level > 0 && level < 10 && !furthestInProgress) {
        furthestInProgress = { id: lesson.id, type: 'learn' };
      }
      if (level === 0 && !firstZeroLevel) {
        firstZeroLevel = { id: lesson.id, type: 'learn' };
      }
    }

    if (!furthestInProgress && !firstZeroLevel) {
       for (const lesson of alphabetLessons) {
         const level = lessonLevels[lesson.id] || 0;
         if (level > 0 && level < 4 && !furthestInProgress) {
           furthestInProgress = { id: lesson.id, type: 'alphabet' };
         }
         if (level === 0 && !firstZeroLevel) {
           firstZeroLevel = { id: lesson.id, type: 'alphabet' };
         }
       }
    }

    return suggestionFromLastPlayed || furthestInProgress || firstZeroLevel || { id: learnLessons[0]?.id || '', type: 'learn' };
  }, [lessonLevels, lastPlayedLessonId, lastPlayedLessonType]);
}
