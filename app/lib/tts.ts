export const playThaiTTS = (text: string) => {
  if (typeof window === 'undefined') return;
  try {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    
    // Get loaded voices
    const voices = window.speechSynthesis.getVoices();
    const thaiVoices = voices.filter(voice => voice.lang.includes('th') || voice.lang.includes('TH'));
    
    if (thaiVoices.length > 0) {
      // Exclude known male names like 'niwat' or 'male'
      const safeVoices = thaiVoices.filter(v => {
        const name = v.name.toLowerCase();
        return !name.includes('male') && !name.includes('niwat') && !name.includes('pattara');
      });

      // Prioritize known female voices
      const bestVoice = safeVoices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('narisa') || 
        v.name.toLowerCase().includes('kanya') ||
        v.name.toLowerCase().includes('premwadee') ||
        v.name.toLowerCase().includes('siri female') ||
        v.name.includes('Google')
      );
      
      utterance.voice = bestVoice || safeVoices[0] || thaiVoices[0];
    }
    
    utterance.pitch = 1.1; // Increase pitch slightly to sound more feminine if fallback is used
    utterance.rate = 0.8; // Slow down slightly for better clarity
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("speechSynthesis is not available or blocked:", e);
  }
};

export const preloadThaiVoices = () => {
  if (typeof window === 'undefined') return;
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        try {
          window.speechSynthesis.getVoices();
        } catch (e) {
          // ignore
        }
      };
    }
  } catch (e) {
    console.warn("speechSynthesis is not available or blocked:", e);
  }
};
