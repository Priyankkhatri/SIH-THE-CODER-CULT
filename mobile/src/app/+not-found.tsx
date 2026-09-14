import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <MaterialIcons name="map" size={56} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Heritage Path Not Found</Text>
        <Text style={styles.message}>
          The requested monument, tour, or screen does not exist or may have moved. Let's get you back on track to explore India's cultural heritage.
        </Text>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/(tabs)/explore')}
          activeOpacity={0.85}
        >
          <MaterialIcons name="explore" size={20} color={Colors.background} />
          <Text style={styles.backBtnText}>Back to Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.85}
        >
          <Text style={styles.homeBtnText}>Return to Home</Text>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(212, 169, 71, 0.12)',
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    width: '100%',
    ...Shadows.md,
  },
  backBtnText: {
    color: Colors.background,
    fontWeight: '700',
    fontSize: Typography.sizes.base,
  },
  homeBtn: {
    padding: Spacing.md,
  },
  homeBtnText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: Typography.sizes.sm,
  },
});
