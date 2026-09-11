import apiClient from './client';

export const aiApi = {
  ask: (question: string, placeId?: string, mode = 'short', language = 'en') =>
    apiClient.post('/ai/ask', { question, placeId, mode, language }),
  explain: (placeId: string, aspect?: string, language = 'en') =>
    apiClient.post('/ai/explain', { placeId, aspect, language }),
  story: (placeId: string, language = 'en') =>
    apiClient.post('/ai/story', { placeId, language }),
  getSuggestions: (placeId?: string) =>
    apiClient.post('/ai/suggest', { placeId }),
};
