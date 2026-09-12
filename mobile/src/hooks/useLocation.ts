import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  isLoading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

// Default: Vadodara, Gujarat (hackathon demo location)
const DEFAULT_LOCATION = {
  latitude: 22.3072,
  longitude: 73.1812,
  city: 'Vadodara',
  region: 'Gujarat',
};

let cachedLocationState: LocationState = {
  ...DEFAULT_LOCATION,
  isLoading: false,
  error: null,
  permissionGranted: false,
};
let isLocationInitialized = false;
const listeners = new Set<(loc: LocationState) => void>();

function notifyListeners(nextState: LocationState) {
  cachedLocationState = nextState;
  listeners.forEach((listener) => listener(nextState));
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>(cachedLocationState);

  useEffect(() => {
    listeners.add(setLocation);

    if (!isLocationInitialized) {
      isLocationInitialized = true;
      getLocation();
    }

    return () => {
      listeners.delete(setLocation);
    };
  }, []);

  async function getLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        notifyListeners({
          ...cachedLocationState,
          isLoading: false,
          error: 'Location permission denied. Using default location.',
          permissionGranted: false,
        });
        return;
      }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        let city = DEFAULT_LOCATION.city;
        let region = DEFAULT_LOCATION.region;

        try {
          const [geocode] = await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });

          if (geocode) {
            city = geocode.city || geocode.subregion || city;
            region = geocode.region || region;
          }
        } catch {
          // Geocoding failed, use defaults
        }

      notifyListeners({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        city,
        region,
        isLoading: false,
        error: null,
        permissionGranted: true,
      });
    } catch (error) {
      notifyListeners({
        ...cachedLocationState,
        isLoading: false,
        error: 'Failed to get location. Using default.',
        permissionGranted: false,
      });
    }
  }

  const refresh = async () => {
    notifyListeners({ ...cachedLocationState, isLoading: true });
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      let city = DEFAULT_LOCATION.city;
      let region = DEFAULT_LOCATION.region;

      try {
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        if (geocode) {
          city = geocode.city || geocode.subregion || city;
          region = geocode.region || region;
        }
      } catch {}

      notifyListeners({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        city,
        region,
        isLoading: false,
        error: null,
        permissionGranted: true,
      });
    } catch {
      notifyListeners({ ...cachedLocationState, isLoading: false });
    }
  };

  return { ...location, refresh };
}
