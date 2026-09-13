import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, INTERESTS_OPTIONS, DURATION_OPTIONS } from '../../constants/theme';
import { useUserStore, usePlacesStore, Place } from '../../stores';
import { useTranslation } from '../../hooks/useTranslation';
import { itineraryApi } from '../../services/api';
import { useLocation } from '../../hooks/useLocation';
import { TimelineItem } from '../../components/TimelineItem';
import { ALL_SEED_PLACES } from '../../utils/seedPlaces';
import { dynamicImageService } from '../../services/dynamicImageService';
import { haversineDistance } from '../../utils/routeService';

interface ItineraryData {
  title: string;
  duration: string;
  totalTimeMinutes: number;
  stops: number;
  items: Array<{
    placeId: string;
    placeName: string;
    order: number;
    visitDuration: number;
    travelTime: number;
    travelMode: string;
    reason: string;
    distance: number;
    imageUrl: string | null;
    shortStory: string | null;
  }>;
}

export default function PlanScreen() {
  const router = useRouter();
  const { interests, travelStyle, duration, language } = useUserStore();
  const { t } = useTranslation();
  const location = useLocation();
  const [selectedDuration, setSelectedDuration] = useState(duration);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(interests);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [showForm, setShowForm] = useState(true);

  const toggleInterest = (key: string) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    try {
      const response: any = await itineraryApi.generate({
        latitude: location.latitude,
        longitude: location.longitude,
        interests: selectedInterests,
        duration: selectedDuration,
        travelStyle,
      });
      if (response?.data) {
        setItinerary(response.data);
        setShowForm(false);
      } else {
        const pool = usePlacesStore.getState().places;
        const lat = location.latitude ?? 22.3072;
        const lng = location.longitude ?? 73.1812;
        const dynamicTour = generateDynamicItinerary(pool, lat, lng, selectedInterests, selectedDuration);
        setItinerary(dynamicTour);
        setShowForm(false);
      }
    } catch (error) {
      const pool = usePlacesStore.getState().places;
      const lat = location.latitude ?? 22.3072;
      const lng = location.longitude ?? 73.1812;
      const dynamicTour = generateDynamicItinerary(pool, lat, lng, selectedInterests, selectedDuration);
      setItinerary(dynamicTour);
      setShowForm(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPlan = () => {
    setItinerary(null);
    setShowForm(true);
  };

  const handleStartNavigation = () => {
    if (itinerary && itinerary.items.length > 0) {
      const firstStop = itinerary.items[0];
      const allPlaces = usePlacesStore.getState().places;
      const matched = allPlaces.find((p) => p.id === firstStop.placeId);
      const lat = matched?.latitude || location.latitude || 22.3072;
      const lng = matched?.longitude || location.longitude || 73.1812;
      const url = Platform.select({
        ios: `maps:0,0?q=${lat},${lng}`,
        android: `geo:${lat},${lng}?q=${lat},${lng}(${firstStop.placeName})`,
        web: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      });
      if (url) Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🗺️ {t('plan.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('plan.subtitle')}</Text>
        </View>
        {itinerary && (
          <TouchableOpacity style={styles.resetBtn} onPress={resetPlan}>
            <MaterialIcons name="refresh" size={20} color={Colors.primary} />
            <Text style={styles.resetText}>{t('plan.startNewPlan')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {showForm ? (
          /* Generation Form */
          <View style={styles.formSection}>
            {/* Duration */}
            <Text style={styles.formLabel}>{t('plan.duration')}</Text>
            <View style={styles.durationGrid}>
              {DURATION_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.durationCard, selectedDuration === opt.key && styles.durationActive]}
                  onPress={() => setSelectedDuration(opt.key)}
                >
                  <Text style={[styles.durationValue, selectedDuration === opt.key && styles.activeText]}>
                    {t('options.durations.' + opt.key + '.label')}
                  </Text>
                  <Text style={styles.durationDesc}>{t('options.durations.' + opt.key + '.desc')}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Interests */}
            <Text style={[styles.formLabel, { marginTop: Spacing.xl }]}>{t('plan.yourInterests')}</Text>
            <View style={styles.interestGrid}>
              {INTERESTS_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.interestChip, selectedInterests.includes(opt.key) && styles.interestActive]}
                  onPress={() => toggleInterest(opt.key)}
                >
                  <Text style={styles.interestIcon}>{opt.icon}</Text>
                  <Text style={[styles.interestLabel, selectedInterests.includes(opt.key) && styles.activeText]}>
                    {t('options.interests.' + opt.key)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Location info */}
            <View style={styles.locationInfo}>
              <MaterialIcons name="my-location" size={16} color={Colors.accent} />
              <Text style={styles.locationInfoText}>
                {language === 'hi' ? 'आरंभ:' : language === 'gu' ? 'શરૂઆત:' : 'Starting from:'} {location.city}, {location.region}
              </Text>
            </View>

            {/* Generate button */}
            <TouchableOpacity
              style={styles.generateBtn}
              onPress={generateItinerary}
              disabled={isGenerating || selectedInterests.length === 0}
              activeOpacity={0.8}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator color={Colors.textInverse} />
                  <Text style={styles.generateText}>{t('plan.generatingRoute')}</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="auto-awesome" size={22} color={Colors.textInverse} />
                  <Text style={styles.generateText}>{t('plan.generateSmartRoute')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : itinerary ? (
          /* Generated Itinerary */
          <View style={styles.itinerarySection}>
            {/* Summary card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{itinerary.title}</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <MaterialIcons name="schedule" size={18} color={Colors.primary} />
                  <Text style={styles.summaryValue}>~{itinerary.totalTimeMinutes} min</Text>
                  <Text style={styles.summaryLabel}>{t('plan.estTotalTime')}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <MaterialIcons name="place" size={18} color={Colors.accent} />
                  <Text style={styles.summaryValue}>{itinerary.stops}</Text>
                  <Text style={styles.summaryLabel}>{t('plan.stops')}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <MaterialIcons name="route" size={18} color={Colors.success} />
                  <Text style={styles.summaryValue}>{selectedDuration}</Text>
                  <Text style={styles.summaryLabel}>{t('plan.duration')}</Text>
                </View>
              </View>
            </View>

            {/* Timeline */}
            <Text style={styles.timelineTitle}>{t('plan.yourItinerary')}</Text>
            {itinerary.items.map((item, idx) => (
              <TouchableOpacity
                key={item.placeId}
                activeOpacity={0.9}
                onPress={() => router.push(`/place/${item.placeId}`)}
              >
                <TimelineItem
                  item={item}
                  isLast={idx === itinerary.items.length - 1}
                />
              </TouchableOpacity>
            ))}

            {/* Actions */}
            <View style={styles.itineraryActions}>
              <TouchableOpacity
                style={styles.startNavBtn}
                onPress={handleStartNavigation}
                activeOpacity={0.8}
              >
                <MaterialIcons name="navigation" size={20} color={Colors.textInverse} />
                <Text style={styles.startNavText}>{t('common.directions')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function generateDynamicItinerary(
  places: Place[],
  userLat: number,
  userLng: number,
  selectedInterests: string[],
  selectedDuration: string
): ItineraryData {
  let targetStops = 3;
  let targetMinutes = 90;
  let tourTitle = '90-Minute Heritage Circuit';

  if (selectedDuration === 'halfDay' || selectedDuration === 'half_day' || selectedDuration === '4h') {
    targetStops = 4;
    targetMinutes = 240;
    tourTitle = 'Half-Day Cultural Odyssey';
  } else if (selectedDuration === 'fullDay' || selectedDuration === 'full_day' || selectedDuration === '8h') {
    targetStops = 6;
    targetMinutes = 480;
    tourTitle = 'Full-Day Grand Heritage Expedition';
  }

  const pool = places && places.length > 0 ? places : ALL_SEED_PLACES;

  // Filter / score places by proximity and category match
  const scored = pool.map((p) => {
    const dist = haversineDistance(userLat, userLng, p.latitude, p.longitude);
    const categoryMatches = selectedInterests.length === 0 || selectedInterests.includes(p.category);
    const score = (categoryMatches ? 10 : 0) + (p.rating || 4.5) * 2 - Math.min(dist / 20, 8);
    return {
      place: p,
      distance: dist,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const selectedStops = scored.slice(0, targetStops);
  let totalTime = 0;

  const items = selectedStops.map((item, index) => {
    const p = item.place;
    const visitDuration = Math.round(targetMinutes / (targetStops * 1.3));
    const travelTime = Math.max(5, Math.min(45, Math.round(item.distance * 2.5)));
    totalTime += visitDuration + travelTime;

    return {
      placeId: p.id,
      placeName: p.name,
      order: index + 1,
      visitDuration,
      travelTime,
      travelMode: item.distance <= 2 ? 'walk' : 'drive',
      reason: `Matches your interest in ${p.category} (${p.rating || 4.8}★ rating, ${item.distance.toFixed(1)} km away)`,
      distance: Number(item.distance.toFixed(1)),
      imageUrl: dynamicImageService.getPlaceImage(p.name, p.category, p.imageUrl),
      shortStory: (p as any).heritageRecord?.shortStory || p.shortDescription || null,
    };
  });

  return {
    title: tourTitle,
    duration: selectedDuration,
    totalTimeMinutes: totalTime,
    stops: items.length,
    items,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 56,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
  },
  resetText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 120,
  },
  formSection: {},
  formLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  durationCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  durationActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceHighlight,
  },
  durationValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  durationDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  activeText: {
    color: Colors.primary,
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  interestActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  interestIcon: {
    fontSize: 16,
  },
  interestLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationInfoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing['2xl'],
    ...Shadows.glow,
  },
  generateText: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  itinerarySection: {},
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  summaryTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  timelineTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  itineraryActions: {
    marginTop: Spacing.xl,
    gap: 10,
  },
  startNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    ...Shadows.glow,
  },
  startNavText: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
