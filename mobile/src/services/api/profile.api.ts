import apiClient from './client';

export const profileApi = {
  getProfile: (userId?: string) =>
    apiClient.get('/profile', { params: { userId } }),
  updateProfile: (data: { userId?: string; name?: string; language?: string }) =>
    apiClient.put('/profile', data),
  updatePreferences: (data: {
    userId?: string;
    interests?: string[];
    travelStyle?: string;
    duration?: string;
    accessibility?: string[];
    language?: string;
  }) => apiClient.put('/profile/preferences', data),
};
