import { create } from 'zustand';
import { safeStorage } from '../utils/safeStorage';
import { favoritesApi } from '../services/api/favorites.api';
import { offlineApi } from '../services/api/offline.api';

// ============ USER STORE ============
interface UserState {
  userId: string | null;
  token: string | null;
  name: string;
  email: string | null;
  language: string;
  isGuest: boolean;
  interests: string[];
  travelStyle: string;
  duration: string;
  isOnboarded: boolean;
  setUser: (userId: string, token: string, name?: string, email?: string, isGuest?: boolean) => void;
  setLanguage: (lang: string) => void;
  setPreferences: (prefs: { interests?: string[]; travelStyle?: string; duration?: string }) => void;
  setOnboarded: (value: boolean) => void;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  token: null,
  name: 'Tourist',
  email: null,
  language: 'en',
  isGuest: true,
  interests: ['heritage'],
  travelStyle: 'moderate',
  duration: '90min',
  isOnboarded: false,

  setUser: (userId, token, name, email, isGuest = false) => {
    set({
      userId,
      token,
      name: name || 'Tourist',
      email: email || null,
      isGuest,
    });
    get().saveToStorage();
  },

  setLanguage: (language) => {
    set({ language });
    get().saveToStorage();
  },

  setPreferences: (prefs) => {
    set((state) => ({
      interests: prefs.interests || state.interests,
      travelStyle: prefs.travelStyle || state.travelStyle,
      duration: prefs.duration || state.duration,
    }));
    get().saveToStorage();
  },

  setOnboarded: (isOnboarded) => {
    set({ isOnboarded });
    get().saveToStorage();
  },

  logout: async () => {
    try {
      await safeStorage.removeItem('user_store');
      set({
        userId: null,
        token: null,
        name: 'Tourist',
        email: null,
        isGuest: true,
        isOnboarded: false,
      });
    } catch (e) {
      console.error('Logout failed:', e);
    }
  },

  loadFromStorage: async () => {
    try {
      const data = await safeStorage.getItem('user_store');
      if (data) {
        const parsed = JSON.parse(data);
        set(parsed);
      }
    } catch (e) {
      console.warn('[UserStore] Failed to load user store:', e);
    }
  },

  saveToStorage: async () => {
    try {
      const s = get();
      const cleanData = {
        userId: s.userId,
        token: s.token,
        name: s.name,
        email: s.email,
        language: s.language,
        isGuest: s.isGuest,
        interests: s.interests,
        travelStyle: s.travelStyle,
        duration: s.duration,
        isOnboarded: s.isOnboarded,
      };
      await safeStorage.setItem('user_store', JSON.stringify(cleanData));
    } catch (e) {
      console.warn('[UserStore] Failed to save user store:', e);
    }
  },
}));

// ============ PLACES STORE ============
export interface Place {
  id: string;
  name: string;
  nameHi?: string;
  nameGu?: string;
  latitude: number;
  longitude: number;
  category: string;
  imageUrl?: string;
  openingHours?: string;
  rating?: number;
  shortDescription?: string;
  distance?: number;
  heritageRecord?: {
    shortStory: string;
    period?: string;
  };
}

