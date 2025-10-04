import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { airQualityAPI } from '../../services/api';
import { getLocationIcon } from '../../utils/formatters';

const LocationSelector = ({ selectedLocation, onLocationChange, className = '' }) => {
  const [locations, setLocations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await airQualityAPI.getLocations();
        setLocations(response.data.data.locations || []);
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Fallback to default locations
        setLocations([
          { name: 'Panaji', lat: 15.4909, lon: 73.8278, type: 'capital' },
          { name: 'Margao', lat: 15.2993, lon: 74.1240, type: 'city' },
          { name: 'Mapusa', lat: 15.5959, lon: 73.8137, type: 'town' },
          { name: 'Vasco da Gama', lat: 15.3947, lon: 73.8081, type: 'port' },
          { name: 'Ponda', lat: 15.4019, lon: 74.0070, type: 'town' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const currentLocation = locations.find(loc => loc.name === selectedLocation) || 
                         { name: selectedLocation, type: 'region' };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <MapPin className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">Loading locations...</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <MapPin className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {getLocationIcon(currentLocation.type)} {currentLocation.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {locations.map((location) => (
              <button
                key={location.name}
                onClick={() => {
                  onLocationChange(location.name);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  location.name === selectedLocation ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{getLocationIcon(location.type)}</span>
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{location.type}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LocationSelector;
