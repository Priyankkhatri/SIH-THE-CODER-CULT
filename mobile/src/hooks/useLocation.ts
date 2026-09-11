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

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    ...DEFAULT_LOCATION,
    isLoading: true,
    error: null,
    permissionGranted: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          if (isMounted) {
            setLocation((prev) => ({
              ...prev,
              isLoading: false,
              error: 'Location permission denied. Using default location.',
              permissionGranted: false,
            }));
          }
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

        if (isMounted) {
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            city,
            region,
            isLoading: false,
            error: null,
            permissionGranted: true,
          });
        }
      } catch (error) {
        if (isMounted) {
          setLocation((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Failed to get location. Using default.',
            permissionGranted: false,
          }));
        }
      }
    }

    getLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = async () => {
    setLocation((prev) => ({ ...prev, isLoading: true }));
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

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        city,
        region,
        isLoading: false,
        error: null,
        permissionGranted: true,
      });
    } catch {
      setLocation((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return { ...location, refresh };
}
