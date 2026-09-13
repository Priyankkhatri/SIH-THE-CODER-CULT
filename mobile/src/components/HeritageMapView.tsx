import React from 'react';
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

// High-Definition free tile layers — no API key required (OSM + CARTO + Esri + OTM).
// UrlTile replaces base map content so Android never depends on Google vector tiles
// (which render blank white in Expo Go without a dev-build-injected key).
export const TILE_URLS: Record<MapLayerType, string | null> = {
  // Detailed streets: CARTO Voyager HD retina
  streets: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
  // Satellite: Esri World Imagery (true satellite detail)
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  // Terrain: OpenTopoMap topographic detail
  terrain: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
  // Dark: CARTO Dark Matter HD — matches heritage-gold theme
  dark: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
  // OSM: OpenStreetMap standard global street atlas (100% free)
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
  // 1. Sanitize & filter valid numeric coordinates to prevent map render glitches.
  // Tight India bbox drops null-island / corrupt seeds that stretch the camera.
  const validPlaces = React.useMemo(() => {
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

  const [mapReady, setMapReady] = React.useState(false);
  const [tileFailed, setTileFailed] = React.useState(false);

  // Never trap the user behind a loading veil: reveal map after 6s even if
  // onMapReady is delayed by slow tiles, and flag degraded mode.
  React.useEffect(() => {
    if (mapReady) return;
    const t = setTimeout(() => {
      setMapReady(true);
      setTileFailed(true);
    }, 6000);
    return () => clearTimeout(t);
  }, [mapReady, mapLayer]);

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

  // 3. Vadodara-first detail region — streets/labels visible instantly.
  // Old 3.6 delta showed all Gujarat as empty wash; 0.12 ≈ 12km street detail.
  const initialRegion = {
    latitude: 22.3072,
    longitude: 73.1812,
    latitudeDelta: 0.14,
    longitudeDelta: 0.14,
  };

  const tileUrl = TILE_URLS[mapLayer];

  // Mid-route arrow bearing from local segment (not whole-trip bearing)
  const midArrowBearing = React.useMemo(() => {
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
    // Bundler resolves HeritageMapView.web.tsx on web; never render native MapView here.
    return null;
  }

  return (
    <View style={styles.mapContainer}>
      {/* Dark base so tiles fading in never flash white */}
      <View style={styles.mapBase} />
      {!mapReady && (
        <View style={styles.mapLoadingOverlay}>
          <Text style={styles.mapLoadingText}>Loading heritage streets…</Text>
          <Text style={styles.mapLoadingSub}>{TILE_ATTRIBUTION[mapLayer]}</Text>
        </View>
      )}
      <MapView
        ref={mapRef as any}
        style={styles.map}
        initialRegion={initialRegion}
        provider={undefined}
        mapType={mapLayer === 'satellite' ? 'none' : 'standard'}
        loadingEnabled={true}
        loadingIndicatorColor={Colors.primary}
        loadingBackgroundColor="#0A0A0F"
        showsUserLocation={Boolean(userLocation?.latitude)}
        showsMyLocationButton={false}
        showsCompass={true}
        showsPointsOfInterests={true}
        showsBuildings={true}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        onMapReady={() => {
          setMapReady(true);
          setTileFailed(false);
        }}
      >
        {/* Raster tiles replace the base map on both platforms — guarantees paint */}
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
                      transform: [{ rotate: `${midArrowBearing}deg` }],
                    }}
                  />
                </View>
              </Marker>
            )}
            {/* Destination flag pin */}
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
                  <MaterialIcons name="flag" size={15} color="#0A0A0F" />
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

      {/* Tile attribution — proves rich sourced tiles, never blank */}
      <View style={styles.attributionBadge}>
        <Text style={styles.attributionText}>{TILE_ATTRIBUTION[mapLayer]}</Text>
      </View>

      {tileFailed && (
        <View style={styles.tileErrorBar}>
          <MaterialIcons name="cloud-off" size={15} color="#F59E0B" />
          <Text style={styles.tileErrorText}>Map tiles slow — check connection, still showing cached streets.</Text>
        </View>
      )}
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
    backgroundColor: '#0A0A0F',
  },
  mapBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0A0F',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0A0F',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 1,
  },
  mapLoadingText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  mapLoadingSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  attributionBadge: {
    position: 'absolute',
    right: 10,
    bottom: 12,
    backgroundColor: 'rgba(10,10,15,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 5,
  },
  attributionText: {
    fontSize: 9,
    color: 'rgba(245,240,232,0.75)',
    fontWeight: '600',
  },
  tileErrorBar: {
    position: 'absolute',
    top: 196,
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(30,22,8,0.95)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 7,
    zIndex: 6,
  },
  tileErrorText: {
    fontSize: 11,
    color: '#FCD34D',
    fontWeight: '600',
    flex: 1,
  },
  destFlagBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Shadows.md,
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
