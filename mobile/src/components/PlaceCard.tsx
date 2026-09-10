import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CATEGORY_COLORS } from '../constants/theme';
import type { Place } from '../stores';

const { width } = Dimensions.get('window');

interface PlaceCardProps {
  place: Place;
  onPress: (place: Place) => void;
  variant?: 'horizontal' | 'vertical';
  isFavorite?: boolean;
  onFavoriteToggle?: (placeId: string) => void;
}

export function PlaceCard({ place, onPress, variant = 'vertical', isFavorite, onFavoriteToggle }: PlaceCardProps) {
  const categoryColor = CATEGORY_COLORS[place.category] || Colors.primary;

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        style={styles.horizontalCard}
        onPress={() => onPress(place)}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: place.imageUrl }}
          style={styles.horizontalImage}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          transition={300}
        />
        <View style={styles.horizontalOverlay}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '30' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {place.category.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.horizontalName} numberOfLines={1}>{place.name}</Text>
          <View style={styles.horizontalMeta}>
            {place.distance !== undefined && (
              <View style={styles.metaRow}>
                <MaterialIcons name="place" size={13} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{place.distance.toFixed(1)} km</Text>
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
        source={{ uri: place.imageUrl }}
        style={styles.verticalImage}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={300}
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
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '30' }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {place.category.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.verticalName} numberOfLines={2}>{place.name}</Text>
        <Text style={styles.verticalDesc} numberOfLines={2}>{place.shortDescription}</Text>
        <View style={styles.verticalFooter}>
          {place.distance !== undefined && (
            <View style={styles.metaRow}>
              <MaterialIcons name="place" size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{place.distance.toFixed(1)} km</Text>
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
  // Horizontal card (for Home screen carousel)
  horizontalCard: {
    width: width * 0.6,
    height: 200,
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
    backdropFilter: 'blur(10px)',
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
    overflow: 'hidden',
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  verticalImage: {
    width: '100%',
    height: 180,
  },
  verticalContent: {
    padding: Spacing.base,
  },
  verticalName: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 6,
    marginBottom: 4,
  },
  verticalDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  verticalFooter: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
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

  // Shared
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
});
