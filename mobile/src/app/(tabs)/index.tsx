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
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const response: any = await placesApi.getNearby(
        location.latitude,
        location.longitude,
        50,
        selectedCategory || undefined
      );
      if (response?.data) {
        setPlaces(response.data);
      }
    } catch (error) {
      console.log('Using demo data — backend not connected');
      // Provide demo data so the app works without backend
      setPlaces(DEMO_PLACES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!location.isLoading) {
      fetchPlaces();
    }
  }, [location.isLoading, selectedCategory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlaces();
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
          <View>
            <Text style={styles.greeting}>{greeting()} 👋</Text>
            <Text style={styles.userName}>{name}</Text>
          </View>
          <TouchableOpacity style={styles.locationBadge}>
            <MaterialIcons name="place" size={16} color={Colors.primary} />
            <Text style={styles.locationText}>
              {location.isLoading ? t('common.locating') : `${location.city}, ${location.region}`}
            </Text>
          </TouchableOpacity>
        </View>

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
          {isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>{t('home.discoveringHeritage')}</Text>
            </View>
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

        {/* All Places List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.allNearbyPlaces')}</Text>
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onPress={handlePlacePress}
              variant="vertical"
              isFavorite={favorites.includes(place.id)}
              onFavoriteToggle={toggleFavorite}
            />
          ))}
        </View>
      </ScrollView>
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lukshmi_Vilas_Palace.jpg/1280px-Lukshmi_Vilas_Palace.jpg',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Baroda_Museum.jpg/1280px-Baroda_Museum.jpg',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Eme_temple_baroda.jpg/1280px-Eme_temple_baroda.jpg',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sursagar_Talav.jpg/1280px-Sursagar_Talav.jpg',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Sayaji_Baug_Baroda.jpg/1280px-Sayaji_Baug_Baroda.jpg',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Champaner.jpg/1280px-Champaner.jpg',
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
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
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
    marginTop: 8,
  },
  locationText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    fontWeight: '500',
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
});
