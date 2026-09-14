import { Router, Request, Response } from 'express';
import prisma from '../../config/database';
import { loadMasterUnifiedPlaces } from '../../utils/masterDataLoader';

const router = Router();

// Load master catalog of all 148 Indian national monuments
const masterUnifiedPlaces = loadMasterUnifiedPlaces();

// In-memory fallback store for user favorites
const userFavorites = new Map<string, Set<string>>();

// GET /favorites?userId=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    const favoriteIds = Array.from(userFavorites.get(userId) || []);

    let places: any[] = [];
    if (favoriteIds.length > 0) {
      try {
        places = await prisma.place.findMany({
          where: { id: { in: favoriteIds } },
          include: {
            heritageRecord: {
              select: { shortStory: true, period: true },
            },
          },
        });
      } catch (dbErr) {
        console.warn('[Favorites] Prisma query failed, resolving from master places:', dbErr);
      }

      const existingIds = new Set(places.map((p: any) => p.id));
      const missingIds = favoriteIds.filter((id) => !existingIds.has(id));

      if (missingIds.length > 0) {
        const fallbackPlaces = masterUnifiedPlaces
          .filter((p: any) => missingIds.includes(p.id) || missingIds.includes(p.slug))
          .map((p: any) => ({
            ...p,
            heritageRecord: {
              shortStory: p.description || p.shortDescription,
              period: p.period,
            },
          }));
        places = [...places, ...fallbackPlaces];
      }
    }

    res.json({
      success: true,
      data: places,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch favorites' });
  }
});

// POST /favorites
router.post('/', async (req: Request, res: Response) => {
  try {
    const { placeId, userId = 'default-user' } = req.body;
    if (!placeId) {
      return res.status(400).json({ success: false, error: 'placeId is required' });
    }

    if (!userFavorites.has(userId)) {
      userFavorites.set(userId, new Set<string>());
    }
    userFavorites.get(userId)!.add(placeId);

    res.status(201).json({
      success: true,
      data: { placeId, userId, isFavorite: true },
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ success: false, error: 'Failed to add favorite' });
  }
});

// DELETE /favorites/:placeId?userId=...
router.delete('/:placeId', async (req: Request, res: Response) => {
  try {
    const placeId = req.params.placeId as string;
    const userId = (req.query.userId as string) || 'default-user';

    if (userFavorites.has(userId)) {
      userFavorites.get(userId)!.delete(placeId);
    }

    res.json({
      success: true,
      data: { placeId, userId, isFavorite: false },
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ success: false, error: 'Failed to remove favorite' });
  }
});

export default router;
