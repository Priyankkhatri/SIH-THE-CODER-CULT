import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
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

// ── Jelly Tab Button with Physics Squash & Stretch + Hold Wobble ──
interface JellyTabButtonProps {
  config: TabItemConfig;
  label: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function JellyTabButton({ config, label, isFocused, onPress, onLongPress }: JellyTabButtonProps) {
  const scaleX = useRef(new Animated.Value(1)).current;
  const scaleY = useRef(new Animated.Value(1)).current;
  const rotateVal = useRef(new Animated.Value(0)).current;
  const isHolding = useRef(false);
  const holdAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  // Rotation interpolation for jiggle tilt: [-1 -> -5deg, 0 -> 0deg, 1 -> 5deg]
  const rotateDeg = rotateVal.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  const handlePressIn = () => {
    isHolding.current = true;

    // 1. Initial Jelly Squash: widen horizontally, compress vertically
    Animated.parallel([
      Animated.timing(scaleX, {
        toValue: 1.25,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.timing(scaleY, {
        toValue: 0.78,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.timing(rotateVal, {
        toValue: 0.4,
        duration: 110,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Touch-and-hold interaction: If held, enter continuous rhythmic jelly jiggle!
    holdAnimRef.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleX, { toValue: 1.16, duration: 140, useNativeDriver: true }),
          Animated.timing(scaleY, { toValue: 0.86, duration: 140, useNativeDriver: true }),
          Animated.timing(rotateVal, { toValue: -0.8, duration: 140, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scaleX, { toValue: 1.28, duration: 140, useNativeDriver: true }),
          Animated.timing(scaleY, { toValue: 0.76, duration: 140, useNativeDriver: true }),
          Animated.timing(rotateVal, { toValue: 0.8, duration: 140, useNativeDriver: true }),
        ]),
      ])
    );

    // Start hold jiggle loop after 260ms of holding
    setTimeout(() => {
      if (isHolding.current && holdAnimRef.current) {
        holdAnimRef.current.start();
      }
    }, 260);
  };

  const handlePressOut = () => {
    isHolding.current = false;
    if (holdAnimRef.current) {
      holdAnimRef.current.stop();
      holdAnimRef.current = null;
    }

    // 3. Elastic Jelly Rebound Wave: Boing! Oscillate before settling
    Animated.sequence([
      // Snap up tall & skinny
      Animated.parallel([
        Animated.timing(scaleX, { toValue: 0.82, duration: 90, useNativeDriver: true }),
        Animated.timing(scaleY, { toValue: 1.26, duration: 90, useNativeDriver: true }),
        Animated.timing(rotateVal, { toValue: -1, duration: 90, useNativeDriver: true }),
      ]),
      // Squash wide
      Animated.parallel([
        Animated.timing(scaleX, { toValue: 1.15, duration: 80, useNativeDriver: true }),
        Animated.timing(scaleY, { toValue: 0.88, duration: 80, useNativeDriver: true }),
        Animated.timing(rotateVal, { toValue: 0.7, duration: 80, useNativeDriver: true }),
      ]),
      // Slight stretch
      Animated.parallel([
        Animated.timing(scaleX, { toValue: 0.94, duration: 70, useNativeDriver: true }),
        Animated.timing(scaleY, { toValue: 1.08, duration: 70, useNativeDriver: true }),
        Animated.timing(rotateVal, { toValue: -0.3, duration: 70, useNativeDriver: true }),
      ]),
      // Settle smoothly
      Animated.parallel([
        Animated.spring(scaleX, { toValue: 1.0, friction: 3.5, tension: 55, useNativeDriver: true }),
        Animated.spring(scaleY, { toValue: 1.0, friction: 3.5, tension: 55, useNativeDriver: true }),
        Animated.spring(rotateVal, { toValue: 0, friction: 3.5, tension: 55, useNativeDriver: true }),
      ]),
    ]).start();
  };

  // ── CENTER AI ORB JELLY BUTTON ──
  if (config.isCenter) {
    return (
      <View style={styles.centerButtonOuter}>
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityState={{ selected: isFocused }}
          accessibilityLabel={label}
        >
          <Animated.View
            style={[
              styles.aiJellyPill,
              isFocused && styles.aiJellyPillActive,
              {
                transform: [
                  { scaleX },
                  { scaleY },
                  { rotate: rotateDeg },
                ],
              },
            ]}
          >
            <MaterialIcons
              name={config.icon}
              size={23}
              color={isFocused ? '#0A0A0E' : Colors.primary}
            />
            <Text
              style={[
                styles.aiJellyLabel,
                isFocused && styles.aiJellyLabelActive,
              ]}
              numberOfLines={1}
            >
              Yatra AI
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    );
  }

  // ── STANDARD TAB (Home, Explore, Plan, Profile) ──
  return (
    <Pressable
      style={styles.tabItemPressable}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
    >
      <Animated.View
        style={[
          styles.tabJellyCapsule,
          isFocused && styles.tabJellyCapsuleActive,
          {
            transform: [
              { scaleX },
              { scaleY },
              { rotate: rotateDeg },
            ],
          },
        ]}
      >
        <View style={styles.iconWrap}>
          <MaterialIcons
            name={config.icon}
            size={22}
            color={isFocused ? Colors.primary : Colors.textMuted}
          />
          {isFocused && <View style={styles.jellyActiveDot} />}
        </View>
        <Text
          style={[
            styles.tabJellyLabel,
            isFocused ? styles.tabJellyLabelActive : styles.tabJellyLabelInactive,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ── Main Docked Bottom Navigation Bar ──
export function AnimatedBottomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 10);

  return (
    <View
      style={[
        styles.dockedBarContainer,
        { paddingBottom: bottomPadding },
      ]}
    >
      <View style={styles.tabBarInner}>
        {state.routes.map((route: { key: string; name: string }, index: number) => {
          const descriptor = descriptors[route.key];
          const options = descriptor?.options || {};
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            icon: 'circle' as any,
            label: route.name,
          };
          const label = options.title !== undefined ? options.title : config.label;

          const handlePress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const handleLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <JellyTabButton
              key={route.key}
              config={config}
              label={label}
              isFocused={isFocused}
              onPress={handlePress}
              onLongPress={handleLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Docked to the very bottom — no floating margins!
  dockedBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(14, 14, 20, 0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 124, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 9999,
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 58,
    paddingHorizontal: 8,
  },

  // Standard Tab Styles
  tabItemPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabJellyCapsule: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 18,
    gap: 2,
    minWidth: 54,
  },
  tabJellyCapsuleActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.14)',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 24,
  },
  jellyActiveDot: {
    position: 'absolute',
    bottom: -3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  tabJellyLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  tabJellyLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  tabJellyLabelInactive: {
    color: Colors.textMuted,
  },

  // Center Yatra AI Jelly Button Styles
  centerButtonOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    width: 72,
  },
  aiJellyPill: {
    width: 60,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E1E2A',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 124, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    gap: 1,
  },
  aiJellyPillActive: {
    backgroundColor: Colors.primary,
    borderColor: '#FFFFFF',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  aiJellyLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  aiJellyLabelActive: {
    color: '#0A0A0E',
    fontWeight: '900',
  },
});
