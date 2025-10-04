import React, { useState, useEffect } from 'react';
import { BarChart3, AlertCircle } from 'lucide-react';
import { airQualityAPI } from '../../services/api';
import { getPollutantName, formatNumber, getAQIColor } from '../../utils/formatters';
import LoadingSpinner from '../ui/LoadingSpinner';

const PollutantBreakdown = ({ className = '' }) => {
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreakdown = async () => {
      try {
        setLoading(true);
        const response = await airQualityAPI.getPollutantBreakdown();
        setBreakdown(response.data.data);
      } catch (error) {
        console.error('Error fetching pollutant breakdown:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreakdown();
  }, []);

  if (loading) {
    return (
      <div className={`aqi-card ${className}`}>
        <LoadingSpinner text="Loading pollutant data..." />
      </div>
    );
  }

  if (!breakdown || !breakdown.pollutant_breakdown) {
    return (
      <div className={`aqi-card ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">Pollutant Breakdown</h3>
        </div>
        <div className="text-center text-gray-500">
          <p>Pollutant data unavailable</p>
        </div>
      </div>
    );
  }

  const { pollutant_breakdown, dominant_pollutant } = breakdown;

  return (
    <div className={`aqi-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-700">Pollutant Breakdown</h3>
        </div>
        {dominant_pollutant && (
          <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
            Primary: {getPollutantName(dominant_pollutant)}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {Object.entries(pollutant_breakdown).map(([pollutant, data]) => {
          const { value, unit, aqi, category, health_impact, is_primary_concern } = data;
          const aqiColor = getAQIColor(aqi);

          return (
            <div 
              key={pollutant} 
              className={`p-4 border-l-4 rounded-r-lg ${is_primary_concern ? 'bg-red-50' : 'bg-gray-50'}`}
              style={{ borderLeftColor: aqiColor }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="font-semibold text-gray-900">
                    {getPollutantName(pollutant)}
                  </div>
                  {is_primary_concern && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: aqiColor }}>
                    {aqi}
                  </div>
                  <div className="text-xs font-medium text-gray-500">AQI</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">
                  {formatNumber(value)} {unit}
                </div>
                <div 
                  className="text-xs font-medium px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: aqiColor }}
                >
                  {category}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, (aqi / 500) * 100)}%`,
                      backgroundColor: aqiColor 
                    }}
                  />
                </div>
              </div>

              <div className="text-xs text-gray-600">
                <div className="font-medium mb-1">Health Impact:</div>
                <div>{health_impact}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div className="flex items-center space-x-1 mb-1">
            <AlertCircle className="w-3 h-3" />
            <span>Primary concern pollutant highlighted</span>
          </div>
          <div>AQI calculated based on Indian National Standards (CPCB)</div>
        </div>
      </div>
    </div>
  );
};

export default PollutantBreakdown;
