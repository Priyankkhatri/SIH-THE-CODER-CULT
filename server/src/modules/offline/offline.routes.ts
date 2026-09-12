import { Router, Request, Response } from 'express';
import prisma from '../../config/database';

const router = Router();

// GET /offline/:placeId - Downloadable offline pack for places
router.get('/:placeId', async (req: Request, res: Response) => {
  try {
    const placeId = req.params.placeId as string;
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      include: {
        heritageRecord: {
          include: { sources: true },
        },
        artifacts: true,
      },
    });

    if (!place) {
      return res.status(404).json({ success: false, error: 'Place not found for offline download' });
    }

    res.json({
      success: true,
      data: {
        placeId: place.id,
        version: '1.0.0',
        downloadedAt: new Date().toISOString(),
        place,
        audioGuides: [
          { language: 'en', title: `${place.name} Audio Guide`, text: place.heritageRecord?.shortStory || place.shortDescription },
          { language: 'hi', title: `${place.nameHi || place.name} ऑडियो गाइड`, text: place.heritageRecord?.shortStoryHi || place.shortDescription },
          { language: 'gu', title: `${place.nameGu || place.name} ઑડિયો માર્ગદર્શિકા`, text: place.heritageRecord?.shortStoryGu || place.shortDescription },
        ],
      },
    });
  } catch (error) {
    console.error('Error generating offline package:', error);
    res.status(500).json({ success: false, error: 'Failed to generate offline package' });
  }
});

export default router;
