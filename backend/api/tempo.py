import requests
import pandas as pd
import json
from datetime import datetime, timedelta
from config import Config

class TempoAPI:
    """
    Handle NASA TEMPO satellite data integration
    """
    
    def __init__(self):
        self.base_url = "https://asdc.larc.nasa.gov/project/TEMPO"
        self.token = Config.NASA_TOKEN
        self.headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
    
    def get_latest_data(self, lat=Config.GOA_COORDINATES['latitude'], 
                       lon=Config.GOA_COORDINATES['longitude']):
        """
        Get latest TEMPO data for specified coordinates
        Note: This is a mock implementation as TEMPO API access requires specific endpoints
        """
        try:
            # Mock TEMPO data based on typical satellite measurements
            # In real implementation, you would use earthaccess library
            mock_data = {
                'timestamp': datetime.now().isoformat(),
                'latitude': lat,
                'longitude': lon,
                'no2_column': self._generate_mock_no2(),
                'o3_column': self._generate_mock_o3(),
                'hcho_column': self._generate_mock_hcho(),
                'quality_flag': 'good',
                'cloud_fraction': 0.2
            }
            
            return {
                'status': 'success',
                'data': mock_data,
                'source': 'TEMPO_MOCK'
            }
            
        except Exception as e:
            print(f"Error fetching TEMPO data: {e}")
            return {
                'status': 'error',
                'message': str(e),
                'data': None
            }
    
    def _generate_mock_no2(self):
        """Generate realistic NO2 values for Goa"""
        import random
        # Typical NO2 values for Indian coastal cities (µg/m³)
        base_value = random.uniform(20, 80)
        return round(base_value, 2)
    
    def _generate_mock_o3(self):
        """Generate realistic O3 values"""
        import random
        # Typical O3 values (µg/m³)
        base_value = random.uniform(60, 120)
        return round(base_value, 2)
    
    def _generate_mock_hcho(self):
        """Generate realistic HCHO values"""
        import random
        # Typical HCHO values (µg/m³)
        base_value = random.uniform(5, 25)
        return round(base_value, 2)
    
    def get_historical_data(self, days=7):
        """Get historical TEMPO data for trend analysis"""
        historical_data = []
        
        for i in range(days):
            date = datetime.now() - timedelta(days=i)
            data_point = {
                'date': date.isoformat(),
                'no2': self._generate_mock_no2(),
                'o3': self._generate_mock_o3(),
                'hcho': self._generate_mock_hcho()
            }
            historical_data.append(data_point)
        
        return {
            'status': 'success',
            'data': historical_data,
            'source': 'TEMPO_HISTORICAL_MOCK'
        }
