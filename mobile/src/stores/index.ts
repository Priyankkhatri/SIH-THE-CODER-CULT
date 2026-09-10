import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============ USER STORE ============
interface UserState {
  userId: string | null;
  token: string | null;
  name: string;
  language: string;
  interests: string[];
  travelStyle: string;
  duration: string;
  isOnboarded: boolean;
  setUser: (userId: string, token: string, name?: string) => void;
  setLanguage: (lang: string) => void;
  setPreferences: (prefs: { interests?: string[]; travelStyle?: string; duration?: string }) => void;
  setOnboarded: (value: boolean) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  token: null,
  name: 'Tourist',
  language: 'en',
  interests: ['heritage'],
  travelStyle: 'moderate',
  duration: '90min',
  isOnboarded: false,

  setUser: (userId, token, name) => {
    set({ userId, token, name: name || 'Tourist' });
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

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem('user_store');
      if (data) {
        const parsed = JSON.parse(data);
        set(parsed);
      }
    } catch (e) {
      console.error('Failed to load user store:', e);
    }
  },

  saveToStorage: async () => {
    try {
      const { setUser, setLanguage, setPreferences, setOnboarded, loadFromStorage, saveToStorage, ...data } = get();
      await AsyncStorage.setItem('user_store', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save user store:', e);
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
  toggleFavorite: (placeId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const usePlacesStore = create<PlacesState>((set) => ({
  places: [],
  selectedPlace: null,
  favorites: [],
  isLoading: false,

  setPlaces: (places) => set({ places }),
  setSelectedPlace: (selectedPlace) => set({ selectedPlace }),
  toggleFavorite: (placeId) =>
    set((state) => ({
      favorites: state.favorites.includes(placeId)
        ? state.favorites.filter((id) => id !== placeId)
        : [...state.favorites, placeId],
    })),
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
  isTyping: boolean;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setContext: (placeId: string | null, placeName: string | null) => void;
  setTyping: (typing: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  contextPlaceId: null,
  contextPlaceName: null,
  isTyping: false,

  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...msg, id: `msg-${Date.now()}-${Math.random()}`, timestamp: Date.now() },
      ],
    })),

  setContext: (contextPlaceId, contextPlaceName) => set({ contextPlaceId, contextPlaceName }),
  setTyping: (isTyping) => set({ isTyping }),
  clearChat: () => set({ messages: [], contextPlaceId: null, contextPlaceName: null }),
}));
