import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { aiService } from './ai.service';

const router = Router();

const askRequestSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty').max(1000, 'Question exceeds maximum 1000 characters').trim(),
  placeId: z.string().max(100).optional(),
  mode: z.enum(['short', 'detailed', 'child', 'narrative']).default('short'),
  language: z.enum(['en', 'hi', 'gu']).default('en'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      })
    )
    .max(20)
    .optional(),
  conversationHistory: z.array(z.any()).optional(),
});

// POST /ai/ask - Ask the AI Heritage Guide a question
router.post('/ask', async (req: Request, res: Response) => {
  try {
    const parseResult = askRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid AI ask request payload',
        details: parseResult.error.flatten(),
      });
    }

    const { question, placeId, mode, language, history, conversationHistory } = parseResult.data;

    const answer = await aiService.askQuestion({
      question,
      placeId,
      mode,
      language,
      history: history || (conversationHistory as any),
    });

    res.json({
      success: true,
      data: answer,
    });
  } catch (error) {
    console.error('AI Ask Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI response',
    });
  }
});

// POST /ai/explain - Deep explanation of a place or architectural aspect
router.post('/explain', async (req: Request, res: Response) => {
  try {
    const { placeId, aspect = 'architecture', language = 'en' } = req.body;

    const answer = await aiService.askQuestion({
      question: `Explain the ${aspect} and cultural importance of this site in depth.`,
      placeId,
      mode: 'detailed',
      language,
    });

    res.json({
      success: true,
      data: answer,
    });
  } catch (error) {
    console.error('AI Explain Error:', error);
    res.status(500).json({ success: false, error: 'Failed to explain place aspect' });
  }
});

// POST /ai/story - Immersive storytelling mode for audio companion
router.post('/story', async (req: Request, res: Response) => {
  try {
    const { placeId, language = 'en' } = req.body;

    const answer = await aiService.askQuestion({
      question: `Tell an immersive, theatrical story about this monument as if I am standing right in front of it right now.`,
      placeId,
      mode: 'narrative',
      language,
    });

    res.json({
      success: true,
      data: answer,
    });
  } catch (error) {
    console.error('AI Story Error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate story' });
  }
});

// GET & POST /ai/suggest & /ai/suggestions - Get suggested questions for a place
const handleSuggest = async (req: Request, res: Response) => {
  try {
    const placeId = (req.body?.placeId || req.query?.placeId) as string | undefined;
    const suggestions = await aiService.getSuggestedQuestions(placeId);

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('AI Suggest Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get suggestions' });
  }
};

router.post('/suggest', handleSuggest);
router.get('/suggest', handleSuggest);
router.post('/suggestions', handleSuggest);
router.get('/suggestions', handleSuggest);

export default router;
