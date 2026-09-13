import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows, INTERESTS_OPTIONS, DURATION_OPTIONS, TRAVEL_STYLES } from '../../constants/theme';
import { useUserStore } from '../../stores';
import { itineraryApi } from '../../services/api';
import { useLocation } from '../../hooks/useLocation';

export default function CreateItineraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const location = useLocation();
  const { interests: defaultInterests, duration: defaultDuration, travelStyle: defaultStyle, userId } = useUserStore();

  const [selectedDuration, setSelectedDuration] = useState(defaultDuration || '90min');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(defaultInterests || ['heritage']);
  const [selectedStyle, setSelectedStyle] = useState<string>(defaultStyle || 'moderate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleInterest = (key: string) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const handleGenerate = async () => {
    if (selectedInterests.length === 0) {
      setErrorMsg('Please choose at least one interest.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response: any = await itineraryApi.generate({
        latitude: location.latitude,
        longitude: location.longitude,
        interests: selectedInterests,
        duration: selectedDuration,
        travelStyle: selectedStyle,
      });

      if (response?.data) {
        // Save to backend
        const saveRes: any = await itineraryApi.save({
          userId: userId || 'guest-user',
          title: response.data.title,
          duration: selectedDuration,
          totalTime: response.data.totalTimeMinutes,
          items: response.data.items,
        });

        const newId = saveRes?.data?.id || response.data.id || `itin-${Date.now()}`;
        router.push(`/itinerary/${newId}` as any);
      } else {
        setErrorMsg('Failed to generate tour stops.');
      }
    } catch (e: any) {
      setErrorMsg(e?.error?.message || e?.message || 'Generation failed. Using offline fallback.');
      router.push('/itinerary/demo-itin-90' as any);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Curate Itinerary</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <MaterialIcons name="route" size={28} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>AI Heritage Route Optimizer</Text>
            <Text style={styles.introSubtitle}>
              Tailors realistic walking & driving schedules based on your available time and historical preferences.
            </Text>
          </View>
        </View>

        {errorMsg && (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={18} color={Colors.error} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Available Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Available Time</Text>
          <View style={styles.grid2}>
            {DURATION_OPTIONS.map((d) => {
              const isSelected = selectedDuration === d.key;
              return (
                <TouchableOpacity
                  key={d.key}
                  style={[styles.durationCard, isSelected && styles.durationCardSelected]}
                  onPress={() => setSelectedDuration(d.key)}
                >
                  <Text style={[styles.durationLabel, isSelected && styles.durationLabelSelected]}>{d.label}</Text>
                  <Text style={styles.durationDesc}>{d.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Cultural Interests</Text>
          <View style={styles.interestsGrid}>
            {INTERESTS_OPTIONS.map((item) => {
              const isSelected = selectedInterests.includes(item.key);
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.interestChip, isSelected && styles.interestChipSelected]}
                  onPress={() => toggleInterest(item.key)}
                >
                  <Text style={styles.interestIcon}>{item.icon}</Text>
                  <Text style={[styles.interestLabel, isSelected && styles.interestLabelSelected]}>{item.label}</Text>
                  {isSelected && <MaterialIcons name="check" size={16} color={Colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Travel Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Pace & Travel Style</Text>
          <View style={styles.styleColumn}>
            {TRAVEL_STYLES.map((s) => {
              const isSelected = selectedStyle === s.key;
              return (
                <TouchableOpacity
                  key={s.key}
                  style={[styles.styleCard, isSelected && styles.styleCardSelected]}
                  onPress={() => setSelectedStyle(s.key)}
                >
                  <Text style={styles.styleIcon}>{s.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.styleLabel, isSelected && styles.styleLabelSelected]}>{s.label}</Text>
                    <Text style={styles.styleDesc}>{s.description}</Text>
                  </View>
                  <View style={[styles.radioDot, isSelected && styles.radioDotSelected]} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Generate Action */}
        <TouchableOpacity
          style={[styles.generateBtn, isGenerating && styles.btnDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating}
          activeOpacity={0.85}
        >
          {isGenerating ? (
            <ActivityIndicator color={Colors.background} size="small" />
          ) : (
            <>
              <MaterialIcons name="auto-awesome" size={22} color={Colors.background} />
              <Text style={styles.generateBtnText}>Generate Optimized Route</Text>
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
    fontFamily: Typography.fontFamily.serif,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.xl,
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.25)',
    gap: Spacing.md,
  },
  introTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  introSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.3)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    flex: 1,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
  },
  grid2: {
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
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    borderColor: Colors.primary,
  },
  durationLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
  },
  durationLabelSelected: {
    color: Colors.primary,
  },
  durationDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  interestsGrid: {
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
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    borderColor: Colors.primary,
  },
  interestIcon: {
    fontSize: 16,
  },
  interestLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  interestLabelSelected: {
    color: Colors.primary,
  },
  styleColumn: {
    gap: Spacing.sm,
  },
  styleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  styleCardSelected: {
    backgroundColor: 'rgba(212, 175, 124, 0.10)',
    borderColor: Colors.primary,
  },
  styleIcon: {
    fontSize: 24,
  },
  styleLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  styleLabelSelected: {
    color: Colors.primary,
  },
  styleDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  radioDotSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  generateBtnText: {
    color: Colors.background,
    fontSize: Typography.sizes.base,
    fontWeight: '700',
  },
});
