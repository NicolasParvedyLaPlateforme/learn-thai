"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useProgressStore } from "../../lib/store";
import courseData from "../../data/course.json";
import { generateExercises } from "../../lib/exercise-generator";
import { Exercise, Lesson, CourseData, Word, Phrase } from "../../types";
import { X, Check, Star, Crown, Volume2, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { playThaiTTS, preloadThaiVoices } from "../../lib/tts";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

// Exercise Components
import WordMatch from "./components/WordMatch";
import SentenceBuilder from "./components/SentenceBuilder";
import PairMatch from "../../components/PairMatch";
import { TooltipHint, SentenceWithHints } from "../../components/Hints";
import VirtualKeyboard from "../../writing/components/VirtualKeyboard";
import FreeTypingInput from "./components/FreeTypingInput";
import InstructionExample from "./components/InstructionExample";
import { Suspense } from "react";

const data = courseData as CourseData;

const getInstructionKey = (ex: Exercise | undefined) => {
  if (!ex) return null;
  if (ex.type === "intro") return null;
  if (ex.type === "word-match") return "word-match";
  if (ex.type === "pair-matching") return "pair-matching";
  if (ex.type === "sentence-builder") return "sentence-builder";
  if (ex.type === "writing")
    return ex.blindMode ? "writing-blind" : "writing";
  if (ex.type === "free-typing") return "free-typing";
  return null;
};

const getInstructionText = (key: string | null, lang: string) => {
  if (key === "word-match")
    return lang === "en"
      ? "Select the correct translation"
      : "Sélectionnez la bonne traduction";
  if (key === "pair-matching")
    return lang === "en"
      ? "Match the pairs"
      : "Reliez les paires correspondantes";
  if (key === "sentence-builder")
    return lang === "en"
      ? "Translate this sentence"
      : "Traduisez cette phrase";
  if (key === "writing")
    return lang === "en"
      ? "Translate this sentence"
      : "Traduisez cette phrase";
  if (key === "writing-blind")
    return lang === "en" ? "Write in Thai" : "Écrivez en thaï";
  if (key === "free-typing")
    return lang === "en"
      ? "Type the correct translation"
      : "Tapez la bonne traduction";
  return null;
};

function LessonPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    completeLesson,
    lessonLevels,
    language,
    completedLessons,
    unlockedLessons,
    _hasHydrated,
    showRomanization,
    setShowRomanization,
    setLastActiveUnitIndex,
    setLastPlayedLesson,
    hiddenInstructions,
    hideInstruction,
    unhideInstruction,
  } = useProgressStore();

  const lessonId = params.id as string;
  const requestedLevelStr = searchParams.get("level");
  const isDev = searchParams.has("dev");

  // Resolve lesson and exercises directly to avoid useEffect setState
  const lesson = data.lessons.find((l) => l.id === lessonId) || null;
  const savedLevel = lesson ? lessonLevels[lesson.id] || 0 : 0;

  // Use requested level if provided, otherwise the saved level
  const currentLevel = requestedLevelStr
    ? isDev
      ? Math.max(0, parseInt(requestedLevelStr, 10) - 1)
      : Math.min(savedLevel, Math.max(0, parseInt(requestedLevelStr, 10) - 1))
    : savedLevel;

  // We generate exercises only on the client inside useEffect to avoid hydration mismatched caused by Math.random().
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Interaction State
  const [selectedAnswer, setSelectedAnswer] = useState<
    string | string[] | null
  >(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const earnedStars = mistakes < 2 ? 3 : mistakes < 4 ? 2 : 1;

  const [exercisesGeneratedFor, setExercisesGeneratedFor] = useState<{
    id: string;
    level: number;
  } | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [acknowledgedInstructions, setAcknowledgedInstructions] = useState<
    Set<string>
  >(new Set());

  const currentExerciseTop = exercises[currentIndex];
  // Calculate instruction key here to use it in useEffect
  const instructionKeyTop = getInstructionKey(currentExerciseTop);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (instructionKeyTop) {
      setDontShowAgain(hiddenInstructions.includes(instructionKeyTop));
    }
  }, [instructionKeyTop, hiddenInstructions, showHelpModal]);

  useEffect(() => {
    // Ensure we don't start redirecting or generating if we haven't loaded local data
    if (!_hasHydrated) return;

    if (!lesson) {
      router.push("/learn");
      return;
    }

    // Only check unlock initially or if not generated
    if (
      !exercisesGeneratedFor ||
      exercisesGeneratedFor.id !== lesson.id ||
      exercisesGeneratedFor.level !== currentLevel
    ) {
      const isDevLocal = new URLSearchParams(window.location.search).has("dev");
      // All lessons are now unlocked horizontally, so no redirect is needed.
      preloadThaiVoices();
      setExercises(
        generateExercises(lesson, data.lessons, currentLevel, language),
      );
      setCurrentIndex(0);
      setIsFinished(false);
      setIsChecking(false);
      setIsCorrect(null);
      setSelectedAnswer(null);
      setMistakes(0);
      setExercisesGeneratedFor({ id: lesson.id, level: currentLevel });
    }
  }, [
    lesson,
    router,
    currentLevel,
    language,
    completedLessons,
    _hasHydrated,
    lessonId,
    unlockedLessons,
    exercisesGeneratedFor,
  ]);

  if (!isClient || !_hasHydrated || !lesson || exercises.length === 0)
    return <div className="p-8 text-center">Chargement...</div>;

  const currentExercise = exercises[currentIndex];
  const progress = (currentIndex / exercises.length) * 100;

  const handleCheck = (overrideAnswer?: any) => {
    if (currentExercise.type === "intro") {
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsChecking(false);
        setIsCorrect(null);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
        completeLesson(lesson.id, 10 + exercises.length, currentLevel, earnedStars);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
      return;
    }

    if (isChecking) {
      // Move to next exercise
      if (isCorrect) {
        if (currentIndex < exercises.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsChecking(false);
          setIsCorrect(null);
          setSelectedAnswer(null);
        } else {
          // Finished
          setIsFinished(true);
          completeLesson(lesson.id, 10 + exercises.length, currentLevel, earnedStars);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } else {
        // If wrong, we re-add the exercise to the end!
        setExercises([...exercises, currentExercise]);
        setCurrentIndex(currentIndex + 1);
        setIsChecking(false);
        setIsCorrect(null);
        setSelectedAnswer(null);
      }
      return;
    }

    // Validate
    const answerToCheck =
      typeof overrideAnswer === "string" ? overrideAnswer : selectedAnswer;
    if (!answerToCheck) return;

    let correct = false;
    if (currentExercise.type === "word-match") {
      correct = answerToCheck === currentExercise.answer;
    } else if (currentExercise.type === "sentence-builder") {
      const builtSentence = (answerToCheck as string[])
        .join("")
        .replace(/\s+/g, "");
      const expectedSentence = currentExercise.answer
        .replace(/\s+/g, "")
        .replace(/\.\.\./g, "");
      correct = builtSentence === expectedSentence;
    } else if (currentExercise.type === "writing") {
      const builtValue = (answerToCheck as string[])
        .join("")
        .replace(/\s+/g, "");
      const targetValue = currentExercise.answer.replace(/\s+/g, "");
      correct = builtValue === targetValue;
    } else if (currentExercise.type === "free-typing") {
      const builtValue =
        typeof answerToCheck === "string"
          ? answerToCheck.replace(/\s+/g, "")
          : "";
      const targetValue = currentExercise.answer.replace(/\s+/g, "");

      const levenshtein = (a: string, b: string): number => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = Array.from({ length: a.length + 1 }, () =>
          new Array(b.length + 1).fill(0),
        );
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
          for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + cost,
            );
          }
        }
        return matrix[a.length][b.length];
      };

      const editDist = levenshtein(builtValue, targetValue);
      const similarity =
        1 - editDist / Math.max(builtValue.length, targetValue.length);
      correct = similarity >= 0.8;
    }

    setIsCorrect(correct);
    if (!correct) {
      setLastPlayedLesson(lessonId, 'learn');
      setMistakes(m => m + 1);
    }
    setIsChecking(true);
    playThaiTTS(currentExercise.answer);
  };

  if (isFinished) {
    const lessonIndex = data.lessons.findIndex((l) => l.id === lesson.id);
    const unitEndIndices = [11, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    let currentUnitIndex = unitEndIndices.findIndex((idx) => lessonIndex < idx);
    if (currentUnitIndex === -1 && lessonIndex >= 0)
      currentUnitIndex = unitEndIndices.length - 1;
    const isEndOfUnit = unitEndIndices.includes(lessonIndex + 1);
    const nextUnitIndex =
      isEndOfUnit &&
      currentUnitIndex !== -1 &&
      currentUnitIndex < unitEndIndices.length - 1
        ? currentUnitIndex + 1
        : -1;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFA] font-sans">
        <div className="text-orange-500 mb-2">
          <Check size={80} className="mx-auto" />
        </div>
        <div className="flex gap-2 mb-6">
           {Array.from({ length: 3 }).map((_, i) => (
             <motion.div 
               key={i} 
               initial={{ scale: 0, rotate: -45 }} 
               animate={{ scale: 1, rotate: 0 }} 
               transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
             >
                <Star size={48} className={i < earnedStars ? "fill-amber-400 text-amber-500" : "fill-slate-200 text-slate-300 drop-shadow-sm"} />
             </motion.div>
           ))}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2 text-center">
          {language === "en"
            ? `Level ${currentLevel + 1} completed!`
            : `Niveau ${currentLevel + 1} terminé !`}
        </h1>
        <p className="text-slate-500 mb-8 text-center text-lg font-medium">
          + {10 + exercises.length} XP
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          {nextUnitIndex !== -1 && (
            <button
              onClick={() => {
                setLastActiveUnitIndex(nextUnitIndex);
                router.push("/learn");
              }}
              className="px-8 py-3 flex-1 rounded-xl bg-amber-500 border-b-4 border-amber-700 text-white font-bold text-lg shadow-lg hover:bg-amber-400 hover:scale-[1.02] active:scale-95 transition-all text-center"
            >
              {language === "en" ? "Next Unit" : "Aller à l'unité suivante"}
            </button>
          )}
          {currentLevel + 1 < 9 && (
            <button
              onClick={() =>
                router.push(`/lesson/${lesson.id}?level=${currentLevel + 2}`)
              }
              className="px-8 py-3 flex-1 rounded-xl bg-indigo-500 border-b-4 border-indigo-700 text-white font-bold text-lg shadow-lg hover:bg-indigo-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-center"
            >
              {language === "en" ? "Next Level" : "Prochain Niveau"}
            </button>
          )}
          <button
            onClick={() => router.push(`/learn#lesson-${lesson.id}`)}
            className="px-8 py-3 flex-1 rounded-xl bg-emerald-500 border-b-4 border-emerald-700 text-white font-bold text-lg shadow-lg hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-center"
          >
            {language === "en" ? "Back" : "Retour"}
          </button>
        </div>
      </div>
    );
  }

  const isAnswerComplete =
    currentExercise.type === "intro"
      ? true
      : currentExercise.type === "free-typing"
        ? typeof selectedAnswer === "string" && selectedAnswer.trim().length >= Math.max(1, currentExercise.answer.replace(/\s+/g, "").length - 1)
        : (currentExercise.type === "writing" ||
              currentExercise.type === "sentence-builder") &&
            currentExercise.correctComponents
          ? Array.isArray(selectedAnswer) &&
            selectedAnswer.length ===
              currentExercise.correctComponents.filter((c) => c !== "w_dots")
                .length
          : selectedAnswer !== null &&
            (!Array.isArray(selectedAnswer) ||
              (selectedAnswer as any[]).length > 0);

  const showFooter =
    (currentExercise.type !== "pair-matching" || (isChecking && !isCorrect)) &&
    (isChecking || isAnswerComplete);

  const instructionKey = getInstructionKey(currentExercise);
  const instructionText = getInstructionText(instructionKey, language);
  const isAcknowledged = instructionKey
    ? acknowledgedInstructions.has(instructionKey) || hiddenInstructions.includes(instructionKey)
    : true;

  const showInstruction = !!(instructionText && !isAcknowledged);

  return (
    <div className="h-[100dvh] flex flex-col bg-[#FAFAFA] font-sans text-slate-800 overflow-hidden relative">
      {/* Header / Progress bar */}
      <header className="h-16 flex items-center shrink-0 justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 sm:gap-6 w-full max-w-3xl mx-auto h-full px-4 flex-1">
          <button
            onClick={() => router.push(`/learn#lesson-${lesson.id}`)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
          
          <div className="flex font-bold text-slate-400 text-sm sm:text-base items-center shrink-0">
            {language === "en" ? "Lvl." : "Niv."} {currentLevel + 1}
          </div>

          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden min-w-[2rem]">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="font-bold text-slate-400 flex items-center gap-2 sm:gap-3 text-sm sm:text-base shrink-0">
            <div className="hidden sm:flex items-center gap-0.5 mr-1">
               {Array.from({ length: 3 }).map((_, i) => (
                  <Star key={i} size={16} className={i < earnedStars ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
               ))}
            </div>
            {currentLevel + 1 < 9 ? (
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="m9 18 6-6-6-6"/></svg>
                {language === "en" ? "Lvl." : "Niv."} {currentLevel + 2}
              </span>
            ) : (
              <span className="flex items-center text-amber-500">
                <Crown size={18} className="fill-current stroke-[2.5]" />
              </span>
            )}
            
            <span className="bg-slate-100 text-slate-500 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md font-semibold shrink-0 ml-1">
               {currentIndex + 1} / {exercises.length}
            </span>

            {!currentExercise?.forceHideRomanization && (
              <button
                onClick={() => setShowRomanization(!showRomanization)}
                className={`w-9 h-9 flex flex-col items-center justify-center rounded-xl font-bold border-2 transition-colors ${showRomanization ? "border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100" : "border-slate-200 text-slate-400 bg-white hover:bg-slate-100"}`}
                title={
                  showRomanization
                    ? language === "en"
                      ? "Hide Pronunciation"
                      : "Masquer la prononciation"
                    : language === "en"
                      ? "Show Pronunciation"
                      : "Afficher la prononciation"
                }
              >
                <span className="text-xs font-mono">
                  {showRomanization ? "aA" : "ก"}
                </span>
              </button>
            )}

            <button
              onClick={() => setShowInfoModal(true)}
              className="text-slate-400 hover:text-indigo-500 transition-colors p-1"
              title={
                language === "en" ? "Vocabulary List" : "Liste de vocabulaire"
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Exercise Area */}
      <main className="flex-1 flex flex-col w-full relative">
        {/* Glossary Modal */}
        {showInfoModal && (
          <div className="absolute inset-0 z-[60] flex flex-col bg-white">
            <header className="h-16 px-8 flex items-center shrink-0 border-b border-slate-200 justify-between bg-white sticky top-0">
              <h2 className="text-xl font-bold text-slate-800">
                {language === "en" ? "Vocabulary List" : "Liste de vocabulaire"}
              </h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
              <div className="max-w-3xl mx-auto space-y-4">
                {lesson.words.map((word) => (
                  <div
                    key={word.id}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer"
                    onClick={() => playThaiTTS(word.th)}
                  >
                    <div>
                      <div className="text-xl font-thai font-semibold text-emerald-600">
                        {word.th}
                      </div>
                      {showRomanization && (
                        <div className="text-sm font-bold text-slate-500 mt-1">
                          {word.phonetic}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-slate-700 font-medium">
                      {language === "en" ? word.en || word.fr : word.fr}
                    </div>
                  </div>
                ))}
                {lesson.phrases.map((phrase) => (
                  <div
                    key={phrase.id}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer gap-2"
                    onClick={() => playThaiTTS(phrase.th)}
                  >
                    <div>
                      <div className="text-xl font-thai font-semibold text-emerald-600">
                        {phrase.th}
                      </div>
                      {showRomanization && (
                        <div className="text-sm font-bold text-slate-500 mt-1">
                          {phrase.phonetic}
                        </div>
                      )}
                    </div>
                    <div className="sm:text-right text-slate-700 font-medium">
                      {language === "en" ? phrase.en || phrase.fr : phrase.fr}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* The Question / Hint System */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center md:justify-center md:overflow-y-auto hide-scrollbar"
          >
            {/* Instruction Screen */}
            {(showInstruction || showHelpModal) && (
              <div className="absolute inset-0 z-[200] flex flex-col items-center justify-start flex-1 w-full bg-gradient-to-b from-amber-50 to-white text-center animate-in fade-in duration-500 overflow-y-auto pb-8">
                <div className="w-full bg-amber-100/80 py-2 md:py-3 text-amber-800 font-semibold flex items-center justify-center gap-2 mb-4 md:mb-6 border-b border-amber-200/50 flex-shrink-0">
                   <span className="text-xl">💡</span> {language === "en" ? "Here is how this exercise works" : "Voici comment fonctionne cet exercice"}
                </div>
                
                <div className="flex-1 flex flex-col items-center w-full px-4 md:px-6 max-w-2xl mx-auto gap-4 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
                    {instructionText}
                  </h2>

                  {/* Example box */}
                  {currentExercise.type !== "pair-matching" &&
                    currentExercise.type !== "intro" && (
                      <div className="bg-white p-5 md:p-8 rounded-3xl w-full max-w-sm sm:max-w-md md:max-w-lg border-2 border-dashed border-amber-300 shadow-sm mx-auto relative mt-2 shrink-0">
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm border border-amber-200/50">
                           <span className="w-2 h-2 rounded-full bg-amber-500 animate-[pulse_2s_ease-in-out_infinite]"></span>
                           {language === "en" ? "Example" : "Exemple"}
                        </div>
                        <InstructionExample
                          typeKey={instructionKey}
                          language={language}
                        />
                      </div>
                    )}
                    
                   <p className="text-slate-500 font-medium text-center text-sm md:text-base max-w-sm leading-relaxed mt-4 shrink-0">
                     {language === "en" ? "In the next steps, you will have to find the correct answer yourself!" : "Dans les prochaines étapes, vous devrez trouver la bonne réponse vous-même !"}
                   </p>

                  <div className="pt-4 w-full max-w-sm shrink-0 mt-auto flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-amber-100/50 transition-colors">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${dontShowAgain ? "bg-amber-500 border-amber-500 text-white" : "border-amber-300 bg-white"}`}>
                        {dontShowAgain && <Check size={16} strokeWidth={3} />}
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        {language === "en" ? "Do not show this automatically for this exercise type" : "Ne plus m'afficher cette aide automatiquement"}
                      </span>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={dontShowAgain} 
                        onChange={(e) => setDontShowAgain(e.target.checked)} 
                      />
                    </label>
                    <button
                      onClick={() => {
                        if (dontShowAgain && instructionKey) {
                          hideInstruction(instructionKey);
                        } else if (!dontShowAgain && instructionKey) {
                          unhideInstruction(instructionKey);
                        }
                        
                        if (showHelpModal) {
                          setShowHelpModal(false);
                          setAcknowledgedInstructions((prev) => {
                            const newer = new Set(prev);
                            if (instructionKey) newer.add(instructionKey);
                            return newer;
                          });
                        } else {
                          setAcknowledgedInstructions((prev) => {
                            const newer = new Set(prev);
                            if (instructionKey) newer.add(instructionKey);
                            return newer;
                          });
                        }
                      }}
                      className="w-full py-4 rounded-2xl bg-zinc-900 border-b-4 border-zinc-950 text-white font-bold text-lg shadow-lg hover:bg-zinc-800 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2"
                    >
                      {language === "en" ? "Got it" : "J'ai compris"}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Help Button - Above Exercise */}
            {!(showInstruction || showHelpModal) && instructionKey && (
              <div className="w-full max-w-3xl px-4 pt-4 md:pt-6 flex justify-end shrink-0">
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="text-slate-500 hover:text-amber-600 transition-colors bg-white rounded-full py-1.5 px-3 shadow-sm border border-slate-200 flex items-center gap-1.5 text-sm font-bold active:scale-95"
                  title={language === "en" ? "Help / Instructions" : "Aide / Instructions"}
                >
                  <HelpCircle size={18} strokeWidth={2.5} />
                  {language === "en" ? "Help" : "Aide"}
                </button>
              </div>
            )}

            {/* Scrollable Upper Area */}
            <div
              className={`${showInstruction || showHelpModal || currentExercise.type === "pair-matching" ? "hidden" : "flex"} flex-1 md:flex-none w-full max-w-3xl overflow-y-auto md:overflow-y-visible px-4 py-4 md:py-4 flex-col justify-center hide-scrollbar`}
            >
              {currentExercise.type !== "pair-matching" && (
                <>
                  {/* Container for Question Content */}
                  <div
                    className="flex flex-col items-center justify-center text-center gap-4 md:gap-8 my-auto md:my-0 w-full"
                  >
                    {/* Image Box */}
                    <div
                      className={`${
                        currentExercise.type === "intro" ||
                        currentExercise.type === "word-match" ||
                        currentExercise.type === "sentence-builder" ||
                        currentExercise.type === "free-typing" ||
                        currentExercise.type === "writing"
                          ? "flex"
                          : "hidden"
                      } ${
                        currentExercise.type === "sentence-builder" ||
                        currentExercise.type === "free-typing" ||
                        currentExercise.type === "writing"
                          ? "w-24 h-24 sm:w-32 sm:h-32 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-2xl text-5xl md:text-4xl"
                          : "w-40 h-40 sm:w-48 sm:h-48 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-3xl text-7xl md:text-5xl"
                      } mx-auto items-center justify-center relative flex-shrink-0 ${
                        (currentExercise.type === "intro" && (currentExercise.introItem as any)?.imageUrl) || currentExercise.imageUrl
                          ? "bg-transparent overflow-visible"
                          : "bg-emerald-100 shadow-sm border border-emerald-200 overflow-hidden"
                      }`}
                    >
                      {(currentExercise.type === "intro" &&
                        (currentExercise.introItem as any)?.imageUrl) ||
                      currentExercise.imageUrl ? (
                        <Image
                          src={
                            currentExercise.type === "intro"
                              ? (currentExercise.introItem as any)?.imageUrl
                              : currentExercise.imageUrl
                          }
                          alt="word"
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <span className="animate-bounce">🐘</span>
                      )}
                      {!((currentExercise.type === "intro" && (currentExercise.introItem as any)?.imageUrl) || currentExercise.imageUrl) && (
                        <div className="absolute -right-2 -top-2 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full z-10"></div>
                      )}
                    </div>

                    {/* Question Content */}
                    <div
                      className="flex-1 mt-2 md:mt-0 flex flex-col items-center w-full"
                    >
                      {/* Title logic removed as per instructions */}

                      <div
                        className="relative w-full text-center mt-2 md:mt-0"
                      >
                        {currentExercise.type === "intro" ? (
                          <div className="flex flex-col items-center gap-4">
                            <p className="text-2xl text-slate-600 font-medium">
                              {currentExercise.question}
                            </p>
                            <div
                              className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border-2 border-emerald-100 shadow-sm cursor-pointer hover:bg-emerald-50 transition-colors"
                              onClick={() =>
                                playThaiTTS(currentExercise.answer)
                              }
                            >
                              <span className="font-thai text-3xl md:text-4xl text-emerald-600 font-semibold">
                                {currentExercise.answer}
                              </span>
                              {currentExercise.introItem &&
                                showRomanization &&
                                !currentExercise.forceHideRomanization && (
                                  <div className="flex flex-col border-l-2 border-emerald-100 pl-3">
                                    <span className="font-medium text-slate-500 text-sm">
                                      {language === "en"
                                        ? "Pronunciation"
                                        : "Prononciation"}
                                    </span>
                                    <span className="font-bold text-slate-700">
                                      {currentExercise.introItem.phonetic}
                                    </span>
                                  </div>
                                )}
                              <div className="ml-2 bg-emerald-100 text-emerald-600 p-2 rounded-full">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          (() => {
                            let currentThaiWordForAudio: string | undefined;
                            if (
                              currentExercise.type === "writing" &&
                              currentExercise.blindMode &&
                              currentExercise.correctComponents &&
                              !isChecking
                            ) {
                              try {
                                const segmenter = new (
                                  globalThis as any
                                ).Intl.Segmenter("th", { granularity: "word" });
                                const fullTextNoSpaces =
                                  currentExercise.correctComponents.join("");
                                const segments: any[] = Array.from(
                                  segmenter.segment(fullTextNoSpaces),
                                ).filter(
                                  (s: any) => s.segment.trim().length > 0,
                                );

                                if (segments.length > 1) {
                                  const selectedLen = Array.isArray(
                                    selectedAnswer,
                                  )
                                    ? selectedAnswer.length
                                    : (
                                        (selectedAnswer as string) || ""
                                      ).replace(/\s+/g, "").length;
                                  const currentStrLen =
                                    currentExercise.correctComponents
                                      .slice(0, selectedLen)
                                      .join("").length;

                                  let currentWordSegment = segments.find(
                                    (s) =>
                                      s.index <= currentStrLen &&
                                      s.index + s.segment.length >
                                        currentStrLen,
                                  );
                                  if (!currentWordSegment) {
                                    currentWordSegment =
                                      segments.find(
                                        (s) => s.index > currentStrLen,
                                      ) || segments[segments.length - 1];
                                  }
                                  if (currentWordSegment) {
                                    currentThaiWordForAudio =
                                      currentWordSegment.segment;
                                  }
                                }
                              } catch (e) {}
                            }

                            return (
                              <div
                                className="flex flex-col items-center gap-4"
                              >
                                <div
                                  className="flex-1 w-full flex justify-center"
                                >
                                  <SentenceWithHints
                                    text={currentExercise.question}
                                    dictionary={lesson.words}
                                    phrases={lesson.phrases}
                                    isSentence={
                                      currentExercise.type ===
                                      "sentence-builder"
                                    }
                                    exerciseOptions={
                                      currentExercise.options as Word[]
                                    }
                                    hideHints={currentExercise.hideHints}
                                    disableTooltips={
                                      currentExercise.disableTooltips ||
                                      currentExercise.blindMode
                                    }
                                    hideColors={currentExercise.hideColors}
                                    alwaysShowPhonetic={true}
                                    answerTh={currentExercise.answer}
                                    correctComponents={
                                      currentExercise.correctComponents
                                    }
                                    isChecking={isChecking}
                                    forceHideRomanization={
                                      currentExercise.forceHideRomanization
                                    }
                                    currentThaiWordForAudio={
                                      currentThaiWordForAudio
                                    }
                                    rightElement={
                                      (currentExercise.type === "word-match" || 
                                       (currentExercise.type === "writing" &&
                                        currentExercise.blindMode &&
                                        currentExercise.correctComponents &&
                                        !isChecking)) ? (
                                        <button
                                          onClick={() =>
                                            playThaiTTS(currentExercise.answer)
                                          }
                                          className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 p-2 rounded-full transition-colors flex-shrink-0 ml-2"
                                          title={
                                            language === "en"
                                              ? "Listen to pronunciation"
                                              : "Écouter la prononciation"
                                          }
                                        >
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                                        </button>
                                      ) : undefined
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })()
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Exercise Options (Fixed at bottom on Mobile) */}
            <div
              className={`${showInstruction || showHelpModal ? "hidden" : "flex"} ${currentExercise.type === "pair-matching" ? "flex-1 items-center" : "shrink-0 md:shrink-0"} bg-transparent px-4 pb-4 pt-2 md:pt-4 md:pb-8 justify-center z-10 w-full max-w-3xl`}
            >
              <div className="w-full relative">
                {currentExercise.type ===
                "intro" ? null : currentExercise.type === "word-match" ? (
                  <WordMatch
                    exercise={currentExercise}
                    selected={selectedAnswer as string}
                    onChange={setSelectedAnswer}
                    disabled={isChecking}
                    onAutoCheck={() => handleCheck(currentExercise.answer)}
                  />
                ) : currentExercise.type === "pair-matching" ? (
                  <PairMatch
                    key={currentExercise.id}
                    pairs={currentExercise.pairs as Word[]}
                    mode={currentExercise.pairMatchMode}
                    forceHideRomanization={
                      currentExercise.forceHideRomanization
                    }
                    disabled={isChecking}
                    onComplete={(failed?: boolean) => {
                      if (failed) {
                        setIsCorrect(false);
                        setIsChecking(true);
                        setMistakes((m) => m + 1);
                        setLastPlayedLesson(lessonId, 'learn');
                        playThaiTTS("ผิดครับ");
                      } else {
                        if (currentIndex < exercises.length - 1) {
                          setCurrentIndex((prev) => prev + 1);
                          setIsChecking(false);
                          setIsCorrect(null);
                          setSelectedAnswer(null);
                        } else {
                          setIsFinished(true);
                          completeLesson(
                            lesson.id,
                            10 + exercises.length,
                            currentLevel,
                          );
                          confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 },
                          });
                        }
                      }
                    }}
                  />
                ) : currentExercise.type === "writing" ? (
                  <VirtualKeyboard
                    exercise={currentExercise}
                    selected={(selectedAnswer as string[]) || []}
                    onChange={setSelectedAnswer as any}
                    disabled={isChecking}
                  />
                ) : currentExercise.type === "free-typing" ? (
                  <FreeTypingInput
                    exercise={currentExercise}
                    selected={(selectedAnswer as string) || ""}
                    onChange={setSelectedAnswer as any}
                    disabled={isChecking}
                  />
                ) : (
                  <SentenceBuilder
                    exercise={currentExercise}
                    selected={(selectedAnswer as string[]) || []}
                    onChange={setSelectedAnswer as any}
                    disabled={isChecking}
                  />
                )}
              </div>
            </div>
            {/* The transparent spacer to allow footer absolute positioning without overlapping options */}
            <div
              className="hidden"
            ></div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      {(currentExercise.type !== "pair-matching" || (isChecking && !isCorrect)) && (
        <>
          <AnimatePresence>
            {showFooter && (
              <motion.footer
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute bottom-0 left-0 right-0 w-full min-h-[100px] md:min-h-[128px] py-4 md:py-0 border-t-2 items-center justify-center flex transition-colors duration-300 z-50 ${isChecking ? (isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200 shadow-[0_-10px_40px_rgba(244,63,94,0.1)]") : "bg-white border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"}`}
              >
                <div className="w-full max-w-2xl px-4 flex sm:flex-row flex-col items-center justify-between gap-4">
                  <div className="flex-1 w-full text-center sm:text-left">
                    {isChecking && isCorrect && (
                      <div className="flex items-center justify-center sm:justify-start gap-3 text-emerald-600 font-extrabold text-xl">
                        <div className="bg-white text-emerald-500 rounded-full p-1">
                          <Check size={24} strokeWidth={3} />
                        </div>
                        {language === "en" ? "Excellent!" : "Excellent !"}
                      </div>
                    )}
                    {isChecking && !isCorrect && (
                      <div className="flex flex-col text-rose-600 font-extrabold text-xl gap-1 items-center sm:items-start">
                        <div className="flex items-center gap-3">
                          <div className="bg-white text-rose-500 rounded-full p-1">
                            <X size={24} strokeWidth={3} />
                          </div>
                          {language === "en" ? "Incorrect." : "Incorrect."}
                          {currentExercise.type === "writing" &&
                            currentExercise.blindMode &&
                            currentExercise.correctComponents && (
                              <span className="text-sm font-bold opacity-80 ml-2">
                                {Math.round(
                                  (((selectedAnswer as string[]) || []).filter(
                                    (c: string, i: number) =>
                                      c ===
                                      currentExercise.correctComponents![i],
                                  ).length /
                                    currentExercise.correctComponents!.length) *
                                    100,
                                )}
                                % {language === "en" ? "match" : "réussite"}
                              </span>
                            )}
                          {currentExercise.type === "free-typing" &&
                            typeof selectedAnswer === "string" && (
                              <span className="text-sm font-bold opacity-80 ml-2">
                                {Math.round(
                                  (1 -
                                    (() => {
                                      const a = selectedAnswer.replace(
                                        /\s+/g,
                                        "",
                                      );
                                      const b = currentExercise.answer.replace(
                                        /\s+/g,
                                        "",
                                      );
                                      if (a.length === 0)
                                        return b.length / Math.max(1, b.length);
                                      if (b.length === 0)
                                        return a.length / Math.max(1, a.length);
                                      const matrix = Array.from(
                                        { length: a.length + 1 },
                                        () => new Array(b.length + 1).fill(0),
                                      );
                                      for (let i = 0; i <= a.length; i++)
                                        matrix[i][0] = i;
                                      for (let j = 0; j <= b.length; j++)
                                        matrix[0][j] = j;
                                      for (let i = 1; i <= a.length; i++) {
                                        for (let j = 1; j <= b.length; j++) {
                                          const cost =
                                            a[i - 1] === b[j - 1] ? 0 : 1;
                                          matrix[i][j] = Math.min(
                                            matrix[i - 1][j] + 1,
                                            matrix[i][j - 1] + 1,
                                            matrix[i - 1][j - 1] + cost,
                                          );
                                        }
                                      }
                                      return (
                                        matrix[a.length][b.length] /
                                        Math.max(a.length, b.length)
                                      );
                                    })()) *
                                    100,
                                )}
                                % {language === "en" ? "match" : "réussite"}
                              </span>
                            )}
                        </div>
                        <div className="text-rose-800 text-sm mt-1 uppercase tracking-widest">
                          {language === "en"
                            ? "Correct answer:"
                            : "Réponse correcte :"}
                        </div>
                        <div className="font-medium font-thai text-xl md:text-2xl mt-1 sm:mt-0">
                          {currentExercise.type === "writing" &&
                          currentExercise.blindMode &&
                          currentExercise.correctComponents ? (
                            (() => {
                              const isCombiningLocal = (charStr: string) => {
                                if (!charStr) return false;
                                const code = charStr.charCodeAt(0);
                                return (
                                  code === 0x0e31 ||
                                  (code >= 0x0e34 && code <= 0x0e3a) ||
                                  (code >= 0x0e47 && code <= 0x0e4e)
                                );
                              };
                              const clusters: {
                                chars: string;
                                isMatch: boolean;
                              }[] = [];
                              currentExercise.correctComponents.forEach(
                                (char, i) => {
                                  const typedChar =
                                    ((selectedAnswer as string[]) || [])[i];
                                  const isMatch = typedChar === char;

                                  if (
                                    clusters.length === 0 ||
                                    !isCombiningLocal(char)
                                  ) {
                                    clusters.push({ chars: char, isMatch });
                                  } else {
                                    clusters[clusters.length - 1].chars += char;
                                    if (!isMatch) {
                                      clusters[clusters.length - 1].isMatch =
                                        false;
                                    }
                                  }
                                },
                              );

                              return clusters.map((cluster, idx) => (
                                <span
                                  key={`ans-cluster-${idx}`}
                                  className={
                                    cluster.isMatch
                                      ? "text-emerald-600"
                                      : "text-rose-600"
                                  }
                                >
                                  {cluster.chars}
                                </span>
                              ));
                            })()
                          ) : (
                            <span className="text-rose-900">
                              {currentExercise.answer}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    id="next-btn"
                    onClick={handleCheck}
                    disabled={
                      currentExercise.type !== "intro" &&
                      !isChecking &&
                      (!selectedAnswer ||
                        (Array.isArray(selectedAnswer) &&
                          (currentExercise.type === "writing" &&
                          currentExercise.correctComponents
                            ? selectedAnswer.length !==
                              currentExercise.correctComponents.length
                            : selectedAnswer.length === 0)))
                    }
                    className={`w-full sm:w-auto px-12 py-3 rounded-xl border-b-4 font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 disabled:scale-100 disabled:shadow-none
              ${
                currentExercise.type === "intro"
                  ? "bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400"
                  : isChecking
                    ? isCorrect
                      ? "bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400"
                      : "bg-rose-500 border-rose-700 text-white hover:bg-rose-400"
                    : "bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400"
              }
            `}
                  >
                    {currentExercise.type === "intro" || isChecking
                      ? language === "en"
                        ? "Continue"
                        : "Continuer"
                      : language === "en"
                        ? "Check"
                        : "Vérifier"}
                  </button>
                </div>
              </motion.footer>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center min-h-screen bg-[#FAFAFA]">
          Chargement...
        </div>
      }
    >
      <LessonPageContent />
    </Suspense>
  );
}
