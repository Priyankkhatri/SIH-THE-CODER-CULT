import apiClient from './client';

export const aiApi = {
  ask: (question: string, placeId?: string, mode = 'short', language = 'en') =>
    apiClient.post('/ai/ask', { question, placeId, mode, language }, { timeout: 45000 }),
  explain: (placeId: string, aspect?: string, language = 'en') =>
    apiClient.post('/ai/explain', { placeId, aspect, language }, { timeout: 45000 }),
  story: (placeId: string, language = 'en') =>
    apiClient.post('/ai/story', { placeId, language }, { timeout: 45000 }),
  getSuggestions: (placeId?: string) =>
    apiClient.post('/ai/suggest', { placeId }, { timeout: 15000 }),
};

