import { Lesson, Exercise, Word, Phrase } from '../types';

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateEndlessReviewExercises(allLessons: Lesson[], completedLessonIds: string[]): Exercise[] {
  const completedLessons = allLessons.filter(l => completedLessonIds.includes(l.id));
  if (completedLessons.length === 0) return [];

  let exercises: Exercise[] = [];
  const globalWords = allLessons.flatMap(l => l.words);

  completedLessons.forEach(prevLesson => {
    // word match
    prevLesson.words.forEach(word => {
      const distractors = shuffle(globalWords.filter(w => w.id !== word.id)).slice(0, 5);
      exercises.push({
        id: `endless-wm-${word.id}-${Date.now()}-${Math.random()}`,
        type: 'word-match',
        question: word.fr,
        answer: word.th,
        options: shuffle([word, ...distractors]),
        hideHints: false // The user requested hints always on
      });
    });
    // sentence builder
    prevLesson.phrases.forEach(phrase => {
      const phraseWords = phrase.components.map(id => globalWords.find(w => w.id === id)).filter(Boolean) as Word[];
      const distractors = shuffle(globalWords.filter(w => !phrase.components.includes(w.id))).slice(0, 5);
      exercises.push({
        id: `endless-sb-${phrase.id}-${Date.now()}-${Math.random()}`,
        type: 'sentence-builder',
        question: phrase.fr,
        answer: phrase.th,
        options: shuffle([...phraseWords, ...distractors]),
        correctComponents: phrase.components,
        hideHints: false // The user requested hints always on
      });
    });
  });

  return shuffle(exercises).slice(0, 20); // Return a batch of 20 random exercises
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
    let finalExercises = shuffle(exercises).slice(0, 30);
    
    // Warm-up for reviews too
    if (level >= 1) {
      finalExercises.forEach((ex, idx) => {
        if (idx < 5) {
          ex.hideHints = false;
        }
      });
    }
    return finalExercises;
  }

  // Normal lesson logic
  // 1. Generate word match exercises
  // We keep words for all levels to make exercises longer
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

  // 2. Generate sentence builder for each phrase in the current lesson
  // Increase multiplier to make exercises longer
  const multiplier = isMasterLevel ? 3 : (level >= 1 ? 2 : 1);
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
  let finalExercises = shuffle(exercises);

  // Warm-up logic: first 5 exercises are easier
  if (level >= 2) {
    finalExercises.forEach((ex, idx) => {
      if (idx < 5) {
         ex.hideHints = false; // Show hints for first 5
         // Reduce distractors to make it simpler
         if (ex.type === 'word-match') {
            const correctAnswer = ex.options.find(o => o.th === ex.answer)!;
            const others = shuffle(ex.options.filter(o => o.th !== ex.answer)).slice(0, 3);
            ex.options = shuffle([correctAnswer, ...others]);
         } else if (ex.type === 'sentence-builder') {
            const correctWords = ex.options.filter(o => ex.correctComponents?.includes(o.id));
            const otherWords = shuffle(ex.options.filter(o => !ex.correctComponents?.includes(o.id))).slice(0, 3);
            ex.options = shuffle([...correctWords, ...otherWords]);
         }
      }
    });
  }

  return finalExercises;
}
