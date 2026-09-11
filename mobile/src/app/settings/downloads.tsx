import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useOfflineStore } from '../../stores';

export default function DownloadsSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { downloadedPackages, isOfflineMode, setOfflineMode, removeDownload, downloadPlace } = useOfflineStore();

  const [isDownloadingDemo, setIsDownloadingDemo] = useState(false);
  const packageList = Object.values(downloadedPackages);

  const handleDownloadPreset = async (placeId: string) => {
    setIsDownloadingDemo(true);
    await downloadPlace(placeId);
    setIsDownloadingDemo(false);
  };

  const handleRemove = (placeId: string, placeName: string) => {
    Alert.alert(
      'Remove Offline Package',
      `Delete offline package for "${placeName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeDownload(placeId),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offline Heritage Content</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Offline Mode Switch */}
        <View style={styles.switchCard}>
          <View style={styles.switchIconWrap}>
            <MaterialIcons
              name={isOfflineMode ? 'wifi-off' : 'wifi'}
              size={24}
              color={isOfflineMode ? Colors.warning : Colors.primary}
            />
          </View>
          <View style={styles.switchDetails}>
            <Text style={styles.switchTitle}>Offline Mode Simulation</Text>
            <Text style={styles.switchSubtitle}>
              Force app to use cached local heritage stories & offline audio guides
            </Text>
          </View>
          <Switch
            value={isOfflineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: Colors.surfaceElevated, true: Colors.primary }}
            thumbColor={Colors.text}
          />
        </View>

        {/* Downloaded Packages Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Downloaded Packages</Text>
            <Text style={styles.sectionCount}>{packageList.length} Saved</Text>
          </View>

          {packageList.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="cloud-download" size={36} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Offline Content Stored</Text>
              <Text style={styles.emptyDesc}>
                Download heritage monuments to read historical facts, verify sources, and listen to multilingual audio guides without an internet connection.
              </Text>
            </View>
          ) : (
            packageList.map((pkg) => (
              <View key={pkg.packageId} style={styles.pkgCard}>
                <View style={styles.pkgIconWrap}>
                  <MaterialIcons name="offline-pin" size={24} color={Colors.success} />
                </View>
                <View style={styles.pkgDetails}>
                  <Text style={styles.pkgName}>{pkg.place.name}</Text>
                  <Text style={styles.pkgMeta}>
                    {pkg.artifacts?.length || 0} Artifacts • Multilingual Audio Included
                  </Text>
                  <Text style={styles.pkgDate}>
                    Saved {new Date(pkg.downloadedAt).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleRemove(pkg.place.id, pkg.place.name)}
                >
                  <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Quick Demo Download Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Available for Instant Download</Text>
          <Text style={styles.sectionSubtitle}>
            Popular Vadodara heritage packages available for offline preservation demo.
          </Text>

          <View style={styles.demoList}>
            <View style={styles.demoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.demoPlaceName}>Laxmi Vilas Palace</Text>
                <Text style={styles.demoPlaceSize}>Includes 500-acre chronicle, sources & audio</Text>
              </View>
              <TouchableOpacity
                style={styles.downloadChip}
                onPress={() => handleDownloadPreset('p1-laxmi-vilas')}
                disabled={isDownloadingDemo}
              >
                <MaterialIcons name="file-download" size={18} color={Colors.background} />
                <Text style={styles.downloadChipText}>Download</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.demoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.demoPlaceName}>Champaner Archaeological Park</Text>
                <Text style={styles.demoPlaceSize}>UNESCO World Heritage data & mosque guides</Text>
              </View>
              <TouchableOpacity
                style={styles.downloadChip}
                onPress={() => handleDownloadPreset('p11-champaner')}
                disabled={isDownloadingDemo}
              >
                <MaterialIcons name="file-download" size={18} color={Colors.background} />
                <Text style={styles.downloadChipText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.xl,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.md,
  },
  switchIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchDetails: {
    flex: 1,
  },
  switchTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  switchSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionCount: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  pkgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  pkgIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pkgDetails: {
    flex: 1,
  },
  pkgName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  pkgMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pkgDate: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.base,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  demoPlaceName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  demoPlaceSize: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  downloadChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  downloadChipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.background,
  },
});
