import axios from 'axios';
import { API_BASE_URL } from '../constants/theme';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  // Token can be added here from storage
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || { error: error.message };
  }
);

// ============ AUTH ============
export const authApi = {
  createGuest: () => api.post('/auth/guest'),
  savePreferences: (data: any) => api.post('/auth/preferences', data),
};

// ============ PLACES ============
export const placesApi = {
  getNearby: (lat: number, lng: number, radius = 50, category?: string, lang = 'en') =>
    api.get('/places/nearby', { params: { lat, lng, radius, category, lang } }),
  getById: (id: string) => api.get(`/places/${id}`),
  search: (query: string) => api.get('/places/search', { params: { q: query } }),
};

// ============ HERITAGE ============
export const heritageApi = {
  getByPlaceId: (placeId: string, lang = 'en') =>
    api.get(`/heritage/${placeId}`, { params: { lang } }),
  getSources: (placeId: string) => api.get(`/heritage/${placeId}/sources`),
};

// ============ AI GUIDE ============
export const aiApi = {
  ask: (question: string, placeId?: string, mode = 'short', language = 'en') =>
    api.post('/ai/ask', { question, placeId, mode, language }),
  getSuggestions: (placeId?: string) =>
    api.post('/ai/suggest', { placeId }),
};

// ============ VISION ============
export const visionApi = {
  identify: (latitude: number, longitude: number, labels: string[]) =>
    api.post('/vision/identify', { latitude, longitude, labels }),
  getCatalog: () => api.get('/vision/catalog'),
};

// ============ ITINERARY ============
export const itineraryApi = {
  generate: (data: { latitude: number; longitude: number; interests: string[]; duration: string; travelStyle?: string }) =>
    api.post('/itinerary/generate', data),
  save: (data: any) => api.post('/itinerary/save', data),
  getUserItineraries: (userId: string) => api.get(`/itinerary/user/${userId}`),
};

// ============ TRANSLATE ============
export const translateApi = {
  translate: (text: string, targetLanguage: string) =>
    api.post('/translate', { text, targetLanguage }),
  getTtsConfig: (text: string, language: string) =>
    api.post('/translate/tts', { text, language }),
  getLanguages: () => api.get('/translate/languages'),
};

export default api;
