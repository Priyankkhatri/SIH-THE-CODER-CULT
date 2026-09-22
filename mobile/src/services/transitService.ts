import { Linking, Platform, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

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
 * Dispatches ride request to Uber with pre-filled destination coordinates and location finding.
 * 1. Copies destination name to clipboard for instant paste if requested.
 * 2. On Android: sends explicit Intent with pickup & dropoff coordinates to 'com.ubercab'.
 * 3. On iOS / Fallback: uses Universal App Link or native uber:// scheme.
 * 4. Falls back to Uber mobile web or Google Maps.
 */
export async function openUberRide(dest: TransitDestination): Promise<void> {
  const { latitude, longitude, name, address } = dest;
  const n = encodeURIComponent(name);
  const formattedAddr = address ? encodeURIComponent(`${name}, ${address}`) : n;

  // Auto-copy destination name to clipboard
  try {
    await Clipboard.setStringAsync(dest.name);
  } catch {}

  // Uber Universal App Link (verified Digital Asset Link for com.ubercab)
  const universalUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${n}&dropoff[formatted_address]=${formattedAddr}`;
  
  // Uber native URI scheme
  const nativeUrl = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${n}&dropoff[formatted_address]=${formattedAddr}`;

  // On Android, use explicit Intent targeting com.ubercab with dropoff coordinates
  if (Platform.OS === 'android') {
    try {
      const IntentLauncher = require('expo-intent-launcher');
      
      // Attempt 1: Universal Link Intent with package name
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: universalUrl,
          packageName: 'com.ubercab',
        });
        return;
      } catch {}

      // Attempt 2: Native scheme Intent with package name
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: nativeUrl,
          packageName: 'com.ubercab',
        });
        return;
      } catch {}
    } catch {}
  }

  // Attempt 3: Linking.openURL with Universal Link
  try {
    const supported = await Linking.canOpenURL(universalUrl);
    if (supported) {
      await Linking.openURL(universalUrl);
      return;
    }
  } catch {}

  // Attempt 4: Linking.openURL with native scheme
  try {
    const supported = await Linking.canOpenURL(nativeUrl);
    if (supported) {
      await Linking.openURL(nativeUrl);
      return;
    }
  } catch {}

  // Attempt 5: Direct package launch if specific intent failed
  if (Platform.OS === 'android') {
    try {
      const IntentLauncher = require('expo-intent-launcher');
      await IntentLauncher.openApplication('com.ubercab');
      return;
    } catch {}
  }

  // Attempt 6: Force open universal web URL in browser
  try {
    await Linking.openURL(universalUrl);
    return;
  } catch {}

  // 7. Fallback alert with Google Maps
  const maps = getMapsUrl(latitude, longitude, name);
  Alert.alert('Uber Unavailable', 'Could not launch Uber. Open Google Maps instead?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Google Maps', onPress: () => Linking.openURL(maps).catch(() => {}) },
  ]);
}

/**
 * Dispatches ride request to Rapido with destination coordinates and search query.
 * 1. Copies destination name to clipboard so user can 1-tap paste in search.
 * 2. On Android: sends explicit Intent with drop_lat, drop_lng, and destination title to 'com.rapido.passenger'.
 * 3. On iOS / Fallback: uses rapido:// or rapidopassenger:// deep links.
 * 4. Falls back to Play Store or Google Maps if not installed.
 */
export async function openRapidoRide(dest: TransitDestination): Promise<void> {
  const { latitude, longitude, name, address } = dest;
  const n = encodeURIComponent(name);
  const formattedAddr = address ? encodeURIComponent(`${name}, ${address}`) : n;

  // Auto-copy destination name to clipboard
  try {
    await Clipboard.setStringAsync(dest.name);
  } catch {}

  // Candidate deep link URLs targeting destination search / booking flow
  const rapidoBookingUrl = `rapido://booking?drop_lat=${latitude}&drop_lng=${longitude}&drop_name=${n}&dest_lat=${latitude}&dest_lng=${longitude}&dest_title=${n}&destination=${n}`;
  const rapidoRideUrl = `rapido://ride?dest_lat=${latitude}&dest_lng=${longitude}&dest_title=${n}&drop_lat=${latitude}&drop_lng=${longitude}&drop_name=${n}`;
  const rapidoPassengerUrl = `rapidopassenger://booking?drop_lat=${latitude}&drop_lng=${longitude}&drop_name=${n}&destination=${n}`;
  const rapidoWebUrl = `https://m.rapido.bike/book?dest_lat=${latitude}&dest_lng=${longitude}&dest_title=${n}&drop_name=${n}`;

  const intentExtras = {
    drop_lat: latitude,
    drop_lng: longitude,
    drop_name: name,
    dest_lat: latitude,
    dest_lng: longitude,
    dest_title: name,
    destination_lat: latitude,
    destination_lng: longitude,
    destination_title: name,
    destination: name,
    dropLocation: name,
    dropoff_latitude: latitude,
    dropoff_longitude: longitude,
    dropoff_name: name,
  };

  // On Android, use explicit Intent targeting com.rapido.passenger with drop coordinates
  if (Platform.OS === 'android') {
    try {
      const IntentLauncher = require('expo-intent-launcher');

      // Attempt 1: Booking deep link with extras to com.rapido.passenger
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: rapidoBookingUrl,
          packageName: 'com.rapido.passenger',
          extra: intentExtras,
        });
        return;
      } catch {}

      // Attempt 2: Ride deep link with extras to com.rapido.passenger
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: rapidoRideUrl,
          packageName: 'com.rapido.passenger',
          extra: intentExtras,
        });
        return;
      } catch {}

      // Attempt 3: Web-style App Link to com.rapido.passenger
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: rapidoWebUrl,
          packageName: 'com.rapido.passenger',
          extra: intentExtras,
        });
        return;
      } catch {}

      // Attempt 4: rapidopassenger scheme
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: rapidoPassengerUrl,
          packageName: 'com.rapido.passenger',
          extra: intentExtras,
        });
        return;
      } catch {}
    } catch {}
  }

  // Attempt 5: iOS or standard Linking for registered schemes
  try {
    const supported = await Linking.canOpenURL(rapidoBookingUrl);
    if (supported) {
      await Linking.openURL(rapidoBookingUrl);
      return;
    }
  } catch {}

  try {
    const supported = await Linking.canOpenURL(rapidoRideUrl);
    if (supported) {
      await Linking.openURL(rapidoRideUrl);
      return;
    }
  } catch {}

  try {
    const supported = await Linking.canOpenURL(rapidoPassengerUrl);
    if (supported) {
      await Linking.openURL(rapidoPassengerUrl);
      return;
    }
  } catch {}

  // Attempt 6: Launch installed Rapido app directly
  if (Platform.OS === 'android') {
    try {
      const IntentLauncher = require('expo-intent-launcher');
      await IntentLauncher.openApplication('com.rapido.passenger');
      return;
    } catch {}
  }

  // 7. If not installed, show options
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
