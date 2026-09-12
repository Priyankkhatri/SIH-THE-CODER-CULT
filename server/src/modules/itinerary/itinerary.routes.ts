import { Router, Request, Response } from 'express';
import prisma from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

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

function estimateTravelTime(distanceKm: number, mode: 'walk' | 'drive'): number {
  const speed = mode === 'walk' ? 5 : 30;
  return Math.round((distanceKm / speed) * 60);
}

const DURATION_MAP: Record<string, number> = {
  '30min': 30,
  '90min': 90,
  'half-day': 240,
  'full-day': 480,
};

// 1. POST /itinerary/generate or /itineraries/generate
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      latitude,
      longitude,
      interests = ['heritage'],
      duration = '90min',
      travelStyle = 'moderate',
    } = req.body;

    const lat = latitude || 22.3072;
    const lng = longitude || 73.1812;
    const maxMinutes = DURATION_MAP[duration] || 90;

    const places = await prisma.place.findMany({
      include: {
        heritageRecord: {
          select: {
            shortStory: true,
            significance: true,
            period: true,
          },
        },
      },
    });

    const scoredPlaces = places.map((place: any) => {
      const distance = haversineDistance(lat, lng, place.latitude, place.longitude);
      const interestMatch = interests.includes(place.category) ? 2 : 1;
      const ratingBonus = (place.rating || 3) / 5;
      const proximityScore = Math.max(0, 1 - distance / 50);

      return {
        ...place,
        distance,
        score: interestMatch * ratingBonus * (1 + proximityScore),
      };
    }).sort((a: any, b: any) => b.score - a.score);

    const itineraryItems: Array<any> = [];
    let currentLat = lat;
    let currentLng = lng;
    let totalTime = 0;
    let remainingPlaces = [...scoredPlaces];
    const visitDurationMap: Record<string, number> = {
      rushed: 15,
      moderate: 25,
      leisurely: 40,
    };
    const baseVisitDuration = visitDurationMap[travelStyle] || 25;

    while (remainingPlaces.length > 0 && totalTime < maxMinutes) {
      let bestIdx = 0;
      let bestDist = Infinity;

      for (let i = 0; i < remainingPlaces.length; i++) {
        const dist = haversineDistance(currentLat, currentLng, remainingPlaces[i].latitude, remainingPlaces[i].longitude);
        const adjustedDist = dist / remainingPlaces[i].score;
        if (adjustedDist < bestDist) {
          bestDist = adjustedDist;
          bestIdx = i;
        }
      }

      const nextPlace = remainingPlaces[bestIdx];
      const dist = haversineDistance(currentLat, currentLng, nextPlace.latitude, nextPlace.longitude);
      const travelMode = dist > 3 ? 'drive' : 'walk';
      const travelTime = estimateTravelTime(dist, travelMode as 'walk' | 'drive');
      const visitDuration = baseVisitDuration + (nextPlace.heritageRecord ? 10 : 0);

      if (totalTime + travelTime + visitDuration > maxMinutes) {
        remainingPlaces.splice(bestIdx, 1);
        continue;
      }

      let reason = '';
      if (interests.includes(nextPlace.category)) {
        reason = `Matches your interest in ${nextPlace.category}`;
      } else if (nextPlace.rating && nextPlace.rating >= 4) {
        reason = `Highly rated heritage site (${nextPlace.rating}★)`;
      } else if (dist < 1) {
        reason = 'Very close to your current location';
      } else {
        reason = `Recommended ${nextPlace.category} site in the area`;
      }

      itineraryItems.push({
        placeId: nextPlace.id,
        placeName: nextPlace.name,
        order: itineraryItems.length + 1,
        visitDuration,
        travelTime,
        travelMode,
        reason,
        latitude: nextPlace.latitude,
        longitude: nextPlace.longitude,
        distance: Math.round(dist * 10) / 10,
        imageUrl: nextPlace.imageUrl,
        shortStory: nextPlace.heritageRecord?.shortStory || null,
      });

      totalTime += travelTime + visitDuration;
      currentLat = nextPlace.latitude;
      currentLng = nextPlace.longitude;
      remainingPlaces.splice(bestIdx, 1);
    }

    res.json({
      success: true,
      data: {
        id: uuidv4(),
        title: `${duration} Heritage Tour`,
        duration,
        totalTimeMinutes: totalTime,
        stops: itineraryItems.length,
        items: itineraryItems,
        startLocation: { latitude: lat, longitude: lng },
      },
    });
  } catch (error) {
    console.error('Itinerary generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate itinerary' });
  }
});

// 2. POST / (Save an itinerary) & POST /save
const saveHandler = async (req: Request, res: Response) => {
  try {
    const { userId = 'default-user', title, duration, totalTime, items = [] } = req.body;

    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        title: title || `${duration || '90min'} Heritage Tour`,
        duration: duration || '90min',
        totalTime: totalTime || 90,
        items: {
          create: items.map((item: any, idx: number) => ({
            placeId: item.placeId,
            placeName: item.placeName,
            order: item.order || idx + 1,
            visitDuration: item.visitDuration || 25,
            travelTime: item.travelTime || 10,
            travelMode: item.travelMode || 'walk',
            reason: item.reason || '',
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json({ success: true, data: itinerary });
  } catch (error) {
    console.error('Error saving itinerary:', error);
    res.status(500).json({ success: false, error: 'Failed to save itinerary' });
  }
};
router.post('/', saveHandler);
router.post('/save', saveHandler);

// 3. GET / (Get itineraries by query userId)
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    const itineraries = await prisma.itinerary.findMany({
      where: userId ? { userId } : undefined,
      include: { items: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: itineraries });
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch itineraries' });
  }
});

// 4. GET /user/:userId
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const itineraries = await prisma.itinerary.findMany({
      where: { userId: req.params.userId as string },
      include: { items: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: itineraries });
  } catch (error) {
    console.error('Error fetching user itineraries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user itineraries' });
  }
});

// 5. GET /:id (Single itinerary by ID)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: req.params.id as string },
      include: { items: { orderBy: { order: 'asc' } } },
    });

    if (!itinerary) {
      return res.status(404).json({ success: false, error: 'Itinerary not found' });
    }

    res.json({ success: true, data: itinerary });
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch itinerary' });
  }
});

// 6. DELETE /:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.itinerary.delete({
      where: { id: req.params.id as string },
    }).catch(() => {});

    res.json({ success: true, message: 'Itinerary deleted' });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({ success: false, error: 'Failed to delete itinerary' });
  }
});

export default router;
