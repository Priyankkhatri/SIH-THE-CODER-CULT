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
  const R = 6371; // km
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

export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
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
