import axios from 'axios';

// Get API URL from environment variable with fallback
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log the API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', BASE_URL);
  console.log('🌍 Environment:', import.meta.env.MODE);
}

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000, // Increased timeout for deployment
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
    
    // Log API calls in development only
    if (import.meta.env.DEV) {
      console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development only
    if (import.meta.env.DEV) {
      console.log(`✅ API Success: ${response.config.url}`, response.data?.status || 'OK');
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Enhanced error logging
    console.error('❌ API Error:', {
      url: `${originalRequest?.baseURL}${originalRequest?.url}`,
      method: originalRequest?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code,
      data: error.response?.data,
      isNetworkError: !error.response,
      baseURL: BASE_URL
    });

    // Retry logic for network errors and timeouts
    if ((error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) && 
        !originalRequest._retry && 
        (originalRequest._retryCount || 0) < 3) {
      
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      const retryDelay = Math.min(1000 * Math.pow(2, originalRequest._retryCount - 1), 5000);
      
      console.log(`🔄 Retrying API call: ${originalRequest.url} (Attempt ${originalRequest._retryCount}/3) - Waiting ${retryDelay}ms`);
      
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      return api(originalRequest);
    }

    // Return user-friendly error messages
    let errorMessage;
    
    if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network connection failed. Please check your internet connection and try again.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. The server may be temporarily unavailable.';
    } else if (error.response?.status === 404) {
      errorMessage = 'API endpoint not found. Please try refreshing the page.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error occurred. Please try again in a few moments.';
    } else if (error.response?.status >= 400 && error.response?.status < 500) {
      errorMessage = error.response?.data?.message || 'Client error occurred.';
    } else {
      errorMessage = error.response?.data?.message || 
                    error.response?.data?.error ||
                    error.message ||
                    'An unexpected error occurred. Please try again.';
    }

    error.userMessage = errorMessage;
    error.isRetryExhausted = (originalRequest._retryCount || 0) >= 3;
    
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
      error: null,
      status: response.status
    };
  } catch (error) {
    console.error(`❌ ${errorContext} Error:`, error.userMessage || error.message);
    return {
      success: false,
      data: null,
      error: error.userMessage || error.message,
      isNetworkError: !error.response,
      status: error.response?.status,
      isRetryExhausted: error.isRetryExhausted
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
  trainModel: () => api.post('/api/train-model'),
  
  // Health check
  healthCheck: () => api.get('/'),
  deploymentHealthCheck: () => api.get('/health'),

  // Enhanced API methods with better error handling
  safeGetCurrentData: () => apiCall(() => api.get('/api/current'), 'Current Data'),
  safeGetForecast: () => apiCall(() => api.get('/api/forecast'), 'Forecast'),
  safeGetTrends: (days = 7) => apiCall(() => api.get(`/api/trends?days=${days}`), 'Trends'),
  safeHealthCheck: () => apiCall(() => api.get('/'), 'Health Check'),
  safeGetLocations: () => apiCall(() => api.get('/api/locations'), 'Locations'),
  safeGetAlerts: () => apiCall(() => api.get('/api/alerts'), 'Alerts'),
};

// Utility functions for common API patterns
export const apiUtils = {
  // Get current base URL
  getBaseUrl: () => BASE_URL,
  
  // Check if backend is available with comprehensive testing
  isBackendAvailable: async () => {
    try {
      // Try health check endpoint first (faster)
      const response = await api.get('/health', { timeout: 8000 });
      return response.status === 200;
    } catch {
      try {
        // Fallback to main endpoint
        const response = await api.get('/', { timeout: 8000 });
        return response.status === 200;
      } catch {
        return false;
      }
    }
  },

  // Get comprehensive API status
  getApiStatus: async () => {
    try {
      const startTime = Date.now();
      const response = await api.get('/');
      const responseTime = Date.now() - startTime;
      
      return {
        online: true,
        responseTime,
        data: response.data,
        environment: import.meta.env.MODE,
        baseUrl: BASE_URL,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        online: false,
        error: error.userMessage || 'Backend unavailable',
        environment: import.meta.env.MODE,
        baseUrl: BASE_URL,
        timestamp: new Date().toISOString(),
        errorCode: error.code,
        isNetworkError: !error.response
      };
    }
  },

  // Test all critical endpoints
  runHealthCheck: async () => {
    const endpoints = [
      { name: 'Health Check', call: () => api.get('/') },
      { name: 'Current Data', call: () => api.get('/api/current') },
      { name: 'Locations', call: () => api.get('/api/locations') },
      { name: 'API Docs', call: () => api.get('/api/docs') }
    ];

    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        try {
          const startTime = Date.now();
          const response = await endpoint.call();
          const responseTime = Date.now() - startTime;
          
          return {
            name: endpoint.name,
            status: 'success',
            responseTime,
            httpStatus: response.status
          };
        } catch (error) {
          return {
            name: endpoint.name,
            status: 'failed',
            error: error.userMessage || error.message,
            httpStatus: error.response?.status
          };
        }
      })
    );

    return results.map((result, index) => ({
      ...endpoints[index],
      ...result.value
    }));
  },

  // Format API error for user display with more context
  formatError: (error) => {
    if (error.code === 'ERR_NETWORK') {
      if (BASE_URL.includes('localhost')) {
        return 'Cannot connect to local server. Please ensure the backend is running on the correct port.';
      } else {
        return 'Network error - please check your internet connection and try again.';
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out - the server may be temporarily overloaded. Please try again.';
    }
    
    if (error.response?.status === 404) {
      return 'The requested resource was not found. Please try refreshing the page.';
    }
    
    if (error.response?.status === 500) {
      return 'Server error occurred. Our team has been notified. Please try again in a few moments.';
    }
    
    if (error.response?.status === 503) {
      return 'Service temporarily unavailable. Please try again in a few minutes.';
    }
    
    if (error.response?.status >= 400 && error.response?.status < 500) {
      return error.response?.data?.message || 'Request failed. Please check your input and try again.';
    }
    
    return error.userMessage || error.message || 'An unexpected error occurred. Please try refreshing the page.';
  },

  // Development utilities
  ...(import.meta.env.DEV && {
    // Only available in development
    testAllEndpoints: async () => {
      console.log('🧪 Testing all API endpoints...');
      const results = await apiUtils.runHealthCheck();
      console.table(results);
      return results;
    },
    
    logApiConfig: () => {
      console.log('⚙️ API Configuration:', {
        baseURL: BASE_URL,
        timeout: 20000,
        environment: import.meta.env.MODE,
        dev: import.meta.env.DEV,
        prod: import.meta.env.PROD
      });
    }
  })
};

// Global error handler for unhandled API errors
if (import.meta.env.DEV) {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.config?.baseURL === BASE_URL) {
      console.error('🚨 Unhandled API Error:', event.reason);
    }
  });
}

export default api;
