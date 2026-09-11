import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, LANGUAGES } from '../../constants/theme';
import { useUserStore } from '../../stores';
import { profileApi } from '../../services/api';

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, userId } = useUserStore();

  const handleSelect = async (code: string) => {
    setLanguage(code);
    if (userId) {
      try {
        await profileApi.updateProfile({ userId, language: code });
      } catch (e) {
        // Saved locally
      }
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Language</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionDesc}>
          Choose your preferred language for text-to-speech audio guides, AI responses, and heritage monument stories.
        </Text>

        <View style={styles.list}>
          {LANGUAGES.map((item) => {
            const isSelected = language === item.code;
            return (
              <TouchableOpacity
                key={item.code}
                style={[styles.langCard, isSelected && styles.langCardSelected]}
                onPress={() => handleSelect(item.code)}
                activeOpacity={0.8}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <View style={styles.langDetails}>
                  <Text style={[styles.langName, isSelected && styles.langNameSelected]}>
                    {item.name}
                  </Text>
                  <Text style={styles.nativeName}>{item.nativeName}</Text>
                </View>

                {isSelected ? (
                  <View style={styles.selectedCircle}>
                    <MaterialIcons name="check" size={16} color={Colors.background} />
                  </View>
                ) : (
                  <View style={styles.unselectedCircle} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.audioNote}>
          <MaterialIcons name="record-voice-over" size={20} color={Colors.primary} />
          <Text style={styles.audioNoteText}>
            Audio narrations use native speech synthesis calibrated for standard Indian accents and regional dialects.
          </Text>
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
    gap: Spacing.base,
  },
  sectionDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  list: {
    gap: Spacing.md,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.base,
  },
  langCardSelected: {
    backgroundColor: 'rgba(212, 169, 71, 0.12)',
    borderColor: Colors.primary,
  },
  flag: {
    fontSize: 28,
  },
  langDetails: {
    flex: 1,
  },
  langName: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
  },
  langNameSelected: {
    color: Colors.primary,
  },
  nativeName: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  selectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  audioNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginTop: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.25)',
  },
  audioNoteText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
