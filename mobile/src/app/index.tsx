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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useUserStore, usePlacesStore, useChatStore } from '../stores';

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
  const router = useRouter();
  const { loadFromStorage } = useUserStore();
  const { loadFavorites } = usePlacesStore();
  const { loadChat } = useChatStore();

  const [hasNavigated, setHasNavigated] = useState(false);

  // Animations
  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const imageScaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Smooth entrance animations: fade in screen, scale background slightly, fade in brand content
    Animated.parallel([
      Animated.timing(screenFadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(imageScaleAnim, {
        toValue: 1.05,
        duration: 3000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 850,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Hydrate local stores in parallel
    const minDisplayPromise = new Promise((resolve) => setTimeout(resolve, 800));
    const hydrationPromise = Promise.allSettled([
      loadFromStorage(),
      loadFavorites(),
      loadChat(),
    ]);

    // 3. Smooth transition once minimum aesthetic delay and hydration complete
    Promise.all([hydrationPromise, minDisplayPromise]).then(() => {
      navigateNext();
    });

    // Safety fallback: if anything hangs, guarantee navigation within 1.5s
    const timeout = setTimeout(() => {
      navigateNext();
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const navigateNext = () => {
    if (hasNavigated) return;
    setHasNavigated(true);

    Animated.timing(screenFadeAnim, {
      toValue: 0,
      duration: 350,
      easing: Easing.in(Easing.quad),
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

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenFadeAnim }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Cinematic Heritage Background */}
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

      {/* Luxury Gradient Vignette Overlay */}
      <LinearGradient
        colors={['rgba(15, 15, 15, 0.45)', 'rgba(15, 15, 15, 0.70)', '#0F0F0F']}
        locations={[0, 0.55, 0.95]}
        style={StyleSheet.absoluteFill}
      />

      {/* Center Brand Identity */}
      <Animated.View style={[styles.brandCenter, { opacity: contentFadeAnim }]}>
        <View style={styles.emblemWrapper}>
          <Image
            source={require('../../assets/images/app-logo.jpeg')}
            style={styles.emblemImage}
            contentFit="cover"
          />
        </View>

        <Text style={styles.brandTitle}>Y A T R A</Text>
        <View style={styles.goldSeparator} />
        <Text style={styles.brandSubtitle}>EXPLORE • UNDERSTAND • BELONG</Text>
      </Animated.View>

      {/* Bottom Editorial Loading Cue & Skip */}
      <Animated.View style={[styles.bottomContainer, { opacity: contentFadeAnim }]}>
        <View style={styles.progressSection}>
          <View style={styles.progressBarTrack}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.loadingCaption}>Preparing your journey</Text>
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={navigateNext}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
        >
          <Text style={styles.skipText}>Enter</Text>
          <Ionicons name="arrow-forward" size={12} color={Colors.primary} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  brandCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emblemWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 124, 0.45)',
    padding: 3,
    marginBottom: Spacing.lg,
    backgroundColor: 'rgba(23, 23, 23, 0.75)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  emblemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  brandTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 6,
    color: Colors.text,
    textAlign: 'center',
  },
  goldSeparator: {
    width: 36,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
    marginVertical: Spacing.sm + 2,
    opacity: 0.85,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.5,
    color: Colors.primaryLight,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // Bottom section
  bottomContainer: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
    alignItems: 'center',
    gap: Spacing.lg,
  },
  progressSection: {
    alignItems: 'center',
    width: 160,
  },
  progressBarTrack: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  loadingCaption: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.6,
    fontWeight: '500',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.25)',
    backgroundColor: 'rgba(23, 23, 23, 0.60)',
  },
  skipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
});
