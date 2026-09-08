import { SupportedLanguage } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;

const langCodeMap: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
};

export function speakText(
  text: string,
  lang: SupportedLanguage,
  onEnd?: () => void,
  onError?: (e: any) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this environment.');
    return false;
  }

  stopSpeaking();

  try {
    // Clean markdown/symbols
    const cleanText = text
      .replace(/[#*_`~[\]]/g, ' ')
      .replace(/₹/g, 'Rupees ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCodeMap[lang] || 'hi-IN';
    utterance.rate = 0.92; // Slightly slower pace for clarity
    utterance.pitch = 1.0;

    // Pick a regional voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('Speech synthesis error:', err);
      currentUtterance = null;
      if (onError) onError(err);
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Failed to trigger speech synthesis:', err);
    if (onError) onError(err);
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
