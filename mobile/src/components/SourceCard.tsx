import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface SourceCardProps {
  name: string;
  url?: string;
  reliabilityScore?: number;
  snippet?: string;
}

export function SourceCard({ name, url, reliabilityScore = 0.98, snippet }: SourceCardProps) {
  const handlePress = () => {
    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={url ? 0.7 : 1}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <MaterialIcons name="verified" size={14} color={Colors.success} />
          <Text style={styles.badgeText}>Verified Citation</Text>
        </View>
        <Text style={styles.scoreText}>{Math.round(reliabilityScore * 100)}% Match</Text>
      </View>

      <Text style={styles.sourceName} numberOfLines={2}>{name}</Text>

      {snippet && (
        <Text style={styles.snippet} numberOfLines={3}>
          "{snippet}"
        </Text>
      )}

      {url && (
        <View style={styles.footer}>
          <Text style={styles.linkText}>View Source Document</Text>
          <MaterialIcons name="open-in-new" size={14} color={Colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.success,
  },
  scoreText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  sourceName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  snippet: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  linkText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.primary,
  },
});
