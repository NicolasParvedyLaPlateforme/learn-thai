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

export function generateWritingExercises(allLessons: Lesson[], completedLessonIds: string[], language: string = 'fr'): Exercise[] {
  const completedLessons = allLessons.filter(l => completedLessonIds.includes(l.id));
  if (completedLessons.length === 0) return [];

  const candidateItems: { fr: string, th: string }[] = [];
  completedLessons.forEach(l => {
    l.words.forEach(w => candidateItems.push({ fr: language === 'en' ? (w.en || w.fr) : w.fr, th: w.th }));
    l.phrases.forEach(p => candidateItems.push({ fr: language === 'en' ? (p.en || p.fr) : p.fr, th: p.th }));
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

export interface ReviewOptions {
  showWordHints: boolean;
  showUsefulVocab: boolean;
  includeDistractors: boolean;
  limitDistractors: number;
}

export function generateEndlessReviewExercises(
  allLessons: Lesson[], 
  completedLessonIds: string[], 
  language: string = 'fr',
  options?: ReviewOptions
): Exercise[] {
  const completedLessons = allLessons.filter(l => completedLessonIds.includes(l.id));
  if (completedLessons.length === 0) return [];

  const defaultOptions: ReviewOptions = {
    showWordHints: true,
    showUsefulVocab: true,
    includeDistractors: true,
    limitDistractors: 2,
    ...options
  };

  let exercises: Exercise[] = [];
  const globalWords = allLessons.flatMap(l => l.words);
  
  // Create collections of number words
  const numberLessons = allLessons.filter(l => l.title.toLowerCase().includes('nombre') || l.titleEn?.toLowerCase().includes('number'));
  const numberWords = numberLessons.flatMap(l => l.words);

  completedLessons.forEach(prevLesson => {
    const isNumberLesson = prevLesson.title.toLowerCase().includes('nombre') || prevLesson.titleEn?.toLowerCase().includes('number');
    const distractorPool = isNumberLesson ? numberWords : globalWords;
    const numDistractors = defaultOptions.includeDistractors ? defaultOptions.limitDistractors : 0;

    // word match
    prevLesson.words.forEach(word => {
      // Word match always has 3 distractors (4 options total)
      const distractors = shuffle(distractorPool.filter(w => w.id !== word.id)).slice(0, 3);
      exercises.push({
        id: `endless-wm-${word.id}-${Date.now()}-${Math.random()}`,
        type: 'word-match',
        question: language === 'en' ? (word.en || word.fr) : word.fr,
        answer: word.th,
        options: shuffle([word, ...distractors]),
        hideHints: !defaultOptions.showUsefulVocab,
        disableTooltips: !defaultOptions.showWordHints,
      } as any); // Type assertion for now since we'll add these options to Exercise interface
    });
    // sentence builder
    prevLesson.phrases.forEach(phrase => {
      const phraseWords = phrase.components.map(id => globalWords.find(w => w.id === id)).filter(Boolean) as Word[];
      // Distractors for sentence builder: shouldn't use number words unless it's a number lesson
      const sbDistractorPool = isNumberLesson ? numberWords : globalWords;
      const distractors = shuffle(sbDistractorPool.filter(w => !phrase.components.includes(w.id))).slice(0, numDistractors);
      exercises.push({
        id: `endless-sb-${phrase.id}-${Date.now()}-${Math.random()}`,
        type: 'sentence-builder',
        question: language === 'en' ? (phrase.en || phrase.fr) : phrase.fr,
        answer: phrase.th,
        options: shuffle([...phraseWords, ...distractors]),
        correctComponents: phrase.components,
        hideHints: !defaultOptions.showUsefulVocab,
        disableTooltips: !defaultOptions.showWordHints,
      } as any);
    });
  });

  return shuffle(exercises).slice(0, 20); // Return a batch of 20 random exercises
}

export function generateExercises(lesson: Lesson, allLessons: Lesson[], level: number = 0, language: string = 'fr'): Exercise[] {
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
        // Always 3 distractors for word-match = 4 options
        const distractors = shuffle(globalWords.filter(w => w.id !== word.id)).slice(0, 3);
        exercises.push({
          id: `rev-wm-${word.id}`,
          type: 'word-match',
          question: language === 'en' ? (word.en || word.fr) : word.fr,
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
          question: language === 'en' ? (phrase.en || phrase.fr) : phrase.fr,
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
  let wmExercises: Exercise[] = [];
  let sbExercises: Exercise[] = [];

  lesson.words.forEach(word => {
    // For all levels, 4 options (1 correct, 3 distractors)
    const distractors = shuffle(globalWords.filter(w => w.id !== word.id)).slice(0, 3);
    wmExercises.push({
      id: `wm-${word.id}-${Date.now()}-${Math.random()}`,
      type: 'word-match',
      question: language === 'en' ? (word.en || word.fr) : word.fr,
      answer: word.th,
      options: shuffle([word, ...distractors]),
      hideHints: false
    });
  });

  lesson.phrases.forEach(phrase => {
    const phraseWords = phrase.components.map(id => globalWords.find(w => w.id === id)).filter(Boolean) as Word[];
    const numDistractors = level >= 3 ? 1 : 0;
    const distractors = shuffle(globalWords.filter(w => !phrase.components.includes(w.id))).slice(0, numDistractors);
    sbExercises.push({
      id: `sb-${phrase.id}-${Date.now()}-${Math.random()}`,
      type: 'sentence-builder',
      question: language === 'en' ? (phrase.en || phrase.fr) : phrase.fr,
      answer: phrase.th,
      options: shuffle([...phraseWords, ...distractors]),
      correctComponents: phrase.components,
      hideHints: false
    });
  });

  let finalExercises: Exercise[] = [];
  wmExercises = shuffle(wmExercises);
  sbExercises = shuffle(sbExercises);

  if (level === 0) {
    // Level 1: Only word-match
    let pool = [...wmExercises];
    while (pool.length < 10 && wmExercises.length > 0) pool = [...pool, ...shuffle(wmExercises)];
    if (pool.length === 0) pool = [...sbExercises];
    finalExercises = pool;
  } else if (level === 1) {
    // Level 2: First half word-match, second half sentence-builder
    let wmPool = [...wmExercises];
    while (wmPool.length < 5 && wmExercises.length > 0) wmPool = [...wmPool, ...shuffle(wmExercises)];
    let sbPool = [...sbExercises];
    while (sbPool.length < 5 && sbExercises.length > 0) sbPool = [...sbPool, ...shuffle(sbExercises)];
    if (wmPool.length === 0) wmPool = [...sbPool];
    if (sbPool.length === 0) sbPool = [...wmPool];
    finalExercises = [...wmPool, ...sbPool];
  } else if (level === 2) {
    // Level 3: 4 word-match, rest sentence-builder
    let wmPool = wmExercises.slice(0, 4);
    while (wmPool.length < 4 && wmExercises.length > 0) {
       wmPool.push(wmExercises[Math.floor(Math.random() * wmExercises.length)]);
    }
    let sbPool = [...sbExercises];
    while (sbPool.length < 8 && sbExercises.length > 0) sbPool = [...sbPool, ...shuffle(sbExercises)];
    if (wmPool.length === 0) wmPool = [...sbPool].slice(0, 4);
    if (sbPool.length === 0) sbPool = [...wmPool];
    finalExercises = [...wmPool, ...sbPool];
  } else if (level === 3) {
    // Level 4: Only sentence-builder
    let sbPool = [...sbExercises];
    while (sbPool.length < 10 && sbExercises.length > 0) sbPool = [...sbPool, ...shuffle(sbExercises)];
    if (sbPool.length === 0) sbPool = [...wmExercises];
    finalExercises = sbPool;
  } else if (level >= 4 && level <= 6) {
    // Level 5 (index 4): Normal pair-matching
    // Level 6 (index 5): Pair-matching audio-only
    // Level 7 (index 6): Pair-matching script-only
    let pmExercises: Exercise[] = [];
    const allItemsRaw = [...lesson.words, ...lesson.phrases];
    const allGlobalItemsRaw = [...globalWords, ...allLessons.flatMap(l => l.phrases)];
    const allItemsForPairsRaw = allItemsRaw.length >= 4 ? allItemsRaw : allGlobalItemsRaw;
    const allItemsForPairs = Array.from(new Map(allItemsForPairsRaw.map(w => [w.id, w])).values());
    
    let pairMatchMode: 'normal' | 'audio-only' | 'script-only' = 'normal';
    if (level === 5) pairMatchMode = 'audio-only';
    if (level === 6) pairMatchMode = 'script-only';

    for (let i = 0; i < 5; i++) {
      const selectedPairs = shuffle(allItemsForPairs).slice(0, 4);
      pmExercises.push({
        id: `pm-${Date.now()}-${Math.random()}`,
        type: 'pair-matching',
        question: language === 'en' ? 'Match the pairs' : 'Reliez les paires correspondantes',
        answer: '',
        options: selectedPairs as any,
        pairs: selectedPairs as any,
        hideHints: true,
        pairMatchMode
      });
    }
    finalExercises = pmExercises;
  } else if (level === 7) {
    // Level 8: Blind writing words
    let wrPool: Exercise[] = [];
    lesson.words.forEach(w => {
       const { characters, groups } = getWritingClustersAndGroups(w.th.replace(/\s+/g, ''));
       wrPool.push({
          id: `wr-blind-word-${w.id}-${Date.now()}-${Math.random()}`,
          type: 'writing',
          question: language === 'en' ? (w.en || w.fr) : w.fr,
          answer: w.th,
          options: shuffle(characters.map((c, i) => ({ id: `c-${i}`, th: c, fr: '', phonetic: '' }))),
          correctComponents: characters,
          componentGroups: groups,
          hideHints: true,
          blindMode: true
       });
    });
    wrPool = shuffle(wrPool);
    while (wrPool.length < 10 && wrPool.length > 0) wrPool = [...wrPool, ...shuffle(wrPool)];
    finalExercises = wrPool.slice(0, 10);
  } else if (level === 8) {
    // Level 9: Blind writing phrases
    let wrPool: Exercise[] = [];
    lesson.phrases.forEach(p => {
       const { characters, groups } = getWritingClustersAndGroups(p.th.replace(/\s+/g, ''));
       wrPool.push({
          id: `wr-blind-phrase-${p.id}-${Date.now()}-${Math.random()}`,
          type: 'writing',
          question: language === 'en' ? (p.en || p.fr) : p.fr,
          answer: p.th,
          options: shuffle(characters.map((c, i) => ({ id: `c-${i}`, th: c, fr: '', phonetic: '' }))),
          correctComponents: characters,
          componentGroups: groups,
          hideHints: true,
          blindMode: true
       });
    });
    wrPool = shuffle(wrPool);
    while (wrPool.length < 10 && wrPool.length > 0) wrPool = [...wrPool, ...shuffle(wrPool)];
    if (wrPool.length === 0) { // Fallback if no phrases
       lesson.words.forEach(w => {
         const { characters, groups } = getWritingClustersAndGroups(w.th.replace(/\s+/g, ''));
         wrPool.push({
            id: `wr-blind-word-${w.id}-${Date.now()}-${Math.random()}`,
            type: 'writing',
            question: language === 'en' ? (w.en || w.fr) : w.fr,
            answer: w.th,
            options: shuffle(characters.map((c, i) => ({ id: `c-${i}`, th: c, fr: '', phonetic: '' }))),
            correctComponents: characters,
            componentGroups: groups,
            hideHints: true,
            blindMode: true
         });
       });
       wrPool = shuffle(wrPool);
       while (wrPool.length < 10 && wrPool.length > 0) wrPool = [...wrPool, ...shuffle(wrPool)];
    }
    finalExercises = wrPool.slice(0, 10);
  }


  // Prevent same questions consecutively
  const result: Exercise[] = [];
  const waitlist: Exercise[] = [];
  
  for (let i = 0; i < finalExercises.length; i++) {
     const current = finalExercises[i];
     const lastInResult = result[result.length - 1];
     
     if (!lastInResult || lastInResult.answer !== current.answer) {
         result.push(current);
         let w = 0;
         while (w < waitlist.length) {
            if (result[result.length - 1].answer !== waitlist[w].answer) {
                result.push(waitlist.splice(w, 1)[0]);
            } else {
                w++;
            }
         }
     } else {
         waitlist.push(current);
     }
  }
  
  const finalResult = [...result, ...waitlist];
  
  const exercisesWithIntros: Exercise[] = [];
  const introducedIds = new Set<string>();

  for (const ex of finalResult) {
    if (level === 0 && !lesson.isReview && ex.type === 'word-match') {
      const word = lesson.words.find(w => w.th === ex.answer);
      if (word && !introducedIds.has(word.id)) {
        introducedIds.add(word.id);
        exercisesWithIntros.push({
          id: `intro-${word.id}-${Math.random()}`,
          type: 'intro',
          question: language === 'en' ? (word.en || word.fr) : word.fr,
          answer: word.th,
          options: [],
          introItem: word,
          hideHints: false
        });
      }
    } else if (level === 1 && !lesson.isReview && ex.type === 'sentence-builder') {
      const phrase = lesson.phrases.find(p => p.th === ex.answer);
      if (phrase && !introducedIds.has(phrase.id)) {
        introducedIds.add(phrase.id);
        exercisesWithIntros.push({
          id: `intro-${phrase.id}-${Math.random()}`,
          type: 'intro',
          question: language === 'en' ? (phrase.en || phrase.fr) : phrase.fr,
          answer: phrase.th,
          options: [],
          introItem: phrase,
          hideHints: false
        });
      }
    }
    exercisesWithIntros.push(ex);
  }

  return exercisesWithIntros;
}

export function generateEndlessPairMatching(
  allLessons: Lesson[],
  completedLessonIds: string[],
  language: string = 'fr'
): Exercise[] {
  const completedLessons = allLessons.filter(l => completedLessonIds.includes(l.id));
  if (completedLessons.length === 0) return [];
  const globalItemsRaw = completedLessons.flatMap(l => [...l.words, ...l.phrases]);
  const globalItems = Array.from(new Map(globalItemsRaw.map(w => [w.id, w])).values());
  if (globalItems.length < 4) return [];

  let exercises: Exercise[] = [];
  for (let i = 0; i < 20; i++) {
    const selectedPairs = shuffle(globalItems).slice(0, 4);
    
    // Pick a random mode for review
    const modeRoll = Math.random();
    let mode: 'normal' | 'audio-only' | 'script-only' = 'normal';
    if (modeRoll < 0.33) {
      mode = 'audio-only';
    } else if (modeRoll < 0.66) {
      mode = 'script-only';
    }

    exercises.push({
      id: `endless-pm-${Date.now()}-${Math.random()}`,
      type: 'pair-matching',
      question: language === 'en' ? 'Match the pairs' : 'Reliez les paires correspondantes',
      answer: '',
      options: selectedPairs as any,
      pairs: selectedPairs as any,
      hideHints: true,
      pairMatchMode: mode
    });
  }
  return exercises;
}
