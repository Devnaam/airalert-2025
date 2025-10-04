import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ForecastChart = ({ forecastData, className = '' }) => {
  const chartRef = useRef();

  if (!forecastData || !forecastData.forecasts) {
    return (
      <div className={`aqi-card ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">24-Hour Forecast</h3>
        </div>
        <div className="text-center text-gray-500 py-8">
          <p>Forecast data unavailable</p>
        </div>
      </div>
    );
  }

  const forecasts = forecastData.forecasts;
  
  // Prepare data for chart
  const labels = forecasts.map(f => formatTime(f.datetime));
  const aqiData = forecasts.map(f => f.aqi?.aqi || 0);
  const pm25Data = forecasts.map(f => f.pm25);
  const pm10Data = forecasts.map(f => f.pm10);
  const no2Data = forecasts.map(f => f.no2);
  const o3Data = forecasts.map(f => f.o3);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'AQI',
        data: aqiData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y'
      },
      {
        label: 'PM2.5 (µg/m³)',
        data: pm25Data,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y1'
      },
      {
        label: 'PM10 (µg/m³)',
        data: pm10Data,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y1'
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
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          afterTitle: function(context) {
            const dataIndex = context[0].dataIndex;
            const forecast = forecasts[dataIndex];
            return `Confidence: ${Math.round(forecast.confidence * 100)}%`;
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
            return `${label}: ${value.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time (24-hour format)'
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'AQI'
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        min: 0,
        max: 500
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Concentration (µg/m³)'
        },
        grid: {
          drawOnChartArea: false,
        },
        min: 0
      }
    }
  };

  return (
    <div className={`aqi-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-700">24-Hour Forecast</h3>
        </div>
        <div className="text-sm text-gray-500">
          {forecasts.length} data points
        </div>
      </div>

      <div className="chart-container">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Generated using Random Forest ML model</span>
            <span>Updated: {new Date(forecastData.generated_at).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;
