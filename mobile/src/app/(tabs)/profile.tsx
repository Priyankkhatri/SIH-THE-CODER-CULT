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
import { Colors, Typography, Spacing, BorderRadius, LANGUAGES, INTERESTS_OPTIONS, TRAVEL_STYLES } from '../../constants/theme';
import { useUserStore, usePlacesStore, useOfflineStore } from '../../stores';
import { useTranslation } from '../../hooks/useTranslation';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, email, isGuest, language, interests, travelStyle, duration, setLanguage, setPreferences, setOnboarded, logout } = useUserStore();
  const { t } = useTranslation();
  const { favorites } = usePlacesStore();
  const { downloadedPackages } = useOfflineStore();

  const currentLang = LANGUAGES.find((l) => l.code === language);
  const currentStyle = TRAVEL_STYLES.find((s) => s.key === travelStyle);

  const handleResetOnboarding = () => {
    Alert.alert(
      t('profile.resetApp'),
      t('profile.resetConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.resetBtn'),
          style: 'destructive',
          onPress: () => {
            setOnboarded(false);
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Sign out of your session?',
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{(name || 'T').charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{name}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.guestBadge}>
            <MaterialIcons name={isGuest ? 'person-outline' : 'verified-user'} size={14} color={Colors.primary} />
            <Text style={styles.guestText}>{isGuest ? 'Guest Explorer' : (email || 'Member')}</Text>
          </View>
        </View>

        {isGuest && (
          <TouchableOpacity style={styles.loginBannerBtn} onPress={() => router.push('/auth/login' as any)}>
            <MaterialIcons name="login" size={16} color={Colors.background} />
            <Text style={styles.loginBannerText}>Sign in to sync saved tours</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Quick Menu Hub */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          <View style={styles.menuGrid}>
            <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/favorites' as any)}>
              <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(239, 83, 80, 0.12)' }]}>
                <MaterialIcons name="favorite" size={24} color={Colors.error} />
              </View>
              <Text style={styles.menuCardTitle}>Saved Places</Text>
              <Text style={styles.menuCardCount}>{favorites.length} saved</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/settings/downloads' as any)}>
              <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(76, 175, 80, 0.12)' }]}>
                <MaterialIcons name="cloud-done" size={24} color={Colors.success} />
              </View>
              <Text style={styles.menuCardTitle}>Offline Data</Text>
              <Text style={styles.menuCardCount}>{Object.keys(downloadedPackages).length} packs</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/itinerary/create' as any)}>
              <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(91, 143, 185, 0.12)' }]}>
                <MaterialIcons name="route" size={24} color={Colors.accent} />
              </View>
              <Text style={styles.menuCardTitle}>New Itinerary</Text>
              <Text style={styles.menuCardCount}>AI Curated</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/settings' as any)}>
              <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(212, 169, 71, 0.12)' }]}>
                <MaterialIcons name="settings" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.menuCardTitle}>Settings</Text>
              <Text style={styles.menuCardCount}>All options</Text>
            </TouchableOpacity>
          </View>

          {/* Tourist Financial Compass Banner */}
          <TouchableOpacity
            style={styles.walletBanner}
            onPress={() => router.push('/settings/wallet' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.walletBannerIconWrap}>
              <MaterialIcons name="account-balance-wallet" size={24} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <Text style={styles.walletBannerEyebrow}>FOREX & DIGITAL PAYMENTS</Text>
                <View style={styles.walletBadge}>
                  <Text style={styles.walletBadgeText}>Live Forex</Text>
                </View>
              </View>
              <Text style={styles.walletBannerTitle}>Tourist Wallet & UPI Guide</Text>
              <Text style={styles.walletBannerSubtitle}>
                UPI One World activation, live currency converter & ATM protection.
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.languageSection')}</Text>
          <View style={styles.langRow}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langCard, language === lang.code && styles.langActive]}
                onPress={() => setLanguage(lang.code)}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langName, language === lang.code && styles.langNameActive]}>
                  {lang.nativeName}
                </Text>
                {language === lang.code && (
                  <MaterialIcons name="check-circle" size={16} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.interestsSection')}</Text>
          <View style={styles.chipRow}>
            {INTERESTS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.interestChip, interests.includes(opt.key) && styles.interestActive]}
                onPress={() => {
                  const updated = interests.includes(opt.key)
                    ? interests.filter((i) => i !== opt.key)
                    : [...interests, opt.key];
                  if (updated.length > 0) setPreferences({ interests: updated });
                }}
              >
                <Text style={styles.interestIcon}>{opt.icon}</Text>
                <Text style={[styles.interestLabel, interests.includes(opt.key) && styles.activeText]}>
                  {t('options.interests.' + opt.key)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Travel Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.travelStyleSection')}</Text>
          {TRAVEL_STYLES.map((st) => (
            <TouchableOpacity
              key={st.key}
              style={[styles.styleCard, travelStyle === st.key && styles.styleActive]}
              onPress={() => setPreferences({ travelStyle: st.key })}
            >
              <Text style={styles.styleIcon}>{st.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.styleLabel, travelStyle === st.key && styles.activeText]}>
                  {t('options.styles.' + st.key + '.label')}
                </Text>
                <Text style={styles.styleDesc}>{t('options.styles.' + st.key + '.desc')}</Text>
              </View>
              {travelStyle === st.key && (
                <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          <View style={styles.infoCard}>
            <Text style={styles.appName}>AI-Powered Intelligent Tourist Companion</Text>
            <Text style={styles.appDesc}>
              Smart India Hackathon (SIH26204) — Travel & Tourism.{'\n'}
              RAG Heritage Guidance • Vision Artifacts • Multilingual TTS • Dynamic Itineraries
            </Text>
            <Text style={styles.appVersion}>Prototype v1.0.0 (Internal College Edition)</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsGroup}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleResetOnboarding}>
            <MaterialIcons name="restart-alt" size={18} color={Colors.textSecondary} />
            <Text style={styles.resetText}>Re-run Setup Tour</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <MaterialIcons name="logout" size={18} color={Colors.error} />
            <Text style={styles.signOutText}>{isGuest ? 'Exit Guest Session' : 'Sign Out'}</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.xs,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  avatarText: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '800',
    color: Colors.background,
  },
  userName: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.25)',
  },
  guestText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  loginBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  loginBannerText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.background,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: 100,
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  menuCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuCardTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  menuCardCount: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  langRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  langCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  langActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
  },
  langFlag: {
    fontSize: 24,
  },
  langName: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  langNameActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  interestActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212, 175, 124, 0.16)',
  },
  interestIcon: {
    fontSize: 16,
  },
  interestLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  activeText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  styleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  styleActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
  },
  styleIcon: {
    fontSize: 24,
  },
  styleLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  styleDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  appName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  appDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  appVersion: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  actionsGroup: {
    gap: Spacing.sm,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.3)',
  },
  signOutText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
  },
  walletBanner: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181822',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.25)',
    gap: 12,
  },
  walletBannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
  },
  walletBannerEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  walletBadge: {
    backgroundColor: 'rgba(127, 182, 133, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  walletBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.success,
  },
  walletBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 2,
  },
  walletBannerSubtitle: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
