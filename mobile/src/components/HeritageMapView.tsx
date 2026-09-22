import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker, Polyline, Callout, UrlTile } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, CATEGORY_COLORS, Shadows, BorderRadius, Spacing, Typography } from '../constants/theme';
import type { Place } from '../stores';

export type MapLayerType = 'streets' | 'satellite' | 'terrain' | 'dark' | 'osm';

interface HeritageMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onPlaceDetails: (placeId: string) => void;
  userLocation: { latitude: number; longitude: number };
  mapRef?: React.RefObject<MapView | null>;
  mapLayer?: MapLayerType;
  routeDestination?: Place | null;
  routeCoordinates?: Array<{ latitude: number; longitude: number }>;
  routeBearing?: number;
  routeDistanceKm?: number;
  routeDurationMin?: number;
  onClearRoute?: () => void;
}

// Dark style for base canvas
export const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#121212' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#121212' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#888888' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#e0e0e0' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#a0a0a0' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#222222' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
];

// High-Definition free tile layers — zero API key required (CARTO + Esri + OSM + OTM).
export const TILE_URLS: Record<MapLayerType, string | null> = {
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

function getCategoryIcon(category: string): keyof typeof MaterialIcons.glyphMap {
  switch (category) {
    case 'heritage':
      return 'account-balance';
    case 'museum':
      return 'museum';
    case 'culture':
      return 'palette';
    case 'food':
      return 'restaurant';
    case 'activity':
      return 'hiking';
    default:
      return 'place';
  }
}

// Memoized custom marker to eliminate unnecessary GPU texture re-rendering
const HeritageMarker = React.memo(function HeritageMarker({
  place,
  isSelected,
  isDestination,
  onSelect,
  onDetails,
}: {
  place: Place;
  isSelected: boolean;
  isDestination: boolean;
  onSelect: (place: Place) => void;
  onDetails: (placeId: string) => void;
}) {
  // Allow 1 frame for initial native paint, then freeze bitmap tracking for 60fps scrolling
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => setTracksViewChanges(false), 200);
    return () => clearTimeout(timer);
  }, [isSelected, isDestination]);

  const pinColor = isDestination
    ? Colors.primary
    : CATEGORY_COLORS[place.category] || Colors.primary;
  const iconName = getCategoryIcon(place.category);

  return (
    <Marker
      coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      title={place.name}
      description={place.shortDescription?.substring(0, 80)}
      onPress={() => onSelect(place)}
      tracksViewChanges={tracksViewChanges}
    >
      <View style={styles.markerAnchor}>
        {(isSelected || isDestination) && <View style={styles.markerPulseRing} />}
        <View
          style={[
            styles.markerBadge,
            (isSelected || isDestination) && styles.markerBadgeSelected,
            { backgroundColor: pinColor },
          ]}
        >
          <MaterialIcons
            name={isDestination ? 'flag' : iconName}
            size={isSelected || isDestination ? 15 : 12}
            color="#FFFFFF"
          />
        </View>
        <View style={[styles.markerArrow, { borderTopColor: pinColor }]} />
      </View>

      <Callout tooltip onPress={() => onDetails(place.id)}>
        <View style={styles.calloutContainer}>
          <View style={styles.calloutHeader}>
            <Text style={styles.calloutTitle} numberOfLines={1}>
              {place.name}
            </Text>
            {place.rating !== undefined && (
              <View style={styles.calloutRating}>
                <MaterialIcons name="star" size={11} color={Colors.primary} />
                <Text style={styles.calloutRatingText}>{place.rating}</Text>
              </View>
            )}
          </View>
          <Text style={styles.calloutDesc} numberOfLines={2}>
            {place.shortDescription || 'Historical monument cataloged in heritage registry.'}
          </Text>
          <View style={styles.calloutFooter}>
            <Text style={styles.calloutCategory}>{(place.category || 'heritage').toUpperCase()}</Text>
            <Text style={styles.calloutTap}>View Details →</Text>
          </View>
        </View>
      </Callout>
    </Marker>
  );
});

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

  // Viewport optimization: cull markers when array is huge to keep 60 FPS
  const displayPlaces = useMemo(() => {
    if (validPlaces.length <= 48) return validPlaces;

    const selectedId = selectedPlace?.id;
    const destId = routeDestination?.id;
    const priority: Place[] = [];
    const others: Place[] = [];

    for (const p of validPlaces) {
      if (p.id === selectedId || p.id === destId) {
        priority.push(p);
      } else {
        others.push(p);
      }
    }

    // Retain top 45 priority & nearest places to prevent GPU memory saturation
    return [...priority, ...others.slice(0, 44)];
  }, [validPlaces, selectedPlace?.id, routeDestination?.id]);

  const [mapReady, setMapReady] = useState(false);

  // Smooth auto-focus camera when a place is selected
  useEffect(() => {
    if (selectedPlace && mapRef?.current && typeof (mapRef.current as any).animateToRegion === 'function') {
      const lat = Number(selectedPlace.latitude);
      const lng = Number(selectedPlace.longitude);
      if (!isNaN(lat) && !isNaN(lng) && lat > 0) {
        (mapRef.current as any).animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          },
          450
        );
      }
    }
  }, [selectedPlace]);

  // Initial region: user location or Gujarat heritage center
  const initialRegion = useMemo(() => {
    const lat = userLocation?.latitude && userLocation.latitude >= 6 && userLocation.latitude <= 38
      ? userLocation.latitude
      : 22.3072;
    const lng = userLocation?.longitude && userLocation.longitude >= 68 && userLocation.longitude <= 98
      ? userLocation.longitude
      : 73.1812;
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.14,
      longitudeDelta: 0.14,
    };
  }, []);

  const tileUrl = TILE_URLS[mapLayer];

  // Mid-route arrow bearing calculation
  const midArrowBearing = useMemo(() => {
    if (!routeCoordinates || routeCoordinates.length < 4) return routeBearing ?? 0;
    const mid = Math.floor(routeCoordinates.length / 2);
    const a = routeCoordinates[Math.max(0, mid - 1)];
    const b = routeCoordinates[Math.min(routeCoordinates.length - 1, mid + 1)];
    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;
    const y = Math.sin(toRad(b.longitude - a.longitude)) * Math.cos(toRad(b.latitude));
    const x =
      Math.cos(toRad(a.latitude)) * Math.sin(toRad(b.latitude)) -
      Math.sin(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.cos(toRad(b.longitude - a.longitude));
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  }, [routeCoordinates, routeBearing]);

  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapBase} />

      {!mapReady && (
        <View style={styles.mapLoadingOverlay}>
          <Text style={styles.mapLoadingText}>Loading heritage atlas…</Text>
          <Text style={styles.mapLoadingSub}>{TILE_ATTRIBUTION[mapLayer]}</Text>
        </View>
      )}

      <MapView
        ref={mapRef as any}
        style={styles.map}
        initialRegion={initialRegion}
        // mapType="none" ensures native engine never tries to load Google vector tiles or fail auth checks
        mapType="none"
        customMapStyle={DARK_MAP_STYLE}
        loadingEnabled={false}
        showsUserLocation={Boolean(userLocation?.latitude)}
        showsMyLocationButton={false}
        showsCompass={true}
        showsPointsOfInterests={false}
        showsBuildings={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        onMapReady={() => setMapReady(true)}
      >
        {/* Zero-API-key Free Raster Tile Layer */}
        {tileUrl && (
          <UrlTile
            key={mapLayer}
            urlTemplate={tileUrl}
            maximumZ={19}
            minimumZ={1}
            flipY={false}
            tileSize={256}
            zIndex={-1}
            shouldReplaceMapContent={true}
          />
        )}

        {/* Live Route Navigation Polyline */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <>
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={Colors.primary}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />

            {/* Mid-Route Directional Heading Arrow */}
            {routeCoordinates.length > 3 && (
              <Marker
                coordinate={routeCoordinates[Math.floor(routeCoordinates.length / 2)]}
                anchor={{ x: 0.5, y: 0.5 }}
                tracksViewChanges={false}
              >
                <View style={styles.midRouteArrowBadge}>
                  <MaterialIcons
                    name="navigation"
                    size={15}
                    color="#0A0A0F"
                    style={{ transform: [{ rotate: `${midArrowBearing}deg` }] }}
                  />
                </View>
              </Marker>
            )}

            {/* Destination Flag */}
            {routeDestination && (
              <Marker
                coordinate={{
                  latitude: routeDestination.latitude,
                  longitude: routeDestination.longitude,
                }}
                title={routeDestination.name}
                anchor={{ x: 0.5, y: 0.5 }}
                tracksViewChanges={false}
              >
                <View style={styles.destFlagBadge}>
                  <MaterialIcons name="flag" size={14} color="#0A0A0F" />
                </View>
              </Marker>
            )}
          </>
        )}

        {/* User Navigation Heading Marker */}
        {routeDestination && userLocation?.latitude && (
          <Marker
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            title="Your Location"
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <View style={styles.userNavMarker}>
              <View style={styles.userNavPulse} />
              <View style={styles.userNavDot}>
                <MaterialIcons
                  name="navigation"
                  size={14}
                  color="#FFFFFF"
                  style={{ transform: [{ rotate: `${routeBearing ?? 0}deg` }] }}
                />
              </View>
            </View>
          </Marker>
        )}

        {/* Custom Monument Markers (Optimized & Memoized) */}
        {displayPlaces.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          const isDestination = routeDestination?.id === place.id;

          return (
            <HeritageMarker
              key={place.id}
              place={place}
              isSelected={isSelected}
              isDestination={isDestination}
              onSelect={onSelectPlace}
              onDetails={onPlaceDetails}
            />
          );
        })}
      </MapView>

      {/* Discrete tile attribution */}
      <View style={styles.attributionBadge}>
        <Text style={styles.attributionText}>{TILE_ATTRIBUTION[mapLayer]}</Text>
      </View>

      {/* Floating Navigation Route HUD */}
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
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F0F0F',
  },
  mapBase: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F0F0F',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  mapLoadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 1,
  },
  mapLoadingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  mapLoadingSub: {
    fontSize: 10,
    color: Colors.textMuted,
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
  destFlagBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    ...Shadows.sm,
  },
  userNavMarker: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNavPulse: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(212, 175, 124, 0.25)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  userNavDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  midRouteArrowBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  navigationHud: {
    position: 'absolute',
    top: 56,
    left: Spacing.base,
    right: Spacing.base,
    backgroundColor: 'rgba(23, 23, 23, 0.94)',
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
  markerAnchor: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 40,
  },
  markerBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  markerBadgeSelected: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  markerPulseRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 124, 0.3)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  calloutContainer: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: 210,
    ...Shadows.md,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  calloutTitle: {
    fontSize: Typography.sizes.xs + 1,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 4,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  calloutRatingText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '700',
  },
  calloutDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    lineHeight: 14,
    marginBottom: Spacing.xs,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 4,
    marginTop: 2,
  },
  calloutCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  calloutTap: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '700',
  },
});
