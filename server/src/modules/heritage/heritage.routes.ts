import { Router, Request, Response } from 'express';
import prisma from '../../config/database';

const router = Router();

// GET /heritage/:placeId - Full heritage record for a place
router.get('/:placeId', async (req: Request, res: Response) => {
  const placeId = req.params.placeId as string;
  const lang = (req.query.lang as string) || 'en';

  const record: any = await prisma.heritageRecord.findUnique({
    where: { placeId: placeId as string },
    include: {
      sources: true,
      place: {
        select: {
          id: true,
          name: true,
          nameHi: true,
          nameGu: true,
          latitude: true,
          longitude: true,
          category: true,
          imageUrl: true,
          openingHours: true,
          rating: true,
        },
      },
    },
  });

  if (!record) {
    return res.status(404).json({ success: false, error: 'Heritage record not found' });
  }

  // Select language-appropriate fields
  const localizedRecord = {
    ...record,
    shortStory: lang === 'hi' ? (record.shortStoryHi || record.shortStory) :
                lang === 'gu' ? (record.shortStoryGu || record.shortStory) :
                record.shortStory,
    history: lang === 'hi' ? (record.historyHi || record.history) :
             lang === 'gu' ? (record.historyGu || record.history) :
             record.history,
    placeName: lang === 'hi' ? (record.place.nameHi || record.place.name) :
               lang === 'gu' ? (record.place.nameGu || record.place.name) :
               record.place.name,
  };

  res.json({ success: true, data: localizedRecord });
});

// GET /heritage/:placeId/sources - Get source references
router.get('/:placeId/sources', async (req: Request, res: Response) => {
  const record = await prisma.heritageRecord.findUnique({
    where: { placeId: req.params.placeId as string },
    select: { id: true },
  });

  if (!record) {
    return res.status(404).json({ success: false, error: 'Heritage record not found' });
  }

  const sources = await prisma.source.findMany({
    where: { heritageId: record.id },
  });

  res.json({ success: true, data: sources });
});

export default router;
