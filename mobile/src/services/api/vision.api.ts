import apiClient from './client';

export const visionApi = {
  identify: (data: {
    latitude?: number;
    longitude?: number;
    labels?: string[];
    image?: string;
    placeId?: string;
  }) => apiClient.post('/vision/identify', data),
  getCatalog: () => apiClient.get('/vision/catalog'),
};
