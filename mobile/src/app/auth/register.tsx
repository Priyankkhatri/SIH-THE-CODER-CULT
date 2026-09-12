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

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser, setOnboarded } = useUserStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setOnboarded(true);
        router.replace('/(tabs)');
      } else {
        setErrorMessage(res.error?.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.error?.message || err?.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/app-logo.jpeg')}
            style={styles.logoImage}
            resizeMode="cover"
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the AI Tourist Companion to unlock personalized heritage itineraries and offline access.</Text>
        </View>

        {/* Error Box */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={18} color={Colors.error} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="maharshi@example.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={(val) => { setEmail(val); setErrorMessage(null); }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password (min 6 chars)</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Choose a strong password"
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
            <Text style={styles.label}>Preferred Audio & UI Language</Text>
            <View style={styles.langRow}>
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[styles.langChip, isSelected && styles.langChipSelected]}
                    onPress={() => setSelectedLanguage(lang.code)}
                  >
                    <Text style={styles.langFlag}>{lang.flag}</Text>
                    <Text style={[styles.langText, isSelected && styles.langTextSelected]}>
                      {lang.nativeName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.background} size="small" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Create Account</Text>
                <MaterialIcons name="check" size={20} color={Colors.background} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
            <Text style={styles.linkText}>Sign In</Text>
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
    padding: Spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  logoImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#D4AF37',
    marginBottom: Spacing.md,
    ...Shadows.glow,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
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
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    flex: 1,
  },
  form: {
    gap: Spacing.base,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: 52,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: Typography.sizes.base,
  },
  eyeBtn: {
    padding: Spacing.xs,
  },
  langRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  langChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  langChipSelected: {
    backgroundColor: 'rgba(212, 169, 71, 0.15)',
    borderColor: Colors.primary,
  },
  langFlag: {
    fontSize: 16,
  },
  langText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  langTextSelected: {
    color: Colors.primary,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    height: 52,
    marginTop: Spacing.sm,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.base,
  },
  footerText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  linkText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
});
