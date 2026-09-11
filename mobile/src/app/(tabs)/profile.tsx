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
import { Colors, Typography, Spacing, BorderRadius, LANGUAGES, INTERESTS_OPTIONS, TRAVEL_STYLES } from '../../constants/theme';
import { useUserStore, usePlacesStore } from '../../stores';
import { useTranslation } from '../../hooks/useTranslation';

export default function ProfileScreen() {
  const router = useRouter();
  const { name, language, interests, travelStyle, duration, setLanguage, setPreferences, setOnboarded } = useUserStore();
  const { t } = useTranslation();
  const { favorites } = usePlacesStore();

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{name}</Text>
        <View style={styles.guestBadge}>
          <MaterialIcons name="person-outline" size={14} color={Colors.primary} />
          <Text style={styles.guestText}>{t('common.guestMode')}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Language */}
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
          {TRAVEL_STYLES.map((style) => (
            <TouchableOpacity
              key={style.key}
              style={[styles.styleCard, travelStyle === style.key && styles.styleActive]}
              onPress={() => setPreferences({ travelStyle: style.key })}
            >
              <Text style={styles.styleIcon}>{style.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.styleLabel, travelStyle === style.key && styles.activeText]}>
                  {t('options.styles.' + style.key + '.label')}
                </Text>
                <Text style={styles.styleDesc}>{t('options.styles.' + style.key + '.desc')}</Text>
              </View>
              {travelStyle === style.key && (
                <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'hi' ? 'आपके आंकड़े' : language === 'gu' ? 'તમારા આંકડા' : 'Your Stats'}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialIcons name="favorite" size={22} color={Colors.error} />
              <Text style={styles.statValue}>{favorites.length}</Text>
              <Text style={styles.statLabel}>{language === 'hi' ? 'सहेजे गए' : language === 'gu' ? 'સાચવેલા' : 'Saved'}</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="translate" size={22} color={Colors.accent} />
              <Text style={styles.statValue}>{currentLang?.name || 'English'}</Text>
              <Text style={styles.statLabel}>{language === 'hi' ? 'भाषा' : language === 'gu' ? 'ભાષા' : 'Language'}</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="schedule" size={22} color={Colors.primary} />
              <Text style={styles.statValue}>{duration}</Text>
              <Text style={styles.statLabel}>{language === 'hi' ? 'समय' : language === 'gu' ? 'સમય' : 'Duration'}</Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'hi' ? 'ऐप के बारे में' : language === 'gu' ? 'ઍપ વિશે' : 'About'}</Text>
          <View style={styles.infoCard}>
            <Text style={styles.appName}>AI Tourist Companion</Text>
            <Text style={styles.appDesc}>
              Heritage discovery reimagined for the mobile tourist.{'\n'}
              SIH26204 — Internal College Hackathon
            </Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleResetOnboarding}>
          <MaterialIcons name="logout" size={18} color={Colors.error} />
          <Text style={styles.resetText}>{t('profile.resetApp')}</Text>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '800',
    color: Colors.textInverse,
  },
  userName: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '20',
  },
  guestText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 120,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  langRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 4,
  },
  langActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceHighlight,
  },
  langFlag: {
    fontSize: 24,
  },
  langName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  langNameActive: {
    color: Colors.primary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  interestActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  interestIcon: {
    fontSize: 16,
  },
  interestLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeText: {
    color: Colors.primary,
  },
  styleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  styleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceHighlight,
  },
  styleIcon: {
    fontSize: 28,
  },
  styleLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  styleDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    padding: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  infoCard: {
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  appName: {
    fontSize: Typography.sizes.lg,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 8,
  },
  appDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.error + '40',
    backgroundColor: Colors.error + '10',
  },
  resetText: {
    fontSize: Typography.sizes.base,
    color: Colors.error,
    fontWeight: '600',
  },
});
