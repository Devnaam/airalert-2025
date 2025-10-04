import React, { useState, useEffect } from 'react';
import { Heart, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { airQualityAPI } from '../../services/api';
import { getHealthIcon } from '../../utils/formatters';
import LoadingSpinner from '../ui/LoadingSpinner';

const HealthRecommendations = ({ userGroup = 'general', className = '' }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(userGroup);

  const userGroups = [
    { id: 'general', label: 'General Public', icon: Users },
    { id: 'sensitive', label: 'Sensitive Groups', icon: Heart },
    { id: 'elderly', label: 'Elderly', icon: AlertTriangle },
    { id: 'children', label: 'Children', icon: Heart }
  ];

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await airQualityAPI.getHealthRecommendations(selectedGroup);
        setRecommendations(response.data.data);
      } catch (error) {
        console.error('Error fetching health recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [selectedGroup]);

  if (loading) {
    return (
      <div className={`aqi-card ${className}`}>
        <LoadingSpinner text="Loading recommendations..." />
      </div>
    );
  }

  return (
    <div className={`aqi-card ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-700">Health Recommendations</h3>
      </div>

      {/* User Group Selector */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {userGroups.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedGroup(id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedGroup === id
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {recommendations && (
        <div className="space-y-4">
          {/* Current AQI Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Current AQI:</span>
            <span className="text-lg font-bold" style={{ color: recommendations.current_aqi > 100 ? '#ff0000' : '#00e400' }}>
              {recommendations.current_aqi}
            </span>
          </div>

          {/* Recommendations */}
          {recommendations.recommendations && (
            <div className="space-y-3">
              {Object.entries(recommendations.recommendations).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getHealthIcon(value)}</span>
                    <div>
                      <div className="font-medium text-gray-700 capitalize">
                        {key.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      value === 'Safe' || value === 'Normal' ? 'text-green-600' :
                      value === 'Limited' || value === 'Reduce intensity' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special recommendations for sensitive groups */}
          {selectedGroup === 'sensitive' && recommendations.current_aqi > 100 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-800">Special Advisory</div>
                  <div className="text-sm text-yellow-700 mt-1">
                    People with respiratory conditions should limit outdoor activities and keep rescue medications handy.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthRecommendations;
