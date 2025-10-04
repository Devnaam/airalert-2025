import requests
import pandas as pd
from datetime import datetime, timedelta
from config import Config

class WeatherAPI:
    """
    Handle weather data integration (using Open-Meteo free API)
    """
    
    def __init__(self):
        self.base_url = Config.WEATHER_API_URL
    
    def get_current_weather(self, lat=Config.GOA_COORDINATES['latitude'],
                          lon=Config.GOA_COORDINATES['longitude']):
        """
        Get current weather conditions
        """
        try:
            params = {
                'latitude': lat,
                'longitude': lon,
                'current': 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m',
                'timezone': 'Asia/Kolkata'
            }
            
            response = requests.get(self.base_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                current_weather = data.get('current', {})
                
                processed_data = {
                    'temperature': current_weather.get('temperature_2m'),
                    'humidity': current_weather.get('relative_humidity_2m'),
                    'wind_speed': current_weather.get('wind_speed_10m'),
                    'wind_direction': current_weather.get('wind_direction_10m'),
                    'timestamp': current_weather.get('time', datetime.now().isoformat())
                }
                
                return {
                    'status': 'success',
                    'data': processed_data,
                    'source': 'Open-Meteo'
                }
            else:
                return self._get_mock_weather()
                
        except Exception as e:
            print(f"Error fetching weather data: {e}")
            return self._get_mock_weather()
    
    def get_forecast_weather(self, days=7):
        """
        Get weather forecast for next 7 days
        """
        try:
            params = {
                'latitude': Config.GOA_COORDINATES['latitude'],
                'longitude': Config.GOA_COORDINATES['longitude'],
                'daily': 'temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,wind_speed_10m_max',
                'forecast_days': days,
                'timezone': 'Asia/Kolkata'
            }
            
            response = requests.get(self.base_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                daily_data = data.get('daily', {})
                
                forecast = []
                dates = daily_data.get('time', [])
                
                for i, date in enumerate(dates):
                    forecast_day = {
                        'date': date,
                        'temp_max': daily_data.get('temperature_2m_max', [])[i] if i < len(daily_data.get('temperature_2m_max', [])) else None,
                        'temp_min': daily_data.get('temperature_2m_min', [])[i] if i < len(daily_data.get('temperature_2m_min', [])) else None,
                        'humidity': daily_data.get('relative_humidity_2m_mean', [])[i] if i < len(daily_data.get('relative_humidity_2m_mean', [])) else None,
                        'wind_speed': daily_data.get('wind_speed_10m_max', [])[i] if i < len(daily_data.get('wind_speed_10m_max', [])) else None
                    }
                    forecast.append(forecast_day)
                
                return {
                    'status': 'success',
                    'data': forecast,
                    'source': 'Open-Meteo'
                }
            else:
                return self._get_mock_forecast(days)
                
        except Exception as e:
            print(f"Error fetching weather forecast: {e}")
            return self._get_mock_forecast(days)
    
    def _get_mock_weather(self):
        """Generate mock current weather data"""
        import random
        
        mock_data = {
            'temperature': round(random.uniform(24, 32), 1),  # Typical for Goa
            'humidity': round(random.uniform(60, 85), 1),
            'wind_speed': round(random.uniform(5, 15), 1),
            'wind_direction': round(random.uniform(0, 360), 1),
            'timestamp': datetime.now().isoformat()
        }
        
        return {
            'status': 'success',
            'data': mock_data,
            'source': 'Weather_MOCK'
        }
    
    def _get_mock_forecast(self, days):
        """Generate mock forecast data"""
        import random
        
        forecast = []
        for i in range(days):
            date = (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d')
            forecast_day = {
                'date': date,
                'temp_max': round(random.uniform(28, 34), 1),
                'temp_min': round(random.uniform(22, 28), 1),
                'humidity': round(random.uniform(60, 85), 1),
                'wind_speed': round(random.uniform(5, 15), 1)
            }
            forecast.append(forecast_day)
        
        return {
            'status': 'success',
            'data': forecast,
            'source': 'Weather_MOCK'
        }
