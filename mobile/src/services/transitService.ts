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
 * 3. On iOS / Fallback: uses native uber:// scheme or Universal App Link.
 * 4. Falls back to Google Maps or Play Store.
 */
export async function openUberRide(dest: TransitDestination): Promise<void> {
  const { latitude, longitude, name, address } = dest;
  const n = encodeURIComponent(name);
  const formattedAddr = address ? encodeURIComponent(`${name}, ${address}`) : n;

  // Auto-copy destination name to clipboard
  try {
    await Clipboard.setStringAsync(dest.name);
  } catch {}

  // Uber Universal App Link
  const universalUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${n}&dropoff[formatted_address]=${formattedAddr}`;
  
  // Uber native URI scheme
  const nativeUrl = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${n}&dropoff[formatted_address]=${formattedAddr}`;

  // On Android: explicitly launch with Intent containing data and package
  if (Platform.OS === 'android') {
    try {
      const IntentLauncher = require('expo-intent-launcher');
      
      // Attempt 1: Native scheme Intent with dropoff coordinates
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: nativeUrl,
          packageName: 'com.ubercab',
        });
        return;
      } catch {}

      // Attempt 2: Universal Link Intent targeted to Uber package
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: universalUrl,
          packageName: 'com.ubercab',
        });
        return;
      } catch {}

      // Attempt 3: Direct package launch
      try {
        await IntentLauncher.openApplication('com.ubercab');
        return;
      } catch {}
    } catch {}
  }

  // Attempt 4: Linking.openURL with native scheme (iOS)
  try {
    const supported = await Linking.canOpenURL(nativeUrl);
    if (supported) {
      await Linking.openURL(nativeUrl);
      return;
    }
  } catch {}

  // Attempt 5: Linking.openURL with Universal Link
  try {
    const supported = await Linking.canOpenURL(universalUrl);
    if (supported) {
      await Linking.openURL(universalUrl);
      return;
    }
  } catch {}

  // Fallback alert
  const maps = getMapsUrl(latitude, longitude, name);
  const playStore = Platform.OS === 'ios'
    ? 'https://apps.apple.com/in/app/uber-request-a-ride/id368677368'
    : 'https://play.google.com/store/apps/details?id=com.ubercab';

  Alert.alert('Uber Unavailable', 'Could not open Uber. Navigate in Google Maps or install Uber?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Install Uber', onPress: () => Linking.openURL(playStore).catch(() => {}) },
    { text: 'Google Maps', onPress: () => Linking.openURL(maps).catch(() => {}) },
  ]);
}

/**
 * Dispatches ride request to Rapido.
 * 1. Copies destination name to clipboard so user can 1-tap paste in search.
 * 2. Launches the installed native Rapido app directly (NEVER opens m.rapido.bike).
 * 3. Falls back to Play Store or Google Maps if not installed.
 */
export async function openRapidoRide(dest: TransitDestination): Promise<void> {
  const { latitude, longitude, name } = dest;

  // 1. Auto-copy destination name to clipboard
  try {
    await Clipboard.setStringAsync(dest.name);
  } catch {}

  // 2. On Android: launch the native Rapido app directly
  if (Platform.OS === 'android') {
    try {
      const IntentLauncher = require('expo-intent-launcher');
      await IntentLauncher.openApplication('com.rapido.passenger');
      return;
    } catch {
      // Rapido not installed
    }
  }

  // 3. On iOS: try native scheme
  try {
    const supported = await Linking.canOpenURL('rapido://');
    if (supported) {
      await Linking.openURL('rapido://');
      return;
    }
  } catch {}

  // 4. If not installed, show dialog
  const maps = getMapsUrl(latitude, longitude, name);
  const store =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/in/app/rapido-bike-taxi-auto/id1198464601'
      : 'https://play.google.com/store/apps/details?id=com.rapido.passenger';

  Alert.alert('Rapido Not Installed', 'Rapido app is not installed on this device.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Install Rapido', onPress: () => Linking.openURL(store).catch(() => {}) },
    { text: 'Open in Maps', onPress: () => Linking.openURL(maps).catch(() => {}) },
  ]);
}

/**
 * Dispatches ride request to Ola Cabs with destination coordinates.
 * Pre-fills drop_lat, drop_lng, and drop_name automatically.
 */
export async function openOlaRide(dest: TransitDestination): Promise<void> {
  const { latitude, longitude, name, address } = dest;
  const n = encodeURIComponent(name);
  const formattedAddr = address ? encodeURIComponent(`${name}, ${address}`) : n;

  try {
    await Clipboard.setStringAsync(dest.name);
  } catch {}

  const olaScheme = `olacabs://app/launch?lat=${latitude}&lng=${longitude}&landing_page=bk&drop_lat=${latitude}&drop_lng=${longitude}&drop_name=${n}&drop_address=${formattedAddr}`;

  if (Platform.OS === 'android') {
    try {
      const IntentLauncher = require('expo-intent-launcher');
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: olaScheme,
        packageName: 'com.olacabs.customer',
      });
      return;
    } catch {}

    try {
      const IntentLauncher = require('expo-intent-launcher');
      await IntentLauncher.openApplication('com.olacabs.customer');
      return;
    } catch {}
  }

  try {
    const can = await Linking.canOpenURL(olaScheme);
    if (can) {
      await Linking.openURL(olaScheme);
      return;
    }
  } catch {}

  const maps = getMapsUrl(latitude, longitude, name);
  const playStore = Platform.OS === 'ios'
    ? 'https://apps.apple.com/in/app/ola-cabs/id539179365'
    : 'https://play.google.com/store/apps/details?id=com.olacabs.customer';

  Alert.alert('Ola Not Installed', 'Ola app is not installed on this device.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Install Ola', onPress: () => Linking.openURL(playStore).catch(() => {}) },
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
