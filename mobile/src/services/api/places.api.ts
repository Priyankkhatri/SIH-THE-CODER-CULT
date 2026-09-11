import apiClient from './client';

export const placesApi = {
  getAll: (category?: string, lang = 'en') =>
    apiClient.get('/places', { params: { category, lang } }),
  getNearby: (lat: number, lng: number, radius = 50, category?: string, lang = 'en') =>
    apiClient.get('/places/nearby', { params: { lat, lng, radius, category, lang } }),
  getById: (id: string) => apiClient.get(`/places/${id}`),
  search: (query: string) => apiClient.get('/places/search', { params: { q: query } }),
  getRecommendations: (id: string) => apiClient.get(`/places/${id}/recommendations`),
  getCategories: () => apiClient.get('/places/categories/list'),
};
