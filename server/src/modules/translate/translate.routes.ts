import { Router, Request, Response } from 'express';
import axios from 'axios';

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
  const text = req.body.text;
  const targetLanguage = req.body.targetLanguage || req.body.targetLang;

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

  // Real-time translation via local Qwen 3.5 9B
  try {
    const langName = targetLanguage === 'hi' ? 'Hindi' : targetLanguage === 'gu' ? 'Gujarati' : targetLanguage;
    const response = await axios.post(
      'http://127.0.0.1:1234/v1/chat/completions',
      {
        model: 'qwen/qwen3.5-9b',
        messages: [
          { role: 'system', content: `You are an expert Indian linguistic translator. Translate the text accurately into ${langName}. Return only the clean translated text.` },
          { role: 'user', content: text },
          { role: 'assistant', content: '</think>\n' },
        ],
        temperature: 0.2,
        max_tokens: 200,
      },
      { timeout: 15000 }
    );

    let translated = response.data?.choices?.[0]?.message?.content?.trim();
    if (translated) {
      translated = translated.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      return res.json({
        success: true,
        data: {
          translatedText: translated,
          source: 'qwen-3.5-9b',
          targetLanguage,
        },
      });
    }
  } catch (err) {
    // Fallback to passthrough
  }

  // Fallback passthrough
  res.json({
    success: true,
    data: {
      translatedText: text,
      source: 'passthrough',
      targetLanguage,
      note: 'Pre-translated versions available in database.',
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
