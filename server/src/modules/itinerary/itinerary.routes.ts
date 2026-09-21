import { Router, Request, Response } from 'express';
import prisma from '../../config/database';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { cacheMiddleware, cacheManager } from '../../utils/cacheManager';
import { loadMasterUnifiedPlaces } from '../../utils/masterDataLoader';

const router = Router();

// Load master unified places catalog for offline/fallback resilience
const masterUnifiedPlaces = loadMasterUnifiedPlaces();

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

const MASTER_CURATED_CIRCUITS = [
  {
    id: 'golden_triangle',
    title: 'Mughal Architectural Axis',
    tag: 'ICONIC TRAIL',
    duration: 'full-day',
    timeEstimate: '6.5 Hours',
    description: 'Taj Mahal, Agra Red Fort, and Fatehpur Sikri Imperial Citadel.',
    centerLat: 27.175,
    centerLng: 78.0422,
    placeIds: ['IND-HER-01', 'IND-HER-03', 'IND-HER-05'],
  },
  {
    id: 'solanki_marvels',
    title: 'Solanki Stepwells & Solar Sanctuaries',
    tag: 'UNESCO TRAIL',
    duration: 'half-day',
    timeEstimate: '4.5 Hours',
    description: 'Rani Ki Vav subterranean stepwell, Modhera Sun Temple, and Adalaj Vav.',
    centerLat: 23.8585,
    centerLng: 72.1015,
    placeIds: ['IND-HER-11', 'IND-HER-31', 'IND-GJ-06'],
  },
  {
    id: 'mewar_citadels',
    title: 'Mewar Royal Fortresses of India',
    tag: 'ROYAL CITADELS',
    duration: 'full-day',
    timeEstimate: '7 Hours',
    description: 'Kumbhalgarh 36-km Great Wall, Chittorgarh Fortress, and City Palace.',
    centerLat: 25.1478,
    centerLng: 73.5878,
    placeIds: ['IND-HER-26', 'IND-HER-27', 'IND-HER-28'],
  },
  {
    id: 'rock_cut_caves',
    title: 'Monolithic Rock-Cut Marvels',
    tag: 'ANCIENT CAVE WONDERS',
    duration: 'full-day',
    timeEstimate: '6 Hours',
    description: 'Ajanta Frescoed Caves, Ellora Kailasa Temple, and Daulatabad Fort.',
    centerLat: 20.5519,
    centerLng: 75.7033,
    placeIds: ['IND-HER-06', 'IND-HER-07', 'IND-MH-05'],
  },
  {
    id: 'deccan_empire',
    title: 'Vijayanagara Imperial Ruins & Boulders',
    tag: 'DECCAN HERITAGE',
    duration: 'full-day',
    timeEstimate: '6.5 Hours',
    description: 'Hampi Virupaksha Temple, Monolithic Stone Chariot, and Vittala Temple.',
    centerLat: 15.335,
    centerLng: 76.46,
    placeIds: ['IND-HER-10', 'IND-ART-19', 'IND-HER-12'],
  },
  {
    id: 'delhi_sultanate',
    title: 'Delhi Sultanate & Imperial Citadels',
    tag: 'CAPITAL HERITAGE',
    duration: 'full-day',
    timeEstimate: '5.5 Hours',
    description: 'Qutub Minar Complex, Humayun Tomb, and Red Fort.',
    centerLat: 28.5245,
    centerLng: 77.1855,
    placeIds: ['IND-HER-02', 'IND-HER-04', 'IND-HER-03'],
  },
];

// GET /itinerary/circuits - Get all verified national curated trails
router.get('/circuits', cacheMiddleware(600), (_req: Request, res: Response) => {
  const enrichedCircuits = MASTER_CURATED_CIRCUITS.map((circuit) => {
    const stops = circuit.placeIds
      .map((id) => {
        const found = masterUnifiedPlaces.find((p) => p.id === id);
        if (!found) return null;
        return {
          id: found.id,
          name: found.name,
          nameHi: found.nameHi,
          nameGu: found.nameGu,
          imageUrl: found.imageUrl,
          latitude: found.latitude,
          longitude: found.longitude,
          category: found.category,
          rating: found.rating || 4.7,
        };
      })
      .filter(Boolean);

    return {
      ...circuit,
      stopsCount: stops.length,
      stops,
    };
  });

  res.json({
    success: true,
    data: enrichedCircuits,
  });
});

