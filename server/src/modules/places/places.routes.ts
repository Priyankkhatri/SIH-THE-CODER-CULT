import { Router, Request, Response } from 'express';
import prisma from '../../config/database';

const router = Router();

// Haversine distance in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /places/nearby?lat=X&lng=Y&radius=10&category=heritage
router.get('/nearby', async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string) || 22.3072; // Default: Vadodara
  const lng = parseFloat(req.query.lng as string) || 73.1812;
  const radius = parseFloat(req.query.radius as string) || 50; // km
  const category = req.query.category as string | undefined;

  let places = await prisma.place.findMany({
    where: category ? { category } : undefined,
    include: {
      heritageRecord: {
        select: {
          shortStory: true,
          period: true,
        },
      },
    },
  });

  // Calculate distances and filter by radius
  const placesWithDistance = places
    .map((place) => ({
      ...place,
      distance: haversineDistance(lat, lng, place.latitude, place.longitude),
    }))
    .filter((place) => place.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  res.json({
    success: true,
    data: placesWithDistance,
    meta: {
      total: placesWithDistance.length,
      lat,
      lng,
      radius,
    },
  });
});

// GET /places/search?q=palace
router.get('/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';

  const places = await prisma.place.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { shortDescription: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      heritageRecord: {
        select: {
          shortStory: true,
          period: true,
        },
      },
    },
  });

  res.json({ success: true, data: places });
});

// GET /places/:id
router.get('/:id', async (req: Request, res: Response) => {
  const place = await prisma.place.findUnique({
    where: { id: req.params.id },
    include: {
      heritageRecord: {
        include: { sources: true },
      },
      artifacts: true,
    },
  });

  if (!place) {
    return res.status(404).json({ success: false, error: 'Place not found' });
  }

  res.json({ success: true, data: place });
});

// GET /places/categories/list
router.get('/categories/list', async (_req: Request, res: Response) => {
  const categories = await prisma.place.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  res.json({
    success: true,
    data: categories.map((c) => c.category),
  });
});

export default router;
