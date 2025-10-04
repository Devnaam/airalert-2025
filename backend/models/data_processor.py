import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys
import os

class DataProcessor:
    """
    Process and integrate data from multiple sources
    """
    
    def __init__(self):
        # Import here to avoid circular imports
        from api.tempo import TempoAPI
        from api.openaq import OpenAQAPI
        from api.weather import WeatherAPI
        from utils.aqi_calculator import AQICalculator
        
        self.tempo_api = TempoAPI()
        self.openaq_api = OpenAQAPI()
        self.weather_api = WeatherAPI()
        self.aqi_calculator = AQICalculator()
    
    def get_integrated_current_data(self):
        """
        Fetch and integrate current data from all sources
        """
        try:
            # Fetch data from all sources
            tempo_response = self.tempo_api.get_latest_data()
            openaq_response = self.openaq_api.get_latest_measurements()
            weather_response = self.weather_api.get_current_weather()
            
            # Process and integrate data
            integrated_data = {
                'timestamp': datetime.now().isoformat(),
                'location': {
                    'latitude': 15.2993,
                    'longitude': 74.1240,
                    'name': 'Goa, India'
                },
                'air_quality': self._integrate_air_quality_data(
                    tempo_response.get('data', {}),
                    openaq_response.get('data', {})
                ),
                'weather': weather_response.get('data', {}),
                'sources': {
                    'satellite': tempo_response.get('source', 'unknown'),
                    'ground': openaq_response.get('source', 'unknown'),
                    'weather': weather_response.get('source', 'unknown')
                }
            }
            
            # Calculate AQI
            pollutant_data = {
                'pm25': integrated_data['air_quality'].get('pm25'),
                'pm10': integrated_data['air_quality'].get('pm10'),
                'no2': integrated_data['air_quality'].get('no2'),
                'o3': integrated_data['air_quality'].get('o3'),
                'so2': integrated_data['air_quality'].get('so2'),
                'co': integrated_data['air_quality'].get('co')
            }
            
            aqi_value = self.aqi_calculator.calculate_composite_aqi(pollutant_data)
            aqi_info = self.aqi_calculator.get_aqi_category(aqi_value)
            
            integrated_data['aqi'] = aqi_info
            
            return {
                'status': 'success',
                'data': integrated_data
            }
            
        except Exception as e:
            print(f"Error integrating current data: {e}")
            return {
                'status': 'error',
                'message': str(e),
                'data': None
            }
    
    def _integrate_air_quality_data(self, tempo_data, openaq_data):
        """
        Integrate satellite and ground-based measurements
        """
        integrated = {}
        
        # Priority: Ground measurements > Satellite data
        # Ground-based data (more accurate for surface level)
        if openaq_data:
            integrated.update({
                'pm25': openaq_data.get('pm25'),
                'pm10': openaq_data.get('pm10'),
                'no2': openaq_data.get('no2'),
                'o3': openaq_data.get('o3'),
                'so2': openaq_data.get('so2'),
                'co': openaq_data.get('co')
            })
        
        # Fill missing values with satellite data
        if tempo_data:
            if integrated.get('no2') is None:
                integrated['no2'] = tempo_data.get('no2_column')
            if integrated.get('o3') is None:
                integrated['o3'] = tempo_data.get('o3_column')
        
        # Remove None values
        integrated = {k: v for k, v in integrated.items() if v is not None}
        
        return integrated
    
    def get_historical_trends(self, days=7):
        """
        Get historical data for trend analysis
        """
        try:
            # Get historical data from TEMPO
            tempo_historical = self.tempo_api.get_historical_data(days=days)
            
            # Process historical data
            trends = []
            for data_point in tempo_historical.get('data', []):
                date = data_point.get('date')
                
                # Mock historical ground data based on satellite data
                historical_point = {
                    'date': date,
                    'pm25': data_point.get('no2', 40) * 1.2 + np.random.normal(0, 5),
                    'pm10': data_point.get('no2', 40) * 2.0 + np.random.normal(0, 10),
                    'no2': data_point.get('no2', 40),
                    'o3': data_point.get('o3', 80),
                    'aqi': None
                }
                
                # Calculate historical AQI
                pollutant_data = {
                    'pm25': historical_point['pm25'],
                    'pm10': historical_point['pm10'],
                    'no2': historical_point['no2'],
                    'o3': historical_point['o3']
                }
                
                aqi_value = self.aqi_calculator.calculate_composite_aqi(pollutant_data)
                historical_point['aqi'] = aqi_value
                
                trends.append(historical_point)
            
            return {
                'status': 'success',
                'data': trends
            }
            
        except Exception as e:
            print(f"Error getting historical trends: {e}")
            return {
                'status': 'error',
                'message': str(e),
                'data': []
            }
    
    def validate_data_quality(self, data):
        """
        Validate data quality and consistency
        """
        validation_results = {
            'is_valid': True,
            'issues': [],
            'confidence_score': 1.0
        }
        
        air_quality = data.get('air_quality', {})
        
        # Check for reasonable value ranges
        checks = [
            ('pm25', air_quality.get('pm25'), 0, 500),
            ('pm10', air_quality.get('pm10'), 0, 600),
            ('no2', air_quality.get('no2'), 0, 1000),
            ('o3', air_quality.get('o3'), 0, 1000)
        ]
        
        for param, value, min_val, max_val in checks:
            if value is not None:
                if value < min_val or value > max_val:
                    validation_results['issues'].append(
                        f"{param} value {value} outside expected range [{min_val}-{max_val}]"
                    )
                    validation_results['confidence_score'] *= 0.8
        
        # Check data freshness
        try:
            timestamp = datetime.fromisoformat(data.get('timestamp', ''))
            age_minutes = (datetime.now() - timestamp).total_seconds() / 60
            
            if age_minutes > 60:  # Data older than 1 hour
                validation_results['issues'].append(f"Data is {age_minutes:.1f} minutes old")
                validation_results['confidence_score'] *= 0.9
        except:
            validation_results['issues'].append("Invalid timestamp")
            validation_results['confidence_score'] *= 0.9
        
        if validation_results['issues']:
            validation_results['is_valid'] = len(validation_results['issues']) <= 2
        
        return validation_results
