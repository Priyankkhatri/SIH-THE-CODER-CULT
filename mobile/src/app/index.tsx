import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useUserStore, usePlacesStore, useChatStore } from '../stores';

const { width, height } = Dimensions.get('window');

const LOADING_MESSAGES = [
  'Calibrating Heritage GPS Radar...',
  'Connecting 3,696+ Centrally Protected Monuments...',
  'Initializing Neural AI Cultural Guide...',
  'Welcome to Yatra — Explore • Discover • Belong',
];

export default function LoadingScreen() {
  const router = useRouter();
  const { isOnboarded, loadFromStorage } = useUserStore();
  const { loadFavorites } = usePlacesStore();
  const { loadChat } = useChatStore();

  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // Animations
  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  const imageScaleAnim = useRef(new Animated.Value(1)).current;
  const radarSpinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.85)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Initial screen fade in & slow cinematic background zoom
    Animated.parallel([
      Animated.timing(screenFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(imageScaleAnim, {
        toValue: 1.06,
        duration: 3500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Continuous rotating radar animation
    const spinLoop = Animated.loop(
      Animated.timing(radarSpinAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    // 3. Pulsing core animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // 4. Background preloading of stores in parallel
    Promise.all([
      loadFromStorage().catch(() => {}),
      loadFavorites().catch(() => {}),
      loadChat().catch(() => {}),
    ]);

    // 5. Fast, smooth progress transition
    const startTime = Date.now();
    const duration = 750; // Snappy 750ms cold-start

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (currentProgress < 35) {
        setMessageIndex(0);
      } else if (currentProgress < 70) {
        setMessageIndex(1);
      } else {
        setMessageIndex(2);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          navigateNext();
        }, 150);
      }
    }, 75);

    return () => {
      clearInterval(interval);
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  const navigateNext = () => {
    Animated.timing(screenFadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      const userState = useUserStore.getState();
      const hasActiveSession = !!(userState.token || userState.isGuest || userState.isOnboarded);
      if (hasActiveSession) {
        router.replace('/(tabs)' as any);
      } else {
        router.replace('/auth/login' as any);
      }
    });
  };

  const spinInterpolate = radarSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const reverseSpinInterpolate = radarSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenFadeAnim }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Cinematic Background Image */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ scale: imageScaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../../assets/images/loading-screen.jpeg')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          priority="high"
        />
      </Animated.View>

      {/* Dark Subtle Vignette Gradient Overlay */}
      <View style={styles.vignetteOverlay} />

      {/* Main Interactive Loading Overlay */}
      <Animated.View style={[styles.contentContainer, { opacity: contentFadeAnim }]}>
        {/* Radar Hologram Animation in the sky above horizon */}
        <View style={styles.radarWrapper}>
          {/* Outer Orbiting Compass Ring */}
          <Animated.View
            style={[
              styles.outerRing,
              { transform: [{ rotate: spinInterpolate }] },
            ]}
          >
            <View style={styles.orbitingParticle} />
            <View style={[styles.orbitingParticle, styles.orbitingParticleOpposite]} />
          </Animated.View>

          {/* Inner Counter-Rotating Ring */}
          <Animated.View
            style={[
              styles.innerRing,
              { transform: [{ rotate: reverseSpinInterpolate }] },
            ]}
          >
            <View style={styles.innerParticle} />
          </Animated.View>

          {/* Pulsing Core Glowing Badge */}
          <Animated.View
            style={[
              styles.centerCore,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <MaterialIcons name="explore" size={24} color={Colors.primary} />
          </Animated.View>
        </View>

        {/* Loading Progress Card */}
        <View style={styles.progressCard}>
          {/* Status Message */}
          <View style={styles.statusRow}>
            <View style={styles.pulsingDot} />
            <Text style={styles.statusText} numberOfLines={1}>
              {LOADING_MESSAGES[messageIndex]}
            </Text>
            <Text style={styles.percentText}>{progress}%</Text>
          </View>

          {/* Progress Bar Track */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Bottom Metadata & Fast Skip Button */}
        <View style={styles.bottomBar}>
          <Text style={styles.footerTag}>
            CENTRAL HERITAGE ATLAS • ASI RECOGNISED
          </Text>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={navigateNext}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Sign In / Skip</Text>
            <MaterialIcons name="arrow-forward" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 10, 15, 0.25)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },

  // Radar Animation
  radarWrapper: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  outerRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 124, 0.40)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitingParticle: {
    position: 'absolute',
    top: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  orbitingParticleOpposite: {
    top: undefined,
    bottom: -4,
    backgroundColor: '#FFF',
  },
  innerRing: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerParticle: {
    position: 'absolute',
    left: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
  },
  centerCore: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20, 20, 31, 0.85)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },

  // Progress Card
  progressCard: {
    backgroundColor: 'rgba(23, 23, 23, 0.90)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: Spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  statusText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 0.3,
    fontFamily: Typography.fontFamily.serif,
  },
  percentText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
    fontVariant: ['tabular-nums'],
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  footerTag: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(245, 240, 232, 0.65)',
    letterSpacing: 0.8,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(29, 29, 29, 0.80)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.35)',
  },
  skipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
});
