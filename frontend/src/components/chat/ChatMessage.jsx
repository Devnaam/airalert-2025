import React from 'react';
import { User, Bot, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get AQI status color and icon
  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    if (aqi <= 100) return { color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle };
    if (aqi <= 200) return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertTriangle };
    return { color: 'text-red-600', bg: 'bg-red-100', icon: XCircle };
  };

  // Render data cards for structured responses
  const renderDataCard = (data) => {
    if (data.type === 'aqi_status') {
      const status = getAQIStatus(data.aqi);
      const StatusIcon = status.icon;
      
      return (
        <div className={`p-3 rounded-lg ${status.bg} mt-2`}>
          <div className="flex items-center space-x-2 mb-2">
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
            <span className={`font-semibold ${status.color}`}>
              Current AQI: {data.aqi}
            </span>
          </div>
          <div className="text-sm text-gray-700">
            <div><strong>Category:</strong> {data.category}</div>
            <div><strong>Location:</strong> {data.location}</div>
            <div><strong>Last Updated:</strong> {formatTime(data.timestamp)}</div>
          </div>
        </div>
      );
    }

    if (data.type === 'pollutant_levels') {
      return (
        <div className="p-3 bg-gray-100 rounded-lg mt-2">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Current Pollutant Levels</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(data.pollutants).map(([pollutant, value]) => (
              <div key={pollutant} className="flex justify-between">
                <span className="text-gray-600">{pollutant.toUpperCase()}:</span>
                <span className="font-semibold">{value} µg/m³</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.type === 'health_recommendation') {
      const recommendations = Array.isArray(data.recommendations) 
        ? data.recommendations 
        : [data.recommendations];

      return (
        <div className="p-3 bg-blue-50 rounded-lg mt-2">
          <h4 className="font-semibold text-blue-800 mb-2 text-sm flex items-center">
            <span className="mr-2">🏥</span>
            Health Recommendations
          </h4>
          <ul className="space-y-1 text-sm text-blue-700">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (data.type === 'weather_info') {
      return (
        <div className="p-3 bg-purple-50 rounded-lg mt-2">
          <h4 className="font-semibold text-purple-800 mb-2 text-sm flex items-center">
            <span className="mr-2">🌤️</span>
            Current Weather
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-purple-700">
            <div>Temperature: {data.temperature}°C</div>
            <div>Humidity: {data.humidity}%</div>
            <div>Wind: {data.windSpeed} km/h</div>
            <div>Condition: {data.condition}</div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} space-x-2`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-xs sm:max-w-sm ${isUser ? 'order-1' : 'order-2'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-blue-600 text-white ml-auto'
              : 'bg-white border border-gray-200 text-gray-800'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          
          {/* Render structured data */}
          {message.data && renderDataCard(message.data)}
        </div>

        {/* Timestamp */}
        <div
          className={`flex items-center mt-1 space-x-1 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
          {message.status && (
            <span className="text-xs text-gray-400">
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'error' && '❌'}
            </span>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center order-2">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
