import React from 'react';
import { Cloud, Thermometer, Droplets, Wind } from 'lucide-react';
import { formatNumber, formatDateTime } from '../../utils/formatters';

const WeatherWidget = ({ weatherData, className = '' }) => {
  if (!weatherData) {
    return (
      <div className={`aqi-card ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Cloud className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">Weather</h3>
        </div>
        <div className="text-center text-gray-500">
          <p>Weather data unavailable</p>
        </div>
      </div>
    );
  }

  const {
    temperature,
    humidity,
    wind_speed,
    wind_direction,
    timestamp
  } = weatherData;

  const getWindDirection = (degrees) => {
    if (!degrees) return 'N/A';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className={`aqi-card ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Cloud className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-700">Current Weather</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Thermometer className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {formatNumber(temperature, 1)}°C
            </div>
            <div className="text-sm text-gray-500">Temperature</div>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Droplets className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {formatNumber(humidity, 0)}%
            </div>
            <div className="text-sm text-gray-500">Humidity</div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Wind className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {formatNumber(wind_speed, 1)} km/h
            </div>
            <div className="text-sm text-gray-500">Wind Speed</div>
          </div>
        </div>

        {/* Wind Direction */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <div 
              className="w-5 h-5 text-purple-600 font-bold text-xs flex items-center justify-center"
              style={{ transform: `rotate(${wind_direction || 0}deg)` }}
            >
              ↑
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {getWindDirection(wind_direction)}
            </div>
            <div className="text-sm text-gray-500">Direction</div>
          </div>
        </div>
      </div>

      {timestamp && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Updated: {formatDateTime(timestamp)}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
