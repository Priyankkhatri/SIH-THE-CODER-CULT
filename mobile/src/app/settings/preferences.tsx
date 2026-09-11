import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows, INTERESTS_OPTIONS, TRAVEL_STYLES, DURATION_OPTIONS } from '../../constants/theme';
import { useUserStore } from '../../stores';
import { profileApi } from '../../services/api';

export default function PreferencesSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { interests: userInterests, travelStyle: userStyle, duration: userDuration, userId, setPreferences } = useUserStore();

  const [interests, setSelectedInterests] = useState<string[]>(userInterests || ['heritage']);
  const [style, setSelectedStyle] = useState<string>(userStyle || 'moderate');
  const [duration, setSelectedDuration] = useState<string>(userDuration || '90min');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleInterest = (key: string) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    setPreferences({
      interests,
      travelStyle: style,
      duration,
    });

    if (userId) {
      try {
        await profileApi.updatePreferences({
          userId,
          interests,
          travelStyle: style,
          duration,
        });
      } catch (e) {
        // Saved locally
      }
    }

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Travel Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {savedSuccess && (
          <View style={styles.successBanner}>
            <MaterialIcons name="check-circle" size={18} color={Colors.success} />
            <Text style={styles.successBannerText}>Preferences synchronized successfully!</Text>
          </View>
        )}

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Categories</Text>
          <Text style={styles.sectionSubtitle}>Tailors your home recommendations and exploration map.</Text>
          <View style={styles.chipRow}>
            {INTERESTS_OPTIONS.map((item) => {
              const isSelected = interests.includes(item.key);
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.interestChip, isSelected && styles.interestChipSelected]}
                  onPress={() => toggleInterest(item.key)}
                >
                  <Text style={styles.interestIcon}>{item.icon}</Text>
                  <Text style={[styles.interestText, isSelected && styles.interestTextSelected]}>
                    {item.label}
                  </Text>
                  {isSelected && <MaterialIcons name="check" size={16} color={Colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Travel Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exploration Pace</Text>
          <View style={styles.styleList}>
            {TRAVEL_STYLES.map((s) => {
              const isSelected = style === s.key;
              return (
                <TouchableOpacity
                  key={s.key}
                  style={[styles.styleCard, isSelected && styles.styleCardSelected]}
                  onPress={() => setSelectedStyle(s.key)}
                >
                  <Text style={styles.styleIcon}>{s.icon}</Text>
                  <View style={styles.styleDetails}>
                    <Text style={[styles.styleTitle, isSelected && styles.styleTitleSelected]}>{s.label}</Text>
                    <Text style={styles.styleDesc}>{s.description}</Text>
                  </View>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Default Tour Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Tour Duration</Text>
          <View style={styles.durationGrid}>
            {DURATION_OPTIONS.map((d) => {
              const isSelected = duration === d.key;
              return (
                <TouchableOpacity
                  key={d.key}
                  style={[styles.durationCard, isSelected && styles.durationCardSelected]}
                  onPress={() => setSelectedDuration(d.key)}
                >
                  <Text style={[styles.durationTitle, isSelected && styles.durationTitleSelected]}>{d.label}</Text>
                  <Text style={styles.durationDesc}>{d.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.85}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.background} />
          ) : (
            <>
              <MaterialIcons name="save" size={20} color={Colors.background} />
              <Text style={styles.saveBtnText}>Save Preferences</Text>
            </>
          )}
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  successBannerText: {
    color: Colors.success,
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  interestChipSelected: {
    backgroundColor: 'rgba(212, 169, 71, 0.15)',
    borderColor: Colors.primary,
  },
  interestIcon: {
    fontSize: 16,
  },
  interestText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  interestTextSelected: {
    color: Colors.primary,
  },
  styleList: {
    gap: Spacing.sm,
  },
  styleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  styleCardSelected: {
    backgroundColor: 'rgba(212, 169, 71, 0.1)',
    borderColor: Colors.primary,
  },
  styleIcon: {
    fontSize: 24,
  },
  styleDetails: {
    flex: 1,
  },
  styleTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  styleTitleSelected: {
    color: Colors.primary,
  },
  styleDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  durationCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durationCardSelected: {
    backgroundColor: 'rgba(212, 169, 71, 0.12)',
    borderColor: Colors.primary,
  },
  durationTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
  },
  durationTitleSelected: {
    color: Colors.primary,
  },
  durationDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.base,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: Colors.background,
    fontSize: Typography.sizes.base,
    fontWeight: '700',
  },
});
