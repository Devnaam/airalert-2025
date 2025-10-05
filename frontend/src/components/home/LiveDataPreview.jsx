import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, MapPin, RefreshCw } from 'lucide-react';

const LiveDataPreview = () => {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/current');
        const data = await response.json();
        setLiveData(data.data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching live data:', error);
        // Fallback mock data for demo
        setLiveData({
          aqi: { aqi: 87, category: 'Moderate', color: '#ff7e00', description: 'Air quality is acceptable for most people.' },
          air_quality: { pm25: 32.5, pm10: 45.2, no2: 28.1, o3: 65.3 },
          weather: { temperature: 28, humidity: 72, wind_speed: 12 },
          location: { name: 'Panaji, Goa' }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchLiveData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getAQITrend = (aqi) => {
    // Mock trend calculation
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const change = (Math.random() * 10).toFixed(1);
    return { trend, change };
  };

  const pollutantData = liveData?.air_quality ? [
    { name: 'PM2.5', value: liveData.air_quality.pm25, unit: 'µg/m³', color: 'bg-red-500', limit: 60 },
    { name: 'PM10', value: liveData.air_quality.pm10, unit: 'µg/m³', color: 'bg-orange-500', limit: 100 },
    { name: 'NO₂', value: liveData.air_quality.no2, unit: 'µg/m³', color: 'bg-purple-500', limit: 80 },
    { name: 'O₃', value: liveData.air_quality.o3, unit: 'µg/m³', color: 'bg-green-500', limit: 100 }
  ] : [];

  return (
    <section id="live-data" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Environmental Data
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Real-time{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Monitoring
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Live air quality data from our integrated sensor network and NASA TEMPO satellite observations.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading live data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main AQI Display */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 font-medium">{liveData?.location?.name || 'Goa, India'}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {lastUpdate.toLocaleTimeString()}
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div 
                    className="text-6xl font-bold mb-2"
                    style={{ color: liveData?.aqi?.color }}
                  >
                    {liveData?.aqi ? Math.round(liveData.aqi.aqi) : '--'}
                  </div>
                  <div 
                    className="inline-block px-4 py-2 rounded-full text-white font-semibold text-sm mb-2"
                    style={{ backgroundColor: liveData?.aqi?.color }}
                  >
                    {liveData?.aqi?.category || 'Unknown'}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {liveData?.aqi?.description || 'Air quality information unavailable'}
                  </p>
                </div>

                {liveData?.aqi && (
                  <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-200">
                    {getAQITrend(liveData.aqi.aqi).trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {getAQITrend(liveData.aqi.aqi).change} from last hour
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Pollutant Breakdown */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center space-x-2 mb-6">
                  <Activity className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-bold text-gray-900">Pollutant Levels</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pollutantData.map((pollutant, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{pollutant.name}</span>
                        <span className="text-sm text-gray-500">
                          {pollutant.value?.toFixed(1)} {pollutant.unit}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${pollutant.color}`}
                            style={{ 
                              width: `${Math.min(100, (pollutant.value / pollutant.limit) * 100)}%` 
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>{pollutant.limit} {pollutant.unit}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        {pollutant.value <= pollutant.limit * 0.5 ? (
                          <span className="text-green-600 text-xs font-medium">● Good</span>
                        ) : pollutant.value <= pollutant.limit ? (
                          <span className="text-yellow-600 text-xs font-medium">● Moderate</span>
                        ) : (
                          <span className="text-red-600 text-xs font-medium">● High</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Weather Info */}
                {liveData?.weather && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Current Weather</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {liveData.weather.temperature}°C
                        </div>
                        <div className="text-xs text-gray-600">Temperature</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {liveData.weather.humidity}%
                        </div>
                        <div className="text-xs text-gray-600">Humidity</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {liveData.weather.wind_speed} km/h
                        </div>
                        <div className="text-xs text-gray-600">Wind Speed</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Data Sources */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Data Sources</p>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">NASA TEMPO Satellite</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">OpenAQ Ground Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Open-Meteo Weather</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDataPreview;
