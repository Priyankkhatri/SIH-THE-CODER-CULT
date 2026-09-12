import React from 'react';
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
}

export function HeritageMapView({
  places,
  selectedPlace,
  onSelectPlace,
  onPlaceDetails,
  userLocation,
}: HeritageMapViewProps) {
  const { t, getPlaceName } = useTranslation();

  // Dynamically calculate bounding coordinates across all displayed places
  const lats = places.map((p) => p.latitude).filter((n) => typeof n === 'number' && !isNaN(n));
  const lngs = places.map((p) => p.longitude).filter((n) => typeof n === 'number' && !isNaN(n));
  const minLat = lats.length > 0 ? Math.min(...lats) : 20.0;
  const maxLat = lats.length > 0 ? Math.max(...lats) : 28.0;
  const minLng = lngs.length > 0 ? Math.min(...lngs) : 69.0;
  const maxLng = lngs.length > 0 ? Math.max(...lngs) : 88.0;
  const latSpan = Math.max(maxLat - minLat, 0.08);
  const lngSpan = Math.max(maxLng - minLng, 0.08);

  return (
    <View style={styles.container}>
      {/* Web Interactive Map Canvas / Radar */}
      <View style={styles.radarContainer}>
        <View style={styles.radarGrid}>
          <View style={styles.circleOuter} />
          <View style={styles.circleMiddle} />
          <View style={styles.circleInner} />
          <View style={styles.radarAxisH} />
          <View style={styles.radarAxisV} />

          {/* Compass Indicators */}
          <Text style={[styles.compassText, { top: 6, alignSelf: 'center' }]}>N</Text>
          <Text style={[styles.compassText, { bottom: 6, alignSelf: 'center' }]}>S</Text>
          <Text style={[styles.compassText, { right: 8, top: '48%' }]}>E</Text>
          <Text style={[styles.compassText, { left: 8, top: '48%' }]}>W</Text>

          {/* User Location Pulse */}
          <View style={styles.userPin}>
            <View style={styles.userDot} />
            <Text style={styles.userLabel}>Radar Center</Text>
          </View>

          {/* Heritage Pins scaled proportionally across India/Gujarat geography */}
          {places.slice(0, 45).map((place) => {
            const relY = (place.latitude - minLat) / latSpan; // 0 (South) to 1 (North)
            const relX = (place.longitude - minLng) / lngSpan; // 0 (West) to 1 (East)

            // Invert Y for screen coordinates (North = top)
            const topPct = Math.min(Math.max(82 - relY * 64, 12), 85);
            const leftPct = Math.min(Math.max(16 + relX * 68, 14), 86);
            const isSelected = selectedPlace?.id === place.id;
            const pinColor = CATEGORY_COLORS[place.category] || Colors.primary;

            return (
              <TouchableOpacity
                key={place.id}
                style={[
                  styles.mapPin,
                  { top: `${topPct}%`, left: `${leftPct}%` },
                  isSelected && styles.mapPinSelected,
                ]}
                onPress={() => onSelectPlace(place)}
                activeOpacity={0.8}
              >
                <View style={[styles.pinIconWrap, { backgroundColor: pinColor }]}>
                  <MaterialIcons name="account-balance" size={12} color="#fff" />
                </View>
                <Text style={styles.pinTitle} numberOfLines={1}>
                  {getPlaceName(place)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Web Quick Selection Carousel */}
        <View style={styles.carouselContainer}>
          <Text style={styles.carouselTitle}>📍 {places.length} Heritage Sites Cataloged</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselScroll}>
            {places.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              return (
                <TouchableOpacity
                  key={place.id}
                  style={[styles.siteChip, isSelected && styles.siteChipActive]}
                  onPress={() => {
                    onSelectPlace(place);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.siteChipDot, { backgroundColor: CATEGORY_COLORS[place.category] || Colors.primary }]} />
                  <Text style={[styles.siteChipText, isSelected && styles.siteChipTextActive]}>
                    {place.name}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0c1322',
  },
  radarContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarGrid: {
    width: '90%',
    height: '65%',
    maxWidth: 500,
    maxHeight: 500,
    borderRadius: 24,
    backgroundColor: 'rgba(20, 28, 48, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassText: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(212, 169, 71, 0.6)',
    letterSpacing: 1,
    zIndex: 2,
  },
  circleOuter: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(91, 143, 185, 0.2)',
    borderStyle: 'dashed',
  },
  circleMiddle: {
    position: 'absolute',
    width: '55%',
    height: '55%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(91, 143, 185, 0.25)',
  },
  circleInner: {
    position: 'absolute',
    width: '30%',
    height: '30%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(91, 143, 185, 0.3)',
  },
  radarAxisH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(91, 143, 185, 0.15)',
  },
  radarAxisV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(91, 143, 185, 0.15)',
  },
  userPin: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  userDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  userLabel: {
    fontSize: 10,
    color: Colors.accentLight,
    fontWeight: '700',
    marginTop: 2,
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 5,
    cursor: 'pointer' as any,
  },
  mapPinSelected: {
    zIndex: 20,
    transform: [{ translateX: -20 }, { translateY: -24 }, { scale: 1.15 }],
  },
  pinIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  pinTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
    backgroundColor: 'rgba(10, 10, 15, 0.85)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
    maxWidth: 90,
  },
  carouselContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
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
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    cursor: 'pointer' as any,
  },
  siteChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceHighlight,
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
  },
  siteChipDist: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
