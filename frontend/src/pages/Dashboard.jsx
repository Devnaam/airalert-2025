import React from 'react';
import { useAirQualityContext } from '../context/AirQualityContext';
import AQICard from '../components/ui/AQICard';
import AlertBanner from '../components/ui/AlertBanner';
import WeatherWidget from '../components/widgets/WeatherWidget';
import HealthRecommendations from '../components/widgets/HealthRecommendations';
import ForecastChart from '../components/charts/ForecastChart';
import AQIMap from '../components/maps/AQIMap';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading dashboard data..." />
      </div>
    );
  }

  if (error && !currentData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load data</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Air Quality Dashboard</h1>
            <p className="text-blue-100">
              Real-time air quality monitoring for {selectedLocation} powered by NASA TEMPO satellite data
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
        <AlertBanner alerts={alerts} className="mb-6" />
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current AQI & Weather */}
        <div className="space-y-6">
          <AQICard data={currentData} className="h-fit" />
          <WeatherWidget weatherData={currentData?.weather} className="h-fit" />
        </div>

        {/* Middle Column - Health Recommendations */}
        <div>
          <HealthRecommendations userGroup={userGroup} className="h-fit" />
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aqi-card p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentData?.sources?.satellite === 'TEMPO_MOCK' ? '✅' : '📡'}
              </div>
              <div className="text-sm text-gray-600 mt-2">Satellite Data</div>
              <div className="text-xs text-gray-500">NASA TEMPO</div>
            </div>
            
            <div className="aqi-card p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentData?.sources?.ground === 'OpenAQ_MOCK' ? '✅' : '🌐'}
              </div>
              <div className="text-sm text-gray-600 mt-2">Ground Sensors</div>
              <div className="text-xs text-gray-500">OpenAQ Network</div>
            </div>

            <div className="aqi-card p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {forecast?.forecasts?.length || 0}
              </div>
              <div className="text-sm text-gray-600 mt-2">Forecast Points</div>
              <div className="text-xs text-gray-500">Next 24h</div>
            </div>

            <div className="aqi-card p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {currentData?.validation?.confidence_score ? 
                  Math.round(currentData.validation.confidence_score * 100) : '--'}%
              </div>
              <div className="text-sm text-gray-600 mt-2">Data Quality</div>
              <div className="text-xs text-gray-500">Confidence</div>
            </div>
          </div>

          {/* Current Pollutant Levels */}
          {currentData?.air_quality && (
            <div className="aqi-card">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Pollutant Levels</h3>
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
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 24-Hour Forecast Chart */}
        <ForecastChart forecastData={forecast} className="col-span-1" />
        
        {/* Interactive Map */}
        <AQIMap selectedLocation={selectedLocation} className="col-span-1" />
      </div>

      {/* Data Sources Footer */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>NASA TEMPO Satellite</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>OpenAQ Ground Network</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Open-Meteo Weather</span>
            </div>
          </div>
          <div>
            <span className="font-medium">NASA Space Apps Challenge 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
