import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CATEGORY_COLORS } from '../../constants/theme';
import { usePlacesStore, useChatStore } from '../../stores';
import { useTranslation } from '../../hooks/useTranslation';
import type { Place } from '../../stores';
import { useLocation } from '../../hooks/useLocation';
import { CategoryFilter } from '../../components/CategoryFilter';
import { HeritageMapView } from '../../components/HeritageMapView';
import { PlaceCard } from '../../components/PlaceCard';
import { PlaceCardVerticalSkeleton } from '../../components/Skeleton';
import { placesApi } from '../../services/api';
import { getLiveCrowd } from '../../utils/touristMeta';
import { ALL_SEED_PLACES } from '../../utils/seedPlaces';

const { width, height } = Dimensions.get('window');

export default function ExploreScreen() {
  const router = useRouter();
  const location = useLocation();
  const { places, setPlaces } = usePlacesStore();
  const { setContext } = useChatStore();
  const { t, getPlaceName } = useTranslation();
  const mapRef = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedCrowd, setSelectedCrowd] = useState<'all' | 'Low' | 'Moderate' | 'Peak'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fetch all cataloged heritage places with instant 155+ offline seed fallback
  const loadPlaces = async () => {
    setIsLoading(true);
    try {
      const response: any = await placesApi.getAll(selectedCategory || undefined);
      const list = Array.isArray(response) ? response : (response?.data || []);
      if (list && list.length > 0) {
        setPlaces(list);
      } else if (places.length === 0) {
        setPlaces(ALL_SEED_PLACES);
      }
    } catch (err) {
      console.warn('[ExploreScreen] Error loading places, activating full seed catalog:', err);
      if (places.length === 0) {
        setPlaces(ALL_SEED_PLACES);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (places.length === 0) {
      setPlaces(ALL_SEED_PLACES);
    }
    loadPlaces();
  }, [selectedCategory]);

  // Comprehensive filter by category, crowd level & real-time search query
  const filteredPlaces = places.filter((p) => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    if (!matchesCategory) return false;

    if (selectedCrowd !== 'all') {
      const crowd = getLiveCrowd(p.name);
      if (crowd.level !== selectedCrowd) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = p.name.toLowerCase().includes(q) || (p.nameHi && p.nameHi.toLowerCase().includes(q));
    const descMatch = (p.shortDescription || '').toLowerCase().includes(q);
    return nameMatch || descMatch;
  });

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
  };

  const handleAskAI = (place: Place) => {
    setContext(place.id, place.name);
    router.push('/(tabs)/ai');
  };

  const handleNavigate = (place: Place) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${place.latitude},${place.longitude}`,
      android: `geo:${place.latitude},${place.longitude}?q=${place.latitude},${place.longitude}(${place.name})`,
      web: `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  const centerOnUser = () => {
    if (mapRef.current && typeof mapRef.current.animateToRegion === 'function') {
      const lat = location.latitude || 22.3072;
      const lng = location.longitude || 73.1812;
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      });
    }
  };

  const centerGujarat = () => {
    if (mapRef.current && typeof mapRef.current.animateToRegion === 'function') {
      mapRef.current.animateToRegion(
        {
          latitude: 22.85,
          longitude: 72.35,
          latitudeDelta: 3.6,
          longitudeDelta: 3.6,
        },
        500
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* View Switcher: Radar/Map or Directory List */}
      {viewMode === 'map' ? (
        <HeritageMapView
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={handleMarkerPress}
          onPlaceDetails={(placeId) => router.push(`/place/${placeId}`)}
          userLocation={{ latitude: location.latitude, longitude: location.longitude }}
          mapRef={mapRef}
        />
      ) : (
        <View style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.listContent}>
              <PlaceCardVerticalSkeleton />
              <PlaceCardVerticalSkeleton />
              <PlaceCardVerticalSkeleton />
              <PlaceCardVerticalSkeleton />
            </View>
          ) : (
            <FlatList
              data={filteredPlaces}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <PlaceCard
                  place={item}
                  onPress={() => router.push(`/place/${item.id}`)}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <MaterialIcons name="search-off" size={48} color={Colors.textMuted} />
                  <Text style={styles.emptyTitle}>No heritage sites found</Text>
                  <Text style={styles.emptySubtitle}>Try changing your search query or category filter</Text>
                </View>
              }
            />
          )}
        </View>
      )}

      {/* Header overlay */}
      <View style={styles.headerOverlay}>
        <View style={styles.searchBarRow}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search 136+ heritage sites, forts, temples..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
            <View style={styles.placeCount}>
              <Text style={styles.placeCountText}>{filteredPlaces.length}</Text>
            </View>
          </View>

          {/* View Toggle Button */}
          <TouchableOpacity
            style={styles.viewToggleBtn}
            onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          >
            <MaterialIcons
              name={viewMode === 'map' ? 'view-list' : 'map'}
              size={22}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category & Live Crowd Filters */}
      <View style={styles.filterOverlay}>
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        
        {/* Footfall / Crowd Density Filter (Hackathon PPT Feature) */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.crowdFilterRow}
          data={[
            { key: 'all', label: '👥 All Footfall', color: Colors.surfaceHighlight },
            { key: 'Low', label: '🟢 Low Crowd', color: '#10B981' },
            { key: 'Moderate', label: '🟡 Moderate', color: '#F59E0B' },
            { key: 'Peak', label: '🔴 Peak Busy', color: '#EF4444' },
          ] as const}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            const isSelected = selectedCrowd === item.key;
            return (
              <TouchableOpacity
                style={[
                  styles.crowdChip,
                  isSelected && styles.crowdChipActive,
                  isSelected && item.key !== 'all' && { backgroundColor: item.color + '25', borderColor: item.color },
                ]}
                onPress={() => setSelectedCrowd(item.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.crowdChipText,
                    isSelected && styles.crowdChipTextActive,
                    isSelected && item.key !== 'all' && { color: item.color, fontWeight: '700' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Floating Map Actions (map mode only) */}
      {viewMode === 'map' && (
        <View style={[styles.mapActionCol, selectedPlace ? { bottom: 250 } : {}]}>
          <TouchableOpacity
            style={styles.mapActionBtn}
            onPress={centerGujarat}
            activeOpacity={0.8}
          >
            <MaterialIcons name="public" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapActionBtn}
            onPress={centerOnUser}
            activeOpacity={0.8}
          >
            <MaterialIcons name="my-location" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom place card (map mode only) */}
      {viewMode === 'map' && selectedPlace && (
        <View style={styles.bottomCard}>
          <View style={styles.bottomCardContent}>
            <View style={styles.bottomCardInfo}>
              <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[selectedPlace.category] || Colors.primary }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bottomCardName}>{getPlaceName(selectedPlace)}</Text>
                <Text style={styles.bottomCardDesc} numberOfLines={2}>{selectedPlace.shortDescription}</Text>
                
                {/* Real-time crowd badge */}
                {(() => {
                  const crowd = getLiveCrowd(selectedPlace.name);
                  return (
                    <View style={styles.bottomCardCrowdRow}>
                      <View style={[styles.crowdDotSmall, { backgroundColor: crowd.color }]} />
                      <Text style={[styles.bottomCardCrowdText, { color: crowd.color }]}>
                        {crowd.badge} • Est. wait: {crowd.waitTime}
                      </Text>
                    </View>
                  );
                })()}

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
                style={styles.aiBtn}
                onPress={() => handleAskAI(selectedPlace)}
              >
                <MaterialIcons name="auto-awesome" size={16} color={Colors.textInverse} />
                <Text style={styles.aiBtnText}>Ask AI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => router.push(`/place/${selectedPlace.id}`)}
              >
                <MaterialIcons name="info" size={16} color={Colors.textInverse} />
                <Text style={styles.detailsBtnText}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => handleNavigate(selectedPlace)}
              >
                <MaterialIcons name="directions" size={16} color={Colors.primary} />
                <Text style={styles.navBtnText}>Go</Text>
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
  listContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 205,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: 110,
    gap: Spacing.md,
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    gap: 12,
  },
  loaderText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 52,
    left: Spacing.base,
    right: Spacing.base,
    zIndex: 10,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface + 'F0',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    paddingVertical: 4,
  },
  viewToggleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  placeCount: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  placeCountText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  filterOverlay: {
    position: 'absolute',
    top: 104,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  mapActionCol: {
    position: 'absolute',
    right: Spacing.base,
    bottom: 180,
    gap: 10,
    zIndex: 15,
  },
  mapActionBtn: {
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
    gap: 8,
  },
  aiBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
  },
  aiBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.textInverse,
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
  crowdFilterRow: {
    paddingHorizontal: Spacing.base,
    gap: 8,
    paddingTop: 4,
    paddingBottom: 8,
  },
  crowdChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface + 'EE',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  crowdChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  crowdChipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  crowdChipTextActive: {
    color: Colors.textInverse,
  },
  bottomCardCrowdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  crowdDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  bottomCardCrowdText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
  },
});
