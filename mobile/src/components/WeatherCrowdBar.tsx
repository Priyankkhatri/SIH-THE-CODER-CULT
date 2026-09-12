import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { getLiveWeather, getLiveCrowd, WeatherInfo, CrowdInfo } from '../utils/touristMeta';

interface WeatherCrowdBarProps {
  latitude?: number;
  longitude?: number;
  placeName?: string;
  variant?: 'compact' | 'full';
}

export function WeatherCrowdBar({ latitude = 22.3072, longitude = 73.1812, placeName, variant = 'compact' }: WeatherCrowdBarProps) {
  const [expanded, setExpanded] = useState(false);
  const weather: WeatherInfo = getLiveWeather(latitude, longitude);
  const crowd: CrowdInfo = getLiveCrowd(placeName);

  return (
    <TouchableOpacity
      style={[styles.container, variant === 'full' && styles.containerFull]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.88}
    >
      <View style={styles.row}>
        {/* Weather Chip */}
        <View style={styles.metricItem}>
          <View style={styles.iconCircle}>
            <MaterialIcons name={weather.icon as any} size={16} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.metricValue}>{weather.temp}°C</Text>
            <Text style={styles.metricLabel}>{weather.condition}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Crowd Level Chip */}
        <View style={styles.metricItem}>
          <View style={[styles.crowdDot, { backgroundColor: crowd.color }]} />
          <View>
            <View style={styles.crowdHeader}>
              <Text style={styles.metricValue}>{crowd.level} Crowd</Text>
            </View>
            <Text style={styles.metricLabel}>~{crowd.waitTimeMins}m wait time</Text>
          </View>
        </View>

        <MaterialIcons
          name={expanded ? 'expand-less' : 'info-outline'}
          size={18}
          color={Colors.textMuted}
          style={styles.infoIcon}
        />
      </View>

      {/* Expanded Advisory Details */}
      {expanded && (
        <View style={styles.advisoryBox}>
          <View style={styles.advisoryRow}>
            <MaterialIcons name="lightbulb-outline" size={15} color={Colors.primary} />
            <Text style={styles.advisoryText}>{weather.advisory}</Text>
          </View>
          <View style={styles.advisoryRow}>
            <MaterialIcons name="groups" size={15} color={crowd.color} />
            <Text style={styles.advisoryText}>{crowd.description}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.25)',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  containerFull: {
    marginHorizontal: 0,
    marginBottom: Spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 169, 71, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  metricLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.divider,
  },
  crowdDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  crowdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginLeft: 4,
  },
  advisoryBox: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 6,
  },
  advisoryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  advisoryText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
