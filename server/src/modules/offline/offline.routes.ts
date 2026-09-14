import { Router, Request, Response } from 'express';
import prisma from '../../config/database';
import path from 'path';
import fs from 'fs';

const router = Router();

// Load master catalog of all 148 Indian national monuments
let masterUnifiedPlaces: any[] = [];
try {
  const masterPath = path.resolve(__dirname, '../../seed/master_unified_places.json');
  if (fs.existsSync(masterPath)) {
    masterUnifiedPlaces = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  }
} catch (e) {
  console.warn('[OfflineRoutes] Could not load master_unified_places.json:', e);
}

// GET /offline/:placeId - Downloadable offline pack for places
router.get('/:placeId', async (req: Request, res: Response) => {
  try {
    const placeId = req.params.placeId as string;
    let place: any = null;

    try {
      place = await prisma.place.findUnique({
        where: { id: placeId },
        include: {
          heritageRecord: {
            include: { sources: true },
          },
          artifacts: true,
        },
      });
    } catch (dbErr) {
      console.warn('[Offline] Prisma findUnique failed, checking master places:', dbErr);
    }

    if (!place) {
      const match = masterUnifiedPlaces.find(
        (p: any) => p.id === placeId || p.slug === placeId || p.id?.toLowerCase() === placeId.toLowerCase()
      );
      if (match) {
        place = {
          ...match,
          heritageRecord: {
            placeId: match.id,
            shortStory: match.description || match.shortDescription,
            history: match.history || match.description,
            significance: match.significance || match.period,
            architecture: match.architecture || 'Heritage architecture',
            period: match.period || 'Historical',
            sources: match.sources || [],
          },
          artifacts: match.artifacts || [],
        };
      }
    }

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
