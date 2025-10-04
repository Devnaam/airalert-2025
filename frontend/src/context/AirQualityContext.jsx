import React, { createContext, useContext, useState, useEffect } from 'react';
import { airQualityAPI } from '../services/api';
import { toast } from 'react-toastify';

const AirQualityContext = createContext();

export const useAirQualityContext = () => {
  const context = useContext(AirQualityContext);
  if (!context) {
    throw new Error('useAirQualityContext must be used within AirQualityProvider');
  }
  return context;
};

export const AirQualityProvider = ({ children }) => {
  const [currentData, setCurrentData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Goa');
  const [userGroup, setUserGroup] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current air quality data
  const fetchCurrentData = async () => {
    try {
      setLoading(true);
      const response = await airQualityAPI.getCurrentData();
      setCurrentData(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch current air quality data');
      toast.error('Failed to load air quality data');
      console.error('Error fetching current data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch forecast data
  const fetchForecast = async () => {
    try {
      const response = await airQualityAPI.getForecast();
      setForecast(response.data.data);
    } catch (err) {
      toast.error('Failed to load forecast data');
      console.error('Error fetching forecast:', err);
    }
  };

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const [alertsResponse, emergencyResponse] = await Promise.all([
        airQualityAPI.getAlerts(),
        airQualityAPI.getEmergencyAlerts()
      ]);
      
      const allAlerts = [
        ...alertsResponse.data.data.alerts,
        ...emergencyResponse.data.data.emergency_alerts
      ];
      
      setAlerts(allAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    await Promise.all([
      fetchCurrentData(),
      fetchForecast(),
      fetchAlerts()
    ]);
  };

  // Initial data load
  useEffect(() => {
    refreshData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(refreshData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [selectedLocation]);

  const value = {
    // State
    currentData,
    forecast,
    alerts,
    selectedLocation,
    userGroup,
    loading,
    error,
    
    // Actions
    setSelectedLocation,
    setUserGroup,
    refreshData,
    fetchCurrentData,
    fetchForecast,
    fetchAlerts,
  };

  return (
    <AirQualityContext.Provider value={value}>
      {children}
    </AirQualityContext.Provider>
  );
};
