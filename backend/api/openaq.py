import requests
import pandas as pd
from datetime import datetime, timedelta
from config import Config

class OpenAQAPI:
    """
    Handle OpenAQ ground-based air quality measurements
    """
    
    def __init__(self):
        self.base_url = "https://api.openaq.org/v2"
        self.api_key = Config.OPENAQ_API_KEY
        self.headers = {
            'X-API-Key': self.api_key,
            'Content-Type': 'application/json'
        }
    
    def get_latest_measurements(self, lat=Config.GOA_COORDINATES['latitude'],
                              lon=Config.GOA_COORDINATES['longitude'],
                              radius=50000):  # 50km radius
        """
        Get latest air quality measurements near Goa
        """
        try:
            params = {
                'coordinates': f'{lat},{lon}',
                'radius': radius,
                'order_by': 'datetime',
                'sort': 'desc',
                'limit': 100
            }
            
            response = requests.get(
                f"{self.base_url}/latest",
                headers=self.headers,
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                processed_data = self._process_measurements(data['results'])
                return {
                    'status': 'success',
                    'data': processed_data,
                    'source': 'OpenAQ'
                }
            else:
                # Return mock data if API fails
                return self._get_mock_data()
                
        except Exception as e:
            print(f"Error fetching OpenAQ data: {e}")
            return self._get_mock_data()
    
    def _process_measurements(self, results):
        """Process OpenAQ measurements into standardized format"""
        measurements = {
            'pm25': None,
            'pm10': None,
            'no2': None,
            'o3': None,
            'so2': None,
            'co': None,
            'timestamp': datetime.now().isoformat()
        }
        
        for result in results:
            parameter = result.get('parameter', '').lower()
            value = result.get('value')
            unit = result.get('unit', '')
            
            if parameter in measurements and value is not None:
                # Convert units if needed
                converted_value = self._convert_units(value, unit, parameter)
                measurements[parameter] = converted_value
        
        return measurements
    
    def _convert_units(self, value, unit, parameter):
        """Convert different units to standard µg/m³"""
        # Most OpenAQ data is already in µg/m³
        if unit.lower() in ['µg/m³', 'ug/m3']:
            return value
        elif unit.lower() in ['mg/m³', 'mg/m3'] and parameter == 'co':
            return value * 1000  # Convert mg/m³ to µg/m³
        else:
            return value
    
    def _get_mock_data(self):
        """Generate mock data when API is unavailable"""
        import random
        
        mock_data = {
            'pm25': round(random.uniform(25, 85), 2),
            'pm10': round(random.uniform(45, 150), 2),
            'no2': round(random.uniform(15, 70), 2),
            'o3': round(random.uniform(50, 120), 2),
            'so2': round(random.uniform(10, 60), 2),
            'co': round(random.uniform(0.5, 3.5), 2),
            'timestamp': datetime.now().isoformat()
        }
        
        return {
            'status': 'success',
            'data': mock_data,
            'source': 'OpenAQ_MOCK'
        }
    
    def get_stations_near_location(self, lat, lon, radius=50000):
        """Get monitoring stations near specified location"""
        try:
            params = {
                'coordinates': f'{lat},{lon}',
                'radius': radius,
                'limit': 50
            }
            
            response = requests.get(
                f"{self.base_url}/locations",
                headers=self.headers,
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return None
                
        except Exception as e:
            print(f"Error fetching stations: {e}")
            return None
