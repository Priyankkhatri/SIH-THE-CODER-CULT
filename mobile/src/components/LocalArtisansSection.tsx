import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { getArtisansForPlace, getFoodForPlace, ArtisanItem, CulinaryItem } from '../utils/touristMeta';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.72, 270);

interface LocalArtisansSectionProps {
  placeName?: string;
  stateOrCity?: string;
}

export function LocalArtisansSection({ placeName = '', stateOrCity = '' }: LocalArtisansSectionProps) {
  const [activeTab, setActiveTab] = useState<'artisans' | 'food'>('artisans');
  const artisans: ArtisanItem[] = getArtisansForPlace(placeName, stateOrCity);
  const food: CulinaryItem[] = getFoodForPlace(placeName, stateOrCity);

  return (
    <View style={styles.container}>
      {/* Clean Header with Wrapped Badges */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <View style={styles.headerIconBadge}>
            <MaterialIcons name="storefront" size={15} color={Colors.primary} />
          </View>
          <Text style={styles.sectionTitle} numberOfLines={1}>
            Artisans & Regional Gastronomy
          </Text>
          <View style={styles.communityTag}>
            <Text style={styles.communityTagText}>Local Community</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>
          Diverting tourism footfall to verified regional weavers, craftspeople, and culinary masters.
        </Text>
      </View>

      {/* Segmented Pill Selector (Crafts vs Food) */}
      <View style={styles.toggleBar}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'artisans' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('artisans')}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="brush"
            size={13}
            color={activeTab === 'artisans' ? '#0F0F0F' : Colors.textMuted}
          />
          <Text
            style={[styles.toggleBtnText, activeTab === 'artisans' && styles.toggleBtnTextActive]}
          >
            Traditional Crafts ({artisans.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'food' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('food')}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="restaurant"
            size={13}
            color={activeTab === 'food' ? '#0F0F0F' : Colors.textMuted}
          />
          <Text
            style={[styles.toggleBtnText, activeTab === 'food' && styles.toggleBtnTextActive]}
          >
            Culinary Heritage ({food.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Single Responsive Horizontal Carousel */}
      {activeTab === 'artisans' ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {artisans.map((art) => (
            <View key={art.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {art.name}
                </Text>
                {art.giTag && (
                  <View style={styles.giBadge}>
                    <Text style={styles.giText}>GI TAG</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardHighlight}>{art.craftType}</Text>
              <Text style={styles.cardDesc} numberOfLines={3}>
                {art.description}
              </Text>
              <View style={styles.locationRow}>
                <MaterialIcons name="place" size={12} color={Colors.primary} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {art.bazaar}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {food.map((f) => (
            <View key={f.id} style={styles.card}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {f.name}
              </Text>
              <Text style={styles.cardHighlight}>{f.cuisine}</Text>
              <Text style={styles.cardDesc} numberOfLines={3}>
                {f.description}
              </Text>
              <View style={styles.mustTryBadge}>
                <MaterialIcons name="star" size={11} color={Colors.primary} />
                <Text style={styles.mustTryText} numberOfLines={1}>
                  Must Try: {f.popularDish}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    marginBottom: Spacing.xs + 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  headerIconBadge: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    flexShrink: 1,
  },
  communityTag: {
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  communityTagText: {
    fontSize: 9,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.success,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  toggleBtnText: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textMuted,
  },
  toggleBtnTextActive: {
    color: '#0F0F0F',
    fontFamily: Typography.fontFamily.bold,
  },
  horizontalList: {
    gap: 10,
    paddingVertical: 2,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.18)',
    justifyContent: 'space-between',
    gap: 5,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    flex: 1,
  },
  giBadge: {
    backgroundColor: 'rgba(212, 175, 124, 0.20)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  giText: {
    fontSize: 8,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
  },
  cardHighlight: {
    fontSize: 11,
    color: Colors.primary,
    fontFamily: Typography.fontFamily.medium,
  },
  cardDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    fontFamily: Typography.fontFamily.regular,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
    fontStyle: 'italic',
  },
  mustTryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 124, 0.10)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
  },
  mustTryText: {
    fontSize: 10,
    color: Colors.primary,
    fontFamily: Typography.fontFamily.medium,
  },
});
