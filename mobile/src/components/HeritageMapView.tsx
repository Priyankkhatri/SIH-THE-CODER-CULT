import React, { useMemo, useEffect, useRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import type { Place } from '../stores';

export type MapLayerType = 'streets' | 'satellite' | 'terrain' | 'dark' | 'osm';

interface HeritageMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onPlaceDetails: (placeId: string) => void;
  userLocation: { latitude: number; longitude: number };
  mapRef?: any;
  mapLayer?: MapLayerType;
  routeDestination?: Place | null;
  routeCoordinates?: Array<{ latitude: number; longitude: number }>;
  routeBearing?: number;
  routeDistanceKm?: number;
  routeDurationMin?: number;
  onClearRoute?: () => void;
}

export const TILE_URLS: Record<MapLayerType, string> = {
  streets: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
  dark: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
  osm: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
};

export const TILE_ATTRIBUTION: Record<MapLayerType, string> = {
  streets: '© OpenStreetMap © CARTO',
  satellite: '© Esri World Imagery',
  terrain: '© OpenTopoMap © OSM',
  dark: '© OpenStreetMap © CARTO',
  osm: '© OpenStreetMap',
};

export function HeritageMapView({
  places,
  selectedPlace,
  onSelectPlace,
  onPlaceDetails,
  userLocation,
  mapRef,
  mapLayer = 'streets',
  routeDestination,
  routeCoordinates,
  routeBearing,
  routeDistanceKm,
  routeDurationMin,
  onClearRoute,
}: HeritageMapViewProps) {
  const webViewRef = useRef<WebView>(null);

  // Expose standard MapView camera API methods to explore.tsx via mapRef
  useImperativeHandle(mapRef, () => ({
    animateToRegion: (region: { latitude: number; longitude: number }) => {
      webViewRef.current?.injectJavaScript(`
        if (window.panTo) window.panTo(${region.latitude}, ${region.longitude});
        true;
      `);
    },
    fitToCoordinates: (coords: Array<{ latitude: number; longitude: number }>) => {
      if (coords && coords.length > 0) {
        webViewRef.current?.injectJavaScript(`
          if (window.fitBounds) window.fitBounds(${JSON.stringify(coords)});
          true;
        `);
      }
    },
    getCamera: async () => ({
      center: {
        latitude: selectedPlace?.latitude || userLocation.latitude || 22.3072,
        longitude: selectedPlace?.longitude || userLocation.longitude || 73.1812,
      },
      zoom: 13,
    }),
    animateCamera: (cam: any) => {
      if (cam?.center) {
        webViewRef.current?.injectJavaScript(`
          if (window.panTo) window.panTo(${cam.center.latitude}, ${cam.center.longitude});
          true;
        `);
      }
    },
    zoomIn: () => {
      webViewRef.current?.injectJavaScript(`if (window.zoomIn) window.zoomIn(); true;`);
    },
    zoomOut: () => {
      webViewRef.current?.injectJavaScript(`if (window.zoomOut) window.zoomOut(); true;`);
    },
  }));

  // Sanitize numeric coordinates
  const validPlaces = useMemo(() => {
    return (places || []).filter(
      (p) =>
        p &&
        typeof p.latitude === 'number' &&
        typeof p.longitude === 'number' &&
        !isNaN(p.latitude) &&
        !isNaN(p.longitude) &&
        p.latitude >= 6 &&
        p.latitude <= 38 &&
        p.longitude >= 68 &&
        p.longitude <= 98
    );
  }, [places]);

  // Handle layer changes
  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      if (window.setLayer) window.setLayer('${mapLayer}');
      true;
    `);
  }, [mapLayer]);

  // Handle selected place changes
  useEffect(() => {
    if (selectedPlace) {
      webViewRef.current?.injectJavaScript(`
        if (window.selectPlace) window.selectPlace('${selectedPlace.id}', ${selectedPlace.latitude}, ${selectedPlace.longitude});
        true;
      `);
    }
  }, [selectedPlace?.id]);

  // Handle route coordinate updates
  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      webViewRef.current?.injectJavaScript(`
        if (window.setRoute) window.setRoute(${JSON.stringify(routeCoordinates)});
        true;
      `);
    } else {
      webViewRef.current?.injectJavaScript(`
        if (window.clearRoute) window.clearRoute();
        true;
      `);
    }
  }, [routeCoordinates]);

  // Handle messages from Leaflet in WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SELECT_PLACE') {
        const found = validPlaces.find((p) => p.id === data.id);
        if (found) onSelectPlace(found);
      } else if (data.type === 'PLACE_DETAILS') {
        onPlaceDetails(data.id);
      }
    } catch {
      // Ignored
    }
  };

  const initialLat = userLocation?.latitude && userLocation.latitude > 6 ? userLocation.latitude : 22.3072;
  const initialLng = userLocation?.longitude && userLocation.longitude > 68 ? userLocation.longitude : 73.1812;

  // Lightweight HTML bundle with Leaflet & Zero-API-key tile architecture
  const htmlContent = useMemo(() => {
    const placesJson = JSON.stringify(
      validPlaces.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category || 'heritage',
        lat: p.latitude,
        lng: p.longitude,
        rating: p.rating,
        desc: (p.shortDescription || '').slice(0, 80),
      }))
    );

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #0F0F0F; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .leaflet-popup-content-wrapper {
      background: #171717 !important;
      border: 1px solid rgba(212, 175, 124, 0.4) !important;
      border-radius: 12px !important;
      color: #F5F1E8 !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.7) !important;
    }
    .leaflet-popup-tip { background: #171717 !important; border: 1px solid rgba(212, 175, 124, 0.4) !important; }
    .heritage-pin {
      width: 28px; height: 28px; border-radius: 14px;
      background: #171717; border: 2px solid #D4AF7C;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.6);
      font-size: 13px; cursor: pointer;
      transition: transform 0.2s;
    }
    .heritage-pin.active {
      width: 36px; height: 36px; border-radius: 18px;
      background: #D4AF7C; border-color: #FFFFFF;
      transform: scale(1.2);
    }
    .user-location-pin {
      width: 18px; height: 18px; border-radius: 9px;
      background: #38BDF8; border: 2.5px solid #FFFFFF;
      box-shadow: 0 0 12px #38BDF8;
    }
    .leaflet-control-attribution { display: none !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var places = ${placesJson};
    var currentLayerName = '${mapLayer}';
    var tileUrls = {
      streets: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
      dark: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      terrain: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
      osm: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    };

    var map = L.map('map', {
      center: [${initialLat}, ${initialLng}],
      zoom: 12,
      zoomControl: false
    });

    var activeTileLayer = L.tileLayer(tileUrls[currentLayerName] || tileUrls.streets, {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    var markersMap = {};
    var routePolyline = null;

    // User Location Dot
    ${userLocation?.latitude ? `
      var userIcon = L.divIcon({
        className: 'user-location-pin',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker([${userLocation.latitude}, ${userLocation.longitude}], { icon: userIcon }).addTo(map);
    ` : ''}

    function createPin(p, isSelected) {
      var icon = L.divIcon({
        className: 'heritage-pin' + (isSelected ? ' active' : ''),
        html: isSelected ? '⭐' : '🏛️',
        iconSize: isSelected ? [36, 36] : [28, 28],
        iconAnchor: isSelected ? [18, 18] : [14, 14]
      });
      return icon;
    }

    places.forEach(function(p) {
      var marker = L.marker([p.lat, p.lng], { icon: createPin(p, false) }).addTo(map);

      var popupHtml = '<div style="padding: 2px;">' +
        '<div style="font-weight: bold; font-size: 13px; color: #D4AF7C; margin-bottom: 2px;">' + p.name + '</div>' +
        '<div style="font-size: 11px; color: #A7A7A7; margin-bottom: 6px;">' + p.desc + '</div>' +
        '<button onclick="window.postMessageToRN({type: \\'PLACE_DETAILS\\', id: \\'' + p.id + '\\'})" style="background:#D4AF7C; color:#0F0F0F; border:none; padding:4px 8px; border-radius:4px; font-weight:700; font-size:10px; cursor:pointer;">View Details →</button>' +
        '</div>';

      marker.bindPopup(popupHtml);

      marker.on('click', function() {
        window.postMessageToRN({ type: 'SELECT_PLACE', id: p.id });
      });

      markersMap[p.id] = marker;
    });

    window.postMessageToRN = function(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }
    };

    window.panTo = function(lat, lng) {
      map.panTo([lat, lng], { animate: true, duration: 0.6 });
    };

    window.zoomIn = function() { map.zoomIn(); };
    window.zoomOut = function() { map.zoomOut(); };

    window.setLayer = function(layerKey) {
      var url = tileUrls[layerKey] || tileUrls.streets;
      if (activeTileLayer) map.removeLayer(activeTileLayer);
      activeTileLayer = L.tileLayer(url, { maxZoom: 19, subdomains: 'abcd' }).addTo(map);
    };

    window.selectPlace = function(id, lat, lng) {
      map.flyTo([lat, lng], 14, { duration: 0.8 });
      var m = markersMap[id];
      if (m) m.openPopup();
    };

    window.setRoute = function(coords) {
      if (routePolyline) map.removeLayer(routePolyline);
      var latLngs = coords.map(function(c) { return [c.latitude, c.longitude]; });
      routePolyline = L.polyline(latLngs, { color: '#D4AF7C', weight: 4, opacity: 0.9 }).addTo(map);
      map.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });
    };

    window.clearRoute = function() {
      if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
      }
    };

    window.fitBounds = function(coords) {
      var latLngs = coords.map(function(c) { return [c.latitude, c.longitude]; });
      map.fitBounds(latLngs, { padding: [60, 60] });
    };
  </script>
</body>
</html>`;
  }, [validPlaces.length, mapLayer, initialLat, initialLng]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webView}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
      />

      {/* Discrete tile attribution */}
      <View style={styles.attributionBadge}>
        <Text style={styles.attributionText}>{TILE_ATTRIBUTION[mapLayer]}</Text>
      </View>

      {/* Active Navigation Route HUD */}
      {routeDestination && (
        <View style={styles.navigationHud}>
          <View style={styles.navHudLeft}>
            <View style={styles.navHudIconWrap}>
              <MaterialIcons
                name="navigation"
                size={20}
                color={Colors.primary}
                style={{ transform: [{ rotate: `${routeBearing ?? 0}deg` }] }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.navHudTitleRow}>
                <View style={styles.liveRouteDot} />
                <Text style={styles.navHudTitle} numberOfLines={1}>
                  {routeDestination.name}
                </Text>
              </View>
              <Text style={styles.navHudMetrics}>
                {routeDistanceKm ?? '--'} km • ~{routeDurationMin ?? '--'} min drive
              </Text>
            </View>
          </View>

          <View style={styles.navHudActions}>
            <TouchableOpacity
              style={styles.navHudStartBtn}
              onPress={() => {
                const url = Platform.select({
                  ios: `maps:0,0?q=${routeDestination.latitude},${routeDestination.longitude}`,
                  android: `google.navigation:q=${routeDestination.latitude},${routeDestination.longitude}`,
                  default: `https://www.google.com/maps/dir/?api=1&destination=${routeDestination.latitude},${routeDestination.longitude}`,
                });
                if (url) Linking.openURL(url);
              }}
              activeOpacity={0.8}
            >
              <MaterialIcons name="directions" size={15} color="#0A0A0F" />
              <Text style={styles.navHudStartText}>Go</Text>
            </TouchableOpacity>

            {onClearRoute && (
              <TouchableOpacity
                style={styles.navHudCloseBtn}
                onPress={onClearRoute}
                activeOpacity={0.8}
              >
                <MaterialIcons name="close" size={15} color="#CBD5E1" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F0F0F',
  },
  webView: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F0F0F',
  },
  attributionBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(15, 15, 15, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  attributionText: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  navigationHud: {
    position: 'absolute',
    top: 56,
    left: Spacing.base,
    right: Spacing.base,
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    ...Shadows.md,
    zIndex: 99,
  },
  navHudLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navHudIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHudTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveRouteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  navHudTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  navHudMetrics: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  navHudActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navHudStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  navHudStartText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textInverse,
  },
  navHudCloseBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
