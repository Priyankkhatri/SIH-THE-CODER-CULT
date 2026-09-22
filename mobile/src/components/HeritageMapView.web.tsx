import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, CATEGORY_COLORS } from '../constants/theme';
import type { Place } from '../stores';
import { useTranslation } from '../hooks/useTranslation';

interface HeritageMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onPlaceDetails: (placeId: string) => void;
  userLocation: { latitude: number; longitude: number };
  mapRef?: any;
  mapLayer?: string;
  routeDestination?: Place | null;
  routeCoordinates?: Array<{ latitude: number; longitude: number }>;
}

export function HeritageMapView({
  places,
  selectedPlace,
  onSelectPlace,
  onPlaceDetails,
  userLocation,
  routeCoordinates,
}: HeritageMapViewProps) {
  const { getPlaceName } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const polylineLayerRef = useRef<any>(null);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // 1. Load Leaflet CSS & JS dynamically on web
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet Script
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setIsLeafletReady(true);
      document.head.appendChild(script);
    } else {
      setIsLeafletReady(true);
    }
  }, []);

  // 2. Initialize Leaflet Map once container and Leaflet are available
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || leafletMapRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const initialLat = userLocation?.latitude && userLocation.latitude > 6 ? userLocation.latitude : 22.3072;
    const initialLng = userLocation?.longitude && userLocation.longitude > 68 ? userLocation.longitude : 73.1812;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 11,
      zoomControl: false,
    });

    // Add zoom controls at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // High-definition CARTO Dark Matter raster tiles (Zero API key required)
    L.tileLayer('https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
    }).addTo(map);

    // Feature group for markers
    const markersGroup = L.featureGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, [isLeafletReady]);

  // 3. Update Markers when places change
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletMapRef.current;
    const markersGroup = markersLayerRef.current;
    if (!L || !map || !markersGroup) return;

    markersGroup.clearLayers();

    const CAT_ICONS: Record<string, { bg: string; icon: string }> = {
      temple: { bg: '#E65100', icon: '🛕' },
      fort: { bg: '#B71C1C', icon: '🏰' },
      museum: { bg: '#1A73E8', icon: '🏺' },
      stepwell: { bg: '#00897B', icon: '⛲' },
      palace: { bg: '#D4AF7C', icon: '👑' },
      nature: { bg: '#2E7D32', icon: '🌿' },
      food: { bg: '#E53935', icon: '🍽️' },
      monument: { bg: '#6A1B9A', icon: '🗿' },
      culture: { bg: '#8E24AA', icon: '🎭' },
      heritage: { bg: '#D4AF7C', icon: '🏛️' },
    };

    // User Location Puck on Web
    if (userLocation?.latitude && userLocation?.longitude) {
      const userPuckIcon = L.divIcon({
        className: '',
        html: `
          <div style="position: relative; width: 22px; height: 22px;">
            <div style="position: absolute; top: -11px; left: -11px; width: 44px; height: 44px; border-radius: 50%; background: rgba(26, 115, 232, 0.3); animation: gmapPulseWave 2s ease-out infinite; pointer-events: none;"></div>
            <div style="position: absolute; top: 1px; left: 1px; width: 20px; height: 20px; border-radius: 50%; background: #1A73E8; border: 3px solid #FFFFFF; box-shadow: 0 2px 8px rgba(26,115,232,0.7);"></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      L.marker([userLocation.latitude, userLocation.longitude], {
        icon: userPuckIcon,
        zIndexOffset: 2000,
      }).addTo(markersGroup);
    }

    // Render heritage pins as Google Maps teardrops
    places.slice(0, 100).forEach((place) => {
      if (typeof place.latitude !== 'number' || typeof place.longitude !== 'number') return;

      const isSelected = selectedPlace?.id === place.id;
      const catConfig = CAT_ICONS[place.category?.toLowerCase() || ''] || CAT_ICONS.heritage;

      const customIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 42px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transform: ${isSelected ? 'scale(1.22) translateY(-4px)' : 'scale(1)'};
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            <div style="
              width: 30px;
              height: 30px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              background-color: ${catConfig.bg};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.45);
              border: 2px solid ${isSelected ? '#FBBF24' : '#FFFFFF'};
            ">
              <span style="transform: rotate(45deg); font-size: 13px; line-height: 1;">${catConfig.icon}</span>
            </div>
            <div style="width: 14px; height: 5px; background: rgba(0,0,0,0.35); border-radius: 50%; margin-top: 2px; filter: blur(1px);"></div>
          </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([place.latitude, place.longitude], { icon: customIcon });

      // Interactive Google Maps styled Popup
      const popupHtml = `
        <div style="font-family: system-ui, -apple-system; color: #F5F1E8; min-width: 180px; max-width: 240px; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 9px; font-weight: 800; color: #FFFFFF; background: ${catConfig.bg}; padding: 1px 6px; border-radius: 4px; text-transform: uppercase;">
              ${place.category || 'heritage'}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #FBBF24;">★ ${place.rating || 4.7}</span>
          </div>
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #F5F1E8;">
            ${place.name}
          </div>
          <div style="font-size: 11px; color: #A7A7A7; margin-bottom: 8px; line-height: 1.35;">
            ${place.shortDescription ? place.shortDescription.slice(0, 80) + '...' : ''}
          </div>
          <div style="display: flex; gap: 6px;">
            <button id="btn-select-${place.id}" style="
              flex: 1;
              background: #D4AF7C;
              color: #0F0F0F;
              border: none;
              border-radius: 6px;
              padding: 5px 8px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
            ">Select</button>
            <button id="btn-details-${place.id}" style="
              flex: 1;
              background: rgba(255,255,255,0.12);
              color: #F5F1E8;
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 6px;
              padding: 5px 8px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
            ">Details →</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'heritage-dark-popup',
        closeButton: false,
        offset: [0, -32],
      });

      marker.on('popupopen', () => {
        const selectBtn = document.getElementById(`btn-select-${place.id}`);
        if (selectBtn) {
          selectBtn.onclick = () => onSelectPlace(place);
        }
        const btn = document.getElementById(`btn-details-${place.id}`);
        if (btn) {
          btn.onclick = () => onPlaceDetails(place.id);
        }
      });

      marker.on('click', () => {
        onSelectPlace(place);
      });

      markersGroup.addLayer(marker);
    });
  }, [places, selectedPlace, isLeafletReady, userLocation?.latitude, userLocation?.longitude]);

  // 4. Fly to selected place
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !selectedPlace) return;
    if (typeof selectedPlace.latitude === 'number' && typeof selectedPlace.longitude === 'number') {
      map.flyTo([selectedPlace.latitude, selectedPlace.longitude], 14, {
        duration: 0.8,
      });
    }
  }, [selectedPlace]);

  // 5. Draw route polyline if present
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletMapRef.current;
    if (!L || !map) return;

    if (polylineLayerRef.current) {
      map.removeLayer(polylineLayerRef.current);
      polylineLayerRef.current = null;
    }

    if (routeCoordinates && routeCoordinates.length > 1) {
      const latLngs = routeCoordinates.map((c) => [c.latitude, c.longitude]);
      const polyline = L.polyline(latLngs, {
        color: '#D4AF7C',
        weight: 4,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
      polylineLayerRef.current = polyline;
    }
  }, [routeCoordinates]);

  return (
    <View style={styles.container}>
      {/* Real Interactive Web Map Container */}
      <div
        ref={mapContainerRef as any}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '#0F0F0F',
          zIndex: 0,
        }}
      />

      {/* Dark Leaflet Popup Styling Override */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .leaflet-popup-content-wrapper {
              background: #171717 !important;
              border: 1px solid rgba(212, 175, 124, 0.35) !important;
              border-radius: 12px !important;
              box-shadow: 0 10px 25px rgba(0,0,0,0.7) !important;
            }
            .leaflet-popup-tip {
              background: #171717 !important;
              border: 1px solid rgba(212, 175, 124, 0.35) !important;
            }
            .leaflet-container {
              background: #0F0F0F !important;
            }
          `,
        }}
      />

      {/* Web Quick Selection Carousel */}
      <View style={styles.carouselContainer}>
        <Text style={styles.carouselTitle}>📍 {places.length} Heritage Sites</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselScroll}>
          {places.slice(0, 30).map((place) => {
            const isSelected = selectedPlace?.id === place.id;
            return (
              <TouchableOpacity
                key={place.id}
                style={[styles.siteChip, isSelected && styles.siteChipActive]}
                onPress={() => onSelectPlace(place)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.siteChipDot,
                    { backgroundColor: CATEGORY_COLORS[place.category] || Colors.primary },
                  ]}
                />
                <Text style={[styles.siteChipText, isSelected && styles.siteChipTextActive]}>
                  {getPlaceName(place)}
                </Text>
                {place.rating !== undefined && (
                  <Text style={styles.siteChipDist}>⭐ {place.rating}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F0F0F',
  },
  carouselContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  carouselTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  carouselScroll: {
    gap: 8,
    paddingRight: 16,
  },
  siteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 23, 23, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  siteChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
  },
  siteChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  siteChipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text,
    fontWeight: '600',
  },
  siteChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  siteChipDist: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
