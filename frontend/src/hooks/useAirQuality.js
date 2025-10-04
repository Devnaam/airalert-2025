import { useState, useEffect } from 'react';
import { airQualityAPI } from '../services/api';

export const useAirQuality = (location = 'Goa') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = location === 'Goa' 
          ? await airQualityAPI.getCurrentData()
          : await airQualityAPI.getLocationData(location);
          
        setData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  return { data, loading, error, refetch: () => fetchData() };
};
