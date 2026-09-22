import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  Share,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CATEGORY_COLORS } from '../../constants/theme';
import { usePlacesStore, useChatStore } from '../../stores';
import * as Speech from 'expo-speech';
import { useTranslation } from '../../hooks/useTranslation';
import type { Place } from '../../stores';
import { useLocation } from '../../hooks/useLocation';
import { CategoryFilter } from '../../components/CategoryFilter';
import { HeritageMapView, MapLayerType, AmenityItem } from '../../components/HeritageMapView';
import { TurnByTurnSheet } from '../../components/TurnByTurnSheet';
import { MapRideBookingModal } from '../../components/MapRideBookingModal';
import {
  ScalePressable,
  SlideUpView,
  SlideDownView,
  PulseBeacon,
  SoundWaveVisualizer,
} from '../../components/common/MicroAnimations';
import { PlaceCard } from '../../components/PlaceCard';
import { PlaceCardVerticalSkeleton } from '../../components/Skeleton';
import { placesApi } from '../../services/api';
import { getLiveCrowd } from '../../utils/touristMeta';
import { ALL_SEED_PLACES } from '../../utils/seedPlaces';
import { dynamicImageService } from '../../services/dynamicImageService';
import { getRoute, haversineDistance, RouteResult, TravelMode } from '../../utils/routeService';

const { width, height } = Dimensions.get('window');

