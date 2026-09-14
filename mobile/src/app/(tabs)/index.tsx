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
import { haversineDistance } from '../../utils/routeService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPOTLIGHT_CARD_WIDTH = Math.min(SCREEN_WIDTH - 48, 340);

const ICONIC_SPOTLIGHT_IDS = [
  'IND-HER-26', // Kumbhalgarh Fort
  'IND-HER-11', // Rani Ki Vav
  'IND-HER-31', // Sun Temple Modhera
  'IND-GJ-SOU', // Statue of Unity
  'IND-GJ-08',  // Somnath Mahadev
  'IND-HER-13', // Dholavira: Indus Metropolis
  'IND-HER-27', // Chittorgarh Fort
  'IND-HER-01', // Taj Mahal
  'IND-HER-10', // Hampi
  'IND-HER-02', // Qutub Minar
];

// Spotlight card with self-contained async Wikipedia image state.
// The sync getPlaceImage() provides the instant fallback; fetchPlaceImageAsync()
// then resolves the real Wikipedia/Wikimedia image and updates the displayed photo.
interface SpotlightItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  era: string;
  imageUrl: string;
  audioNarration: string;
  aiPrompt: string;
  badge: string;
  place: Place;
}

interface SpotlightCardProps {
  item: SpotlightItem;
  isPlayingThis: boolean;
  onPress: () => void;
  onAudioToggle: () => void;
  onAskAi: () => void;
  onExplore: () => void;
  cardWidth: number;
  styles: any;
}

