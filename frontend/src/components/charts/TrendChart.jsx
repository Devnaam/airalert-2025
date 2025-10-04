import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Calendar } from 'lucide-react';
import { formatDate, getAQIColor } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendChart = ({ trendData, className = '' }) => {
  if (!trendData || !Array.isArray(trendData) || trendData.length === 0) {
    return (
      <div className={`aqi-card ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">7-Day Trends</h3>
        </div>
        <div className="text-center text-gray-500 py-8">
          <p>Trend data unavailable</p>
        </div>
      </div>
    );
  }

  // Sort data by date (newest first, so reverse for chronological display)
  const sortedData = [...trendData].reverse();

  const labels = sortedData.map(item => formatDate(item.date));
  const aqiData = sortedData.map(item => item.aqi || 0);
  const pm25Data = sortedData.map(item => item.pm25 || 0);
  const pm10Data = sortedData.map(item => item.pm10 || 0);
  const no2Data = sortedData.map(item => item.no2 || 0);
  const o3Data = sortedData.map(item => item.o3 || 0);

  // Create gradient colors for AQI line based on values
  const createGradient = (ctx, chartArea) => {
    if (!chartArea) return '#3B82F6';
    
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, '#00e400');    // Good (bottom)
    gradient.addColorStop(0.2, '#ffff00');  // Satisfactory
    gradient.addColorStop(0.4, '#ff7e00');  // Moderate
    gradient.addColorStop(0.6, '#ff0000');  // Poor
    gradient.addColorStop(0.8, '#8f3f97');  // Very Poor
    gradient.addColorStop(1, '#7e0023');    // Severe (top)
    
    return gradient;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'AQI',
        data: aqiData,
        borderColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return '#3B82F6';
          return createGradient(ctx, chartArea);
        },
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: aqiData.map(aqi => getAQIColor(aqi)),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      },
      {
        label: 'PM2.5',
        data: pm25Data,
        borderColor: '#EF4444',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: true // Initially hidden
      },
      {
        label: 'PM10',
        data: pm10Data,
        borderColor: '#F59E0B',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: true // Initially hidden
      },
      {
        label: 'NO₂',
        data: no2Data,
        borderColor: '#8B5CF6',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: true // Initially hidden
      },
      {
        label: 'O₃',
        data: o3Data,
        borderColor: '#10B981',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: true // Initially hidden
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          filter: function() {
            // Show all legend items so users can toggle
            return true;
          }
        },
        onClick: function(e, legendItem, legend) {
          // Default toggle behavior
          const index = legendItem.datasetIndex;
          const chart = legend.chart;
          const meta = chart.getDatasetMeta(index);
          meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
          chart.update();
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          title: function(context) {
            return `Date: ${context[0].label}`;
          },
          label: function(context) {
            const label = context.dataset.label;
            const value = context.parsed.y;
            
            if (label === 'AQI') {
              const aqi = Math.round(value);
              const category = aqi <= 50 ? 'Good' : 
                             aqi <= 100 ? 'Satisfactory' : 
                             aqi <= 200 ? 'Moderate' : 
                             aqi <= 300 ? 'Poor' : 
                             aqi <= 400 ? 'Very Poor' : 'Severe';
              return `${label}: ${aqi} (${category})`;
            }
            return `${label}: ${value.toFixed(1)} µg/m³`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value'
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        min: 0
      }
    }
  };

  // Calculate trend statistics
  const avgAQI = aqiData.reduce((sum, val) => sum + val, 0) / aqiData.length;
  const maxAQI = Math.max(...aqiData);
  const minAQI = Math.min(...aqiData);
  const trend = aqiData[aqiData.length - 1] - aqiData[0]; // Latest - Oldest

  return (
    <div className={`aqi-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-700">7-Day Historical Trends</h3>
        </div>
        <div className="text-sm text-gray-500">
          {sortedData.length} days
        </div>
      </div>

      {/* Trend Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{Math.round(avgAQI)}</div>
          <div className="text-xs text-gray-500">Avg AQI</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">{Math.round(maxAQI)}</div>
          <div className="text-xs text-gray-500">Peak AQI</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{Math.round(minAQI)}</div>
          <div className="text-xs text-gray-500">Best AQI</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {trend >= 0 ? '+' : ''}{Math.round(trend)}
          </div>
          <div className="text-xs text-gray-500">7d Change</div>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>Click legend items to show/hide pollutants. AQI trend shown by default.</p>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
