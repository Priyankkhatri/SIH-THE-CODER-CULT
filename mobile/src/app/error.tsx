import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export default function ErrorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <MaterialIcons name="warning-amber" size={56} color={Colors.error} />
        </View>

        <Text style={styles.title}>Something Went Wrong</Text>
        <Text style={styles.message}>
          We encountered an unexpected issue while loading heritage information. Don't worry, your offline cached records and saved tours are safe.
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.85}>
            <MaterialIcons name="refresh" size={20} color={Colors.background} />
            <Text style={styles.primaryBtnText}>Reload Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()} activeOpacity={0.85}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.text} />
            <Text style={styles.secondaryBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 340,
    gap: Spacing.base,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonGroup: {
    width: '100%',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  primaryBtnText: {
    color: Colors.background,
    fontWeight: '700',
    fontSize: Typography.sizes.base,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  secondaryBtnText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: Typography.sizes.base,
  },
});
