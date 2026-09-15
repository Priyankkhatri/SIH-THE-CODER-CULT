import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { placesApi } from '../services/api';

type AmenityType = 'food' | 'restroom' | 'atm' | 'parking';

interface AmenityItem {
  id: string;
  name: string;
  type: AmenityType;
  distanceMeters: number;
  walkingMinutes: number;
  rating?: number;
  isOpenNow?: boolean;
  address: string;
  googleMapsUri: string;
}

interface Props {
  placeId: string;
  placeName: string;
  latitude: number;
  longitude: number;
}

const CATEGORIES: Array<{ key: AmenityType; label: string; icon: keyof typeof MaterialIcons.glyphMap }> = [
  { key: 'food', label: 'Authentic Food & Cafes', icon: 'restaurant' },
  { key: 'restroom', label: 'Clean Restrooms', icon: 'wc' },
  { key: 'atm', label: '24x7 ATMs', icon: 'local-atm' },
  { key: 'parking', label: 'Vehicle Parking', icon: 'local-parking' },
];

export const NearbyAmenitiesSection: React.FC<Props> = ({
  placeId,
  placeName,
  latitude,
  longitude,
}) => {
  const [selectedType, setSelectedType] = useState<AmenityType>('food');
  const [amenities, setAmenities] = useState<AmenityItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (placeId) {
      loadAmenities(selectedType);
    }
  }, [placeId, selectedType]);

  const loadAmenities = async (type: AmenityType) => {
    setLoading(true);
    try {
      const res: any = await placesApi.getNearbyAmenities(placeId, type);
      if (res?.data && Array.isArray(res.data)) {
        setAmenities(res.data);
      } else {
        setAmenities([]);
      }
    } catch (err) {
      console.warn('[NearbyAmenities] Load error:', err);
      setAmenities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        console.warn('Could not open map URL:', err);
        Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleWrap}>
          <View style={styles.headerIconBadge}>
            <MaterialIcons name="near-me" size={16} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.headerEyebrow}>TOURIST AMENITIES RADAR</Text>
            <Text style={styles.headerTitle}>Nearby Facilities Around Monument</Text>
          </View>
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScroll}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedType === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.tabChip, isSelected && styles.tabChipActive]}
              onPress={() => setSelectedType(cat.key)}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={cat.icon}
                size={15}
                color={isSelected ? '#0F0F0F' : Colors.textMuted}
              />
              <Text style={[styles.tabLabel, isSelected && styles.tabLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Content List */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Scanning verified nearby amenities...</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {amenities.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.iconCircle}>
                  <MaterialIcons
                    name={
                      item.type === 'food'
                        ? 'restaurant-menu'
                        : item.type === 'restroom'
                        ? 'wash'
                        : item.type === 'atm'
                        ? 'credit-card'
                        : 'directions-car'
                    }
                    size={18}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>

                  <Text style={styles.itemAddress} numberOfLines={1}>
                    {item.address}
                  </Text>

                  <View style={styles.metaRow}>
                    <View style={styles.distanceBadge}>
                      <MaterialIcons name="directions-walk" size={12} color={Colors.primary} />
                      <Text style={styles.distanceText}>
                        {item.distanceMeters < 1000
                          ? `${item.distanceMeters}m`
                          : `${(item.distanceMeters / 1000).toFixed(1)}km`} · {item.walkingMinutes} min walk
                      </Text>
                    </View>

                    {item.rating && (
                      <View style={styles.ratingBadge}>
                        <MaterialIcons name="star" size={11} color="#FFB300" />
                        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                      </View>
                    )}

                    {item.isOpenNow !== undefined && (
                      <View style={[styles.statusBadge, item.isOpenNow ? styles.openBadge : styles.closedBadge]}>
                        <Text style={[styles.statusText, item.isOpenNow ? styles.openText : styles.closedText]}>
                          {item.isOpenNow ? 'Open Now' : 'Closed'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Navigation Action */}
              <TouchableOpacity
                style={styles.navigateBtn}
                onPress={() => handleNavigate(item.googleMapsUri)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="navigation" size={14} color="#0F0F0F" />
                <Text style={styles.navigateBtnText}>Navigate (Google Maps)</Text>
              </TouchableOpacity>
            </View>
          ))}

          {amenities.length === 0 && (
            <View style={styles.emptyBox}>
              <MaterialIcons name="location-off" size={24} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No verified facilities recorded in this radius.</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  headerIconBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(222, 147, 34, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEyebrow: {
    fontSize: 9,
    fontFamily: Typography.fontFamily.bold,
    letterSpacing: 1.2,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginTop: 1,
  },
  tabsScroll: {
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: '#0F0F0F',
    fontFamily: Typography.fontFamily.bold,
  },
  loadingBox: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  loadingText: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
  },
  listContainer: {
    gap: Spacing.xs + 2,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs + 2,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(222, 147, 34, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: Typography.sizes.xs + 1,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  itemAddress: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 5,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(222, 147, 34, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  distanceText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 179, 0, 0.1)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFB300',
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  openBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
  },
  closedBadge: {
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
  },
  statusText: {
    fontSize: 9,
    fontFamily: Typography.fontFamily.medium,
  },
  openText: {
    color: '#4CAF50',
  },
  closedText: {
    color: '#EF5350',
  },
  navigateBtn: {
    marginTop: Spacing.xs + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  navigateBtnText: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.bold,
    color: '#0F0F0F',
  },
  emptyBox: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  emptyText: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
  },
});
