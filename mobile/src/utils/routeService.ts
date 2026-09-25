export interface RouteStep {
  instruction: string;
  maneuverType: string;
  modifier?: string;
  name: string;
  distanceMeters: number;
  durationSeconds: number;
}

export interface RouteResult {
  coordinates: Array<{ latitude: number; longitude: number }>;
  distanceKm: number;
  durationMinutes: number;
  durationMin: number;
  bearing: number;
  travelMode?: TravelMode;
  steps?: RouteStep[];
  bbox?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  source: 'osrm' | 'fallback';
}

export type TravelMode = 'driving' | 'walking' | 'transit';

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number' ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return 0;
  }

  // Exact match fast-path
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  // Domain clamp
  const safeLat1 = Math.max(-90, Math.min(90, lat1));
  const safeLat2 = Math.max(-90, Math.min(90, lat2));
  const safeLon1 = Math.max(-180, Math.min(180, lon1));
  const safeLon2 = Math.max(-180, Math.min(180, lon2));

  const R = 6371; // Earth radius in km
  const dLat = ((safeLat2 - safeLat1) * Math.PI) / 180;
  const dLon = ((safeLon2 - safeLon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((safeLat1 * Math.PI) / 180) *
      Math.cos((safeLat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  // Numerical precision clamp for antipodal or identical points
  const clampedA = Math.max(0, Math.min(1, a));
  const c = 2 * Math.atan2(Math.sqrt(clampedA), Math.sqrt(1 - clampedA));
  return Math.max(0, R * c);
}

export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number' ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2) ||
    (lat1 === lat2 && lon1 === lon2)
  ) {
    return 0;
  }

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const safeLat1 = Math.max(-90, Math.min(90, lat1));
  const safeLat2 = Math.max(-90, Math.min(90, lat2));
  const safeLon1 = Math.max(-180, Math.min(180, lon1));
  const safeLon2 = Math.max(-180, Math.min(180, lon2));

  const φ1 = toRad(safeLat1);
  const φ2 = toRad(safeLat2);
  const Δλ = toRad(safeLon2 - safeLon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const rawBearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
  return Math.round(rawBearing * 10) / 10;
}

function computeBbox(coords: Array<{ latitude: number; longitude: number }>) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const c of coords) {
    if (c.latitude < minLat) minLat = c.latitude;
    if (c.latitude > maxLat) maxLat = c.latitude;
    if (c.longitude < minLng) minLng = c.longitude;
    if (c.longitude > maxLng) maxLng = c.longitude;
  }
  return { minLat, maxLat, minLng, maxLng };
}

// Generates a densified, gently curved path so offline fallback never looks
// like a ruler-straight line across blocks.
export function generateDirectPath(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  steps = 32
): Array<{ latitude: number; longitude: number }> {
  const coords: Array<{ latitude: number; longitude: number }> = [];
  const dist = Math.hypot(endLat - startLat, endLng - startLng);
  const bow = Math.min(0.02, dist * 0.06);
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const curve = Math.sin(f * Math.PI) * bow;
    coords.push({
      latitude: startLat + (endLat - startLat) * f + curve * 0.6,
      longitude: startLng + (endLng - startLng) * f - curve,
    });
  }
  return coords;
}

function formatManeuverInstruction(step: any): string {
  const type = step.maneuver?.type || 'turn';
  const mod = (step.maneuver?.modifier || '').replace('_', ' ');
  const street = step.name ? ` onto ${step.name}` : '';

  if (type === 'depart') return `Head ${mod || 'north'}${street}`;
  if (type === 'arrive') return `Arrive at destination${step.name ? ` (${step.name})` : ''}`;
  if (type === 'roundabout') return `Take roundabout ${mod}${street}`;
  if (type === 'fork') return `Keep ${mod}${street}`;
  if (type === 'end of road') return `At the end of the road, turn ${mod}${street}`;
  if (mod) return `Turn ${mod}${street}`;
  return `Continue straight${street}`;
}

