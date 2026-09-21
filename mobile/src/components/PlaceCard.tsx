import React, { memo, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, CATEGORY_COLORS } from '../constants/theme';
import type { Place } from '../stores';
import { useTranslation } from '../hooks/useTranslation';
import { getLiveCrowd } from '../utils/touristMeta';
import { dynamicImageService } from '../services/dynamicImageService';

interface PlaceCardProps {
  place: Place;
  onPress: (place: Place) => void;
  variant?: 'horizontal' | 'vertical';
  isFavorite?: boolean;
  onFavoriteToggle?: (placeId: string) => void;
}

function PlaceCardComponent({ place, onPress, variant = 'vertical', isFavorite, onFavoriteToggle }: PlaceCardProps) {
  const { t, getPlaceName, getCategoryName } = useTranslation();
  const categoryColor = CATEGORY_COLORS[place.category] || Colors.primary;
  const placeName = getPlaceName(place);
  const categoryLabel = getCategoryName(place.category).toUpperCase();
  const kmUnit = t('common.km');

  // Compute crowd info once per place name
  const crowd = useMemo(() => getLiveCrowd(place.name), [place.name]);

  const defaultFallback = useMemo(
    () => dynamicImageService.getArchitecturalFallback(place.name, place.category, 0),
    [place.name, place.category]
  );
  const initialUri = useMemo(
    () => dynamicImageService.getPlaceImage(place.name, place.category, place.imageUrl),
    [place.name, place.category, place.imageUrl]
  );

  const [currentImg, setCurrentImg] = useState<string>(initialUri);

  useEffect(() => {
    let isMounted = true;
    const resolved = dynamicImageService.getPlaceImage(place.name, place.category, place.imageUrl);
    setCurrentImg(resolved);

    // If initial image is already a verified Wikimedia/Wikipedia photo, never overwrite
    if (resolved && (resolved.includes('wikimedia.org') || resolved.includes('wikipedia.org'))) {
      return () => {
        isMounted = false;
      };
    }

    // Only if image is a generic fallback, attempt background dynamic fetch from internet
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
  }, [place.name, place.imageUrl, place.category, defaultFallback]);

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
          cachePolicy="memory-disk"
          recyclingKey={place.id}
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          transition={150}
          onError={() => setCurrentImg(dynamicImageService.getArchitecturalFallback(place.name, place.category, 1))}
        />
        <View style={styles.horizontalOverlay}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '30', marginBottom: 0 }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]} numberOfLines={1}>
                {categoryLabel}
              </Text>
            </View>
            <View style={[styles.crowdBadge, { backgroundColor: crowd.color + '25', borderColor: crowd.color + '55' }]}>
              <View style={[styles.crowdDot, { backgroundColor: crowd.color }]} />
              <Text style={[styles.crowdBadgeText, { color: crowd.color }]} numberOfLines={1}>
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
        cachePolicy="memory-disk"
        recyclingKey={place.id}
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={150}
        onError={() => setCurrentImg(dynamicImageService.getArchitecturalFallback(place.name, place.category, 1))}
      />

      {onFavoriteToggle && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onFavoriteToggle(place.id)}
          activeOpacity={0.7}
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
            <Text style={[styles.categoryText, { color: categoryColor }]} numberOfLines={1}>
              {categoryLabel}
            </Text>
          </View>
          <View style={[styles.crowdBadge, { backgroundColor: crowd.color + '25', borderColor: crowd.color + '55' }]}>
            <View style={[styles.crowdDot, { backgroundColor: crowd.color }]} />
            <Text style={[styles.crowdBadgeText, { color: crowd.color }]} numberOfLines={1}>
              {crowd.level}
            </Text>
          </View>
        </View>
        <Text style={styles.verticalName} numberOfLines={1}>{placeName}</Text>
        <Text style={styles.verticalDesc} numberOfLines={2}>
          {place.shortDescription || (place.heritageRecord as any)?.shortStory || 'Preserved Indian historical site.'}
        </Text>
        <View style={styles.verticalMeta}>
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

export const PlaceCard = memo(PlaceCardComponent);

const styles = StyleSheet.create({
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  crowdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  crowdDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  crowdBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  horizontalCard: {
    width: 220,
    height: 150,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceElevated,
    marginRight: Spacing.md,
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
    paddingTop: 32,
    backgroundColor: 'rgba(8, 8, 10, 0.55)',
  },
  horizontalName: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 5,
    fontFamily: Typography.fontFamily.serif,
    letterSpacing: 0.2,
  },
  horizontalMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 5,
  },
  verticalCard: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    marginBottom: Spacing.xl,
    overflow: 'visible',
  },
  verticalImage: {
    width: '100%',
    height: 190,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#151515',
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
  },
  verticalContent: {
    paddingTop: Spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  verticalName: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Typography.fontFamily.serif,
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  verticalDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  verticalMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
});
