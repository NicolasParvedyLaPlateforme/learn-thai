let currentAudio: HTMLAudioElement | null = null;

export const playThaiTTS = (text: string) => {
  if (typeof window === 'undefined') return;
  try {
    const url = `/api/tts?text=${encodeURIComponent(text)}`;
    
    if (!currentAudio) {
      currentAudio = new Audio(url);
    } else {
      currentAudio.pause();
      currentAudio.src = url;
      currentAudio.load();
    }
    
    currentAudio.play().catch(e => {
      console.warn("Google TTS API playback failed, falling back to local speech synthesis:", e);
      fallbackTTS(text);
    });
  } catch (e) {
    console.warn("Audio playback failed:", e);
    fallbackTTS(text);
  }
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