function SpotlightCard({
  item,
  isPlayingThis,
  onPress,
  onAudioToggle,
  onAskAi,
  onExplore,
  cardWidth,
  styles,
}: SpotlightCardProps) {
  const resolvedInitial = dynamicImageService.getPlaceImage(
    item.place?.name || item.title,
    item.place?.category,
    item.place?.imageUrl || item.imageUrl
  );
  const [imgUrl, setImgUrl] = useState<string>(resolvedInitial);

  useEffect(() => {
    let cancelled = false;
    const resolved = dynamicImageService.getPlaceImage(
      item.place?.name || item.title,
      item.place?.category,
      item.place?.imageUrl || item.imageUrl
    );
    setImgUrl(resolved);

    // If already verified Wikimedia/Wikipedia, never overwrite
    if (resolved && (resolved.includes('wikimedia.org') || resolved.includes('wikipedia.org'))) {
      return;
    }

    const searchName = item.place?.name || item.title;
    dynamicImageService.fetchPlaceImageAsync(searchName).then((wikiUrl) => {
      if (!cancelled && wikiUrl) setImgUrl(wikiUrl);
    }).catch(() => {});

    return () => { cancelled = true; };
  }, [item.id, item.imageUrl, item.place?.name, item.place?.imageUrl]);

  return (
    <TouchableOpacity
      style={[styles.spotlightCard, { width: cardWidth }]}
      activeOpacity={0.95}
      onPress={onPress}
    >
      <ExpoImage
        source={{
          uri: imgUrl,
          headers: {
            'User-Agent': 'YatraHeritageCompanion/2.0 (https://github.com/Priyankkhatri/SIH-THE-CODER-CULT; contact@yatra.in)',
          },
        }}
        style={styles.spotlightImage}
        contentFit="cover"
        transition={400}
        onError={() => {
          if (item.place?.imageUrl && item.place.imageUrl !== imgUrl) {
            setImgUrl(item.place.imageUrl);
          } else {
            const fallback = dynamicImageService.getArchitecturalFallback(item.place?.name || item.title, item.place?.category, 0);
            setImgUrl(fallback);
          }
        }}
      />
      <View style={styles.spotlightScrim} />

      {/* Top Badges */}
      <View style={styles.spotlightTopRow}>
        <View style={styles.spotlightBadge}>
          <MaterialIcons name="verified" size={12} color={Colors.primary} />
          <Text style={styles.spotlightBadgeText}>{item.badge}</Text>
        </View>
        <TouchableOpacity
          style={[styles.audioPlayBtn, isPlayingThis && styles.audioPlayBtnActive]}
          onPress={(e) => { e.stopPropagation?.(); onAudioToggle(); }}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name={isPlayingThis ? 'stop' : 'volume-up'}
            size={16}
            color={isPlayingThis ? '#FFFFFF' : Colors.primary}
          />
          <Text style={[styles.audioPlayBtnText, isPlayingThis && styles.audioPlayBtnTextActive]}>
            {isPlayingThis ? 'Stop' : 'Audio'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Content */}
      <View style={styles.spotlightContent}>
        <Text style={styles.spotlightEra} numberOfLines={1}>{item.era}</Text>
        <Text style={styles.spotlightTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
        <View style={styles.spotlightLocRow}>
          <MaterialIcons name="location-on" size={14} color="rgba(255,255,255,0.85)" />
          <Text style={styles.spotlightLocText} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
        </View>
        <Text style={styles.spotlightSubtitle} numberOfLines={2}>{item.subtitle}</Text>

        <View style={styles.spotlightActions}>
          <TouchableOpacity
            style={styles.spotlightAiBtn}
            onPress={(e) => { e.stopPropagation?.(); onAskAi(); }}
            activeOpacity={0.85}
          >
            <MaterialIcons name="auto-awesome" size={14} color="#FFFFFF" />
            <Text style={styles.spotlightAiBtnText}>Ask AI Guide</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.spotlightViewBtn}
            onPress={(e) => { e.stopPropagation?.(); onExplore(); }}
            activeOpacity={0.85}
          >
            <Text style={styles.spotlightViewBtnText}>Explore →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

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

  // Clear the active card highlight when narration finishes naturally
  useEffect(() => {
    if (!isSpeaking) {
      setActiveAudioId(null);
    }
  }, [isSpeaking]);

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
      // Background: warm image cache for top-20 places so subsequent renders are instant
      const namesToWarm = [...new Set(
        [...(places.length > 0 ? places : []), ...allCatalogPlaces.slice(0, 20)]
          .slice(0, 20)
          .map((p) => p.name)
          .filter(Boolean)
      )];
      if (namesToWarm.length > 0) {
        dynamicImageService.warmCache(namesToWarm).catch(() => {});
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

  const handleSpotlightAskAi = (item: { id: string; title: string; aiPrompt: string }) => {
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

  // Merge loaded places with ALL_SEED_PLACES to ensure all 148+ sites are always searchable
  // and dynamically compute Haversine distance from user GPS coordinates, sorting nearest first.
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

    // Sort strictly ascending by distance so closest monuments are always first
    merged.sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));
    return merged;
  }, [places, location.latitude, location.longitude]);

  // Dynamically derive spotlight monuments from live/seed catalog with authentic data
  const spotlightMonuments = React.useMemo(() => {
    const matched: Place[] = [];
    for (const tid of ICONIC_SPOTLIGHT_IDS) {
      const p = allCatalogPlaces.find((item) => item.id === tid || item.id?.toLowerCase() === tid.toLowerCase());
      if (p) matched.push(p);
    }
    // Fallback fill with highest rated places if some IDs not found
    if (matched.length < 5) {
      for (const p of allCatalogPlaces) {
        if (!matched.some((m) => m.id === p.id)) {
          matched.push(p);
          if (matched.length >= 7) break;
        }
      }
    }

    return matched.map((p) => {
      const hr = (p as any).heritageRecord || {};
      const title = (language === 'hi' && (p as any).nameHi)
        ? (p as any).nameHi
        : (language === 'gu' && (p as any).nameGu)
        ? (p as any).nameGu
        : p.name;
      const cityOrDistrict = (p as any).city || (p as any).district || '';
      const state = (p as any).state || '';
      const locationStr = [cityOrDistrict, state].filter(Boolean).join(', ') || 'India';
      const era = hr.period || 'Historical Era';
      const audioNarration = hr.shortStory || p.shortDescription || `${title} is a celebrated heritage monument of India.`;
      const aiPrompt = `Tell me the history, architecture, and significance of ${p.name}.`;
      const badge = hr.significance?.includes('UNESCO')
        ? 'UNESCO Wonder'
        : (p.rating && p.rating >= 4.8)
        ? 'Top Rated'
        : 'Heritage Wonder';
      const imageUrl = dynamicImageService.getPlaceImage(p.name, p.category, p.imageUrl);

      return {
        id: p.id,
        title,
        subtitle: p.shortDescription || hr.significance || title,
        location: locationStr,
        era,
        imageUrl,
        audioNarration,
        aiPrompt,
        badge,
        place: p,
      };
    });
  }, [allCatalogPlaces, language]);

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
    { key: 'explore', label: t('home.exploreMap'), icon: 'map' },
    { key: 'ai', label: t('home.askAiGuide'), icon: 'auto-awesome' },
    { key: 'camera', label: t('home.identifyArtifact'), icon: 'camera-alt' },
    { key: 'plan', label: t('home.planHeritageTour'), icon: 'route' },
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
            <View style={styles.headerTextWrap}>
              <Text style={styles.eyebrowLabel} numberOfLines={1} ellipsizeMode="tail">YATRA · EXPLORE — UNDERSTAND — BELONG</Text>
              <Text style={styles.greeting} numberOfLines={1}>{greeting()},</Text>
              <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {isScreenLoading ? (
              <LocationBadgeSkeleton />
            ) : (
              <TouchableOpacity style={styles.locationBadge} onPress={() => router.push('/(tabs)/explore')}>
                <MaterialIcons name="place" size={16} color={Colors.primary} />
                <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                  {`${location.city}`}
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
                        source={{
                          uri: placeImg,
                          headers: {
                            'User-Agent': 'YatraHeritageCompanion/2.0 (https://github.com/Priyankkhatri/SIH-THE-CODER-CULT; contact@yatra.in)',
                          },
                        }}
                        style={styles.searchResultThumb}
                        contentFit="cover"
                        transition={200}
                        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
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
                            📍 {(place as any).city || (place as any).state || 'India'} {place.distance !== undefined ? `• ${place.distance} km` : ''}
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
                            <MaterialIcons name="directions" size={14} color={Colors.primary} />
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
                <View style={styles.quickActionIcon}>
                  <MaterialIcons name={action.icon as any} size={22} color={Colors.text} />
                </View>
                <Text style={styles.quickActionLabel} numberOfLines={2}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Spotlight Hero Carousel (Visible when not actively searching) */}
        {!searchQuery && (
          <View style={styles.spotlightSection}>
            <View style={styles.sectionHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionEyebrow}>CURATED · ICONIC</Text>
                <Text style={styles.sectionTitle}>Must-Visit Wonders</Text>
                <Text style={styles.sectionSubtitle}>Iconic civilisations with AI voice narration</Text>
              </View>
              <View style={styles.audioHintPill}>
                <MaterialIcons name="volume-up" size={14} color={Colors.primary} />
                <Text style={styles.audioHintText}>Audio</Text>
              </View>
            </View>

            <FlatList
              data={spotlightMonuments}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 14, paddingTop: 4, paddingBottom: 10 }}
              renderItem={({ item }) => {
                const isPlayingThis = isSpeaking && activeAudioId === item.id;
                return (
                  <SpotlightCard
                    key={item.id}
                    item={item}
                    isPlayingThis={isPlayingThis}
                    cardWidth={SPOTLIGHT_CARD_WIDTH}
                    styles={styles}
                    onPress={() => router.push(`/place/${item.id}`)}
                    onAudioToggle={() => handleToggleAudio(item.id, item.audioNarration)}
                    onAskAi={() => handleSpotlightAskAi(item)}
                    onExplore={() => router.push({
                      pathname: '/(tabs)/explore',
                      params: { destinationId: item.id, destinationName: item.title, routeTo: 'true' },
                    })}
                  />
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
                  <MaterialIcons name="psychology" size={24} color={Colors.primary} />
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
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.sectionTitle} numberOfLines={1}>{t('home.nearbyHeritageSites')}</Text>
              <Text style={styles.sectionSubtitle} numberOfLines={1}>Discover monuments near your GPS coordinates</Text>
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
              contentContainerStyle={{ paddingHorizontal: 20 }}
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
              contentContainerStyle={{ paddingHorizontal: 20 }}
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
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.sectionTitle} numberOfLines={1}>{t('home.allNearbyPlaces')}</Text>
              <Text style={styles.sectionSubtitle} numberOfLines={1}>Curated monuments, palaces & sacred sites</Text>
            </View>
            <TouchableOpacity style={styles.seeAllBtn} onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAllText}>View Map →</Text>
            </TouchableOpacity>
          </View>
          {isScreenLoading ? (
            <View style={{ paddingHorizontal: 20 }}>
              <PlaceCardVerticalSkeleton />
              <PlaceCardVerticalSkeleton />
              <PlaceCardVerticalSkeleton />
              <PlaceCardVerticalSkeleton />
            </View>
          ) : (
            <View style={styles.curatedList}>
              {filteredPlaces.slice(0, 6).map((place) => (
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
          )}

          {filteredPlaces.length > 6 && (
            <TouchableOpacity
              style={styles.exploreMoreBtn}
              onPress={() => router.push('/(tabs)/explore')}
              activeOpacity={0.8}
            >
              <MaterialIcons name="explore" size={20} color={Colors.primary} />
              <Text style={styles.exploreMoreText} numberOfLines={2}>
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
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: Spacing.md,
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTextWrap: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  headerLogo: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  eyebrowLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.primary,
    marginBottom: 4,
  },
  greeting: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  userName: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.2,
    marginTop: 1,
  },
  headerRight: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 110,
    flexShrink: 1,
    minWidth: 0,
  },
  locationText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text,
    fontWeight: '600',
    flexShrink: 1,
    minWidth: 0,
  },
  sosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF5350',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    flexShrink: 0,
    ...Shadows.sm,
  },
  sosBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    marginBottom: Spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.25)',
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
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  searchResultCatText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
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
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.35)',
  },
  searchResultRouteBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
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
    paddingHorizontal: 20,
    marginBottom: 28,
    marginTop: Spacing.sm,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  quickActionCard: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    alignItems: 'center',
    gap: 7,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: Colors.divider,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
    minWidth: 0,
  },
  spotlightSection: {
    marginBottom: 32,
  },
  spotlightCard: {
    width: SPOTLIGHT_CARD_WIDTH,
    height: 340,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#141414',
    position: 'relative',
  },
  spotlightImage: {
    ...StyleSheet.absoluteFill,
  },
  spotlightScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 8, 10, 0.38)',
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
    gap: 8,
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(10, 10, 12, 0.62)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    flexShrink: 1,
    maxWidth: '60%',
  },
  spotlightBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F5F1E8',
    letterSpacing: 0.8,
    flexShrink: 1,
  },
  audioPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(10, 10, 12, 0.62)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    flexShrink: 0,
  },
  audioPlayBtnActive: {
    backgroundColor: '#E53935',
    borderColor: '#EF5350',
  },
  audioPlayBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
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
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  spotlightTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  spotlightLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    minWidth: 0,
  },
  spotlightLocText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
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
    backgroundColor: Colors.text,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  spotlightAiBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F0F0F',
  },
  spotlightViewBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotlightViewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  audioHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
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
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  triviaCard: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    borderWidth: 0,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    paddingLeft: 16,
  },
  triviaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  triviaIconWrap: {
    display: 'none',
  },
  triviaBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.6,
  },
  triviaTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 19,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  triviaBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
    marginTop: 8,
  },
  triviaActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  triviaActionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  craftsBannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  craftsBanner: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
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
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  craftsDesc: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255, 248, 231, 0.8)',
    lineHeight: 18,
    marginBottom: 6,
  },
  craftsBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
  },
  craftsBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    color: Colors.textInverse,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 12,
  },
  sectionHeaderLeft: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  curatedList: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 21,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
  },
  sectionCount: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    flexShrink: 0,
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
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
  },
  emptyClearText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: Colors.primary,
    marginBottom: 3,
  },
  seeAllBtn: {
    flexShrink: 0,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  seeAllText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: '600',
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
    borderColor: 'rgba(212, 175, 124, 0.25)',
    ...Shadows.sm,
  },
  exploreMoreText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    flexShrink: 1,
  },
});
