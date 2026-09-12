export interface RouteResult {
  coordinates: Array<{ latitude: number; longitude: number }>;
  distanceKm: number;
  durationMinutes: number;
  durationMin: number;
  bearing: number;
}

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

// Generates smooth intermediate coordinates along the path
export function generateDirectPath(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  steps = 8
): Array<{ latitude: number; longitude: number }> {
  const coords: Array<{ latitude: number; longitude: number }> = [];
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    coords.push({
      latitude: startLat + (endLat - startLat) * fraction,
      longitude: startLng + (endLng - startLng) * fraction,
    });
  }
  return coords;
}

// Fetches actual road route from OSRM with instant fallback to direct path
export async function getRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<RouteResult> {
  const directDist = haversineDistance(startLat, startLng, endLat, endLng);
  const bearing = calculateBearing(startLat, startLng, endLat, endLng);
  const directDuration = Math.round((directDist / 55) * 60); // approx 55 km/h average drive

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const res = await fetch(osrmUrl, {
      headers: { 'User-Agent': 'Yatra-Heritage-App/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await res.json();
    if (data.routes && data.routes[0]) {
      const r = data.routes[0];
      const rawCoords: number[][] = r.geometry?.coordinates || [];
      const parsedCoords = rawCoords.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }));

      return {
        coordinates: parsedCoords.length > 0 ? parsedCoords : generateDirectPath(startLat, startLng, endLat, endLng),
        distanceKm: Number((r.distance / 1000).toFixed(1)),
        durationMinutes: Math.round(r.duration / 60),
        durationMin: Math.round(r.duration / 60),
        bearing,
      };
    }
  } catch (err) {
    // Network or timeout: gracefully fallback to direct path
  }

  return {
    coordinates: generateDirectPath(startLat, startLng, endLat, endLng),
    distanceKm: Number(directDist.toFixed(1)),
    durationMinutes: Math.max(5, directDuration),
    durationMin: Math.max(5, directDuration),
    bearing,
  };
}
