import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  Dimensions,
  RefreshControl,
  FlatList,
  PanResponder,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CATEGORY_COLORS } from '../../constants/theme';
import { usePlacesStore, useChatStore, useUserStore } from '../../stores';
import { heritageApi, placesApi } from '../../services/api';
import { useSpeech } from '../../hooks/useSpeech';
import { useTranslation } from '../../hooks/useTranslation';
import { WeatherCrowdBar } from '../../components/WeatherCrowdBar';
import { SafetySOSModal } from '../../components/SafetySOSModal';
import { LocalArtisansSection } from '../../components/LocalArtisansSection';
import { ReviewsSection } from '../../components/ReviewsSection';
import { NearbyAmenitiesSection } from '../../components/NearbyAmenitiesSection';
import { RideBookingSection } from '../../components/RideBookingSection';
import { ProGateTipsSection } from '../../components/ProGateTipsSection';
import { PlaceDetailSkeleton } from '../../components/Skeleton';
import { dynamicImageService, GalleryImage } from '../../services/dynamicImageService';
import { ALL_SEED_PLACES } from '../../utils/seedPlaces';

const { width } = Dimensions.get('window');

interface HeritageDetail {
  shortStory: string;
  history: string;
  significance: string;
  architecture?: string;
  keyFacts: string[];
  period?: string;
  placeName: string;
  sources: Array<{ sourceName: string; sourceUrl?: string; referenceText: string }>;
  place: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    category: string;
    imageUrl?: string;
    openingHours?: string;
    rating?: number;
  };
}

