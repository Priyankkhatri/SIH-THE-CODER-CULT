import axios, { AxiosInstance } from 'axios';
import { safeStorage } from '../../utils/safeStorage';
import { API_BASE_URL } from '../../constants/theme';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('[API Client] Connected to:', `${API_BASE_URL}/api/v1`);


// Request interceptor: Attach JWT token if available
apiClient.interceptors.request.use(async (config) => {
  try {
    const raw = await safeStorage.getItem('user_store');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }

  } catch (err) {
    // Non-critical token retrieval failure
  }
  return config;
});

// Response interceptor: Extract data payload or throw clean error
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorData = error.response?.data || {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Unable to connect to server',
      },
    };
    return Promise.reject(errorData);
  }
);

export default apiClient;
