import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import type { RouteResult, RouteStep, TravelMode } from '../utils/routeService';
import type { Place } from '../stores';
import { ScalePressable, SlideUpView } from './common/MicroAnimations';

interface TurnByTurnSheetProps {
  destination: Place;
  routeInfo: RouteResult;
  currentMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
  onClose: () => void;
}

export function TurnByTurnSheet({
  destination,
  routeInfo,
  currentMode,
  onSelectMode,
  onClose,
}: TurnByTurnSheetProps) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const steps: RouteStep[] = routeInfo.steps || [];

  // Calculate arrival time
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + (routeInfo.durationMin || 15) * 60000);
  const arrivalTimeStr = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getManeuverIcon = (step: RouteStep): keyof typeof MaterialIcons.glyphMap => {
    const mod = step.modifier?.toLowerCase() || '';
    const type = step.maneuverType?.toLowerCase() || '';

    if (type === 'arrive') return 'place';
    if (type === 'depart') return 'navigation';
    if (mod.includes('left')) return 'turn-left';
    if (mod.includes('right')) return 'turn-right';
    if (mod.includes('straight')) return 'straight';
    if (type === 'roundabout') return 'rotate-right';
    return 'directions';
  };

  const speakNextStep = (stepText: string) => {
    Speech.stop();
    setIsVoiceActive(true);
    Speech.speak(stepText, {
      language: 'en-IN',
      pitch: 1.0,
      rate: 0.95,
      onDone: () => setIsVoiceActive(false),
      onError: () => setIsVoiceActive(false),
    });
  };

  return (
    <SlideUpView style={styles.sheetContainer} distance={180}>
      {/* Drag handle */}
      <View style={styles.dragHandle} />

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.destRow}>
            <MaterialIcons name="navigation" size={16} color={Colors.primary} />
            <Text style={styles.destTitle} numberOfLines={1}>
              {destination.name}
            </Text>
          </View>
          <Text style={styles.metricSub}>
            {routeInfo.distanceKm} km • ~{routeInfo.durationMin} min • Arrive by {arrivalTimeStr}
          </Text>
        </View>

        <ScalePressable style={styles.closeBtn} onPress={onClose}>
          <MaterialIcons name="close" size={18} color={Colors.textSecondary} />
        </ScalePressable>
      </View>

      {/* Travel Mode Switcher Tabs */}
      <View style={styles.modeTabsRow}>
        {[
          { key: 'driving' as TravelMode, icon: 'directions-car', label: 'Drive' },
          { key: 'transit' as TravelMode, icon: 'directions-transit', label: 'Auto/Transit' },
          { key: 'walking' as TravelMode, icon: 'directions-walk', label: 'Walk' },
        ].map((tab) => {
          const isActive = currentMode === tab.key;
          return (
            <ScalePressable
              key={tab.key}
              style={[styles.modeTab, isActive && styles.modeTabActive]}
              onPress={() => onSelectMode(tab.key)}
            >
              <MaterialIcons
                name={tab.icon as any}
                size={16}
                color={isActive ? '#0A0A0F' : Colors.textSecondary}
              />
              <Text style={[styles.modeTabText, isActive && styles.modeTabTextActive]}>
                {tab.label}
              </Text>
            </ScalePressable>
          );
        })}
      </View>

      {/* Voice prompt bar */}
      <View style={styles.voicePromptRow}>
        <ScalePressable
          style={[styles.voiceBtn, isVoiceActive && styles.voiceBtnActive]}
          onPress={() => {
            if (steps.length > 0) {
              const text = `Route to ${destination.name}. First instruction: ${steps[0].instruction}. Total distance is ${routeInfo.distanceKm} kilometers, estimated time ${routeInfo.durationMin} minutes.`;
              speakNextStep(text);
            }
          }}
        >
          <MaterialIcons
            name={isVoiceActive ? 'volume-up' : 'volume-mute'}
            size={16}
            color={isVoiceActive ? Colors.primary : Colors.textMuted}
          />
          <Text style={[styles.voiceBtnText, isVoiceActive && { color: Colors.primary }]}>
            {isVoiceActive ? 'Speaking Guidance…' : 'Read First Maneuver'}
          </Text>
        </ScalePressable>

        <ScalePressable
          style={styles.openExternalBtn}
          onPress={() => {
            const url = Platform.select({
              ios: `maps:0,0?q=${destination.latitude},${destination.longitude}`,
              android: `google.navigation:q=${destination.latitude},${destination.longitude}`,
              default: `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`,
            });
            if (url) Linking.openURL(url);
          }}
        >
          <MaterialIcons name="launch" size={14} color="#38BDF8" />
          <Text style={styles.openExternalText}>Launch Live GPS</Text>
        </ScalePressable>
      </View>

      {/* Steps List */}
      <ScrollView
        style={styles.stepsScroll}
        contentContainerStyle={styles.stepsContent}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((st, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === steps.length - 1;
          const icon = getManeuverIcon(st);

          return (
            <View key={idx} style={styles.stepItem}>
              {/* Timeline marker */}
              <View style={styles.timelineCol}>
                <View
                  style={[
                    styles.iconCircle,
                    isFirst && styles.iconCircleFirst,
                    isLast && styles.iconCircleLast,
                  ]}
                >
                  <MaterialIcons
                    name={icon}
                    size={16}
                    color={isFirst ? '#0A0A0F' : isLast ? '#10B981' : Colors.textSecondary}
                  />
                </View>
                {!isLast && <View style={styles.timelineLine} />}
              </View>

              {/* Step info */}
              <View style={styles.stepInfoCol}>
                <Text style={styles.stepInstruction}>
                  {st.instruction}
                </Text>
                <View style={styles.stepSubRow}>
                  {st.distanceMeters > 0 && (
                    <Text style={styles.stepSubText}>
                      {st.distanceMeters >= 1000
                        ? `${(st.distanceMeters / 1000).toFixed(1)} km`
                        : `${st.distanceMeters} m`}
                    </Text>
                  )}
                  {st.durationSeconds > 0 && (
                    <Text style={styles.stepSubText}>
                      • ~{Math.max(1, Math.round(st.durationSeconds / 60))} min
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SlideUpView>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(23, 23, 23, 0.98)',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.35)',
    maxHeight: 380,
    paddingHorizontal: Spacing.base,
    paddingTop: 10,
    paddingBottom: 24,
    ...Shadows.lg,
    zIndex: 200,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  destTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  metricSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modeTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modeTabTextActive: {
    color: '#0A0A0F',
    fontWeight: '800',
  },
  voicePromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 8,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(212, 175, 124, 0.1)',
  },
  voiceBtnActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.25)',
  },
  voiceBtnText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  openExternalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  openExternalText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
  },
  stepsScroll: {
    maxHeight: 210,
  },
  stepsContent: {
    paddingVertical: 6,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  timelineCol: {
    alignItems: 'center',
    width: 28,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleFirst: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  iconCircleLast: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 4,
    minHeight: 18,
  },
  stepInfoCol: {
    flex: 1,
    paddingTop: 3,
  },
  stepInstruction: {
    fontSize: Typography.sizes.xs,
    color: Colors.text,
    fontWeight: '600',
    lineHeight: 18,
  },
  stepSubRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  stepSubText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
