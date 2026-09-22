import React, { useMemo, useEffect, useRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import type { Place } from '../stores';
import { ScalePressable, SlideDownView, PulseBeacon } from './common/MicroAnimations';

export type MapLayerType = 'streets' | 'satellite' | 'terrain' | 'dark' | 'osm';

export interface AmenityItem {
  id: string;
  type: 'water' | 'restroom' | 'parking' | 'ticket' | 'info';
  name: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
}

interface HeritageMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onPlaceDetails: (placeId: string) => void;
  userLocation: { latitude: number; longitude: number };
  mapRef?: any;
  mapLayer?: MapLayerType;
  amenities?: AmenityItem[];
  routeDestination?: Place | null;
  routeCoordinates?: Array<{ latitude: number; longitude: number }>;
  routeBearing?: number;
  routeDistanceKm?: number;
  routeDurationMin?: number;
  onClearRoute?: () => void;
  onPressSteps?: () => void;
}

export const TILE_URLS: Record<MapLayerType, string> = {
  osm: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  streets: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
};

export const TILE_ATTRIBUTION: Record<MapLayerType, string> = {
  osm: '🗺️ Free OpenStreetMap (Zero API Key)',
  streets: '🗺️ Free OpenStreetMap (Standard)',
  dark: '🌙 Free Dark Matter Map',
  satellite: '🛰️ Free Esri Satellite Imagery',
  terrain: '🧭 Free Topographic Map',
};

