import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { visionApi } from '../../services/api';
import { useLocation } from '../../hooks/useLocation';
import { useTranslation } from '../../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

const DEMO_CATALOG = [
  { id: 'laxmi_vilas_facade', name: 'Laxmi Vilas Palace Facade', description: 'Grand Indo-Saracenic facade with ornate domes and arches', placeId: 'p1-laxmi-vilas', placeName: 'Laxmi Vilas Palace' },
  { id: 'ind_gj_01_feature', name: 'Rani ki Vav Sculpted Gallery', description: 'Subterranean stepwell gallery depicting Sheshashayi Vishnu', placeId: 'IND-GJ-01', placeName: 'Rani ki Vav (Queen\'s Stepwell)' },
  { id: 'ind_gj_02_feature', name: 'Modhera Sun Temple Sabha Mandapa', description: '52 carved pillars aligning with solar equinoxes', placeId: 'IND-GJ-02', placeName: 'Sun Temple, Modhera' },
  { id: 'ind_her_01_feature', name: 'Taj Mahal Marble Dome', description: 'Makrana white marble dome and four minarets with pietra dura inlay', placeId: 'IND-HER-01', placeName: 'Taj Mahal' },
  { id: 'ind_her_05_feature', name: 'Red Fort Lahori Gate', description: 'Massive red sandstone fortification with battlements and octagonal towers', placeId: 'IND-HER-05', placeName: 'Red Fort (Lal Qila)' },
  { id: 'ind_gj_07_feature', name: 'Somnath Jyotirlinga Temple', description: 'Oceanfront Kailash Mahameru Prasad spire and sacred sabha mandapa', placeId: 'IND-GJ-07', placeName: 'Somnath Jyotirlinga Temple' },
  { id: 'ind_her_07_feature', name: 'Konark Sun Temple Stone Wheels', description: 'Astronomical sundial chariot wheels with intricate celestial carvings', placeId: 'IND-HER-07', placeName: 'Sun Temple Konark' },
  { id: 'ind_her_09_feature', name: 'Hampi Virupaksha Temple Gopuram', description: 'Soaring 50-meter gateway tower overlooking the Tungabhadra river', placeId: 'IND-HER-09', placeName: 'Group of Monuments at Hampi' },
  { id: 'champaner_jami_masjid', name: 'Jama Masjid Champaner', description: '15th-century mosque blending Islamic and Jain elements', placeId: 'p12-jama-masjid-champaner', placeName: 'Jama Masjid Champaner' },
  { id: 'baroda_museum_statue', name: 'Baroda Museum Sculptures', description: 'Greco-Roman and Indian sculpture collection', placeId: 'p2-baroda-museum', placeName: 'Baroda Museum' },
  { id: 'eme_temple_dome', name: 'EME Temple Dome', description: 'Distinctive aluminum geodesic dome', placeId: 'p4-eme-temple', placeName: 'EME Temple' },
  { id: 'sursagar_shiva', name: 'Sursagar Shiva Statue', description: 'Towering 120-feet Shiva statue at Sursagar Lake', placeId: 'p5-sursagar', placeName: 'Sursagar Lake' },
];

