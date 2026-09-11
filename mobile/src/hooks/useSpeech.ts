import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';

const VOICE_CONFIG: Record<string, { language: string; rate: number; pitch: number }> = {
  en: { language: 'en-IN', rate: 0.9, pitch: 1.0 },
  hi: { language: 'hi-IN', rate: 0.85, pitch: 1.0 },
  gu: { language: 'gu-IN', rate: 0.85, pitch: 1.0 },
};

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const speak = useCallback(async (text: string, language: string = 'en') => {
    try {
      await Speech.stop();
      const config = VOICE_CONFIG[language] || VOICE_CONFIG.en;

      Speech.speak(text, {
        language: config.language,
        rate: config.rate,
        pitch: config.pitch,
        onStart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
        },
        onDone: () => {
          setIsSpeaking(false);
          setIsPaused(false);
        },
        onStopped: () => {
          setIsSpeaking(false);
          setIsPaused(false);
        },
        onError: () => {
          setIsSpeaking(false);
          setIsPaused(false);
        },
      });
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(async () => {
    await Speech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(async () => {
    await Speech.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(async () => {
    await Speech.resume();
    setIsPaused(false);
  }, []);

  return { speak, stop, pause, resume, isSpeaking, isPaused };
}
