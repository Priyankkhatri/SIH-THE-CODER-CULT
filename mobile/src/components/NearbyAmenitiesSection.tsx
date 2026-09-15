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
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
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
  { key: 'food', label: 'Food & Cafes', icon: 'restaurant' },
  { key: 'restroom', label: 'Clean Restrooms', icon: 'wc' },
  { key: 'atm', label: '24x7 ATMs', icon: 'local-atm' },
  { key: 'parking', label: 'Parking', icon: 'local-parking' },
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
            <MaterialIcons name="near-me" size={15} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerEyebrow}>TOURIST AMENITIES RADAR</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Nearby Facilities Around Monument
            </Text>
          </View>
        </View>
      </View>

      {/* Category Chips Carousel */}
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
                size={13}
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
            <View key={item.id} style={styles.compactRow}>
              {/* Left: Icon Avatar */}
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
                  size={16}
                  color={Colors.primary}
                />
              </View>

              {/* Middle: Name, Address, and Badges */}
              <View style={styles.detailsCol}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemAddress} numberOfLines={1}>
                  {item.address}
                </Text>

                <View style={styles.metaRow}>
                  <View style={styles.distanceBadge}>
                    <MaterialIcons name="directions-walk" size={11} color={Colors.primary} />
                    <Text style={styles.distanceText}>
                      {item.distanceMeters < 1000
                        ? `${item.distanceMeters}m`
                        : `${(item.distanceMeters / 1000).toFixed(1)}km`} · {item.walkingMinutes}m
                    </Text>
                  </View>

                  {item.rating && (
                    <View style={styles.ratingBadge}>
                      <MaterialIcons name="star" size={10} color="#FFB300" />
                      <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    </View>
                  )}

                  {item.isOpenNow !== undefined && (
                    <View style={[styles.statusBadge, item.isOpenNow ? styles.openBadge : styles.closedBadge]}>
                      <Text style={[styles.statusText, item.isOpenNow ? styles.openText : styles.closedText]}>
                        {item.isOpenNow ? 'Open' : 'Closed'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Right: Compact Navigation Button */}
              <TouchableOpacity
                style={styles.navChip}
                onPress={() => handleNavigate(item.googleMapsUri)}
                activeOpacity={0.8}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <MaterialIcons name="navigation" size={11} color="#0F0F0F" />
                <Text style={styles.navChipText}>Maps</Text>
              </TouchableOpacity>
            </View>
          ))}

          {amenities.length === 0 && (
            <View style={styles.emptyBox}>
              <MaterialIcons name="location-off" size={20} color={Colors.textMuted} />
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
    marginVertical: Spacing.sm,
    paddingHorizontal: 0,
  },
  headerRow: {
    marginBottom: Spacing.xs,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBadge: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEyebrow: {
    fontSize: 9,
    fontFamily: Typography.fontFamily.bold,
    letterSpacing: 1.1,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginTop: 1,
  },
  tabsScroll: {
    paddingVertical: 4,
    gap: 6,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  loadingText: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
  },
  listContainer: {
    gap: 8,
    marginTop: 4,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(212, 175, 124, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCol: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: 12,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  itemAddress: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 4,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(212, 175, 124, 0.1)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.sm,
  },
  distanceText: {
    fontSize: 9,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 179, 0, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.sm,
  },
  ratingText: {
    fontSize: 9,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFB300',
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
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
  navChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
  },
  navChipText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.bold,
    color: '#0F0F0F',
  },
  emptyBox: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  emptyText: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textMuted,
  },
});
