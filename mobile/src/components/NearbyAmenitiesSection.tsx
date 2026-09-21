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
  { key: 'parking', label: 'Parking Bays', icon: 'local-parking' },
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
      {/* Spacious Header */}
      <View style={styles.headerWrap}>
        <View style={styles.headerEyebrowRow}>
          <MaterialIcons name="near-me" size={15} color={Colors.primary} />
          <Text style={styles.headerEyebrow}>TOURIST AMENITIES RADAR</Text>
        </View>
        <Text style={styles.headerTitle}>Nearby Facilities Around Monument</Text>
      </View>

      {/* Spacious Category Chips Carousel */}
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
              activeOpacity={0.85}
            >
              <MaterialIcons
                name={cat.icon}
                size={16}
                color={isSelected ? '#0A0A0E' : Colors.primary}
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
            <View key={item.id} style={styles.amenityCard}>
              {/* Top Row: Avatar + Name & Address + Map Button */}
              <View style={styles.cardTopRow}>
                <View style={styles.iconCircle}>
                  <MaterialIcons
                    name={
                      item.type === 'food'
                        ? 'restaurant'
                        : item.type === 'restroom'
                        ? 'wc'
                        : item.type === 'atm'
                        ? 'account-balance-wallet'
                        : 'local-parking'
                    }
                    size={20}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.detailsCol}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemAddress} numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.navBtn}
                  onPress={() => handleNavigate(item.googleMapsUri)}
                  activeOpacity={0.8}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons name="navigation" size={13} color="#0A0A0E" />
                  <Text style={styles.navBtnText}>Maps</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Row: Clean Pill Metas */}
              <View style={styles.metaRow}>
                <View style={styles.distanceBadge}>
                  <MaterialIcons name="directions-walk" size={13} color={Colors.primary} />
                  <Text style={styles.distanceText}>
                    {item.distanceMeters < 1000
                      ? `${item.distanceMeters}m`
                      : `${(item.distanceMeters / 1000).toFixed(1)}km`} · {item.walkingMinutes} min walk
                  </Text>
                </View>

                {item.rating && (
                  <View style={styles.ratingBadge}>
                    <MaterialIcons name="star" size={12} color="#FFB300" />
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
    marginBottom: 32,
  },
  headerWrap: {
    marginBottom: 14,
  },
  headerEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 6,
  },
  headerEyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 19,
    fontFamily: Typography.fontFamily.serif,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 26,
  },
  tabsScroll: {
    paddingVertical: 6,
    gap: 8,
    marginBottom: 16,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: '#0A0A0E',
    fontWeight: '800',
  },
  loadingBox: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  listContainer: {
    gap: 12,
  },
  amenityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 16,
    gap: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCol: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  itemAddress: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 124, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.20)',
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryLight,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 179, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFB300',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  openBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.14)',
  },
  closedBadge: {
    backgroundColor: 'rgba(239, 83, 80, 0.14)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  openText: {
    color: '#4CAF50',
  },
  closedText: {
    color: '#EF5350',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  navBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0A0A0E',
  },
  emptyBox: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