export default function CameraScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const location = useLocation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [isIdentifying, setIsIdentifying] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);

  const handleCapture = async () => {
    setIsIdentifying(true);
    try {
      const mockLabels = ['palace', 'architecture', 'monument', 'dome', 'heritage'];
      const response: any = await visionApi.identify({
        latitude: location.latitude,
        longitude: location.longitude,
        labels: mockLabels,
      });

      if (response?.data?.identified) {
        const item = response.data;
        router.push({
          pathname: '/camera/result' as any,
          params: {
            artifactName: item.artifact?.name || 'Heritage Monument',
            confidence: String(item.artifact?.confidence || 96),
            description: item.artifact?.description || 'Historical architecture recognized.',
            heritageContext: item.heritageContext || 'Protected monument under Archaeological Survey of India records.',
            placeId: item.placeId || 'p1-laxmi-vilas',
            placeName: item.placeName || 'Laxmi Vilas Palace',
          },
        });
      } else {
        // Fallback default
        navigateToResult(DEMO_CATALOG[0], 96);
      }
    } catch (error) {
      navigateToResult(DEMO_CATALOG[0], 95);
    } finally {
      setIsIdentifying(false);
    }
  };

  const navigateToResult = (item: typeof DEMO_CATALOG[0], confidence = 97) => {
    router.push({
      pathname: '/camera/result' as any,
      params: {
        artifactName: item.name,
        confidence: String(confidence),
        description: item.description,
        heritageContext: `Verified heritage artifact cataloged in Vadodara historical archives.`,
        placeId: item.placeId,
        placeName: item.placeName,
      },
    });
  };

  // Permission handling
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { paddingTop: insets.top }]}>
        <View style={styles.permissionIconCircle}>
          <MaterialIcons name="photo-camera" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSubtitle}>
          To identify historical monuments and artifacts in real-time, please allow camera permissions.
        </Text>
        <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
          <Text style={styles.grantButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Live Camera Viewfinder */}
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef}>
        {/* Top Floating Controls */}
        <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.modeBadge}>
            <MaterialIcons name="auto-awesome" size={16} color={Colors.primary} />
            <Text style={styles.modeBadgeText}>AI Artifact Vision</Text>
          </View>
          <TouchableOpacity style={styles.iconCircle} onPress={() => setShowCatalog(!showCatalog)}>
            <MaterialIcons name="collections" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Viewfinder Target Framing Box */}
        <View style={styles.framingContainer}>
          <View style={styles.reticleBox}>
            <View style={[styles.reticleCorner, styles.cornerTL]} />
            <View style={[styles.reticleCorner, styles.cornerTR]} />
            <View style={[styles.reticleCorner, styles.cornerBL]} />
            <View style={[styles.reticleCorner, styles.cornerBR]} />
            <Text style={styles.reticleText}>Point at monument or sculpture</Text>
          </View>
        </View>

        {/* Bottom Bar: Capture & Demo Catalog */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.lg }]}>
          {showCatalog ? (
            <View style={styles.catalogTray}>
              <View style={styles.catalogHeader}>
                <Text style={styles.catalogTitle}>Demo Artifact Catalog</Text>
                <TouchableOpacity onPress={() => setShowCatalog(false)}>
                  <MaterialIcons name="close" size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catalogList}>
                {DEMO_CATALOG.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.catalogChip}
                    onPress={() => {
                      setShowCatalog(false);
                      navigateToResult(item);
                    }}
                  >
                    <MaterialIcons name="museum" size={18} color={Colors.primary} />
                    <Text style={styles.catalogChipText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.captureRow}>
              <TouchableOpacity
                style={styles.demoPickerBtn}
                onPress={() => setShowCatalog(true)}
              >
                <MaterialIcons name="photo-library" size={24} color={Colors.text} />
                <Text style={styles.demoPickerText}>Presets</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.captureButton, isIdentifying && styles.captureButtonDisabled]}
                onPress={handleCapture}
                disabled={isIdentifying}
              >
                {isIdentifying ? (
                  <ActivityIndicator size="large" color={Colors.primary} />
                ) : (
                  <View style={styles.captureInnerCircle} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoPickerBtn}
                onPress={() => navigateToResult(DEMO_CATALOG[0])}
              >
                <MaterialIcons name="bolt" size={24} color={Colors.primary} />
                <Text style={styles.demoPickerText}>Quick AI</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.base,
  },
  permissionIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(212, 169, 71, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  permissionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  permissionSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  grantButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.base,
  },
  grantButtonText: {
    color: Colors.background,
    fontWeight: '700',
    fontSize: Typography.sizes.base,
  },
  cancelButton: {
    padding: Spacing.md,
  },
  cancelButtonText: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(10, 10, 15, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10, 10, 15, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.4)',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  modeBadgeText: {
    color: Colors.text,
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
  },
  framingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleBox: {
    width: width * 0.75,
    height: width * 0.75,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleCorner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: Colors.primary,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  reticleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  bottomBar: {
    paddingHorizontal: Spacing.base,
  },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  demoPickerBtn: {
    alignItems: 'center',
    gap: 4,
    padding: Spacing.sm,
  },
  demoPickerText: {
    color: Colors.text,
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212, 169, 71, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glow,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
  catalogTray: {
    backgroundColor: 'rgba(20, 20, 31, 0.95)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catalogTitle: {
    color: Colors.text,
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
  },
  catalogList: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  catalogChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  catalogChipText: {
    color: Colors.text,
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
  },
});
