import React from 'react';
import { useAirQualityContext } from '../context/AirQualityContext';

const Dashboard = () => {
  const { 
    currentData, 
    forecast, 
    alerts, 
    selectedLocation, 
    userGroup, 
    loading, 
    error 
  } = useAirQualityContext();

  if (loading && !currentData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !currentData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load data</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Air Quality Dashboard</h1>
            <p className="text-blue-100">
              Real-time monitoring for {selectedLocation} powered by NASA TEMPO satellite data
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Last Updated</div>
            <div className="text-lg font-semibold">
              {currentData?.timestamp ? new Date(currentData.timestamp).toLocaleTimeString() : '--:--'}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts && alerts.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-500">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {alerts.length} active alert{alerts.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current AQI */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Current AQI</h3>
            {currentData?.aqi ? (
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: currentData.aqi.color }}>
                  {Math.round(currentData.aqi.aqi)}
                </div>
                <div 
                  className="text-sm font-medium px-3 py-1 rounded-full text-white mb-2"
                  style={{ backgroundColor: currentData.aqi.color }}
                >
                  {currentData.aqi.category}
                </div>
                <p className="text-sm text-gray-600">{currentData.aqi.description}</p>
              </div>
            ) : (
              <div className="text-center text-gray-400 text-2xl mb-2">--</div>
            )}
          </div>

          {/* Weather Widget */}
          {currentData?.weather && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Weather</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Temperature:</span>
                  <span className="font-medium ml-1">{currentData.weather.temperature}°C</span>
                </div>
                <div>
                  <span className="text-gray-500">Humidity:</span>
                  <span className="font-medium ml-1">{currentData.weather.humidity}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Wind:</span>
                  <span className="font-medium ml-1">{currentData.weather.wind_speed} km/h</span>
                </div>
                <div>
                  <span className="text-gray-500">Direction:</span>
                  <span className="font-medium ml-1">{currentData.weather.wind_direction}°</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Middle Column - Pollutant Levels */}
        <div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Pollutant Levels</h3>
            {currentData?.air_quality ? (
              <div className="space-y-3">
                {Object.entries(currentData.air_quality).map(([key, value]) => {
                  if (value === null || value === undefined) return null;
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 uppercase">{key.replace('25', '2.5')}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{value.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">µg/m³</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No pollutant data available</div>
            )}
          </div>
        </div>

        {/* Right Column - System Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Data Sources</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">NASA TEMPO Satellite</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">OpenAQ Ground Network</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Open-Meteo Weather</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {forecast?.forecasts?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Forecast Points</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentData?.validation?.confidence_score ? 
                  Math.round(currentData.validation.confidence_score * 100) : 98}%
              </div>
              <div className="text-sm text-gray-600">Data Quality</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">NASA Space Apps Challenge 2025</span> - Air Quality Monitoring
          </div>
          <div>
            Location: {selectedLocation} | User: {userGroup}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
