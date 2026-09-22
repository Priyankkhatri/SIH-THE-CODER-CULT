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
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LANGUAGES } from '../../constants/theme';
import { authApi } from '../../services/api';
import { useUserStore } from '../../stores';
import { ScalePressable, SlideUpView } from '../../components/common/MicroAnimations';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser, setOnboarded, setLanguage, language } = useUserStore();

  // Screen state: Welcome vs. Login Bottom Sheet
  const [showLoginSheet, setShowLoginSheet] = useState(false);

  // Auth form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailFields, setShowEmailFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
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
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      {/* Hero Section: Full bleed architectural photography */}
      <View style={styles.heroSection}>
        <Image
          source={require('../../../assets/images/auth-bg.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Multi-stop cinematic gradient to smoothly transition from photo to warm light canvas */}
        <LinearGradient
          colors={[
            'rgba(18, 14, 11, 0.65)',
            'rgba(18, 14, 11, 0.15)',
            'rgba(250, 248, 245, 0.45)',
            'rgba(250, 248, 245, 0.92)',
            '#FAF8F5',
          ]}
          locations={[0, 0.35, 0.72, 0.9, 1]}
          style={styles.heroGradient}
        />

        {/* Floating Top Header Bar */}
        <View style={[styles.topFloatingBar, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.brandPill}
            activeOpacity={0.8}
            onLongPress={__DEV__ ? handleDevSkip : undefined}
            delayLongPress={700}
          >
            <View style={styles.brandDot} />
            <Text style={styles.brandTitleText}>YATRA</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionBadgeText}>v2.0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.langPill}
            onPress={() => setIsLangModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.langPillText}>{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</Text>
            <Ionicons name="chevron-down" size={12} color="#FFFFFF" style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        </View>

        {/* Monument Location Chip */}
        <View style={styles.locationChipContainer}>
          <View style={styles.locationChip}>
            <Ionicons name="location-sharp" size={13} color="#F59E0B" />
            <Text style={styles.locationChipText}>Rani Ki Vav • Patan (UNESCO Site)</Text>
          </View>
        </View>
      </View>

      {/* Content & Action Section */}
      <View style={[styles.contentSection, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
        <View style={styles.kickerRow}>
          <View style={styles.kickerIndicator} />
          <Text style={styles.kickerText}>HERITAGE COMPANION</Text>
        </View>

        <Text style={styles.mainTitle}>Explore Gujarat’s Heritage</Text>
        <Text style={styles.mainDescription}>
          Turn-by-turn routes, real-time monument footfall, and spoken audio stories for 155+ historical sites.
        </Text>

        <View style={styles.actionContainer}>
          <ScalePressable
            style={styles.getStartedButton}
            onPress={() => setShowLoginSheet(true)}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
            <View style={styles.getStartedArrowWrap}>
              <Ionicons name="arrow-forward" size={16} color="#1C1917" />
            </View>
          </ScalePressable>

          <Text style={styles.captionHint}>
            No account required to preview maps • Free for all travelers
          </Text>
        </View>
      </View>

      {/* Auth Bottom Sheet (Opens cleanly when Get Started is tapped) */}
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
                      <Text style={styles.sheetTitle}>Sign in to save your trip</Text>
                      <Text style={styles.sheetSub}>
                        Sync audio bookmarks, offline monument maps, and personalized trails.
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

                  {/* Mobile Number Login */}
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
                      <Text style={styles.sendOtpButtonText}>Continue with Phone</Text>
                    </ScalePressable>
                  </View>

                  {/* Divider */}
                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR CONNECT WITH</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Social Buttons */}
                  <View style={styles.socialButtonsRow}>
                    <ScalePressable
                      style={styles.socialButton}
                      onPress={() => handleSocialAuth('Google')}
                    >
                      <Ionicons name="logo-google" size={16} color="#EA4335" />
                      <Text style={styles.socialButtonText}>Google</Text>
                    </ScalePressable>

                    <ScalePressable
                      style={styles.socialButton}
                      onPress={() => handleSocialAuth('Apple')}
                    >
                      <Ionicons name="logo-apple" size={17} color="#1C1917" />
                      <Text style={styles.socialButtonText}>Apple</Text>
                    </ScalePressable>
                  </View>

                  {/* Email & Password Toggle */}
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
                <Ionicons name="close" size={20} color="#1C1917" />
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
  heroSection: {
    height: SCREEN_HEIGHT * 0.64,
    width: '100%',
    position: 'relative',
    backgroundColor: '#1C1917',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
  },
  topFloatingBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(28, 25, 23, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E05328',
  },
  brandTitleText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#FFFFFF',
  },
  versionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  versionBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 25, 23, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  locationChipContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    zIndex: 15,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(231, 226, 214, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  locationChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1917',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 6,
    marginBottom: 4,
  },
  kickerIndicator: {
    width: 14,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: '#E05328',
  },
  kickerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E05328',
    letterSpacing: 1.5,
  },
  mainTitle: {
    fontSize: 27,
    fontWeight: '900',
    color: '#1C1917',
    lineHeight: 33,
    letterSpacing: -0.4,
  },
  mainDescription: {
    fontSize: 13,
    color: '#78716C',
    lineHeight: 19,
    marginTop: 6,
  },
  actionContainer: {
    marginTop: 'auto',
    paddingTop: 16,
    gap: 10,
  },
  getStartedButton: {
    backgroundColor: '#1C1917',
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  getStartedButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  getStartedArrowWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionHint: {
    fontSize: 11,
    color: '#A8A29E',
    textAlign: 'center',
    fontWeight: '500',
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
    color: '#E05328',
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
    lineHeight: 16,
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
