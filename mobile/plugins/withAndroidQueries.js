const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Expo Config Plugin: withAndroidQueries
 *
 * Injects <queries> into AndroidManifest.xml so that
 * Linking.canOpenURL() works on Android 11+ (API 30+).
 *
 * Without these declarations, the OS blocks inter-app
 * visibility queries and canOpenURL returns false even
 * when the target app IS installed.
 *
 * Packages declared:
 *  - com.ubercab          (Uber)
 *  - com.rapido.passenger (Rapido)
 *  - com.google.android.apps.maps (Google Maps)
 */
module.exports = function withAndroidQueries(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // Ensure <queries> array exists at the manifest root
    if (!manifest.queries) {
      manifest.queries = [];
    }

    // Build the <queries> block with package + intent entries
    const queriesBlock = {
      package: [
        { $: { 'android:name': 'com.ubercab' } },
        { $: { 'android:name': 'com.rapido.passenger' } },
        { $: { 'android:name': 'com.google.android.apps.maps' } },
      ],
      intent: [
        {
          action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
          data: [{ $: { 'android:scheme': 'uber' } }],
        },
        {
          action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
          data: [{ $: { 'android:scheme': 'rapido' } }],
        },
        {
          action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
          data: [{ $: { 'android:scheme': 'geo' } }],
        },
      ],
    };

    // Replace or push the queries block
    manifest.queries = [queriesBlock];

    return config;
  });
};
