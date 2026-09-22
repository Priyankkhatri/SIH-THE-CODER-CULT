import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import type { Place } from '../stores';
import { transitService } from '../services/transitService';
import { ScalePressable, SlideUpView } from './common/MicroAnimations';

interface MapRideBookingModalProps {
  place: Place;
  userLocation: { latitude: number; longitude: number };
  onClose: () => void;
}

export function MapRideBookingModal({
  place,
  userLocation,
  onClose,
}: MapRideBookingModalProps) {
  const estimate = useMemo(() => {
    return transitService.estimateFares(
      userLocation.latitude || 22.3072,
      userLocation.longitude || 73.1812,
      place.latitude,
      place.longitude,
      (place as any).city || 'Gujarat'
    );
  }, [place, userLocation]);

  return (
    <SlideUpView style={styles.sheetContainer} distance={200}>
      <View style={styles.dragHandle} />

      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <MaterialIcons name="local-taxi" size={18} color={Colors.primary} />
            <Text style={styles.sheetTitle}>Book Ride to Monument</Text>
          </View>
          <Text style={styles.sheetSub} numberOfLines={1}>
            Destination: {place.name} ({estimate.distanceKm} km • ~{estimate.estimatedDurationMin} min)
          </Text>
        </View>

        <ScalePressable style={styles.closeBtn} onPress={onClose}>
          <MaterialIcons name="close" size={18} color={Colors.textSecondary} />
        </ScalePressable>
      </View>

      {/* Fare Estimates Grid */}
      <View style={styles.faresGrid}>
        <View style={styles.fareCard}>
          <Text style={styles.fareIcon}>🛺</Text>
          <Text style={styles.fareLabel}>Auto Rickshaw</Text>
          <Text style={styles.farePrice}>₹{estimate.auto.min} - ₹{estimate.auto.max}</Text>
          <Text style={styles.fareSub}>Ideal for short heritage trips</Text>
        </View>

        <View style={styles.fareCard}>
          <Text style={styles.fareIcon}>🛵</Text>
          <Text style={styles.fareLabel}>Bike Taxi</Text>
          <Text style={styles.farePrice}>₹{estimate.bike.min} - ₹{estimate.bike.max}</Text>
          <Text style={styles.fareSub}>Fastest through narrow alleys</Text>
        </View>

        <View style={styles.fareCard}>
          <Text style={styles.fareIcon}>🚗</Text>
          <Text style={styles.fareLabel}>AC Cab</Text>
          <Text style={styles.farePrice}>₹{estimate.cab.min} - ₹{estimate.cab.max}</Text>
          <Text style={styles.fareSub}>Comfortable group travel</Text>
        </View>
      </View>

      {/* 1-Tap Direct Launch Providers */}
      <View style={styles.providersRow}>
        {/* Uber */}
        <ScalePressable
          style={[styles.providerBtn, { borderColor: '#1A73E8' }]}
          onPress={async () => {
            await transitService.launchUber({
              name: place.name,
              latitude: place.latitude,
              longitude: place.longitude,
            });
            onClose();
          }}
        >
          <View style={[styles.providerLogoWrap, { backgroundColor: '#000000' }]}>
            <Text style={styles.providerLogoText}>Uber</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.providerName}>Uber Cabs & Auto</Text>
            <Text style={styles.providerAction}>Pre-fills {place.name}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={Colors.textSecondary} />
        </ScalePressable>

        {/* Rapido */}
        <ScalePressable
          style={[styles.providerBtn, { borderColor: '#F59E0B' }]}
          onPress={async () => {
            await transitService.launchRapido({
              name: place.name,
              latitude: place.latitude,
              longitude: place.longitude,
            });
            onClose();
          }}
        >
          <View style={[styles.providerLogoWrap, { backgroundColor: '#F59E0B' }]}>
            <Text style={[styles.providerLogoText, { color: '#000' }]}>Rapido</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.providerName}>Rapido Bike & Auto</Text>
            <Text style={styles.providerAction}>Auto-copies destination coordinates</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={Colors.textSecondary} />
        </ScalePressable>

        {/* Ola */}
        <ScalePressable
          style={[styles.providerBtn, { borderColor: '#10B981' }]}
          onPress={async () => {
            await transitService.launchOlaCabs({
              name: place.name,
              latitude: place.latitude,
              longitude: place.longitude,
            });
            onClose();
          }}
        >
          <View style={[styles.providerLogoWrap, { backgroundColor: '#10B981' }]}>
            <Text style={[styles.providerLogoText, { color: '#000' }]}>Ola</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.providerName}>Ola Cabs</Text>
            <Text style={styles.providerAction}>Direct GPS dropoff</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={Colors.textSecondary} />
        </ScalePressable>
      </View>
    </SlideUpView>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(23, 23, 23, 0.98)',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.35)',
    paddingHorizontal: Spacing.base,
    paddingTop: 10,
    paddingBottom: 26,
    ...Shadows.lg,
    zIndex: 250,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sheetTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
    color: Colors.text,
  },
  sheetSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faresGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  fareCard: {
    flex: 1,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: BorderRadius.md,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  fareIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  fareLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  farePrice: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  fareSub: {
    fontSize: 8,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  providersRow: {
    gap: 8,
  },
  providerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  providerLogoWrap: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  providerLogoText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFF',
  },
  providerName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  providerAction: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
});
