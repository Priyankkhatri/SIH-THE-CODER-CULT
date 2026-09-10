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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CATEGORY_COLORS } from '../../constants/theme';
import { usePlacesStore, useChatStore, useUserStore } from '../../stores';
import { heritageApi, placesApi } from '../../services/api';
import { useSpeech } from '../../hooks/useSpeech';

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
  const { favorites, toggleFavorite } = usePlacesStore();
  const { setContext } = useChatStore();
  const { speak, stop, isSpeaking } = useSpeech();

  const [heritage, setHeritage] = useState<HeritageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('story');

  const isFavorite = id ? favorites.includes(id) : false;

  useEffect(() => {
    if (id) loadHeritage();
  }, [id]);

  const loadHeritage = async () => {
    setIsLoading(true);
    try {
      const response: any = await heritageApi.getByPlaceId(id!, language);
      if (response?.data) {
        setHeritage(response.data);
      }
    } catch (error) {
      // Use demo data
      setHeritage(getDemoHeritage(id!));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAI = () => {
    if (heritage) {
      setContext(id!, heritage.placeName || heritage.place.name);
      router.push('/(tabs)/ai');
    }
  };

  const handleListen = () => {
    if (isSpeaking) {
      stop();
    } else if (heritage) {
      speak(heritage.shortStory, language);
    }
  };

  const handleDirections = () => {
    if (!heritage) return;
    const { latitude, longitude } = heritage.place;
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${heritage.place.name})`,
    });
    if (url) Linking.openURL(url);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading heritage information...</Text>
      </View>
    );
  }

  if (!heritage) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="error-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.errorText}>Heritage record not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categoryColor = CATEGORY_COLORS[heritage.place.category] || Colors.primary;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: heritage.place.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
            transition={400}
          />
          <View style={styles.heroOverlay} />

          {/* Top buttons */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topBtn} onPress={() => id && toggleFavorite(id)}>
              <MaterialIcons
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isFavorite ? Colors.error : Colors.text}
              />
            </TouchableOpacity>
          </View>

          {/* Hero title */}
          <View style={styles.heroContent}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '30' }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {heritage.place.category.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.heroTitle}>{heritage.placeName || heritage.place.name}</Text>
            <View style={styles.heroMeta}>
              {heritage.place.rating && (
                <View style={styles.metaItem}>
                  <MaterialIcons name="star" size={16} color={Colors.primary} />
                  <Text style={styles.metaText}>{heritage.place.rating}</Text>
                </View>
              )}
              {heritage.period && (
                <View style={styles.metaItem}>
                  <MaterialIcons name="history" size={16} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{heritage.period}</Text>
                </View>
              )}
              {heritage.place.openingHours && (
                <View style={styles.metaItem}>
                  <MaterialIcons name="schedule" size={14} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{heritage.place.openingHours.split('(')[0].trim()}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Action buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleAskAI}>
              <MaterialIcons name="auto-awesome" size={20} color={Colors.primary} />
              <Text style={styles.actionLabel}>Ask AI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleListen}>
              <MaterialIcons name={isSpeaking ? 'stop' : 'headphones'} size={20} color={Colors.accent} />
              <Text style={styles.actionLabel}>{isSpeaking ? 'Stop' : 'Listen'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/camera')}>
              <MaterialIcons name="camera-alt" size={20} color={Colors.secondary} />
              <Text style={styles.actionLabel}>Identify</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleDirections}>
              <MaterialIcons name="directions" size={20} color={Colors.success} />
              <Text style={styles.actionLabel}>Directions</Text>
            </TouchableOpacity>
          </View>

          {/* 2-Minute Heritage Story */}
          <TouchableOpacity style={styles.storyCard} onPress={() => toggleSection('story')} activeOpacity={0.9}>
            <View style={styles.storyHeader}>
              <Text style={styles.storyBadge}>⭐ 2-Minute Heritage Story</Text>
              <MaterialIcons
                name={expandedSection === 'story' ? 'expand-less' : 'expand-more'}
                size={24}
                color={Colors.textSecondary}
              />
            </View>
            {expandedSection === 'story' && (
              <Text style={styles.storyText}>{heritage.shortStory}</Text>
            )}
          </TouchableOpacity>

          {/* Expandable sections */}
          {renderSection('History', 'history', heritage.history, 'menu-book')}
          {renderSection('Significance', 'significance', heritage.significance, 'stars')}
          {heritage.architecture && renderSection('Architecture', 'architecture', heritage.architecture, 'apartment')}

          {/* Key Facts */}
          {heritage.keyFacts.length > 0 && (
            <View style={styles.factsSection}>
              <Text style={styles.sectionTitle}>📋 Key Facts</Text>
              {heritage.keyFacts.map((fact, idx) => (
                <View key={idx} style={styles.factItem}>
                  <View style={styles.factDot} />
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Sources */}
          {heritage.sources.length > 0 && (
            <View style={styles.sourcesSection}>
              <Text style={styles.sectionTitle}>📚 Verified Sources</Text>
              {heritage.sources.map((source, idx) => (
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
        </View>
      </ScrollView>
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
  const demos: Record<string, HeritageDetail> = {
    'p1-laxmi-vilas': {
      shortStory: 'Laxmi Vilas Palace stands as one of the grandest royal residences ever built. Commissioned by Maharaja Sayajirao III in 1878 and completed in 1890, this magnificent palace was designed by British architect Major Charles Mant. Covering an astounding 500 acres, it is four times the size of Buckingham Palace. The palace is a masterpiece of Indo-Saracenic architecture, blending Hindu, Gothic, and Mughal elements.',
      history: 'The history of Laxmi Vilas Palace is inseparable from the Gaekwad dynasty of Baroda. Maharaja Sayajirao III envisioned a palace that would reflect the progressive spirit of his rule. Construction began in 1878 and completed in 1890 at a cost of ₹60 lakh.',
      significance: 'Laxmi Vilas Palace holds immense cultural significance as a symbol of the progressive Gaekwad dynasty and represents the synthesis of Indian and European architectural traditions.',
      architecture: 'The palace exemplifies Indo-Saracenic Revival architecture with ornate domes, intricate jaali work, a grand Durbar Hall with Italian mosaic floors, and Venetian chandeliers.',
      keyFacts: ['Built: 1878-1890', 'Architect: Major Charles Mant', 'Area: 500 acres', 'Cost: ₹60 lakh', 'Style: Indo-Saracenic Revival'],
      period: '1878-1890',
      placeName: 'Laxmi Vilas Palace',
      sources: [{ sourceName: 'Archaeological Survey of India', sourceUrl: 'https://asi.nic.in', referenceText: 'Listed as a Grade I heritage structure.' }],
      place: { id: 'p1-laxmi-vilas', name: 'Laxmi Vilas Palace', latitude: 22.2932, longitude: 73.1903, category: 'heritage', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lukshmi_Vilas_Palace.jpg/1280px-Lukshmi_Vilas_Palace.jpg', openingHours: '9:30 AM - 5:00 PM', rating: 4.6 },
    },
  };

  return demos[placeId] || {
    shortStory: 'This is a heritage site in Vadodara, Gujarat. Connect to the backend server to load detailed heritage information.',
    history: 'Historical information available when connected to the server.',
    significance: 'Cultural significance details available when connected.',
    keyFacts: ['Located in Vadodara, Gujarat', 'Part of the heritage trail'],
    period: 'Historical',
    placeName: 'Heritage Site',
    sources: [],
    place: { id: placeId, name: 'Heritage Site', latitude: 22.3072, longitude: 73.1812, category: 'heritage', rating: 4.0 },
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
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 15, 0.4)',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    paddingBottom: Spacing['2xl'],
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
    fontSize: Typography.sizes['2xl'],
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing['2xl'],
    paddingVertical: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  storyCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyBadge: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.primary,
  },
  storyText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    lineHeight: 24,
    marginTop: Spacing.md,
  },
  expandSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  expandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expandTitle: {
    flex: 1,
    fontSize: Typography.sizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  expandContent: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  factsSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  factDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 7,
  },
  factText: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sourcesSection: {
    marginTop: Spacing.base,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  sourceName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  sourceRef: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    lineHeight: 16,
  },
});
