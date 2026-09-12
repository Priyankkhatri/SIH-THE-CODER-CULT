// Design System: AI Tourist Companion
// Rich dark theme with heritage gold accents

export const Colors = {
  // Core palette
  background: '#0A0A0F',
  backgroundAlt: '#0E0E18',
  surface: '#14141F',
  surfaceElevated: '#1A1A2E',
  surfaceHighlight: '#22223A',

  // Heritage accents
  primary: '#D4A947',       // Heritage gold
  primaryDark: '#B8912F',
  primaryLight: '#E8C96A',
  secondary: '#C17F59',     // Terracotta
  secondaryLight: '#D4976F',
  accent: '#5B8FB9',        // Sky blue (maps)
  accentLight: '#7BADD4',

  // Status colors
  success: '#4CAF50',
  warning: '#FFA726',
  error: '#EF5350',
  info: '#42A5F5',

  // Text
  text: '#F5F0E8',           // Warm white
  textSecondary: '#A8A3B3',
  textMuted: '#6B6B7B',
  textInverse: '#0A0A0F',

  // Borders & dividers
  border: '#2A2A3E',
  borderLight: '#3A3A52',
  divider: '#1E1E30',

  // Category colors
  heritage: '#D4A947',
  museum: '#8B6FC0',
  culture: '#5B8FB9',
  food: '#E67E5A',
  activity: '#4CAF50',

  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#D4A947', '#B8912F'],
  gradientHero: ['#0A0A0F', '#14141F', '#0A0A0F'],
  gradientCard: ['#1A1A2E', '#14141F'],
  gradientOverlay: ['transparent', 'rgba(10, 10, 15, 0.8)', 'rgba(10, 10, 15, 0.95)'],
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 48,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  '2xl': 28,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#D4A947',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Category configuration
export const CATEGORIES = [
  { key: 'heritage', label: 'Heritage', icon: 'account-balance', color: Colors.heritage },
  { key: 'museum', label: 'Museums', icon: 'museum', color: Colors.museum },
  { key: 'culture', label: 'Culture', icon: 'palette', color: Colors.culture },
  { key: 'food', label: 'Food', icon: 'restaurant', color: Colors.food },
  { key: 'activity', label: 'Activities', icon: 'directions-walk', color: Colors.activity },
] as const;

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Automatically detect host IP from Expo bundler connection (Expo Go on physical devices)
const expoHostUri =
  Constants.expoConfig?.hostUri ||
  (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
  (Constants as any).manifest?.debuggerHost;

const detectedHostIp = expoHostUri ? expoHostUri.split(':')[0] : null;

// Auto-resolves: On web always use localhost (or window.location.hostname) to prevent network errors.
// On physical mobile devices (Expo Go), auto-resolve to dev machine LAN IP.
export const API_BASE_URL = Platform.OS === 'web'
  ? (typeof window !== 'undefined' && window.location.hostname
      ? `http://${window.location.hostname}:3000`
      : 'http://localhost:3000')
  : (detectedHostIp ? `http://${detectedHostIp}:3000` : 'http://localhost:3000');


// Language configuration
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
] as const;

// Onboarding options
export const INTERESTS_OPTIONS = [
  { key: 'heritage', label: 'Heritage Sites', icon: '🏛️' },
  { key: 'museum', label: 'Museums', icon: '🖼️' },
  { key: 'culture', label: 'Culture & Art', icon: '🎨' },
  { key: 'food', label: 'Local Food', icon: '🍽️' },
  { key: 'activity', label: 'Activities', icon: '🥾' },
] as const;

export const TRAVEL_STYLES = [
  { key: 'rushed', label: 'Quick Explorer', description: 'See more, spend less time', icon: '⚡' },
  { key: 'moderate', label: 'Balanced', description: 'Perfect mix of exploring and learning', icon: '⚖️' },
  { key: 'leisurely', label: 'Deep Diver', description: 'Take your time, learn everything', icon: '🧘' },
] as const;

export const DURATION_OPTIONS = [
  { key: '30min', label: '30 min', description: 'Quick visit' },
  { key: '90min', label: '90 min', description: 'Standard tour' },
  { key: 'half-day', label: 'Half Day', description: '4 hours' },
  { key: 'full-day', label: 'Full Day', description: '8 hours' },
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  heritage: Colors.heritage,
  museum: Colors.museum,
  culture: Colors.culture,
  food: Colors.food,
  activity: Colors.activity,
};
