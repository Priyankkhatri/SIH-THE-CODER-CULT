import { Linking, Platform, Alert } from 'react-native';

export interface TransitDestination {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
}

/**
 * Dispatches ride request to Uber.
 * Automatically tries native Uber app scheme first, then falls back to Uber Web / App Store.
 */
export async function openUberRide(destination: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = destination;
  const encodedName = encodeURIComponent(name);

  // Uber native app universal URL scheme
  const nativeUrl = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${encodedName}`;
  // Uber web/mobile fallback URL
  const webUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${encodedName}`;

  try {
    const canOpen = await Linking.canOpenURL(nativeUrl);
    if (canOpen) {
      await Linking.openURL(nativeUrl);
    } else {
      await Linking.openURL(webUrl);
    }
  } catch (err) {
    console.warn('[TransitService] Could not open native Uber, opening web fallback:', err);
    try {
      await Linking.openURL(webUrl);
    } catch (fallbackErr) {
      Alert.alert('Ride Booking', 'Unable to launch Uber. Please check your internet connection or install Uber from the App Store.');
    }
  }
}

/**
 * Dispatches ride request to Rapido.
 * Supports auto/bike bookings in Indian cities.
 */
export async function openRapidoRide(destination: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = destination;
  const encodedName = encodeURIComponent(name);

  // Rapido scheme & store fallbacks
  const nativeUrl = `rapido://ride?dest_lat=${latitude}&dest_lng=${longitude}&dest_title=${encodedName}`;
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.rapido.passenger';
  const appStoreUrl = 'https://apps.apple.com/in/app/rapido-bike-taxi-auto/id1198464601';
  const fallbackStore = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;

  try {
    const canOpen = await Linking.canOpenURL(nativeUrl);
    if (canOpen) {
      await Linking.openURL(nativeUrl);
    } else {
      // Prompt user or open store
      await Linking.openURL(fallbackStore);
    }
  } catch (err) {
    console.warn('[TransitService] Could not open native Rapido, opening store fallback:', err);
    try {
      await Linking.openURL(fallbackStore);
    } catch (fallbackErr) {
      Alert.alert('Rapido Ride', 'Unable to open Rapido. You can install Rapido from your device app store.');
    }
  }
}

/**
 * Opens turn-by-turn navigation in Google Maps or Apple Maps.
 */
export async function openNativeNavigation(destination: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = destination;
  const encodedName = encodeURIComponent(name);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodedName}`;

  try {
    await Linking.openURL(googleMapsUrl);
  } catch (err) {
    Alert.alert('Navigation', 'Unable to open Maps navigation.');
  }
}
