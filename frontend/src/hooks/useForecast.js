import { useState, useEffect } from 'react';
import { airQualityAPI } from '../services/api';

export const useForecast = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await airQualityAPI.getForecast();
        setForecast(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  return { forecast, loading, error };
};
