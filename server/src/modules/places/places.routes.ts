import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../config/database';
import { cacheMiddleware, cacheManager } from '../../utils/cacheManager';
import { searchEngine } from './searchService';
import { loadMasterUnifiedPlaces } from '../../utils/masterDataLoader';
import { GooglePlacesService } from './googlePlaces.service';

const router = Router();

const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).default(22.3072),
  lng: z.coerce.number().min(-180).max(180).default(73.1812),
  radius: z.coerce.number().positive().max(500).default(50),
  category: z.string().max(50).optional(),
  lang: z.enum(['en', 'hi', 'gu']).default('en'),
});

const searchQuerySchema = z.object({
  q: z.string().max(200).default(''),
  category: z.string().max(50).optional(),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  lang: z.enum(['en', 'hi', 'gu']).default('en'),
});

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

import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';

// In-memory cache for proxied images (max 150 images, max 24h TTL)
interface CachedImage {
  buffer: Buffer;
  contentType: string;
  cachedAt: number;
}
const imageProxyCache = new Map<string, CachedImage>();
const MAX_PROXY_CACHE_SIZE = 150;
const PROXY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function fetchRemoteImage(
  targetUrl: string,
  maxRedirects = 4
): Promise<{ buffer: Buffer; contentType: string; statusCode: number }> {
  return new Promise((resolve, reject) => {
    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'http:' ? http : https;

      const req = client.get(
        parsed,
        {
          headers: {
            'User-Agent':
              'YatraHeritageCompanion/1.0 (https://github.com/Priyankkhatri/SIH-THE-CODER-CULT; contact@yatra.in)',
            Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            Referer: 'https://en.wikipedia.org/',
          },
          timeout: 10000,
        },
        (res) => {
          if (
            res.statusCode &&
            [301, 302, 303, 307, 308].includes(res.statusCode) &&
            res.headers.location &&
            maxRedirects > 0
          ) {
            const redirectUrl = new URL(res.headers.location, targetUrl).toString();
            return fetchRemoteImage(redirectUrl, maxRedirects - 1)
              .then(resolve)
              .catch(reject);
          }

          if (!res.statusCode || res.statusCode >= 400) {
            return reject(new Error(`Remote returned HTTP ${res.statusCode}`));
          }

          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const contentType = res.headers['content-type'] || 'image/jpeg';
            resolve({ buffer, contentType, statusCode: res.statusCode || 200 });
          });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Image fetch timed out'));
      });
      req.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

// Load verified master catalog of all 148 Indian national monuments
const masterUnifiedPlaces = loadMasterUnifiedPlaces();

// 1. GET /places/image-proxy?url=...
router.get('/image-proxy', async (req: Request, res: Response) => {
  try {
    const rawUrl = req.query.url as string;
    if (!rawUrl || typeof rawUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'Missing url parameter' });
    }

    const decodedUrl = decodeURIComponent(rawUrl.trim());
    let parsed: URL;
    try {
      parsed = new URL(decodedUrl.startsWith('//') ? `https:${decodedUrl}` : decodedUrl);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid URL format' });
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return res.status(400).json({ success: false, error: 'Invalid protocol' });
    }

    const fullUrl = parsed.toString();
    const now = Date.now();
    const cached = imageProxyCache.get(fullUrl);

    if (cached && now - cached.cachedAt < PROXY_CACHE_TTL_MS) {
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('X-Proxy-Cache', 'HIT');
      return res.send(cached.buffer);
    }

    const { buffer, contentType } = await fetchRemoteImage(fullUrl);

    if (imageProxyCache.size >= MAX_PROXY_CACHE_SIZE) {
      const oldestKey = imageProxyCache.keys().next().value;
      if (oldestKey) imageProxyCache.delete(oldestKey);
    }
    imageProxyCache.set(fullUrl, { buffer, contentType, cachedAt: now });

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Proxy-Cache', 'MISS');
    return res.send(buffer);
  } catch (err: any) {
    console.error('[ImageProxy] Error proxying image:', err?.message || err);
    return res.status(502).json({ success: false, error: 'Failed to proxy image', details: err?.message });
  }
});

