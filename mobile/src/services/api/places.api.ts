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
  getReviews: (id: string) => apiClient.get(`/places/${id}/reviews`),
  addReview: (id: string, data: { userName?: string; rating: number; title?: string; comment: string; visitType?: string; badge?: string }) =>
    apiClient.post(`/places/${id}/reviews`, data),
  getGoogleDetails: (id: string) => apiClient.get(`/places/${id}/google-details`),
  getNearbyAmenities: (id: string, type = 'food') =>
    apiClient.get(`/places/${id}/nearby-amenities`, { params: { type } }),
};