export default function ExploreScreen() {
  const router = useRouter();
  const location = useLocation();
  const params = useLocalSearchParams<{
    destinationId?: string;
    destinationName?: string;
    routeTo?: string;
  }>();
  const { places, setPlaces } = usePlacesStore();
  const { setContext } = useChatStore();
  const { t, getPlaceName } = useTranslation();
  const mapRef = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedCrowd, setSelectedCrowd] = useState<'all' | 'Low' | 'Moderate' | 'Peak'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [mapLayer, setMapLayer] = useState<MapLayerType>('osm');
  const [showLayerPicker, setShowLayerPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [routeDestination, setRouteDestination] = useState<Place | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteResult | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [showStepsSheet, setShowStepsSheet] = useState(false);
  const [showRideModal, setShowRideModal] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  // Debounced search so 155+ catalog filter doesn't re-run per keystroke
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Stop any active speech narration on unmount or destination clear
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 220);
    return () => clearTimeout(t);
  }, [searchQuery]);

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

  // Merge loaded places with the offline catalog to ensure all 148+ sites are always searchable
  // and attach dynamic Haversine distance from user GPS coordinates, sorted ascending
  const allCatalogPlaces = React.useMemo(() => {
    const userLat = location.latitude ?? 22.3072;
    const userLng = location.longitude ?? 73.1812;

    const map = new Map<string, Place>();
    for (const p of ALL_SEED_PLACES) map.set(p.id, p);
    for (const p of places) map.set(p.id, p);

    const merged = Array.from(map.values()).map((p) => {
      const dist = haversineDistance(userLat, userLng, p.latitude, p.longitude);
      return {
        ...p,
        distance: Number(dist.toFixed(1)),
      };
    });

    merged.sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));
    return merged;
  }, [places, Math.round((location.latitude ?? 22.3072) * 100), Math.round((location.longitude ?? 73.1812) * 100)]);

  // Comprehensive filter by category, crowd level & real-time search query
  const filteredPlaces = React.useMemo(() => {
    return allCatalogPlaces.filter((p) => {
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      if (!matchesCategory) return false;

      if (selectedCrowd !== 'all') {
        const crowd = getLiveCrowd(p.name);
        if (crowd.level !== selectedCrowd) return false;
      }

      if (!debouncedQuery.trim()) return true;
      const q = debouncedQuery.toLowerCase().trim();
      const nameMatch =
        p.name.toLowerCase().includes(q) ||
        ((p as any).nameHi && (p as any).nameHi.toLowerCase().includes(q)) ||
        ((p as any).nameGu && (p as any).nameGu.toLowerCase().includes(q));
      const descMatch = (p.shortDescription || '').toLowerCase().includes(q);
      const cityMatch =
        ((p as any).city && (p as any).city.toLowerCase().includes(q)) ||
        ((p as any).state && (p as any).state.toLowerCase().includes(q));
      const tagsMatch =
        Array.isArray((p as any).tags) &&
        (p as any).tags.some((t: string) => t.toLowerCase().includes(q));
      return nameMatch || descMatch || cityMatch || tagsMatch;
    });
  }, [allCatalogPlaces, selectedCategory, selectedCrowd, debouncedQuery]);

  // Top suggestions for the search dropdown
  const searchSuggestions = React.useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase().trim();
    return allCatalogPlaces
      .filter((p) => {
        const nameMatch =
          p.name.toLowerCase().includes(q) ||
          ((p as any).nameHi && (p as any).nameHi.toLowerCase().includes(q)) ||
          ((p as any).nameGu && (p as any).nameGu.toLowerCase().includes(q));
        const descMatch = (p.shortDescription || '').toLowerCase().includes(q);
        const cityMatch =
          ((p as any).city && (p as any).city.toLowerCase().includes(q)) ||
          ((p as any).state && (p as any).state.toLowerCase().includes(q));
        return nameMatch || descMatch || cityMatch;
      })
      .slice(0, 6);
  }, [debouncedQuery, allCatalogPlaces]);

  // Active on-ground amenities around selected place
  const activeAmenities = useMemo<AmenityItem[]>(() => {
    if (!selectedPlace) return [];
    const lat = selectedPlace.latitude;
    const lng = selectedPlace.longitude;

    return [
      {
        id: `${selectedPlace.id}-ticket`,
        type: 'ticket',
        name: 'Official ASI Ticket & Security Counter',
        latitude: lat + 0.00032,
        longitude: lng - 0.00028,
        distanceMeters: 40,
      },
      {
        id: `${selectedPlace.id}-water`,
        type: 'water',
        name: 'Pure RO Drinking Water Kiosk',
        latitude: lat - 0.00025,
        longitude: lng + 0.0003,
        distanceMeters: 55,
      },
      {
        id: `${selectedPlace.id}-restroom`,
        type: 'restroom',
        name: 'Clean ASI Public Restrooms',
        latitude: lat + 0.0005,
        longitude: lng + 0.0004,
        distanceMeters: 75,
      },
      {
        id: `${selectedPlace.id}-parking`,
        type: 'parking',
        name: 'Monument Visitor Parking Area',
        latitude: lat - 0.00075,
        longitude: lng - 0.00065,
        distanceMeters: 110,
      },
    ];
  }, [selectedPlace?.id, selectedPlace?.latitude, selectedPlace?.longitude]);

  // Spoken heritage audio chronicle
  const toggleAudioStory = (place: Place) => {
    if (isNarrating) {
      Speech.stop();
      setIsNarrating(false);
      return;
    }

    const title = getPlaceName(place);
    const narrative =
      place.historySnippet ||
      place.shortDescription ||
      `${title} is a celebrated heritage monument in Gujarat, renowned for its architectural craftsmanship and historical legacy.`;

    Speech.stop();
    setIsNarrating(true);
    Speech.speak(`Welcome to ${title}. ${narrative}`, {
      language: 'en-IN',
      pitch: 1.0,
      rate: 0.92,
      onDone: () => setIsNarrating(false),
      onError: () => setIsNarrating(false),
    });
  };

  // Starts in-app route drawing with direction arrow and fits camera to full bbox
  const startNavigationTo = async (place: Place, mode: TravelMode = travelMode) => {
    setSelectedPlace(place);
    setRouteDestination(place);
    setRouteInfo(null);
    setIsRouting(true);
    setTravelMode(mode);
    const userLat = location.latitude || 22.3072;
    const userLng = location.longitude || 73.1812;

    try {
      const route = await getRoute(userLat, userLng, place.latitude, place.longitude, mode);
      setRouteInfo(route);

      if (mapRef.current?.fitToCoordinates && route.coordinates.length > 0) {
        const coords =
          route.bbox
            ? [
                { latitude: route.bbox.minLat, longitude: route.bbox.minLng },
                { latitude: route.bbox.maxLat, longitude: route.bbox.maxLng },
              ]
            : [
                { latitude: userLat, longitude: userLng },
                { latitude: place.latitude, longitude: place.longitude },
              ];
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 190, right: 60, bottom: 320, left: 60 },
          animated: true,
        });
      }
    } catch (err) {
      console.warn('[ExploreScreen] Route fetch notice:', err);
    } finally {
      setIsRouting(false);
    }
  };

  // Listen for navigation parameters (e.g. from Home tab Explore button)
  useEffect(() => {
    if (params.destinationId || params.destinationName) {
      const target = allCatalogPlaces.find(
        (p) =>
          (params.destinationId && p.id === params.destinationId) ||
          (params.destinationName && p.name.toLowerCase().includes(params.destinationName.toLowerCase()))
      );
      if (target) {
        setSelectedPlace(target);
        if (params.routeTo === 'true' || params.routeTo === '1') {
          startNavigationTo(target);
        } else if (mapRef.current && typeof mapRef.current.animateToRegion === 'function') {
          mapRef.current.animateToRegion(
            {
              latitude: target.latitude,
              longitude: target.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            },
            600
          );
        }
      }
    }
  }, [params.destinationId, params.destinationName, params.routeTo]);

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
  };

  const handleAskAI = (place: Place) => {
    setContext(place.id, place.name);
    router.push({
      pathname: '/(tabs)/ai',
      params: {
        autoAsk: `Tell me the history, architecture, and legends of ${place.name}.`,
        placeId: place.id,
        placeName: place.name,
        t: String(Date.now()),
      },
    });
  };

  const handleNavigate = (place: Place) => {
    startNavigationTo(place);
  };

  const zoomByDelta = (factor: number) => {
    // Delta fallback works on every provider (Google getCamera is unreliable
    // with raster UrlTile overlays, so never depend on it alone).
    if (mapRef.current && typeof mapRef.current.getCamera === 'function') {
      mapRef.current
        .getCamera()
        .then((cam: any) => {
          if (cam) {
            mapRef.current.animateCamera({
              ...cam,
              altitude: Math.max(500, (cam.altitude || 10000) * factor),
              zoom: Math.min(20, Math.max(4, (cam.zoom || 12) + (factor < 1 ? 1 : -1))),
            });
          } else {
            throw new Error('no cam');
          }
        })
        .catch(() => zoomByDeltaFallback(factor));
    } else {
      zoomByDeltaFallback(factor);
    }
  };

  const zoomByDeltaFallback = (_factor: number) => {
    // Last-resort nudge toward selected place / user so buttons never feel dead
    const target = selectedPlace ?? routeDestination;
    const lat = target?.latitude ?? location.latitude ?? 22.3072;
    const lng = target?.longitude ?? location.longitude ?? 73.1812;
    if (mapRef.current && typeof mapRef.current.animateToRegion === 'function') {
      const delta = _factor < 1 ? 0.05 : 0.3;
      mapRef.current.animateToRegion(
        { latitude: lat, longitude: lng, latitudeDelta: delta, longitudeDelta: delta },
        350
      );
    }
  };

  const zoomIn = () => {
    if (typeof mapRef.current?.zoomIn === 'function') {
      mapRef.current.zoomIn();
    } else {
      zoomByDelta(0.5);
    }
  };

  const zoomOut = () => {
    if (typeof mapRef.current?.zoomOut === 'function') {
      mapRef.current.zoomOut();
    } else {
      zoomByDelta(2);
    }
  };

  // Enable continuous location tracking on active radar/map
  useEffect(() => {
    if (viewMode === 'map') {
      location.startWatching?.();
      return () => {
        location.stopWatching?.();
      };
    }
  }, [viewMode]);

  const centerOnUser = async () => {
    let lat = location.latitude;
    let lng = location.longitude;

    if (!location.isGpsResolved || !location.permissionGranted) {
      try {
        const fresh = await location.refresh();
        if (fresh?.latitude && fresh?.longitude) {
          lat = fresh.latitude;
          lng = fresh.longitude;
        }
      } catch {}
    }

    if (mapRef.current && typeof mapRef.current.animateToRegion === 'function') {
      mapRef.current.animateToRegion({
        latitude: lat || 22.3072,
        longitude: lng || 73.1812,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }, 500);
    }
  };

  const centerGujarat = () => {
    if (mapRef.current && typeof mapRef.current.animateToRegion === 'function') {
      // Street-detail Vadodara view — matches HeritageMapView initialRegion
      mapRef.current.animateToRegion(
        {
          latitude: 22.3072,
          longitude: 73.1812,
          latitudeDelta: 0.14,
          longitudeDelta: 0.14,
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
          mapLayer={mapLayer}
          amenities={showAmenities ? activeAmenities : []}
          routeDestination={routeDestination}
          routeCoordinates={routeInfo?.coordinates}
          routeBearing={routeInfo?.bearing}
          routeDistanceKm={routeInfo?.distanceKm}
          routeDurationMin={routeInfo?.durationMin}
          onClearRoute={() => {
            setRouteDestination(null);
            setRouteInfo(null);
            setShowStepsSheet(false);
          }}
          onPressSteps={() => setShowStepsSheet(true)}
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
              initialNumToRender={5}
              maxToRenderPerBatch={6}
              windowSize={5}
              removeClippedSubviews={Platform.OS !== 'web'}
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
              placeholder="Search 155+ heritage sites, forts, temples..."
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

        {/* Floating Search Suggestions Dropdown */}
        {searchQuery.trim().length > 0 && searchSuggestions.length > 0 && (
          <View style={styles.searchSuggestionsDropdown}>
            {searchSuggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.searchSuggestionItem}
                onPress={() => {
                  setSelectedPlace(item);
                  setSearchQuery('');
                  if (mapRef.current && typeof mapRef.current.animateToRegion === 'function') {
                    mapRef.current.animateToRegion(
                      {
                        latitude: item.latitude,
                        longitude: item.longitude,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.04,
                      },
                      600
                    );
                  }
                }}
                activeOpacity={0.7}
              >
                <Image
                  source={{
                    uri: dynamicImageService.getPlaceImage(
                      item.name,
                      item.category,
                      item.imageUrl
                    ),
                  }}
                  style={styles.suggestionThumb}
                  contentFit="cover"
                />
                <View style={styles.suggestionTextCol}>
                  <Text style={styles.suggestionTitle} numberOfLines={1}>
                    {getPlaceName(item)}
                  </Text>
                  <Text style={styles.suggestionSub} numberOfLines={1}>
                    {(item.category || 'heritage').toUpperCase()} • {(item as any).city || 'Gujarat'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.suggestionGoBtn}
                  onPress={() => {
                    setSearchQuery('');
                    startNavigationTo(item);
                  }}
                >
                  <MaterialIcons name="directions" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Category & Live Crowd Filters */}
      <View style={styles.filterOverlay}>
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        
        {/* Live Visitor Density Filter */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.crowdFilterRow}
          data={[
            { key: 'all', label: 'All Footfall', color: Colors.surfaceHighlight },
            { key: 'Low', label: '🟢 Low Crowd', color: '#10B981' },
            { key: 'Moderate', label: '🟡 Moderate', color: '#F59E0B' },
            { key: 'Peak', label: '🔴 Busy', color: '#EF4444' },
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

      {/* Floating Map Actions (Google Maps FAB Stack with tactile ScalePressable) */}
      {viewMode === 'map' && (
        <View style={[styles.mapActionCol, selectedPlace ? { bottom: 310 } : {}]}>
          {/* Compass / Reset North */}
          <ScalePressable
            style={styles.mapActionBtn}
            onPress={centerGujarat}
          >
            <MaterialIcons name="explore" size={20} color={Colors.primary} />
          </ScalePressable>

          {/* On-ground Amenities (Water, Restrooms, Parking, Tickets) */}
          <ScalePressable
            style={[styles.mapActionBtn, showAmenities && styles.mapActionBtnActive]}
            onPress={() => setShowAmenities(!showAmenities)}
          >
            <MaterialIcons
              name="local-convenience-store"
              size={19}
              color={showAmenities ? Colors.background : Colors.primary}
            />
          </ScalePressable>

          {/* Map Layer Switcher */}
          <ScalePressable
            style={[styles.mapActionBtn, showLayerPicker && styles.mapActionBtnActive]}
            onPress={() => setShowLayerPicker(!showLayerPicker)}
          >
            <MaterialIcons
              name="layers"
              size={20}
              color={showLayerPicker ? Colors.background : Colors.primary}
            />
          </ScalePressable>

          {/* My Location Button */}
          <ScalePressable
            style={[styles.mapActionBtn, location.isGpsResolved && styles.mapActionBtnGpsActive]}
            onPress={centerOnUser}
          >
            <MaterialIcons
              name="my-location"
              size={20}
              color={location.isGpsResolved ? '#38BDF8' : Colors.primary}
            />
          </ScalePressable>

          {/* Google Maps Paired Zoom Controls Pill */}
          <View style={styles.zoomControlPill}>
            <ScalePressable style={styles.zoomPillBtn} onPress={zoomIn}>
              <MaterialIcons name="add" size={19} color={Colors.text} />
            </ScalePressable>
            <View style={styles.zoomDivider} />
            <ScalePressable style={styles.zoomPillBtn} onPress={zoomOut}>
              <MaterialIcons name="remove" size={19} color={Colors.text} />
            </ScalePressable>
          </View>
        </View>
      )}

      {/* Interactive Map Layer Picker Tray */}
      {viewMode === 'map' && showLayerPicker && (
        <View style={[styles.layerPickerTray, selectedPlace ? { bottom: 310 } : {}]}>
          <View style={styles.layerPickerHeader}>
            <MaterialIcons name="layers" size={16} color={Colors.primary} />
            <Text style={styles.layerPickerTitle}>Map Views</Text>
          </View>
          <View style={styles.layerPickerRow}>
            {[
              { key: 'osm', label: '🌐 OpenStreetMap (Free)' },
              { key: 'streets', label: '🗺️ Clean Streets' },
              { key: 'satellite', label: '🛰️ Satellite' },
              { key: 'terrain', label: '🧭 Topographic' },
              { key: 'dark', label: '🌙 Dark Mode' },
            ].map((layer) => {
              const isActive = mapLayer === layer.key;
              return (
                <TouchableOpacity
                  key={layer.key}
                  style={[styles.layerChip, isActive && styles.layerChipActive]}
                  onPress={() => {
                    setMapLayer(layer.key as MapLayerType);
                    setShowLayerPicker(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.layerChipText, isActive && styles.layerChipTextActive]}>
                    {layer.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Google Maps Style Bottom Sheet Card (map mode only) */}
      {viewMode === 'map' && selectedPlace && (
        <SlideUpView distance={160} style={styles.bottomCard}>
          <View style={styles.dragHandle} />

          <View style={styles.bottomCardContent}>
            <View style={styles.bottomCardInfo}>
              {/* Dynamic Heritage Thumbnail with Category Badge & Placeholder */}
              <View style={styles.bottomCardThumbWrap}>
                <View style={styles.bottomCardThumbPlaceholder}>
                  <MaterialIcons
                    name={
                      selectedPlace.category === 'museum'
                        ? 'museum'
                        : selectedPlace.category === 'culture'
                        ? 'palette'
                        : selectedPlace.category === 'food'
                        ? 'restaurant'
                        : 'account-balance'
                    }
                    size={28}
                    color={Colors.primary}
                  />
                </View>
                <Image
                  source={{
                    uri: dynamicImageService.getPlaceImage(
                      selectedPlace.name,
                      selectedPlace.category,
                      selectedPlace.imageUrl
                    ),
                  }}
                  style={styles.bottomCardThumb}
                  contentFit="cover"
                  transition={250}
                />
                <View
                  style={[
                    styles.bottomCardCatBadge,
                    { backgroundColor: CATEGORY_COLORS[selectedPlace.category] || Colors.primary },
                  ]}
                >
                  <Text style={styles.bottomCardCatBadgeText}>
                    {(selectedPlace.category || 'site').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={styles.bottomCardTitleRow}>
                  <Text style={styles.bottomCardName} numberOfLines={1}>{getPlaceName(selectedPlace)}</Text>
                  <MaterialIcons name="verified" size={16} color="#38BDF8" />
                </View>
                
                {/* Rating & Reviews */}
                <View style={styles.bottomCardRatingRow}>
                  <Text style={styles.bottomCardRatingStar}>★</Text>
                  <Text style={styles.bottomCardRatingVal}>{selectedPlace.rating || 4.7}</Text>
                  <Text style={styles.bottomCardRatingCount}>(1,420+ reviews)</Text>
                  <Text style={styles.bottomCardDotSep}>•</Text>
                  <Text style={styles.bottomCardCityTag}>{(selectedPlace as any).city || 'Gujarat'}</Text>
                </View>

                {/* Distance & Drive Time Pill */}
                {(() => {
                  const liveKm =
                    selectedPlace.distance ??
                    haversineDistance(
                      location.latitude || 22.3072,
                      location.longitude || 73.1812,
                      selectedPlace.latitude,
                      selectedPlace.longitude
                    );
                  const estMin = Math.round((liveKm / 35) * 60) || 5;
                  return (
                    <View style={styles.distancePillRow}>
                      <View style={styles.distancePill}>
                        <MaterialIcons name="directions-car" size={12} color={Colors.primary} />
                        <Text style={styles.distancePillText}>{liveKm.toFixed(1)} km • ~{estMin} min drive</Text>
                      </View>
                    </View>
                  );
                })()}

                {/* Real-time crowd badge with animated PulseBeacon */}
                {(() => {
                  const crowd = getLiveCrowd(selectedPlace.name);
                  return (
                    <View style={styles.bottomCardCrowdRow}>
                      <PulseBeacon color={crowd.color} size={6} glowSize={12} />
                      <Text style={[styles.bottomCardCrowdText, { color: crowd.color }]}>
                        {crowd.badge} • Est. wait: {crowd.waitTime}
                      </Text>
                    </View>
                  );
                })()}
              </View>
            </View>

            {/* Active Navigation Route Status */}
            {isRouting && routeDestination?.id === selectedPlace.id && (
              <View style={styles.activeRouteBar}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.activeRouteText}>Finding best road route…</Text>
              </View>
            )}
            {!isRouting && routeDestination?.id === selectedPlace.id && routeInfo && (
              <ScalePressable
                style={styles.activeRouteBar}
                onPress={() => setShowStepsSheet(true)}
              >
                <MaterialIcons name="navigation" size={15} color="#38BDF8" />
                <Text style={styles.activeRouteText}>
                  {routeInfo.source === 'osrm' ? 'Live road route' : 'Direct route'} • {routeInfo.distanceKm} km (~{routeInfo.durationMin} min) • Tap for steps
                </Text>
              </ScalePressable>
            )}

            {/* Google Maps Quick Action Buttons */}
            <View style={styles.bottomCardActions}>
              <ScalePressable
                style={styles.directionsPrimaryBtn}
                onPress={() => {
                  const originLat = location.latitude || 22.3072;
                  const originLng = location.longitude || 73.1812;
                  const url = Platform.select({
                    ios: `maps:0,0?q=${selectedPlace.latitude},${selectedPlace.longitude}`,
                    android: `google.navigation:q=${selectedPlace.latitude},${selectedPlace.longitude}`,
                    default: `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${selectedPlace.latitude},${selectedPlace.longitude}&travelmode=driving`,
                  });
                  if (url) Linking.openURL(url).catch(() => {});
                }}
              >
                <MaterialIcons name="directions" size={15} color="#0A0A0F" />
                <Text style={styles.directionsPrimaryBtnText}>Go</Text>
              </ScalePressable>

              {/* Spoken Audio Story */}
              <ScalePressable
                style={[styles.audioStoryBtn, isNarrating && styles.audioStoryBtnActive]}
                onPress={() => toggleAudioStory(selectedPlace)}
              >
                {isNarrating ? (
                  <SoundWaveVisualizer isPlaying={true} color="#0A0A0F" />
                ) : (
                  <MaterialIcons name="volume-up" size={15} color={Colors.primary} />
                )}
                <Text style={[styles.audioStoryBtnText, isNarrating && { color: '#0A0A0F' }]}>
                  {isNarrating ? 'Pause' : 'Listen'}
                </Text>
              </ScalePressable>

              {/* 1-Tap Ride Booking */}
              <ScalePressable
                style={styles.rideBtn}
                onPress={() => setShowRideModal(true)}
              >
                <MaterialIcons name="local-taxi" size={15} color="#F59E0B" />
                <Text style={styles.rideBtnText}>Ride</Text>
              </ScalePressable>

              {/* Route */}
              <ScalePressable
                style={[
                  styles.routeBtn,
                  routeDestination?.id === selectedPlace.id && styles.routeBtnActive,
                ]}
                onPress={() => {
                  if (routeDestination?.id === selectedPlace.id) {
                    setShowStepsSheet(true);
                  } else {
                    handleNavigate(selectedPlace);
                  }
                }}
              >
                <MaterialIcons
                  name="alt-route"
                  size={15}
                  color={routeDestination?.id === selectedPlace.id ? Colors.textInverse : Colors.primary}
                />
                <Text
                  style={[
                    styles.routeBtnText,
                    routeDestination?.id === selectedPlace.id && styles.routeBtnTextActive,
                  ]}
                >
                  {routeDestination?.id === selectedPlace.id ? 'Steps' : 'Route'}
                </Text>
              </ScalePressable>

              {/* Ask AI */}
              <ScalePressable
                style={styles.aiBtn}
                onPress={() => handleAskAI(selectedPlace)}
              >
                <MaterialIcons name="auto-awesome" size={15} color={Colors.textInverse} />
                <Text style={styles.aiBtnText}>AI</Text>
              </ScalePressable>

              {/* Details */}
              <ScalePressable
                style={styles.detailsBtn}
                onPress={() => router.push(`/place/${selectedPlace.id}`)}
              >
                <MaterialIcons name="info" size={15} color={Colors.text} />
              </ScalePressable>

              {/* Share */}
              <ScalePressable
                style={styles.shareBtn}
                onPress={() => {
                  Share.share({
                    title: selectedPlace.name,
                    message: `Explore ${selectedPlace.name} in Gujarat with Yatra Heritage Guide: https://maps.google.com/?q=${selectedPlace.latitude},${selectedPlace.longitude}`,
                  }).catch(() => {});
                }}
              >
                <MaterialIcons name="share" size={15} color={Colors.textSecondary} />
              </ScalePressable>
            </View>
          </View>
          <ScalePressable style={styles.closeBtn} onPress={() => {
            setSelectedPlace(null);
            Speech.stop();
            setIsNarrating(false);
          }}>
            <MaterialIcons name="close" size={17} color={Colors.textMuted} />
          </ScalePressable>
        </SlideUpView>
      )}

      {/* Turn-by-Turn Maneuvers & Mode Switcher Sheet */}
      {showStepsSheet && routeDestination && routeInfo && (
        <TurnByTurnSheet
          destination={routeDestination}
          routeInfo={routeInfo}
          currentMode={travelMode}
          onSelectMode={(newMode) => startNavigationTo(routeDestination, newMode)}
          onClose={() => setShowStepsSheet(false)}
        />
      )}

      {/* 1-Tap Direct Ride Booking Modal (Uber, Rapido, Ola) */}
      {showRideModal && selectedPlace && (
        <MapRideBookingModal
          place={selectedPlace}
          userLocation={location}
          onClose={() => setShowRideModal(false)}
        />
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
    zIndex: 50,
    elevation: 15,
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
    gap: 8,
    zIndex: 15,
  },
  mapActionBtn: {
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
  mapActionBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  mapActionBtnGpsActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  zoomControlPill: {
    width: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    overflow: 'hidden',
    ...Shadows.md,
  },
  zoomPillBtn: {
    width: 42,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomDivider: {
    width: 28,
    height: 1,
    backgroundColor: Colors.border,
  },
  layerPickerTray: {
    position: 'absolute',
    left: Spacing.base,
    right: 70,
    bottom: 180,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 14,
    ...Shadows.lg,
  },
  layerPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  layerPickerTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  layerPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  layerChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  layerChipActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.16)',
    borderColor: Colors.primary,
  },
  layerChipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  layerChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 16,
    left: Spacing.base,
    right: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: 22,
    paddingHorizontal: Spacing.base,
    paddingTop: 8,
    paddingBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.lg,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignSelf: 'center',
    marginBottom: 8,
  },
  bottomCardContent: {
    gap: Spacing.sm,
  },
  bottomCardInfo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  bottomCardThumbWrap: {
    position: 'relative',
    width: 88,
    height: 88,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  bottomCardThumbPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceHighlight,
  },
  bottomCardThumb: {
    width: '100%',
    height: '100%',
  },
  bottomCardCatBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCardCatBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bottomCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  bottomCardName: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    flexShrink: 1,
  },
  bottomCardRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  bottomCardRatingStar: {
    fontSize: 12,
    color: '#FBBF24',
  },
  bottomCardRatingVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  bottomCardRatingCount: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bottomCardDotSep: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  bottomCardCityTag: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  distancePillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.25)',
  },
  distancePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  activeRouteBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  activeRouteText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: '#38BDF8',
  },
  bottomCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  directionsPrimaryBtn: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#38BDF8',
    paddingVertical: 9,
    borderRadius: 12,
  },
  directionsPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A0A0F',
  },
  audioStoryBtn: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
  },
  audioStoryBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  audioStoryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  rideBtn: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  rideBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  routeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceHighlight,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  routeBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  routeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  routeBtnTextActive: {
    color: Colors.textInverse,
  },
  aiBtn: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: Colors.accent,
    paddingVertical: 9,
    borderRadius: 12,
  },
  aiBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  detailsBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchSuggestionsDropdown: {
    marginTop: 8,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 280,
    overflow: 'hidden',
    zIndex: 9999,
    ...Shadows.lg,
    elevation: 25,
  },
  searchSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  suggestionThumb: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: Colors.surfaceHighlight,
  },
  suggestionTextCol: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  suggestionSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  suggestionGoBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(23, 23, 23, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
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
