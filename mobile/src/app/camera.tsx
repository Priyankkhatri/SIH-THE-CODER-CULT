import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { visionApi } from '../services/api';
import { useLocation } from '../hooks/useLocation';
import { useChatStore } from '../stores';
import { useTranslation } from '../hooks/useTranslation';

const { width } = Dimensions.get('window');

interface IdentificationResult {
  identified: boolean;
  artifact?: {
    name: string;
    description: string;
    confidence: number;
  };
  heritageContext?: string;
  placeId?: string;
  placeName?: string;
  message?: string;
}

// Demo catalog for when the backend is offline
const DEMO_CATALOG = [
  { id: 'laxmi_vilas_facade', name: 'Laxmi Vilas Palace Facade', description: 'Grand Indo-Saracenic facade with ornate domes and arches' },
  { id: 'eme_temple_dome', name: 'EME Temple Dome', description: 'Distinctive aluminum geodesic dome' },
  { id: 'champaner_jami_masjid', name: 'Jama Masjid Champaner', description: '15th-century mosque blending Islamic and Jain elements' },
  { id: 'baroda_museum_statue', name: 'Baroda Museum Sculptures', description: 'Greco-Roman and Indian sculpture collection' },
  { id: 'sursagar_shiva', name: 'Sursagar Shiva Statue', description: 'Towering 120-feet Shiva statue at Sursagar Lake' },
  { id: 'tambekar_wada_murals', name: 'Tambekar Wada Murals', description: 'Maratha-era wall paintings from Hindu epics' },
  { id: 'nyay_mandir_clock', name: 'Nyay Mandir Clock Tower', description: 'Heritage court building clock tower' },
  { id: 'champaner_fort_wall', name: 'Champaner Fort Walls', description: '15th-century fortification walls' },
  { id: 'kirti_mandir_memorial', name: 'Kirti Mandir Memorial', description: 'Nagara-style memorial temple' },
  { id: 'makarpura_palace_garden', name: 'Makarpura Palace Gardens', description: 'Italian Renaissance-style royal gardens' },
];

