import { Router, Request, Response } from 'express';
import { aiService } from './ai.service';

const router = Router();

// POST /ai/ask - Ask the AI Heritage Guide a question
router.post('/ask', async (req: Request, res: Response) => {
  try {
    const { question, placeId, mode, language } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    const answer = await aiService.askQuestion({
      question,
      placeId,
      mode: mode || 'short', // short, detailed, child, narrative
      language: language || 'en',
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

// POST /ai/suggest - Get suggested questions for a place
router.post('/suggest', async (req: Request, res: Response) => {
  try {
    const { placeId } = req.body;
    const suggestions = await aiService.getSuggestedQuestions(placeId);

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('AI Suggest Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get suggestions' });
  }
});

export default router;
