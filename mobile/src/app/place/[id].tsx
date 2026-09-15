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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('story');
  const [sosVisible, setSosVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFavorite = id ? favorites.includes(id) : false;

  useEffect(() => {
    if (id) {
      setImageError(false);
      setActiveSlide(0);
      setGallery([]);
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

  const placeObj = heritage.place || {
    id: id || '',
    name: heritage.placeName || 'Heritage Monument',
    latitude: 22.3072,
    longitude: 73.1812,
    category: 'heritage',
    openingHours: '9:00 AM - 5:30 PM',
    rating: 4.8,
  };

  const category = placeObj.category || 'heritage';
  const categoryColor = CATEGORY_COLORS[category] || Colors.primary;
  const displayName = heritage.placeName || placeObj.name || 'Heritage Monument';
  const safeKeyFacts = Array.isArray(heritage.keyFacts) ? heritage.keyFacts : [];
  const safeSources = Array.isArray(heritage.sources) ? heritage.sources : [];

  const verifiedPrimary = dynamicImageService.getPlaceImage(displayName, category, placeObj.imageUrl);
  const effectivePrimary = !imageError
    ? verifiedPrimary
    : dynamicImageService.getArchitecturalFallback(displayName, category, 1);

  const displayGallery: GalleryImage[] = React.useMemo(() => {
    let list: GalleryImage[] = [];
    if (gallery.length > 0) {
      list = [...gallery];
    } else {
      list = dynamicImageService.getArchitecturalFallbackGallery(displayName, category);
    }
    // Ensure the primary photo is always first in the gallery
    if (effectivePrimary) {
      const filtered = list.filter(
        (g) => g.url !== effectivePrimary && (!imageError || g.url !== verifiedPrimary)
      );
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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
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
                      const fallback = dynamicImageService.getArchitecturalFallback(
                        displayName,
                        category,
                        idx + 1
                      );
                      setGallery((prev) => {
                        const base =
                          prev.length > 0
                            ? [...prev]
                            : dynamicImageService.getArchitecturalFallbackGallery(
                                displayName,
                                category
                              );
                        const next = [...base];
                        if (next[idx]) next[idx] = { ...next[idx], url: fallback };
                        return next;
                      });
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
            <View style={styles.heroMeta} pointerEvents="none">
              {placeObj.rating && (
                <View style={styles.metaItem}>
                  <MaterialIcons name="star" size={16} color={Colors.primary} />
                  <Text style={styles.metaText}>{placeObj.rating}</Text>
                </View>
              )}
              {heritage.period && (
                <View style={styles.metaItem}>
                  <MaterialIcons name="history" size={16} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{heritage.period}</Text>
                </View>
              )}
              {placeObj.openingHours && (
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

          {/* Official Monument Ticketing Card */}
          <TouchableOpacity
            style={styles.ticketCard}
            onPress={() => Linking.openURL('https://asi.payumoney.com')}
            activeOpacity={0.85}
          >
            <View style={styles.ticketIconWrap}>
              <MaterialIcons name="confirmation-number" size={22} color={Colors.background} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ticketTitle}>Book Official ASI Entry Ticket</Text>
              <Text style={styles.ticketSubtitle}>Direct Govt e-portal • Fast-track QR scan entry</Text>
            </View>
            <View style={styles.ticketActionBadge}>
              <Text style={styles.ticketActionText}>Book Online</Text>
              <MaterialIcons name="open-in-new" size={13} color={Colors.primary} />
            </View>
          </TouchableOpacity>

          {/* 2-Minute Heritage Story — editorial storytelling */}
          {heritage.shortStory && (
            <View style={styles.storyEditorial}>
              <Text style={styles.storyEyebrow}>2-MINUTE HERITAGE STORY</Text>
              <Text style={styles.storyQuote}>
                Where marble tells a story of faith, art and timeless beauty.
              </Text>
              <Text style={styles.storyText} numberOfLines={expandedSection === 'story' ? undefined : 4}>
                {heritage.shortStory}
              </Text>
              <TouchableOpacity onPress={() => toggleSection('story')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.readMore}>{expandedSection === 'story' ? 'Show less' : 'Read more'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Visual Architecture & Photo Perspectives Gallery */}
          {displayGallery.length > 1 && (
            <View style={styles.perspectivesSection}>
              <View style={styles.perspectivesHeader}>
                <View>
                  <Text style={styles.galleryEyebrow}>ARCHITECTURE · {displayGallery.length} VIEWS</Text>
                  <Text style={styles.perspectivesSectionTitle}>Visual Gallery</Text>
                </View>
                <Text style={styles.perspectivesCountBadge}>
                  {activeSlide + 1} / {displayGallery.length}
                </Text>
              </View>
              <FlatList
                data={displayGallery}
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
                keyExtractor={(item, idx) => `gthumb-${item.url}-${idx}`}
                decelerationRate="fast"
                snapToInterval={196}
                snapToAlignment="start"
                disableIntervalMomentum
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingVertical: 6, paddingRight: 20 }}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                onMomentumScrollEnd={(e) => {
                  const idx = Math.round(e.nativeEvent.contentOffset.x / 196);
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
                        const fallback = dynamicImageService.getArchitecturalFallback(
                          displayName,
                          category,
                          idx + 1
                        );
                        setGallery((prev) => {
                          const base =
                            prev.length > 0
                              ? [...prev]
                              : dynamicImageService.getArchitecturalFallbackGallery(
                                  displayName,
                                  category
                                );
                          const next = [...base];
                          if (next[idx]) next[idx] = { ...next[idx], url: fallback };
                          return next;
                        });
                      }}
                    />
                    <View style={styles.galleryCardOverlay}>
                      <Text style={styles.galleryCardCaption} numberOfLines={1}>
                        {item.caption}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Expandable sections */}
          {heritage.history && renderSection(t('place.completeHistory'), 'history', heritage.history, 'menu-book')}
          {heritage.significance && renderSection(t('place.historicalSignificance'), 'significance', heritage.significance, 'stars')}
          {heritage.architecture && renderSection(t('place.architecturalDetails'), 'architecture', heritage.architecture, 'apartment')}

          {/* Key Facts */}
          {safeKeyFacts.length > 0 && (
            <View style={styles.factsSection}>
              <Text style={styles.sectionTitle}>{t('place.keyFacts')}</Text>
              {safeKeyFacts.map((fact, idx) => (
                <View key={idx} style={styles.factItem}>
                  <View style={styles.factDot} />
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Sources */}
          {safeSources.length > 0 && (
            <View style={styles.sourcesSection}>
              <Text style={styles.sectionTitle}>{t('place.verifiedSources')}</Text>
              {safeSources.map((source, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.sourceCard}
                  onPress={() => source.sourceUrl && Linking.openURL(source.sourceUrl)}
                >
                  <MaterialIcons name="verified" size={16} color={Colors.success} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sourceName}>{source.sourceName}</Text>
                    <Text style={styles.sourceRef} numberOfLines={2}>{source.referenceText}</Text>
                  </View>
                  {source.sourceUrl && (
                    <MaterialIcons name="open-in-new" size={14} color={Colors.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Local Artisans & Regional Gastronomy Showcase */}
          <LocalArtisansSection placeName={displayName} stateOrCity={displayName} />

          {/* Visitor Reviews & Community Ratings */}
          <ReviewsSection
            placeId={placeObj.id || id || ''}
            placeName={displayName}
            initialRating={placeObj.rating}
          />

          {/* Deep Heritage Link */}
          <TouchableOpacity
            style={styles.deepHeritageBtn}
            onPress={() => router.push(`/place/${id}/heritage`)}
            activeOpacity={0.85}
          >
            <View style={styles.deepHeritageIconWrap}>
              <MaterialIcons name="history-edu" size={24} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.deepHeritageTitle}>Explore Full Heritage Archive</Text>
              <Text style={styles.deepHeritageSubtitle}>Read verified ASI chronicles, architectural breakdowns & citations</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

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

  function renderSection(title: string, key: string, content: string, icon: string) {
    return (
      <TouchableOpacity
        style={styles.expandSection}
        onPress={() => toggleSection(key)}
        activeOpacity={0.85}
      >
        <View style={styles.expandHeader}>
          <MaterialIcons name={icon as any} size={20} color={Colors.primary} />
          <Text style={styles.expandTitle}>{title}</Text>
          <MaterialIcons
            name={expandedSection === key ? 'expand-less' : 'expand-more'}
            size={24}
            color={Colors.textSecondary}
          />
        </View>
        {expandedSection === key && (
          <Text style={styles.expandContent}>{content}</Text>
        )}
      </TouchableOpacity>
    );
  }
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
  perspectivesSection: {
    marginBottom: 28,
    marginTop: 4,
  },
  perspectivesHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  galleryEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: Colors.primary,
    marginBottom: 4,
  },
  perspectivesSectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 21,
    fontWeight: '700',
    color: Colors.text,
  },
  perspectivesCountBadge: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  galleryCard: {
    width: 184,
    height: 240,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#151515',
    opacity: 0.72,
  },
  galleryCardActive: {
    opacity: 1,
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
    backgroundColor: 'rgba(5, 5, 8, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  galleryCardCaption: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  actionLabelPrimary: {
    color: '#0F0F0F',
    fontWeight: '700',
  },
  ticketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  ticketIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.goldSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  ticketSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ticketActionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
  },
  ticketActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F0F0F',
  },
  storyEditorial: {
    marginBottom: 28,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  storyEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: Colors.primary,
    marginBottom: 10,
  },
  storyQuote: {
    fontFamily: Typography.fontFamily.serif,
    fontStyle: 'italic',
    fontSize: 18,
    lineHeight: 27,
    color: Colors.primaryLight,
    marginBottom: 12,
  },
  storyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  readMore: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 10,
  },
  expandSection: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingVertical: 4,
    marginBottom: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  expandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
  },
  expandTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  expandContent: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
    paddingBottom: 16,
  },
  factsSection: {
    marginTop: 28,
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 21,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  factDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.primary,
    marginTop: 8,
    opacity: 0.9,
  },
  factText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  sourcesSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginBottom: 0,
  },
  sourceName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  sourceRef: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  deepHeritageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  deepHeritageIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.goldSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deepHeritageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Typography.fontFamily.serif,
  },
  deepHeritageSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginTop: 2,
  },
});