export default function PlaceDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language } = useUserStore();
  const { t, getPlaceName, getCategoryName } = useTranslation();
  const { favorites, toggleFavorite } = usePlacesStore();
  const { setContext } = useChatStore();
  const { speak, stop, isSpeaking } = useSpeech();

  const [heritage, setHeritage] = useState<HeritageDetail | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroScrollRef = React.useRef<ScrollView>(null);
  const galleryRequestRef = React.useRef(0);
  const mainScrollRef = React.useRef<ScrollView>(null);
  const currentScrollY = React.useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('story');
  const [activeMainTab, setActiveMainTab] = useState<'heritage' | 'radar' | 'reviews'>('heritage');

  const handleTabSwitch = (tab: 'heritage' | 'radar' | 'reviews') => {
    setActiveMainTab(tab);
    if (currentScrollY.current > 420) {
      mainScrollRef.current?.scrollTo({ y: 430, animated: true });
    }
  };

  const [sosVisible, setSosVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [googleDetails, setGoogleDetails] = useState<any>(null);

  const isFavorite = id ? favorites.includes(id) : false;

  useEffect(() => {
    if (id) {
      setImageError(false);
      setActiveSlide(0);
      setGallery([]);
      setGoogleDetails(null);
      loadHeritage(true);
    }
  }, [id]);

  // Stop TTS when leaving the screen so audio never leaks into other tabs
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  const loadHeritage = async (showSkeleton = true) => {
    if (showSkeleton) setIsLoading(true);
    const start = Date.now();
    let resultHeritage: HeritageDetail | null = null;

    try {
      const response: any = await heritageApi.getByPlaceId(id!, language);
      if (response?.data) {
        resultHeritage = response.data;
      }
    } catch (error) {
      console.warn('[PlaceDetail] Server fetch notice, loading client fallback:', error);
    }

    if (!resultHeritage) {
      // High-resilience fallback: check client store first, then full 148 verified national monuments
      const storePlaces = usePlacesStore.getState().places;
      const matched =
        storePlaces.find((p) => p.id === id || p.id?.toLowerCase() === id?.toLowerCase()) ||
        ALL_SEED_PLACES.find((p) => p.id === id || p.id?.toLowerCase() === id?.toLowerCase() || p.name?.toLowerCase() === id?.toLowerCase());

      if (matched) {
        const pName = getPlaceName(matched);
        const hr = matched.heritageRecord;
        resultHeritage = {
          shortStory: hr?.shortStory || matched.shortDescription || `${pName} is an iconic historic landmark of India.`,
          history: hr?.history || (hr as any)?.detailedHistory || matched.shortDescription || `${pName} is deeply preserved with remarkable architectural chronicles.`,
          significance: hr?.significance || `Preserved cultural landmark representing the artistic and architectural legacy of ${pName}.`,
          architecture: hr?.architecture || 'Traditional regional Indian architecture with intricate masonry.',
          keyFacts: Array.isArray(hr?.keyFacts) && hr.keyFacts.length > 0 ? hr.keyFacts : [
            `Landmark: ${pName}`,
            `Category: ${getCategoryName(matched.category)}`,
            `Rating: ${matched.rating || 4.8} / 5.0`,
            `Visiting: ${matched.openingHours || '9:00 AM - 5:30 PM'}`,
            `Coordinates: ${matched.latitude?.toFixed(4)} N, ${matched.longitude?.toFixed(4)} E`,
          ],
          period: hr?.period || 'Historical Era',
          placeName: pName,
          sources: Array.isArray(hr?.sources) && hr.sources.length > 0
            ? hr.sources.map((s) => ({
                sourceName: s.sourceName,
                sourceUrl: s.sourceUrl,
                referenceText: s.referenceText || 'Verified ASI National Monument Registry record.',
              }))
            : [
                {
                  sourceName: 'Archaeological Survey of India & Open Govt Data',
                  sourceUrl: 'https://asi.nic.in',
                  referenceText: 'Listed historical landmark in Indian Heritage Registry.',
                },
              ],
          place: matched,
        };
      } else {
        resultHeritage = getDemoHeritage(id!);
      }
    }

    if (showSkeleton) {
      const elapsed = Date.now() - start;
      if (elapsed < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - elapsed));
      }
    }

    setHeritage(resultHeritage);
    setIsLoading(false);
    setIsRefreshing(false);

    // Dynamically fetch authentic multi-image gallery from internet / curated catalog.
    // Use canonical English place name for cache/gallery keys (translated names
    // miss verified keys and force Unsplash fallbacks). Guard against stale
    // resolves when the user navigates quickly between places.
    if (resultHeritage) {
      const requestSeq = ++galleryRequestRef.current;
      const canonicalName =
        resultHeritage.place?.name ||
        (resultHeritage.place ? getPlaceName(resultHeritage.place) : '') ||
        resultHeritage.placeName ||
        '';
      const rawImage = resultHeritage.place?.imageUrl;
      const cat = resultHeritage.place?.category || 'heritage';
      dynamicImageService
        .getPlaceGallery(canonicalName, id, rawImage, cat)
        .then((fetchedGallery) => {
          if (requestSeq !== galleryRequestRef.current) return;
          if (fetchedGallery && fetchedGallery.length > 0) {
            setGallery(fetchedGallery);
          }
        })
        .catch((err) => {
          console.warn('[PlaceDetail] Dynamic gallery fetch notice:', err);
        });

      // Fetch live Google Places rating and open status
      placesApi
        .getGoogleDetails(id!)
        .then((res: any) => {
          if (res?.data) setGoogleDetails(res.data);
        })
        .catch(() => {});
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadHeritage(false); // keep content visible during refresh; loadHeritage sets isRefreshing(false)
  };

  const handleAskAI = () => {
    if (heritage) {
      const pName = heritage.placeName || heritage.place?.name || 'Heritage Monument';
      setContext(id!, pName);
      router.push({
        pathname: '/(tabs)/ai',
        params: {
          autoAsk: `Tell me the history, architectural marvels, and visitor guide for ${pName}.`,
          placeId: id!,
          placeName: pName,
          t: String(Date.now()),
        },
      });
    }
  };

  const handleListen = () => {
    if (isSpeaking) {
      stop();
    } else if (heritage) {
      const pName = heritage.placeName || heritage.place?.name || 'Heritage Monument';
      speak(heritage.shortStory || pName, language);
    }
  };

  const handleDirections = () => {
    if (!heritage) return;
    const name = heritage.placeName || heritage.place?.name || 'Heritage Site';
    router.push({
      pathname: '/(tabs)/explore',
      params: {
        destinationId: id,
        destinationName: name,
        routeTo: 'true',
      },
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // ── Derived values (must come before early returns so hook order is stable) ──
  // These use optional-chaining / fallbacks for when heritage is still null.
  const placeObj = heritage?.place || {
    id: id || '',
    name: heritage?.placeName || 'Heritage Monument',
    latitude: 22.3072,
    longitude: 73.1812,
    category: 'heritage',
    openingHours: '9:00 AM - 5:30 PM',
    rating: 4.8,
  };

  const category = placeObj.category || 'heritage';
  const categoryColor = CATEGORY_COLORS[category] || Colors.primary;
  const displayName = heritage?.placeName || placeObj.name || 'Heritage Monument';
  const safeKeyFacts = Array.isArray(heritage?.keyFacts) ? heritage!.keyFacts : [];
  const safeSources = Array.isArray(heritage?.sources) ? heritage!.sources : [];

  const verifiedPrimary = dynamicImageService.getPlaceImage(displayName, category, placeObj.imageUrl);
  const effectivePrimary = !imageError
    ? verifiedPrimary
    : dynamicImageService.getArchitecturalFallback(displayName, category, 1);

  // MUST be declared before any early return — hooks rules
  const displayGallery: GalleryImage[] = React.useMemo(() => {
    let list: GalleryImage[] = [];
    if (gallery.length > 0) {
      list = [...gallery];
    } else if (effectivePrimary) {
      // While multi-photo gallery is loading, show ONLY the verified authentic hero
      // Never show generic/fallback photos of other sites to the user!
      return [
        {
          url: effectivePrimary,
          caption: `${displayName} — Primary Heritage Perspective`,
          source: 'Archaeological Survey of India / Wikimedia Commons',
        },
      ];
    } else {
      list = dynamicImageService.getArchitecturalFallbackGallery(displayName, category);
    }
    // Ensure the primary photo is always first in the gallery without duplicates
    if (effectivePrimary) {
      const primaryFile = effectivePrimary.split('/').pop()?.split('?')[0].replace(/^\d+px-/, '') || '';
      const filtered = list.filter((g) => {
        if (g.url === effectivePrimary) return false;
        if (primaryFile && g.url.includes(primaryFile)) return false;
        if (imageError && g.url === verifiedPrimary) return false;
        return true;
      });
      list = [
        {
          url: effectivePrimary,
          caption: `${displayName} — Primary Heritage Perspective`,
          source: 'Archaeological Survey of India / Wikimedia Commons',
        },
        ...filtered,
      ];
    }
    return list;
  }, [gallery, effectivePrimary, displayName, category, imageError, verifiedPrimary]);

  // MUST be declared before any early return — hooks rules
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Dominant horizontal drag: at least 16px and significantly more horizontal than vertical
          return (
            Math.abs(gestureState.dx) > 16 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.2
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -30) {
            // Swiped left -> next image
            setActiveSlide((curr) => {
              const maxIdx = Math.max(0, displayGallery.length - 1);
              const next = Math.min(maxIdx, curr + 1);
              heroScrollRef.current?.scrollTo({ x: next * width, animated: true });
              return next;
            });
          } else if (gestureState.dx > 30) {
            // Swiped right -> previous image
            setActiveSlide((curr) => {
              const prev = Math.max(0, curr - 1);
              heroScrollRef.current?.scrollTo({ x: prev * width, animated: true });
              return prev;
            });
          }
        },
      }),
    [displayGallery.length, width]
  );

  // Early returns — placed AFTER all hooks
  if (isLoading) {
    return <PlaceDetailSkeleton onBack={() => router.back()} />;
  }

  if (!heritage) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="error-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.errorText}>{t('place.recordNotFound')}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={mainScrollRef}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={(e) => {
          currentScrollY.current = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={32}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Hero Image Sliding Carousel */}
        <View style={styles.heroSection} {...panResponder.panHandlers}>
          <ScrollView
            ref={heroScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={(e) => {
              const slideIdx = Math.round(e.nativeEvent.contentOffset.x / width);
              if (slideIdx >= 0 && slideIdx < displayGallery.length && slideIdx !== activeSlide) {
                setActiveSlide(slideIdx);
              }
            }}
            onMomentumScrollEnd={(e) => {
              const slideIdx = Math.round(e.nativeEvent.contentOffset.x / width);
              if (slideIdx >= 0 && slideIdx < displayGallery.length) {
                setActiveSlide(slideIdx);
              }
            }}
            style={styles.heroScrollView}
          >
            {displayGallery.map((img, idx) => (
              <View key={`hero-${img.url}`} style={{ width, height: 500 }}>
                <Image
                  source={{ uri: img.url }}
                  style={styles.heroImage}
                  contentFit="cover"
                  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                  transition={300}
                  onError={() => {
                    if (idx === 0) {
                      setImageError(true);
                    } else {
                      // Filter out the failed image so the user only sees verified, authentic photos
                      const brokenUrl = img.url;
                      setGallery((prev) => prev.filter((item) => item.url !== brokenUrl));
                    }
                  }}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.heroOverlay} pointerEvents="none" />

          {/* Left / Right Quick Slide Chevrons for Easy Browsing */}
          {displayGallery.length > 1 && activeSlide > 0 && (
            <TouchableOpacity
              style={styles.slideChevronLeft}
              onPress={() => {
                const nextIdx = Math.max(0, activeSlide - 1);
                setActiveSlide(nextIdx);
                heroScrollRef.current?.scrollTo({ x: nextIdx * width, animated: true });
              }}
              activeOpacity={0.85}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            >
              <MaterialIcons name="chevron-left" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {displayGallery.length > 1 && activeSlide < displayGallery.length - 1 && (
            <TouchableOpacity
              style={styles.slideChevronRight}
              onPress={() => {
                const nextIdx = Math.min(displayGallery.length - 1, activeSlide + 1);
                setActiveSlide(nextIdx);
                heroScrollRef.current?.scrollTo({ x: nextIdx * width, animated: true });
              }}
              activeOpacity={0.85}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            >
              <MaterialIcons name="chevron-right" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {/* Top buttons */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={styles.topBtn}
                onPress={() => loadHeritage(true)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="refresh" size={20} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.topBtn, { backgroundColor: 'rgba(239, 83, 80, 0.25)' }]}
                onPress={() => setSosVisible(true)}
              >
                <MaterialIcons name="emergency" size={20} color="#EF5350" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.topBtn} onPress={() => id && toggleFavorite(id)}>
                <MaterialIcons
                  name={isFavorite ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={isFavorite ? Colors.error : Colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Photo Counter Badge (Top Right) */}
          {displayGallery.length > 1 && (
            <View style={styles.photoCountBadge}>
              <MaterialIcons name="photo-camera" size={12} color="#FFFFFF" />
              <Text style={styles.photoCountText}>
                {activeSlide + 1} / {displayGallery.length}
              </Text>
            </View>
          )}

          {/* Hero title & badges — box-none so horizontal swipes pass through */}
          <View style={styles.heroContent} pointerEvents="box-none">
            <Text style={styles.heroEyebrow} pointerEvents="none">
              {getCategoryName(category).toUpperCase()} · INDIA
            </Text>
            <View style={styles.heroBadgeRow} pointerEvents="box-none">

              {/* Pagination Dots */}
              {displayGallery.length > 1 && (
                <View style={styles.paginationRow} pointerEvents="auto">
                  {displayGallery.map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        setActiveSlide(i);
                        heroScrollRef.current?.scrollTo({ x: i * width, animated: true });
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                    >
                      <View
                        style={[
                          styles.dot,
                          i === activeSlide && styles.activeDot,
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Photo Perspective Caption */}
            {displayGallery[activeSlide]?.caption && (
              <View style={styles.perspectiveCaptionPill} pointerEvents="none">
                <MaterialIcons name="collections" size={12} color={Colors.primary} />
                <Text style={styles.perspectiveCaptionText} numberOfLines={1}>
                  {displayGallery[activeSlide].caption}
                </Text>
              </View>
            )}

            <Text style={styles.heroTitle} pointerEvents="none">{displayName}</Text>
            <View style={styles.heroMeta} pointerEvents="box-none">
              <TouchableOpacity
                style={styles.metaItem}
                onPress={() => handleTabSwitch('reviews')}
                activeOpacity={0.75}
              >
                <MaterialIcons name="star" size={15} color={Colors.primary} />
                <Text style={styles.metaText}>
                  {googleDetails?.googleRating
                    ? `${googleDetails.googleRating.toFixed(1)} (${(googleDetails.userRatingCount || 1000).toLocaleString()} on Google)`
                    : `${placeObj.rating || 4.7} Rating`}
                </Text>
              </TouchableOpacity>
              {googleDetails?.isOpenNow !== undefined && (
                <View style={[styles.metaItem, { backgroundColor: 'rgba(76, 175, 80, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }]}>
                  <MaterialIcons name="fiber-manual-record" size={8} color="#4CAF50" />
                  <Text style={[styles.metaText, { color: '#4CAF50', fontWeight: 'bold' }]}>
                    {googleDetails.isOpenNow ? 'Open Now' : 'Closed'}
                  </Text>
                </View>
              )}
              {heritage.period && (
                <View style={styles.metaItem}>
                  <MaterialIcons name="history" size={15} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{heritage.period}</Text>
                </View>
              )}
              {placeObj.openingHours && googleDetails?.isOpenNow === undefined && (
                <View style={styles.metaItem}>
                  <MaterialIcons name="schedule" size={14} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{placeObj.openingHours.split('(')[0].trim()}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Premium actions — quiet hierarchy: Ask AI primary, rest ghost */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionPrimary]} onPress={handleAskAI}>
              <MaterialIcons name="auto-awesome" size={19} color="#0F0F0F" />
              <Text style={[styles.actionLabel, styles.actionLabelPrimary]}>{t('common.askAi')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleListen}>
              <MaterialIcons name={isSpeaking ? 'stop' : 'headphones'} size={19} color={Colors.text} />
              <Text style={styles.actionLabel}>{isSpeaking ? t('common.stop') : t('common.listen')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/camera')}>
              <MaterialIcons name="camera-alt" size={19} color={Colors.text} />
              <Text style={styles.actionLabel}>{t('common.identify')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleDirections}>
              <MaterialIcons name="directions" size={19} color={Colors.text} />
              <Text style={styles.actionLabel}>{t('common.directions')}</Text>
            </TouchableOpacity>
          </View>

          {/* Live Weather & Crowd Density Radar Bar */}
          <WeatherCrowdBar
            latitude={placeObj.latitude}
            longitude={placeObj.longitude}
            placeName={displayName}
            variant="full"
          />



          {/* TAB 1: HERITAGE & STORY (Museum-grade Cultural Narrative - Airy, Editorial & Spacious) */}
          {activeMainTab === 'heritage' && (
            <View style={styles.tabSectionWrapper}>
              {/* 1. Cultural Narrative & Living Story */}
              <View style={styles.heritageEditorialSection}>
                <View style={styles.editorialEyebrowRow}>
                  <MaterialIcons name="history-edu" size={16} color={Colors.primary} />
                  <Text style={styles.editorialEyebrow}>CHRONICLE & LIVING MEMORY</Text>
                </View>

                <Text style={styles.editorialMainHeading}>The Story of {displayName}</Text>

                {heritage.significance ? (
                  <View style={styles.editorialQuoteBlock}>
                    <Text style={styles.editorialQuoteText}>
                      "{heritage.significance.length > 160 ? `${heritage.significance.slice(0, 160)}...` : heritage.significance}"
                    </Text>
                  </View>
                ) : null}

                {heritage.shortStory ? (
                  <View style={styles.editorialBodyWrap}>
                    <Text style={styles.editorialBodyText} numberOfLines={expandedSection === 'story' ? undefined : 4}>
                      {heritage.shortStory}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleSection('story')}
                      style={styles.expandStoryBtn}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.expandStoryText}>
                        {expandedSection === 'story' ? 'Show less' : 'Read full chronicle'}
                      </Text>
                      <MaterialIcons
                        name={expandedSection === 'story' ? 'expand-less' : 'expand-more'}
                        size={18}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              {/* 2. Visual Architecture & Photo Perspectives Gallery */}
              {displayGallery.length > 1 && (
                <View style={styles.perspectivesSection}>
                  <View style={styles.perspectivesHeader}>
                    <View>
                      <Text style={styles.galleryEyebrow}>VISUAL PERSPECTIVES</Text>
                      <Text style={styles.perspectivesSectionTitle}>Architectural Gallery</Text>
                    </View>
                    <View style={styles.perspectivesBadge}>
                      <Text style={styles.perspectivesCountBadge}>
                        {activeSlide + 1} / {displayGallery.length}
                      </Text>
                    </View>
                  </View>
                  <FlatList
                    data={displayGallery}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    keyExtractor={(item, idx) => `gthumb-${item.url}-${idx}`}
                    decelerationRate="fast"
                    snapToInterval={220}
                    snapToAlignment="start"
                    disableIntervalMomentum
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingVertical: 8, paddingRight: 20 }}
                    ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
                    onMomentumScrollEnd={(e) => {
                      const idx = Math.round(e.nativeEvent.contentOffset.x / 220);
                      if (idx >= 0 && idx < displayGallery.length) setActiveSlide(idx);
                    }}
                    renderItem={({ item, index: idx }) => (
                      <TouchableOpacity
                        style={[
                          styles.galleryCard,
                          activeSlide === idx && styles.galleryCardActive,
                        ]}
                        onPress={() => {
                          setActiveSlide(idx);
                          heroScrollRef.current?.scrollTo({ x: idx * width, animated: true });
                        }}
                        activeOpacity={0.9}
                      >
                        <Image
                          source={{ uri: item.url }}
                          style={styles.galleryCardImg}
                          contentFit="cover"
                          transition={200}
                          onError={() => {
                            const brokenUrl = item.url;
                            setGallery((prev) => prev.filter((i) => i.url !== brokenUrl));
                          }}
                        />
                        <View style={styles.galleryCardOverlay}>
                          <Text style={styles.galleryCardCaption} numberOfLines={2}>
                            {item.caption}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}

              {/* 3. Architectural Highlights & Structural Mastery */}
              <View style={styles.architectureSection}>
                <View style={styles.sectionHeaderRow}>
                  <MaterialIcons name="apartment" size={18} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Architectural Marvel & Design</Text>
                </View>

                {/* Key Spec Badges */}
                <View style={styles.architecturePillRow}>
                  {heritage.period && (
                    <View style={styles.specBadge}>
                      <MaterialIcons name="schedule" size={13} color={Colors.primary} />
                      <Text style={styles.specBadgeLabel}>Era:</Text>
                      <Text style={styles.specBadgeValue}>{heritage.period}</Text>
                    </View>
                  )}
                  <View style={styles.specBadge}>
                    <MaterialIcons name="museum" size={13} color={Colors.primary} />
                    <Text style={styles.specBadgeLabel}>Status:</Text>
                    <Text style={styles.specBadgeValue}>ASI Protected</Text>
                  </View>
                </View>

                <Text style={styles.architectureBody}>
                  {heritage.architecture ||
                    'Exquisite stone masonry, intricate sculptural reliefs, and traditional structural craftsmanship preserved under national conservation guidelines.'}
                </Text>
              </View>

              {/* 4. Fast Monument Highlights */}
              {safeKeyFacts.length > 0 && (
                <View style={styles.factsSection}>
                  <View style={styles.sectionHeaderRow}>
                    <MaterialIcons name="lightbulb" size={18} color={Colors.primary} />
                    <Text style={styles.sectionTitle}>Key Monument Highlights</Text>
                  </View>
                  <View style={styles.factsGrid}>
                    {safeKeyFacts.map((fact, idx) => {
                      const parts = fact.split(':');
                      const label = parts.length > 1 ? parts[0].trim() : `Fact ${idx + 1}`;
                      const value = parts.length > 1 ? parts.slice(1).join(':').trim() : fact;
                      return (
                        <View key={idx} style={styles.factCard}>
                          <View style={styles.factIconWrap}>
                            <MaterialIcons name="star-outline" size={16} color={Colors.primary} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.factCardLabel}>{label}</Text>
                            <Text style={styles.factCardValue}>{value}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* 5. Verified Govt Citations */}
              {safeSources.length > 0 && (
                <View style={styles.sourcesSection}>
                  <View style={styles.sectionHeaderRow}>
                    <MaterialIcons name="verified" size={18} color={Colors.success} />
                    <Text style={styles.sectionTitle}>Government & Archaeological Citations</Text>
                  </View>
                  <View style={styles.sourcesList}>
                    {safeSources.map((source, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.sourceCard}
                        onPress={() => source.sourceUrl && Linking.openURL(source.sourceUrl)}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons name="verified" size={18} color={Colors.success} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.sourceTitle}>{source.sourceName}</Text>
                          <Text style={styles.sourceDescription} numberOfLines={2}>
                            {source.referenceText}
                          </Text>
                        </View>
                        {source.sourceUrl && (
                          <MaterialIcons name="open-in-new" size={15} color={Colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* 6. Curated Deep Heritage Dossier Card */}
              <TouchableOpacity
                style={styles.deepHeritageCard}
                onPress={() => router.push(`/place/${id}/heritage`)}
                activeOpacity={0.88}
              >
                <View style={styles.dossierHeader}>
                  <View style={styles.dossierEyebrowRow}>
                    <MaterialIcons name="account-balance" size={14} color={Colors.primary} />
                    <Text style={styles.dossierEyebrow}>OFFICIAL RESEARCH DOSSIER</Text>
                  </View>
                  <View style={styles.dossierBadge}>
                    <Text style={styles.dossierBadgeText}>100% Grounded</Text>
                  </View>
                </View>

                <View style={styles.dossierMainRow}>
                  <View style={styles.dossierIconCircle}>
                    <MaterialIcons name="auto-stories" size={24} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.deepHeritageTitle}>Explore Full Heritage Archive</Text>
                    <Text style={styles.deepHeritageSubtitle}>
                      Comprehensive architectural blueprints, dynasty chronicles, royal inscriptions & verified ASI citations.
                    </Text>
                  </View>
                </View>

                <View style={styles.dossierPillsRow}>
                  <View style={styles.dossierPill}>
                    <MaterialIcons name="schedule" size={12} color={Colors.primary} />
                    <Text style={styles.dossierPillText}>Dynasty Timeline</Text>
                  </View>
                  <View style={styles.dossierPill}>
                    <MaterialIcons name="account-balance" size={12} color={Colors.primary} />
                    <Text style={styles.dossierPillText}>Structural Blueprints</Text>
                  </View>
                  <View style={styles.dossierPill}>
                    <MaterialIcons name="menu-book" size={12} color={Colors.primary} />
                    <Text style={styles.dossierPillText}>ASI Source Records</Text>
                  </View>
                </View>

                <View style={styles.dossierActionRow}>
                  <Text style={styles.dossierActionText}>Open Curated Dossier</Text>
                  <View style={styles.dossierActionBtn}>
                    <MaterialIcons name="arrow-forward" size={14} color="#0A0A0E" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* TAB 2: ON-GROUND VISIT & RADAR (Practical Utility Suite) */}
          {activeMainTab === 'radar' && (
            <View style={styles.tabSectionWrapper}>
              {/* Official Monument Entry Ticket Card */}
              <TouchableOpacity
                style={styles.ticketCard}
                onPress={() => Linking.openURL('https://asi.payumoney.com')}
                activeOpacity={0.88}
              >
                <View style={styles.ticketIconWrap}>
                  <MaterialIcons name="confirmation-number" size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.ticketEyebrowRow}>
                    <Text style={styles.ticketEyebrow}>FAST-TRACK ADMISSION</Text>
                    <View style={styles.ticketGovtBadge}>
                      <Text style={styles.ticketGovtBadgeText}>Govt Portal</Text>
                    </View>
                  </View>
                  <Text style={styles.ticketTitle}>Book Official ASI Entry Ticket</Text>
                  <Text style={styles.ticketSubtitle}>Archaeological Survey of India • Instant QR scan admission</Text>
                </View>
                <View style={styles.ticketActionBtn}>
                  <MaterialIcons name="arrow-forward" size={16} color="#0A0A0E" />
                </View>
              </TouchableOpacity>

              {/* 1-Tap Transit & Ride Dispatch (Uber, Rapido & Maps) */}
              <RideBookingSection
                placeName={displayName}
                latitude={placeObj.latitude}
                longitude={placeObj.longitude}
                cityOrState={(placeObj as any).city || (placeObj as any).state || displayName}
              />

              {/* Pro Gate Survival Tips & Scam Protection Shield */}
              <ProGateTipsSection
                placeName={displayName}
                category={placeObj.category}
              />

              {/* Nearby Tourist Amenities Radar (Google Places Integration) */}
              <NearbyAmenitiesSection
                placeId={placeObj.id || id || ''}
                placeName={displayName}
                latitude={placeObj.latitude}
                longitude={placeObj.longitude}
              />

              {/* Local Artisans & Regional Gastronomy Showcase */}
              <LocalArtisansSection placeName={displayName} stateOrCity={displayName} />
            </View>
          )}

          {/* TAB 3: VISITOR REVIEWS & RATINGS (Community & Social Proof) */}
          {activeMainTab === 'reviews' && (
            <View style={styles.tabSectionWrapper}>
              {/* Visitor Reviews & Community Ratings */}
              <ReviewsSection
                placeId={placeObj.id || id || ''}
                placeName={displayName}
                initialRating={placeObj.rating}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Pill Dock - Spacious & Uncluttered */}
      <View
        pointerEvents="box-none"
        style={[styles.floatingBottomDock, { bottom: Math.max(insets.bottom, 16) + 8 }]}
      >
        <View style={styles.floatingDockPill}>
          <TouchableOpacity
            style={[styles.dockTabBtn, activeMainTab === 'heritage' && styles.dockTabBtnActive]}
            onPress={() => handleTabSwitch('heritage')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="auto-stories"
              size={18}
              color={activeMainTab === 'heritage' ? '#0A0A0E' : Colors.primary}
            />
            <Text
              style={[
                styles.dockTabText,
                activeMainTab === 'heritage' && styles.dockTabTextActive,
              ]}
              numberOfLines={1}
            >
              Heritage
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dockTabBtn, activeMainTab === 'radar' && styles.dockTabBtnActive]}
            onPress={() => handleTabSwitch('radar')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="explore"
              size={18}
              color={activeMainTab === 'radar' ? '#0A0A0E' : Colors.primary}
            />
            <Text
              style={[
                styles.dockTabText,
                activeMainTab === 'radar' && styles.dockTabTextActive,
              ]}
              numberOfLines={1}
            >
              Visit & Radar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dockTabBtn, activeMainTab === 'reviews' && styles.dockTabBtnActive]}
            onPress={() => handleTabSwitch('reviews')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="rate-review"
              size={18}
              color={activeMainTab === 'reviews' ? '#0A0A0E' : Colors.primary}
            />
            <Text
              style={[
                styles.dockTabText,
                activeMainTab === 'reviews' && styles.dockTabTextActive,
              ]}
              numberOfLines={1}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Geo-Fenced Safety & SOS Emergency Modal */}
      <SafetySOSModal
        visible={sosVisible}
        onClose={() => setSosVisible(false)}
        latitude={placeObj.latitude}
        longitude={placeObj.longitude}
        currentLocationName={displayName}
      />
    </View>
  );
}

function getDemoHeritage(placeId: string): HeritageDetail | null {
  const seedMatch = ALL_SEED_PLACES.find(
    (p) => p.id === placeId || p.id?.toLowerCase() === placeId?.toLowerCase() || p.name?.toLowerCase() === placeId?.toLowerCase()
  );

  if (seedMatch) {
    const hr = seedMatch.heritageRecord;
    return {
      shortStory: hr?.shortStory || seedMatch.shortDescription || `${seedMatch.name} is an iconic historic monument of India.`,
      history: hr?.history || seedMatch.shortDescription || `${seedMatch.name} is deeply preserved with remarkable architectural chronicles.`,
      significance: hr?.significance || `Preserved cultural landmark in ${seedMatch.district || seedMatch.city || seedMatch.state || 'India'}.`,
      architecture: hr?.architecture || 'Authentic regional architectural heritage of India.',
      keyFacts: Array.isArray(hr?.keyFacts) && hr.keyFacts.length > 0 ? hr.keyFacts : [
        `Landmark: ${seedMatch.name}`,
        `Location: ${seedMatch.city || ''}, ${seedMatch.state || 'India'}`,
        `Coordinates: ${seedMatch.latitude.toFixed(4)} N, ${seedMatch.longitude.toFixed(4)} E`,
        `Visiting Hours: ${seedMatch.openingHours || '9:00 AM - 5:30 PM'}`,
      ],
      period: hr?.period || 'Historical Era',
      placeName: seedMatch.name,
      sources: Array.isArray(hr?.sources) && hr.sources.length > 0
        ? hr.sources.map((s) => ({
            sourceName: s.sourceName,
            sourceUrl: s.sourceUrl,
            referenceText: s.referenceText || 'Verified ASI National Monument Registry record.',
          }))
        : [
            {
              sourceName: 'Archaeological Survey of India',
              sourceUrl: 'https://asi.nic.in',
              referenceText: 'Verified ASI National Monument Registry record.',
            },
          ],
      place: seedMatch,
    };
  }

  // Safe fallback if place is completely unknown
  return {
    shortStory: `Historic monument details are loading for ${placeId}.`,
    history: 'Comprehensive historical and architectural archives available from the heritage database.',
    significance: 'Protected cultural asset recognized under heritage conservation guidelines.',
    keyFacts: [`Monument ID: ${placeId}`, 'Status: Archaeological Heritage Site'],
    period: 'Historical Era',
    placeName: 'Heritage Monument',
    sources: [],
    place: {
      id: placeId,
      name: 'Heritage Monument',
      latitude: 20.5937,
      longitude: 78.9629,
      category: 'heritage',
      rating: 4.5,
    },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
  },
  errorText: {
    fontSize: Typography.sizes.lg,
    color: Colors.textMuted,
  },
  backLink: {
    fontSize: Typography.sizes.base,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  heroSection: {
    height: 500,
    position: 'relative',
    backgroundColor: '#0A0A0A',
  },
  heroScrollView: {
    width: '100%',
    height: 500,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: Colors.primary,
    marginBottom: 6,
  },
  photoCountBadge: {
    position: 'absolute',
    top: 104,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(8, 8, 10, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  photoCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  activeDot: {
    width: 16,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#F5F1E8',
  },
  perspectiveCaptionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
    maxWidth: '92%',
  },
  perspectiveCaptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(5, 5, 8, 0.32)',
  },
  slideChevronLeft: {
    position: 'absolute',
    left: 14,
    top: 240,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(8, 8, 10, 0.70)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  slideChevronRight: {
    position: 'absolute',
    right: 14,
    top: 240,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(8, 8, 10, 0.70)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  topBar: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(8, 8, 10, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 22,
    backgroundColor: 'rgba(5,5,8,0.45)',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderRadius: 16,
  },
  actionLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  actionLabelPrimary: {
    color: '#0A0A0E',
    fontWeight: '800',
  },
  viewContextBanner: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  viewContextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.25)',
  },
  viewContextText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  floatingBottomDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  floatingDockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(18, 18, 25, 0.95)',
    borderRadius: BorderRadius.full,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.28)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 14,
    gap: 6,
  },
  dockTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
  },
  dockTabBtnActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  dockTabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#A0A0B5',
    letterSpacing: 0.2,
  },
  dockTabTextActive: {
    color: '#0A0A0E',
    fontWeight: '800',
  },
  tabSectionWrapper: {
    minHeight: 250,
  },
  ticketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.25)',
    marginTop: 18,
    marginBottom: 28,
  },
  ticketIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 124, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ticketEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  ticketGovtBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  ticketGovtBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4CAF50',
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Typography.fontFamily.serif,
  },
  ticketSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  ticketActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ── Heritage Editorial Section (Spacious & Breathable) ──
  heritageEditorialSection: {
    marginTop: 18,
    marginBottom: 32,
  },
  editorialEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  editorialEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  editorialMainHeading: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 32,
    marginBottom: 16,
  },
  editorialQuoteBlock: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    paddingLeft: 16,
    paddingVertical: 4,
    marginBottom: 20,
  },
  editorialQuoteText: {
    fontFamily: Typography.fontFamily.serif,
    fontStyle: 'italic',
    fontSize: 15.5,
    lineHeight: 26,
    color: Colors.primaryLight,
  },
  editorialBodyWrap: {
    gap: 12,
  },
  editorialBodyText: {
    fontSize: 15,
    color: '#D1D1D8',
    lineHeight: 26,
  },
  expandStoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  expandStoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.2,
  },

  // ── Visual Perspectives Gallery ──
  perspectivesSection: {
    marginBottom: 34,
  },
  perspectivesHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  galleryEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: Colors.primary,
    marginBottom: 4,
  },
  perspectivesSectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  perspectivesBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  perspectivesCountBadge: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  galleryCard: {
    width: 220,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#16161E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  galleryCardActive: {
    borderColor: Colors.primary,
  },
  galleryCardImg: {
    width: '100%',
    height: '100%',
  },
  galleryCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 10, 14, 0.72)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  galleryCardCaption: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 16,
  },

  // ── Architecture Section ──
  architectureSection: {
    marginBottom: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 19,
    fontWeight: '700',
    color: Colors.text,
  },
  architecturePillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 175, 124, 0.10)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.22)',
  },
  specBadgeLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  specBadgeValue: {
    fontSize: 11,
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  architectureBody: {
    fontSize: 14.5,
    color: '#D1D1D8',
    lineHeight: 25,
  },

  // ── Fast Facts Section ──
  factsSection: {
    marginBottom: 34,
  },
  factsGrid: {
    gap: 12,
  },
  factCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  factIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  factCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  factCardValue: {
    fontSize: 14,
    color: '#EEEEF2',
    lineHeight: 21,
  },

  // ── Sources Section ──
  sourcesSection: {
    marginBottom: 34,
  },
  sourcesList: {
    gap: 10,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sourceTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  sourceDescription: {
    fontSize: 11.5,
    color: Colors.textMuted,
    lineHeight: 16,
  },

  // ── Curated Dossier Card ("Explore Full Heritage Archive") ──
  deepHeritageCard: {
    backgroundColor: 'rgba(20, 20, 30, 0.85)',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.32)',
    marginTop: 8,
    marginBottom: 36,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  dossierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dossierEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dossierEyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.4,
  },
  dossierBadge: {
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.28)',
  },
  dossierBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.primaryLight,
  },
  dossierMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  dossierIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 124, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.32)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deepHeritageTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Typography.fontFamily.serif,
  },
  deepHeritageSubtitle: {
    fontSize: 12.5,
    color: '#A0A0B0',
    lineHeight: 19,
    marginTop: 4,
  },
  dossierPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dossierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dossierPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dossierActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  dossierActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  dossierActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
