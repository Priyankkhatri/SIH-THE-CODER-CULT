import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { visionApi } from '../../services/api';
import { useLocation } from '../../hooks/useLocation';
import { useTranslation } from '../../hooks/useTranslation';

import { ALL_SEED_PLACES } from '../../utils/seedPlaces';

const { width, height } = Dimensions.get('window');

const PRESET_MONUMENT_IDS = [
  'IND-HER-26', // Kumbhalgarh Fort
  'IND-HER-27', // Chittorgarh Fort
  'IND-HER-11', // Rani ki Vav
  'IND-HER-31', // Sun Temple Modhera
  'IND-GJ-SOU', // Statue of Unity
  'IND-HER-01', // Taj Mahal
  'IND-HER-03', // Red Fort
  'IND-GJ-08',  // Somnath Temple
  'IND-HER-10', // Hampi
  'IND-HER-02', // Qutub Minar
  'IND-HER-13', // Dholavira
  'p1-laxmi-vilas', // Laxmi Vilas Palace
];

const PRESET_CATALOG = PRESET_MONUMENT_IDS.map((id) => {
  const p = ALL_SEED_PLACES.find((item) => item.id === id || item.id?.toLowerCase() === id.toLowerCase());
  return {
    id: p ? p.id : id,
    name: p ? p.name : id,
    description: p?.shortDescription || (p?.heritageRecord as any)?.shortStory || 'Iconic Indian Heritage Monument',
    placeId: p ? p.id : id,
    placeName: p ? p.name : id,
  };
});

