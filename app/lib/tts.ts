let currentAudio: HTMLAudioElement | null = null;

export const playThaiTTS = (text: string) => {
  if (typeof window === 'undefined') return;
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // Use our internal proxy API to bypass CORS and Adblockers (ERR_BLOCKED_BY_CLIENT)
    const url = `/api/tts?text=${encodeURIComponent(text)}`;
    currentAudio = new Audio(url);
    
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
