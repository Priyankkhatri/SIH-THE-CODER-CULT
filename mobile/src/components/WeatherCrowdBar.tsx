import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { getLiveWeather, getLiveCrowd, WeatherInfo, CrowdInfo } from '../utils/touristMeta';
import { WeatherCrowdBarSkeleton } from './Skeleton';

interface WeatherCrowdBarProps {
  latitude?: number;
  longitude?: number;
  placeName?: string;
  variant?: 'compact' | 'full';
  isLoading?: boolean;
}

export function WeatherCrowdBar({
  latitude = 22.3072,
  longitude = 73.1812,
  placeName,
  variant = 'compact',
  isLoading = false,
}: WeatherCrowdBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [weather, setWeather] = useState<WeatherInfo>(() => getLiveWeather(latitude, longitude));

  // Live real-time weather from Open-Meteo (free, zero API key, exact coordinates)
  React.useEffect(() => {
    let isMounted = true;
    async function fetchLiveWeather() {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}&current_weather=true`,
          { signal: controller.signal }
        );
        clearTimeout(tid);
        if (!res.ok) return;
        const data = await res.json();
        const cur = data?.current_weather;
        if (!cur || !isMounted) return;

        const temp = Math.round(cur.temperature);
        const code = Number(cur.weathercode);
        let condition = 'Clear Sky';
        let icon = 'wb-sunny';

        if (code === 0) {
          condition = cur.is_day ? 'Clear & Sunny' : 'Clear Night';
          icon = cur.is_day ? 'wb-sunny' : 'nights-stay';
        } else if (code <= 3) {
          condition = 'Partly Cloudy';
          icon = 'cloud-queue';
        } else if (code <= 48) {
          condition = 'Misty / Fog';
          icon = 'cloud';
        } else if (code <= 67 || (code >= 80 && code <= 82)) {
          condition = 'Rain Showers';
          icon = 'grain';
        } else if (code >= 95) {
          condition = 'Thunderstorm';
          icon = 'thunderstorm';
        } else {
          condition = 'Pleasant';
          icon = 'wb-sunny';
        }

        // Recompute the fallback for the current lat/lng so humidity/advisory are fresh
        const freshFallback = getLiveWeather(latitude, longitude);
        if (isMounted) {
          setWeather({
            temp,
            condition,
            icon,
            humidity: freshFallback.humidity,
            advisory: freshFallback.advisory,
          });
        }
      } catch {
        // Retain fresh calculated fallback for current coordinates
        if (isMounted) setWeather(getLiveWeather(latitude, longitude));
      }
    }
    // Reset to fresh location-aware fallback immediately when coordinates change
    setWeather(getLiveWeather(latitude, longitude));
    fetchLiveWeather();
    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  if (isLoading) {
    return <WeatherCrowdBarSkeleton variant={variant} />;
  }

  const crowd: CrowdInfo = getLiveCrowd(placeName);
  const isMonumentView = Boolean(placeName);

  return (
    <TouchableOpacity
      style={[styles.container, variant === 'full' && styles.containerFull]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.88}
    >
      <View style={styles.row}>
        <View style={styles.metricItem}>
          <View style={styles.iconCircle}>
            <MaterialIcons name={weather.icon as any} size={16} color={Colors.primary} />
          </View>
          <View style={styles.metricTextWrap}>
            <Text style={styles.metricValue} numberOfLines={1}>{weather.temp}°C</Text>
            <Text style={styles.metricLabel} numberOfLines={1}>{weather.condition}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Crowd Level Chip */}
        <View style={styles.metricItem}>
          <View style={[styles.crowdDot, { backgroundColor: crowd.color }]} />
          <View style={styles.metricTextWrap}>
            <View style={styles.crowdHeader}>
              <Text style={styles.metricValue} numberOfLines={1}>
                {isMonumentView ? `${crowd.level} Crowd` : 'Tourism Radar'}
              </Text>
            </View>
            <Text style={styles.metricLabel} numberOfLines={1}>
              {isMonumentView ? `~${crowd.waitTimeMins}m wait time` : `${crowd.level} Flow · Open`}
            </Text>
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
            <Text style={styles.advisoryText}>
              {isMonumentView
                ? crowd.description
                : `Current visitor flow across regional monuments is ${(crowd.level || 'moderate').toLowerCase()}. Recommended visiting window: 8:00 AM – 11:30 AM and 4:30 PM – 6:30 PM.`}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 20,
    marginBottom: Spacing.md,
  },
  containerFull: {
    marginHorizontal: 0,
    marginBottom: Spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricItem: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricTextWrap: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
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
    backgroundColor: Colors.border,
    flexShrink: 0,
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
    flexShrink: 0,
  },
  advisoryBox: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