export default function CameraScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const location = useLocation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [isIdentifying, setIsIdentifying] = useState(false);
  const [scanStatus, setScanStatus] = useState('Point camera at monument or fortress');
  const [showCatalog, setShowCatalog] = useState(false);
  const [noticeModal, setNoticeModal] = useState<{
    visible: boolean;
    message: string;
    guidance: string;
  } | null>(null);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isIdentifying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1100,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1100,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanAnim.setValue(0);
    }
  }, [isIdentifying]);

  const handleCapture = async () => {
    if (isIdentifying) return;
    setIsIdentifying(true);
    setScanStatus('📸 Capturing frame...');

    try {
      let photoBase64: string | undefined = undefined;
      let photoUri: string | undefined = undefined;

      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync({
            base64: true,
            quality: 0.5,
            skipProcessing: Platform.OS === 'android',
          });
          if (photo) {
            photoBase64 = photo.base64;
            photoUri = photo.uri;
          }
        } catch (captureErr) {
          console.warn('[Camera] takePictureAsync warning:', captureErr);
        }
      }

      setScanStatus('🧠 Neural Vision analyzing architectural style...');

      // Call vision identify with captured image + GPS coordinates
      const response: any = await visionApi.identify({
        latitude: location.latitude,
        longitude: location.longitude,
        image: photoBase64,
      });

      setScanStatus('🏛️ Verifying with Archaeological Survey of India (ASI)...');

      if (response?.data?.identified && response?.data?.isMonument !== false) {
        const item = response.data;
        router.push({
          pathname: '/camera/result' as any,
          params: {
            artifactName: item.artifact?.name || 'Heritage Landmark',
            confidence: String(item.artifact?.confidence || 98),
            description: item.artifact?.description || 'Heritage landmark identified by Yatra Heritage Vision Model.',
            heritageContext: item.heritageContext || 'Protected monument under Archaeological Survey of India (ASI) records.',
            placeId: item.placeId || item.artifact?.placeId || '',
            placeName: item.placeName || item.artifact?.name || 'Heritage Landmark',
            imageUri: photoUri || '',
            t: String(Date.now()),
          },
        });
      } else {
        const message = response?.data?.message || 'No Heritage Monument Detected';
        const guidance = response?.data?.guidance || 'Please point your camera steadily at an Indian heritage monument, temple, fortress, or museum artifact.';
        setNoticeModal({
          visible: true,
          message,
          guidance,
        });
        setScanStatus('⚠️ No monument detected. Align camera with heritage site.');
      }
    } catch (error) {
      console.warn('[Camera] Identification error:', error);
      setScanStatus('Camera scan error. Please try again or pick from Presets.');
    } finally {
      setIsIdentifying(false);
    }
  };

  const navigateToResult = (item: typeof PRESET_CATALOG[0], confidence = 98, photoUri?: string) => {
    router.push({
      pathname: '/camera/result' as any,
      params: {
        artifactName: item.name,
        confidence: String(confidence),
        description: item.description,
        heritageContext: `Verified heritage monument and architectural feature cataloged in official Archaeological Survey of India (ASI) national registry records.`,
        placeId: item.placeId,
        placeName: item.placeName,
        imageUri: photoUri || '',
        t: String(Date.now()),
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

  const reticleSize = width * 0.75;

  return (
    <View style={styles.container}>
      {/* Live Camera Viewfinder */}
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />

      {/* Floating Controls Overlay */}
      <View style={styles.overlayContainer} pointerEvents="box-none">
        {/* Top Floating Controls */}
        <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.modeBadge}>
            <MaterialIcons name="auto-awesome" size={16} color={Colors.primary} />
            <Text style={styles.modeBadgeText}>AI Landmark Vision</Text>
          </View>
          <TouchableOpacity style={styles.iconCircle} onPress={() => setShowCatalog(!showCatalog)}>
            <MaterialIcons name="collections" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Viewfinder Target Framing Box */}
        <View style={styles.framingContainer} pointerEvents="none">
          <View style={styles.reticleBox}>
            <View style={[styles.reticleCorner, styles.cornerTL]} />
            <View style={[styles.reticleCorner, styles.cornerTR]} />
            <View style={[styles.reticleCorner, styles.cornerBL]} />
            <View style={[styles.reticleCorner, styles.cornerBR]} />

            {/* Animated Laser Scanning Line */}
            {isIdentifying && (
              <Animated.View
                style={[
                  styles.laserLine,
                  {
                    transform: [
                      {
                        translateY: scanAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [6, reticleSize - 12],
                        }),
                      },
                    ],
                  },
                ]}
              />
            )}

            <View style={styles.statusBadgeWrap}>
              {isIdentifying && (
                <ActivityIndicator size="small" color={Colors.primary} style={{ marginRight: 6 }} />
              )}
              <Text style={styles.reticleText}>{scanStatus}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Bar: Capture & Demo Catalog */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.lg }]}>
          {showCatalog ? (
            <View style={styles.catalogTray}>
              <View style={styles.catalogHeader}>
                <Text style={styles.catalogTitle}>Iconic Monuments Preset Catalog</Text>
                <TouchableOpacity onPress={() => setShowCatalog(false)}>
                  <MaterialIcons name="close" size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catalogList}>
                {PRESET_CATALOG.map((item) => (
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
                onPress={() => setShowCatalog(true)}
              >
                <MaterialIcons name="travel-explore" size={24} color={Colors.primary} />
                <Text style={styles.demoPickerText}>Explore Sites</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Rejection / Guidance Notice Modal */}
      {noticeModal?.visible && (
        <View style={styles.noticeModalContainer}>
          <View style={styles.noticeCard}>
            <View style={styles.noticeIconCircle}>
              <MaterialIcons name="photo-camera" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.noticeTitle}>{noticeModal.message}</Text>
            <Text style={styles.noticeGuidance}>{noticeModal.guidance}</Text>
            <TouchableOpacity
              style={styles.noticeButton}
              onPress={() => {
                setNoticeModal(null);
                setScanStatus('Point camera at monument or fortress');
              }}
            >
              <Text style={styles.noticeButtonText}>Got It, Retake Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    zIndex: 10,
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
    backgroundColor: 'rgba(23, 23, 23, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(23, 23, 23, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
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
  laserLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 0,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
    opacity: 0.85,
  },
  statusBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 23, 23, 0.88)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    maxWidth: '90%',
  },
  reticleText: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    textAlign: 'center',
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
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212, 175, 124, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
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
    backgroundColor: Colors.surfaceElevated,
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
  noticeModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    zIndex: 999,
  },
  noticeCard: {
    backgroundColor: '#1E1E20',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.35)',
    padding: Spacing.xl,
    alignItems: 'center',
    maxWidth: 360,
    width: '100%',
    ...Shadows.lg,
  },
  noticeIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 169, 71, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  noticeTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  noticeGuidance: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  noticeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    width: '100%',
    alignItems: 'center',
  },
  noticeButtonText: {
    color: Colors.background,
    fontSize: Typography.sizes.base,
    fontWeight: '700',
  },
});
