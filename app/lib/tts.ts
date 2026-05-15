let currentAudio: HTMLAudioElement | null = null;
let lastTtsText = '';
let lastTtsTime = 0;

export const playThaiTTS = (text: string) => {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  if (text === lastTtsText && now - lastTtsTime < 300) {
    return; // deduplicate rapid identical calls
  }
  lastTtsText = text;
  lastTtsTime = now;

  try {
    const url = `/api/tts?text=${encodeURIComponent(text)}`;
    
    if (!currentAudio) {
      currentAudio = new Audio(url);
    } else {
      currentAudio.pause();
      currentAudio.src = url;
      currentAudio.load();
    }
    
    currentAudio.play().catch((e: Error) => {
      if (e.name === 'AbortError') {
        // AbortError means the play() was interrupted by a new play() or pause() 
        // We shouldn't fallback to local TTS, as the new audio will play or user intentionally stopped it
        return;
      }
      console.warn("Google TTS API playback failed, falling back to local speech synthesis:", e);
      fallbackTTS(text);
    });
  } catch (e) {
    console.warn("Audio playback failed:", e);
    fallbackTTS(text);
  }
};

export const playThaiTTSAsync = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    
    const now = Date.now();
    if (text === lastTtsText && now - lastTtsTime < 300) {
      resolve(); // ignore rapid identical calls
      return;
    }
    lastTtsText = text;
    lastTtsTime = now;

    try {
      const url = `/api/tts?text=${encodeURIComponent(text)}`;
      
      if (!currentAudio) {
        currentAudio = new Audio(url);
      } else {
        currentAudio.pause();
        currentAudio.src = url;
        currentAudio.load();
      }
      
      const handleEnded = () => {
        currentAudio?.removeEventListener('ended', handleEnded);
        currentAudio?.removeEventListener('error', handleFallback);
        resolve();
      };
      
      const handleFallback = () => {
        currentAudio?.removeEventListener('ended', handleEnded);
        currentAudio?.removeEventListener('error', handleFallback);
        fallbackTTSAsync(text).then(resolve).catch(() => resolve());
      };
      
      currentAudio.addEventListener('ended', handleEnded);
      currentAudio.addEventListener('error', handleFallback);
      
      currentAudio.play().catch((e: Error) => {
        if (e.name === 'AbortError') {
          resolve();
          return;
        }
        console.warn("Google TTS API playback failed in async, falling back:", e);
        handleFallback();
      });
    } catch (e) {
      console.warn("Audio playback failed async:", e);
      fallbackTTSAsync(text).then(resolve).catch(() => resolve());
    }
  });
};

const fallbackTTSAsync = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.rate = 0.8;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};

const fallbackTTS = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'th-TH';
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
};

export const preloadThaiVoices = () => {
  // Local TTS preloading if fallback is needed
  if (typeof window === 'undefined') return;
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  } catch (e) {
    // ignore
  }
};
