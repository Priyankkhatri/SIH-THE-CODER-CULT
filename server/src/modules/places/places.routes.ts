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

// 1. GET /places - All places with optional category & language filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const lang = (req.query.lang as string) || 'en';

    const places = await prisma.place.findMany({
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

    const localizedPlaces = places.map((place: any) => ({
      ...place,
      name: lang === 'hi' && place.nameHi ? place.nameHi : lang === 'gu' && place.nameGu ? place.nameGu : place.name,
    }));

    res.json({
      success: true,
      data: localizedPlaces,
      meta: { total: localizedPlaces.length, category: category || 'all' },
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch places' });
  }
});

// 2. GET /places/categories/list (Declared BEFORE /:id so it does not get captured as an ID)
router.get('/categories/list', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.place.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    res.json({
      success: true,
      data: categories.map((c: any) => c.category),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// 3. GET /places/nearby?lat=X&lng=Y&radius=10&category=heritage
router.get('/nearby', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 22.3072; // Default: Vadodara
    const lng = parseFloat(req.query.lng as string) || 73.1812;
    const radius = parseFloat(req.query.radius as string) || 50; // km
    const category = req.query.category as string | undefined;
    const lang = (req.query.lang as string) || 'en';

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
      .map((place: any) => ({
        ...place,
        name: lang === 'hi' && place.nameHi ? place.nameHi : lang === 'gu' && place.nameGu ? place.nameGu : place.name,
        distance: haversineDistance(lat, lng, place.latitude, place.longitude),
      }))
      .filter((place: any) => place.distance <= radius)
      .sort((a: any, b: any) => a.distance - b.distance);

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
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch nearby places' });
  }
});

// 4. GET /places/search?q=palace
router.get('/search', async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error('Error searching places:', error);
    res.status(500).json({ success: false, error: 'Failed to search places' });
  }
});

// 5. GET /places/:id/recommendations
router.get('/:id/recommendations', async (req: Request, res: Response) => {
  try {
    const currentPlace = await prisma.place.findUnique({
      where: { id: req.params.id as string },
    });

    if (!currentPlace) {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }

    const allPlaces = await prisma.place.findMany({
      where: { id: { not: currentPlace.id } },
      include: {
        heritageRecord: { select: { shortStory: true, period: true } },
      },
    });

    // Score by same category and distance
    const recommended = allPlaces
      .map((p: any) => ({
        ...p,
        distance: haversineDistance(currentPlace.latitude, currentPlace.longitude, p.latitude, p.longitude),
        isSameCategory: p.category === currentPlace.category,
      }))
      .sort((a: any, b: any) => {
        if (a.isSameCategory && !b.isSameCategory) return -1;
        if (!a.isSameCategory && b.isSameCategory) return 1;
        return a.distance - b.distance;
      })
      .slice(0, 4);

    res.json({ success: true, data: recommended });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch recommendations' });
  }
});

// 6. GET /places/:id/reviews - Fetch visitor reviews and rating breakdown
router.get('/:id/reviews', async (req: Request, res: Response) => {
  try {
    const placeId = req.params.id as string;
    const reviews = await prisma.review.findMany({
      where: { placeId },
      orderBy: { createdAt: 'desc' },
    });

    const total = reviews.length;
    let avg = 4.6;
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (total > 0) {
      let sum = 0;
      for (const r of reviews) {
        const roundedStar = Math.min(5, Math.max(1, Math.round(r.rating)));
        distribution[roundedStar] = (distribution[roundedStar] || 0) + 1;
        sum += r.rating;
      }
      avg = Number((sum / total).toFixed(1));
    }

    const percentages: Record<number, number> = {
      5: total > 0 ? Math.round((distribution[5] / total) * 100) : 75,
      4: total > 0 ? Math.round((distribution[4] / total) * 100) : 20,
      3: total > 0 ? Math.round((distribution[3] / total) * 100) : 5,
      2: total > 0 ? Math.round((distribution[2] / total) * 100) : 0,
      1: total > 0 ? Math.round((distribution[1] / total) * 100) : 0,
    };

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          totalReviews: total,
          averageRating: avg,
          distribution,
          percentages,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

// 7. POST /places/:id/reviews - Submit a new review
router.post('/:id/reviews', async (req: Request, res: Response) => {
  try {
    const placeId = req.params.id as string;
    const { userName, rating, title, comment, visitType, badge } = req.body;

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Review comment is required' });
    }

    const parsedRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newReview = await prisma.review.create({
      data: {
        placeId,
        userName: userName && typeof userName === 'string' && userName.trim() ? userName.trim() : 'Heritage Traveler',
        rating: parsedRating,
        title: title && typeof title === 'string' ? title.trim() : 'Splendid Heritage Experience',
        comment: comment.trim(),
        badge: badge || 'Verified Visitor',
        visitType: visitType || 'Family',
        helpfulCount: 0,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: newReview,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, error: 'Failed to submit review' });
  }
});

// 8. GET /places/:id (Parametric route at the bottom)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const place = await prisma.place.findUnique({
      where: { id: req.params.id as string },
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
  } catch (error) {
    console.error('Error fetching place by ID:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch place' });
  }
});

export default router;
