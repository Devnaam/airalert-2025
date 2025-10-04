import { format, parseISO } from 'date-fns';

// AQI category helpers
export const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#00e400';
  if (aqi <= 100) return '#ffff00';
  if (aqi <= 200) return '#ff7e00';
  if (aqi <= 300) return '#ff0000';
  if (aqi <= 400) return '#8f3f97';
  return '#7e0023';
};

export const getAQICategory = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
};

export const getAQICSSClass = (category) => {
  const categoryMap = {
    'Good': 'aqi-good',
    'Satisfactory': 'aqi-satisfactory', 
    'Moderate': 'aqi-moderate',
    'Poor': 'aqi-poor',
    'Very Poor': 'aqi-very-poor',
    'Severe': 'aqi-severe'
  };
  return categoryMap[category] || 'aqi-good';
};

// Date formatting
export const formatDateTime = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
};

export const formatTime = (dateString) => {
  try {
    return format(parseISO(dateString), 'HH:mm');
  } catch {
    return 'Invalid time';
  }
};

export const formatDate = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
};

// Number formatting
export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined) return 'N/A';
  return Number(num).toFixed(decimals);
};

// Health recommendation helpers
export const getHealthIcon = (recommendation) => {
  const iconMap = {
    'Safe': '✅',
    'Limited': '⚠️',
    'Avoid': '❌',
    'Normal': '✅',
    'Indoor only': '🏠',
    'Reduce intensity': '⚠️'
  };
  return iconMap[recommendation] || '❓';
};

// Pollutant unit helpers
export const getPollutantUnit = (pollutant) => {
  const unitMap = {
    'pm25': 'µg/m³',
    'pm10': 'µg/m³',
    'no2': 'µg/m³',
    'o3': 'µg/m³',
    'so2': 'µg/m³',
    'co': 'mg/m³'
  };
  return unitMap[pollutant] || 'µg/m³';
};

export const getPollutantName = (pollutant) => {
  const nameMap = {
    'pm25': 'PM2.5',
    'pm10': 'PM10',
    'no2': 'NO₂',
    'o3': 'O₃',
    'so2': 'SO₂',
    'co': 'CO'
  };
  return nameMap[pollutant] || pollutant.toUpperCase();
};

// Location helpers - THIS WAS MISSING!
export const getLocationIcon = (type) => {
  const iconMap = {
    'capital': '🏛️',
    'city': '🏙️',
    'town': '🏘️',
    'port': '⚓',
    'region': '📍'
  };
  return iconMap[type] || '📍';
};