interface PlacesState {
  places: Place[];
  selectedPlace: Place | null;
  favorites: string[];
  isLoading: boolean;
  setPlaces: (places: Place[]) => void;
  setSelectedPlace: (place: Place | null) => void;
  toggleFavorite: (placeId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const usePlacesStore = create<PlacesState>((set, get) => ({
  places: [],
  selectedPlace: null,
  favorites: [],
  isLoading: false,

  setPlaces: (places) => set({ places }),
  setSelectedPlace: (selectedPlace) => set({ selectedPlace }),

  toggleFavorite: async (placeId) => {
    const { favorites } = get();
    const isFav = favorites.includes(placeId);
    const updated = isFav ? favorites.filter((id) => id !== placeId) : [...favorites, placeId];
    set({ favorites: updated });

    try {
      if (isFav) {
        await favoritesApi.removeFavorite(placeId);
      } else {
        await favoritesApi.addFavorite(placeId);
      }
      await safeStorage.setItem('user_favorites', JSON.stringify(updated));
    } catch (e) {
      // Keep local state on network error
    }
  },

  loadFavorites: async () => {
    try {
      const cached = await safeStorage.getItem('user_favorites');
      if (cached) {
        set({ favorites: JSON.parse(cached) });
      }
      const res: any = await favoritesApi.getFavorites();
      if (res.success && Array.isArray(res.data)) {
        const ids = res.data.map((p: any) => p.id || p.placeId);
        set({ favorites: ids });
        await safeStorage.setItem('user_favorites', JSON.stringify(ids));
      }
    } catch (e) {
      // Local cache used
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

// ============ CHAT STORE ============
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ name: string; url?: string; text: string }>;
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  contextPlaceId: string | null;
  contextPlaceName: string | null;
  mode: 'short' | 'detailed' | 'child' | 'narrative';
  isTyping: boolean;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setContext: (placeId: string | null, placeName: string | null) => void;
  setMode: (mode: 'short' | 'detailed' | 'child' | 'narrative') => void;
  setTyping: (typing: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  contextPlaceId: null,
  contextPlaceName: null,
  mode: 'short',
  isTyping: false,

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: `msg-${Date.now()}-${Math.random()}`, timestamp: Date.now() },
      ],
    })),

  setContext: (contextPlaceId, contextPlaceName) => set({ contextPlaceId, contextPlaceName }),
  setMode: (mode) => set({ mode }),
  setTyping: (isTyping) => set({ isTyping }),
  clearChat: () => set({ messages: [], contextPlaceId: null, contextPlaceName: null }),
}));

// ============ OFFLINE STORE ============
export interface OfflinePackage {
  packageId: string;
  version: string;
  downloadedAt: string;
  place: Place;
  heritage: any;
  artifacts: any[];
  offlineAudioGuide: {
    en: string;
    hi: string;
    gu: string;
  };
}

interface OfflineState {
  downloadedPackages: Record<string, OfflinePackage>;
  isOfflineMode: boolean;
  downloadPlace: (placeId: string) => Promise<boolean>;
  removeDownload: (placeId: string) => Promise<void>;
  isDownloaded: (placeId: string) => boolean;
  getPackage: (placeId: string) => OfflinePackage | null;
  setOfflineMode: (enabled: boolean) => void;
  loadFromStorage: () => Promise<void>;
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  downloadedPackages: {},
  isOfflineMode: false,

  downloadPlace: async (placeId: string) => {
    try {
      const res: any = await offlineApi.getPlacePackage(placeId);
      if (res.success && res.data) {
        const pkg: OfflinePackage = res.data;
        const current = { ...get().downloadedPackages, [placeId]: pkg };
        set({ downloadedPackages: current });
        await safeStorage.setItem('offline_packages', JSON.stringify(current));
        return true;
      }
      return false;
    } catch (e) {
      console.warn('[OfflineStore] Failed to download place for offline:', e);
      return false;
    }
  },

  removeDownload: async (placeId: string) => {
    const current = { ...get().downloadedPackages };
    delete current[placeId];
    set({ downloadedPackages: current });
    await safeStorage.setItem('offline_packages', JSON.stringify(current));
  },

  isDownloaded: (placeId: string) => {
    return !!get().downloadedPackages[placeId];
  },

  getPackage: (placeId: string) => {
    return get().downloadedPackages[placeId] || null;
  },

  setOfflineMode: (isOfflineMode) => set({ isOfflineMode }),

  loadFromStorage: async () => {
    try {
      const data = await safeStorage.getItem('offline_packages');
      if (data) {
        set({ downloadedPackages: JSON.parse(data) });
      }
    } catch (e) {
      console.warn('[OfflineStore] Failed to load offline packages:', e);
    }
  },
}));
