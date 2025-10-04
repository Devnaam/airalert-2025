import React, { useState, useEffect } from 'react';
import { Calendar, BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import { airQualityAPI } from '../services/api';
import { useAirQualityContext } from '../context/AirQualityContext';
import TrendChart from '../components/charts/TrendChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDate, getAQIColor, getAQICategory } from '../utils/formatters';

const Trends = () => {
  const { selectedLocation } = useAirQualityContext();
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(7);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await airQualityAPI.getTrends(selectedPeriod);
        setTrends(response.data.data);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [selectedLocation, selectedPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading historical trends..." />
      </div>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No trend data available</h3>
          <p className="text-gray-600">Historical data is not available for the selected period.</p>
        </div>
      </div>
    );
  }

  // Calculate trend statistics
  const sortedTrends = [...trends].sort((a, b) => new Date(a.date) - new Date(b.date));
  const avgAQI = trends.reduce((sum, t) => sum + (t.aqi || 0), 0) / trends.length;
  const maxAQI = Math.max(...trends.map(t => t.aqi || 0));
  const minAQI = Math.min(...trends.map(t => t.aqi || 0));
  const latestAQI = sortedTrends[sortedTrends.length - 1]?.aqi || 0;
  const earliestAQI = sortedTrends[0]?.aqi || 0;
  const overallTrend = latestAQI - earliestAQI;

  // Calculate pollutant averages
  const avgPM25 = trends.reduce((sum, t) => sum + (t.pm25 || 0), 0) / trends.length;
  const avgPM10 = trends.reduce((sum, t) => sum + (t.pm10 || 0), 0) / trends.length;
  const avgNO2 = trends.reduce((sum, t) => sum + (t.no2 || 0), 0) / trends.length;
  const avgO3 = trends.reduce((sum, t) => sum + (t.o3 || 0), 0) / trends.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Historical Trends</h1>
            <p className="text-green-100">
              Air quality trends and patterns for {selectedLocation} over time
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Analysis Period</span>
            </div>
            <div className="text-2xl font-bold">{selectedPeriod} Days</div>
            <div className="text-sm text-green-100">{trends.length} data points</div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
          </div>
          <div className="flex space-x-2">
            {[3, 7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setSelectedPeriod(days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === days
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {overallTrend > 0 ? (
            <TrendingUp className="w-5 h-5 text-red-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-green-500" />
          )}
          <span className={`font-medium ${overallTrend > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {overallTrend > 0 ? '+' : ''}{Math.round(overallTrend)} AQI change
          </span>
        </div>
      </div>

      {/* Trend Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
          <div className="text-xs text-gray-500 mt-1">Worst day</div>
        </div>

        <div className="aqi-card p-4 text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: getAQIColor(minAQI) }}>
            {Math.round(minAQI)}
          </div>
          <div className="text-sm text-gray-600">Best AQI</div>
          <div className="text-xs text-gray-500 mt-1">Best day</div>
        </div>

        <div className="aqi-card p-4 text-center">
          <div className="text-2xl font-bold mb-1 text-blue-600">
            {trends.filter(t => (t.aqi || 0) <= 100).length}
          </div>
          <div className="text-sm text-gray-600">Good Days</div>
          <div className="text-xs text-gray-500 mt-1">AQI ≤ 100</div>
        </div>

        <div className="aqi-card p-4 text-center">
          <div className="text-2xl font-bold mb-1 text-red-600">
            {trends.filter(t => (t.aqi || 0) > 200).length}
          </div>
          <div className="text-sm text-gray-600">Poor Days</div>
          <div className="text-xs text-gray-500 mt-1">AQI &gt; 200</div>

        </div>
      </div>

      {/* Main Trend Chart */}
      <TrendChart trendData={trends} className="col-span-2" />

      {/* Pollutant Averages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Pollutant Levels */}
        <div className="aqi-card">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-700">Average Pollutant Levels</h3>
          </div>

          <div className="space-y-4">
            {[
              { name: 'PM2.5', value: avgPM25, unit: 'µg/m³', color: '#EF4444', limit: 60 },
              { name: 'PM10', value: avgPM10, unit: 'µg/m³', color: '#F59E0B', limit: 100 },
              { name: 'NO₂', value: avgNO2, unit: 'µg/m³', color: '#8B5CF6', limit: 80 },
              { name: 'O₃', value: avgO3, unit: 'µg/m³', color: '#10B981', limit: 100 }
            ].map((pollutant) => (
              <div key={pollutant.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pollutant.color }}
                  />
                  <span className="font-medium text-gray-700">{pollutant.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (pollutant.value / pollutant.limit) * 100)}%`,
                        backgroundColor: pollutant.color 
                      }}
                    />
                  </div>
                  <div className="text-right min-w-16">
                    <div className="font-bold">{pollutant.value.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">{pollutant.unit}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
            Compared to Indian National Air Quality Standards (NAAQS)
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div className="aqi-card">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-700">Daily Breakdown</h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <div className="space-y-2">
              {sortedTrends.slice().reverse().map((trend, index) => {
                const aqi = trend.aqi || 0;
                const color = getAQIColor(aqi);
                const category = getAQICategory(aqi);

                return (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatDate(trend.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        PM2.5: {trend.pm25?.toFixed(1) || '--'} | PM10: {trend.pm10?.toFixed(1) || '--'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg" style={{ color }}>
                          {Math.round(aqi)}
                        </span>
                        <span 
                          className="text-xs px-2 py-1 rounded-full text-white font-medium"
                          style={{ backgroundColor: color }}
                        >
                          {category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <BarChart3 className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">Trend Analysis Insights</h4>
            <div className="text-yellow-700 text-sm mt-2 space-y-1">
              <p>
                • Air quality has {overallTrend > 0 ? 'worsened' : 'improved'} by {Math.abs(Math.round(overallTrend))} AQI points over the {selectedPeriod}-day period
              </p>
              <p>
                • {Math.round((trends.filter(t => (t.aqi || 0) <= 100).length / trends.length) * 100)}% of days had acceptable air quality (AQI ≤ 100)
              </p>
              <p>
                • PM2.5 averaged {avgPM25.toFixed(1)} µg/m³, which is {avgPM25 > 60 ? 'above' : 'within'} WHO recommended levels
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
