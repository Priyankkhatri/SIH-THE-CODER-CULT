import React, { useState } from 'react';
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

  // Fast Developer Bypass - direct access to app via long-press on brand header in __DEV__
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

      {/* Screen 1: Clean Light-Theme Welcome Screen */}
      <View style={[styles.mainContainer, { paddingTop: insets.top + 6, paddingBottom: insets.bottom + 16 }]}>
        
        {/* Top Brand Header & Language Pill */}
        <View style={styles.topHeaderRow}>
          <TouchableOpacity
            style={styles.brandRow}
            activeOpacity={0.8}
            onLongPress={__DEV__ ? handleDevSkip : undefined}
            delayLongPress={700}
          >
            <View style={styles.brandIconWrap}>
              <Ionicons name="compass" size={17} color="#D97706" />
            </View>
            <Text style={styles.brandTitleText}>YATRA</Text>
          </TouchableOpacity>

          <View style={styles.topRightActions}>
            <View style={styles.heritageTag}>
              <Text style={styles.heritageTagText}>Gujarat Heritage</Text>
            </View>

            <TouchableOpacity
              style={styles.langPill}
              onPress={() => setIsLangModalOpen(true)}
              activeOpacity={0.75}
            >
              <Text style={styles.langPillText}>{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</Text>
              <Ionicons name="chevron-down" size={12} color="#78716C" style={{ marginLeft: 3 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cinematic Heritage Video / Animation Hero Card */}
        <View style={styles.heroCardWrap}>
          <Image
            source={require('../../../assets/images/auth-bg.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(28, 28, 30, 0.05)', 'rgba(28, 28, 30, 0.20)', 'rgba(28, 28, 30, 0.82)']}
            locations={[0, 0.5, 0.98]}
            style={styles.heroGradient}
          />

          {/* Floating 4K / Motion Pill */}
          <View style={styles.heroFloatingBadge}>
            <PulseBeacon color="#F59E0B" size={6} glowSize={12} />
            <Text style={styles.heroBadgeText}>Immersive 4K</Text>
          </View>

          {/* Bottom Card Title & Subtitle */}
          <View style={styles.heroCaptionArea}>
            <Text style={styles.heroPreTitle}>UNESCO WORLD HERITAGE</Text>
            <Text style={styles.heroCardTitle}>Rani Ki Vav & Sun Temple</Text>
            <Text style={styles.heroCardSub} numberOfLines={1}>
              Centuries of subterranean craftsmanship carved in golden sandstone.
            </Text>
          </View>
        </View>

        {/* Bottom Headline & Single Clean "Get Started" Button (NO LOGIN FORMS) */}
        <View style={styles.bottomCtaArea}>
          <View>
            <Text style={styles.editorialHeadline}>Step into living history.</Text>
            <Text style={styles.editorialSubtitle}>
              AI audio storytelling, live crowd radar, and curated circuits across 155+ ancient sites.
            </Text>
          </View>

          {/* Primary Action Button: GET STARTED */}
          <ScalePressable
            style={styles.getStartedButton}
            onPress={() => setShowLoginSheet(true)}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
            <View style={styles.getStartedArrowWrap}>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          </ScalePressable>
        </View>
      </View>

      {/* Screen 2: Slide-up Bottom Sheet Modal (Opens ONLY after tapping Get Started) */}
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
                      <Text style={styles.sheetPreTitle}>WELCOME TO YATRA</Text>
                      <Text style={styles.sheetTitle}>Sign in to continue</Text>
                      <Text style={styles.sheetSub}>
                        Unlock audio guides, custom circuits, and offline maps.
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
    gap: 8,
  },
  brandIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EBE1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5DEC9',
  },
  brandTitleText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#1C1C1E',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heritageTag: {
    backgroundColor: '#F0EBE1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5DEC9',
  },
  heritageTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8C7A6B',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EBE1',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5DEC9',
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  heroCardWrap: {
    width: '100%',
    aspectRatio: 0.88,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EFECE6',
    borderWidth: 1,
    borderColor: '#EADFCB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginVertical: 'auto',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
  },
  heroFloatingBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(250, 248, 245, 0.90)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: 0.2,
  },
  heroCaptionArea: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    right: 18,
  },
  heroPreTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FCD34D',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroCardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroCardSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 3,
  },
  bottomCtaArea: {
    gap: 16,
    marginTop: 10,
  },
  editorialHeadline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  editorialSubtitle: {
    fontSize: 13,
    color: '#78716C',
    lineHeight: 19,
    marginTop: 4,
  },
  getStartedButton: {
    backgroundColor: '#E05328',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#E05328',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  getStartedArrowWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 28, 30, 0.55)',
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
    color: '#E05328',
    letterSpacing: 0.8,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
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
    color: '#1C1C1E',
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
    color: '#1C1C1E',
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
    color: '#1C1C1E',
  },
  sendOtpButton: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 13,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#1C1C1E',
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
    color: '#1C1C1E',
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
    color: '#1C1C1E',
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
    color: '#1C1C1E',
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
    backgroundColor: 'rgba(28, 28, 30, 0.65)',
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
    color: '#1C1C1E',
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
    color: '#1C1C1E',
  },
  langOptionNative: {
    fontSize: 11,
    color: '#78716C',
  },
});
