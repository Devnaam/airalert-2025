import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for slower networks
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    
    // Log API calls in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Success: ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Retry logic for network errors
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      if (!originalRequest._retry && originalRequest._retryCount < 2) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        
        console.log(`🔄 Retrying API call: ${originalRequest.url} (Attempt ${originalRequest._retryCount})`);
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount));
        
        return api(originalRequest);
      }
    }

    // Return user-friendly error messages
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message ||
                        'An unexpected error occurred';

    error.userMessage = errorMessage;
    return Promise.reject(error);
  }
);

// Helper function for handling API calls with loading states
const apiCall = async (apiFunction, errorContext = '') => {
  try {
    const response = await apiFunction();
    return {
      success: true,
      data: response.data,
      error: null
    };
  } catch (error) {
    console.error(`${errorContext} Error:`, error);
    return {
      success: false,
      data: null,
      error: error.userMessage || error.message
    };
  }
};

export const airQualityAPI = {
  // Core endpoints
  getCurrentData: () => api.get('/api/current'),
  getForecast: () => api.get('/api/forecast'),
  getTrends: (days = 7) => api.get(`/api/trends?days=${days}`),
  
  // Health & Recommendations
  getHealthRecommendations: (group = 'general') => 
    api.get(`/api/health-recommendations?group=${group}`),
  getPollutantBreakdown: () => api.get('/api/pollutant-breakdown'),
  
  // Alerts
  getAlerts: () => api.get('/api/alerts'),
  getEmergencyAlerts: () => api.get('/api/emergency-alerts'),
  subscribeToAlerts: (preferences) => 
    api.post('/api/alerts/subscribe', preferences),
  
  // Locations
  getLocations: () => api.get('/api/locations'),
  getLocationData: (locationName) => 
    api.get(`/api/location/${encodeURIComponent(locationName)}/current`),
  
  // Data validation
  getDataValidation: () => api.get('/api/data-validation'),
  
  // Utils
  calculateAQI: (pollutantData) => 
    api.post('/api/aqi/calculate', pollutantData),
  getApiDocs: () => api.get('/api/docs'),
  
  // Health check
  healthCheck: () => api.get('/'),

  // Enhanced API methods with better error handling
  safeGetCurrentData: () => apiCall(() => api.get('/api/current'), 'Current Data'),
  safeGetForecast: () => apiCall(() => api.get('/api/forecast'), 'Forecast'),
  safeGetTrends: (days = 7) => apiCall(() => api.get(`/api/trends?days=${days}`), 'Trends'),
  safeHealthCheck: () => apiCall(() => api.get('/'), 'Health Check'),
};

// Utility functions for common API patterns
export const apiUtils = {
  // Check if backend is available
  isBackendAvailable: async () => {
    try {
      const response = await api.get('/', { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  },

  // Get API status
  getApiStatus: async () => {
    try {
      const response = await api.get('/');
      return {
        online: true,
        data: response.data
      };
    } catch (error) {
      return {
        online: false,
        error: error.userMessage || 'Backend unavailable'
      };
    }
  },

  // Format API error for user display
  formatError: (error) => {
    if (error.code === 'ERR_NETWORK') {
      return 'Network error - please check your connection and ensure the backend is running.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out - the server may be slow or unavailable.';
    }
    if (error.response?.status === 404) {
      return 'API endpoint not found - please check the backend configuration.';
    }
    if (error.response?.status === 500) {
      return 'Server error - please try again later.';
    }
    return error.userMessage || error.message || 'An unexpected error occurred.';
  }
};

export default api;
