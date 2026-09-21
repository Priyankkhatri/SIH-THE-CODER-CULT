import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { getArtisansForPlace, getFoodForPlace, ArtisanItem, CulinaryItem } from '../utils/touristMeta';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.76, 280);

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
      {/* Spacious Editorial Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.eyebrowRow}>
          <MaterialIcons name="storefront" size={15} color={Colors.primary} />
          <Text style={styles.eyebrowText}>LOCAL ROOTS & CRAFTSMANSHIP</Text>
          <View style={styles.communityTag}>
            <Text style={styles.communityTagText}>Local Community</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Artisans & Regional Heritage</Text>
        <Text style={styles.sectionSubtitle}>
          Supporting verified regional craftspeople, traditional master weavers, and authentic culinary heritage.
        </Text>
      </View>

      {/* Spacious Segmented Pill Selector (Crafts vs Food) */}
      <View style={styles.toggleBar}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'artisans' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('artisans')}
          activeOpacity={0.85}
        >
          <MaterialIcons
            name="brush"
            size={15}
            color={activeTab === 'artisans' ? '#0A0A0E' : Colors.primary}
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
          activeOpacity={0.85}
        >
          <MaterialIcons
            name="restaurant"
            size={15}
            color={activeTab === 'food' ? '#0A0A0E' : Colors.primary}
          />
          <Text
            style={[styles.toggleBtnText, activeTab === 'food' && styles.toggleBtnTextActive]}
          >
            Culinary Heritage ({food.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Spacious Horizontal Card Showcase */}
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
                <MaterialIcons name="place" size={13} color={Colors.primary} />
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
                <MaterialIcons name="star" size={12} color={Colors.primary} />
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
    marginBottom: 36,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  eyebrowText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  communityTag: {
    backgroundColor: 'rgba(76, 175, 80, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.full,
  },
  communityTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.success,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 19,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 26,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: BorderRadius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 18,
    gap: 6,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  toggleBtnTextActive: {
    color: '#0A0A0E',
    fontWeight: '800',
  },
  horizontalList: {
    gap: 14,
    paddingVertical: 4,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.22)',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Typography.fontFamily.serif,
    flex: 1,
  },
  giBadge: {
    backgroundColor: 'rgba(212, 175, 124, 0.16)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  giText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.primary,
  },
  cardHighlight: {
    fontSize: 12,
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 12,
    color: '#B0B0C0',
    lineHeight: 18,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 11.5,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  mustTryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(212, 175, 124, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginTop: 4,
  },
  mustTryText: {
    fontSize: 11,
    color: Colors.primaryLight,
    fontWeight: '600',
  },
});
