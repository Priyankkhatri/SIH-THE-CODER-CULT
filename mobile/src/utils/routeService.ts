export interface RouteResult {
  coordinates: Array<{ latitude: number; longitude: number }>;
  distanceKm: number;
  durationMinutes: number;
  durationMin: number;
  bearing: number;
  bbox?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  source: 'osrm' | 'fallback';
}

export type TravelMode = 'driving' | 'walking';

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
  // Perpendicular bow scaled to trip length (subtle curve, max ~0.02deg)
  const dist = Math.hypot(endLat - startLat, endLng - startLng);
  const bow = Math.min(0.02, dist * 0.06);
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    // Sine bow peaks mid-route, zero at endpoints
    const curve = Math.sin(f * Math.PI) * bow;
    coords.push({
      latitude: startLat + (endLat - startLat) * f + curve * 0.6,
      longitude: startLng + (endLng - startLng) * f - curve,
    });
  }
  return coords;
}

// Fetches actual road route from OSRM with curved fallback path
export async function getRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  travelMode: TravelMode = 'driving'
): Promise<RouteResult> {
  const directDist = haversineDistance(startLat, startLng, endLat, endLng);
  const bearing = calculateBearing(startLat, startLng, endLat, endLng);
  const avgSpeedKmh = travelMode === 'walking' ? 5 : 45;
  const directDuration = Math.max(2, Math.round((directDist / avgSpeedKmh) * 60));
  const profile = travelMode === 'walking' ? 'foot' : 'driving';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const osrmUrl = `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
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

      return {
        coordinates: coords,
        distanceKm: Number((r.distance / 1000).toFixed(1)),
        durationMinutes: Math.max(1, Math.round(r.duration / 60)),
        durationMin: Math.max(1, Math.round(r.duration / 60)),
        bearing,
        bbox: computeBbox(coords),
        source: 'osrm',
      };
    }
    throw new Error('OSRM empty route');
  } catch (err) {
    // Network/timeout: curved fallback keeps in-app line + HUD alive
    const coords = generateDirectPath(startLat, startLng, endLat, endLng);
    return {
      coordinates: coords,
      distanceKm: Number(directDist.toFixed(1)),
      durationMinutes: directDuration,
      durationMin: directDuration,
      bearing,
      bbox: computeBbox(coords),
      source: 'fallback',
    };
  }
}
