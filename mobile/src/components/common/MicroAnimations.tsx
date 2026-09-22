import React, { useRef, useEffect } from 'react';
import {
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';

interface ScalePressableProps extends TouchableOpacityProps {
  children: React.ReactNode;
  minScale?: number;
  style?: StyleProp<ViewStyle>;
  friction?: number;
  tension?: number;
}

/**
 * ScalePressable gives buttons, cards, and chips a tactile physical feel
 * found in premier Play Store apps (Airbnb, Uber, Spotify).
 */
export function ScalePressable({
  children,
  minScale = 0.96,
  style,
  friction = 7,
  tension = 120,
  activeOpacity = 0.9,
  onPressIn,
  onPressOut,
  ...rest
}: ScalePressableProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: minScale,
      useNativeDriver: true,
      friction,
      tension,
    }).start();
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction,
      tension,
    }).start();
    if (onPressOut) onPressOut(e);
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
      {...rest}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

interface SlideTransitionProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  visible?: boolean;
  distance?: number;
  duration?: number;
}

/**
 * SlideUpView animates bottom sheets and cards smoothly up with spring physics.
 */
export function SlideUpView({
  children,
  style,
  distance = 120,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  distance?: number;
}) {
  const translateY = useRef(new Animated.Value(distance)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 18,
        stiffness: 140,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ translateY }], opacity }]}>
      {children}
    </Animated.View>
  );
}

/**
 * SlideDownView animates headers and navigation HUDs smoothly from the top.
 */
export function SlideDownView({
  children,
  style,
  distance = 60,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  distance?: number;
}) {
  const translateY = useRef(new Animated.Value(-distance)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 18,
        stiffness: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ translateY }], opacity }]}>
      {children}
    </Animated.View>
  );
}

/**
 * PulseBeacon creates a gentle breathing glow for live indicators (GPS, live crowd, active route).
 */
export function PulseBeacon({
  color = '#10B981',
  size = 8,
  glowSize = 18,
}: {
  color?: string;
  size?: number;
  glowSize?: number;
}) {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.35,
            duration: 1100,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.25,
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 1100,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, []);

  return (
    <View style={[styles.beaconContainer, { width: glowSize, height: glowSize }]}>
      <Animated.View
        style={[
          styles.beaconGlow,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: color,
            opacity: pulseAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <View
        style={[
          styles.beaconDot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

/**
 * SoundWaveVisualizer shows 4 animated audio equalizer bars when audio is playing.
 */
export function SoundWaveVisualizer({
  isPlaying,
  color = '#D4AF7C',
}: {
  isPlaying: boolean;
  color?: string;
}) {
  const bar1 = useRef(new Animated.Value(6)).current;
  const bar2 = useRef(new Animated.Value(14)).current;
  const bar3 = useRef(new Animated.Value(9)).current;
  const bar4 = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (!isPlaying) {
      Animated.parallel([
        Animated.timing(bar1, { toValue: 4, duration: 150, useNativeDriver: false }),
        Animated.timing(bar2, { toValue: 6, duration: 150, useNativeDriver: false }),
        Animated.timing(bar3, { toValue: 5, duration: 150, useNativeDriver: false }),
        Animated.timing(bar4, { toValue: 4, duration: 150, useNativeDriver: false }),
      ]).start();
      return;
    }

    const createBarLoop = (val: Animated.Value, minH: number, maxH: number, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: maxH, duration, useNativeDriver: false }),
          Animated.timing(val, { toValue: minH, duration, useNativeDriver: false }),
        ])
      );
    };

    const anim1 = createBarLoop(bar1, 4, 16, 280);
    const anim2 = createBarLoop(bar2, 6, 20, 360);
    const anim3 = createBarLoop(bar3, 5, 18, 310);
    const anim4 = createBarLoop(bar4, 4, 15, 250);

    anim1.start();
    anim2.start();
    anim3.start();
    anim4.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
      anim4.stop();
    };
  }, [isPlaying]);

  return (
    <View style={styles.soundWaveRow}>
      <Animated.View style={[styles.soundWaveBar, { height: bar1, backgroundColor: color }]} />
      <Animated.View style={[styles.soundWaveBar, { height: bar2, backgroundColor: color }]} />
      <Animated.View style={[styles.soundWaveBar, { height: bar3, backgroundColor: color }]} />
      <Animated.View style={[styles.soundWaveBar, { height: bar4, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  beaconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  beaconGlow: {
    position: 'absolute',
  },
  beaconDot: {
    zIndex: 1,
  },
  soundWaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2.5,
    height: 22,
    paddingHorizontal: 4,
  },
  soundWaveBar: {
    width: 3,
    borderRadius: 1.5,
  },
});
