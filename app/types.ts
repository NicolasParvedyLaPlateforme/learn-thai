export interface Word {
  id: string;
  th: string;
  fr: string;
  en?: string;
  phonetic: string;
}

export interface Phrase {
  id: string;
  th: string;
  fr: string;
  en?: string;
  phonetic: string;
  components: string[]; // array of word ids
}

export interface Lesson {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  words: Word[];
  phrases: Phrase[];
  isReview?: boolean;
}

export interface CourseData {
  lessons: Lesson[];
}

export type ExerciseType = 'word-match' | 'sentence-builder' | 'writing' | 'intro';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string; // The French text
  answer: string; // The Thai text
  options: Word[] | {id: string, th: string, fr: string, phonetic: string}[]; // Words to select from
  correctComponents?: string[]; // For sentence builder
  componentGroups?: number[]; // To logically group correctComponents for visual display
  hideHints?: boolean; // If true, tooltips won't be shown
  introItem?: Word | Phrase; // For intro exercises
}
