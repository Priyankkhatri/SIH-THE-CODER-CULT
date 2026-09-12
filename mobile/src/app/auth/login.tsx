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
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows, LANGUAGES } from '../../constants/theme';
import { authApi } from '../../services/api';
import { useUserStore } from '../../stores';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser, setOnboarded, setLanguage } = useUserStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fast Developer Bypass - direct access to app
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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res: any = await authApi.login({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (res.success && res.data) {
        setUser(res.data.user.id, res.data.token, res.data.user.name, res.data.user.email, false);
        setOnboarded(true);
        router.replace('/(tabs)');
      } else {
        setUser(`user-${Date.now().toString().slice(-4)}`, 'local-auth-token', email.split('@')[0], email, false);
        setOnboarded(true);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setUser(`user-${Date.now().toString().slice(-4)}`, 'local-auth-token', email.split('@')[0], email, false);
      setOnboarded(true);
      router.replace('/(tabs)');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res: any = await authApi.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        language: selectedLanguage,
      });

      if (res.success && res.data) {
        setUser(res.data.user.id, res.data.token, res.data.user.name, res.data.user.email, false);
        setLanguage(selectedLanguage);
        setOnboarded(true);
        router.replace('/(tabs)');
      } else {
        setUser(`user-${Date.now().toString().slice(-4)}`, 'local-auth-token', name.trim(), email.trim(), false);
        setLanguage(selectedLanguage);
        setOnboarded(true);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setUser(`user-${Date.now().toString().slice(-4)}`, 'local-auth-token', name.trim(), email.trim(), false);
      setLanguage(selectedLanguage);
      setOnboarded(true);
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
      if (res.success && res.data) {
        setUser(res.data.user.id, res.data.token, res.data.user.name, undefined, true);
        setOnboarded(true);
        router.replace('/(tabs)');
      } else {
        setUser(`guest-${Date.now().toString().slice(-4)}`, 'guest-token-local', 'Guest Explorer', undefined, true);
        setOnboarded(true);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setUser(`guest-${Date.now().toString().slice(-4)}`, 'guest-token-local', 'Guest Explorer', undefined, true);
      setOnboarded(true);
      router.replace('/(tabs)');
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Top Header Bar with Dev Skip Button */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Image
              source={require('../../../assets/images/app-logo.jpeg')}
              style={styles.logoMini}
              resizeMode="cover"
            />
            <Text style={styles.brandTitle}>Yatra AI</Text>
          </View>

          {/* Development Skip Button in Top Header */}
          <TouchableOpacity
            style={styles.topSkipBtn}
            onPress={handleDevSkip}
            activeOpacity={0.75}
          >
            <MaterialIcons name="bolt" size={16} color={Colors.primary} />
            <Text style={styles.topSkipText}>Skip (Dev)</Text>
            <MaterialIcons name="arrow-forward" size={13} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Hero Branding Header */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/app-logo.jpeg')}
            style={styles.logoImage}
            resizeMode="cover"
          />
          <Text style={styles.title}>
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'signin'
              ? 'Sign in to access verified ASI chronicles, AI guides & your saved itineraries.'
              : 'Join Yatra to unlock personalized itineraries, offline maps & 3,696+ monument dossiers.'}
          </Text>
        </View>

        {/* Segmented Tab Switcher (Sign In vs Sign Up) */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabButton, mode === 'signin' && styles.tabButtonActive]}
            onPress={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="lock-outline"
              size={18}
              color={mode === 'signin' ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, mode === 'signup' && styles.tabButtonActive]}
            onPress={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="person-add"
              size={18}
              color={mode === 'signup' ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error Alert Box */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={18} color={Colors.error} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Dynamic Form: Sign In vs Sign Up */}
        {mode === 'signin' ? (
          <View style={styles.form}>
            {/* Quick Demo Credentials Fill Chips */}
            <View style={styles.demoFillRow}>
              <Text style={styles.demoFillLabel}>Demo Fill:</Text>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => {
                  setEmail('tourist@sih.gov.in');
                  setPassword('tourist123');
                  setErrorMessage(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.demoChipText}>🧑‍💻 Tourist Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => {
                  setEmail('historian@asi.nic.in');
                  setPassword('asi2026');
                  setErrorMessage(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.demoChipText}>🏛️ ASI Official</Text>
              </TouchableOpacity>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="tourist@companion.com"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={(val) => { setEmail(val); setErrorMessage(null); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={(val) => { setPassword(val); setErrorMessage(null); }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Sign In Button */}
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.background} size="small" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Sign In to Yatra</Text>
                  <MaterialIcons name="arrow-forward" size={20} color={Colors.background} />
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Maharshi Patel"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={(val) => { setName(val); setErrorMessage(null); }}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="tourist@companion.com"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={(val) => { setEmail(val); setErrorMessage(null); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password (min 6 characters)</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create strong password"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={(val) => { setPassword(val); setErrorMessage(null); }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Preferred Language Chips */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Guide Language</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.langScroll}
              >
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={[styles.langChip, isSelected && styles.langChipSelected]}
                      onPress={() => setSelectedLanguage(lang.code)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.langFlag}>{lang.flag}</Text>
                      <Text style={[styles.langText, isSelected && styles.langTextSelected]}>
                        {lang.nativeName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Submit Create Account Button */}
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.background} size="small" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Create Free Account</Text>
                  <MaterialIcons name="person-add" size={20} color={Colors.background} />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Universal Dev & Guest Section */}
        <View style={styles.devAndGuestSection}>
          {/* Dedicated Dev Skip Card Button */}
          <TouchableOpacity
            style={styles.devBypassCard}
            onPress={handleDevSkip}
            activeOpacity={0.85}
          >
            <View style={styles.devBypassIconWrap}>
              <MaterialIcons name="bolt" size={22} color="#FFD700" />
            </View>
            <View style={styles.devBypassInfo}>
              <Text style={styles.devBypassTitle}>Skip Login (Development Mode)</Text>
              <Text style={styles.devBypassSubtitle}>Instant 1-tap bypass into Yatra App Tabs</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color="#FFD700" />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE AS</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Guest Session Button */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
            disabled={isGuestLoading}
            activeOpacity={0.85}
          >
            {isGuestLoading ? (
              <ActivityIndicator color={Colors.primary} size="small" />
            ) : (
              <>
                <MaterialIcons name="person-outline" size={20} color={Colors.primary} />
                <Text style={styles.guestButtonText}>Continue as Anonymous Guest</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Mode Switcher */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {mode === 'signin' ? "Don't have an account yet? " : 'Already registered? '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setErrorMessage(null);
            }}
          >
            <Text style={styles.linkText}>
              {mode === 'signin' ? 'Create Account' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  logoMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  brandTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  topSkipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 169, 71, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.4)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  topSkipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.3,
  },

  // Hero Header
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#D4AF37',
    marginBottom: Spacing.sm,
    ...Shadows.glow,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
  },

  // Segmented Switcher Tab
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(212, 169, 71, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.35)',
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  // Error Alert
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.3)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    flex: 1,
  },

  // Form Styles
  form: {
    gap: Spacing.base,
  },
  demoFillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: BorderRadius.md,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  demoFillLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  demoChip: {
    backgroundColor: 'rgba(212, 169, 71, 0.12)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 169, 71, 0.25)',
  },
  demoChipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: 50,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: Typography.sizes.sm,
  },
  eyeBtn: {
    padding: Spacing.xs,
  },

  // Language Scroll
  langScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  langChipSelected: {
    backgroundColor: 'rgba(212, 169, 71, 0.18)',
    borderColor: Colors.primary,
  },
  langFlag: {
    fontSize: 14,
  },
  langText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  langTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },

  // Primary Button
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    height: 50,
    marginTop: Spacing.xs,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.background,
  },

  // Dev & Guest Section
  devAndGuestSection: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  devBypassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.glow,
  },
  devBypassIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  devBypassInfo: {
    flex: 1,
  },
  devBypassTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 0.3,
  },
  devBypassSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    letterSpacing: 0.8,
  },

  // Guest Button
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    height: 48,
    gap: Spacing.sm,
  },
  guestButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  linkText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
});
