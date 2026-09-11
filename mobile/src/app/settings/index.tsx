import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useUserStore, useOfflineStore } from '../../stores';
import { useTranslation } from '../../hooks/useTranslation';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, email, isGuest, logout } = useUserStore();
  const { downloadedPackages, isOfflineMode, setOfflineMode } = useOfflineStore();
  const { language } = useTranslation();

  const langNames: Record<string, string> = {
    en: 'English (UK)',
    hi: 'हिन्दी (Hindi)',
    gu: 'ગુજરાતી (Gujarati)',
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login' as any);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings & Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <MaterialIcons name="person" size={32} color={Colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{name || 'Tourist'}</Text>
            <Text style={styles.profileEmail}>
              {isGuest ? 'Guest Session' : (email || 'Registered User')}
            </Text>
          </View>
          {isGuest && (
            <TouchableOpacity style={styles.signInBadge} onPress={() => router.push('/auth/login' as any)}>
              <Text style={styles.signInBadgeText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section: Travel & App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>

          {/* Language Selection */}
          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('/settings/language' as any)}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="translate" size={22} color={Colors.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Language & Voice</Text>
              <Text style={styles.rowSubtitle}>{langNames[language] || 'English'}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Travel Preferences */}
          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('/settings/preferences' as any)}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="tune" size={22} color={Colors.heritage} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Travel Preferences</Text>
              <Text style={styles.rowSubtitle}>Interests, pace, and accessibility</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Offline Downloads */}
          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('/settings/downloads' as any)}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="offline-pin" size={22} color={Colors.success} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Offline Heritage Packages</Text>
              <Text style={styles.rowSubtitle}>
                {Object.keys(downloadedPackages).length} package(s) downloaded
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section: Shortcuts */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Quick Access</Text>

          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('/favorites' as any)}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="favorite" size={22} color={Colors.error} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Saved Heritage Sites</Text>
              <Text style={styles.rowSubtitle}>View bookmarked monuments</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('/itinerary/create' as any)}>
            <View style={styles.rowIconWrap}>
              <MaterialIcons name="route" size={22} color={Colors.accent} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Curate New Tour</Text>
              <Text style={styles.rowSubtitle}>Generate smart AI itinerary</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section: About & Info */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>About Prototype</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>AI Tourist Companion</Text>
            <Text style={styles.infoBody}>
              Smart India Hackathon (SIH26204) — Travel & Tourism. Grounded RAG AI heritage guidance, verified ASI archives, and real-time artifact recognition.
            </Text>
            <Text style={styles.infoVersion}>Version 1.0.0 (Vadodara Heritage Edition)</Text>
          </View>
        </View>

        {/* Logout / Switch Account */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <MaterialIcons name="logout" size={20} color={Colors.error} />
          <Text style={styles.logoutBtnText}>
            {isGuest ? 'Exit Guest Session' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.2)',
    gap: Spacing.md,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212, 169, 71, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  signInBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  signInBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.background,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionHeader: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: Spacing.xs,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  rowIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  rowSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  infoTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  infoBody: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  infoVersion: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.3)',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    marginBottom: Spacing.xl,
  },
  logoutBtnText: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: Typography.sizes.sm,
  },
});