export function HeritageMapView({
  places,
  selectedPlace,
  onSelectPlace,
  onPlaceDetails,
  userLocation,
  mapRef,
  mapLayer = 'streets',
  amenities,
  routeDestination,
  routeCoordinates,
  routeBearing,
  routeDistanceKm,
  routeDurationMin,
  onClearRoute,
  onPressSteps,
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

  // Handle real-time user location changes without re-rendering entire WebView
  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      webViewRef.current?.injectJavaScript(`
        if (window.setUserLocation) window.setUserLocation(${userLocation.latitude}, ${userLocation.longitude});
        true;
      `);
    }
  }, [userLocation?.latitude, userLocation?.longitude]);

  // Handle on-ground amenities overlay
  useEffect(() => {
    webViewRef.current?.injectJavaScript(`
      if (window.setAmenities) window.setAmenities(${JSON.stringify(amenities || [])});
      true;
    `);
  }, [amenities]);

  const initialLat = userLocation?.latitude && userLocation.latitude > 6 ? userLocation.latitude : 22.3072;
  const initialLng = userLocation?.longitude && userLocation.longitude > 68 ? userLocation.longitude : 73.1812;

  // Lightweight HTML bundle with Leaflet & Zero-API-key Google Maps-styled tile architecture
  const htmlContent = useMemo(() => {
    const placesJson = JSON.stringify(
      validPlaces.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category || 'heritage',
        lat: p.latitude,
        lng: p.longitude,
        rating: p.rating || 4.7,
        desc: (p.shortDescription || '').slice(0, 90),
      }))
    );

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" onerror="this.onerror=null;this.href='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body, #map { width: 100%; height: 100%; background: #0F0F0F; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; overflow: hidden; }

    #loadingOverlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #0F0F0F;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      transition: opacity 0.35s ease;
      pointer-events: none;
    }
    .map-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(212, 175, 124, 0.2);
      border-top-color: #D4AF7C;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Google Maps styled Info Popup */
    .leaflet-popup-content-wrapper {
      background: #171717 !important;
      border: 1px solid rgba(212, 175, 124, 0.45) !important;
      border-radius: 14px !important;
      color: #F5F1E8 !important;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.75), 0 2px 6px rgba(0, 0, 0, 0.4) !important;
      padding: 0 !important;
      overflow: hidden !important;
    }
    .leaflet-popup-content {
      margin: 0 !important;
      padding: 10px 12px !important;
    }
    .leaflet-popup-tip-container {
      margin-top: -1px;
    }
    .leaflet-popup-tip {
      background: #171717 !important;
      border: 1px solid rgba(212, 175, 124, 0.45) !important;
    }

    /* Iconic Google Maps Teardrop Marker Pin */
    .gmap-marker-wrap {
      position: relative;
      width: 32px;
      height: 42px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transform-origin: 16px 36px;
      transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .gmap-marker-wrap:hover, .gmap-marker-wrap.active {
      transform: scale(1.22) translateY(-4px);
      z-index: 9999 !important;
    }
    .gmap-pin-shape {
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.3);
      border: 2px solid #FFFFFF;
    }
    .gmap-pin-glyph {
      transform: rotate(45deg);
      font-size: 13px;
      line-height: 1;
      text-align: center;
      user-select: none;
    }
    .gmap-pin-dot-shadow {
      width: 14px;
      height: 5px;
      background: rgba(0, 0, 0, 0.35);
      border-radius: 50%;
      margin-top: 2px;
      filter: blur(1px);
    }
    .gmap-marker-wrap.active .gmap-pin-shape {
      border-color: #FBBF24;
      box-shadow: 0 0 14px #FBBF24, 0 4px 12px rgba(0,0,0,0.6);
    }

    /* Google Maps Blue GPS User Puck with Sonar Radar Wave */
    .gmap-user-puck {
      position: relative;
      width: 22px;
      height: 22px;
    }
    .gmap-user-pulse {
      position: absolute;
      top: -11px;
      left: -11px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(26, 115, 232, 0.3);
      animation: gmapPulseWave 2s ease-out infinite;
      pointer-events: none;
    }
    .gmap-user-dot {
      position: absolute;
      top: 1px;
      left: 1px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #1A73E8;
      border: 3px solid #FFFFFF;
      box-shadow: 0 2px 8px rgba(26, 115, 232, 0.7), 0 0 0 1px rgba(0,0,0,0.2);
    }
    @keyframes gmapPulseWave {
      0% { transform: scale(0.45); opacity: 1; }
      100% { transform: scale(1.75); opacity: 0; }
    }

    .leaflet-control-attribution { display: none !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="loadingOverlay">
    <div class="map-spinner"></div>
    <div style="font-size: 13px; font-weight: 700; color: #F5F1E8; margin-top: 14px; letter-spacing: 0.3px;">Loading Free OpenStreetMap...</div>
    <div style="font-size: 11px; color: #A7A7A7; margin-top: 4px;">Zero API Key • 100% Free & Open-Source</div>
  </div>

  <script>
    var map = null;
    var mapReady = false;
    var pendingActions = [];
    var activeTileLayer = null;
    var markersMap = {};
    var routePolylineBg = null;
    var routePolylineCore = null;
    var userMarker = null;

    var places = ${placesJson};
    var currentLayerName = '${mapLayer}';
    var tileUrls = {
      osm: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      streets: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      dark: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      terrain: 'https://tile.opentopomap.org/{z}/{x}/{y}.png'
    };

    var CAT_PALETTE = {
      temple: { bg: '#E65100', icon: '🛕' },
      fort: { bg: '#B71C1C', icon: '🏰' },
      museum: { bg: '#1A73E8', icon: '🏺' },
      stepwell: { bg: '#00897B', icon: '⛲' },
      palace: { bg: '#D4AF7C', icon: '👑' },
      nature: { bg: '#2E7D32', icon: '🌿' },
      food: { bg: '#E53935', icon: '🍽️' },
      monument: { bg: '#6A1B9A', icon: '🗿' },
      culture: { bg: '#8E24AA', icon: '🎭' },
      heritage: { bg: '#D4AF7C', icon: '🏛️' }
    };

    function getCatConfig(cat) {
      var key = (cat || 'heritage').toLowerCase();
      return CAT_PALETTE[key] || CAT_PALETTE.heritage;
    }

    function createGooglePin(p, isSelected) {
      var cfg = getCatConfig(p.category);
      var html = '<div class="gmap-marker-wrap' + (isSelected ? ' active' : '') + '">' +
        '<div class="gmap-pin-shape" style="background-color:' + cfg.bg + ';">' +
          '<span class="gmap-pin-glyph">' + cfg.icon + '</span>' +
        '</div>' +
        '<div class="gmap-pin-dot-shadow"></div>' +
      '</div>';

      return L.divIcon({
        className: '',
        html: html,
        iconSize: [32, 42],
        iconAnchor: [16, 36],
        popupAnchor: [0, -36]
      });
    }

    window.postMessageToRN = function(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }
    };

    window.panTo = function(lat, lng) {
      if (!mapReady || !map) {
        pendingActions.push(function() { window.panTo(lat, lng); });
        return;
      }
      map.panTo([lat, lng], { animate: true, duration: 0.6 });
    };

    window.zoomIn = function() { if (map) map.zoomIn(); };
    window.zoomOut = function() { if (map) map.zoomOut(); };

    window.setLayer = function(layerKey) {
      if (!mapReady || !map) {
        pendingActions.push(function() { window.setLayer(layerKey); });
        return;
      }
      var url = tileUrls[layerKey] || tileUrls.osm;
      if (activeTileLayer) map.removeLayer(activeTileLayer);
      activeTileLayer = L.tileLayer(url, { maxZoom: 19, subdomains: 'abcd' }).addTo(map);
    };

    var currentlySelectedId = null;
    window.selectPlace = function(id, lat, lng) {
      if (!mapReady || !map) {
        pendingActions.push(function() { window.selectPlace(id, lat, lng); });
        return;
      }
      if (currentlySelectedId && markersMap[currentlySelectedId]) {
        var oldPlace = places.find(function(item) { return item.id === currentlySelectedId; });
        if (oldPlace) markersMap[currentlySelectedId].setIcon(createGooglePin(oldPlace, false));
      }

      currentlySelectedId = id;
      var curPlace = places.find(function(item) { return item.id === id; });
      var m = markersMap[id];
      if (m && curPlace) {
        m.setIcon(createGooglePin(curPlace, true));
        m.openPopup();
      }
      map.flyTo([lat, lng], 14, { duration: 0.8 });
    };

    window.setUserLocation = function(lat, lng) {
      if (!mapReady || !map) {
        pendingActions.push(function() { window.setUserLocation(lat, lng); });
        return;
      }
      var userPuckHtml = '<div class="gmap-user-puck"><div class="gmap-user-pulse"></div><div class="gmap-user-dot"></div></div>';
      var userIcon = L.divIcon({ className: '', html: userPuckHtml, iconSize: [22, 22], iconAnchor: [11, 11] });
      if (userMarker) {
        userMarker.setLatLng([lat, lng]);
      } else {
        userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 2000 }).addTo(map);
      }
    };

    window.setRoute = function(coords) {
      if (!mapReady || !map) {
        pendingActions.push(function() { window.setRoute(coords); });
        return;
      }
      if (routePolylineBg) map.removeLayer(routePolylineBg);
      if (routePolylineCore) map.removeLayer(routePolylineCore);

      var latLngs = coords.map(function(c) { return [c.latitude, c.longitude]; });
      routePolylineBg = L.polyline(latLngs, {
        color: '#1E3A8A',
        weight: 7,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routePolylineCore = L.polyline(latLngs, {
        color: '#38BDF8',
        weight: 4.5,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      map.fitBounds(routePolylineCore.getBounds(), { padding: [55, 55] });
    };

    window.clearRoute = function() {
      if (routePolylineBg && map) { map.removeLayer(routePolylineBg); routePolylineBg = null; }
      if (routePolylineCore && map) { map.removeLayer(routePolylineCore); routePolylineCore = null; }
    };

    window.fitBounds = function(coords) {
      if (!mapReady || !map) {
        pendingActions.push(function() { window.fitBounds(coords); });
        return;
      }
      var latLngs = coords.map(function(c) { return [c.latitude, c.longitude]; });
      map.fitBounds(latLngs, { padding: [60, 60] });
    };

    var amenityMarkers = [];
    window.setAmenities = function(list) {
      if (!mapReady || !map) {
        pendingActions.push(function() { window.setAmenities(list); });
        return;
      }
      amenityMarkers.forEach(function(m) { map.removeLayer(m); });
      amenityMarkers = [];
      if (!list || list.length === 0) return;

      var AMENITY_ICONS = {
        water: { bg: '#0284C7', icon: '💧' },
        restroom: { bg: '#059669', icon: '🚻' },
        parking: { bg: '#D97706', icon: '🅿️' },
        ticket: { bg: '#7C3AED', icon: '🎫' },
        info: { bg: '#4B5563', icon: 'ℹ️' }
      };

      list.forEach(function(a) {
        var cfg = AMENITY_ICONS[a.type] || AMENITY_ICONS.info;
        var html = '<div style="width:26px; height:26px; border-radius:50%; background:' + cfg.bg + '; border:2px solid #FFFFFF; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.5); font-size:12px;">' + cfg.icon + '</div>';
        var icon = L.divIcon({ className: '', html: html, iconSize: [26, 26], iconAnchor: [13, 13] });
        var m = L.marker([a.latitude, a.longitude], { icon: icon, zIndexOffset: 1500 }).addTo(map);
        m.bindPopup('<div style="font-weight:700; font-size:12px; color:#F5F1E8; margin-bottom:2px;">' + a.name + '</div><div style="font-size:10px; color:#A7A7A7;">' + a.distanceMeters + 'm from site entrance</div>', { closeButton: false, offset: [0, -14] });
        amenityMarkers.push(m);
      });
    };

    function initMap() {
      if (mapReady || typeof L === 'undefined') return;

      try {
        map = L.map('map', {
          center: [${initialLat}, ${initialLng}],
          zoom: 12,
          zoomControl: false,
          attributionControl: false
        });

        activeTileLayer = L.tileLayer(tileUrls[currentLayerName] || tileUrls.osm, {
          maxZoom: 19,
          subdomains: 'abcd'
        }).addTo(map);

        ${userLocation?.latitude ? `
          window.setUserLocation(${userLocation.latitude}, ${userLocation.longitude});
        ` : ''}

        places.forEach(function(p) {
          var marker = L.marker([p.lat, p.lng], {
            icon: createGooglePin(p, false)
          }).addTo(map);

          var cfg = getCatConfig(p.category);
          var popupHtml = '<div style="min-width: 170px; max-width: 220px;">' +
            '<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 4px;">' +
              '<span style="font-size: 9px; font-weight: 800; color: #FFFFFF; background:' + cfg.bg + '; padding: 1px 6px; border-radius: 4px; text-transform: uppercase;">' + (p.category || 'Heritage') + '</span>' +
              '<span style="font-size: 11px; font-weight: 700; color: #FBBF24;">★ ' + p.rating + '</span>' +
            '</div>' +
            '<div style="font-weight: 700; font-size: 13px; color: #F5F1E8; margin-bottom: 4px; line-height: 1.25;">' + p.name + '</div>' +
            '<div style="font-size: 11px; color: #A7A7A7; margin-bottom: 8px; line-height: 1.3;">' + p.desc + '</div>' +
            '<div style="display:flex; gap:6px;">' +
              '<button onclick="window.postMessageToRN({type: \\'SELECT_PLACE\\', id: \\'' + p.id + '\\'})" style="flex:1; background:#D4AF7C; color:#0F0F0F; border:none; padding:5px 8px; border-radius:6px; font-weight:700; font-size:10px; cursor:pointer;">Select</button>' +
              '<button onclick="window.postMessageToRN({type: \\'PLACE_DETAILS\\', id: \\'' + p.id + '\\'})" style="flex:1; background:rgba(255,255,255,0.12); color:#F5F1E8; border:1px solid rgba(255,255,255,0.2); padding:5px 8px; border-radius:6px; font-weight:700; font-size:10px; cursor:pointer;">Details →</button>' +
            '</div>' +
          '</div>';

          marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -32] });

          marker.on('click', function() {
            window.postMessageToRN({ type: 'SELECT_PLACE', id: p.id });
          });

          markersMap[p.id] = marker;
        });

        mapReady = true;

        while (pendingActions.length > 0) {
          var act = pendingActions.shift();
          try { act(); } catch(e) { console.error(e); }
        }

        var overlay = document.getElementById('loadingOverlay');
        if (overlay) {
          overlay.style.opacity = '0';
          setTimeout(function() { overlay.style.display = 'none'; }, 350);
        }
      } catch(err) {
        console.error('Leaflet init error:', err);
      }
    }

    function loadScript(url, onSuccess, onError) {
      var script = document.createElement('script');
      script.src = url;
      script.onload = onSuccess;
      script.onerror = onError;
      document.head.appendChild(script);
    }

    loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
      initMap,
      function() {
        loadScript(
          'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js',
          initMap,
          function() {
            loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', initMap, function() {
              var overlay = document.getElementById('loadingOverlay');
              if (overlay) {
                overlay.innerHTML = '<div style="color:#EF4444;font-size:14px;font-weight:bold;margin-bottom:8px;">⚠️ Map Network Offline</div><div style="color:#A7A7A7;font-size:11px;text-align:center;padding:0 20px;">Unable to load map. Check your internet connection.</div>';
              }
            });
          }
        );
      }
    );
  </script>
