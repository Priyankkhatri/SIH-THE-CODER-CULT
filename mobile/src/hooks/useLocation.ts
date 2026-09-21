import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  isLoading: boolean;
  error: string | null;
  permissionGranted: boolean;
  isGpsResolved: boolean;
  servicesEnabled: boolean;
  accuracy: number | null;
}

// Default fallback: Vadodara, Gujarat (curated baseline)
const DEFAULT_LOCATION = {
  latitude: 22.3072,
  longitude: 73.1812,
  city: 'Vadodara',
  region: 'Gujarat',
};

// In-memory cache for reverse geocoding to eliminate duplicate network calls
const geocodeCache = new Map<string, { city: string; region: string }>();

let cachedLocationState: LocationState = {
  ...DEFAULT_LOCATION,
  isLoading: true,
  error: null,
  permissionGranted: false,
  isGpsResolved: false,
  servicesEnabled: true,
  accuracy: null,
};

let isLocationInitialized = false;
let activeWatcherSubscription: Location.LocationSubscription | null = null;
let watcherRefCount = 0;
const listeners = new Set<(loc: LocationState) => void>();

function notifyListeners(nextState: LocationState) {
  cachedLocationState = nextState;
  listeners.forEach((listener) => listener(nextState));
}

async function resolveGeocode(lat: number, lng: number): Promise<{ city: string; region: string }> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  let city = DEFAULT_LOCATION.city;
  let region = DEFAULT_LOCATION.region;

  try {
    const [geocode] = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    if (geocode) {
      city = geocode.city || geocode.subregion || geocode.district || city;
      region = geocode.region || region;
      const result = { city, region };
      geocodeCache.set(cacheKey, result);
      return result;
    }
  } catch {
    // Geocode failed or offline, fallback safely
  }

  return { city, region };
}

async function fetchPositionWithFallback(): Promise<Location.LocationObject | null> {
  // Step 1: Query Last Known Position immediately for instantaneous (<50ms) fix
  try {
    const lastKnown = await Location.getLastKnownPositionAsync({
      maxAge: 120000, // up to 2 mins old
    });
    if (lastKnown?.coords) {
      return lastKnown;
    }
  } catch {
    // Proceed to fresh fix
  }

  // Step 2: Fresh GPS position with a 7-second timeout to prevent indoor hanging
  const freshPromise = Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const timeoutPromise = new Promise<null>((_, reject) =>
    setTimeout(() => reject(new Error('Location acquisition timed out')), 7000)
  );

  try {
    return await Promise.race([freshPromise, timeoutPromise]);
  } catch {
    // If fresh timed out, try last-known with any age as last resort
    try {
      return await Location.getLastKnownPositionAsync();
    } catch {
      return null;
    }
  }
}

async function acquireLocation(force = false): Promise<LocationState> {
  if (isLocationInitialized && !force && cachedLocationState.isGpsResolved) {
    return cachedLocationState;
  }

  isLocationInitialized = true;
  notifyListeners({
    ...cachedLocationState,
    isLoading: true,
    error: null,
  });

  try {
    // 1. Check if location services (GPS provider) are enabled on the device
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      const state: LocationState = {
        ...cachedLocationState,
        isLoading: false,
        servicesEnabled: false,
        error: 'Location services are disabled. Please enable GPS in device settings.',
        permissionGranted: false,
      };
      notifyListeners(state);
      return state;
    }

    // 2. Check permission status
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      const requested = await Location.requestForegroundPermissionsAsync();
      status = requested.status;
    }

    if (status !== 'granted') {
      const state: LocationState = {
        ...cachedLocationState,
        isLoading: false,
        servicesEnabled: true,
        error: 'Location permission denied. Using default location.',
        permissionGranted: false,
      };
      notifyListeners(state);
      return state;
    }

    // 3. Fast-path: check last known position immediately for instant UI render
    try {
      const fastPos = await Location.getLastKnownPositionAsync();
      if (fastPos?.coords) {
        notifyListeners({
          ...cachedLocationState,
          latitude: fastPos.coords.latitude,
          longitude: fastPos.coords.longitude,
          accuracy: fastPos.coords.accuracy ?? null,
          isLoading: false,
          isGpsResolved: true,
          permissionGranted: true,
          servicesEnabled: true,
          error: null,
        });
      }
    } catch {}

    // 4. Accurate fresh position
    const pos = await fetchPositionWithFallback();
    if (pos?.coords) {
      const { latitude, longitude, accuracy } = pos.coords;
      const { city, region } = await resolveGeocode(latitude, longitude);

      const state: LocationState = {
        latitude,
        longitude,
        city,
        region,
        isLoading: false,
        error: null,
        permissionGranted: true,
        isGpsResolved: true,
        servicesEnabled: true,
        accuracy: accuracy ?? null,
      };
      notifyListeners(state);
      return state;
    } else {
      const state: LocationState = {
        ...cachedLocationState,
        isLoading: false,
        error: 'Could not obtain fresh GPS fix. Using last known location.',
        permissionGranted: true,
      };
      notifyListeners(state);
      return state;
    }
  } catch (err: any) {
    const state: LocationState = {
      ...cachedLocationState,
      isLoading: false,
      error: err?.message || 'Failed to acquire location. Using default.',
    };
    notifyListeners(state);
    return state;
  }
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>(cachedLocationState);

  useEffect(() => {
    listeners.add(setLocation);

    if (!isLocationInitialized) {
      acquireLocation(false);
    } else {
      // Sync immediately if already initialized
      setLocation(cachedLocationState);
    }

    return () => {
      listeners.delete(setLocation);
    };
  }, []);

  const refresh = useCallback(async (): Promise<LocationState> => {
    return await acquireLocation(true);
  }, []);

  const startWatching = useCallback(async () => {
    watcherRefCount++;
    if (activeWatcherSubscription) return;

    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') return;

      activeWatcherSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // 10s interval reduces GPS chip wake-locks
          distanceInterval: 15, // 15 meters
        },
        async (newPos) => {
          if (!newPos?.coords) return;
          const { latitude, longitude, accuracy } = newPos.coords;

          // Only re-geocode if user moved significantly (> 500m)
          const curLat = cachedLocationState.latitude;
          const curLng = cachedLocationState.longitude;
          const latDiff = Math.abs(latitude - curLat);
          const lngDiff = Math.abs(longitude - curLng);

          let city = cachedLocationState.city;
          let region = cachedLocationState.region;

          if (latDiff > 0.005 || lngDiff > 0.005 || !cachedLocationState.isGpsResolved) {
            const geo = await resolveGeocode(latitude, longitude);
            city = geo.city;
            region = geo.region;
          }

          notifyListeners({
            latitude,
            longitude,
            city,
            region,
            isLoading: false,
            error: null,
            permissionGranted: true,
            isGpsResolved: true,
            servicesEnabled: true,
            accuracy: accuracy ?? null,
          });
        }
      );
    } catch (e) {
      console.warn('[useLocation] watchPosition notice:', e);
    }
  }, []);

  const stopWatching = useCallback(() => {
    watcherRefCount = Math.max(0, watcherRefCount - 1);
    if (watcherRefCount === 0 && activeWatcherSubscription) {
      activeWatcherSubscription.remove();
      activeWatcherSubscription = null;
    }
  }, []);

  return {
    ...location,
    refresh,
    startWatching,
    stopWatching,
  };
}
