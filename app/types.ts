export interface Word {
  id: string;
  th: string;
  fr: string;
  phonetic: string;
}

export interface Phrase {
  id: string;
  th: string;
  fr: string;
  phonetic: string;
  components: string[]; // array of word ids
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  words: Word[];
  phrases: Phrase[];
  isReview?: boolean;
}

export interface CourseData {
  lessons: Lesson[];
}

export type ExerciseType = 'word-match' | 'sentence-builder';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string; // The French text
  answer: string; // The Thai text
  options: Word[]; // Words to select from
  correctComponents?: string[]; // For sentence builder
  hideHints?: boolean; // If true, tooltips won't be shown
}
