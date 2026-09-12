import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CATEGORY_COLORS } from '../constants/theme';
import type { Place } from '../stores';
import { useTranslation } from '../hooks/useTranslation';
import { getLiveCrowd } from '../utils/touristMeta';
import { dynamicImageService } from '../services/dynamicImageService';

const { width } = Dimensions.get('window');

interface PlaceCardProps {
  place: Place;
  onPress: (place: Place) => void;
  variant?: 'horizontal' | 'vertical';
  isFavorite?: boolean;
  onFavoriteToggle?: (placeId: string) => void;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  heritage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
  museum: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=1200&q=80',
  culture: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1200&q=80',
  activity: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80',
};

export function PlaceCard({ place, onPress, variant = 'vertical', isFavorite, onFavoriteToggle }: PlaceCardProps) {
  const { t, getPlaceName, getCategoryName } = useTranslation();
  const categoryColor = CATEGORY_COLORS[place.category] || Colors.primary;
  const placeName = getPlaceName(place);
  const categoryLabel = getCategoryName(place.category).toUpperCase();
  const kmUnit = t('common.km');
  const crowd = getLiveCrowd(place.name);

  const defaultFallback = CATEGORY_FALLBACK_IMAGES[place.category] || CATEGORY_FALLBACK_IMAGES.heritage;
  const initialUri = dynamicImageService.getPlaceImage(place.name, place.category, place.imageUrl);
  const [currentImg, setCurrentImg] = React.useState<string>(initialUri);

  React.useEffect(() => {
    let isMounted = true;
    const resolved = dynamicImageService.getPlaceImage(place.name, place.category, place.imageUrl);
    setCurrentImg(resolved);

    // If initial image is fallback, attempt background dynamic fetch from internet
    if (resolved === defaultFallback) {
      dynamicImageService
        .fetchPlaceImageAsync(place.name)
        .then((dynUrl) => {
          if (isMounted && dynUrl) {
            setCurrentImg(dynUrl);
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [place.name, place.imageUrl, place.category]);

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        onPress={() => onPress(place)}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: currentImg }}
          style={styles.horizontalImage}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          transition={250}
          onError={() => setCurrentImg(defaultFallback)}
        />
        <View style={styles.horizontalOverlay}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '30', marginBottom: 0 }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {categoryLabel}
              </Text>
            </View>
            <View style={[styles.crowdBadge, { backgroundColor: crowd.color + '25', borderColor: crowd.color + '55' }]}>
              <View style={[styles.crowdDot, { backgroundColor: crowd.color }]} />
              <Text style={[styles.crowdBadgeText, { color: crowd.color }]}>
                {crowd.level}
              </Text>
            </View>
          </View>
          <Text style={styles.horizontalName} numberOfLines={1}>{placeName}</Text>
          <View style={styles.horizontalMeta}>
            {place.distance !== undefined && (
              <View style={styles.metaRow}>
                <MaterialIcons name="place" size={13} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{place.distance.toFixed(1)} {kmUnit}</Text>
              </View>
            )}
            {place.rating && (
              <View style={styles.metaRow}>
                <MaterialIcons name="star" size={13} color={Colors.primary} />
                <Text style={styles.metaText}>{place.rating}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.verticalCard}
      onPress={() => onPress(place)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: currentImg }}
        style={styles.verticalImage}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={250}
        onError={() => setCurrentImg(defaultFallback)}
      />

      {onFavoriteToggle && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onFavoriteToggle(place.id)}
        >
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={20}
            color={isFavorite ? Colors.error : Colors.text}
          />
        </TouchableOpacity>
      )}
      <View style={styles.verticalContent}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '30', marginBottom: 0 }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {categoryLabel}
            </Text>
          </View>
          <View style={[styles.crowdBadge, { backgroundColor: crowd.color + '20', borderColor: crowd.color + '55' }]}>
            <View style={[styles.crowdDot, { backgroundColor: crowd.color }]} />
            <Text style={[styles.crowdBadgeText, { color: crowd.color }]}>
              {crowd.badge}
            </Text>
          </View>
        </View>
        <Text style={styles.verticalName} numberOfLines={2}>{placeName}</Text>
        <Text style={styles.verticalDesc} numberOfLines={2}>{place.shortDescription}</Text>
        <View style={styles.verticalFooter}>
          {place.distance !== undefined && (
            <View style={styles.metaRow}>
              <MaterialIcons name="place" size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{place.distance.toFixed(1)} {kmUnit}</Text>
            </View>
          )}
          {place.rating && (
            <View style={styles.metaRow}>
              <MaterialIcons name="star" size={14} color={Colors.primary} />
              <Text style={[styles.metaText, { color: Colors.primary }]}>{place.rating}</Text>
            </View>
          )}
          {place.openingHours && (
            <View style={styles.metaRow}>
              <MaterialIcons name="schedule" size={13} color={Colors.textMuted} />
              <Text style={[styles.metaText, { color: Colors.textMuted }]} numberOfLines={1}>
                {place.openingHours.split('(')[0].trim()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Horizontal card (for carousel)
  horizontalCard: {
    width: width * 0.65,
    height: 190,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginRight: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadows.md,
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
  },
  horizontalOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    backgroundColor: 'rgba(10, 10, 15, 0.75)',
  },
  horizontalName: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  horizontalMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },

  // Vertical card (for lists)
  verticalCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  verticalImage: {
    width: '100%',
    height: 160,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  verticalContent: {
    padding: Spacing.base,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  verticalName: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  verticalDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  verticalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  crowdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 5,
  },
  crowdDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  crowdBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
  },
});
