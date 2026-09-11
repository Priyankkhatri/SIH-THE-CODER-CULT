import apiClient from './client';

export const translateApi = {
  translate: (text: string, targetLanguage: string) =>
    apiClient.post('/translate', { text, targetLanguage }),
  getTtsConfig: (text: string, language: string) =>
    apiClient.post('/translate/tts', { text, language }),
  getLanguages: () => apiClient.get('/languages'),
};
