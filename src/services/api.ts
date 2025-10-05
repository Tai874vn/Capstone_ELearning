import axios from 'axios';
import { API_CONFIG } from '../configs/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'TokenCybersoft': API_CONFIG.TOKEN_CYBERSOFT,
    'Content-Type': 'application/json',
  }
});

// Log to verify token is present
if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_CONFIG.BASE_URL);
  console.log('TokenCybersoft present:', !!API_CONFIG.TOKEN_CYBERSOFT);
}

api.interceptors.request.use(
  (config) => {
    // Ensure TokenCybersoft is always present
    if (!config.headers['TokenCybersoft']) {
      config.headers['TokenCybersoft'] = API_CONFIG.TOKEN_CYBERSOFT;
    }

    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details for debugging
    console.log('API Request:', {
      url: config.url,
      hasTokenCybersoft: !!config.headers['TokenCybersoft'],
      hasAuthorization: !!config.headers.Authorization
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('USER_INFO');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;