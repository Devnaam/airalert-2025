import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

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
    api.get(`/api/location/${locationName}/current`),
  
  // Data validation
  getDataValidation: () => api.get('/api/data-validation'),
  
  // Utils
  calculateAQI: (pollutantData) => 
    api.post('/api/aqi/calculate', pollutantData),
  getApiDocs: () => api.get('/api/docs'),
  
  // Health check
  healthCheck: () => api.get('/'),
};

export default api;
