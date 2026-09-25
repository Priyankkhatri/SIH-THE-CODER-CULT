import apiClient from './client';

export const heritageApi = {
  getByPlaceId: (placeId: string, lang = 'en') =>
    apiClient.get(`/heritage/${placeId}`, { params: { lang } }),
  getSources: (placeId: string) =>
    apiClient.get(`/heritage/${placeId}/sources`),
};