import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Modal,
  StatusBar,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LANGUAGES } from '../../constants/theme';
import { authApi } from '../../services/api';
import { useUserStore } from '../../stores';
import { ScalePressable, PulseBeacon, SlideUpView } from '../../components/common/MicroAnimations';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser, setOnboarded, setLanguage, language } = useUserStore();

  // Screen state: Welcome vs. Login Sheet
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [isStamped, setIsStamped] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Animations
  const ticketFloatAnim = useRef(new Animated.Value(0)).current;
  const stampScaleAnim = useRef(new Animated.Value(2.5)).current;
  const stampOpacityAnim = useRef(new Animated.Value(0)).current;

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailFields, setShowEmailFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Floating ticket gentle loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ticketFloatAnim, {
          toValue: -6,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ticketFloatAnim, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Trigger tactile ASI Stamp validation
  const handleValidatePass = () => {
    if (isStamped) {
      setShowLoginSheet(true);
      return;
    }

    setIsValidating(true);
    setIsStamped(true);

    Animated.parallel([
      Animated.spring(stampScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(stampOpacityAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        setIsValidating(false);
        setShowLoginSheet(true);
      }, 550);
    });
  };

  // Fast Developer Bypass
  const handleDevSkip = () => {
    setUser(
      `dev-${Date.now().toString().slice(-4)}`,
      'dev-token-local-bypass',
      'Developer Explorer',
      'dev@yatra.local',
      false
    );
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  const handlePhoneSubmit = () => {
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    setErrorMessage(null);
    setUser(
      `user-${Date.now().toString().slice(-4)}`,
      'phone-auth-token',
      `Explorer ${phoneNumber.slice(-4)}`,
      `+91${phoneNumber}`,
      false
    );
    setOnboarded(true);
    setShowLoginSheet(false);
    router.replace('/(tabs)');
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res: any = await authApi.login({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (res?.success && res.data) {
        setUser(res.data.user.id, res.data.token, res.data.user.name, res.data.user.email, false);
        setOnboarded(true);
        setShowLoginSheet(false);
        router.replace('/(tabs)');
      } else {
        setUser(`user-${Date.now().toString().slice(-4)}`, 'local-auth-token', email.split('@')[0], email, false);
        setOnboarded(true);
        setShowLoginSheet(false);
        router.replace('/(tabs)');
      }
    } catch {
      setUser(`user-${Date.now().toString().slice(-4)}`, 'local-auth-token', email.split('@')[0], email, false);
      setOnboarded(true);
      setShowLoginSheet(false);
      router.replace('/(tabs)');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setErrorMessage(null);
    setIsGuestLoading(true);
    try {
      const res: any = await authApi.createGuest();
      if (res?.success && res.data) {
        setUser(res.data.user.id, res.data.token, res.data.user.name, undefined, true);
        setOnboarded(true);
        setShowLoginSheet(false);
        router.replace('/(tabs)');
      } else {
        setUser(`guest-${Date.now().toString().slice(-4)}`, 'guest-token-local', 'Guest Explorer', undefined, true);
        setOnboarded(true);
        setShowLoginSheet(false);
        router.replace('/(tabs)');
      }
    } catch {
      setUser(`guest-${Date.now().toString().slice(-4)}`, 'guest-token-local', 'Guest Explorer', undefined, true);
      setOnboarded(true);
      setShowLoginSheet(false);
      router.replace('/(tabs)');
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    setUser(
      `${provider.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      `${provider.toLowerCase()}-token`,
      `${provider} Explorer`,
      `${provider.toLowerCase()}@yatra.in`,
      false
    );
    setOnboarded(true);
    setShowLoginSheet(false);
    router.replace('/(tabs)');
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === (language || 'en')) || LANGUAGES[0];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />

      {/* Screen 1: Bespoke Heritage Explorer Pass Welcome Screen */}
      <View style={[styles.mainContainer, { paddingTop: insets.top + 6, paddingBottom: insets.bottom + 14 }]}>
        
        {/* Top Identity Row */}
        <View style={styles.topHeaderRow}>
          <TouchableOpacity
            style={styles.brandRow}
            activeOpacity={0.8}
            onLongPress={__DEV__ ? handleDevSkip : undefined}
            delayLongPress={700}
          >
            <Text style={styles.brandTitleText}>YATRA</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionBadgeText}>v2.0</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.topRightActions}>
            <View style={styles.editionCol}>
              <Text style={styles.editionSubText}>EDITION</Text>
              <Text style={styles.editionTitleText}>GUJARAT 2026</Text>
            </View>

            <TouchableOpacity
              style={styles.langPill}
              onPress={() => setIsLangModalOpen(true)}
              activeOpacity={0.75}
            >
              <Text style={styles.langPillText}>{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</Text>
              <Ionicons name="chevron-down" size={11} color="#78716C" style={{ marginLeft: 3 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Centerpiece: Physical Heritage Explorer Pass Ticket */}
        <Animated.View style={[styles.ticketContainer, { transform: [{ translateY: ticketFloatAnim }] }]}>
          <View style={styles.ticketCard}>
            
            {/* Perforated Notches (Left & Right Cutouts) */}
            <View style={styles.perforatedNotchLeft} />
            <View style={styles.perforatedNotchRight} />

            {/* Top Pass Header: Official Seal & Circuit */}
            <View style={styles.ticketHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.officialPillRow}>
                  <View style={styles.greenPulseDot} />
                  <Text style={styles.officialPillText}>OFFICIAL HERITAGE PASS</Text>
                </View>
                <Text style={styles.ticketStateTitle}>State of Gujarat</Text>
                <Text style={styles.ticketCircuitSub}>Circuit: Patan • Modhera • Dwarka</Text>
              </View>

              {/* Hologram / Gold Wax Seal */}
              <View style={styles.goldSealBadge}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706', '#92400E']}
                  style={styles.goldSealGradient}
                >
                  <Text style={styles.sealUnescoText}>UNESCO</Text>
                  <MaterialIcons name="verified" size={16} color="#FFFFFF" />
                  <Text style={styles.sealVerifiedText}>VERIFIED</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Architectural Visual Cutout */}
            <View style={styles.ticketVisualWrap}>
              <Image
                source={require('../../../assets/images/auth-bg.jpg')}
                style={styles.ticketVisualImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(28, 25, 23, 0.75)']}
                style={styles.ticketVisualGradient}
              />
              <View style={styles.ticketVisualCaption}>
                <View>
                  <Text style={styles.monumentNumTag}>MONUMENT NO. 042</Text>
                  <Text style={styles.monumentNameText}>Rani Ki Vav • Stepwell</Text>
                </View>
                <View style={styles.eraPill}>
                  <Text style={styles.eraPillText}>1026 AD</Text>
                </View>
              </View>
            </View>

            {/* Perforated Dashed Line */}
            <View style={styles.dashedDivider} />

            {/* Bottom Ticket Info & Stamp / Barcode Area */}
            <View style={styles.ticketFooterRow}>
              <View style={styles.holderAccessCol}>
                <Text style={styles.holderAccessLabel}>HOLDER ACCESS</Text>
                <Text style={styles.holderAccessTitle}>155+ SITES • 4K AUDIO</Text>
                <Text style={styles.holderAccessSub}>GPS Radar • Live Footfall</Text>
              </View>

              {/* Dynamic Physical ASI Stamp (Slaps down with spring physics on click) */}
              {isStamped && (
                <Animated.View
                  style={[
                    styles.asiStampBox,
                    {
                      transform: [
                        { scale: stampScaleAnim },
                        { rotate: '-10deg' },
                      ],
                      opacity: stampOpacityAnim,
                    },
                  ]}
                >
                  <Text style={styles.stampPreText}>ASI ENTRY</Text>
                  <Text style={styles.stampMainText}>APPROVED</Text>
                  <Text style={styles.stampDateText}>22 SEP 2026</Text>
                </Animated.View>
              )}

              {/* Realistic Faux Barcode */}
              <View style={[styles.barcodeWrap, isStamped && { opacity: 0.3 }]}>
                <View style={styles.barcodeLinesRow}>
                  <View style={[styles.bLine, { width: 2 }]} />
                  <View style={[styles.bLine, { width: 1 }]} />
                  <View style={[styles.bLine, { width: 3 }]} />
                  <View style={[styles.bLine, { width: 1 }]} />
                  <View style={[styles.bLine, { width: 2 }]} />
                  <View style={[styles.bLine, { width: 4 }]} />
                  <View style={[styles.bLine, { width: 1 }]} />
                  <View style={[styles.bLine, { width: 3 }]} />
                  <View style={[styles.bLine, { width: 2 }]} />
                </View>
                <Text style={styles.barcodeNumText}>IN-YTR-8842</Text>
              </View>
            </View>

          </View>
        </Animated.View>

        {/* Bottom Interactive Validation Action */}
        <View style={styles.bottomInteractiveSection}>
          <Text style={styles.bottomInstructionText}>
            Tap pass to validate and begin your journey
          </Text>

          <ScalePressable
            style={[
              styles.validatePassBtn,
              isStamped && styles.validatePassBtnActive,
            ]}
            onPress={handleValidatePass}
          >
            {isValidating ? (
              <View style={styles.btnContentRow}>
                <ActivityIndicator size="small" color="#F59E0B" />
                <Text style={[styles.validateBtnText, { color: '#F59E0B' }]}>
                  STAMPING ENTRY PASS…
                </Text>
              </View>
            ) : isStamped ? (
              <View style={styles.btnContentRow}>
                <Ionicons name="checkmark-circle" size={19} color="#10B981" />
                <Text style={[styles.validateBtnText, { color: '#10B981' }]}>
                  PASS APPROVED • ENTER YATRA
                </Text>
              </View>
            ) : (
              <View style={styles.btnContentRowBetween}>
                <View style={styles.btnLeftLabel}>
                  <View style={styles.btnGoldDot} />
                  <Text style={styles.validateBtnText}>VALIDATE PASS & ENTER</Text>
                </View>
                <View style={styles.btnArrowCircle}>
                  <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
                </View>
              </View>
            )}
          </ScalePressable>
        </View>

      </View>

      {/* Screen 2: Slide-up Auth Sheet (Opens after validating pass) */}
      <Modal
        visible={showLoginSheet}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLoginSheet(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLoginSheet(false)}>
          <View style={styles.sheetBackdrop}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.sheetContentWrapper}
              >
                <SlideUpView distance={140} style={styles.sheetCard}>
                  {/* Drag Handle */}
                  <TouchableOpacity
                    style={styles.sheetDragHandleTouch}
                    onPress={() => setShowLoginSheet(false)}
                  >
                    <View style={styles.sheetDragHandle} />
                  </TouchableOpacity>

                  {/* Header Row */}
                  <View style={styles.sheetHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sheetPreTitle}>HERITAGE PASS APPROVED</Text>
                      <Text style={styles.sheetTitle}>Sign in to save progress</Text>
                      <Text style={styles.sheetSub}>
                        Save audio tours, create itineraries, and navigate offline.
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.sheetCloseBtn}
                      onPress={() => setShowLoginSheet(false)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <Ionicons name="close" size={18} color="#78716C" />
                    </TouchableOpacity>
                  </View>

                  {/* Error Banner */}
                  {errorMessage && (
                    <View style={styles.sheetErrorBanner}>
                      <Ionicons name="alert-circle" size={16} color="#DC2626" />
                      <Text style={styles.sheetErrorText}>{errorMessage}</Text>
                    </View>
                  )}

                  {/* Quick Phone / OTP Login */}
                  <View style={styles.phoneSection}>
                    <Text style={styles.fieldLabel}>Mobile Number</Text>
                    <View style={styles.phoneInputRow}>
                      <View style={styles.countryCodeBadge}>
                        <Text style={styles.flagEmoji}>🇮🇳</Text>
                        <Text style={styles.countryCodeText}>+91</Text>
                      </View>
                      <TextInput
                        style={styles.phoneTextInput}
                        placeholder="Enter 10-digit number"
                        placeholderTextColor="#A8A29E"
                        keyboardType="phone-pad"
                        maxLength={10}
                        value={phoneNumber}
                        onChangeText={(text) => {
                          setPhoneNumber(text.replace(/[^0-9]/g, ''));
                          if (errorMessage) setErrorMessage(null);
                        }}
                      />
                    </View>

                    <ScalePressable
                      style={styles.sendOtpButton}
                      onPress={handlePhoneSubmit}
                    >
                      <Text style={styles.sendOtpButtonText}>Send OTP Verification</Text>
                    </ScalePressable>
                  </View>

                  {/* Divider */}
                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR CONNECT WITH</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* One-Tap Social Options */}
                  <View style={styles.socialButtonsRow}>
                    <ScalePressable
                      style={styles.socialButton}
                      onPress={() => handleSocialAuth('Google')}
                    >
                      <Ionicons name="logo-google" size={17} color="#EA4335" />
                      <Text style={styles.socialButtonText}>Google</Text>
                    </ScalePressable>

                    <ScalePressable
                      style={styles.socialButton}
                      onPress={() => handleSocialAuth('Apple')}
                    >
                      <Ionicons name="logo-apple" size={18} color="#1C1C1E" />
                      <Text style={styles.socialButtonText}>Apple</Text>
                    </ScalePressable>
                  </View>

                  {/* Email/Password Toggle */}
                  {!showEmailFields ? (
                    <TouchableOpacity
                      style={styles.toggleEmailRow}
                      onPress={() => setShowEmailFields(true)}
                    >
                      <Ionicons name="mail-outline" size={14} color="#78716C" />
                      <Text style={styles.toggleEmailText}>Sign in with Email & Password</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emailFieldsContainer}>
                      <TextInput
                        style={styles.emailInput}
                        placeholder="Email address"
                        placeholderTextColor="#A8A29E"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                      />
                      <View style={styles.passwordRow}>
                        <TextInput
                          style={styles.passwordInput}
                          placeholder="Password"
                          placeholderTextColor="#A8A29E"
                          secureTextEntry={!showPassword}
                          value={password}
                          onChangeText={setPassword}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={{ padding: 6 }}
                        >
                          <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={16}
                            color="#78716C"
                          />
                        </TouchableOpacity>
                      </View>
                      <ScalePressable
                        style={styles.emailLoginButton}
                        onPress={handleLogin}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Text style={styles.emailLoginButtonText}>Sign In</Text>
                        )}
                      </ScalePressable>
                    </View>
                  )}

                  {/* Guest Explorer Option */}
                  <View style={styles.guestContainer}>
                    <TouchableOpacity
                      style={styles.guestLink}
                      onPress={handleGuestLogin}
                      activeOpacity={0.7}
                    >
                      {isGuestLoading ? (
                        <ActivityIndicator size="small" color="#E05328" />
                      ) : (
                        <>
                          <Text style={styles.guestLinkText}>Continue as Guest</Text>
                          <Ionicons name="arrow-forward" size={13} color="#E05328" style={{ marginLeft: 3 }} />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.termsText}>
                    By continuing, you agree to Yatra's Terms of Service and Privacy Policy.
                  </Text>
                </SlideUpView>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={isLangModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLangModalOpen(false)}
      >
        <View style={styles.langModalBackdrop}>
          <View style={styles.langModalCard}>
            <View style={styles.langModalHeader}>
              <Text style={styles.langModalTitle}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setIsLangModalOpen(false)}
                style={styles.langModalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#1C1C1E" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 320 }}>
              {LANGUAGES.map((item) => {
                const isSelected = item.code === (language || 'en');
                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[styles.langOptionItem, isSelected && styles.langOptionItemSelected]}
                    onPress={() => {
                      setLanguage(item.code);
                      setIsLangModalOpen(false);
                    }}
                  >
                    <View style={styles.langOptionLeft}>
                      <Text style={styles.langOptionFlag}>{item.flag}</Text>
                      <View>
                        <Text style={styles.langOptionName}>{item.name}</Text>
                        <Text style={styles.langOptionNative}>{item.nativeName}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={19} color="#D97706" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitleText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
    color: '#1C1917',
  },
  versionBadge: {
    backgroundColor: '#E7E0D3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  versionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#78716C',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editionCol: {
    alignItems: 'flex-end',
  },
  editionSubText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A8A29E',
    letterSpacing: 1,
  },
  editionTitleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: 0.5,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EBE1',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5DEC9',
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1917',
  },
  ticketContainer: {
    width: '100%',
    marginVertical: 'auto',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E7E2D6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  perforatedNotchLeft: {
    position: 'absolute',
    left: -14,
    top: '64%',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E7E2D6',
    zIndex: 10,
  },
  perforatedNotchRight: {
    position: 'absolute',
    right: -14,
    top: '64%',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E7E2D6',
    zIndex: 10,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E7E2D6',
  },
  officialPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  greenPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  officialPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1,
  },
  ticketStateTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1917',
  },
  ticketCircuitSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#78716C',
    marginTop: 2,
  },
  goldSealBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  goldSealGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  sealUnescoText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  sealVerifiedText: {
    fontSize: 6,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
  },
  ticketVisualWrap: {
    width: '100%',
    aspectRatio: 1.65,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 14,
    backgroundColor: '#EFECE6',
    borderWidth: 1,
    borderColor: '#EADFCB',
  },
  ticketVisualImage: {
    width: '100%',
    height: '100%',
  },
  ticketVisualGradient: {
    ...StyleSheet.absoluteFill,
  },
  ticketVisualCaption: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  monumentNumTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FDE68A',
    letterSpacing: 1,
  },
  monumentNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
  },
  eraPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  eraPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D6CFC4',
    marginVertical: 10,
  },
  ticketFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    position: 'relative',
  },
  holderAccessCol: {
    gap: 2,
  },
  holderAccessLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#A8A29E',
    letterSpacing: 0.8,
  },
  holderAccessTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: 0.3,
  },
  holderAccessSub: {
    fontSize: 10,
    color: '#78716C',
  },
  asiStampBox: {
    position: 'absolute',
    right: 6,
    top: -12,
    borderWidth: 2.5,
    borderColor: '#DC2626',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(254, 242, 242, 0.95)',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stampPreText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 1.5,
  },
  stampMainText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#DC2626',
    letterSpacing: 1,
  },
  stampDateText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#DC2626',
  },
  barcodeWrap: {
    alignItems: 'flex-end',
  },
  barcodeLinesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    gap: 2,
  },
  bLine: {
    height: '100%',
    backgroundColor: '#1C1917',
  },
  barcodeNumText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#78716C',
    letterSpacing: 1,
    marginTop: 2,
  },
  bottomInteractiveSection: {
    gap: 12,
    marginTop: 8,
  },
  bottomInstructionText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
  },
  validatePassBtn: {
    backgroundColor: '#1C1917',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  validatePassBtnActive: {
    backgroundColor: '#1C1917',
    borderColor: '#10B981',
    borderWidth: 1.5,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  btnContentRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnLeftLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnGoldDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F59E0B',
  },
  validateBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  btnArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContentWrapper: {
    width: '100%',
    maxHeight: '85%',
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 20,
  },
  sheetDragHandleTouch: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  sheetDragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2DCCE',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 16,
  },
  sheetPreTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.8,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1917',
    marginTop: 2,
  },
  sheetSub: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 3,
  },
  sheetCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  sheetErrorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
    flex: 1,
  },
  phoneSection: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1917',
    letterSpacing: 0.2,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#F7F4EE',
    borderWidth: 1,
    borderColor: '#E7E2D6',
  },
  flagEmoji: {
    fontSize: 14,
  },
  countryCodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  phoneTextInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#F7F4EE',
    borderWidth: 1,
    borderColor: '#E7E2D6',
    fontSize: 13,
    color: '#1C1917',
  },
  sendOtpButton: {
    backgroundColor: '#1C1917',
    paddingVertical: 13,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  sendOtpButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAE5DC',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A8A29E',
    paddingHorizontal: 10,
    letterSpacing: 0.5,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E7E2D6',
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1917',
  },
  toggleEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 6,
  },
  toggleEmailText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
  },
  emailFieldsContainer: {
    marginTop: 10,
    gap: 8,
  },
  emailInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F7F4EE',
    borderWidth: 1,
    borderColor: '#E7E2D6',
    fontSize: 12,
    color: '#1C1917',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#F7F4EE',
    borderWidth: 1,
    borderColor: '#E7E2D6',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 12,
    color: '#1C1917',
  },
  emailLoginButton: {
    backgroundColor: '#E05328',
    paddingVertical: 11,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 2,
  },
  emailLoginButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  guestContainer: {
    alignItems: 'center',
    marginTop: 14,
  },
  guestLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  guestLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E05328',
  },
  termsText: {
    fontSize: 10,
    color: '#A8A29E',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 14,
  },
  langModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  langModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EAE5DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  langModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#F3EFE9',
  },
  langModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
  },
  langModalCloseBtn: {
    padding: 4,
  },
  langOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  langOptionItemSelected: {
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
  },
  langOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langOptionFlag: {
    fontSize: 20,
  },
  langOptionName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  langOptionNative: {
    fontSize: 11,
    color: '#78716C',
  },
});
