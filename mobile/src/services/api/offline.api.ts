import apiClient from './client';

export const offlineApi = {
  getPlacePackage: (placeId: string) =>
    apiClient.get(`/offline/${placeId}`),
};
