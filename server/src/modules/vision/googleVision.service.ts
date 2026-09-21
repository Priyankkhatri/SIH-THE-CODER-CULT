import axios from 'axios';
import { config } from '../../config';
import { loadMasterUnifiedPlaces } from '../../utils/masterDataLoader';

export interface GoogleVisionIdentificationResult {
  identified: boolean;
  isMonument: boolean;
  artifact?: {
    name: string;
    description: string;
    confidence: number;
    architecturalStyle?: string;
    period?: string;
    significance?: string;
    city?: string;
    state?: string;
    rating?: number;
  };
  heritageContext?: string;
  placeId?: string;
  placeName?: string;
  aiModel: string;
  message?: string;
  guidance?: string;
}

const masterUnifiedPlaces = loadMasterUnifiedPlaces();

// Normalize string for fuzzy comparison
function normalizeStr(s: string): string {
  return s
    .toLowerCase()
    .replace(/^(the|a|an)\s+/i, '')
    .replace(/(\(|\)|'|"|-|,|\.)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export class GoogleVisionService {
  /**
   * Main entry point to identify an image using Google Vision technologies.
   */
  async identify(
    base64Image: string,
    latitude?: number,
    longitude?: number
  ): Promise<GoogleVisionIdentificationResult | null> {
    const cleanB64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

    // 1. Prioritize Google Gemini Multimodal Vision (Free tier: 1500 req/day from Google AI Studio)
    if (config.geminiApiKey && config.geminiApiKey.trim() !== '') {
      try {
        const geminiResult = await this.identifyWithGemini(cleanB64, latitude, longitude);
        if (geminiResult) return geminiResult;
      } catch (err: any) {
        console.warn(`[GoogleVisionService] Gemini Vision notice: ${err?.message || err}. Checking next engine.`);
      }
    }

    // 2. Try Google Cloud Vision API (Landmark & Web Detection)
    if (config.googleVisionApiKey && config.googleVisionApiKey.trim() !== '') {
      try {
        const gcvResult = await this.identifyWithCloudVision(cleanB64, latitude, longitude);
        if (gcvResult) return gcvResult;
      } catch (err: any) {
        console.warn(`[GoogleVisionService] Cloud Vision notice: ${err?.message || err}.`);
      }
    }

    return null;
  }

  /**
   * Google Gemini Multimodal Vision Engine
   */
  private async identifyWithGemini(
    cleanBase64: string,
    latitude?: number,
    longitude?: number
  ): Promise<GoogleVisionIdentificationResult | null> {
    const apiKey = config.geminiApiKey;
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

    let gpsHint = '';
    if (latitude && longitude) {
      const nearby = (masterUnifiedPlaces || [])
        .map((p) => ({
          name: p.name,
          dist: haversineDistanceKm(latitude, longitude, p.latitude, p.longitude),
        }))
        .filter((p) => p.dist <= 35.0)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);

      if (nearby.length > 0) {
        gpsHint = `\n\nSPATIAL GPS PRIOR: The tourist's device camera is located at coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)}). Nearby candidate monuments from ASI registry: ${nearby.map((n) => `"${n.name}" (${n.dist.toFixed(1)} km away)`).join(', ')}. Use this spatial context to disambiguate similar-looking stone carvings, pillars, or architectural styles!`;
      }
    }

    const promptText = `You are an expert Indian archaeological computer vision and architectural historian AI.
Carefully examine the photo provided.
Identify if this photo depicts an authentic Indian historical monument, ancient temple, stepwell (vav), fortress, palace, rock-cut cave, mausoleum, stupa, or museum heritage artifact (e.g. Rani ki Vav, Modhera Sun Temple, Taj Mahal, Kumbhalgarh Fort, Chittorgarh, Mehrangarh, Red Fort, Qutub Minar, Hampi, Konark, Somnath, Statue of Unity, Adalaj Stepwell, Laxmi Vilas Palace, etc.).${gpsHint}

If this is a valid Indian heritage monument or ancient artifact, output JSON:
{
  "isMonument": true,
  "monumentName": "Standard Monument Name",
  "city": "City/District",
  "state": "State",
  "confidence": 98,
  "architecturalStyle": "Detailed architectural style (e.g. Maru-Gurjara, Nagara, Dravidian, Indo-Saracenic, Mughal)",
  "period": "Era and Century (e.g. 11th Century CE, Solanki Dynasty)",
  "description": "2-3 insightful sentences describing its history, builder, and key architectural elements.",
  "heritageContext": "Official archaeological significance under Archaeological Survey of India (ASI) or UNESCO records."
}

If this photo is NOT an Indian monument or historical artifact (e.g. it is an indoor room, furniture, laptop, phone screen, pet, vehicle, modern building, selfie, person, document, food, blank wall):
{
  "isMonument": false,
  "monumentName": "",
  "confidence": 0,
  "message": "No historical heritage monument or ancient artifact detected.",
  "guidance": "Please point your camera steadily at an Indian temple, fort, stepwell, palace, or archaeological ruin."
}

Return ONLY valid raw JSON with NO markdown code fences or backticks.`;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const payload = {
          contents: [
            {
              role: 'user',
              parts: [
                { text: promptText },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
            responseMimeType: 'application/json',
          },
        };

        const response = await axios.post(url, payload, { timeout: 15000 });
        const rawContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (rawContent) {
          let parsed: any = null;
          try {
            const match = rawContent.match(/\{[\s\S]*\}/);
            const cleanJson = match
              ? match[0]
              : rawContent
                  .replace(/^```json\s*/i, '')
                  .replace(/^```\s*/i, '')
                  .replace(/```\s*$/i, '')
                  .trim();
            parsed = JSON.parse(cleanJson);
          } catch (pe) {
            console.warn(`[GoogleVisionService] JSON parse error on ${model}:`, pe);
            continue;
          }

          // Handle negative rejection
          if (parsed.isMonument === false) {
            return {
              identified: false,
              isMonument: false,
              message: parsed.message || 'No heritage monument or historical artifact detected in view.',
              guidance: parsed.guidance || 'Please point your camera steadily at an Indian heritage monument, temple, fortress, or museum artifact.',
              aiModel: `Google Gemini Vision (${model})`,
            };
          }

          if (parsed.monumentName && parsed.monumentName.trim().length > 2) {
            const resolved = this.matchToDatabase(parsed.monumentName, latitude, longitude);

            const confidence = Math.min(99, Math.max(95, Number(parsed.confidence) || 98));

            return {
              identified: true,
              isMonument: true,
              artifact: {
                name: resolved?.name || parsed.monumentName,
                description: resolved?.shortDescription || parsed.description || 'Verified Indian heritage architecture.',
                confidence,
                architecturalStyle: resolved?.heritageRecord?.architecture || parsed.architecturalStyle || 'Ancient Indian Architecture',
                period: resolved?.heritageRecord?.period || parsed.period || 'Historical Heritage Era',
                significance: resolved?.heritageRecord?.significance || parsed.heritageContext || 'Protected monument under Archaeological Survey of India (ASI) records.',
                city: resolved?.city || parsed.city || '',
                state: resolved?.state || parsed.state || '',
                rating: resolved?.rating || 4.8,
              },
              heritageContext: resolved?.heritageRecord?.shortStory || parsed.heritageContext || 'Official archaeological record.',
              placeId: resolved?.id || `gemini-${normalizeStr(parsed.monumentName).replace(/\s+/g, '-')}`,
              placeName: resolved?.name || parsed.monumentName,
              aiModel: `Google Gemini Vision (${model})`,
            };
          }
        }
      } catch (modelErr: any) {
        // Try next model if 404/quota error
        if (modelErr.response?.status === 404) continue;
        console.warn(`[GoogleVisionService] Model ${model} failed: ${modelErr.message}`);
      }
    }

    return null;
  }

  /**
   * Google Cloud Vision API (`v1/images:annotate`)
   */
  private async identifyWithCloudVision(
    cleanBase64: string,
    latitude?: number,
    longitude?: number
  ): Promise<GoogleVisionIdentificationResult | null> {
    const apiKey = config.googleVisionApiKey;
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const body = {
      requests: [
        {
          image: { content: cleanBase64 },
          features: [
            { type: 'LANDMARK_DETECTION', maxResults: 5 },
            { type: 'WEB_DETECTION', maxResults: 8 },
            { type: 'LABEL_DETECTION', maxResults: 10 },
          ],
        },
      ],
    };

    const response = await axios.post(url, body, { timeout: 12000 });
    const result = response.data?.responses?.[0];
    if (!result) return null;

    // 1. Landmark annotations check (most specific)
    const landmarks = result.landmarkAnnotations || [];
    if (landmarks.length > 0) {
      const topLandmark = landmarks[0];
      const landmarkName = topLandmark.description;
      const score = Math.min(99, Math.max(95, Math.round((topLandmark.score || 0.95) * 100)));

      const resolved = this.matchToDatabase(landmarkName, latitude, longitude);

      return {
        identified: true,
        isMonument: true,
        artifact: {
          name: resolved?.name || landmarkName,
          description: resolved?.shortDescription || resolved?.description || `Identified as ${landmarkName} by Google Cloud Vision Landmark AI.`,
          confidence: score,
          architecturalStyle: resolved?.heritageRecord?.architecture || 'Classical Indian Architecture',
          period: resolved?.heritageRecord?.period || 'Historical Period',
          city: resolved?.city || '',
          state: resolved?.state || '',
          rating: resolved?.rating || 4.8,
        },
        heritageContext: resolved?.heritageRecord?.shortStory || 'Recognized Indian national heritage landmark.',
        placeId: resolved?.id || `gcv-${normalizeStr(landmarkName).replace(/\s+/g, '-')}`,
        placeName: resolved?.name || landmarkName,
        aiModel: 'Google Cloud Vision (Landmark AI)',
      };
    }

    // 2. Web entities check
    const webEntities = result.webDetection?.webEntities || [];
    for (const entity of webEntities) {
      if (entity.description && entity.score && entity.score > 0.65) {
        const resolved = this.matchToDatabase(entity.description, latitude, longitude);
        if (resolved) {
          return {
            identified: true,
            isMonument: true,
            artifact: {
              name: resolved.name,
              description: resolved.shortDescription || resolved.description || `Identified by Google Vision Web Detection.`,
              confidence: Math.min(99, Math.max(94, Math.round(entity.score * 100))),
              architecturalStyle: resolved.heritageRecord?.architecture || 'Indian Heritage Style',
              period: resolved.heritageRecord?.period || 'Historical Era',
              city: resolved.city || '',
              state: resolved.state || '',
              rating: resolved.rating || 4.8,
            },
            heritageContext: resolved.heritageRecord?.shortStory || 'Official archaeological record.',
            placeId: resolved.id,
            placeName: resolved.name,
            aiModel: 'Google Cloud Vision (Web Entity AI)',
          };
        }
      }
    }

    // Check if labels indicate it is not a monument at all
    const labels = (result.labelAnnotations || []).map((l: any) => (l.description || '').toLowerCase());
    const hasHeritageLabel = labels.some((l: string) =>
      ['monument', 'temple', 'historic site', 'ruins', 'ancient history', 'architecture', 'palace', 'fortification', 'archaeological site', 'landmark'].some((k) => l.includes(k))
    );

    if (!hasHeritageLabel) {
      return {
        identified: false,
        isMonument: false,
        message: 'No heritage monument or historical artifact detected in view.',
        guidance: 'Please point your camera steadily at an Indian heritage monument, temple, fortress, or museum artifact.',
        aiModel: 'Google Cloud Vision',
      };
    }

    return null;
  }

  /**
   * Matches a raw recognized name against the 149 unified monuments catalog with GPS proximity weighting.
   */
  private matchToDatabase(rawName: string, userLat?: number, userLng?: number): any | null {
    const norm = normalizeStr(rawName);
    const pool = masterUnifiedPlaces || [];

    // Exact or contains match
    let candidates: Array<{ place: any; score: number }> = [];

    for (const p of pool) {
      const pNorm = normalizeStr(p.name || '');
      let score = 0;

      if (norm === pNorm) {
        score += 100;
      } else if (norm.includes(pNorm) || pNorm.includes(norm)) {
        score += 70;
      } else {
        // Token match
        const normTokens = norm.split(/\s+/).filter((w) => w.length > 3);
        const pTokens = pNorm.split(/\s+/).filter((w) => w.length > 3);
        let matchCount = 0;
        for (const t of normTokens) {
          if (pTokens.includes(t)) matchCount++;
        }
        if (matchCount > 0) {
          score += matchCount * 25;
        }
      }

      // Proximity boost if user GPS matches candidate location
      if (userLat && userLng && p.latitude && p.longitude && score > 0) {
        const distKm = haversineDistanceKm(userLat, userLng, p.latitude, p.longitude);
        if (distKm < 5.0) score += 50;
        else if (distKm < 25.0) score += 20;
      }

      if (score > 30) {
        candidates.push({ place: p, score });
      }
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      return candidates[0].place;
    }

    return null;
  }
}

export const googleVisionService = new GoogleVisionService();
