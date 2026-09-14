import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

interface TimelineItemProps {
  item: {
    placeId?: string;
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
  onNavigate?: () => void;
  onRemove?: () => void;
}

export function TimelineItem({ item, isLast, onNavigate, onRemove }: TimelineItemProps) {
  const { t, language } = useTranslation();
  const kmUnit = t('common.km');
  const travelModeText =
    item.travelMode === 'drive'
      ? language === 'hi'
        ? 'गाड़ी'
        : language === 'gu'
        ? 'ગાડી'
        : 'Drive'
      : t('plan.walk') || 'Walk';

  return (
    <View style={styles.container}>
      {/* Timeline connector */}
      <View style={styles.timelineColumn}>
        <View style={styles.dot}>
          <Text style={styles.orderText}>{item.order}</Text>
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Content Card */}
      <View style={[styles.card, isLast && { marginBottom: 0 }]}>
        {/* Travel info (between stops) */}
        {item.order > 1 && (
          <View style={styles.travelInfo}>
            <MaterialIcons
              name={item.travelMode === 'drive' ? 'directions-car' : 'directions-walk'}
              size={14}
              color={Colors.primary}
            />
            <Text style={styles.travelText}>
              {item.travelTime} {t('plan.travelTime')} ({travelModeText}) · {item.distance} {kmUnit}
            </Text>
          </View>
        )}

        <View style={styles.cardMainRow}>
          {item.imageUrl ? (
            <ExpoImage
              source={{ uri: item.imageUrl }}
              style={styles.thumbImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <MaterialIcons name="account-balance" size={24} color={Colors.primary} />
            </View>
          )}

          <View style={styles.textDetails}>
            <Text style={styles.placeName} numberOfLines={2}>
              {item.placeName}
            </Text>
            <View style={styles.detailsRow}>
              <View style={styles.detailChip}>
                <MaterialIcons name="schedule" size={12} color={Colors.primary} />
                <Text style={styles.detailText}>
                  {item.visitDuration} {t('plan.minsVisit')}
                </Text>
              </View>
            </View>
          </View>

          {onRemove && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                onRemove();
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="close" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.reasonRow}>
          <MaterialIcons name="lightbulb" size={13} color={Colors.warning} />
          <Text style={styles.reasonText} numberOfLines={2}>
            {item.reason}
          </Text>
        </View>

        {onNavigate && (
          <TouchableOpacity
            style={styles.navigateRowBtn}
            onPress={(e) => {
              e.stopPropagation?.();
              onNavigate();
            }}
            activeOpacity={0.8}
          >
            <MaterialIcons name="navigation" size={14} color={Colors.primary} />
            <Text style={styles.navigateRowText}>Navigate to this stop</Text>
          </TouchableOpacity>
        )}
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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  orderText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
    color: '#0A0A0A',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 4,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  travelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  travelText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  cardMainRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  thumbImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceHighlight,
  },
  thumbPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDetails: {
    flex: 1,
  },
  placeName: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  detailText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  removeBtn: {
    padding: 4,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  reasonText: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
  },
  navigateRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  navigateRowText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
});
