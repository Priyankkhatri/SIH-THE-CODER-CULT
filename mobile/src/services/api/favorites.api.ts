import apiClient from './client';

export const favoritesApi = {
  getFavorites: (userId?: string) =>
    apiClient.get('/favorites', { params: { userId } }),
  addFavorite: (placeId: string, userId?: string) =>
    apiClient.post('/favorites', { placeId, userId }),
  removeFavorite: (placeId: string, userId?: string) =>
    apiClient.delete(`/favorites/${placeId}`, { params: { userId } }),
};
