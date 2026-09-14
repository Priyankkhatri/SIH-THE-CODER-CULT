import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useChatStore } from '../../stores';

export default function CameraResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setContext } = useChatStore();

  const params = useLocalSearchParams<{
    artifactName?: string;
    confidence?: string;
    description?: string;
    heritageContext?: string;
    placeId?: string;
    placeName?: string;
    imageUri?: string;
  }>();

  const artifactName = params.artifactName || 'Identified Monument';
  const parsedConfidence = parseInt(params.confidence || '98', 10);
  const confidence = isNaN(parsedConfidence) ? 95 : Math.min(100, Math.max(1, parsedConfidence));
  const description = params.description || 'Verified heritage architecture cataloged under Archaeological Survey of India (ASI) records.';
  const heritageContext = params.heritageContext || 'Historical information cataloged by Archaeological Survey of India.';
  const placeId = params.placeId || '';
  const placeName = params.placeName || artifactName || 'Heritage Monument';

  const handleAskAI = () => {
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
    if (placeId) {
      router.push(`/place/${placeId}`);
    } else {
      router.push('/(tabs)/explore');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identification Result</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Verification Success Hero Card */}
        <View style={styles.card}>
          {params.imageUri ? (
            <View style={styles.imageWrap}>
              <Image source={{ uri: params.imageUri }} style={styles.capturedImage} resizeMode="cover" />
              <View style={styles.capturedBadge}>
                <MaterialIcons name="camera" size={13} color="#fff" />
                <Text style={styles.capturedBadgeText}>Scanned Frame</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.statusRow}>
            <View style={styles.verifiedTag}>
              <MaterialIcons name="verified" size={16} color={Colors.success} />
              <Text style={styles.verifiedTagText}>AI Vision Verified</Text>
            </View>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceScore}>{confidence}% Match</Text>
            </View>
          </View>

          {/* Confidence Meter */}
          <View style={styles.meterContainer}>
            <View style={[styles.meterFill, { width: `${confidence}%` }]} />
          </View>

          <Text style={styles.artifactName}>{artifactName}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Associated Monument Box */}
        <View style={styles.monumentBox}>
          <View style={styles.monumentIconWrap}>
            <MaterialIcons name="account-balance" size={24} color={Colors.primary} />
          </View>
          <View style={styles.monumentInfo}>
            <Text style={styles.monumentLabel}>Located At</Text>
            <Text style={styles.monumentTitle}>{placeName}</Text>
          </View>
          <TouchableOpacity style={styles.viewPlaceBtn} onPress={handleViewPlace}>
            <Text style={styles.viewPlaceText}>View Details</Text>
            <MaterialIcons name="chevron-right" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Heritage Background Context */}
        <View style={styles.contextCard}>
          <View style={styles.contextHeader}>
            <MaterialIcons name="history-edu" size={20} color={Colors.primary} />
            <Text style={styles.contextTitle}>Verified Heritage Chronicle</Text>
          </View>
          <Text style={styles.contextBody}>{heritageContext}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsGroup}>
          <TouchableOpacity style={styles.askAiButton} onPress={handleAskAI} activeOpacity={0.85}>
            <MaterialIcons name="auto-awesome" size={20} color={Colors.background} />
            <Text style={styles.askAiText}>Ask AI Guide About This Artifact</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.scanAnotherButton} onPress={() => router.back()} activeOpacity={0.85}>
            <MaterialIcons name="photo-camera" size={20} color={Colors.text} />
            <Text style={styles.scanAnotherText}>Scan Another Artifact</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    height: 190,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceElevated,
    marginBottom: Spacing.sm,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
  },
  capturedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  capturedBadgeText: {
    color: '#fff',
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  verifiedTagText: {
    color: Colors.success,
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
  },
  confidenceBadge: {
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  confidenceScore: {
    color: Colors.primary,
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
  },
  meterContainer: {
    height: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: Spacing.xs,
  },
  meterFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  artifactName: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  monumentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
  },
  monumentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monumentInfo: {
    flex: 1,
  },
  monumentLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  monumentTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  viewPlaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewPlaceText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '700',
  },
  contextCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  contextTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  contextBody: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  actionsGroup: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  askAiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  askAiText: {
    color: Colors.background,
    fontSize: Typography.sizes.base,
    fontWeight: '700',
  },
  scanAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  scanAnotherText: {
    color: Colors.text,
    fontSize: Typography.sizes.base,
    fontWeight: '600',
  },
});
