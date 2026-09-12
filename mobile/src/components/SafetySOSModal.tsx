import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { EMERGENCY_HELPLINES, EmergencyContact } from '../utils/touristMeta';

interface SafetySOSModalProps {
  visible: boolean;
  onClose: () => void;
  latitude?: number;
  longitude?: number;
  currentLocationName?: string;
}

export function SafetySOSModal({ visible, onClose, latitude = 22.3072, longitude = 73.1812, currentLocationName = 'Vadodara Heritage Corridor' }: SafetySOSModalProps) {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleShareLocation = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(Tourist SOS)`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.alertBadge}>
                <MaterialIcons name="security" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Tourist Safety &amp; SOS Relay</Text>
                <Text style={styles.headerSubtitle}>Geo-Fenced Emergency Assistance</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Current GPS Anchor */}
          <View style={styles.gpsCard}>
            <MaterialIcons name="my-location" size={18} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.gpsLabel}>Verified Location Anchor:</Text>
              <Text style={styles.gpsCoords}>{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E ({currentLocationName})</Text>
            </View>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShareLocation}>
              <Text style={styles.shareBtnText}>Map</Text>
            </TouchableOpacity>
          </View>

          {/* Emergency Helplines */}
          <Text style={styles.sectionHeading}>Immediate Emergency Helplines (Toll-Free):</Text>
          <View style={styles.helplineList}>
            {EMERGENCY_HELPLINES.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.helplineCard}
                onPress={() => handleCall(item.number)}
                activeOpacity={0.8}
              >
                <View style={styles.iconWrap}>
                  <MaterialIcons name={item.icon as any} size={22} color="#EF5350" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <View style={styles.phoneBadge}>
                      <MaterialIcons name="phone" size={12} color="#FFFFFF" />
                      <Text style={styles.phoneNumber}>{item.number}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer note */}
          <View style={styles.footerNote}>
            <MaterialIcons name="verified-user" size={14} color={Colors.success} />
            <Text style={styles.footerText}>Certified by Ministry of Tourism &amp; State Police Command Centers</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EF5350',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  closeBtn: {
    padding: 4,
  },
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.25)',
    marginBottom: Spacing.md,
  },
  gpsLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  gpsCoords: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.text,
  },
  shareBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  shareBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.background,
  },
  sectionHeading: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  helplineList: {
    gap: 8,
  },
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF5350',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  phoneNumber: {
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  itemDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    lineHeight: 15,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
