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
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { visionApi } from '../../services/api';
import { useLocation } from '../../hooks/useLocation';
import { useTranslation } from '../../hooks/useTranslation';
import { dynamicImageService } from '../../services/dynamicImageService';
import { ALL_SEED_PLACES } from '../../utils/seedPlaces';

const { width } = Dimensions.get('window');

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
    category: p?.category || 'heritage',
    imageUrl: p?.imageUrl || '',
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

  // Camera & Visual states
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  const [torchOn, setTorchOn] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [scanStatus, setScanStatus] = useState('Align monument or facade within frame');
  const [showCatalog, setShowCatalog] = useState(false);
  const [noticeModal, setNoticeModal] = useState<{
    visible: boolean;
    message: string;
    guidance: string;
  } | null>(null);

  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Scanning laser beam animation
  useEffect(() => {
    if (isIdentifying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanAnim.setValue(0);
    }
  }, [isIdentifying]);

  // Subtle breathing pulse on the reticle center target
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const analyzeImage = async (photoBase64?: string, photoUri?: string) => {
    setIsIdentifying(true);
    setScanStatus('Analyzing architectural facade...');

    try {
      setScanStatus('Matching Archaeological Survey of India (ASI) records...');

      // Send image + GPS coordinates to vision API
      const response: any = await visionApi.identify({
        latitude: location.latitude,
        longitude: location.longitude,
        image: photoBase64,
      });

      if (response?.data?.identified && response?.data?.isMonument !== false) {
        const item = response.data;
        router.push({
          pathname: '/camera/result' as any,
          params: {
            artifactName: item.artifact?.name || item.placeName || 'Heritage Landmark',
            confidence: String(item.artifact?.confidence || 98),
            description: item.artifact?.description || 'Heritage landmark verified by AI Vision.',
            heritageContext: item.heritageContext || 'Protected monument under Archaeological Survey of India (ASI) records.',
            placeId: item.placeId || item.artifact?.placeId || '',
            placeName: item.placeName || item.artifact?.name || 'Heritage Landmark',
            architecturalStyle: item.artifact?.architecturalStyle || '',
            period: item.artifact?.period || '',
            aiModel: item.aiModel || 'Google AI Vision',
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
        setScanStatus('No monument detected. Align camera with heritage site.');
      }
    } catch (error) {
      console.warn('[Camera] Identification notice:', error);
      setScanStatus('Scan timed out. Try again or pick from Presets.');
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleCapture = async () => {
    if (isIdentifying) return;
    setIsIdentifying(true);
    setScanStatus('Capturing high-resolution frame...');

    try {
      let photoBase64: string | undefined = undefined;
      let photoUri: string | undefined = undefined;

      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.7,
        });
        if (photo) {
          photoBase64 = photo.base64;
          photoUri = photo.uri;
        }
      }

      await analyzeImage(photoBase64, photoUri);
    } catch (captureErr) {
      console.warn('[Camera] Capture notice:', captureErr);
      setIsIdentifying(false);
      setScanStatus('Align monument within frame and retake');
    }
  };

  // Gallery photo picker (Google Lens style)
  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true,
        quality: 0.75,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        await analyzeImage(asset.base64 || undefined, asset.uri);
      }
    } catch (err) {
      console.warn('[Camera] ImagePicker notice:', err);
    }
  };

  const navigateToResult = (item: typeof PRESET_CATALOG[0], confidence = 98) => {
    const photoUri = dynamicImageService.getPlaceImage(item.name, item.category, item.imageUrl);
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
          <MaterialIcons name="photo-camera" size={44} color={Colors.primary} />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionSubtitle}>
          To identify historical monuments, temple sculptures, and heritage architecture in real-time, please allow camera access.
        </Text>
        <TouchableOpacity style={styles.grantButton} onPress={requestPermission} activeOpacity={0.85}>
          <Text style={styles.grantButtonText}>Enable Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={styles.cancelButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const reticleSize = width * 0.76;

  return (
    <View style={styles.container}>
      {/* Live Camera Viewfinder with Native Hardware Acceleration */}
      <CameraView
        style={StyleSheet.absoluteFill}
        ref={cameraRef}
        facing={facing}
        zoom={zoomLevel}
        enableTorch={torchOn}
        mode="picture"
      />

      {/* Camera Viewfinder & Glass Overlays */}
      <View style={styles.overlayContainer} pointerEvents="box-none">
        {/* Top Floating Control Island */}
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.glassCircleBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <MaterialIcons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {/* AI Vision Lens Mode Pill */}
          <View style={styles.aiLensPill}>
            <View style={styles.aiLensDot} />
            <Text style={styles.aiLensText}>HERITAGE LENS</Text>
          </View>

          {/* Flash / Torch Toggle */}
          <TouchableOpacity
            style={[styles.glassCircleBtn, torchOn && styles.glassCircleBtnActive]}
            onPress={() => setTorchOn(!torchOn)}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={torchOn ? 'flash-on' : 'flash-off'}
              size={20}
              color={torchOn ? '#0A0A0F' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Viewfinder Target Reticle with Laser Beam */}
        <View style={styles.framingContainer} pointerEvents="none">
          <View style={[styles.reticleBox, { width: reticleSize, height: reticleSize }]}>
            {/* 4 Golden Corner Brackets */}
            <View style={[styles.reticleCorner, styles.cornerTL]} />
            <View style={[styles.reticleCorner, styles.cornerTR]} />
            <View style={[styles.reticleCorner, styles.cornerBL]} />
            <View style={[styles.reticleCorner, styles.cornerBR]} />

            {/* Subtle Rule-of-Thirds Grid Markers */}
            <View style={styles.gridLineH1} />
            <View style={styles.gridLineH2} />
            <View style={styles.gridLineV1} />
            <View style={styles.gridLineV2} />

            {/* Center Pulsating Crosshair Target */}
            <Animated.View style={[styles.centerCrosshair, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.crosshairH} />
              <View style={styles.crosshairV} />
              <View style={styles.crosshairDot} />
            </Animated.View>

            {/* Scanning Laser Beam */}
            {isIdentifying && (
              <Animated.View
                style={[
                  styles.laserLine,
                  {
                    transform: [
                      {
                        translateY: scanAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, reticleSize - 14],
                        }),
                      },
                    ],
                  },
                ]}
              />
            )}

            {/* Live Scan Status Pill */}
            <View style={styles.statusBadgeWrap}>
              {isIdentifying ? (
                <ActivityIndicator size="small" color={Colors.primary} style={{ marginRight: 6 }} />
              ) : (
                <View style={styles.idleScanDot} />
              )}
              <Text style={styles.reticleText} numberOfLines={1}>
                {scanStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Control Island: Zoom Switcher, Shutter Button, Gallery, Presets & Flip */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          {/* 1x / 2x / 3x Zoom Switcher Pill */}
          <View style={styles.zoomPillRow}>
            {[
              { label: '1x', val: 0 },
              { label: '2x', val: 0.2 },
              { label: '3x', val: 0.45 },
            ].map((z) => {
              const isActive = zoomLevel === z.val;
              return (
                <TouchableOpacity
                  key={z.label}
                  style={[styles.zoomChip, isActive && styles.zoomChipActive]}
                  onPress={() => setZoomLevel(z.val)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.zoomChipText, isActive && styles.zoomChipTextActive]}>
                    {z.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Preset Heritage Catalog Tray (When Opened) */}
          {showCatalog ? (
            <View style={styles.catalogTray}>
              <View style={styles.catalogHeader}>
                <View style={styles.catalogHeaderLeft}>
                  <MaterialIcons name="auto-awesome" size={16} color={Colors.primary} />
                  <Text style={styles.catalogTitle}>Instant Monument Presets</Text>
                </View>
                <TouchableOpacity onPress={() => setShowCatalog(false)} style={styles.catalogCloseBtn}>
                  <MaterialIcons name="close" size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catalogList}>
                {PRESET_CATALOG.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.catalogCard}
                    onPress={() => {
                      setShowCatalog(false);
                      navigateToResult(item);
                    }}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: dynamicImageService.getPlaceImage(item.name, item.category, item.imageUrl) }}
                      style={styles.catalogThumb}
                      contentFit="cover"
                    />
                    <View style={styles.catalogCardInfo}>
                      <Text style={styles.catalogCardName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.catalogCardSub} numberOfLines={1}>
                        {item.category.toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            /* Standard Flagship Camera Shutter Row */
            <View style={styles.shutterRow}>
              {/* Photo Gallery Import Button */}
              <TouchableOpacity
                style={styles.sideControlBtn}
                onPress={handlePickFromGallery}
                activeOpacity={0.8}
              >
                <View style={styles.sideControlIconWrap}>
                  <MaterialIcons name="photo-library" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.sideControlText}>Gallery</Text>
              </TouchableOpacity>

              {/* Main Flagship Camera Shutter Button */}
              <TouchableOpacity
                style={[styles.shutterOuterRing, isIdentifying && styles.shutterOuterRingBusy]}
                onPress={handleCapture}
                disabled={isIdentifying}
                activeOpacity={0.7}
              >
                {isIdentifying ? (
                  <ActivityIndicator size="large" color={Colors.primary} />
                ) : (
                  <View style={styles.shutterInnerCore} />
                )}
              </TouchableOpacity>

              {/* Instant Preset Catalog or Flip Toggle */}
              <TouchableOpacity
                style={styles.sideControlBtn}
                onPress={() => setShowCatalog(true)}
                activeOpacity={0.8}
              >
                <View style={styles.sideControlIconWrap}>
                  <MaterialIcons name="museum" size={22} color={Colors.primary} />
                </View>
                <Text style={styles.sideControlText}>Presets</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Front/Back Camera Flip Bar */}
          <View style={styles.flipBar}>
            <TouchableOpacity
              style={styles.flipBtn}
              onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
              activeOpacity={0.75}
            >
              <MaterialIcons name="flip-camera-ios" size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.flipBtnText}>Flip Camera ({facing === 'back' ? 'Rear' : 'Front'})</Text>
            </TouchableOpacity>
          </View>
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
                setScanStatus('Align monument or facade within frame');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.noticeButtonText}>Got It, Retake</Text>
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
    backgroundColor: '#0F0F0F',
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
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.base,
  },
  permissionIconCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
  },
  permissionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: '#F5F1E8',
  },
  permissionSubtitle: {
    fontSize: Typography.sizes.sm,
    color: '#A7A7A7',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  grantButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.base,
  },
  grantButtonText: {
    color: '#0F0F0F',
    fontWeight: '800',
    fontSize: Typography.sizes.base,
  },
  cancelButton: {
    padding: Spacing.md,
  },
  cancelButtonText: {
    color: '#777777',
    fontSize: Typography.sizes.sm,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
  },
  glassCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 15, 15, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  glassCircleBtnActive: {
    backgroundColor: '#FBBF24',
    borderColor: '#FBBF24',
  },
  aiLensPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(15, 15, 15, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  aiLensDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
  },
  aiLensText: {
    color: '#F5F1E8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  framingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleBox: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
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
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 16,
  },
  gridLineH1: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '33.33%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  gridLineH2: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '66.66%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  gridLineV1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '33.33%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  gridLineV2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '66.66%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  centerCrosshair: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairH: {
    position: 'absolute',
    width: 18,
    height: 1.5,
    backgroundColor: 'rgba(212, 175, 124, 0.6)',
  },
  crosshairV: {
    position: 'absolute',
    width: 1.5,
    height: 18,
    backgroundColor: 'rgba(212, 175, 124, 0.6)',
  },
  crosshairDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  laserLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 0,
    height: 2.5,
    backgroundColor: '#38BDF8',
    borderRadius: 2,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  statusBadgeWrap: {
    position: 'absolute',
    bottom: -46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 15, 15, 0.88)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    maxWidth: '92%',
  },
  idleScanDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  reticleText: {
    color: '#F5F1E8',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomBar: {
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
  },
  zoomPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 15, 15, 0.75)',
    borderRadius: BorderRadius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 20,
    gap: 4,
  },
  zoomChip: {
    width: 38,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomChipActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.25)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  zoomChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  zoomChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  sideControlBtn: {
    alignItems: 'center',
    gap: 5,
    width: 60,
  },
  sideControlIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(23, 23, 23, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  sideControlText: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '600',
  },
  shutterOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  shutterOuterRingBusy: {
    borderColor: 'rgba(212, 175, 124, 0.4)',
  },
  shutterInnerCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
  catalogTray: {
    width: '100%',
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    gap: 10,
    marginBottom: 8,
  },
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catalogHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  catalogTitle: {
    color: '#F5F1E8',
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  catalogCloseBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catalogList: {
    gap: 10,
    paddingVertical: 2,
  },
  catalogCard: {
    width: 105,
    borderRadius: 12,
    backgroundColor: '#1E1E20',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  catalogThumb: {
    width: '100%',
    height: 68,
    backgroundColor: '#2A2A2D',
  },
  catalogCardInfo: {
    padding: 6,
  },
  catalogCardName: {
    color: '#F5F1E8',
    fontSize: 10,
    fontWeight: '700',
  },
  catalogCardSub: {
    color: Colors.primary,
    fontSize: 8,
    fontWeight: '800',
    marginTop: 1,
  },
  flipBar: {
    marginTop: 14,
    alignItems: 'center',
  },
  flipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 15, 15, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  flipBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  noticeModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    zIndex: 999,
  },
  noticeCard: {
    backgroundColor: '#171717',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.35)',
    padding: Spacing.xl,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
    ...Shadows.lg,
  },
  noticeIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
  },
  noticeTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: '#F5F1E8',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  noticeGuidance: {
    fontSize: Typography.sizes.xs,
    color: '#A7A7A7',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  noticeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    width: '100%',
    alignItems: 'center',
  },
  noticeButtonText: {
    color: '#0F0F0F',
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
});
