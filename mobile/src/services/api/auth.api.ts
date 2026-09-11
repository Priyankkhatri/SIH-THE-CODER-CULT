import apiClient from './client';

export const authApi = {
  createGuest: () => apiClient.post('/auth/guest'),
  register: (data: { name: string; email: string; password?: string; language?: string }) =>
    apiClient.post('/auth/register', data),
  login: (data: { email: string; password?: string }) =>
    apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
  savePreferences: (data: {
    userId: string;
    interests?: string[];
    travelStyle?: string;
    duration?: string;
    accessibility?: string[];
    language?: string;
  }) => apiClient.post('/auth/preferences', data),
};
