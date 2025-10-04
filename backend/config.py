import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # NASA TEMPO API
    NASA_TOKEN = os.getenv('NASA_TOKEN', 'your_nasa_earthdata_token_here')
    
    # OpenAQ API
    OPENAQ_API_KEY = os.getenv('OPENAQ_API_KEY', 'your_openaq_api_key_here')
    
    # Weather API (Open-Meteo is free)
    WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'
    
    # Goa coordinates for data fetching
    GOA_COORDINATES = {
        'latitude': 15.2993,
        'longitude': 74.1240,
        'name': 'Goa, India'
    }
    
    # AQI Thresholds (Indian Standard)
    AQI_CATEGORIES = {
        'Good': {'min': 0, 'max': 50, 'color': '#00e400'},
        'Satisfactory': {'min': 51, 'max': 100, 'color': '#ffff00'},
        'Moderate': {'min': 101, 'max': 200, 'color': '#ff7e00'},
        'Poor': {'min': 201, 'max': 300, 'color': '#ff0000'},
        'Very Poor': {'min': 301, 'max': 400, 'color': '#8f3f97'},
        'Severe': {'min': 401, 'max': 500, 'color': '#7e0023'}
    }
    
    # Flask Config
    DEBUG = True
    SECRET_KEY = 'your_secret_key_here'
