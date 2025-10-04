import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Activity } from 'lucide-react';
import { getPollutantName, getAQIColor } from '../../utils/formatters';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PollutantChart = ({ pollutantData, className = '' }) => {
  if (!pollutantData || !pollutantData.pollutant_breakdown) {
    return (
      <div className={`aqi-card ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">Pollutant Radar</h3>
        </div>
        <div className="text-center text-gray-500 py-8">
          <p>Pollutant data unavailable</p>
        </div>
      </div>
    );
  }

  const breakdown = pollutantData.pollutant_breakdown;
  
  // Prepare data for radar chart
  const pollutants = Object.keys(breakdown);
  const labels = pollutants.map(p => getPollutantName(p));
  const aqiValues = pollutants.map(p => breakdown[p].aqi);

  // Create color array based on AQI values
  const borderColors = aqiValues.map(aqi => getAQIColor(aqi));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'AQI Values',
        data: aqiValues,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: borderColors,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          title: function(context) {
            return `${context[0].label}`;
          },
          label: function(context) {
            const pollutantIndex = context.dataIndex;
            const pollutant = pollutants[pollutantIndex];
            const data = breakdown[pollutant];
            
            return [
              `AQI: ${data.aqi}`,
              `Concentration: ${data.value} ${data.unit}`,
              `Category: ${data.category}`,
              `Health Impact: ${data.health_impact}`
            ];
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: '#374151'
        },
        ticks: {
          display: true,
          backdropColor: 'transparent',
          color: '#6B7280',
          font: {
            size: 10
          }
        },
        min: 0,
        max: 500,
        beginAtZero: true
      }
    }
  };

  // Find dominant pollutant
  const dominantPollutant = pollutants.find(p => breakdown[p].is_primary_concern);

  return (
    <div className={`aqi-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-700">Pollutant Radar Chart</h3>
        </div>
        {dominantPollutant && (
          <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
            Primary: {getPollutantName(dominantPollutant)}
          </div>
        )}
      </div>

      <div className="chart-container">
        <Radar data={chartData} options={options} />
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {pollutants.map((pollutant) => {
          const data = breakdown[pollutant];
          const color = getAQIColor(data.aqi);
          
          return (
            <div key={pollutant} className="flex items-center space-x-2 p-2 rounded border">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{getPollutantName(pollutant)}</div>
                <div className="text-xs text-gray-500">
                  AQI: {data.aqi} | {data.value} {data.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>Radar chart shows AQI levels for each pollutant. Larger area indicates higher pollution.</p>
        </div>
      </div>
    </div>
  );
};

export default PollutantChart;
