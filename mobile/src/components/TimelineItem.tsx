import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

interface TimelineItemProps {
  item: {
    placeName: string;
    visitDuration: number;
    travelTime: number;
    travelMode: string;
    reason: string;
    distance: number;
    imageUrl?: string | null;
    order: number;
  };
  isLast: boolean;
}

export function TimelineItem({ item, isLast }: TimelineItemProps) {
  const { t } = useTranslation();
  const kmUnit = t('common.km');
  const travelModeText = item.travelMode === 'drive' ? (t('language') === 'hi' ? 'गाड़ी' : t('language') === 'gu' ? 'ગાડી' : 'drive') : t('plan.walk');

  return (
    <View style={styles.container}>
      {/* Timeline connector */}
      <View style={styles.timelineColumn}>
        <View style={styles.dot}>
          <Text style={styles.orderText}>{item.order}</Text>
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Content */}
      <View style={[styles.card, isLast && { marginBottom: 0 }]}>
        {/* Travel info (between stops) */}
        {item.order > 1 && (
          <View style={styles.travelInfo}>
            <MaterialIcons
              name={item.travelMode === 'drive' ? 'directions-car' : 'directions-walk'}
              size={14}
              color={Colors.accent}
            />
            <Text style={styles.travelText}>
              {item.travelTime} {t('plan.travelTime')} ({travelModeText}) · {item.distance} {kmUnit}
            </Text>
          </View>
        )}

        <Text style={styles.placeName}>{item.placeName}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailChip}>
            <MaterialIcons name="schedule" size={13} color={Colors.primary} />
            <Text style={styles.detailText}>{item.visitDuration} {t('plan.minsVisit')}</Text>
          </View>
        </View>

        <View style={styles.reasonRow}>
          <MaterialIcons name="lightbulb" size={14} color={Colors.warning} />
          <Text style={styles.reasonText}>{item.reason}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineColumn: {
    alignItems: 'center',
    width: 32,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  orderText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
    color: Colors.textInverse,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  travelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  travelText: {
    fontSize: Typography.sizes.xs,
    color: Colors.accent,
    fontWeight: '500',
  },
  placeName: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceHighlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  detailText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  reasonText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
    flex: 1,
  },
});
