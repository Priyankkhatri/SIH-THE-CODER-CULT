import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useUserStore, usePlacesStore, useChatStore } from '../../stores';
import { useTranslation } from '../../hooks/useTranslation';
import type { Place } from '../../stores';
import { placesApi } from '../../services/api';
import { useLocation } from '../../hooks/useLocation';
import { PlaceCard } from '../../components/PlaceCard';
import { CategoryFilter } from '../../components/CategoryFilter';
import { WeatherCrowdBar } from '../../components/WeatherCrowdBar';
import { SafetySOSModal } from '../../components/SafetySOSModal';
import {
  PlaceCardHorizontalSkeleton,
  PlaceCardVerticalSkeleton,
  LocationBadgeSkeleton,
} from '../../components/Skeleton';

const QUICK_ACTIONS = [
  { key: 'explore', label: 'Explore Map', icon: 'map', color: Colors.accent },
  { key: 'ai', label: 'Ask AI', icon: 'auto-awesome', color: Colors.primary },
  { key: 'camera', label: 'Identify', icon: 'camera-alt', color: Colors.secondary },
  { key: 'plan', label: 'Plan Trip', icon: 'route', color: Colors.success },
];

export default function HomeScreen() {
  const router = useRouter();
  const { name, language } = useUserStore();
  const { t } = useTranslation();
  const { places, setPlaces, favorites, toggleFavorite, isLoading, setLoading } = usePlacesStore();
  const { setContext } = useChatStore();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(places.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [sosVisible, setSosVisible] = useState(false);

  // Instant render if places already present in store
  const isScreenLoading = (places.length === 0 && (initialLoading || isLoading)) || refreshing;

  const latKey = (location.latitude || 22.30).toFixed(2);
  const lonKey = (location.longitude || 73.18).toFixed(2);

  const fetchPlaces = async () => {
    try {
      const response: any = await placesApi.getNearby(
        location.latitude || 22.3072,
        location.longitude || 73.1812,
        50,
        selectedCategory || undefined
      );
      const list = Array.isArray(response) ? response : (response?.data || []);
      if (list && list.length > 0) {
        setPlaces(list);
      } else {
        const allRes: any = await placesApi.getAll(selectedCategory || undefined);
        const allList = Array.isArray(allRes) ? allRes : (allRes?.data || []);
        if (allList.length > 0) {
          setPlaces(allList);
        }
      }
    } catch (error) {
      console.warn('[HomeScreen] Live fetch notice, keeping cached places:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (places.length === 0) {
        setInitialLoading(true);
      }
      const start = Date.now();
      await fetchPlaces();
      const elapsed = Date.now() - start;
      if (places.length === 0 && elapsed < 400) {
        await new Promise((resolve) => setTimeout(resolve, 400 - elapsed));
      }
      if (mounted) {
        setInitialLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [selectedCategory, latKey, lonKey]);

  const onRefresh = async () => {
    setRefreshing(true);
    const start = Date.now();
    await fetchPlaces();
    const elapsed = Date.now() - start;
    if (elapsed < 650) {
      await new Promise((resolve) => setTimeout(resolve, 650 - elapsed));
    }
    setRefreshing(false);
  };

  const handleQuickAction = (key: string) => {
    switch (key) {
      case 'explore':
        router.push('/(tabs)/explore');
        break;
      case 'ai':
        setContext(null, null);
        router.push('/(tabs)/ai');
        break;
      case 'camera':
        router.push('/camera');
        break;
      case 'plan':
        router.push('/(tabs)/plan');
        break;
    }
  };

  const handlePlacePress = (place: Place) => {
    router.push(`/place/${place.id}`);
  };

  const filteredPlaces = selectedCategory
    ? places.filter((p) => p.category === selectedCategory)
    : places;

  const greeting = () => {
    const hour = new Date().getHours();
    if (language === 'hi') {
      if (hour < 12) return 'शुभ प्रभात';
      if (hour < 17) return 'शुभ दोपहर';
      return 'शुभ संध्या';
    }
    if (language === 'gu') {
      if (hour < 12) return 'શુભ સવાર';
      if (hour < 17) return 'શુભ બપોર';
      return 'શુભ સાંજ';
    }
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActionsList = [
    { key: 'explore', label: t('home.exploreMap'), icon: 'map', color: Colors.accent },
    { key: 'ai', label: t('home.askAiGuide'), icon: 'auto-awesome', color: Colors.primary },
    { key: 'camera', label: t('home.identifyArtifact'), icon: 'camera-alt', color: Colors.secondary },
    { key: 'plan', label: t('home.planHeritageTour'), icon: 'route', color: Colors.success },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../../assets/images/app-logo.jpeg')}
              style={styles.headerLogo}
              resizeMode="cover"
            />
            <View>
              <Text style={styles.greeting}>{greeting()} 👋</Text>
              <Text style={styles.userName}>{name}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {isScreenLoading ? (
              <LocationBadgeSkeleton />
            ) : (
              <TouchableOpacity style={styles.locationBadge}>
                <MaterialIcons name="place" size={16} color={Colors.primary} />
                <Text style={styles.locationText}>
                  {`${location.city}, ${location.region}`}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.sosBadge}
              onPress={() => setSosVisible(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="emergency" size={14} color="#FFFFFF" />
              <Text style={styles.sosBadgeText}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Weather & Crowd Density Radar */}
        <WeatherCrowdBar
          latitude={location.latitude || 22.3072}
          longitude={location.longitude || 73.1812}
          isLoading={isScreenLoading}
        />

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
          <View style={styles.quickActionsGrid}>
            {quickActionsList.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action.key)}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <MaterialIcons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nearby Heritage Sites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.nearbyHeritageSites')}</Text>
            <Text style={styles.sectionCount}>{filteredPlaces.length} {t('home.placesCount')}</Text>
          </View>

          {/* Category Filter */}
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

          {/* Horizontal Place Cards */}
          {isScreenLoading ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing.base }}
            >
              <PlaceCardHorizontalSkeleton />
              <PlaceCardHorizontalSkeleton />
              <PlaceCardHorizontalSkeleton />
              <PlaceCardHorizontalSkeleton />
            </ScrollView>
          ) : filteredPlaces.length > 0 ? (
            <FlatList
              data={filteredPlaces.slice(0, 8)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: Spacing.base }}
              renderItem={({ item }) => (
                <PlaceCard place={item} onPress={handlePlacePress} variant="horizontal" />
              )}
            />
          ) : (
            <View style={styles.emptyWrap}>
              <MaterialIcons name="search-off" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>{t('home.noPlacesFound')}</Text>
            </View>
          )}
        </View>

        {/* Curated Heritage Showcase */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.allNearbyPlaces')}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAllText}>View Map →</Text>
            </TouchableOpacity>
          </View>
          {isScreenLoading ? (
            <View style={{ paddingHorizontal: Spacing.base }}>
              <PlaceCardVerticalSkeleton />
              <PlaceCardVerticalSkeleton />
              <PlaceCardVerticalSkeleton />
              <PlaceCardVerticalSkeleton />
            </View>
          ) : (
            filteredPlaces.slice(0, 15).map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onPress={handlePlacePress}
                variant="vertical"
                isFavorite={favorites.includes(place.id)}
                onFavoriteToggle={toggleFavorite}
              />
            ))
          )}

          {filteredPlaces.length > 15 && (
            <TouchableOpacity
              style={styles.exploreMoreBtn}
              onPress={() => router.push('/(tabs)/explore')}
              activeOpacity={0.8}
            >
              <MaterialIcons name="explore" size={20} color={Colors.primary} />
              <Text style={styles.exploreMoreText}>
                Explore All {filteredPlaces.length} Heritage Sites on Live Radar Map →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Geo-Fenced Safety & SOS Emergency Modal */}
      <SafetySOSModal
        visible={sosVisible}
        onClose={() => setSosVisible(false)}
        latitude={location.latitude || 22.3072}
        longitude={location.longitude || 73.1812}
        currentLocationName={`${location.city}, ${location.region}`}
      />
    </View>
  );
}

// Demo data for when backend is not connected
const DEMO_PLACES: Place[] = [
  {
    id: 'p1-laxmi-vilas',
    name: 'Laxmi Vilas Palace',
    nameHi: 'लक्ष्मी विलास पैलेस',
    nameGu: 'લક્ષ્મી વિલાસ પેલેસ',
    latitude: 22.2932,
    longitude: 73.1903,
    category: 'heritage',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
    openingHours: '9:30 AM - 5:00 PM',
    rating: 4.6,
    shortDescription: 'Grand royal palace of the Gaekwad dynasty, four times the size of Buckingham Palace.',
    distance: 2.3,
    heritageRecord: { shortStory: 'Built in 1890 by Maharaja Sayajirao III...', period: '1878-1890' },
  },
  {
    id: 'p2-baroda-museum',
    name: 'Baroda Museum & Picture Gallery',
    latitude: 22.3103,
    longitude: 73.1879,
    category: 'museum',
    imageUrl: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=1200&q=80',
    openingHours: '10:30 AM - 5:30 PM',
    rating: 4.3,
    shortDescription: 'One of the oldest museums in Gujarat with Mughal miniatures and a blue whale skeleton.',
    distance: 3.1,
    heritageRecord: { shortStory: 'Established in 1894...', period: '1894' },
  },
  {
    id: 'p4-eme-temple',
    name: 'EME Temple',
    latitude: 22.3149,
    longitude: 73.1729,
    category: 'heritage',
    imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&q=80',
    openingHours: '6:00 AM - 9:00 PM',
    rating: 4.4,
    shortDescription: 'Unique multi-faith temple built by the Indian Army with an aluminum dome.',
    distance: 4.5,
  },
  {
    id: 'p5-sursagar',
    name: 'Sursagar Lake',
    latitude: 22.3009,
    longitude: 73.1941,
    category: 'culture',
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
    openingHours: 'Open 24 hours',
    rating: 4.1,
    shortDescription: 'Historic lake in the heart of Vadodara with a towering Shiva statue.',
    distance: 1.8,
  },
  {
    id: 'p6-sayaji-baug',
    name: 'Sayaji Baug (Kamati Baug)',
    latitude: 22.3108,
    longitude: 73.1892,
    category: 'culture',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80',
    openingHours: '5:30 AM - 10:30 PM',
    rating: 4.5,
    shortDescription: 'Sprawling 113-acre garden commissioned by Maharaja Sayajirao III.',
    distance: 3.0,
  },
  {
    id: 'p11-champaner',
    name: 'Champaner-Pavagadh',
    latitude: 22.4860,
    longitude: 73.5339,
    category: 'heritage',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
    openingHours: '8:30 AM - 5:00 PM',
    rating: 4.7,
    shortDescription: 'UNESCO World Heritage Site with remarkable Hindu-Muslim architecture.',
    distance: 38.4,
    heritageRecord: { shortStory: 'A 2000-year-old UNESCO site...', period: '10th-16th century' },
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  greeting: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userName: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '800',
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  sosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF5350',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  sosBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  quickActionsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.md,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  sectionCount: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  loadingWrap: {
    padding: Spacing['3xl'],
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  emptyWrap: {
    padding: Spacing['3xl'],
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
  },
  seeAllText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: '700',
  },
  exploreMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.35)',
    ...Shadows.sm,
  },
  exploreMoreText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
});
