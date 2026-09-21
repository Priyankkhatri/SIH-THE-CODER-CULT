import { Linking, Platform, Alert } from 'react-native';

export interface TransitDestination {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
}

function getMapsUrl(lat: number, lng: number, name: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}&travelmode=driving`;
}

/**
 * Dispatches ride request to Uber.
 * 1. Tries native deep link with coordinates
 * 2. On Android, attempts direct package launch if scheme failed
 * 3. Falls back to Uber mobile web
 * 4. Falls back to Google Maps
 */
export async function openUberRide(dest: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = dest;
  const n = encodeURIComponent(name);
  const native = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${n}`;
  const web = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${n}`;

  // 1. Try native scheme
  try {
    await Linking.openURL(native);
    return;
  } catch {}

  // 2. On Android, try direct package launch via IntentLauncher
  if (Platform.OS === 'android') {
    try {
      const IntentLauncher = require('expo-intent-launcher');
      await IntentLauncher.openApplication('com.ubercab');
      return;
    } catch {}
  }

  // 3. Try Uber mobile web
  try {
    await Linking.openURL(web);
    return;
  } catch {}

  // 4. Alert with Google Maps fallback
  const maps = getMapsUrl(latitude, longitude, name);
  Alert.alert('Uber Unavailable', 'Could not launch Uber. Open Google Maps instead?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Google Maps', onPress: () => Linking.openURL(maps).catch(() => {}) },
  ]);
}

/**
 * Dispatches ride request to Rapido.
 * 1. Tries native scheme
 * 2. On Android, launches the installed Rapido app directly by package name (com.rapido.passenger)
 * 3. Only if truly not installed, prompts user with Install or Google Maps
 */
export async function openRapidoRide(dest: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = dest;
  const n = encodeURIComponent(name);
  const schemeUrl = `rapido://ride?dest_lat=${latitude}&dest_lng=${longitude}&dest_title=${n}`;

  // 1. Try native scheme
  try {
    await Linking.openURL(schemeUrl);
    return;
  } catch {}

  // 2. On Android, directly launch the installed Rapido app via IntentLauncher
  if (Platform.OS === 'android') {
    try {
      const IntentLauncher = require('expo-intent-launcher');
      await IntentLauncher.openApplication('com.rapido.passenger');
      return;
    } catch {}
  }

  // 3. If truly not installed, show dialog
  const maps = getMapsUrl(latitude, longitude, name);
  const store =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/in/app/rapido-bike-taxi-auto/id1198464601'
      : 'https://play.google.com/store/apps/details?id=com.rapido.passenger';

  Alert.alert('Rapido', 'Rapido app is not installed on this device.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Install from Store', onPress: () => Linking.openURL(store).catch(() => {}) },
    { text: 'Open in Maps', onPress: () => Linking.openURL(maps).catch(() => {}) },
  ]);
}

/**
 * Opens Google Maps / Apple Maps navigation.
 */
export async function openNativeNavigation(dest: TransitDestination): Promise<void> {
  const url = getMapsUrl(dest.latitude, dest.longitude, dest.name);
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Navigation', 'Could not open Maps navigation.');
  }
}
