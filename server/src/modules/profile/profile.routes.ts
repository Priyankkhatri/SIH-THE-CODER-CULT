import { Router, Request, Response } from 'express';
import prisma from '../../config/database';

const router = Router();

// GET /profile?userId=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    });

    if (!user) {
      user = {
        id: userId,
        name: 'Guest Tourist',
        language: 'en',
        isGuest: true,
        preferences: {
          interests: ['heritage', 'architecture'],
          travelStyle: 'moderate',
          duration: '90min',
          accessibility: [],
        },
      };
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
});

// PUT /profile
router.put('/', async (req: Request, res: Response) => {
  try {
    const { userId = 'default-user', name, language } = req.body;
    const updated = await prisma.user.upsert({
      where: { id: userId },
      update: {
        ...(name ? { name } : {}),
        ...(language ? { language } : {}),
      },
      create: {
        id: userId,
        name: name || 'Tourist',
        language: language || 'en',
        isGuest: true,
      },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// PUT /profile/preferences
router.put('/preferences', async (req: Request, res: Response) => {
  try {
    const { userId = 'default-user', interests, travelStyle, duration, accessibility, language } = req.body;
    const updated = await prisma.preference.upsert({
      where: { userId },
      update: {
        ...(interests ? { interests } : {}),
        ...(travelStyle ? { travelStyle } : {}),
        ...(duration ? { duration } : {}),
        ...(accessibility ? { accessibility } : {}),
      },
      create: {
        userId,
        interests: interests || ['heritage'],
        travelStyle: travelStyle || 'moderate',
        duration: duration || '90min',
        accessibility: accessibility || [],
      },
    });

    if (language) {
      await prisma.user.update({
        where: { id: userId },
        data: { language },
      }).catch(() => {});
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ success: false, error: 'Failed to update preferences' });
  }
});

export default router;
