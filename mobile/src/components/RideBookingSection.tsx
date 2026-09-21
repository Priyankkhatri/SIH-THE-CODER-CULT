import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows } from '../constants/theme';
import { openUberRide, openRapidoRide, openNativeNavigation } from '../services/transitService';
import { estimateTransitFares } from '../services/transitFareEstimator';

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
  const [showTips, setShowTips] = useState(false);

  const destination = {
    name: placeName,
    latitude,
    longitude,
    address: cityOrState,
  };

  const fareData = estimateTransitFares(placeName, cityOrState);

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

      {/* 4. Regional Street Fair Fare Benchmark (For Rural / Out-of-station tourists) */}
      <View style={styles.benchmarkCard}>
        <View style={styles.benchmarkHeader}>
          <View style={styles.benchmarkTitleRow}>
            <MaterialIcons name="price-check" size={18} color={Colors.primary} />
            <Text style={styles.benchmarkTitle}>
              {fareData.zoneType === 'metro'
                ? 'City Street Meter Benchmark'
                : 'Rural Heritage Fair Fare Benchmark'}
            </Text>
          </View>
          <View
            style={[
              styles.zoneBadge,
              fareData.zoneType === 'regional' ? styles.zoneBadgeRegional : styles.zoneBadgeMetro,
            ]}
          >
            <Text style={styles.zoneBadgeText}>
              {fareData.zoneType === 'regional' ? 'Local Autos Dominate' : 'App Cabs Available'}
            </Text>
          </View>
        </View>

        <Text style={styles.benchmarkNotice}>
          Expected fair rates from {fareData.hubName} to protect against tout overcharging:
        </Text>

        <View style={styles.pricePillsRow}>
          <View style={styles.pricePill}>
            <Text style={styles.pricePillLabel}>Private Auto</Text>
            <Text style={styles.pricePillValue}>{fareData.autoPrivateRange}</Text>
          </View>

          {fareData.sharedTransitRange && (
            <View style={styles.pricePill}>
              <Text style={styles.pricePillLabel}>Shared Jeep / Bus</Text>
              <Text style={styles.pricePillValue}>{fareData.sharedTransitRange.split(' ')[0]}</Text>
            </View>
          )}

          {fareData.fullDayAutoRange && (
            <View style={styles.pricePill}>
              <Text style={styles.pricePillLabel}>Full Day Circuit</Text>
              <Text style={styles.pricePillValue}>{fareData.fullDayAutoRange.split(' ')[0]}</Text>
            </View>
          )}
        </View>

        {/* Local Hindi Bargaining Helper */}
        <View style={styles.phraseBox}>
          <View style={styles.phraseHeaderRow}>
            <MaterialIcons name="record-voice-over" size={14} color={Colors.primary} />
            <Text style={styles.phraseHeader}>Driver Negotiation Phrase</Text>
          </View>
          <Text style={styles.phraseHindi}>{fareData.localPhrase.hindi}</Text>
          <Text style={styles.phrasePronunciation}>"{fareData.localPhrase.pronunciation}"</Text>
          <Text style={styles.phraseEnglish}>Meaning: {fareData.localPhrase.english}</Text>
        </View>

        {/* Expandable Tips Toggle */}
        <TouchableOpacity
          style={styles.tipsToggleBtn}
          onPress={() => setShowTips(!showTips)}
          activeOpacity={0.7}
        >
          <Text style={styles.tipsToggleText}>
            {showTips ? 'Hide Anti-Gouging Tips ▲' : 'View Street Bargaining Rules ▼'}
          </Text>
        </TouchableOpacity>

        {showTips && (
          <View style={styles.tipsList}>
            {fareData.bargainingTips.map((tip, idx) => (
              <View key={idx} style={styles.tipRow}>
                <MaterialIcons name="check-circle" size={14} color={Colors.success} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
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

  // Regional Benchmark Styles
  benchmarkCard: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  benchmarkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  benchmarkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  benchmarkTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  zoneBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  zoneBadgeMetro: {
    backgroundColor: 'rgba(123, 182, 133, 0.15)',
  },
  zoneBadgeRegional: {
    backgroundColor: 'rgba(217, 164, 91, 0.15)',
  },
  zoneBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  benchmarkNotice: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  pricePillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  pricePill: {
    flex: 1,
    backgroundColor: '#1C1C26',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
  },
  pricePillLabel: {
    fontSize: 9.5,
    color: Colors.textMuted,
    marginBottom: 2,
    fontWeight: '600',
  },
  pricePillValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  phraseBox: {
    backgroundColor: 'rgba(212, 175, 124, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.20)',
    marginBottom: 10,
  },
  phraseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  phraseHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  phraseHindi: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  phrasePronunciation: {
    fontSize: 11.5,
    fontStyle: 'italic',
    color: Colors.primaryLight,
    marginBottom: 2,
  },
  phraseEnglish: {
    fontSize: 10.5,
    color: Colors.textMuted,
  },
  tipsToggleBtn: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tipsToggleText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  tipsList: {
    marginTop: 8,
    gap: 6,
    backgroundColor: '#1A1A24',
    padding: 12,
    borderRadius: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    lineHeight: 16,
    flex: 1,
  },
});
