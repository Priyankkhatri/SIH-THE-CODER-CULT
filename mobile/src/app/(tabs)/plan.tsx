import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, INTERESTS_OPTIONS, DURATION_OPTIONS } from '../../constants/theme';
import { useUserStore } from '../../stores';
import { useTranslation } from '../../hooks/useTranslation';
import { itineraryApi } from '../../services/api';
import { useLocation } from '../../hooks/useLocation';
import { TimelineItem } from '../../components/TimelineItem';

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
      }
    } catch (error) {
      // Fallback demo itinerary
      setItinerary(DEMO_ITINERARY);
      setShowForm(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPlan = () => {
    setItinerary(null);
    setShowForm(true);
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
              <TouchableOpacity style={styles.startNavBtn}>
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

const DEMO_ITINERARY: ItineraryData = {
  title: '90min Heritage Tour',
  duration: '90min',
  totalTimeMinutes: 85,
  stops: 3,
  items: [
    {
      placeId: 'p5-sursagar',
      placeName: 'Sursagar Lake',
      order: 1,
      visitDuration: 20,
      travelTime: 5,
      travelMode: 'walk',
      reason: 'Very close to your current location',
      distance: 0.8,
      imageUrl: null,
      shortStory: null,
    },
    {
      placeId: 'p1-laxmi-vilas',
      placeName: 'Laxmi Vilas Palace',
      order: 2,
      visitDuration: 35,
      travelTime: 8,
      travelMode: 'drive',
      reason: 'Matches your interest in heritage',
      distance: 2.3,
      imageUrl: null,
      shortStory: null,
    },
    {
      placeId: 'p6-sayaji-baug',
      placeName: 'Sayaji Baug',
      order: 3,
      visitDuration: 25,
      travelTime: 5,
      travelMode: 'walk',
      reason: 'Highly rated heritage site (4.5★)',
      distance: 1.2,
      imageUrl: null,
      shortStory: null,
    },
  ],
};

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
