import { useState, useCallback, useEffect } from 'react';
import * as Speech from 'expo-speech';

// Module-level cached voices to prevent repeated IPC queries
let cachedVoices: Speech.Voice[] = [];
let isFetchingVoices = false;

async function loadAvailableVoices(): Promise<Speech.Voice[]> {
  if (cachedVoices.length > 0) return cachedVoices;
  if (isFetchingVoices) return [];
  isFetchingVoices = true;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    cachedVoices = Array.isArray(voices) ? voices : [];
  } catch (e) {
    cachedVoices = [];
  } finally {
    isFetchingVoices = false;
  }
  return cachedVoices;
}

// Immediately initiate voice fetching on module load
loadAvailableVoices();

/**
 * Transforms raw database text, AI responses, or markdown summaries into a
 * natural, warm, human-spoken heritage tour guide narrative.
 *
 * Removes:
 *  - Emojis, icons, variation selectors
 *  - Markdown headers, bold, italics, code blocks
 *  - Bureaucratic registry codes (ASI ID, UNESCO serials, GPS coordinates)
 *
 * Enhances:
 *  - Acronyms expanded into full respectful titles ("Archaeological Survey of India")
 *  - Historical dates and centuries formatted for natural cadence
 *  - Punctuation structured with micro-pauses for natural human breathing
 */
