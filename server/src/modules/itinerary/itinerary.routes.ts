import { Router, Request, Response } from 'express';
import prisma from '../../config/database';

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

// Estimate travel time in minutes
function estimateTravelTime(distanceKm: number, mode: 'walk' | 'drive'): number {
  const speed = mode === 'walk' ? 5 : 30;
  return Math.round((distanceKm / speed) * 60);
}

// Duration presets in minutes
const DURATION_MAP: Record<string, number> = {
  '30min': 30,
  '90min': 90,
  'half-day': 240,
  'full-day': 480,
};

// POST /itinerary/generate - Generate personalized route
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

    // Get all places and calculate distances
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

    // Score and sort places based on interests + distance
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

    // Build itinerary using greedy nearest-neighbor
    const itineraryItems: Array<{
      placeId: string;
      placeName: string;
      order: number;
      visitDuration: number;
      travelTime: number;
      travelMode: string;
      reason: string;
      latitude: number;
      longitude: number;
      distance: number;
      imageUrl: string | null;
      shortStory: string | null;
    }> = [];

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

// POST /itinerary/save - Save a generated itinerary
router.post('/save', async (req: Request, res: Response) => {
  const { userId, title, duration, totalTime, items } = req.body;

  const itinerary = await prisma.itinerary.create({
    data: {
      userId,
      title: title || `${duration} Heritage Tour`,
      duration,
      totalTime: totalTime || 90,
      items: {
        create: items.map((item: any) => ({
          placeId: item.placeId,
          placeName: item.placeName,
          order: item.order,
          visitDuration: item.visitDuration,
          travelTime: item.travelTime,
          travelMode: item.travelMode || 'walk',
          reason: item.reason,
        })),
      },
    },
    include: { items: true },
  });

  res.status(201).json({ success: true, data: itinerary });
});

// GET /itinerary/user/:userId - Get user's saved itineraries
router.get('/user/:userId', async (req: Request, res: Response) => {
  const itineraries = await prisma.itinerary.findMany({
    where: { userId: req.params.userId as string },
    include: { items: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: itineraries });
});

export default router;
