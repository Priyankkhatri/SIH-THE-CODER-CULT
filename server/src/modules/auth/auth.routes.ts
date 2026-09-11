import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';
import prisma from '../../config/database';

const router = Router();

// POST /auth/guest - Create guest user and return token
router.post('/guest', async (_req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'Guest Tourist',
      isGuest: true,
      language: 'en',
    },
  });

  const token = jwt.sign(
    { userId: user.id, isGuest: true },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        language: user.language,
        isGuest: user.isGuest,
      },
    },
  });
});

// POST /auth/register - Register user (stub for future)
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, language } = req.body;

  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      name: name || 'Tourist',
      email,
      language: language || 'en',
      isGuest: false,
    },
  });

  const token = jwt.sign(
    { userId: user.id, isGuest: false },
    config.jwtSecret,
    { expiresIn: '30d' }
  );

  res.status(201).json({
    success: true,
    data: { token, user },
  });
});

// POST /auth/preferences - Save user preferences
router.post('/preferences', async (req: Request, res: Response) => {
  const { userId, interests, travelStyle, duration, accessibility, language } = req.body;

  const preferences = await prisma.preference.upsert({
    where: { userId },
    update: { interests, travelStyle, duration, accessibility },
    create: {
      userId,
      interests: interests || ['heritage'],
      travelStyle: travelStyle || 'moderate',
      duration: duration || '90min',
      accessibility: accessibility || [],
    },
  });

  // Update language on user
  if (language) {
    await prisma.user.update({
      where: { id: userId },
      data: { language },
    });
  }

  res.json({ success: true, data: preferences });
});

export default router;
