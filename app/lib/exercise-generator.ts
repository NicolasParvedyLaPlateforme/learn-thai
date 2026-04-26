import { Lesson, Exercise, Word, Phrase } from '../types';

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateExercises(lesson: Lesson, allLessons: Lesson[], level: number = 0): Exercise[] {
  let exercises: Exercise[] = [];
  const globalWords = allLessons.flatMap(l => l.words);

  // Difficulty settings based on level (0 to 3)
  const isMasterLevel = level >= 3;
  const hideHints = level >= 2;
  const baseWMDistractors = 3 + (level * 2); // lvl0:3, lvl1:5, lvl2:7, lvl3:9
  const baseSBDistractors = 3 + (level * 2); // lvl0:3, lvl1:5, lvl2:7, lvl3:9

  if (lesson.isReview) {
    // Treat review as level+1 difficulty
    const reviewHideHints = level >= 1;
    const reviewWMDistractors = Math.min(11, 4 + (level * 2));
    const reviewSBDistractors = Math.min(11, 4 + (level * 2));

    // Find index of current lesson to only include previous lessons
    const currentIdx = allLessons.findIndex(l => l.id === lesson.id);
    const previousLessons = allLessons.slice(0, currentIdx);
    
    // Generate all possible exercises from previous lessons
    previousLessons.forEach(prevLesson => {
      // word match
      prevLesson.words.forEach(word => {
        const distractors = shuffle(globalWords.filter(w => w.id !== word.id)).slice(0, reviewWMDistractors);
        exercises.push({
          id: `rev-wm-${word.id}`,
          type: 'word-match',
          question: word.fr,
          answer: word.th,
          options: shuffle([word, ...distractors]),
          hideHints: reviewHideHints
        });
      });
      // sentence builder
      prevLesson.phrases.forEach(phrase => {
        const phraseWords = phrase.components.map(id => globalWords.find(w => w.id === id)).filter(Boolean) as Word[];
        const distractors = shuffle(globalWords.filter(w => !phrase.components.includes(w.id))).slice(0, reviewSBDistractors);
        exercises.push({
          id: `rev-sb-${phrase.id}`,
          type: 'sentence-builder',
          question: phrase.fr,
          answer: phrase.th,
          options: shuffle([...phraseWords, ...distractors]),
          correctComponents: phrase.components,
          hideHints: reviewHideHints
        });
      });
    });

    // Shuffle and pick 30
    return shuffle(exercises).slice(0, 30);
  }

  // Normal lesson logic
  // 1. Generate word match exercises (skip if master level, focus on sentences)
  if (!isMasterLevel) {
    lesson.words.forEach(word => {
      // Pick random distractor words from all words
      const distractors = shuffle(globalWords.filter(w => w.id !== word.id)).slice(0, baseWMDistractors);
      exercises.push({
        id: `wm-${word.id}`,
        type: 'word-match',
        question: word.fr,
        answer: word.th,
        options: shuffle([word, ...distractors]),
        hideHints
      });
    });
  }

  // 2. Generate sentence builder for each phrase in the current lesson
  // If master level, generate them twice (for more repetition of sentences)
  const multiplier = isMasterLevel ? 2 : 1;
  const sentenceExercises: Exercise[] = [];

  for (let i = 0; i < multiplier; i++) {
    lesson.phrases.forEach(phrase => {
      // Get the words that make up the phrase from the global pool (since words can be from previous lessons)
      const phraseWords = phrase.components.map(id => globalWords.find(w => w.id === id)).filter(Boolean) as Word[];
      
      // Add some distractors from global words
      const distractors = shuffle(globalWords.filter(w => !phrase.components.includes(w.id))).slice(0, baseSBDistractors);
      
      sentenceExercises.push({
        id: `sb-${phrase.id}-${i}`,
        type: 'sentence-builder',
        question: phrase.fr,
        answer: phrase.th,
        options: shuffle([...phraseWords, ...distractors]),
        correctComponents: phrase.components,
        hideHints
      });
    });
  }
  
  exercises = [...exercises, ...sentenceExercises];

  return shuffle(exercises);
}