// GET /itinerary/circuits/:id - Get single verified curated trail
router.get('/circuits/:id', cacheMiddleware(600), (req: Request, res: Response) => {
  const circuit = MASTER_CURATED_CIRCUITS.find((c) => c.id === req.params.id);
  if (!circuit) {
    return res.status(404).json({ success: false, error: 'Circuit not found' });
  }

  const stops = circuit.placeIds
    .map((id) => {
      const found = masterUnifiedPlaces.find((p) => p.id === id);
      if (!found) return null;
      return {
        id: found.id,
        name: found.name,
        nameHi: found.nameHi,
        nameGu: found.nameGu,
        imageUrl: found.imageUrl,
        latitude: found.latitude,
        longitude: found.longitude,
        category: found.category,
        rating: found.rating || 4.7,
        shortStory: found.shortDescription || found.heritageRecord?.shortStory,
      };
    })
    .filter(Boolean);

  res.json({
    success: true,
    data: {
      ...circuit,
      stopsCount: stops.length,
      stops,
    },
  });
});

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

    const rawDur = typeof duration === 'string' ? duration.toLowerCase().replace(/[_\s]/g, '-') : '';
    let maxMinutes = DURATION_MAP[rawDur] || 90;

    if (typeof req.body.days === 'number' && req.body.days >= 1) {
      maxMinutes = Math.min(1440, req.body.days * 480);
    } else if (rawDur.includes('full') || rawDur.includes('8h') || rawDur === '1-day' || rawDur === '1day') {
      maxMinutes = 480;
    } else if (rawDur.includes('half') || rawDur.includes('4h')) {
      maxMinutes = 240;
    } else if (rawDur.includes('30')) {
      maxMinutes = 35;
    }

    const readableTitle =
      maxMinutes >= 480
        ? 'Full-Day Heritage Expedition'
        : maxMinutes >= 240
        ? 'Half-Day Cultural Trail'
        : maxMinutes <= 35
        ? '30-Minute Express Highlights'
        : '90-Minute Heritage Highlights';

    let places: any[] = [];
    try {
      places = await prisma.place.findMany({
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
    } catch (dbErr) {
      console.warn('[Itinerary] Prisma query failed, using master places:', dbErr);
    }

    if (!places || places.length === 0) {
      places = masterUnifiedPlaces.map((p) => ({
        ...p,
        heritageRecord: {
          shortStory: p.description || p.shortDescription,
          significance: p.significance || p.period,
          period: p.period,
        },
      }));
    }

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

      const isFirstStop = itineraryItems.length === 0;
      const effectiveTravelTime = isFirstStop ? Math.min(travelTime, 15) : travelTime;

      if (!isFirstStop && totalTime + effectiveTravelTime + visitDuration > maxMinutes) {
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
        travelTime: isFirstStop ? Math.max(5, Math.min(travelTime, 30)) : travelTime,
        travelMode,
        reason,
        latitude: nextPlace.latitude,
        longitude: nextPlace.longitude,
        distance: Math.round(dist * 10) / 10,
        imageUrl: nextPlace.imageUrl,
        shortStory: nextPlace.heritageRecord?.shortStory || null,
      });

      totalTime += effectiveTravelTime + visitDuration;
      currentLat = nextPlace.latitude;
      currentLng = nextPlace.longitude;
      remainingPlaces.splice(bestIdx, 1);
    }

    // Safety guarantee: If strict time budget resulted in zero stops, supply closest 2-3 stops
    if (itineraryItems.length === 0 && scoredPlaces.length > 0) {
      const topStops = scoredPlaces.slice(0, 3);
      topStops.forEach((p: any, idx: number) => {
        const d = haversineDistance(lat, lng, p.latitude, p.longitude);
        itineraryItems.push({
          placeId: p.id,
          placeName: p.name,
          order: idx + 1,
          visitDuration: baseVisitDuration,
          travelTime: idx === 0 ? 10 : 20,
          travelMode: d > 3 ? 'drive' : 'walk',
          reason: `Featured ${p.category} highlight for your selected interests`,
          latitude: p.latitude,
          longitude: p.longitude,
          distance: Math.round(d * 10) / 10,
          imageUrl: p.imageUrl,
          shortStory: p.heritageRecord?.shortStory || p.shortDescription || null,
        });
      });
      totalTime = topStops.length * baseVisitDuration + 30;
    }

    res.json({
      success: true,
      data: {
        id: uuidv4(),
        title: readableTitle,
        duration: rawDur || duration,
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

    // Invalidate itinerary caches
    cacheManager.deleteByPrefix('http:/itinerary');
    cacheManager.deleteByPrefix('http:/api/v1/itinerary');
    cacheManager.deleteByPrefix('http:/itineraries');
    cacheManager.deleteByPrefix('http:/api/v1/itineraries');

    res.status(201).json({ success: true, data: itinerary });
  } catch (error) {
    console.error('Error saving itinerary:', error);
    res.status(500).json({ success: false, error: 'Failed to save itinerary' });
  }
};
router.post('/', saveHandler);
router.post('/save', saveHandler);

// 3. GET / (Get itineraries by query userId)
router.get('/', cacheMiddleware(60), async (req: Request, res: Response) => {
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
router.get('/user/:userId', cacheMiddleware(60), async (req: Request, res: Response) => {
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
router.get('/:id', cacheMiddleware(60), async (req: Request, res: Response) => {
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

    cacheManager.deleteByPrefix('http:/itinerary');
    cacheManager.deleteByPrefix('http:/api/v1/itinerary');
    cacheManager.deleteByPrefix('http:/itineraries');
    cacheManager.deleteByPrefix('http:/api/v1/itineraries');

    res.json({ success: true, message: 'Itinerary deleted' });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({ success: false, error: 'Failed to delete itinerary' });
  }
});

export default router;