// 1. GET /places - All places with optional category & language filter
router.get('/', cacheMiddleware(300), async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const lang = (req.query.lang as string) || 'en';

    let places: any[] = [];
    try {
      places = await prisma.place.findMany({
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
    } catch (dbErr) {
      console.warn('[PlacesRoutes] Prisma findMany note, using master catalog:', dbErr);
    }

    if (places.length < masterUnifiedPlaces.length) {
      const map = new Map<string, any>();
      for (const p of masterUnifiedPlaces) {
        if (!category || p.category === category) {
          map.set(p.id, {
            ...p,
            heritageRecord: p.heritageRecord ? {
              shortStory: p.heritageRecord.shortStory,
              period: p.heritageRecord.period,
            } : undefined,
          });
        }
      }
      for (const p of places) map.set(p.id, p);
      places = Array.from(map.values());
    }

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
router.get('/categories/list', cacheMiddleware(600), async (_req: Request, res: Response) => {
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
router.get('/nearby', cacheMiddleware(120), async (req: Request, res: Response) => {
  try {
    const parseResult = nearbyQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid nearby query parameters',
        details: parseResult.error.flatten(),
      });
    }

    const { lat, lng, radius, category, lang } = parseResult.data;

    let places: any[] = [];
    try {
      places = await prisma.place.findMany({
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
    } catch (dbErr) {
      console.warn('[PlacesRoutes] Prisma nearby query note, using master catalog:', dbErr);
    }

    if (places.length < masterUnifiedPlaces.length) {
      const map = new Map<string, any>();
      for (const p of masterUnifiedPlaces) {
        if (!category || p.category === category) {
          map.set(p.id, {
            ...p,
            heritageRecord: p.heritageRecord ? {
              shortStory: p.heritageRecord.shortStory,
              period: p.heritageRecord.period,
            } : undefined,
          });
        }
      }
      for (const p of places) map.set(p.id, p);
      places = Array.from(map.values());
    }

    // Calculate distances and sort strictly ascending by proximity
    const placesWithDistance = places
      .map((place: any) => ({
        ...place,
        name: lang === 'hi' && place.nameHi ? place.nameHi : lang === 'gu' && place.nameGu ? place.nameGu : place.name,
        distance: Number(haversineDistance(lat, lng, place.latitude, place.longitude).toFixed(1)),
      }))
      .sort((a: any, b: any) => a.distance - b.distance);

    // If within radius has items, return those. If none (e.g. wide distance), return closest 20
    const withinRadius = placesWithDistance.filter((place: any) => place.distance <= radius);
    const finalPlaces = withinRadius.length > 0 ? withinRadius : placesWithDistance.slice(0, 20);

    res.json({
      success: true,
      data: finalPlaces,
      meta: {
        total: finalPlaces.length,
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

// 4. GET /places/search?q=palace&category=temple&state=Gujarat&lang=en
router.get('/search', cacheMiddleware(120), async (req: Request, res: Response) => {
  try {
    const parseResult = searchQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid search query parameters',
        details: parseResult.error.flatten(),
      });
    }

    const { q: query, category, state, lang, limit } = parseResult.data;

    const searchResults = await searchEngine.search({
      query,
      category,
      state,
      lang,
      limit,
    });

    const localizedData = searchResults.map((resItem) => {
      const place = resItem.place;
      return {
        ...place,
        name:
          lang === 'hi' && place.nameHi
            ? place.nameHi
            : lang === 'gu' && place.nameGu
            ? place.nameGu
            : place.name,
        _searchRelevance: resItem.score,
        _matchedFields: resItem.matchedFields,
      };
    });

    res.json({
      success: true,
      data: localizedData,
      meta: {
        total: localizedData.length,
        query,
        category: category || 'all',
        state: state || 'all',
      },
    });
  } catch (error) {
    console.error('Error searching places:', error);
    res.status(500).json({ success: false, error: 'Failed to search places' });
  }
});

// 5. GET /places/:id/recommendations
router.get('/:id/recommendations', cacheMiddleware(300), async (req: Request, res: Response) => {
  try {
    const placeId = req.params.id as string;
    const allPlaces = await searchEngine.getAllPlacesUnified();
    const currentPlace = allPlaces.find(
      (p) => p.id?.toLowerCase() === placeId.toLowerCase() || p.name?.toLowerCase() === placeId.toLowerCase()
    );

    if (!currentPlace) {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }

    // Score by same category and distance
    const recommended = allPlaces
      .filter((p: any) => p.id !== currentPlace.id)
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
      .slice(0, 6);

    res.json({ success: true, data: recommended });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch recommendations' });
  }
});

// 6. GET /places/:id/reviews - Fetch visitor reviews and rating breakdown
router.get('/:id/reviews', cacheMiddleware(60), async (req: Request, res: Response) => {
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

    // Invalidate review cache for this place
    cacheManager.deleteByPrefix(`http:/places/${placeId}/reviews`);
    cacheManager.deleteByPrefix(`http:/api/v1/places/${placeId}/reviews`);

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

// 8. GET /places/:id/google-details - Real-time Google rating, review count, open status
router.get('/:id/google-details', cacheMiddleware(180), async (req: Request, res: Response) => {
  try {
    const q = (req.params.id as string).toLowerCase().trim();
    let place = masterUnifiedPlaces.find(
      (p) => p.id?.toLowerCase() === q || p.name?.toLowerCase() === q
    );
    if (!place) {
      try {
        place = (await prisma.place.findUnique({ where: { id: req.params.id as string } })) as any;
      } catch (_) {}
    }
    if (!place) {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }

    const enrichment = await GooglePlacesService.enrichPlace(place.name, place.latitude, place.longitude);
    res.json({ success: true, data: enrichment });
  } catch (error: any) {
    console.error('Error fetching Google Place details:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch Google Place details' });
  }
});

// 9. GET /places/:id/nearby-amenities?type=food|restroom|atm|parking
router.get('/:id/nearby-amenities', cacheMiddleware(180), async (req: Request, res: Response) => {
  try {
    const q = (req.params.id as string).toLowerCase().trim();
    const type = (req.query.type as any) || 'food';
    let place = masterUnifiedPlaces.find(
      (p) => p.id?.toLowerCase() === q || p.name?.toLowerCase() === q
    );
    if (!place) {
      try {
        place = (await prisma.place.findUnique({ where: { id: req.params.id as string } })) as any;
      } catch (_) {}
    }
    if (!place) {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }

    const amenities = await GooglePlacesService.getNearbyAmenities(place.name, place.latitude, place.longitude, type);
    res.json({ success: true, data: amenities, count: amenities.length, type });
  } catch (error: any) {
    console.error('Error fetching nearby amenities:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch nearby amenities' });
  }
});

// 10. GET /places/:id (Parametric route at the bottom)
router.get('/:id', cacheMiddleware(300), async (req: Request, res: Response) => {
  try {
    let place: any = null;
    try {
      place = await prisma.place.findUnique({
        where: { id: req.params.id as string },
        include: {
          heritageRecord: {
            include: { sources: true },
          },
          artifacts: true,
        },
      });
    } catch (dbErr) {
      console.warn('[PlacesRoutes] Prisma findUnique error, falling back to master catalog:', dbErr);
    }

    if (!place) {
      const q = (req.params.id as string).toLowerCase().trim();
      const masterMatch = masterUnifiedPlaces.find(
        (p) => p.id?.toLowerCase() === q || p.name?.toLowerCase() === q
      );
      if (masterMatch) {
        place = masterMatch;
      }
    }

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
