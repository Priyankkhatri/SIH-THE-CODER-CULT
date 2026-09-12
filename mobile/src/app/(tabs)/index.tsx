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
  TextInput,
  Dimensions,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
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
import { useSpeech } from '../../hooks/useSpeech';
import { ALL_SEED_PLACES } from '../../utils/seedPlaces';
import { dynamicImageService } from '../../services/dynamicImageService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPOTLIGHT_CARD_WIDTH = Math.min(SCREEN_WIDTH - 48, 340);

const SPOTLIGHT_MONUMENTS = [
  {
    id: 'IND-HER-26',
    title: 'Kumbhalgarh Fort',
    subtitle: 'The Great Wall of India (36 km Continuous Ramparts)',
    location: 'Rajsamand, Rajasthan',
    era: '15th Century (Maharana Kumbha)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kumbhalgarh_055.jpg/500px-Kumbhalgarh_055.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    audioNarration:
      'Perched 3,600 feet high in the Aravalli hills of Mewar, Kumbhalgarh Fort is enclosed by a continuous 36-kilometer stone wall, recognized as the second-longest wall on Earth after the Great Wall of China.',
    aiPrompt: 'Tell me the history of Kumbhalgarh Fort and how Maharana Kumbha engineered the 36 km Great Wall of India.',
    badge: 'Great Wall of India',
  },
  {
    id: 'IND-HER-11',
    title: 'Rani Ki Vav',
    subtitle: 'UNESCO World Heritage Subterranean Stepwell',
    location: 'Patan, Gujarat',
    era: '11th Century CE (Solanki Dynasty)',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Rani_ki_vav_02.jpg/500px-Rani_ki_vav_02.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    audioNarration:
      'Rani Ki Vav was built by Queen Udayamati in memory of King Bhima the First. Designed as an inverted temple honoring subterranean water, it features seven intricate tiers with over 500 principal sculptures of Lord Vishnu.',
    aiPrompt: 'Tell me the secret architectural geometry and legend behind Rani Ki Vav in Patan.',
    badge: 'UNESCO Wonder',
  },
  {
    id: 'IND-HER-31',
    title: 'Sun Temple Modhera',
    subtitle: 'Solar Equinox Astronomical Marvel & Surya Kund',
    location: 'Mehsana, Gujarat',
    era: '1026 CE (King Bhimdev I)',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Surya_mandhir.jpg/500px-Surya_mandhir.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    audioNarration:
      'Sun Temple Modhera is designed with breathtaking precision so the first rays of the rising sun illuminate the sanctum on equinox days. The complex features the majestic Surya Kund with 108 miniature shrines.',
    aiPrompt: 'Explain how the solar alignment works at Modhera Sun Temple during the equinox.',
    badge: 'Astronomical Gem',
  },
  {
    id: 'IND-GJ-06',
    title: 'Statue of Unity',
    subtitle: "World's Tallest Monument (182m)",
    location: 'Kevadia, Gujarat',
    era: 'Modern Marvel (2018)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Statue_of_Unity.jpg/500px-Statue_of_Unity.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    audioNarration:
      'Standing at 182 meters tall on the Narmada River, the Statue of Unity honors Sardar Vallabhbhai Patel, the Iron Man who unified 562 princely states into the Republic of India.',
    aiPrompt: 'What is the structural engineering marvel behind the 182m Statue of Unity and the best visiting tips?',
    badge: 'Global Icon',
  },
  {
    id: 'IND-GJ-08',
    title: 'Somnath Mahadev',
    subtitle: 'First of the Twelve Sacred Jyotirlingas',
    location: 'Prabhas Patan, Gujarat',
    era: 'Ancient (Rebuilt 1951)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Somanath_mandir_%28cropped%29.jpg/500px-Somanath_mandir_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    audioNarration:
      'Standing at the shore of the Arabian Sea, Somnath is known as the Eternal Shrine. The arrow pillar, Baan Stambh, indicates an unobstructed sea route directly from Somnath to Antarctica.',
    aiPrompt: 'Tell me about the mysterious Baan Stambh arrow pillar at Somnath and its connection to the South Pole.',
    badge: 'Eternal Shrine',
  },
  {
    id: 'IND-HER-13',
    title: 'Dholavira: Indus Metropolis',
    subtitle: 'UNESCO Bronze Age Urban Citadel & Reservoirs',
    location: 'Khadir Bet, Kutch',
    era: '3000 BCE - 1500 BCE',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/DHOLAVIRA_SITE_%2824%29.jpg/500px-DHOLAVIRA_SITE_%2824%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    audioNarration:
      'Dholavira is one of the most prominent archaeological sites of the Harappan civilization, famous for its sophisticated water harvesting system, grand stadium, and unique sign board inscriptions.',
    aiPrompt: 'How did the ancient engineers of Dholavira master desert water harvesting 5000 years ago?',
    badge: '5000 Yr Civilisation',
  },
  {
    id: 'IND-HER-27',
    title: 'Chittorgarh Fort',
    subtitle: "India's Largest Fort Citadel & Tower of Victory",
    location: 'Chittorgarh, Mewar, Rajasthan',
    era: '7th-15th Century (Rana Kumbha)',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Chittorgarh_fort.JPG/500px-Chittorgarh_fort.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
    audioNarration:
      'Spanning nearly 700 acres atop a high cliff, Chittorgarh Fort is the grandest fortress in India, famous for the 9-storey Vijay Stambha, Rani Padmini Palace, and timeless Rajput chivalry.',
    aiPrompt: 'Describe the architecture of Vijay Stambha and the history of Chittorgarh Fort in Mewar.',
    badge: 'Epic Citadel',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { name, language } = useUserStore();
  const { t } = useTranslation();
  const { places, setPlaces, favorites, toggleFavorite, isLoading } = usePlacesStore();
  const { setContext } = useChatStore();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialLoading, setInitialLoading] = useState(places.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [sosVisible, setSosVisible] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  const { speak, stop, isSpeaking } = useSpeech();

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

  const handleToggleAudio = (id: string, text: string) => {
    if (isSpeaking && activeAudioId === id) {
      stop();
      setActiveAudioId(null);
    } else {
      setActiveAudioId(id);
      speak(text, language);
    }
  };

  const handleSpotlightAskAi = (item: (typeof SPOTLIGHT_MONUMENTS)[0]) => {
    setContext(item.id, item.title);
    router.push({
      pathname: '/(tabs)/ai',
      params: {
        autoAsk: item.aiPrompt,
        placeId: item.id,
        placeName: item.title,
        t: String(Date.now()),
      },
    });
  };

  // Merge loaded places with ALL_SEED_PLACES to ensure all 155+ sites are always searchable
  const allCatalogPlaces = React.useMemo(() => {
    if (places.length >= ALL_SEED_PLACES.length) return places;
    const map = new Map<string, Place>();
    for (const p of ALL_SEED_PLACES) map.set(p.id, p);
    for (const p of places) map.set(p.id, p);
    return Array.from(map.values());
  }, [places]);

  const filteredPlaces = allCatalogPlaces.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchesName =
      p.name?.toLowerCase().includes(q) ||
      (p as any).nameHi?.toLowerCase().includes(q) ||
      (p as any).nameGu?.toLowerCase().includes(q);
    const matchesDesc = (p.shortDescription || '').toLowerCase().includes(q);
    const matchesCity =
      (p as any).city?.toLowerCase().includes(q) ||
      (p as any).state?.toLowerCase().includes(q);
    const matchesTags =
      Array.isArray((p as any).tags) &&
      (p as any).tags.some((t: string) => t.toLowerCase().includes(q));
    return matchesName || matchesDesc || matchesCity || matchesTags;
  });

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
        keyboardShouldPersistTaps="handled"
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
              <TouchableOpacity style={styles.locationBadge} onPress={() => router.push('/(tabs)/explore')}>
                <MaterialIcons name="place" size={16} color={Colors.primary} />
                <Text style={styles.locationText} numberOfLines={1}>
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

        {/* Live Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={22} color={Colors.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search 155+ heritage sites, temples, palaces..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="cancel" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Live Search Results Section */}
        {searchQuery.trim().length > 0 && (
          <View style={styles.searchResultsSection}>
            <View style={styles.searchActiveBadge}>
              <MaterialIcons name="filter-list" size={16} color={Colors.primary} />
              <Text style={styles.searchActiveText}>
                Found {filteredPlaces.length} site{filteredPlaces.length === 1 ? '' : 's'} matching "{searchQuery}"
              </Text>
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchText}>Clear</Text>
              </TouchableOpacity>
            </View>

            {filteredPlaces.length === 0 ? (
              <View style={styles.searchEmptyContainer}>
                <MaterialIcons name="search-off" size={44} color={Colors.textMuted} />
                <Text style={styles.searchEmptyTitle}>No monuments found</Text>
                <Text style={styles.searchEmptySub}>
                  Try searching for forts, stepwells, temples, or cities like 'Patan', 'Somnath', or 'Kumbhalgarh'.
                </Text>
              </View>
            ) : (
              <View style={styles.searchResultsList}>
                {filteredPlaces.slice(0, 15).map((place) => {
                  const placeImg = dynamicImageService.getPlaceImage(
                    place.name,
                    place.category,
                    place.imageUrl
                  );
                  return (
                    <TouchableOpacity
                      key={place.id}
                      style={styles.searchResultCard}
                      onPress={() => router.push(`/place/${place.id}`)}
                      activeOpacity={0.75}
                    >
                      <ExpoImage
                        source={{ uri: placeImg }}
                        style={styles.searchResultThumb}
                        contentFit="cover"
                        transition={200}
                      />
                      <View style={styles.searchResultInfo}>
                        <View style={styles.searchResultHeaderRow}>
                          <Text style={styles.searchResultName} numberOfLines={1}>
                            {place.name}
                          </Text>
                          <View style={styles.searchResultCatBadge}>
                            <Text style={styles.searchResultCatText}>
                              {(place.category || 'site').toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.searchResultDesc} numberOfLines={2}>
                          {place.shortDescription || 'Historic Indian architectural wonder.'}
                        </Text>
                        <View style={styles.searchResultFooter}>
                          <Text style={styles.searchResultMeta}>
                            📍 {(place as any).city || 'Gujarat'}
                          </Text>
                          <TouchableOpacity
                            style={styles.searchResultRouteBtn}
                            onPress={(e) => {
                              e.stopPropagation();
                              router.push({
                                pathname: '/(tabs)/explore',
                                params: {
                                  destinationId: place.id,
                                  destinationName: place.name,
                                  routeTo: 'true',
                                },
                              });
                            }}
                          >
                            <MaterialIcons name="directions" size={14} color="#D4AF37" />
                            <Text style={styles.searchResultRouteBtnText}>Route</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

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

        {/* Spotlight Hero Carousel (Visible when not actively searching) */}
        {!searchQuery && (
          <View style={styles.spotlightSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>🌟 Must-Visit Wonders</Text>
                <Text style={styles.sectionSubtitle}>Iconic civilisations with AI voice narration</Text>
              </View>
              <View style={styles.audioHintPill}>
                <MaterialIcons name="volume-up" size={14} color={Colors.primary} />
                <Text style={styles.audioHintText}>Audio Guide</Text>
              </View>
            </View>

            <FlatList
              data={SPOTLIGHT_MONUMENTS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 14, paddingTop: 4, paddingBottom: 10 }}
              renderItem={({ item }) => {
                const isPlayingThis = isSpeaking && activeAudioId === item.id;
                return (
                  <View style={styles.spotlightCard}>
                    <ExpoImage
                      source={{ uri: item.imageUrl }}
                      style={styles.spotlightImage}
                      contentFit="cover"
                      transition={300}
                    />
                    <View style={styles.spotlightScrim} />

                    {/* Top Badges */}
                    <View style={styles.spotlightTopRow}>
                      <View style={styles.spotlightBadge}>
                        <MaterialIcons name="verified" size={12} color="#D4AF37" />
                        <Text style={styles.spotlightBadgeText}>{item.badge}</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.audioPlayBtn, isPlayingThis && styles.audioPlayBtnActive]}
                        onPress={() => handleToggleAudio(item.id, item.audioNarration)}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons
                          name={isPlayingThis ? 'stop' : 'volume-up'}
                          size={16}
                          color={isPlayingThis ? '#FFFFFF' : '#D4AF37'}
                        />
                        <Text style={[styles.audioPlayBtnText, isPlayingThis && styles.audioPlayBtnTextActive]}>
                          {isPlayingThis ? 'Stop' : 'Audio'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Bottom Content */}
                    <View style={styles.spotlightContent}>
                      <Text style={styles.spotlightEra}>{item.era}</Text>
                      <Text style={styles.spotlightTitle}>{item.title}</Text>
                      <View style={styles.spotlightLocRow}>
                        <MaterialIcons name="location-on" size={14} color="rgba(255,255,255,0.85)" />
                        <Text style={styles.spotlightLocText}>{item.location}</Text>
                      </View>
                      <Text style={styles.spotlightSubtitle} numberOfLines={2}>
                        {item.subtitle}
                      </Text>

                      <View style={styles.spotlightActions}>
                        <TouchableOpacity
                          style={styles.spotlightAiBtn}
                          onPress={() => handleSpotlightAskAi(item)}
                          activeOpacity={0.85}
                        >
                          <MaterialIcons name="auto-awesome" size={14} color="#FFFFFF" />
                          <Text style={styles.spotlightAiBtnText}>Ask AI Guide</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.spotlightViewBtn}
                          onPress={() => {
                            const match = allCatalogPlaces.find(
                              (p) =>
                                p.name.toLowerCase().includes(item.title.toLowerCase()) ||
                                item.title.toLowerCase().includes(p.name.toLowerCase())
                            );
                            router.push({
                              pathname: '/(tabs)/explore',
                              params: {
                                destinationId: match?.id || item.id,
                                destinationName: item.title,
                                routeTo: 'true',
                              },
                            });
                          }}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.spotlightViewBtnText}>Explore →</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        )}

        {/* Cultural Mystery Trivia Card (Visible when not actively searching) */}
        {!searchQuery && (
          <View style={styles.triviaCardContainer}>
            <View style={styles.triviaCard}>
              <View style={styles.triviaHeader}>
                <View style={styles.triviaIconWrap}>
                  <MaterialIcons name="psychology" size={24} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.triviaBadge}>CULTURAL MYSTERY</Text>
                  <Text style={styles.triviaTitle}>The Inverted Sanctuaries of Gujarat</Text>
                </View>
              </View>
              <Text style={styles.triviaBody}>
                Unlike traditional Indian temples that rise toward the heavens, Gujarat's ancient stepwells (Vavs) descend deep into the earth. They inverted sacred geometry to sanctify groundwater as a subterranean sanctuary for desert travelers!
              </Text>
              <TouchableOpacity
                style={styles.triviaActionBtn}
                onPress={() => {
                  setContext(null, 'Stepwell Architecture');
                  router.push({
                    pathname: '/(tabs)/ai',
                    params: {
                      autoAsk: 'Explain the sacred geometry, folklore, and engineering of stepwells (Vavs) in Gujarat.',
                    },
                  });
                }}
                activeOpacity={0.8}
              >
                <MaterialIcons name="auto-awesome" size={16} color={Colors.primary} />
                <Text style={styles.triviaActionText}>Ask AI to Unravel This Mystery →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Nearby Heritage Sites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>{t('home.nearbyHeritageSites')}</Text>
              <Text style={styles.sectionSubtitle}>Discover monuments near your GPS coordinates</Text>
            </View>
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
              {searchQuery.length > 0 && (
                <TouchableOpacity style={styles.emptyClearBtn} onPress={() => setSearchQuery('')}>
                  <Text style={styles.emptyClearText}>Clear search filter</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Living Crafts & Artisans of Gujarat Banner */}
        {!searchQuery && (
          <View style={styles.craftsBannerContainer}>
            <View style={styles.craftsBanner}>
              <View style={styles.craftsContent}>
                <View style={styles.craftsBadge}>
                  <MaterialIcons name="palette" size={14} color="#FFFFFF" />
                  <Text style={styles.craftsBadgeText}>LIVING CRAFTS</Text>
                </View>
                <Text style={styles.craftsTitle}>Patan Patola & Rogan Art</Text>
                <Text style={styles.craftsDesc}>
                  Centuries-old double ikat weaving and castor seed art preserved by master craftsmen of Gujarat.
                </Text>
                <TouchableOpacity
                  style={styles.craftsBtn}
                  onPress={() => {
                    setContext(null, 'Artisans & Handicrafts');
                    router.push({
                      pathname: '/(tabs)/ai',
                      params: {
                        autoAsk: 'Tell me about the master artisans of Patola Silk in Patan and Rogan Art in Nirona, Kutch.',
                      },
                    });
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.craftsBtnText}>Discover Master Crafts →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Curated Heritage Showcase */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>{t('home.allNearbyPlaces')}</Text>
              <Text style={styles.sectionSubtitle}>Curated monuments, palaces & sacred sites</Text>
            </View>
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
    paddingTop: 56,
    paddingBottom: Spacing.md,
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
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userName: {
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 140,
  },
  locationText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text,
    fontWeight: '600',
  },
  sosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF5350',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  sosBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  searchSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    padding: 0,
  },
  searchResultsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  searchActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(212, 169, 71, 0.12)',
    marginBottom: Spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.3)',
  },
  searchActiveText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.primary,
    flex: 1,
    marginLeft: 6,
  },
  clearSearchText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  searchResultsList: {
    gap: 12,
  },
  searchResultCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  searchResultThumb: {
    width: 78,
    height: 78,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceHighlight,
  },
  searchResultInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  searchResultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  searchResultName: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  searchResultCatBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  searchResultCatText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D4AF37',
  },
  searchResultDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginVertical: 3,
  },
  searchResultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchResultMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  searchResultRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  searchResultRouteBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: '#D4AF37',
  },
  searchEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 20,
  },
  searchEmptyTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  searchEmptySub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  quickActionsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    marginTop: Spacing.sm,
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
  spotlightSection: {
    marginBottom: Spacing['2xl'],
  },
  spotlightCard: {
    width: SPOTLIGHT_CARD_WIDTH,
    height: 250,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    backgroundColor: '#1E1E2E',
    position: 'relative',
    ...Shadows.md,
  },
  spotlightImage: {
    ...StyleSheet.absoluteFill,
  },
  spotlightScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 10, 5, 0.55)',
  },
  spotlightTopRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(20, 15, 10, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  spotlightBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 0.3,
  },
  audioPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(20, 15, 10, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  audioPlayBtnActive: {
    backgroundColor: '#E53935',
    borderColor: '#EF5350',
  },
  audioPlayBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D4AF37',
  },
  audioPlayBtnTextActive: {
    color: '#FFFFFF',
  },
  spotlightContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    zIndex: 2,
  },
  spotlightEra: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D4AF37',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  spotlightTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  spotlightLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  spotlightLocText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  spotlightSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 3,
  },
  spotlightActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  spotlightAiBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
  },
  spotlightAiBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  spotlightViewBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  spotlightViewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  audioHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 169, 71, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  audioHintText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  triviaCardContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  triviaCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    ...Shadows.sm,
  },
  triviaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  triviaIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  triviaBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  triviaTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  triviaBody: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  triviaActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 169, 71, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
  },
  triviaActionText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  craftsBannerContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  craftsBanner: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    backgroundColor: '#3E2723',
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  craftsContent: {
    gap: 6,
  },
  craftsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: 4,
  },
  craftsBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  craftsTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '800',
    color: '#FFF8E7',
  },
  craftsDesc: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255, 248, 231, 0.8)',
    lineHeight: 18,
    marginBottom: 6,
  },
  craftsBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#D4AF37',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
  },
  craftsBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    color: '#2C1810',
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionCount: {
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
  emptyClearBtn: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(212, 169, 71, 0.15)',
  },
  emptyClearText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
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
    marginHorizontal: Spacing.xl,
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
