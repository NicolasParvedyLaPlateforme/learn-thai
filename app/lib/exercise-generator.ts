import { Lesson, Exercise, Word, Phrase } from '../types';

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Splits a Thai string into meaningful character clusters for writing exercises.
 * A cluster typically consists of a base consonant plus any associated vowels or tone marks.
 */
export function clusterThaiCharacters(text: string): string[] {
  const clusters: string[] = [];
  let currentCluster = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    // If it's a base character (consonant or preposed vowel)
    const isBase = 
      (code >= 0x0E01 && code <= 0x0E2E) || // Consonants
      (code >= 0x0E40 && code <= 0x0E44) || // Preposed vowels
      (code === 0x0E2F) || // Paiyannoi
      (code >= 0x0E46 && code <= 0x0E46); // Maiyamok

    if (isBase && currentCluster !== "") {
      // Check if current base character should be part of the cluster
      // Usually preposed vowels are the start of a cluster, but let's keep it simple
      // and only start a new cluster on a base char if the previous cluster is "complete"
      
      // Special case: if current char is a consonant and previous was a preposed vowel, move it to the current cluster
      const prevCode = currentCluster.charCodeAt(0);
      const prevIsPreposed = prevCode >= 0x0E40 && prevCode <= 0x0E44;
      
      if (prevIsPreposed && currentCluster.length === 1) {
         currentCluster += char;
         continue;
      }

      clusters.push(currentCluster);
      currentCluster = char;
    } else if (currentCluster === "") {
      currentCluster = char;
    } else {
      // Non-base characters (marks, follow-on vowels) always attach to the current cluster
      currentCluster += char;
    }
  }

  if (currentCluster !== "") {
    clusters.push(currentCluster);
  }

  return clusters;
}

export function generateWritingExercises(allLessons: Lesson[], completedLessonIds: string[]): Exercise[] {
  const completedLessons = allLessons.filter(l => completedLessonIds.includes(l.id));
  if (completedLessons.length === 0) return [];

  const candidateItems: { fr: string, th: string }[] = [];
  completedLessons.forEach(l => {
    l.words.forEach(w => candidateItems.push({ fr: w.fr, th: w.th }));
    l.phrases.forEach(p => candidateItems.push({ fr: p.fr, th: p.th }));
  });

  if (candidateItems.length === 0) return [];

  const shuffledCandidates = shuffle(candidateItems).slice(0, 20);
  
  return shuffledCandidates.map((item, idx) => {
    const clusters = clusterThaiCharacters(item.th.replace(/\s+/g, ''));
    return {
      id: `writing-${idx}-${Date.now()}`,
      type: 'writing' as any,
      question: item.fr,
      answer: item.th,
      options: shuffle(clusters).map((c, i) => ({ id: `c-${i}`, th: c, fr: '', phonetic: '' })),
      correctComponents: clusters, // Representing the order of clusters
      hideHints: false
    };
  });
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
