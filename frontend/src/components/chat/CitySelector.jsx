import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

const CitySelector = ({ onCitySelect }) => {
  const cities = [
    { 
      name: 'Panaji', 
      description: 'Capital City',
      icon: '🏛️',
      population: '114k'
    },
    { 
      name: 'Margao', 
      description: 'Commercial Hub',
      icon: '🏢',
      population: '120k'
    },
    { 
      name: 'Mapusa', 
      description: 'Cultural Center',
      icon: '🎭',
      population: '40k'
    },
    { 
      name: 'Vasco da Gama', 
      description: 'Port City',
      icon: '⚓',
      population: '100k'
    },
    { 
      name: 'Ponda', 
      description: 'Temple Town',
      icon: '🕌',
      population: '25k'
    }
  ];

  return (
    <div className="w-full max-w-sm">
      <div className="space-y-2">
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => onCitySelect(city.name)}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{city.icon}</div>
              <div className="text-left">
                <div className="font-semibold text-gray-800 text-sm">
                  {city.name}
                </div>
                <div className="text-xs text-gray-500">
                  {city.description} • {city.population}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Air quality data powered by NASA TEMPO & OpenAQ
        </p>
      </div>
    </div>
  );
};

export default CitySelector;
