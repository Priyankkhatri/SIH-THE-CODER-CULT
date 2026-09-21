import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows } from '../constants/theme';
import { openUberRide, openRapidoRide, openNativeNavigation } from '../services/transitService';

interface RideBookingSectionProps {
  placeName: string;
  latitude: number;
  longitude: number;
  cityOrState?: string;
}

export function RideBookingSection({
  placeName,
  latitude,
  longitude,
  cityOrState,
}: RideBookingSectionProps) {
  const destination = {
    name: placeName,
    latitude,
    longitude,
    address: cityOrState,
  };

  return (
    <View style={styles.container}>
      {/* Eyebrow & Header */}
      <View style={styles.headerRow}>
        <View style={styles.eyebrowWrap}>
          <MaterialIcons name="local-taxi" size={15} color={Colors.primary} />
          <Text style={styles.eyebrow}>TRANSIT & RIDE DISPATCH</Text>
        </View>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>Auto GPS Drop-off</Text>
        </View>
      </View>

      <Text style={styles.title}>Book Ride to {placeName}</Text>
      <Text style={styles.subtitle}>
        Coordinates and destination name are automatically pre-filled into your ride app.
      </Text>

      {/* Ride Options Grid */}
      <View style={styles.ridesContainer}>
        {/* 1. Uber Ride Card */}
        <TouchableOpacity
          style={styles.rideCard}
          onPress={() => openUberRide(destination)}
          activeOpacity={0.82}
        >
          <View style={[styles.rideIconBadge, styles.uberBadge]}>
            <MaterialIcons name="directions-car" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.rideContent}>
            <View style={styles.rideTitleRow}>
              <Text style={styles.rideProviderName}>Uber</Text>
              <View style={styles.tagPill}>
                <Text style={styles.tagPillText}>Cab & Auto</Text>
              </View>
            </View>
            <Text style={styles.rideDesc}>
              Comfortable AC cabs & official metered autos with live GPS tracking.
            </Text>
          </View>
          <View style={styles.rideActionArrow}>
            <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* 2. Rapido Ride Card */}
        <TouchableOpacity
          style={styles.rideCard}
          onPress={() => openRapidoRide(destination)}
          activeOpacity={0.82}
        >
          <View style={[styles.rideIconBadge, styles.rapidoBadge]}>
            <MaterialIcons name="two-wheeler" size={22} color="#1A1A1A" />
          </View>
          <View style={styles.rideContent}>
            <View style={styles.rideTitleRow}>
              <Text style={styles.rideProviderName}>Rapido</Text>
              <View style={[styles.tagPill, styles.rapidoTagPill]}>
                <Text style={[styles.tagPillText, styles.rapidoTagText]}>Fast & Low Cost</Text>
              </View>
            </View>
            <Text style={styles.rideDesc}>
              Quick auto-rickshaws & bike taxis. Ideal for narrow heritage lanes.
            </Text>
          </View>
          <View style={styles.rideActionArrow}>
            <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* 3. Navigation Alternative */}
        <TouchableOpacity
          style={[styles.rideCard, styles.navCard]}
          onPress={() => openNativeNavigation(destination)}
          activeOpacity={0.82}
        >
          <View style={[styles.rideIconBadge, styles.navBadge]}>
            <MaterialIcons name="navigation" size={20} color="#5B8FB9" />
          </View>
          <View style={styles.rideContent}>
            <Text style={styles.rideProviderName}>Turn-by-Turn Maps</Text>
            <Text style={styles.rideDesc}>
              Open in Google Maps for walking, driving, or public bus directions.
            </Text>
          </View>
          <View style={styles.rideActionArrow}>
            <MaterialIcons name="open-in-new" size={15} color="#5B8FB9" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    backgroundColor: '#16161D',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...Shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  eyebrowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.1,
  },
  liveBadge: {
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  liveBadgeText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  ridesContainer: {
    gap: 12,
  },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E28',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 14,
  },
  navCard: {
    backgroundColor: 'rgba(91, 143, 185, 0.08)',
    borderColor: 'rgba(91, 143, 185, 0.20)',
  },
  rideIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uberBadge: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rapidoBadge: {
    backgroundColor: '#FFC107',
  },
  navBadge: {
    backgroundColor: 'rgba(91, 143, 185, 0.2)',
  },
  rideContent: {
    flex: 1,
  },
  rideTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  rideProviderName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  rapidoTagPill: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
  },
  rapidoTagText: {
    color: '#FFB300',
  },
  rideDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  rideActionArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
