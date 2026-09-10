import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CATEGORY_COLORS } from '../../constants/theme';
import { usePlacesStore } from '../../stores';
import type { Place } from '../../stores';
import { useLocation } from '../../hooks/useLocation';
import { CategoryFilter } from '../../components/CategoryFilter';
import { HeritageMapView } from '../../components/HeritageMapView';

const { width, height } = Dimensions.get('window');

export default function ExploreScreen() {
  const router = useRouter();
  const location = useLocation();
  const { places } = usePlacesStore();
  const mapRef = useRef<MapView>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const filteredPlaces = selectedCategory
    ? places.filter((p) => p.category === selectedCategory)
    : places;

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
  };

  const handleNavigate = (place: Place) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${place.latitude},${place.longitude}`,
      android: `geo:${place.latitude},${place.longitude}?q=${place.latitude},${place.longitude}(${place.name})`,
    });
    if (url) Linking.openURL(url);
  };

  const centerOnUser = () => {
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  return (
    <View style={styles.container}>
      <HeritageMapView
        places={filteredPlaces}
        selectedPlace={selectedPlace}
        onSelectPlace={handleMarkerPress}
        onPlaceDetails={(placeId) => router.push(`/place/${placeId}`)}
        userLocation={{ latitude: location.latitude, longitude: location.longitude }}
        mapRef={mapRef as any}
      />


      {/* Header overlay */}
      <View style={styles.headerOverlay}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={22} color={Colors.textMuted} />
          <Text style={styles.searchText}>Explore heritage sites</Text>
          <View style={styles.placeCount}>
            <Text style={styles.placeCountText}>{filteredPlaces.length}</Text>
          </View>
        </View>
      </View>

      {/* Category filter */}
      <View style={styles.filterOverlay}>
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </View>

      {/* My location button */}
      <TouchableOpacity style={styles.myLocationBtn} onPress={centerOnUser}>
        <MaterialIcons name="my-location" size={22} color={Colors.primary} />
      </TouchableOpacity>

      {/* Bottom place card */}
      {selectedPlace && (
        <View style={styles.bottomCard}>
          <View style={styles.bottomCardContent}>
            <View style={styles.bottomCardInfo}>
              <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[selectedPlace.category] || Colors.primary }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bottomCardName}>{selectedPlace.name}</Text>
                <Text style={styles.bottomCardDesc} numberOfLines={2}>{selectedPlace.shortDescription}</Text>
                <View style={styles.bottomCardMeta}>
                  {selectedPlace.distance !== undefined && (
                    <Text style={styles.metaText}>📍 {selectedPlace.distance.toFixed(1)} km</Text>
                  )}
                  {selectedPlace.rating && (
                    <Text style={styles.metaText}>⭐ {selectedPlace.rating}</Text>
                  )}
                  {selectedPlace.openingHours && (
                    <Text style={styles.metaText}>🕐 {selectedPlace.openingHours.split('(')[0].trim()}</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.bottomCardActions}>
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => router.push(`/place/${selectedPlace.id}`)}
              >
                <MaterialIcons name="info" size={18} color={Colors.textInverse} />
                <Text style={styles.detailsBtnText}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => handleNavigate(selectedPlace)}
              >
                <MaterialIcons name="directions" size={18} color={Colors.primary} />
                <Text style={styles.navBtnText}>Navigate</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedPlace(null)}>
            <MaterialIcons name="close" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 56,
    left: Spacing.base,
    right: Spacing.base,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface + 'F0',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  searchText: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
  },
  placeCount: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  placeCountText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  filterOverlay: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
  },
  myLocationBtn: {
    position: 'absolute',
    right: Spacing.base,
    bottom: 180,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  calloutContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    width: 220,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calloutTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  calloutDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 4,
  },
  calloutRatingText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  calloutTap: {
    fontSize: Typography.sizes.xs,
    color: Colors.accent,
    fontWeight: '600',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 20,
    left: Spacing.base,
    right: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.lg,
  },
  bottomCardContent: {
    gap: Spacing.md,
  },
  bottomCardInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  catDot: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginTop: 4,
  },
  bottomCardName: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  bottomCardDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  bottomCardMeta: {
    flexDirection: 'row',
    gap: 14,
  },
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  bottomCardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  detailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
  },
  detailsBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceHighlight,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: '600',
    color: Colors.primary,
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
