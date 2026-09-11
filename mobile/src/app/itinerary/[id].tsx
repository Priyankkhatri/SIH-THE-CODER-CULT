import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { itineraryApi } from '../../services/api';
import { TimelineItem } from '../../components/TimelineItem';

export default function ItineraryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [itinerary, setItinerary] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadItinerary();
    }
  }, [id]);

  const loadItinerary = async () => {
    setIsLoading(true);
    try {
      const res: any = await itineraryApi.getById(id as string);
      if (res.success && res.data) {
        setItinerary(res.data);
      } else {
        // Fallback demo itinerary data if created in-memory with local ID
        setItinerary({
          id,
          title: '90min Curated Vadodara Heritage Tour',
          duration: '90min',
          totalTime: 85,
          items: [
            {
              order: 1,
              placeId: 'p1-laxmi-vilas',
              placeName: 'Laxmi Vilas Palace',
              visitDuration: 40,
              travelTime: 5,
              travelMode: 'walk',
              reason: 'Matches your interest in Heritage & Royal Architecture',
            },
            {
              order: 2,
              placeId: 'p2-baroda-museum',
              placeName: 'Baroda Museum & Picture Gallery',
              visitDuration: 30,
              travelTime: 10,
              travelMode: 'walk',
              reason: 'Houses 100,000+ artifacts and Mughal miniatures',
            },
          ],
        });
      }
    } catch (e) {
      // Demo fallback
      setItinerary({
        id,
        title: '90min Curated Vadodara Heritage Tour',
        duration: '90min',
        totalTime: 85,
        items: [
          {
            order: 1,
            placeId: 'p1-laxmi-vilas',
            placeName: 'Laxmi Vilas Palace',
            visitDuration: 40,
            travelTime: 5,
            travelMode: 'walk',
            reason: 'Matches your interest in Heritage & Royal Architecture',
          },
          {
            order: 2,
            placeId: 'p2-baroda-museum',
            placeName: 'Baroda Museum & Picture Gallery',
            visitDuration: 30,
            travelTime: 10,
            travelMode: 'walk',
            reason: 'Houses 100,000+ artifacts and Mughal miniatures',
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Remove Itinerary',
      'Are you sure you want to remove this saved tour route?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (id) await itineraryApi.delete(id);
              router.replace('/(tabs)/plan');
            } catch (e) {
              router.replace('/(tabs)/plan');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading itinerary route...</Text>
      </View>
    );
  }

  if (!itinerary) {
    return (
      <View style={[styles.errorContainer, { paddingTop: insets.top }]}>
        <MaterialIcons name="route" size={48} color={Colors.primary} />
        <Text style={styles.errorTitle}>Itinerary Not Found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/plan')}>
          <Text style={styles.backButtonText}>Plan a New Tour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Itinerary Details</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <MaterialIcons name="delete-outline" size={22} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Route Stats Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.itineraryTitle}>{itinerary.title || 'Curated Heritage Tour'}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <MaterialIcons name="schedule" size={18} color={Colors.primary} />
              <Text style={styles.statValue}>{itinerary.totalTime || itinerary.totalTimeMinutes || 90}m</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <MaterialIcons name="place" size={18} color={Colors.heritage} />
              <Text style={styles.statValue}>{itinerary.items?.length || 0}</Text>
              <Text style={styles.statLabel}>Stops</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <MaterialIcons name="directions-walk" size={18} color={Colors.success} />
              <Text style={styles.statValue}>{itinerary.duration || '90min'}</Text>
              <Text style={styles.statLabel}>Target Pace</Text>
            </View>
          </View>
        </View>

        {/* Stops Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineHeading}>Turn-by-Turn Stop Schedule</Text>

          {itinerary.items && itinerary.items.map((item: any, index: number) => {
            const isLast = index === itinerary.items.length - 1;
            return (
              <View key={item.id || index} style={styles.timelineItemWrap}>
                {/* Timeline node & connector */}
                <View style={styles.nodeColumn}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberBadgeText}>{item.order || index + 1}</Text>
                  </View>
                  {!isLast && <View style={styles.connectorLine} />}
                </View>

                {/* Stop Card */}
                <TouchableOpacity
                  style={styles.stopCard}
                  onPress={() => item.placeId && router.push(`/place/${item.placeId}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.stopCardHeader}>
                    <Text style={styles.stopTitle}>{item.placeName}</Text>
                    <View style={styles.durationChip}>
                      <MaterialIcons name="timer" size={12} color={Colors.primary} />
                      <Text style={styles.durationChipText}>{item.visitDuration}m visit</Text>
                    </View>
                  </View>

                  <Text style={styles.stopReason}>{item.reason}</Text>

                  <View style={styles.stopFooter}>
                    <View style={styles.travelModeRow}>
                      <MaterialIcons
                        name={item.travelMode === 'drive' ? 'directions-car' : 'directions-walk'}
                        size={14}
                        color={Colors.textMuted}
                      />
                      <Text style={styles.travelTimeText}>
                        {index === 0 ? 'Starting point' : `${item.travelTime}m transit`}
                      </Text>
                    </View>

                    <View style={styles.viewPlaceLink}>
                      <Text style={styles.viewPlaceText}>View Details</Text>
                      <MaterialIcons name="chevron-right" size={16} color={Colors.primary} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Start Guided Navigation Button */}
        <TouchableOpacity
          style={styles.startTourBtn}
          onPress={() => {
            if (itinerary.items?.[0]?.placeId) {
              router.push(`/place/${itinerary.items[0].placeId}`);
            } else {
              router.push('/(tabs)/explore');
            }
          }}
          activeOpacity={0.85}
        >
          <MaterialIcons name="navigation" size={20} color={Colors.background} />
          <Text style={styles.startTourText}>Start Tour at Stop 1</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.xl,
  },
  errorTitle: {
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  backButtonText: {
    color: Colors.background,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.25)',
    gap: Spacing.base,
    ...Shadows.md,
  },
  itineraryTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  statBox: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  timelineSection: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  timelineHeading: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
  },
  timelineItemWrap: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  nodeColumn: {
    alignItems: 'center',
    width: 28,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    color: Colors.background,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(212, 169, 71, 0.3)',
    marginVertical: 4,
  },
  stopCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  stopCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 169, 71, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  durationChipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  stopReason: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  stopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  travelModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  travelTimeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  viewPlaceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewPlaceText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '700',
  },
  startTourBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.base,
    marginBottom: Spacing['2xl'],
    ...Shadows.md,
  },
  startTourText: {
    color: Colors.background,
    fontSize: Typography.sizes.base,
    fontWeight: '700',
  },
});
