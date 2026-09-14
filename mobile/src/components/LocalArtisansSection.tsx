import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { getArtisansForPlace, getFoodForPlace, ArtisanItem, CulinaryItem } from '../utils/touristMeta';

interface LocalArtisansSectionProps {
  placeName?: string;
  stateOrCity?: string;
}

export function LocalArtisansSection({ placeName = '', stateOrCity = '' }: LocalArtisansSectionProps) {
  const artisans: ArtisanItem[] = getArtisansForPlace(placeName, stateOrCity);
  const food: CulinaryItem[] = getFoodForPlace(placeName, stateOrCity);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerTitleRow}>
          <MaterialIcons name="storefront" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Local Artisans &amp; Micro-Vendors</Text>
        </View>
        <Text style={styles.communityTag}>Direct Community Benefit</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Diverting tourism footfall to verified local weavers, traditional craftspeople, and culinary masters.
      </Text>

      {/* Artisans List */}
      <View style={styles.list}>
        {artisans.map((art) => (
          <View key={art.id} style={styles.artisanCard}>
            <View style={styles.cardTopRow}>
              <Text style={styles.artisanName}>{art.name}</Text>
              {art.giTag && (
                <View style={styles.giBadge}>
                  <Text style={styles.giText}>GI TAG PROTECTED</Text>
                </View>
              )}
            </View>
            <Text style={styles.craftType}>{art.craftType}</Text>
            <Text style={styles.artisanDesc}>{art.description}</Text>
            <View style={styles.bazaarRow}>
              <MaterialIcons name="place" size={13} color={Colors.textSecondary} />
              <Text style={styles.bazaarText}>{art.bazaar}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Local Culinary Specialties */}
      <View style={styles.foodSection}>
        <View style={styles.headerTitleRow}>
          <MaterialIcons name="restaurant" size={18} color={Colors.secondary} />
          <Text style={styles.subSectionTitle}>Regional Culinary Heritage</Text>
        </View>
        {food.map((f) => (
          <View key={f.id} style={styles.foodCard}>
            <Text style={styles.foodName}>{f.name}</Text>
            <Text style={styles.foodCuisine}>{f.cuisine}</Text>
            <Text style={styles.foodDesc}>{f.description}</Text>
            <View style={styles.specialtyBadge}>
              <MaterialIcons name="star" size={12} color={Colors.primary} />
              <Text style={styles.specialtyText}>Must Try: {f.popularDish}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 19,
    fontWeight: '700',
    color: Colors.text,
  },
  communityTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  list: {
    gap: 10,
  },
  artisanCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  artisanName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  giBadge: {
    backgroundColor: 'rgba(212, 175, 124, 0.20)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  giText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
  },
  craftType: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  artisanDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  bazaarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bazaarText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  foodSection: {
    marginTop: Spacing.md,
    gap: 8,
  },
  subSectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  foodCard: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  foodName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  foodCuisine: {
    fontSize: Typography.sizes.xs,
    color: Colors.secondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  specialtyText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
});
