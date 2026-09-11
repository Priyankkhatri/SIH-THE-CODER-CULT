import apiClient from './client';

export const itineraryApi = {
  generate: (data: {
    latitude?: number;
    longitude?: number;
    interests?: string[];
    duration?: string;
    travelStyle?: string;
    startingPlaceId?: string;
  }) => apiClient.post('/itineraries/generate', data),
  save: (data: {
    userId?: string;
    title?: string;
    duration?: string;
    totalTime?: number;
    items: Array<any>;
  }) => apiClient.post('/itineraries', data),
  getUserItineraries: (userId?: string) =>
    apiClient.get('/itineraries', { params: { userId } }),
  getById: (id: string) => apiClient.get(`/itineraries/${id}`),
  delete: (id: string) => apiClient.delete(`/itineraries/${id}`),
};
