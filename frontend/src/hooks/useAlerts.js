import { useState, useEffect } from 'react';
import { airQualityAPI } from '../services/api';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [alertsResponse, emergencyResponse] = await Promise.all([
        airQualityAPI.getAlerts(),
        airQualityAPI.getEmergencyAlerts()
      ]);
      
      setAlerts(alertsResponse.data.data.alerts || []);
      setEmergencyAlerts(emergencyResponse.data.data.emergency_alerts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToAlerts = async (preferences) => {
    try {
      await airQualityAPI.subscribeToAlerts(preferences);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    // Refresh alerts every 2 minutes
    const interval = setInterval(fetchAlerts, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { 
    alerts, 
    emergencyAlerts, 
    loading, 
    error, 
    refetch: fetchAlerts,
    subscribeToAlerts 
  };
};
