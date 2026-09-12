import { Router, Request, Response } from 'express';
import prisma from '../../config/database';

const router = Router();

// In-memory fallback store for user favorites
const userFavorites = new Map<string, Set<string>>();

// GET /favorites?userId=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    const favoriteIds = Array.from(userFavorites.get(userId) || []);

    const places = await prisma.place.findMany({
      where: favoriteIds.length > 0 ? { id: { in: favoriteIds } } : undefined,
      include: {
        heritageRecord: {
          select: { shortStory: true, period: true },
        },
      },
    });

    const result = favoriteIds.length > 0 ? places.filter((p: any) => favoriteIds.includes(p.id)) : [];

    res.json({
      success: true,
      data: result,
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
