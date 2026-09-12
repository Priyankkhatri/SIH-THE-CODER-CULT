import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker, Polyline, Callout, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
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

// Sleek high-contrast Google Maps Dark Style (100% Native vector, no watermark)
export const DARK_GOOGLE_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#161b22' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#161b22' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#f1f5f9' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#13282b' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6ee7b7' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#263342' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#19222d' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#d4af37' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2937' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
];

// High-Definition Tile Layers (CartoDB removed to eliminate watermark)
export const TILE_URLS: Record<MapLayerType, string | null> = {
  // streets: Real native Google Maps vector layer (null = no UrlTile overlay needed)
  streets: null,
  // satellite: Real native Google Maps hybrid layer (null = no UrlTile overlay needed)
  satellite: null,
  // terrain: Real native Google Maps terrain layer (null = no UrlTile overlay needed)
  terrain: null,
  // dark: Native Google Maps with DARK_GOOGLE_MAP_STYLE (null = no UrlTile overlay needed)
  dark: null,
  // osm: OpenStreetMap standard global street atlas (100% free, no watermarks)
  osm: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
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
  // 1. Sanitize & filter valid numeric coordinates to prevent map render glitches
  const validPlaces = React.useMemo(() => {
    return (places || []).filter(
      (p) =>
        p &&
        typeof p.latitude === 'number' &&
        typeof p.longitude === 'number' &&
        !isNaN(p.latitude) &&
        !isNaN(p.longitude) &&
        p.latitude > 5 &&
        p.longitude > 5
    );
  }, [places]);

  // 2. Smooth auto-focus camera when a place is tapped or searched
  React.useEffect(() => {
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
          500
        );
      }
    }
  }, [selectedPlace]);

  // 3. Wide-angle Gujarat & West India heritage region
  const initialRegion = {
    latitude: 22.85,
    longitude: 72.35,
    latitudeDelta: 3.6,
    longitudeDelta: 3.6,
  };

  const tileUrl = TILE_URLS[mapLayer];
  const mapType = mapLayer === 'satellite' ? 'hybrid' : mapLayer === 'terrain' ? 'terrain' : 'standard';
  const isGoogleProvider = Platform.OS === 'android';

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.map, styles.webMapContainer]}>
        <iframe
          title="Heritage Map Web"
          src="https://www.openstreetmap.org/export/embed.html?bbox=68.1,20.1,74.5,24.7&layer=mapnik"
          style={{ width: '100%', height: '100%', border: 'none' } as any}
        />
        <View style={styles.webOverlayInfo}>
          <View style={styles.webBadge}>
            <MaterialIcons name="explore" size={16} color={Colors.primary} />
            <Text style={styles.webBadgeText}>{validPlaces.length} Monuments Cataloged</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef as any}
        style={styles.map}
        initialRegion={initialRegion}
        provider={isGoogleProvider ? PROVIDER_GOOGLE : undefined}
        mapType={mapType}
        customMapStyle={mapLayer === 'dark' ? DARK_GOOGLE_MAP_STYLE : undefined}
        loadingEnabled={true}
        loadingIndicatorColor={Colors.primary}
        loadingBackgroundColor="#121824"
        showsUserLocation={Boolean(userLocation?.latitude)}
        showsMyLocationButton={false}
        showsCompass={true}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
      >
        {/* Only render UrlTile if a free non-watermarked layer like OSM is active */}
        {tileUrl && (
          <UrlTile
            key={mapLayer}
            urlTemplate={tileUrl}
            maximumZ={19}
            minimumZ={1}
            flipY={false}
            zIndex={-1}
            shouldReplaceMapContent={Platform.OS === 'ios'}
          />
        )}

        {/* Real-time Highway Route Polyline */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <>
            {/* Outer golden glow */}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="rgba(212, 175, 55, 0.4)"
              strokeWidth={8}
              lineCap="round"
              lineJoin="round"
            />
            {/* Solid core line */}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#D4AF37"
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />

            {/* Mid-Route Directional Arrow Marker */}
            {routeCoordinates.length > 3 && (
              <Marker
                coordinate={routeCoordinates[Math.floor(routeCoordinates.length / 2)]}
                anchor={{ x: 0.5, y: 0.5 }}
                tracksViewChanges={false}
              >
                <View style={styles.midRouteArrowBadge}>
                  <MaterialIcons
                    name="navigation"
                    size={16}
                    color="#0A0A0F"
                    style={{
                      transform: [{ rotate: `${routeBearing ?? 0}deg` }],
                    }}
                  />
                </View>
              </Marker>
            )}
          </>
        )}

        {/* User Navigation Heading Marker */}
        {routeDestination && userLocation?.latitude && (
          <Marker
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            title="Your Current Location"
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <View style={styles.userNavMarker}>
              <View style={styles.userNavPulse} />
              <View style={styles.userNavDot}>
                <MaterialIcons
                  name="navigation"
                  size={15}
                  color="#FFFFFF"
                  style={{
                    transform: [{ rotate: `${routeBearing ?? 0}deg` }],
                  }}
                />
              </View>
            </View>
          </Marker>
        )}

        {/* Interactive Custom Monument Markers */}
        {validPlaces.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          const isDestination = routeDestination?.id === place.id;
          const pinColor = isDestination ? '#D4AF37' : CATEGORY_COLORS[place.category] || Colors.primary;
          const iconName = getCategoryIcon(place.category);

          return (
            <Marker
              key={place.id}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              title={place.name}
              description={place.shortDescription?.substring(0, 80)}
              onPress={() => onSelectPlace(place)}
              tracksViewChanges={false}
            >
              {/* Custom Themed Pin View */}
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
                    size={isSelected || isDestination ? 16 : 13}
                    color="#FFFFFF"
                  />
                </View>
                <View style={[styles.markerArrow, { borderTopColor: pinColor }]} />
              </View>

              {/* Custom Information Callout */}
              <Callout tooltip onPress={() => onPlaceDetails(place.id)}>
                <View style={styles.calloutContainer}>
                  <View style={styles.calloutHeader}>
                    <Text style={styles.calloutTitle} numberOfLines={1}>
                      {place.name}
                    </Text>
                    {place.rating && (
                      <View style={styles.calloutRating}>
                        <MaterialIcons name="star" size={12} color="#D4AF37" />
                        <Text style={styles.calloutRatingText}>{place.rating}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.calloutDesc} numberOfLines={2}>
                    {place.shortDescription || 'Historical monument cataloged in heritage registry.'}
                  </Text>
                  <View style={styles.calloutFooter}>
                    <Text style={styles.calloutCategory}>{place.category.toUpperCase()}</Text>
                    <Text style={styles.calloutTap}>View Details →</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Floating Active Direction & Navigation HUD */}
      {routeDestination && (
        <View style={styles.navigationHud}>
          <View style={styles.navHudLeft}>
            <View style={styles.navHudIconWrap}>
              <MaterialIcons
                name="navigation"
                size={22}
                color="#D4AF37"
                style={{
                  transform: [{ rotate: `${routeBearing ?? 0}deg` }],
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.navHudTitleRow}>
                <View style={styles.liveRouteDot} />
                <Text style={styles.navHudTitle} numberOfLines={1}>
                  Directions to {routeDestination.name}
                </Text>
              </View>
              <Text style={styles.navHudMetrics}>
                📍 {routeDistanceKm ?? '--'} km • ~{routeDurationMin ?? '--'} min drive • Heading {Math.round(routeBearing ?? 0)}°
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
                  web: `https://www.google.com/maps/dir/?api=1&destination=${routeDestination.latitude},${routeDestination.longitude}`,
                });
                if (url) Linking.openURL(url);
              }}
              activeOpacity={0.8}
            >
              <MaterialIcons name="directions" size={16} color="#0A0A0F" />
              <Text style={styles.navHudStartText}>Navigate</Text>
            </TouchableOpacity>

            {onClearRoute && (
              <TouchableOpacity
                style={styles.navHudCloseBtn}
                onPress={onClearRoute}
                activeOpacity={0.8}
              >
                <MaterialIcons name="close" size={16} color="#CBD5E1" />
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
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // User navigation pulse & heading
  userNavMarker: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNavPulse: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(56, 189, 248, 0.35)',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  userNavDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Shadows.md,
  },
  // Mid-route arrow badge
  midRouteArrowBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Shadows.md,
  },
  // Floating Navigation HUD
  navigationHud: {
    position: 'absolute',
    top: 146,
    left: Spacing.base,
    right: Spacing.base,
    backgroundColor: 'rgba(15, 20, 32, 0.95)',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    ...Shadows.lg,
    zIndex: 999,
  },
  navHudLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navHudIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHudTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  liveRouteDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  navHudTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  navHudMetrics: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  navHudActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navHudStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D4AF37',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
  },
  navHudStartText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0A0A0F',
  },
  navHudCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Custom Markers
  markerAnchor: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 48,
  },
  markerBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Shadows.md,
  },
  markerBadgeSelected: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: '#D4AF37',
    ...Shadows.glow,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  markerPulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.35)',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
  },

  // Callout styling
  calloutContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 240,
    ...Shadows.lg,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  calloutTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 6,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  calloutRatingText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  calloutDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: Spacing.xs,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 6,
    marginTop: 2,
  },
  calloutCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  calloutTap: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '700',
  },

  // Web map container
  webMapContainer: {
    position: 'relative',
    backgroundColor: '#0E1726',
  },
  webOverlayInfo: {
    position: 'absolute',
    top: 80,
    right: 20,
  },
  webBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(18, 24, 38, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  webBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.text,
  },
});
