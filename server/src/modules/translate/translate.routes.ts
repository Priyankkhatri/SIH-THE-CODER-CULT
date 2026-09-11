import { Router, Request, Response } from 'express';

const router = Router();

// Pre-set translations for hackathon demo (key heritage terms)
const TRANSLATIONS: Record<string, Record<string, string>> = {
  hi: {
    'Heritage Sites': 'विरासत स्थल',
    'History': 'इतिहास',
    'Significance': 'महत्व',
    'Architecture': 'वास्तुकला',
    'Key Facts': 'मुख्य तथ्य',
    'Built in': 'निर्मित',
    'Ask AI': 'AI से पूछें',
    'Listen': 'सुनें',
    'Identify': 'पहचानें',
    'Directions': 'दिशा-निर्देश',
    'Plan Trip': 'यात्रा की योजना',
    'Explore Map': 'नक्शा देखें',
    'Nearby': 'पास में',
    'minutes away': 'मिनट दूर',
    'Visit Duration': 'यात्रा अवधि',
  },
  gu: {
    'Heritage Sites': 'વારસા સ્થળો',
    'History': 'ઇતિહાસ',
    'Significance': 'મહત્વ',
    'Architecture': 'સ્થાપત્ય',
    'Key Facts': 'મુખ્ય તથ્યો',
    'Built in': 'બાંધવામાં આવ્યું',
    'Ask AI': 'AI ને પૂછો',
    'Listen': 'સાંભળો',
    'Identify': 'ઓળખો',
    'Directions': 'દિશાઓ',
    'Plan Trip': 'યાત્રા આયોજન',
    'Explore Map': 'નકશો જુઓ',
    'Nearby': 'નજીકમાં',
    'minutes away': 'મિનિટ દૂર',
    'Visit Duration': 'મુલાકાત સમયગાળો',
  },
};

// POST /translate - Translate text
router.post('/', async (req: Request, res: Response) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ success: false, error: 'text and targetLanguage are required' });
  }

  // Check preset translations first
  const presets = TRANSLATIONS[targetLanguage];
  if (presets && presets[text]) {
    return res.json({
      success: true,
      data: {
        translatedText: presets[text],
        source: 'preset',
        targetLanguage,
      },
    });
  }

  // For hackathon: return original text with a note
  res.json({
    success: true,
    data: {
      translatedText: text,
      source: 'passthrough',
      targetLanguage,
      note: 'Translation API not configured. Heritage content has pre-translated versions in the database.',
    },
  });
});

// POST /translate/tts - Return text for client-side TTS
router.post('/tts', async (req: Request, res: Response) => {
  const { text, language } = req.body;

  res.json({
    success: true,
    data: {
      text,
      language: language || 'en',
      voiceConfig: (({
        en: { language: 'en-IN', rate: 0.9, pitch: 1.0 },
        hi: { language: 'hi-IN', rate: 0.85, pitch: 1.0 },
        gu: { language: 'gu-IN', rate: 0.85, pitch: 1.0 },
      } as Record<string, { language: string; rate: number; pitch: number }>)[(language as string) || 'en']) || { language: 'en-IN', rate: 0.9, pitch: 1.0 },
    },
  });
});

// GET /translate/languages - Get supported languages
router.get('/languages', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    ],
  });
});

export default router;
