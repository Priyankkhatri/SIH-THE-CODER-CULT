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

// POST /ai/suggest - Get suggested questions for a place
router.post('/suggest', async (req: Request, res: Response) => {
  const { placeId } = req.body;

  const suggestions = await aiService.getSuggestedQuestions(placeId);

  res.json({
    success: true,
    data: suggestions,
  });
});

export default router;