// Fetches actual road route from OSRM with step-by-step maneuvers
export async function getRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  travelMode: TravelMode = 'driving'
): Promise<RouteResult> {
  const directDist = haversineDistance(startLat, startLng, endLat, endLng);
  const bearing = calculateBearing(startLat, startLng, endLat, endLng);
  const avgSpeedKmh = travelMode === 'walking' ? 5 : travelMode === 'transit' ? 32 : 45;
  const directDuration = Math.max(2, Math.round((directDist / avgSpeedKmh) * 60));
  const profile = travelMode === 'walking' ? 'foot' : 'driving';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const osrmUrl = `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(osrmUrl, {
      headers: { 'User-Agent': 'Yatra-Heritage-App/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const data = await res.json();
    if (data.routes && data.routes[0]) {
      const r = data.routes[0];
      const rawCoords: number[][] = r.geometry?.coordinates || [];
      const parsedCoords = rawCoords.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }));
      const coords =
        parsedCoords.length > 1
          ? parsedCoords
          : generateDirectPath(startLat, startLng, endLat, endLng);

      // Parse step-by-step maneuvers
      const rawSteps = r.legs?.[0]?.steps || [];
      const steps: RouteStep[] = rawSteps.map((st: any) => ({
        instruction: formatManeuverInstruction(st),
        maneuverType: st.maneuver?.type || 'turn',
        modifier: st.maneuver?.modifier || '',
        name: st.name || '',
        distanceMeters: Math.round(st.distance || 0),
        durationSeconds: Math.round(st.duration || 0),
      }));

      const baseDurationMin = Math.max(1, Math.round(r.duration / 60));
      // Adjust duration for transit mode (accounting for traffic + station stops)
      const adjustedDuration = travelMode === 'transit' ? Math.round(baseDurationMin * 1.35 + 4) : baseDurationMin;

      return {
        coordinates: coords,
        distanceKm: Number((r.distance / 1000).toFixed(1)),
        durationMinutes: adjustedDuration,
        durationMin: adjustedDuration,
        bearing,
        travelMode,
        steps: steps.length > 0 ? steps : undefined,
        bbox: computeBbox(coords),
        source: 'osrm',
      };
    }
    throw new Error('OSRM empty route');
  } catch (err) {
    const coords = generateDirectPath(startLat, startLng, endLat, endLng);
    const fallbackSteps: RouteStep[] = [
      {
        instruction: `Head towards destination along main arterial route`,
        maneuverType: 'depart',
        name: 'Arterial Road',
        distanceMeters: Math.round(directDist * 800),
        durationSeconds: directDuration * 45,
      },
      {
        instruction: `Arrive at heritage destination`,
        maneuverType: 'arrive',
        name: 'Heritage Site Gate',
        distanceMeters: Math.round(directDist * 200),
        durationSeconds: directDuration * 15,
      },
    ];

    return {
      coordinates: coords,
      distanceKm: Number(directDist.toFixed(1)),
      durationMinutes: directDuration,
      durationMin: directDuration,
      bearing,
      travelMode,
      steps: fallbackSteps,
      bbox: computeBbox(coords),
      source: 'fallback',
    };
  }
}

/**
 * Orders stops using nearest-neighbor heuristic starting from origin.
 * Minimizes total traveling distance across monuments.
 */
export function optimizeStopSequence<T extends { latitude?: number; longitude?: number }>(
  startLat: number,
  startLng: number,
  items: T[]
): T[] {
  if (!items || items.length <= 1) return items ? [...items] : [];

  // Separate items with valid numeric coordinates from unlocated ones
  const validItems: T[] = [];
  const unlocatedItems: T[] = [];

  for (const item of items) {
    if (
      typeof item.latitude === 'number' &&
      typeof item.longitude === 'number' &&
      !isNaN(item.latitude) &&
      !isNaN(item.longitude)
    ) {
      validItems.push(item);
    } else {
      unlocatedItems.push(item);
    }
  }

  if (validItems.length <= 1) {
    return [...validItems, ...unlocatedItems];
  }

  const unvisited = [...validItems];
  const ordered: T[] = [];
  let currentLat = startLat;
  let currentLng = startLng;

  while (unvisited.length > 0) {
    let closestIdx = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const item = unvisited[i];
      const dist = haversineDistance(
        currentLat,
        currentLng,
        item.latitude as number,
        item.longitude as number
      );
      if (dist < shortestDist) {
        shortestDist = dist;
        closestIdx = i;
      }
    }

    const [nextItem] = unvisited.splice(closestIdx, 1);
    ordered.push(nextItem);
    currentLat = nextItem.latitude as number;
    currentLng = nextItem.longitude as number;
  }

  return [...ordered, ...unlocatedItems];
}

