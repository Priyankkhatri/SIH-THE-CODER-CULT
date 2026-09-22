import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';
import { dynamicImageService } from '../services/dynamicImageService';
import { ScalePressable } from './common/MicroAnimations';

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
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  onNavigate?: () => void;
  onRemove?: () => void;
}

export function TimelineItem({
  item,
  isLast,
  isCompleted = false,
  onToggleComplete,
  onNavigate,
  onRemove,
}: TimelineItemProps) {
  const { t, language } = useTranslation();
  const [imgUrl, setImgUrl] = React.useState<string | null>(item.imageUrl || null);

  React.useEffect(() => {
    setImgUrl(item.imageUrl || null);
  }, [item.imageUrl]);
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
        <ScalePressable
          style={[styles.dot, isCompleted && styles.dotCompleted]}
          onPress={onToggleComplete}
          disabled={!onToggleComplete}
        >
          {isCompleted ? (
            <MaterialIcons name="check" size={15} color="#0A0A0A" />
          ) : (
            <Text style={styles.orderText}>{item.order}</Text>
          )}
        </ScalePressable>
        {!isLast && <View style={[styles.line, isCompleted && styles.lineCompleted]} />}
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
          {imgUrl ? (
            <ExpoImage
              source={{ uri: imgUrl }}
              style={styles.thumbImage}
              contentFit="cover"
              transition={200}
              onError={() => {
                const fallback = dynamicImageService.getArchitecturalFallback(item.placeName, 'heritage', 0);
                setImgUrl(fallback);
              }}
            />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <MaterialIcons name="account-balance" size={24} color={Colors.primary} />
            </View>
          )}

          <View style={styles.textDetails}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text style={[styles.placeName, isCompleted && styles.placeNameCompleted]} numberOfLines={2}>
                {item.placeName}
              </Text>
              {isCompleted && (
                <View style={styles.completedBadge}>
                  <MaterialIcons name="check-circle" size={11} color="#10B981" />
                  <Text style={styles.completedBadgeText}>Visited</Text>
                </View>
              )}
            </View>
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
            <ScalePressable
              style={styles.removeBtn}
              onPress={onRemove}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="close" size={18} color={Colors.textMuted} />
            </ScalePressable>
          )}
        </View>

        <View style={styles.reasonRow}>
          <MaterialIcons name="lightbulb" size={13} color={Colors.warning} />
          <Text style={styles.reasonText} numberOfLines={2}>
            {item.reason}
          </Text>
        </View>

        {onNavigate && (
          <ScalePressable
            style={styles.navigateRowBtn}
            onPress={onNavigate}
          >
            <MaterialIcons name="navigation" size={14} color={Colors.primary} />
            <Text style={styles.navigateRowText}>Navigate to this stop</Text>
          </ScalePressable>
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
  dotCompleted: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
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
  lineCompleted: {
    backgroundColor: '#10B981',
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
  placeNameCompleted: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
    marginBottom: 4,
  },
  completedBadgeText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '700',
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
