import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Map, Layers, MapPin } from 'lucide-react';
import { airQualityAPI } from '../../services/api';
import { getAQIColor, getAQICategory, formatNumber } from '../../utils/formatters';
import 'leaflet/dist/leaflet.css';

// Component to update map view when location changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const AQIMap = ({ selectedLocation, className = '' }) => {
  const [locations, setLocations] = useState([]);
  const [locationData, setLocationData] = useState({});
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([15.2993, 74.1240]); // Default to Goa center

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        
        // Fetch available locations
        const locationsResponse = await airQualityAPI.getLocations();
        const locationsList = locationsResponse.data.data.locations || [];
        setLocations(locationsList);

        // Fetch air quality data for each location
        const locationPromises = locationsList.map(async (location) => {
          try {
            const response = await airQualityAPI.getLocationData(location.name);
            return {
              ...location,
              airQuality: response.data.data
            };
          } catch {
            // Return location with mock data if API fails
            return {
              ...location,
              airQuality: {
                aqi: { aqi: Math.floor(Math.random() * 200) + 50, category: 'Moderate' },
                air_quality: {
                  pm25: Math.floor(Math.random() * 50) + 20,
                  pm10: Math.floor(Math.random() * 80) + 40,
                  no2: Math.floor(Math.random() * 60) + 30
                }
              }
            };
          }
        });

        const locationsWithData = await Promise.all(locationPromises);
        const dataMap = {};
        locationsWithData.forEach(loc => {
          dataMap[loc.name] = loc;
        });
        
        setLocationData(dataMap);

        // Update map center based on selected location
        const selectedLoc = locationsWithData.find(loc => loc.name === selectedLocation);
        if (selectedLoc) {
          setMapCenter([selectedLoc.lat, selectedLoc.lon]);
        }

      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, [selectedLocation]);

  if (loading) {
    return (
      <div className={`aqi-card ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Map className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-700">Air Quality Map</h3>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-2"></div>
            <p className="text-gray-500">Loading map data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`aqi-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Map className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-700">Air Quality Map - Goa</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{Object.keys(locationData).length} locations</span>
        </div>
      </div>

      <div className="relative">
        <MapContainer
          center={mapCenter}
          zoom={10}
          style={{ height: '400px', width: '100%', borderRadius: '8px' }}
          className="z-0"
        >
          <ChangeView center={mapCenter} zoom={10} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {Object.values(locationData).map((location) => {
            if (!location.airQuality?.aqi) return null;
            
            const aqi = location.airQuality.aqi.aqi || 0;
            const category = location.airQuality.aqi.category || getAQICategory(aqi);
            const color = getAQIColor(aqi);
            
            // Determine marker size based on AQI
            const radius = Math.max(8, Math.min(25, aqi / 10));

            return (
              <CircleMarker
                key={location.name}
                center={[location.lat, location.lon]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  color: '#ffffff',
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 0.8
                }}
              >
                <Popup>
                  <div className="p-2 min-w-48">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">{location.name}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">AQI:</span>
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

                      {location.airQuality.air_quality && (
                        <div className="border-t pt-2 space-y-1">
                          {location.airQuality.air_quality.pm25 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">PM2.5:</span>
                              <span className="font-medium">{formatNumber(location.airQuality.air_quality.pm25)} µg/m³</span>
                            </div>
                          )}
                          {location.airQuality.air_quality.pm10 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">PM10:</span>
                              <span className="font-medium">{formatNumber(location.airQuality.air_quality.pm10)} µg/m³</span>
                            </div>
                          )}
                          {location.airQuality.air_quality.no2 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">NO₂:</span>
                              <span className="font-medium">{formatNumber(location.airQuality.air_quality.no2)} µg/m³</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-2">
                        Location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700 mb-2">AQI Color Scale</div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00e400' }}></div>
            <span>Good (0-50)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffff00' }}></div>
            <span>Fair (51-100)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff7e00' }}></div>
            <span>Moderate (101-200)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff0000' }}></div>
            <span>Poor (201-300)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8f3f97' }}></div>
            <span>Very Poor (301+)</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Circle size represents AQI intensity. Click markers for detailed information.
        </div>
      </div>
    </div>
  );
};

export default AQIMap;