export default function CameraScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const location = useLocation();
  const { setContext } = useChatStore();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [isIdentifying, setIsIdentifying] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    setIsIdentifying(true);
    setResult(null);

    try {
      // For hackathon: Send GPS + mock labels to identify
      // In production, this would also send the actual image
      const mockLabels = ['building', 'architecture', 'landmark', 'palace', 'monument'];

      const response: any = await visionApi.identify(
        location.latitude,
        location.longitude,
        mockLabels
      );

      if (response?.data) {
        setResult(response.data);
      }
    } catch (error) {
      // Demo fallback
      setResult({
        identified: true,
        artifact: {
          name: 'Laxmi Vilas Palace Facade',
          description: 'The magnificent Indo-Saracenic facade of Laxmi Vilas Palace featuring intricate stone carvings and Mughal-inspired arches.',
          confidence: 87,
        },
        heritageContext: 'Built in 1890 by Maharaja Sayajirao III, this palace is four times the size of Buckingham Palace.',
        placeId: 'p1-laxmi-vilas',
        placeName: 'Laxmi Vilas Palace',
      });
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleDemoCatalogItem = (item: typeof DEMO_CATALOG[0]) => {
    setResult({
      identified: true,
      artifact: {
        name: item.name,
        description: item.description,
        confidence: 92,
      },
      heritageContext: `This artifact is part of Vadodara's rich heritage catalog.`,
    });
    setShowCatalog(false);
  };

  const handleAskAbout = () => {
    if (result?.placeId && result?.placeName) {
      setContext(result.placeId, result.placeName);
      router.push('/(tabs)/ai');
    }
  };

  // Permission handling
  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="camera-alt" size={64} color={Colors.textMuted} />
        <Text style={styles.permTitle}>{t('camera.permTitle')}</Text>
        <Text style={styles.permDesc}>{t('camera.permDesc')}</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>{t('camera.grantPermission')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        {/* Scanning overlay */}
        <View style={styles.scanOverlay}>
          <View style={styles.scanCorner1} />
          <View style={styles.scanCorner2} />
          <View style={styles.scanCorner3} />
          <View style={styles.scanCorner4} />
        </View>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={() => router.back()}>
            <MaterialIcons name="close" size={26} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>🔍 {t('camera.title')}</Text>
          <TouchableOpacity style={styles.topBtn} onPress={() => setShowCatalog(!showCatalog)}>
            <MaterialIcons name="collections" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Identifying indicator */}
        {isIdentifying && (
          <View style={styles.identifyingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.identifyingText}>{t('camera.identifying')}</Text>
          </View>
        )}
      </CameraView>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {result ? (
          /* Result card */
          <ScrollView style={styles.resultScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.resultCard}>
              {result.identified ? (
                <>
                  <View style={styles.resultHeader}>
                    <MaterialIcons name="check-circle" size={24} color={Colors.success} />
                    <Text style={styles.resultTitle}>{result.artifact?.name}</Text>
                  </View>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>
                      {t('camera.confidence')}: {result.artifact?.confidence}%
                    </Text>
                  </View>
                  <Text style={styles.resultDesc}>{result.artifact?.description}</Text>
                  {result.heritageContext && (
                    <View style={styles.contextBox}>
                      <Text style={styles.contextLabel}>📜 Heritage Context</Text>
                      <Text style={styles.contextText}>{result.heritageContext}</Text>
                    </View>
                  )}
                  <View style={styles.resultActions}>
                    {result.placeId && (
                      <TouchableOpacity
                        style={styles.viewDetailsBtn}
                        onPress={() => router.push(`/place/${result.placeId}`)}
                      >
                        <MaterialIcons name="info" size={18} color={Colors.textInverse} />
                        <Text style={styles.viewDetailsBtnText}>{t('common.viewDetails')}</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.askAiBtn} onPress={handleAskAbout}>
                      <MaterialIcons name="auto-awesome" size={18} color={Colors.primary} />
                      <Text style={styles.askAiBtnText}>{t('common.askAi')}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.notFoundContent}>
                  <MaterialIcons name="search-off" size={40} color={Colors.textMuted} />
                  <Text style={styles.notFoundText}>{result.message}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => setResult(null)}
              >
                <Text style={styles.retryText}>{t('common.scanAgain')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : showCatalog ? (
          /* Catalog browser */
          <ScrollView style={styles.catalogScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.catalogTitle}>{t('camera.supportedTitle', { count: DEMO_CATALOG.length })}</Text>
            <Text style={styles.catalogDesc}>{t('camera.supportedDesc')}</Text>
            {DEMO_CATALOG.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.catalogItem}
                onPress={() => handleDemoCatalogItem(item)}
              >
                <View style={styles.catalogDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.catalogItemName}>{item.name}</Text>
                  <Text style={styles.catalogItemDesc}>{item.description}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          /* Capture button */
          <View style={styles.captureArea}>
            <Text style={styles.captureHint}>{t('camera.pointCameraHint')}</Text>
            <TouchableOpacity
              style={styles.captureBtn}
              onPress={handleCapture}
              activeOpacity={0.7}
            >
              <View style={styles.captureBtnInner}>
                <MaterialIcons name="camera" size={32} color={Colors.textInverse} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCatalog(true)}>
              <Text style={styles.catalogLink}>{t('camera.viewSupported')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: Spacing['2xl'],
  },
  permTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  permDesc: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  permBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    marginTop: 8,
  },
  permBtnText: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  backLink: {
    fontSize: Typography.sizes.base,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: 12,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    bottom: '35%',
  },
  scanCorner1: {
    position: 'absolute', top: 0, left: 0, width: 30, height: 30,
    borderTopWidth: 3, borderLeftWidth: 3, borderColor: Colors.primary,
    borderTopLeftRadius: 8,
  },
  scanCorner2: {
    position: 'absolute', top: 0, right: 0, width: 30, height: 30,
    borderTopWidth: 3, borderRightWidth: 3, borderColor: Colors.primary,
    borderTopRightRadius: 8,
  },
  scanCorner3: {
    position: 'absolute', bottom: 0, left: 0, width: 30, height: 30,
    borderBottomWidth: 3, borderLeftWidth: 3, borderColor: Colors.primary,
    borderBottomLeftRadius: 8,
  },
  scanCorner4: {
    position: 'absolute', bottom: 0, right: 0, width: 30, height: 30,
    borderBottomWidth: 3, borderRightWidth: 3, borderColor: Colors.primary,
    borderBottomRightRadius: 8,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  identifyingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 10, 15, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  identifyingText: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  bottomControls: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    maxHeight: '45%',
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  captureArea: {
    alignItems: 'center',
    padding: Spacing['2xl'],
    gap: 16,
  },
  captureHint: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.primary,
    padding: 4,
  },
  captureBtnInner: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catalogLink: {
    fontSize: Typography.sizes.sm,
    color: Colors.accent,
    fontWeight: '600',
  },
  resultScroll: {
    padding: Spacing.xl,
  },
  resultCard: {
    paddingBottom: 40,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: Colors.text,
    flex: 1,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  confidenceText: {
    fontSize: Typography.sizes.sm,
    color: Colors.success,
    fontWeight: '600',
  },
  resultDesc: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  contextBox: {
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  contextLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  contextText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.md,
  },
  viewDetailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
  },
  viewDetailsBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  askAiBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceHighlight,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  askAiBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: '600',
    color: Colors.primary,
  },
  notFoundContent: {
    alignItems: 'center',
    gap: 12,
    padding: Spacing.xl,
  },
  notFoundText: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  retryBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  retryText: {
    fontSize: Typography.sizes.base,
    color: Colors.accent,
    fontWeight: '600',
  },
  catalogScroll: {
    padding: Spacing.xl,
    maxHeight: 350,
  },
  catalogTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  catalogDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catalogDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  catalogItemName: {
    fontSize: Typography.sizes.base,
    fontWeight: '600',
    color: Colors.text,
  },
  catalogItemDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
});
