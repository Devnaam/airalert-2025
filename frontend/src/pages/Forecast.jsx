import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Clock, Target } from 'lucide-react';
import { airQualityAPI } from '../services/api';
import { useAirQualityContext } from '../context/AirQualityContext';
import ForecastChart from '../components/charts/ForecastChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDateTime, getAQIColor, getAQICategory } from '../utils/formatters';

const Forecast = () => {
  const { selectedLocation } = useAirQualityContext();
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const response = await airQualityAPI.getForecast();
        setForecast(response.data.data);
      } catch (error) {
        console.error('Error fetching forecast:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [selectedLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading forecast data..." />
      </div>
    );
  }

  const forecasts = forecast?.forecasts || [];
  const filteredForecasts = selectedTimeframe === '12h' ? forecasts.slice(0, 12) : forecasts;

  // Calculate forecast statistics
  const avgAQI = forecasts.reduce((sum, f) => sum + (f.aqi?.aqi || 0), 0) / forecasts.length;
  const maxAQI = Math.max(...forecasts.map(f => f.aqi?.aqi || 0));
  const minAQI = Math.min(...forecasts.map(f => f.aqi?.aqi || 0));
  const peakHour = forecasts.find(f => (f.aqi?.aqi || 0) === maxAQI);
  const bestHour = forecasts.find(f => (f.aqi?.aqi || 0) === minAQI);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Air Quality Forecast</h1>
            <p className="text-purple-100">
              24-hour air quality predictions for {selectedLocation} using machine learning
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="font-semibold">ML Model Accuracy</span>
            </div>
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-purple-100">Random Forest</div>
          </div>
        </div>
      </div>

      {/* Forecast Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Forecast Period:</span>
          </div>
          <div className="flex space-x-2">
            {['12h', '24h'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === period
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Next {period}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Generated: {forecast?.generated_at ? formatDateTime(forecast.generated_at) : '--'}
        </div>
      </div>

      {/* Forecast Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="aqi-card p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: getAQIColor(avgAQI) }}>
            {Math.round(avgAQI)}
          </div>
          <div className="text-sm text-gray-600">Average AQI</div>
          <div className="text-xs text-gray-500 mt-1">{getAQICategory(avgAQI)}</div>
        </div>

        <div className="aqi-card p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: getAQIColor(maxAQI) }}>
            {Math.round(maxAQI)}
          </div>
          <div className="text-sm text-gray-600">Peak AQI</div>
          <div className="text-xs text-gray-500 mt-1">
            {peakHour ? new Date(peakHour.datetime).getHours().toString().padStart(2, '0') + ':00' : '--'}
          </div>
        </div>

        <div className="aqi-card p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: getAQIColor(minAQI) }}>
            {Math.round(minAQI)}
          </div>
          <div className="text-sm text-gray-600">Best AQI</div>
          <div className="text-xs text-gray-500 mt-1">
            {bestHour ? new Date(bestHour.datetime).getHours().toString().padStart(2, '0') + ':00' : '--'}
          </div>
        </div>

        <div className="aqi-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {Math.round((forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Avg Confidence</div>
          <div className="text-xs text-gray-500 mt-1">Model Accuracy</div>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <ForecastChart 
        forecastData={{ forecasts: filteredForecasts, generated_at: forecast?.generated_at }} 
        className="col-span-2" 
      />

      {/* Hourly Forecast Table */}
      <div className="aqi-card">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-700">Hourly Breakdown</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">Time</th>
                <th className="text-center py-3 px-2">AQI</th>
                <th className="text-center py-3 px-2">Category</th>
                <th className="text-center py-3 px-2">PM2.5</th>
                <th className="text-center py-3 px-2">PM10</th>
                <th className="text-center py-3 px-2">NO₂</th>
                <th className="text-center py-3 px-2">O₃</th>
                <th className="text-center py-3 px-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {filteredForecasts.map((forecast, index) => {
                const aqi = forecast.aqi?.aqi || 0;
                const category = forecast.aqi?.category || getAQICategory(aqi);
                const color = getAQIColor(aqi);

                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">
                      {new Date(forecast.datetime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="font-bold" style={{ color }}>
                        {Math.round(aqi)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: color }}
                      >
                        {category}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">{forecast.pm25.toFixed(1)}</td>
                    <td className="py-3 px-2 text-center">{forecast.pm10.toFixed(1)}</td>
                    <td className="py-3 px-2 text-center">{forecast.no2.toFixed(1)}</td>
                    <td className="py-3 px-2 text-center">{forecast.o3.toFixed(1)}</td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${forecast.confidence * 100}%` }}
                          />
                        </div>
                        <span className="ml-2 text-xs font-medium">
                          {Math.round(forecast.confidence * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Machine Learning Forecast Model</h4>
            <p className="text-blue-700 text-sm mt-1">
              Predictions generated using Random Forest algorithm trained on historical air quality patterns, 
              weather conditions, and temporal factors. Model accuracy decreases with longer forecast horizons.
            </p>
            <div className="mt-2 text-xs text-blue-600">
              <span className="font-medium">Features:</span> Current pollutant levels, weather data, hour of day, day of week, seasonal patterns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
