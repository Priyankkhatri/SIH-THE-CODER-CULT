import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../constants/theme';

import type { Tabs } from 'expo-router';

export type CustomTabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];


interface TabItemConfig {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  isCenter?: boolean;
}

const TAB_CONFIG: Record<string, TabItemConfig> = {
  index: { icon: 'home', label: 'Home' },
  explore: { icon: 'explore', label: 'Explore' },
  ai: { icon: 'auto-awesome', label: 'AI Guide', isCenter: true },
  plan: { icon: 'route', label: 'Plan' },
  profile: { icon: 'person', label: 'Profile' },
};

export function AnimatedBottomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Continuous breathing pulse animation for the center AI Orb
  const aiPulseAnim = useRef(new Animated.Value(1)).current;
  const aiGlowAnim = useRef(new Animated.Value(0.4)).current;

  // Individual scale spring animations for each tab
  const tabScales = useRef(state.routes.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    // Elegant pulsing aura loop for the AI center Orb
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(aiPulseAnim, {
            toValue: 1.14,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(aiGlowAnim, {
            toValue: 0.85,
            duration: 1600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(aiPulseAnim, {
            toValue: 1,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(aiGlowAnim, {
            toValue: 0.4,
            duration: 1600,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [aiPulseAnim, aiGlowAnim]);

  const handleTabPress = (routeKey: string, routeName: string, index: number, isFocused: boolean) => {
    // Trigger snappy spring bounce animation
    if (tabScales[index]) {
      Animated.sequence([
        Animated.timing(tabScales[index], {
          toValue: 0.88,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.spring(tabScales[index], {
          toValue: 1,
          friction: 4,
          tension: 45,
          useNativeDriver: true,
        }),
      ]).start();
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.dockWrapper,
        { bottom: Math.max(insets.bottom, 12) + (Platform.OS === 'ios' ? 4 : 8) },
      ]}
    >
      <View style={styles.dockBar}>
        {state.routes.map((route: { key: string; name: string }, index: number) => {
          const descriptor = descriptors[route.key];
          const options = descriptor?.options || {};
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            icon: 'circle' as any,
            label: route.name,
          };
          const label = options.title !== undefined ? options.title : config.label;

          // SPECIAL CREATIVE CENTER BUTTON: AI Guide Orb
          if (config.isCenter) {
            return (
              <View key={route.key} style={styles.centerTabContainer}>
                {/* Pulsing Aura Ring */}
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.aiAuraRing,
                    {
                      transform: [{ scale: aiPulseAnim }],
                      opacity: aiGlowAnim,
                    },
                  ]}
                />

                <Animated.View style={{ transform: [{ scale: tabScales[index] || 1 }] }}>
                  <TouchableOpacity
                    style={[styles.aiCenterBtn, isFocused && styles.aiCenterBtnActive]}
                    onPress={() => handleTabPress(route.key, route.name, index, isFocused)}
                    activeOpacity={0.9}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isFocused }}
                    accessibilityLabel={label}
                  >
                    <MaterialIcons
                      name={config.icon}
                      size={24}
                      color={isFocused ? '#0A0A0E' : Colors.primary}
                    />
                    <Text
                      style={[
                        styles.aiCenterText,
                        isFocused && styles.aiCenterTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      AI Guide
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            );
          }

          // STANDARD TABS: Home, Explore, Plan, Profile
          return (
            <Animated.View
              key={route.key}
              style={[
                styles.tabBtnWrapper,
                { transform: [{ scale: tabScales[index] || 1 }] },
              ]}
            >
              <TouchableOpacity
                style={[styles.tabBtn, isFocused && styles.tabBtnActive]}
                onPress={() => handleTabPress(route.key, route.name, index, isFocused)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={label}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name={config.icon}
                    size={22}
                    color={isFocused ? Colors.primary : Colors.textMuted}
                  />
                  {isFocused && <View style={styles.activeDot} />}
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  dockBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 440,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(16, 16, 24, 0.94)',
    borderWidth: 1.2,
    borderColor: 'rgba(212, 175, 124, 0.28)',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 16,
  },
  tabBtnWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    width: '100%',
    gap: 2,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 24,
  },
  activeDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  tabLabelInactive: {
    color: Colors.textMuted,
  },

  // Creative Center AI Button Styles
  centerTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 68,
    marginHorizontal: 2,
  },
  aiAuraRing: {
    position: 'absolute',
    top: -18,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 124, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.4)',
  },
  aiCenterBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginTop: -16,
    backgroundColor: '#1E1E2A',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 124, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    gap: 1,
  },
  aiCenterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: '#FFFFFF',
    shadowOpacity: 0.6,
    shadowRadius: 14,
  },
  aiCenterText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  aiCenterTextActive: {
    color: '#0A0A0E',
    fontWeight: '900',
  },
});
