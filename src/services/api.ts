import axios from 'axios';
import { API_CONFIG } from '../configs/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
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
    // Set TokenCybersoft header
    config.headers.set('TokenCybersoft', API_CONFIG.TOKEN_CYBERSOFT);

    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // Log request details for debugging
    console.log('API Request:', {
      url: config.url,
      baseURL: config.baseURL,
      TokenCybersoft: config.headers.get('TokenCybersoft'),
      hasAuthorization: !!config.headers.get('Authorization')
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