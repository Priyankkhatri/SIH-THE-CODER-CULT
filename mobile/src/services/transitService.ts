import { Linking, Platform, Alert } from 'react-native';

export interface TransitDestination {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
}

// ─── HELPERS ───────────────────────────────────────────────────────────────────

/**
 * Attempts to open a URL directly. Returns true on success, false on failure.
 * Does NOT use canOpenURL (broken on Android 11+ without <queries>).
 */
async function tryOpenURL(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Opens Google Maps with ride-hailing comparison for a destination.
 * This is the universal fallback — always works because it's a web URL.
 */
function getGoogleMapsRideUrl(lat: number, lng: number, name: string): string {
  const encoded = encodeURIComponent(name);
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encoded}&travelmode=driving`;
}

// ─── UBER ──────────────────────────────────────────────────────────────────────

/**
 * Dispatches ride request to Uber.
 *
 * Strategy (Android 11+ safe):
 *  1. Try opening `uber://` scheme directly (no canOpenURL pre-check).
 *     If the app is installed, Android launches it immediately.
 *  2. If that throws (app not installed), fall back to Uber mobile web
 *     (`m.uber.com`) — NOT the app store. User can book from the browser.
 *  3. If even the web URL fails, show an Alert with Google Maps fallback.
 */
export async function openUberRide(destination: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = destination;
  const encodedName = encodeURIComponent(name);

  // Native Uber app deep link
  const nativeUrl = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${encodedName}`;

  // Uber mobile web — works without the app installed
  const webUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${encodedName}`;

  // 1) Try native app directly
  const opened = await tryOpenURL(nativeUrl);
  if (opened) return;

  // 2) App not installed → open Uber mobile web (NOT app store)
  console.info('[TransitService] Uber app not found, opening Uber mobile web.');
  const webOpened = await tryOpenURL(webUrl);
  if (webOpened) return;

  // 3) Nothing worked → offer Google Maps
  const mapsUrl = getGoogleMapsRideUrl(latitude, longitude, name);
  Alert.alert(
    'Uber Unavailable',
    'Could not open Uber app or website. Would you like to open Google Maps for ride options instead?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Google Maps',
        onPress: () => Linking.openURL(mapsUrl).catch(() => {}),
      },
    ],
  );
}

// ─── RAPIDO ────────────────────────────────────────────────────────────────────

/**
 * Dispatches ride request to Rapido.
 *
 * Strategy (Android 11+ safe):
 *  1. On Android: Use Intent URI (`intent://...#Intent;package=...;end`).
 *     This bypasses the package visibility restriction entirely —
 *     if the app is installed, Android launches it; if not, the intent
 *     fails gracefully instead of silently redirecting to Play Store.
 *  2. On iOS: Try `rapido://` scheme directly.
 *  3. If the app isn't installed, show a user-friendly Alert asking
 *     whether to install Rapido or use Google Maps instead.
 *     NEVER silently dump to the Play Store.
 */
export async function openRapidoRide(destination: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = destination;
  const encodedName = encodeURIComponent(name);

  let opened = false;

  if (Platform.OS === 'android') {
    // Android Intent URI — bypasses canOpenURL / package visibility issues
    const intentUrl = `intent://ride?dest_lat=${latitude}&dest_lng=${longitude}&dest_title=${encodedName}#Intent;scheme=rapido;package=com.rapido.passenger;end`;
    opened = await tryOpenURL(intentUrl);
  } else {
    // iOS: direct scheme
    const iosUrl = `rapido://ride?dest_lat=${latitude}&dest_lng=${longitude}&dest_title=${encodedName}`;
    opened = await tryOpenURL(iosUrl);
  }

  if (opened) return;

  // App is not installed → ask the user what they want to do
  const mapsUrl = getGoogleMapsRideUrl(latitude, longitude, name);
  const storeUrl =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/in/app/rapido-bike-taxi-auto/id1198464601'
      : 'https://play.google.com/store/apps/details?id=com.rapido.passenger';

  Alert.alert(
    'Rapido Not Installed',
    'Rapido app is not installed on your device. What would you like to do?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Install Rapido',
        onPress: () => Linking.openURL(storeUrl).catch(() => {}),
      },
      {
        text: 'Use Google Maps',
        onPress: () => Linking.openURL(mapsUrl).catch(() => {}),
      },
    ],
  );
}

// ─── GOOGLE MAPS NAVIGATION ───────────────────────────────────────────────────

/**
 * Opens turn-by-turn navigation in Google Maps or Apple Maps.
 */
export async function openNativeNavigation(destination: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = destination;
  const mapsUrl = getGoogleMapsRideUrl(latitude, longitude, name);

  const opened = await tryOpenURL(mapsUrl);
  if (!opened) {
    Alert.alert('Navigation', 'Unable to open Maps navigation. Please check your internet connection.');
  }
}
