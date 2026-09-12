import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue, StyleProp, ViewStyle, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface SkeletonItemProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonItem({
  width = '100%',
  height = 16,
  borderRadius = BorderRadius.sm,
  style,
}: SkeletonItemProps) {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: Colors.surfaceHighlight,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
}

// 1. Single Review Card Skeleton
export function ReviewCardSkeleton() {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.cardHeader}>
        <SkeletonItem width={38} height={38} borderRadius={19} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <SkeletonItem width={120} height={14} />
            <SkeletonItem width={80} height={14} borderRadius={4} />
          </View>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <SkeletonItem width={60} height={10} />
            <SkeletonItem width={70} height={10} />
          </View>
        </View>
      </View>

      <View style={{ gap: 6, marginTop: 4 }}>
        <SkeletonItem width={100} height={12} />
        <SkeletonItem width={220} height={15} />
      </View>

      <View style={{ gap: 6, marginTop: 2 }}>
        <SkeletonItem width="100%" height={13} />
        <SkeletonItem width="92%" height={13} />
        <SkeletonItem width="75%" height={13} />
      </View>

      <View style={styles.cardFooter}>
        <SkeletonItem width={85} height={20} borderRadius={4} />
        <SkeletonItem width={70} height={12} />
      </View>
    </View>
  );
}

// 2. Full Reviews Section Skeleton (used inside Place Detail)
export function ReviewsSectionSkeleton() {
  return (
    <View style={styles.reviewsContainer}>
      {/* Header Skeleton */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <SkeletonItem width={24} height={24} borderRadius={12} />
          <SkeletonItem width={180} height={20} />
        </View>
        <SkeletonItem width={95} height={28} borderRadius={14} />
      </View>
      <SkeletonItem width={260} height={12} style={{ marginBottom: Spacing.md }} />

      {/* Overview Card Skeleton */}
      <View style={styles.overviewCard}>
        <View style={styles.scoreContainer}>
          <SkeletonItem width={60} height={36} borderRadius={6} />
          <SkeletonItem width={90} height={14} style={{ marginVertical: 6 }} />
          <SkeletonItem width={80} height={10} />
          <SkeletonItem width={75} height={16} borderRadius={4} style={{ marginTop: 6 }} />
        </View>

        <View style={styles.overviewDivider} />

        <View style={styles.barsContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.barRow}>
              <SkeletonItem width={20} height={10} />
              <SkeletonItem width="72%" height={8} borderRadius={4} />
              <SkeletonItem width={24} height={10} />
            </View>
          ))}
        </View>
      </View>

      {/* Filter Chips Skeleton */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: Spacing.sm }}>
        <SkeletonItem width={65} height={28} borderRadius={14} />
        <SkeletonItem width={85} height={28} borderRadius={14} />
        <SkeletonItem width={85} height={28} borderRadius={14} />
        <SkeletonItem width={95} height={28} borderRadius={14} />
      </View>

      {/* Review Cards Skeletons */}
      <View style={{ gap: Spacing.md, marginTop: Spacing.xs }}>
        <ReviewCardSkeleton />
        <ReviewCardSkeleton />
        <ReviewCardSkeleton />
      </View>
    </View>
  );
}

