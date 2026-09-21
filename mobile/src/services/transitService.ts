import { Linking, Platform, Alert } from 'react-native';

export interface TransitDestination {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
}

/**
 * Google Maps ride comparison URL — universal fallback that always works.
 */
function getMapsUrl(lat: number, lng: number, name: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}&travelmode=driving`;
}

/**
 * Opens Uber ride to destination.
 *
 * Flow: native uber:// → Uber mobile web → Google Maps fallback alert.
 * Does NOT use canOpenURL (broken on Android 11+ without <queries>).
 * Linking.openURL bypasses package visibility checks entirely.
 */
export async function openUberRide(dest: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = dest;
  const n = encodeURIComponent(name);
  const native = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${n}`;
  const web = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${n}`;

  try {
    await Linking.openURL(native);
  } catch {
    try {
      await Linking.openURL(web);
    } catch {
      const maps = getMapsUrl(latitude, longitude, name);
      Alert.alert('Uber Unavailable', 'Open Google Maps for ride options?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Google Maps', onPress: () => Linking.openURL(maps).catch(() => {}) },
      ]);
    }
  }
}

/**
 * Opens Rapido ride to destination.
 *
 * Flow: rapido:// direct open → user choice alert (Install / Google Maps).
 * On failure, NEVER silently redirects to Play Store — always asks user first.
 */
export async function openRapidoRide(dest: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = dest;
  const n = encodeURIComponent(name);

  try {
    await Linking.openURL(`rapido://ride?dest_lat=${latitude}&dest_lng=${longitude}&dest_title=${n}`);
  } catch {
    const maps = getMapsUrl(latitude, longitude, name);
    const store = Platform.OS === 'ios'
      ? 'https://apps.apple.com/in/app/rapido-bike-taxi-auto/id1198464601'
      : 'https://play.google.com/store/apps/details?id=com.rapido.passenger';

    Alert.alert('Rapido', 'Rapido app could not be opened. What would you like to do?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Install Rapido', onPress: () => Linking.openURL(store).catch(() => {}) },
      { text: 'Google Maps', onPress: () => Linking.openURL(maps).catch(() => {}) },
    ]);
  }
}

/**
 * Opens Google Maps / Apple Maps navigation.
 */
export async function openNativeNavigation(dest: TransitDestination): Promise<void> {
  const url = getMapsUrl(dest.latitude, dest.longitude, dest.name);
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Navigation', 'Could not open Maps.');
  }
}
