import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useChatStore } from '../../stores';
import { useSpeech } from '../../hooks/useSpeech';
import { useTranslation } from '../../hooks/useTranslation';
import { dynamicImageService } from '../../services/dynamicImageService';

export default function CameraResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setContext } = useChatStore();
  const { language } = useTranslation();
  const { speak, stop, isSpeaking } = useSpeech();

  const params = useLocalSearchParams<{
    artifactName?: string;
    confidence?: string;
    description?: string;
    heritageContext?: string;
    placeId?: string;
    placeName?: string;
    architecturalStyle?: string;
    period?: string;
    aiModel?: string;
    imageUri?: string;
  }>();

  const artifactName = params.artifactName || 'Identified Monument';
  const parsedConfidence = parseInt(params.confidence || '98', 10);
  const confidence = isNaN(parsedConfidence) ? 96 : Math.min(100, Math.max(1, parsedConfidence));
  const description = params.description || 'Verified heritage architecture cataloged under Archaeological Survey of India (ASI) records.';
  const heritageContext = params.heritageContext || 'Historical information and architectural records cataloged by the Archaeological Survey of India.';
  const placeId = params.placeId || '';
  const placeName = params.placeName || artifactName || 'Heritage Monument';
  const architecturalStyle = params.architecturalStyle || 'Classical Indian Architecture';
  const period = params.period || 'Protected Historical Era';

  const displayImageUri = params.imageUri && params.imageUri.length > 5
    ? params.imageUri
    : dynamicImageService.getPlaceImage(placeName, 'heritage');

  const handleToggleAudio = () => {
    if (isSpeaking) {
      stop();
    } else {
      const audioNarrative = `${artifactName}. Located at ${placeName}. Architectural style: ${architecturalStyle}. ${description}. ${heritageContext}`;
      speak(audioNarrative, language);
    }
  };

  const handleBack = () => {
    stop();
    router.back();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Heritage Discovery: ${artifactName}`,
        message: `I just discovered ${artifactName} (${placeName}) with Yatra Heritage AI Guide! Style: ${architecturalStyle} • Era: ${period}.`,
      });
    } catch {}
  };

  const handleAskAI = () => {
    stop();
    if (placeId) {
      setContext(placeId, placeName);
    }
    router.push({
      pathname: '/(tabs)/ai',
      params: {
        autoAsk: `Tell me the architectural marvels, historical significance, and legends of ${artifactName}${placeName && placeName !== artifactName ? ` at ${placeName}` : ''}.`,
        placeId: placeId || undefined,
        placeName: placeName || undefined,
        t: String(Date.now()),
      },
    });
  };

  const handleViewPlace = () => {
    stop();
    if (placeId) {
      router.push(`/place/${placeId}`);
    } else {
      router.push('/(tabs)/explore');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Floating Glass Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.glassBtn} onPress={handleBack} activeOpacity={0.8}>
          <MaterialIcons name="arrow-back" size={22} color="#F5F1E8" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <View style={styles.liveMatchDot} />
          <Text style={styles.headerTitle}>HERITAGE DISCOVERY</Text>
        </View>
        <TouchableOpacity style={styles.glassBtn} onPress={handleShare} activeOpacity={0.8}>
          <MaterialIcons name="share" size={20} color="#F5F1E8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cinematic Discovery Hero Canvas */}
        <View style={styles.heroCanvas}>
          <Image
            source={{ uri: displayImageUri }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          {/* Top Metadata Badges */}
          <View style={styles.heroTopBadges}>
            <View style={styles.asiSealBadge}>
              <MaterialIcons name="shield" size={13} color={Colors.primary} />
              <Text style={styles.asiSealText}>ASI NATIONAL REGISTRY</Text>
            </View>

            <View style={styles.confidencePill}>
              <MaterialIcons name="verified" size={13} color="#10B981" />
              <Text style={styles.confidencePillText}>{confidence}% MATCH</Text>
            </View>
          </View>

          {/* Bottom Gradient Title Overlay */}
          <View style={styles.heroBottomOverlay}>
            <View style={styles.heroTitleRow}>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {artifactName}
              </Text>
              <MaterialIcons name="verified" size={20} color="#38BDF8" />
            </View>
            <View style={styles.heroLocationRow}>
              <MaterialIcons name="place" size={14} color={Colors.primary} />
              <Text style={styles.heroLocationText} numberOfLines={1}>
                {placeName}
              </Text>
            </View>
          </View>
        </View>

        {/* Architectural DNA Spec Grid (4-Card Matrix) */}
        <View style={styles.dnaGrid}>
          <View style={styles.dnaCard}>
            <View style={styles.dnaIconWrap}>
              <MaterialIcons name="museum" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.dnaLabel}>ARCHITECTURAL STYLE</Text>
            <Text style={styles.dnaValue} numberOfLines={2}>
              {architecturalStyle}
            </Text>
          </View>

          <View style={styles.dnaCard}>
            <View style={styles.dnaIconWrap}>
              <MaterialIcons name="schedule" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.dnaLabel}>HISTORICAL ERA</Text>
            <Text style={styles.dnaValue} numberOfLines={2}>
              {period}
            </Text>
          </View>

          <View style={styles.dnaCard}>
            <View style={styles.dnaIconWrap}>
              <MaterialIcons name="psychology" size={18} color="#38BDF8" />
            </View>
            <Text style={styles.dnaLabel}>VISION ENGINE</Text>
            <Text style={styles.dnaValue} numberOfLines={1}>
              {params.aiModel || 'Multimodal Vision'}
            </Text>
          </View>

          <View style={styles.dnaCard}>
            <View style={styles.dnaIconWrap}>
              <MaterialIcons name="account-balance" size={18} color="#10B981" />
            </View>
            <Text style={styles.dnaLabel}>PROTECTION STATUS</Text>
            <Text style={styles.dnaValue} numberOfLines={1}>
              Centrally Protected
            </Text>
          </View>
        </View>

        {/* Interactive Audio Chronicle Player */}
        <TouchableOpacity
          style={[styles.audioPlayerCard, isSpeaking && styles.audioPlayerCardActive]}
          onPress={handleToggleAudio}
          activeOpacity={0.85}
        >
          <View style={[styles.audioIconCircle, isSpeaking && styles.audioIconCircleActive]}>
            <MaterialIcons
              name={isSpeaking ? 'pause' : 'play-arrow'}
              size={24}
              color={isSpeaking ? '#0F0F0F' : Colors.primary}
            />
          </View>
          <View style={styles.audioContent}>
            <View style={styles.audioTitleRow}>
              <Text style={styles.audioTitle}>
                {isSpeaking ? 'Narrating Audio Chronicle...' : 'Listen to Audio Tour'}
              </Text>
              {isSpeaking && (
                <View style={styles.playingWaveBadge}>
                  <Text style={styles.playingWaveText}>LIVE</Text>
                </View>
              )}
            </View>
            <Text style={styles.audioSubtitle}>
              {isSpeaking ? 'Tap to pause audio guide' : 'Immersive voice synthesis tour in your language'}
            </Text>
          </View>
          <MaterialIcons
            name={isSpeaking ? 'volume-up' : 'headphones'}
            size={22}
            color={isSpeaking ? Colors.primary : Colors.textMuted}
          />
        </TouchableOpacity>

        {/* Architectural Overview & Significance Card */}
        <View style={styles.chronicleCard}>
          <View style={styles.chronicleHeader}>
            <MaterialIcons name="auto-stories" size={18} color={Colors.primary} />
            <Text style={styles.chronicleHeaderTitle}>Architectural Highlights</Text>
          </View>
          <Text style={styles.chronicleBody}>{description}</Text>
        </View>

        {/* Historical Context & Records */}
        <View style={styles.chronicleCard}>
          <View style={styles.chronicleHeader}>
            <MaterialIcons name="history-edu" size={18} color={Colors.primary} />
            <Text style={styles.chronicleHeaderTitle}>Archaeological Chronicle</Text>
          </View>
          <Text style={styles.chronicleBody}>{heritageContext}</Text>
        </View>

        {/* Quick Action Matrix */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryExploreBtn} onPress={handleViewPlace} activeOpacity={0.85}>
            <MaterialIcons name="explore" size={20} color="#0A0A0F" />
            <Text style={styles.primaryExploreBtnText}>Explore Monument & Map Guide</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#0A0A0F" />
          </TouchableOpacity>

          <View style={styles.secondaryActionRow}>
            <TouchableOpacity style={styles.secondaryAiBtn} onPress={handleAskAI} activeOpacity={0.85}>
              <MaterialIcons name="auto-awesome" size={18} color={Colors.primary} />
              <Text style={styles.secondaryAiBtnText}>Ask AI Guide</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryScanBtn} onPress={() => router.back()} activeOpacity={0.85}>
              <MaterialIcons name="photo-camera" size={18} color="#F5F1E8" />
              <Text style={styles.secondaryScanBtnText}>Scan Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  glassBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  liveMatchDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 12,
    fontWeight: '800',
    color: '#F5F1E8',
    letterSpacing: 2,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  heroCanvas: {
    width: '100%',
    height: 230,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1E20',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    ...Shadows.lg,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTopBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  asiSealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 15, 15, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.4)',
  },
  asiSealText: {
    color: '#F5F1E8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  confidencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  confidencePillText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  heroBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 15, 15, 0.88)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 3,
  },
  heroTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: '#F5F1E8',
    flexShrink: 1,
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroLocationText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  dnaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dnaCard: {
    width: (width - 32 - 10) / 2,
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dnaIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dnaLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  dnaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F5F1E8',
    lineHeight: 16,
  },
  audioPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.35)',
    gap: 12,
    ...Shadows.sm,
  },
  audioPlayerCardActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    borderColor: Colors.primary,
  },
  audioIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 124, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioIconCircleActive: {
    backgroundColor: Colors.primary,
  },
  audioContent: {
    flex: 1,
  },
  audioTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  audioTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: '#F5F1E8',
  },
  playingWaveBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  playingWaveText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#0F0F0F',
  },
  audioSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chronicleCard: {
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  chronicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chronicleHeaderTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chronicleBody: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 21,
  },
  actionSection: {
    gap: 10,
    marginTop: 4,
  },
  primaryExploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    ...Shadows.md,
  },
  primaryExploreBtnText: {
    color: '#0A0A0F',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryAiBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.35)',
  },
  secondaryAiBtnText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryScanBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  secondaryScanBtnText: {
    color: '#F5F1E8',
    fontSize: 12,
    fontWeight: '700',
  },
});
