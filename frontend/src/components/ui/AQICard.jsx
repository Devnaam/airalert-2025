import React from 'react';
import { getAQIColor, getAQICategory, formatNumber, formatDateTime } from '../../utils/formatters';

const AQICard = ({ data, className = '' }) => {
  if (!data || !data.aqi) {
    return (
      <div className={`aqi-card ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 text-2xl mb-2">--</div>
          <div className="text-gray-500 text-sm">No data available</div>
        </div>
      </div>
    );
  }

  const { aqi, category, description, color } = data.aqi;
  const aqiColor = color || getAQIColor(aqi);
  const aqiCategory = category || getAQICategory(aqi);

  return (
    <div 
      className={`aqi-card ${className} border-l-4`}
      style={{ borderLeftColor: aqiColor }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Air Quality Index</h3>
          <p className="text-sm text-gray-500">
            {data.location?.name || 'Goa, India'}
          </p>
        </div>
        <div className="text-right">
          <div 
            className="text-3xl font-bold mb-1"
            style={{ color: aqiColor }}
          >
            {formatNumber(aqi, 0)}
          </div>
          <div 
            className="text-sm font-medium px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: aqiColor }}
          >
            {aqiCategory}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {data.air_quality && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          {data.air_quality.pm25 && (
            <div>
              <span className="text-gray-500">PM2.5:</span>
              <span className="font-medium ml-1">{formatNumber(data.air_quality.pm25)} µg/m³</span>
            </div>
          )}
          {data.air_quality.pm10 && (
            <div>
              <span className="text-gray-500">PM10:</span>
              <span className="font-medium ml-1">{formatNumber(data.air_quality.pm10)} µg/m³</span>
            </div>
          )}
          {data.air_quality.no2 && (
            <div>
              <span className="text-gray-500">NO₂:</span>
              <span className="font-medium ml-1">{formatNumber(data.air_quality.no2)} µg/m³</span>
            </div>
          )}
          {data.air_quality.o3 && (
            <div>
              <span className="text-gray-500">O₃:</span>
              <span className="font-medium ml-1">{formatNumber(data.air_quality.o3)} µg/m³</span>
            </div>
          )}
        </div>
      )}

      {data.timestamp && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Last updated: {formatDateTime(data.timestamp)}
          </p>
        </div>
      )}
    </div>
  );
};

export default AQICard;
