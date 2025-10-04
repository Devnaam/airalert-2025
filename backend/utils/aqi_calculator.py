import pandas as pd
import numpy as np

class AQICalculator:
    """
    Calculate Air Quality Index (AQI) based on Indian Standards
    """
    
    # AQI Breakpoints for Indian Standard (Central Pollution Control Board)
    AQI_BREAKPOINTS = {
        'pm25': [
            (0, 30, 0, 50),      # Good
            (31, 60, 51, 100),   # Satisfactory  
            (61, 90, 101, 200),  # Moderate
            (91, 120, 201, 300), # Poor
            (121, 250, 301, 400),# Very Poor
            (251, 380, 401, 500) # Severe
        ],
        'pm10': [
            (0, 50, 0, 50),
            (51, 100, 51, 100),
            (101, 250, 101, 200),
            (251, 350, 201, 300),
            (351, 430, 301, 400),
            (431, 510, 401, 500)
        ],
        'no2': [
            (0, 40, 0, 50),
            (41, 80, 51, 100),
            (81, 180, 101, 200),
            (181, 280, 201, 300),
            (281, 400, 301, 400),
            (401, 500, 401, 500)
        ],
        'o3': [
            (0, 50, 0, 50),
            (51, 100, 51, 100),
            (101, 168, 101, 200),
            (169, 208, 201, 300),
            (209, 748, 301, 400),
            (749, 1000, 401, 500)
        ],
        'co': [
            (0, 1.0, 0, 50),
            (1.1, 2.0, 51, 100),
            (2.1, 10, 101, 200),
            (10.1, 17, 201, 300),
            (17.1, 34, 301, 400),
            (34.1, 50, 401, 500)
        ],
        'so2': [
            (0, 40, 0, 50),
            (41, 80, 51, 100),
            (81, 380, 101, 200),
            (381, 800, 201, 300),
            (801, 1600, 301, 400),
            (1601, 2000, 401, 500)
        ]
    }
    
    @staticmethod
    def calculate_individual_aqi(concentration, pollutant):
        """Calculate AQI for individual pollutant"""
        if pollutant.lower() not in AQICalculator.AQI_BREAKPOINTS:
            return None
            
        breakpoints = AQICalculator.AQI_BREAKPOINTS[pollutant.lower()]
        
        for bp_low, bp_high, aqi_low, aqi_high in breakpoints:
            if bp_low <= concentration <= bp_high:
                # Linear interpolation formula
                aqi = ((aqi_high - aqi_low) / (bp_high - bp_low)) * (concentration - bp_low) + aqi_low
                return round(aqi)
        
        # If concentration exceeds all breakpoints, return max AQI
        return 500
    
    @staticmethod
    def calculate_composite_aqi(pollutant_data):
        """Calculate composite AQI from multiple pollutants"""
        aqi_values = []
        
        for pollutant, concentration in pollutant_data.items():
            if concentration is not None and concentration >= 0:
                individual_aqi = AQICalculator.calculate_individual_aqi(concentration, pollutant)
                if individual_aqi is not None:
                    aqi_values.append(individual_aqi)
        
        if not aqi_values:
            return None
            
        # Composite AQI is the maximum of all individual AQIs
        return max(aqi_values)
    
    @staticmethod
    def get_aqi_category(aqi_value):
        """Get AQI category and health implications"""
        if aqi_value is None:
            return None
            
        categories = [
            (0, 50, 'Good', 'Air quality is satisfactory'),
            (51, 100, 'Satisfactory', 'Air quality is acceptable'),
            (101, 200, 'Moderate', 'Unhealthy for sensitive groups'),
            (201, 300, 'Poor', 'Everyone may experience health effects'),
            (301, 400, 'Very Poor', 'Health alert: everyone may experience serious health effects'),
            (401, 500, 'Severe', 'Health warnings of emergency conditions')
        ]
        
        for min_val, max_val, category, description in categories:
            if min_val <= aqi_value <= max_val:
                return {
                    'category': category,
                    'description': description,
                    'aqi': aqi_value,
                    'color': AQICalculator._get_color(category)
                }
        
        return {
            'category': 'Hazardous',
            'description': 'Health warnings of emergency conditions',
            'aqi': aqi_value,
            'color': '#7e0023'
        }
    
    @staticmethod
    def _get_color(category):
        """Get color code for AQI category"""
        colors = {
            'Good': '#00e400',
            'Satisfactory': '#ffff00',
            'Moderate': '#ff7e00',
            'Poor': '#ff0000',
            'Very Poor': '#8f3f97',
            'Severe': '#7e0023'
        }
        return colors.get(category, '#7e0023')
