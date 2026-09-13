import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, LANGUAGES, INTERESTS_OPTIONS, TRAVEL_STYLES, DURATION_OPTIONS } from '../constants/theme';
import { useUserStore } from '../stores';
import { useTranslation } from '../hooks/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const STEPS = ['language', 'interests', 'style', 'duration'] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const { setLanguage, setPreferences, setOnboarded, setUser } = useUserStore();
  const [step, setStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { t } = useTranslation(selectedLanguage);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['heritage']);
  const [selectedStyle, setSelectedStyle] = useState('moderate');
  const [selectedDuration, setSelectedDuration] = useState('90min');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateStep = (next: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setStep(next), 150);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      animateStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    try {
      setLanguage(selectedLanguage);
      setPreferences({
        interests: selectedInterests,
        travelStyle: selectedStyle,
        duration: selectedDuration,
      });
      setUser(`guest-${Date.now()}`, `guest-token-${Date.now()}`, 'Tourist');
      setOnboarded(true);
    } catch (e) {
      console.warn('Onboarding state save:', e);
    }
    router.replace('/(tabs)');
  };


  const toggleInterest = (key: string) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const renderLanguageStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepEmoji}>🌍</Text>
      <Text style={styles.stepTitle}>{t('onboarding.chooseLanguage')}</Text>
      <Text style={styles.stepSubtitle}>{t('onboarding.languageSubtitle')}</Text>
      <View style={styles.optionsGrid}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.languageCard, selectedLanguage === lang.code && styles.selectedCard]}
            onPress={() => setSelectedLanguage(lang.code)}
          >
            <Text style={styles.languageFlag}>{lang.flag}</Text>
            <Text style={[styles.languageName, selectedLanguage === lang.code && styles.selectedText]}>
              {lang.nativeName}
            </Text>
            <Text style={styles.languageSubname}>{lang.name}</Text>
            {selectedLanguage === lang.code && (
              <MaterialIcons name="check-circle" size={20} color={Colors.primary} style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderInterestsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepEmoji}>🎯</Text>
      <Text style={styles.stepTitle}>{t('onboarding.whatInterests')}</Text>
      <Text style={styles.stepSubtitle}>{t('onboarding.interestsSubtitle')}</Text>
      <View style={styles.interestsGrid}>
        {INTERESTS_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.interestCard, selectedInterests.includes(opt.key) && styles.selectedCard]}
            onPress={() => toggleInterest(opt.key)}
          >
            <Text style={styles.interestIcon}>{opt.icon}</Text>
            <Text style={[styles.interestLabel, selectedInterests.includes(opt.key) && styles.selectedText]}>
              {t('options.interests.' + opt.key)}
            </Text>
            {selectedInterests.includes(opt.key) && (
              <MaterialIcons name="check-circle" size={18} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStyleStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepEmoji}>🚶</Text>
      <Text style={styles.stepTitle}>{t('onboarding.yourTravelStyle')}</Text>
      <Text style={styles.stepSubtitle}>{t('onboarding.styleSubtitle')}</Text>
      <View style={styles.styleList}>
        {TRAVEL_STYLES.map((style) => (
          <TouchableOpacity
            key={style.key}
            style={[styles.styleCard, selectedStyle === style.key && styles.selectedCard]}
            onPress={() => setSelectedStyle(style.key)}
          >
            <Text style={styles.styleEmoji}>{style.icon}</Text>
            <View style={styles.styleInfo}>
              <Text style={[styles.styleLabel, selectedStyle === style.key && styles.selectedText]}>
                {t('options.styles.' + style.key + '.label')}
              </Text>
              <Text style={styles.styleDesc}>{t('options.styles.' + style.key + '.desc')}</Text>
            </View>
            {selectedStyle === style.key && (
              <MaterialIcons name="check-circle" size={22} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDurationStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepEmoji}>⏱️</Text>
      <Text style={styles.stepTitle}>{t('onboarding.availableTime')}</Text>
      <Text style={styles.stepSubtitle}>{t('onboarding.durationSubtitle')}</Text>
      <View style={styles.durationGrid}>
        {DURATION_OPTIONS.map((dur) => (
          <TouchableOpacity
            key={dur.key}
            style={[styles.durationCard, selectedDuration === dur.key && styles.selectedCard]}
            onPress={() => setSelectedDuration(dur.key)}
          >
            <Text style={[styles.durationLabel, selectedDuration === dur.key && styles.selectedText]}>
              {t('options.durations.' + dur.key + '.label')}
            </Text>
            <Text style={styles.durationDesc}>{t('options.durations.' + dur.key + '.desc')}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const stepRenderers = [renderLanguageStep, renderInterestsStep, renderStyleStep, renderDurationStep];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressRow}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
          ))}
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>{t('common.skip')}</Text>
        </TouchableOpacity>
      </View>

      {/* Step Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {stepRenderers[step]()}
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {step > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={() => animateStep(step - 1)}>
            <MaterialIcons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {step === STEPS.length - 1 ? (t('common.getStarted') + ' 🚀') : t('common.next')}
          </Text>
          <MaterialIcons name="arrow-forward" size={20} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.base,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  stepContent: {
    alignItems: 'center',
    paddingTop: Spacing['2xl'],
  },
  stepEmoji: {
    fontSize: 48,
    marginBottom: Spacing.base,
  },
  stepTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.serif,
  },
  stepSubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  languageCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    width: (width - 80) / 3,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceHighlight,
  },
  languageFlag: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  languageName: {
    fontSize: Typography.sizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  languageSubname: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  selectedText: {
    color: Colors.primary,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  interestsGrid: {
    width: '100%',
    gap: 10,
  },
  interestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 12,
  },
  interestIcon: {
    fontSize: 28,
  },
  interestLabel: {
    flex: 1,
    fontSize: Typography.sizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  styleList: {
    width: '100%',
    gap: 12,
  },
  styleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 14,
  },
  styleEmoji: {
    fontSize: 32,
  },
  styleInfo: {
    flex: 1,
  },
  styleLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  styleDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
  },
  durationCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    width: (width - 72) / 2,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  durationLabel: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  durationDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
    paddingTop: Spacing.base,
    gap: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextButton: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
