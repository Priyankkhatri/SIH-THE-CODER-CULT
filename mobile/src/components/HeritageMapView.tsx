import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
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
}

// 100% Reliable, Free CDN High-Definition Tile Layers (No Google Cloud API Key Required)
export const TILE_URLS: Record<MapLayerType, string> = {
  // CartoDB Voyager: Crisp street names, highway labels, rivers, parks, city names
  streets: 'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  // ESRI High-Res World Imagery: Real satellite aerial photography
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  // OpenTopoMap: Elevation contour lines, hill shading, natural terrain
  terrain: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
  // CartoDB Dark Matter: Sleek dark heritage radar with illuminated roads
  dark: 'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  // OpenStreetMap Classic: Standard global street & geographic atlas
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

  const tileUrl = TILE_URLS[mapLayer] || TILE_URLS.streets;
  const mapType = mapLayer === 'satellite' ? 'satellite' : mapLayer === 'terrain' ? 'terrain' : 'standard';

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
    <MapView
      ref={mapRef as any}
      style={styles.map}
      initialRegion={initialRegion}
      mapType={mapType}
      loadingEnabled={true}
      loadingIndicatorColor={Colors.primary}
      loadingBackgroundColor="#121824"
      showsUserLocation={Boolean(userLocation?.latitude)}
      showsMyLocationButton={false}
      showsCompass={true}
      toolbarEnabled={false}
      moveOnMarkerPress={false}
    >
      {/* High-detail tile overlay ensuring full roads, labels, and landmarks */}
      <UrlTile
        key={mapLayer}
        urlTemplate={tileUrl}
        maximumZ={19}
        minimumZ={1}
        flipY={false}
        zIndex={-1}
        shouldReplaceMapContent={Platform.OS === 'ios'}
      />

      {/* Interactive Custom Monument Markers */}
      {validPlaces.map((place) => {
        const isSelected = selectedPlace?.id === place.id;
        const pinColor = CATEGORY_COLORS[place.category] || Colors.primary;
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
              {isSelected && <View style={styles.markerPulseRing} />}
              <View
                style={[
                  styles.markerBadge,
                  isSelected && styles.markerBadgeSelected,
                  { backgroundColor: pinColor },
                ]}
              >
                <MaterialIcons
                  name={iconName}
                  size={isSelected ? 16 : 13}
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
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFill,
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
