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
 * Splits a Thai string into typing characters and their logical groupings.
 */
export function getWritingClustersAndGroups(text: string): { characters: string[], groups: number[] } {
  const characters: string[] = [];
  const groups: number[] = [];
  let currentGroupIndex = -1;

  const wordBoundaries = new Set<number>();
  try {
    const segmenter = new (globalThis as any).Intl.Segmenter('th', { granularity: 'word' });
    let offset = 0;
    for (const segment of segmenter.segment(text)) {
      offset += segment.segment.length;
      wordBoundaries.add(offset);
    }
  } catch (e) {
    // Ignore if not supported
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    const isPreposed = code >= 0x0E40 && code <= 0x0E44;
    const isPostposed = code === 0x0E30 || code === 0x0E32 || code === 0x0E33 || code === 0x0E45; // ะ, า, ำ, ๅ
    const isNonBase = 
      (code >= 0x0E31 && code <= 0x0E3A) || // top/bottom vowels, mai han-akat
      (code >= 0x0E47 && code <= 0x0E4E) || // tone marks & others
      (code === 0x0E3C); // korakot
      
    const isWordStart = i > 0 && wordBoundaries.has(i);

    if (isPreposed) {
      currentGroupIndex++;
    } else if (!isNonBase && !isPostposed) {
      if (isWordStart) {
        currentGroupIndex++;
      } else {
        const prevCode = i > 0 ? text[i-1].charCodeAt(0) : 0;
        const prevIsPreposed = prevCode >= 0x0E40 && prevCode <= 0x0E44;
        
        let formsCluster = false;
        const isCurrentConsonant = code >= 0x0E01 && code <= 0x0E2E;
        let hasVowelInGroup = false;
        let isFinalConsonant = false;
        
        if (isCurrentConsonant) {
          let lastConsonantCode = 0;
          let lastConsonantGroup = -1;
          
          for (let j = characters.length - 1; j >= 0; j--) {
             const c = characters[j].charCodeAt(0);
             if (groups[j] === currentGroupIndex) {
                 if ((c >= 0x0E40 && c <= 0x0E44) || // preposed
                     (c === 0x0E30 || c === 0x0E32 || c === 0x0E33 || c === 0x0E45) || // postposed
                     (c >= 0x0E31 && c <= 0x0E3A) || // top/bottom
                     (c === 0x0E47)) { // maitaikhu
                     hasVowelInGroup = true;
                 }
             }
             if (c >= 0x0E01 && c <= 0x0E2E && lastConsonantCode === 0) {
                lastConsonantCode = c;
                lastConsonantGroup = groups[j];
             }
          }
          
          if (lastConsonantCode !== 0 && (lastConsonantGroup === currentGroupIndex)) {
              // Ho Nam
              if (lastConsonantCode === 0x0E2B && [0x0E07, 0x0E0D, 0x0E19, 0x0E21, 0x0E22, 0x0E23, 0x0E25, 0x0E27].includes(code)) {
                formsCluster = true;
              }
              // O Nam
              else if (lastConsonantCode === 0x0E2D && code === 0x0E22) {
                formsCluster = true;
              }
              // True clusters
              else if ([0x0E01, 0x0E02, 0x0E04, 0x0E15, 0x0E1B, 0x0E1E].includes(lastConsonantCode) && [0x0E23, 0x0E25, 0x0E27].includes(code)) {
                formsCluster = true;
              }
              // ทร 
              else if (lastConsonantCode === 0x0E17 && code === 0x0E23) {
                formsCluster = true;
              }
          }

          if (hasVowelInGroup && !formsCluster) {
              const nextCode = i + 1 < text.length ? text[i+1].charCodeAt(0) : 0;
              const isNextVowelOrTone = 
                (nextCode === 0x0E30 || nextCode === 0x0E32 || nextCode === 0x0E33 || nextCode === 0x0E45) ||
                (nextCode >= 0x0E31 && nextCode <= 0x0E3A) || 
                (nextCode >= 0x0E47 && nextCode <= 0x0E4E);
              
              if (!isNextVowelOrTone) {
                  let nextFormsClusterWithCurrent = false;
                  if (nextCode >= 0x0E01 && nextCode <= 0x0E2E) {
                      if (code === 0x0E2B && [0x0E07, 0x0E0D, 0x0E19, 0x0E21, 0x0E22, 0x0E23, 0x0E25, 0x0E27].includes(nextCode)) nextFormsClusterWithCurrent = true;
                      else if (code === 0x0E2D && nextCode === 0x0E22) nextFormsClusterWithCurrent = true;
                      else if ([0x0E01, 0x0E02, 0x0E04, 0x0E15, 0x0E1B, 0x0E1E].includes(code) && [0x0E23, 0x0E25, 0x0E27].includes(nextCode)) nextFormsClusterWithCurrent = true;
                      else if (code === 0x0E17 && nextCode === 0x0E23) nextFormsClusterWithCurrent = true;
                  }
                  
                  if (code !== 0x0E2B && code !== 0x0E2D && !nextFormsClusterWithCurrent) {
                      isFinalConsonant = true;
                  }
              }
          }
        }

        if (!prevIsPreposed && !formsCluster && !isFinalConsonant) {
          currentGroupIndex++;
        }
      }
    }

    if (currentGroupIndex === -1) currentGroupIndex = 0;

    characters.push(char);
    groups.push(currentGroupIndex);
  }

  return { characters, groups };
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
    const { characters, groups } = getWritingClustersAndGroups(item.th.replace(/\s+/g, ''));
    return {
      id: `writing-${idx}-${Date.now()}`,
      type: 'writing' as any,
      question: item.fr,
      answer: item.th,
      options: shuffle(characters.map((c, i) => ({ id: `c-${i}`, th: c, fr: '', phonetic: '' }))),
      correctComponents: characters, // Representing the order of individual characters
      componentGroups: groups,
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