export function humanizeHeritageNarration(text: string, language: string = 'en'): string {
  if (!text) return '';
  let clean = text;

  // 1. Remove emojis, decorative symbols, and variation selectors
  clean = clean.replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]/gu, '');

  // 2. Remove markdown code blocks, bold, italics, headers, links
  clean = clean.replace(/```[\s\S]*?```/g, '');
  clean = clean.replace(/`([^`]+)`/g, '$1');
  clean = clean.replace(/\*\*([^*]+)\*\*/g, '$1');
  clean = clean.replace(/\*([^*]+)\*/g, '$1');
  clean = clean.replace(/__([^_]+)__/g, '$1');
  clean = clean.replace(/_([^_]+)_/g, '$1');
  clean = clean.replace(/^#{1,6}\s+/gm, '');
  clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 3. Remove robotic database tags and bureaucratic coordinates
  clean = clean.replace(/\bASI\s*ID:\s*[^,.)\n]+/gi, '');
  clean = clean.replace(/\bUNESCO:\s*[^,.)\n]+/gi, '');
  clean = clean.replace(/\bCoordinates:\s*[^,.)\n]+/gi, '');
  clean = clean.replace(/\b\d+(\.\d+)?°\s*[NSEW]/gi, '');
  clean = clean.replace(/\bPosition:\s*[^,.)\n]+/gi, '');
  clean = clean.replace(/\bCentrally Protected Monument\b/gi, 'Protected national monument');

  // 4. Natural historical dates & timeframes
  clean = clean.replace(/\b(\d{3,4})\s*CE\b/gi, '$1');
  clean = clean.replace(/\b(\d{3,4})\s*BCE\b/gi, '$1 Before Common Era');
  clean = clean.replace(/\b1st\s+Century\b/gi, 'first century');
  clean = clean.replace(/\b2nd\s+Century\b/gi, 'second century');
  clean = clean.replace(/\b3rd\s+Century\b/gi, 'third century');
  clean = clean.replace(/\b4th\s+Century\b/gi, 'fourth century');
  clean = clean.replace(/\b5th\s+Century\b/gi, 'fifth century');
  clean = clean.replace(/\b6th\s+Century\b/gi, 'sixth century');
  clean = clean.replace(/\b7th\s+Century\b/gi, 'seventh century');
  clean = clean.replace(/\b8th\s+Century\b/gi, 'eighth century');
  clean = clean.replace(/\b9th\s+Century\b/gi, 'ninth century');
  clean = clean.replace(/\b10th\s+Century\b/gi, 'tenth century');
  clean = clean.replace(/\b11th\s+Century\b/gi, 'eleventh century');
  clean = clean.replace(/\b12th\s+Century\b/gi, 'twelfth century');
  clean = clean.replace(/\b13th\s+Century\b/gi, 'thirteenth century');
  clean = clean.replace(/\b14th\s+Century\b/gi, 'fourteenth century');
  clean = clean.replace(/\b15th\s+Century\b/gi, 'fifteenth century');
  clean = clean.replace(/\b16th\s+Century\b/gi, 'sixteenth century');
  clean = clean.replace(/\b17th\s+Century\b/gi, 'seventeenth century');
  clean = clean.replace(/\b18th\s+Century\b/gi, 'eighteenth century');
  clean = clean.replace(/\b19th\s+Century\b/gi, 'nineteenth century');
  clean = clean.replace(/\b20th\s+Century\b/gi, 'twentieth century');
  clean = clean.replace(/\b21st\s+Century\b/gi, 'twenty-first century');

  // 5. Expand abbreviations into natural words
  clean = clean.replace(/\bASI\b/g, 'Archaeological Survey of India');
  clean = clean.replace(/\bUNESCO\b/g, 'Unesco');
  clean = clean.replace(/\bkm\b/g, ' kilometers');
  clean = clean.replace(/\bapprox\.\b/gi, 'approximately');
  clean = clean.replace(/&/g, ' and ');

  // 6. Conversational phrasing for double dates e.g. "(1498 (Late 15th century))"
  clean = clean.replace(/\(\s*(\d{3,4})\s*\(([^)]+)\)\s*\)/g, 'built around $1, during the $2,');

  // 7. Natural speech pauses for bullet points & section markers
  clean = clean.replace(/^\s*[•\-\*]\s+/gm, ' In addition, ');

  // 8. Clean nested and dangling parentheses from stripped metadata
  clean = clean.replace(/\(\s*\)/g, '');
  clean = clean.replace(/\(\s*,/g, '(');
  clean = clean.replace(/,\s*\)/g, ')');
  clean = clean.replace(/\(\s*\)/g, '');

  // 9. Clean trailing double punctuation and spaces
  clean = clean.replace(/[,;]\s*([.!?])/g, '$1');
  clean = clean.replace(/[.,;]\s*([.,;])/g, '$1');
  clean = clean.replace(/\s+/g, ' ');
  clean = clean.replace(/\s+([.,;:!?])/g, '$1');
  clean = clean.replace(/([.,;:!?])([A-Za-z])/g, '$1 $2');

  return clean.trim();
}

/**
 * Selects the highest quality neural, network, or enhanced voice available
 * for a given language from the device TTS engine.
 */
function selectBestVoice(voices: Speech.Voice[], lang: string): string | undefined {
  if (!voices || voices.length === 0) return undefined;
  const target = lang.toLowerCase();

  const matching = voices.filter((v) => {
    const vLang = (v.language || '').toLowerCase().replace('_', '-');
    if (target === 'hi') return vLang.startsWith('hi');
    if (target === 'gu') return vLang.startsWith('gu');
    return vLang.startsWith('en-in') || vLang.startsWith('en');
  });

  if (matching.length === 0) return undefined;

  const scored = matching.map((v) => {
    let score = 0;
    const name = (v.name || '').toLowerCase();
    const id = (v.identifier || '').toLowerCase();

    // High quality flag from native OS
    if (v.quality === Speech.VoiceQuality.Enhanced || (v as any).quality === 'Enhanced') {
      score += 50;
    }
    // Google Neural Network voices on Android
    if (id.includes('network') || name.includes('network')) score += 40;
    if (id.includes('neural') || name.includes('neural')) score += 40;
    if (id.includes('wavenet') || name.includes('wavenet')) score += 40;
    if (id.includes('natural') || name.includes('natural')) score += 30;
    if (name.includes('google') || id.includes('google')) score += 20;

    // For English: prioritize authentic Indian accent (en-IN)
    if (target === 'en' && ((v.language || '').includes('en-IN') || (v.language || '').includes('en_IN'))) {
      score += 25;
    }

    return { id: v.identifier, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.id;
}

// Cultural audio guide prosody tuning (calibrated for human documentary feel)
const PROSODY_CONFIG: Record<string, { language: string; rate: number; pitch: number }> = {
  en: { language: 'en-IN', rate: 0.88, pitch: 0.98 },
  hi: { language: 'hi-IN', rate: 0.84, pitch: 0.98 },
  gu: { language: 'gu-IN', rate: 0.84, pitch: 0.98 },
};

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<Speech.Voice[]>(cachedVoices);

  useEffect(() => {
    if (cachedVoices.length === 0) {
      loadAvailableVoices().then((res) => {
        if (res.length > 0) setVoices(res);
      });
    }
  }, []);

  const speak = useCallback(
    async (text: string, language: string = 'en') => {
      try {
        await Speech.stop();

        // 1. Humanize the text for natural spoken delivery
        const humanText = humanizeHeritageNarration(text, language);
        if (!humanText) return;

        // 2. Select calibrated prosody config
        const config = PROSODY_CONFIG[language] || PROSODY_CONFIG.en;

        // 3. Find the best available neural/human voice on the device
        const activeVoices = voices.length > 0 ? voices : cachedVoices;
        const bestVoiceId = selectBestVoice(activeVoices, language);

        const options: Speech.SpeechOptions = {
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
        };

        if (bestVoiceId) {
          options.voice = bestVoiceId;
        }

        Speech.speak(humanText, options);
      } catch (error) {
        console.error('[useSpeech] Speech error:', error);
        setIsSpeaking(false);
      }
    },
    [voices]
  );

  const stop = useCallback(async () => {
    try {
      await Speech.stop();
    } finally {
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  const pause = useCallback(async () => {
    try {
      await Speech.pause();
      setIsPaused(true);
    } catch {
      // Ignore pause failure on unsupported engines
    }
  }, []);

  const resume = useCallback(async () => {
    try {
      await Speech.resume();
      setIsPaused(false);
    } catch {
      // Ignore resume failure on unsupported engines
    }
  }, []);

  return { speak, stop, pause, resume, isSpeaking, isPaused };
}