// 3. Full Place Detail Screen Skeleton (Hero, badges, radar, story, reviews)
export function PlaceDetailSkeleton({ onBack }: { onBack?: () => void }) {
  return (
    <View style={styles.screenContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section Skeleton */}
        <View style={styles.heroSection}>
          <SkeletonItem width="100%" height="100%" borderRadius={0} />

          {/* Top navigation overlay */}
          <View style={styles.topBar}>
            {onBack ? (
              <TouchableOpacity style={styles.topBtn} onPress={onBack}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
              </TouchableOpacity>
            ) : (
              <SkeletonItem width={40} height={40} borderRadius={20} />
            )}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <SkeletonItem width={40} height={40} borderRadius={20} />
              <SkeletonItem width={40} height={40} borderRadius={20} />
            </View>
          </View>

          {/* Hero Bottom Meta */}
          <View style={styles.heroContent}>
            <SkeletonItem width={80} height={20} borderRadius={10} style={{ marginBottom: 8 }} />
            <SkeletonItem width="80%" height={26} style={{ marginBottom: 8 }} />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <SkeletonItem width={50} height={14} borderRadius={4} />
              <SkeletonItem width={80} height={14} borderRadius={4} />
              <SkeletonItem width={100} height={14} borderRadius={4} />
            </View>
          </View>
        </View>

        {/* Body Content */}
        <View style={styles.content}>
          {/* Action Buttons Row Skeleton */}
          <View style={styles.actionsRow}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.actionBtnSkeleton}>
                <SkeletonItem width={24} height={24} borderRadius={12} />
                <SkeletonItem width={46} height={10} style={{ marginTop: 4 }} />
              </View>
            ))}
          </View>

          {/* Live Radar Weather / Crowd Bar Skeleton */}
          <View style={styles.radarCardSkeleton}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <SkeletonItem width={140} height={16} />
              <SkeletonItem width={70} height={16} borderRadius={8} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <SkeletonItem width="48%" height={40} borderRadius={6} />
              <SkeletonItem width="48%" height={40} borderRadius={6} />
            </View>
          </View>

          {/* ASI Ticket Card Skeleton */}
          <View style={styles.ticketCardSkeleton}>
            <SkeletonItem width={36} height={36} borderRadius={8} />
            <View style={{ flex: 1, gap: 4 }}>
              <SkeletonItem width={160} height={15} />
              <SkeletonItem width={200} height={11} />
            </View>
            <SkeletonItem width={75} height={24} borderRadius={12} />
          </View>

          {/* 2-Minute Story Card Skeleton */}
          <View style={styles.storyCardSkeleton}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <SkeletonItem width={150} height={16} />
              <SkeletonItem width={20} height={20} borderRadius={10} />
            </View>
            <SkeletonItem width="100%" height={12} style={{ marginTop: 10 }} />
            <SkeletonItem width="95%" height={12} style={{ marginTop: 6 }} />
            <SkeletonItem width="70%" height={12} style={{ marginTop: 6 }} />
          </View>

          {/* Expandable Sections Skeleton */}
          {[1, 2].map((i) => (
            <View key={i} style={styles.expandSectionSkeleton}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <SkeletonItem width={20} height={20} borderRadius={10} />
                <SkeletonItem width={140} height={16} />
              </View>
              <SkeletonItem width={18} height={18} borderRadius={9} />
            </View>
          ))}

          {/* Reviews Section Skeleton */}
          <ReviewsSectionSkeleton />
        </View>
      </ScrollView>
    </View>
  );
}

// 4. Place Card Skeletons (For Home & Explore screens)
export function PlaceCardHorizontalSkeleton() {
  return (
    <View style={styles.cardHorizontal}>
      <SkeletonItem width="100%" height={125} borderRadius={BorderRadius.md} />
      <View style={{ padding: 8, gap: 6 }}>
        <SkeletonItem width="80%" height={14} />
        <SkeletonItem width="50%" height={10} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
          <SkeletonItem width={40} height={12} />
          <SkeletonItem width={50} height={12} />
        </View>
      </View>
    </View>
  );
}

export function PlaceCardVerticalSkeleton() {
  return (
    <View style={styles.cardVertical}>
      <SkeletonItem width={100} height={100} borderRadius={BorderRadius.md} />
      <View style={{ flex: 1, gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <SkeletonItem width={70} height={14} borderRadius={4} />
          <SkeletonItem width={35} height={14} />
        </View>
        <SkeletonItem width="85%" height={16} />
        <SkeletonItem width="95%" height={11} />
        <SkeletonItem width="60%" height={11} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroSection: {
    height: 320,
    position: 'relative',
    backgroundColor: Colors.surface,
  },
  topBar: {
    position: 'absolute',
    top: 48,
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 10, 15, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    right: Spacing.base,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBtnSkeleton: {
    alignItems: 'center',
    width: 65,
  },
  radarCardSkeleton: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ticketCardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  storyCardSkeleton: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  expandSectionSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Reviews Skeleton Styles
  reviewsContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  overviewCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },
  overviewDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  barsContainer: {
    flex: 1,
    gap: 7,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
    marginTop: 4,
  },

  // Place Cards
  cardHorizontal: {
    width: 210,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.md,
    overflow: 'hidden',
  },
  cardVertical: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
});