</body>
</html>`;
  }, [validPlaces.length, mapLayer, initialLat, initialLng]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent, baseUrl: 'https://localhost' }}
        style={styles.webView}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        mixedContentMode="always"
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        geolocationEnabled={true}
        androidLayerType="hardware"
      />

      {/* Discrete tile attribution */}
      <View style={styles.attributionBadge}>
        <Text style={styles.attributionText}>{TILE_ATTRIBUTION[mapLayer]}</Text>
      </View>

      {/* Active Navigation Route HUD */}
      {routeDestination && (
        <SlideDownView distance={35} style={styles.navigationHud}>
          <ScalePressable
            style={styles.navHudLeft}
            onPress={onPressSteps}
            activeOpacity={0.85}
          >
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
                <PulseBeacon color={Colors.success} size={6} glowSize={14} />
                <Text style={styles.navHudTitle} numberOfLines={1}>
                  {routeDestination.name}
                </Text>
              </View>
              <Text style={styles.navHudMetrics}>
                {routeDistanceKm ?? '--'} km • ~{routeDurationMin ?? '--'} min • Tap for steps
              </Text>
            </View>
          </ScalePressable>

          <View style={styles.navHudActions}>
            {onPressSteps && (
              <ScalePressable
                style={styles.navHudStepsBtn}
                onPress={onPressSteps}
              >
                <MaterialIcons name="format-list-bulleted" size={15} color={Colors.primary} />
                <Text style={styles.navHudStepsText}>Steps</Text>
              </ScalePressable>
            )}

            <ScalePressable
              style={styles.navHudStartBtn}
              onPress={() => {
                const url = Platform.select({
                  ios: `maps:0,0?q=${routeDestination.latitude},${routeDestination.longitude}`,
                  android: `google.navigation:q=${routeDestination.latitude},${routeDestination.longitude}`,
                  default: `https://www.google.com/maps/dir/?api=1&destination=${routeDestination.latitude},${routeDestination.longitude}`,
                });
                if (url) Linking.openURL(url);
              }}
            >
              <MaterialIcons name="directions" size={15} color="#0A0A0F" />
              <Text style={styles.navHudStartText}>Go</Text>
            </ScalePressable>

            {onClearRoute && (
              <ScalePressable
                style={styles.navHudCloseBtn}
                onPress={onClearRoute}
              >
                <MaterialIcons name="close" size={15} color="#CBD5E1" />
              </ScalePressable>
            )}
          </View>
        </SlideDownView>
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
  navHudStepsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  navHudStepsText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
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
