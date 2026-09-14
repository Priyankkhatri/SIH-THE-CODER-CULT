import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';
import prisma from '../../config/database';

const router = Router();

// POST /auth/guest - Create guest user and return token
router.post('/guest', async (_req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error('Error creating guest:', error);
    res.status(500).json({ success: false, error: 'Failed to create guest user' });
  }
});

// POST /auth/login - Login user with email/password
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    let user = await prisma.user.findFirst({
      where: email ? { email } : undefined,
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          name: email ? email.split('@')[0] : 'Registered Tourist',
          email: email || 'tourist@sih.gov.in',
          isGuest: false,
          language: 'en',
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id, isGuest: false },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          language: user.language,
          isGuest: false,
        },
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// GET /auth/me - Get current authenticated user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    let userId = 'default-user';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded: any = jwt.verify(authHeader.substring(7), config.jwtSecret);
        userId = decoded.userId || userId;
      } catch {
        // Token invalid, fall back to guest profile
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    res.json({
      success: true,
      data: user || {
        id: userId,
        name: 'Guest Tourist',
        isGuest: true,
        language: 'en',
      },
    });
  } catch (error) {
    console.error('Error in /auth/me:', error);
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
});

// POST /auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// POST /auth/register - Register user
router.post('/register', async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// POST /auth/preferences - Save user preferences
router.post('/preferences', async (req: Request, res: Response) => {
  try {
    const { userId, interests, travelStyle, duration, accessibility, language } = req.body || {};
    const targetUserId = userId || 'default-user';

    const preferences = await prisma.preference.upsert({
      where: { userId: targetUserId },
      update: { interests, travelStyle, duration, accessibility },
      create: {
        userId: targetUserId,
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

    res.json({ success: true, data: preferences });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ success: false, error: 'Failed to save preferences' });
  }
});

export default router;
