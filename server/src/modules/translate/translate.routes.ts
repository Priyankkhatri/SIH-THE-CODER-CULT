import { Router, Request, Response } from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import { config } from '../../config';

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

  // Check preset translations first (instant <1ms hit)
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

  const langName = targetLanguage === 'hi' ? 'Hindi (हिन्दी)' : targetLanguage === 'gu' ? 'Gujarati (ગુજરાતી)' : targetLanguage;

  // 1. Tier 1: Groq Cloud LLM (Llama 3.3 70B - High speed, state-of-the-art Indian language fluency)
  if (config.groqApiKey && config.groqApiKey.trim() !== '') {
    try {
      const groq = new OpenAI({
        apiKey: config.groqApiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });

      const trModel = config.groqModel || 'qwen/qwen3.8-27b';
      const completion = await Promise.race([
        groq.chat.completions.create({
          model: trModel,
          messages: [
            {
              role: 'system',
              content: `You are an expert translator for Indian cultural heritage and travel. Translate the provided text into natural, authentic, and fluent ${langName}. Return ONLY the direct translated text with NO explanations, quotes, or conversational filler.`,
            },
            { role: 'user', content: text },
          ],
          temperature: 0.1,
          max_tokens: 300,
        }),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error('Groq timeout')), 6000)),
      ]);

      let translated = (completion as any).choices?.[0]?.message?.content?.trim();
      if (translated) {
        translated = translated.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        return res.json({
          success: true,
          data: {
            translatedText: translated,
            source: 'groq-llama-3.3-70b',
            targetLanguage,
          },
        });
      }
    } catch (groqErr: any) {
      console.warn(`[Translate] Groq translation skipped (${groqErr.message || 'offline'}). Attempting local model.`);
    }
  }

  // 2. Tier 2: Real-time translation via dynamic local model in LM Studio
  try {
    let modelName = 'llama-3.2-3b-instruct';
    try {
      const mres = await axios.get('http://127.0.0.1:1234/v1/models', { timeout: 1200 });
      const list = mres.data?.data || [];
      if (list[0]?.id) modelName = list[0].id;
    } catch (_) {}

    const response = await axios.post(
      'http://127.0.0.1:1234/v1/chat/completions',
      {
        model: modelName,
        messages: [
          { role: 'system', content: `You are an expert Indian linguistic translator. Translate the text accurately into ${langName}. Return only the clean translated text.` },
          { role: 'user', content: text },
          { role: 'assistant', content: '</think>\n' },
        ],
        temperature: 0.1,
        max_tokens: 200,
      },
      { timeout: 8000 }
    );

    let translated = response.data?.choices?.[0]?.message?.content?.trim();
    if (translated) {
      translated = translated.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      return res.json({
        success: true,
        data: {
          translatedText: translated,
          source: modelName,
          targetLanguage,
        },
      });
    }
  } catch (err) {
    // Fallback to passthrough
  }

  // 3. Tier 3: Fallback passthrough
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
