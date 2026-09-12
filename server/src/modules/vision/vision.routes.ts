import { Router, Request, Response } from 'express';
import prisma from '../../config/database';
import { ARTIFACTS_DATA } from '../../seed/data';

const router = Router();

// Controlled artifact catalog for hackathon demo
const ARTIFACT_CATALOG: Record<string, { name: string; description: string; visionLabels: string[] }> = {
  'laxmi_vilas_facade': {
    name: 'Laxmi Vilas Palace Facade',
    description: 'The magnificent Indo-Saracenic facade of Laxmi Vilas Palace featuring intricate stone carvings and Mughal-inspired arches.',
    visionLabels: ['palace', 'building', 'architecture', 'facade', 'landmark'],
  },
  'eme_temple_dome': {
    name: 'EME Temple Dome',
    description: 'The distinctive aluminum dome of the EME Temple (Dakshinamurthy Temple), one of the unique modern religious structures in India.',
    visionLabels: ['dome', 'temple', 'church', 'religious', 'aluminum'],
  },
  'champaner_jami_masjid': {
    name: 'Jama Masjid Champaner',
    description: 'The 15th-century Jama Masjid at Champaner, a UNESCO World Heritage Site blending Islamic and Jain architectural elements.',
    visionLabels: ['mosque', 'minaret', 'islamic', 'architecture', 'stone'],
  },
  'baroda_museum_statue': {
    name: 'Baroda Museum Sculpture Gallery',
    description: 'Greco-Roman and Indian sculptures in the Baroda Museum & Picture Gallery, one of the oldest museums in Gujarat.',
    visionLabels: ['statue', 'sculpture', 'museum', 'art', 'gallery'],
  },
  'kirti_mandir_memorial': {
    name: 'Kirti Mandir Memorial',
    description: 'The memorial temple built in honor of the Gaekwad royal family, featuring traditional Nagara-style architecture.',
    visionLabels: ['memorial', 'temple', 'monument', 'nagara', 'stone'],
  },
  'tambekar_wada_murals': {
    name: 'Tambekar Wada Wall Paintings',
    description: 'Exquisite Maratha-era wall paintings and murals depicting scenes from Hindu epics in the historic Tambekar Wada.',
    visionLabels: ['painting', 'mural', 'wall', 'art', 'fresco'],
  },
  'sursagar_shiva': {
    name: 'Sursagar Lake Shiva Statue',
    description: 'The towering 120-feet statue of Lord Shiva at the center of Sursagar Lake, a modern landmark of Vadodara.',
    visionLabels: ['statue', 'shiva', 'lake', 'landmark', 'hindu'],
  },
  'champaner_fort_wall': {
    name: 'Champaner Fort Walls',
    description: 'The massive fortification walls of Champaner, built by Sultan Mahmud Begada in the late 15th century.',
    visionLabels: ['fort', 'wall', 'fortification', 'stone', 'ruins'],
  },
  'nyay_mandir_clock': {
    name: 'Nyay Mandir Clock Tower',
    description: 'The ornate clock tower of Nyay Mandir (Temple of Justice), Vadodara\'s heritage court building.',
    visionLabels: ['clock', 'tower', 'court', 'building', 'colonial'],
  },
  'makarpura_palace_garden': {
    name: 'Makarpura Palace Gardens',
    description: 'Italian Renaissance-style gardens of Makarpura Palace, the summer residence of the Gaekwad dynasty.',
    visionLabels: ['garden', 'palace', 'fountain', 'park', 'italian'],
  },
};

// Augment catalog with all 122+ scannable master artifacts
if (Array.isArray(ARTIFACTS_DATA)) {
  ARTIFACTS_DATA.forEach((item: any) => {
    if (item.visionLabel && !ARTIFACT_CATALOG[item.visionLabel]) {
      const keywords = `${item.name} ${item.description || ''}`
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w: string) => w.length > 3 && !['feature', 'scannable', 'with', 'from', 'this', 'that'].includes(w));

      ARTIFACT_CATALOG[item.visionLabel] = {
        name: item.name,
        description: item.description,
        visionLabels: Array.from(new Set(keywords)).slice(0, 8),
      };
    }
  });
}

// POST /vision/identify - Identify an artifact from image + GPS
router.post('/identify', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, labels } = req.body;

    let bestMatch: {
      catalogId: string;
      artifact: typeof ARTIFACT_CATALOG[string];
      confidence: number;
    } | null = null;

    const inputLabels = (labels || []).map((l: string) => l.toLowerCase());

    // Find best matching artifact from catalog
    for (const [catalogId, artifact] of Object.entries(ARTIFACT_CATALOG)) {
      const matchingLabels = artifact.visionLabels.filter((vl) =>
        inputLabels.some((il: string) => il.includes(vl) || vl.includes(il))
      );

      const confidence = inputLabels.length > 0
        ? matchingLabels.length / Math.max(inputLabels.length, artifact.visionLabels.length)
        : 0;

      if (confidence > 0 && (!bestMatch || confidence > bestMatch.confidence)) {
        bestMatch = { catalogId, artifact, confidence };
      }
    }

    // If no label match, try GPS-based matching
    if (!bestMatch && latitude && longitude) {
      const nearbyPlaces = await prisma.place.findMany({
        include: { artifacts: true },
      });

      for (const place of nearbyPlaces) {
        const dist = haversineDistance(latitude, longitude, place.latitude, place.longitude);
        if (dist < 0.5 && place.artifacts.length > 0) {
          const artifact = place.artifacts[0];
          bestMatch = {
            catalogId: artifact.visionLabel,
            artifact: {
              name: artifact.name,
              description: artifact.description,
              visionLabels: [artifact.visionLabel],
            },
            confidence: 0.7,
          };
          break;
        }
      }
    }

    if (!bestMatch) {
      return res.json({
        success: true,
        data: {
          identified: false,
          message: 'Could not identify the artifact. Try getting closer or ensuring good lighting.',
        },
      });
    }

    // Get heritage record for additional context
    const artifactInDb = await prisma.artifact.findFirst({
      where: { visionLabel: { contains: bestMatch.catalogId } },
      include: {
        place: {
          include: {
            heritageRecord: {
              select: {
                shortStory: true,
                significance: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        identified: true,
        artifact: {
          name: bestMatch.artifact.name,
          description: bestMatch.artifact.description,
          confidence: Math.round(bestMatch.confidence * 100),
        },
        heritageContext: artifactInDb?.place?.heritageRecord?.shortStory || null,
        placeId: artifactInDb?.placeId || null,
        placeName: artifactInDb?.place?.name || null,
      },
    });
  } catch (error) {
    console.error('Vision identify error:', error);
    res.status(500).json({ success: false, error: 'Vision identification failed' });
  }
});

// GET /vision/catalog - Get supported artifacts for demo
router.get('/catalog', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: Object.entries(ARTIFACT_CATALOG).map(([id, artifact]) => ({
      id,
      name: artifact.name,
      description: artifact.description,
    })),
  });
});

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

export default router;
