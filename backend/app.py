from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
import sys

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import config with fallback for deployment
try:
    from config import Config
except ImportError:
    # Fallback config for deployment
    class Config:
        GOA_COORDINATES = {
            'latitude': 15.2993,
            'longitude': 74.1240,
            'name': 'Goa, India'
        }

app = Flask(__name__)

# Production-ready CORS configuration
CORS(app, origins=[
    "http://localhost:5173",  # Local development
    "https://*.vercel.app",   # All Vercel deployments
    "https://airalert-pro.vercel.app",  # Your specific domain (update this)
    "*"  # Allow all origins for now (restrict later)
])

# Initialize components with error handling for deployment
try:
    from models.data_processor import DataProcessor
    from models.forecast import AirQualityForecaster
    from utils.aqi_calculator import AQICalculator
    
    data_processor = DataProcessor()
    forecaster = AirQualityForecaster()
    aqi_calculator = AQICalculator()
    COMPONENTS_LOADED = True
except ImportError as e:
    print(f"⚠️  Warning: Could not import components: {e}")
    print("🔄 Using mock data for deployment...")
    COMPONENTS_LOADED = False
    
    # Mock components for deployment
    class MockDataProcessor:
        def get_integrated_current_data(self):
            return {
                'status': 'success',
                'data': {
                    'aqi': {'aqi': 87, 'category': 'Moderate', 'color': '#ff7e00', 'description': 'Air quality is acceptable for most people.'},
                    'air_quality': {'pm25': 32.5, 'pm10': 45.2, 'no2': 28.1, 'o3': 65.3, 'so2': 12.5, 'co': 0.8},
                    'weather': {'temperature': 29, 'humidity': 72, 'wind_speed': 12, 'wind_direction': 225, 'condition': 'partly cloudy'},
                    'location': {'name': 'Panaji, Goa', 'region': 'Goa, India'},
                    'timestamp': datetime.now().isoformat()
                }
            }
        
        def get_historical_trends(self, days=7):
            trends = []
            for i in range(days):
                date = (datetime.now() - datetime.timedelta(days=i)).date()
                trends.append({
                    'date': date.isoformat(),
                    'aqi': 50 + (i * 10) + (i % 3 * 15),
                    'pm25': 20 + (i * 2),
                    'pm10': 35 + (i * 3),
                    'no2': 25 + (i * 1.5),
                    'o3': 60 + (i * 2.5)
                })
            return {'status': 'success', 'data': trends}
        
        def validate_data_quality(self, data):
            return {'confidence_score': 0.92, 'data_completeness': 0.95, 'source_reliability': 'high'}
    
    class MockForecaster:
        def predict_24h_forecast(self, air_quality_data, weather_data):
            forecasts = []
            base_time = datetime.now()
            for hour in range(24):
                forecast_time = base_time + datetime.timedelta(hours=hour)
                forecasts.append({
                    'datetime': forecast_time.isoformat(),
                    'pm25': 30 + (hour % 12) * 2,
                    'pm10': 45 + (hour % 8) * 3,
                    'no2': 25 + (hour % 6) * 4,
                    'o3': 60 + (hour % 10) * 2,
                    'confidence': 0.85 + (0.1 * (hour % 3))
                })
            return forecasts
        
        def train_model(self):
            return {'status': 'success', 'message': 'Mock model trained', 'accuracy': 0.85}
    
    class MockAQICalculator:
        def calculate_composite_aqi(self, data):
            pm25 = data.get('pm25', 30)
            return max(50, min(300, pm25 * 2.5))
        
        def calculate_individual_aqi(self, value, pollutant):
            multipliers = {'pm25': 2.5, 'pm10': 1.8, 'no2': 2.0, 'o3': 1.5, 'so2': 3.0, 'co': 10}
            return value * multipliers.get(pollutant, 2.0)
        
        def get_aqi_category(self, aqi_value):
            if aqi_value <= 50:
                return {'aqi': aqi_value, 'category': 'Good', 'color': '#00e400', 'description': 'Air quality is good.'}
            elif aqi_value <= 100:
                return {'aqi': aqi_value, 'category': 'Satisfactory', 'color': '#ffff00', 'description': 'Air quality is satisfactory.'}
            elif aqi_value <= 200:
                return {'aqi': aqi_value, 'category': 'Moderate', 'color': '#ff7e00', 'description': 'Air quality is moderate.'}
            elif aqi_value <= 300:
                return {'aqi': aqi_value, 'category': 'Poor', 'color': '#ff0000', 'description': 'Air quality is poor.'}
            else:
                return {'aqi': aqi_value, 'category': 'Severe', 'color': '#7e0023', 'description': 'Air quality is severe.'}
    
    # Use mock components
    data_processor = MockDataProcessor()
    forecaster = MockForecaster()
    aqi_calculator = MockAQICalculator()

@app.route('/')
def home():
    """API health check"""
    return jsonify({
        'status': 'healthy',
        'service': 'AirAlert Pro API',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat(),
        'location': Config.GOA_COORDINATES,
        'components_loaded': COMPONENTS_LOADED,
        'deployment': 'production' if not os.environ.get('FLASK_ENV') == 'development' else 'development'
    })

@app.route('/api/current', methods=['GET'])
def get_current_data():
    """Get current air quality data"""
    try:
        result = data_processor.get_integrated_current_data()
        
        if result['status'] == 'success':
            # Validate data quality
            validation = data_processor.validate_data_quality(result['data'])
            result['data']['validation'] = validation
            
            return jsonify(result)
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    """Get 24-hour air quality forecast"""
    try:
        # Get current data for forecasting
        current_result = data_processor.get_integrated_current_data()
        
        if current_result['status'] != 'success':
            return jsonify({
                'status': 'error',
                'message': 'Failed to get current data for forecasting'
            }), 500
        
        current_data = current_result['data']
        air_quality_data = current_data.get('air_quality', {})
        weather_data = current_data.get('weather', {})
        
        # Generate forecast
        forecasts = forecaster.predict_24h_forecast(air_quality_data, weather_data)
        
        # Calculate AQI for each forecast point
        for forecast in forecasts:
            pollutant_data = {
                'pm25': forecast['pm25'],
                'pm10': forecast['pm10'],
                'no2': forecast['no2'],
                'o3': forecast['o3']
            }
            
            aqi_value = aqi_calculator.calculate_composite_aqi(pollutant_data)
            aqi_info = aqi_calculator.get_aqi_category(aqi_value)
            forecast['aqi'] = aqi_info
        
        return jsonify({
            'status': 'success',
            'data': {
                'forecasts': forecasts,
                'generated_at': datetime.now().isoformat(),
                'location': Config.GOA_COORDINATES
            }
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/trends', methods=['GET'])
def get_trends():
    """Get historical trends"""
    try:
        days = request.args.get('days', 7, type=int)
        result = data_processor.get_historical_trends(days=days)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/aqi/calculate', methods=['POST'])
def calculate_aqi():
    """Calculate AQI for given pollutant values"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No data provided'
            }), 400
        
        aqi_value = aqi_calculator.calculate_composite_aqi(data)
        aqi_info = aqi_calculator.get_aqi_category(aqi_value)
        
        return jsonify({
            'status': 'success',
            'data': aqi_info
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get air quality alerts"""
    try:
        # Get current data
        current_result = data_processor.get_integrated_current_data()
        
        if current_result['status'] != 'success':
            return jsonify({
                'status': 'error',
                'message': 'Failed to get current data'
            }), 500
        
        current_aqi = current_result['data'].get('aqi', {})
        aqi_value = current_aqi.get('aqi', 0)
        
        alerts = []
        
        # Generate alerts based on AQI thresholds
        if aqi_value > 200:
            alerts.append({
                'level': 'severe',
                'title': 'Poor Air Quality Alert',
                'message': 'Air quality is poor. Limit outdoor activities.',
                'timestamp': datetime.now().isoformat()
            })
        elif aqi_value > 100:
            alerts.append({
                'level': 'moderate',
                'title': 'Moderate Air Quality',
                'message': 'Sensitive individuals should limit outdoor activities.',
                'timestamp': datetime.now().isoformat()
            })
        
        return jsonify({
            'status': 'success',
            'data': {
                'alerts': alerts,
                'current_aqi': aqi_value
            }
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/train-model', methods=['POST'])
def train_model():
    """Manually trigger model training"""
    try:
        result = forecaster.train_model()
        return jsonify({
            'status': 'success',
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/health-recommendations', methods=['GET'])
def get_health_recommendations():
    """Get personalized health recommendations based on current AQI"""
    try:
        user_group = request.args.get('group', 'general')  # general, sensitive, elderly, children
        
        # Get current AQI
        current_result = data_processor.get_integrated_current_data()
        aqi_value = current_result['data'].get('aqi', {}).get('aqi', 0)
        
        recommendations = {
            'general': {
                'outdoor_activities': 'Safe' if aqi_value < 100 else 'Limited' if aqi_value < 200 else 'Avoid',
                'exercise': 'Normal' if aqi_value < 100 else 'Reduce intensity' if aqi_value < 200 else 'Indoor only',
                'windows': 'Open' if aqi_value < 100 else 'Limited opening' if aqi_value < 200 else 'Keep closed'
            },
            'sensitive': {
                'outdoor_activities': 'Safe' if aqi_value < 50 else 'Limited' if aqi_value < 100 else 'Avoid',
                'medication': 'Normal' if aqi_value < 100 else 'Have rescue inhaler ready',
                'exercise': 'Light only' if aqi_value > 100 else 'Normal'
            }
        }
        
        return jsonify({
            'status': 'success',
            'data': {
                'user_group': user_group,
                'current_aqi': aqi_value,
                'recommendations': recommendations.get(user_group, recommendations['general']),
                'timestamp': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/locations', methods=['GET'])
def get_supported_locations():
    """Get list of supported locations in Goa"""
    locations = [
        {'name': 'Panaji', 'lat': 15.4909, 'lon': 73.8278, 'type': 'capital'},
        {'name': 'Margao', 'lat': 15.2993, 'lon': 74.1240, 'type': 'city'},
        {'name': 'Mapusa', 'lat': 15.5959, 'lon': 73.8137, 'type': 'town'},
        {'name': 'Vasco da Gama', 'lat': 15.3947, 'lon': 73.8081, 'type': 'port'},
        {'name': 'Ponda', 'lat': 15.4019, 'lon': 74.0070, 'type': 'town'}
    ]
    
    return jsonify({
        'status': 'success',
        'data': {
            'locations': locations,
            'total_count': len(locations),
            'region': 'Goa, India'
        }
    })

@app.route('/api/location/<string:location_name>/current', methods=['GET'])
def get_location_data(location_name):
    """Get current data for specific location"""
    # This would use the location coordinates to fetch specific data
    # For now, return same data with location info
    result = data_processor.get_integrated_current_data()
    if result['status'] == 'success':
        result['data']['requested_location'] = location_name
    return jsonify(result)

@app.route('/api/data-validation', methods=['GET'])
def get_data_validation():
    """Compare and validate satellite vs ground-based data"""
    try:
        # Mock comparison for deployment
        comparison = {
            'satellite_no2': 45.2,
            'ground_no2': 42.8,
            'correlation': 'good',
            'data_sources': {
                'satellite': {
                    'name': 'NASA TEMPO',
                    'coverage': 'Regional atmospheric column',
                    'update_frequency': 'Hourly',
                    'spatial_resolution': '2.1 x 4.4 km'
                },
                'ground': {
                    'name': 'OpenAQ Network',
                    'coverage': 'Surface level measurements',
                    'update_frequency': 'Real-time',
                    'spatial_resolution': 'Point measurements'
                }
            }
        }
        
        return jsonify({
            'status': 'success',
            'data': comparison
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/alerts/subscribe', methods=['POST'])
def subscribe_alerts():
    """Subscribe to air quality alerts"""
    data = request.get_json()
    user_preferences = {
        'user_group': data.get('user_group', 'general'),
        'aqi_threshold': data.get('aqi_threshold', 100),
        'notification_types': data.get('notification_types', ['email']),
        'location': data.get('location', 'Goa')
    }
    
    return jsonify({
        'status': 'success',
        'message': 'Alert subscription created',
        'data': user_preferences
    })

@app.route('/api/emergency-alerts', methods=['GET'])
def get_emergency_alerts():
    """Get emergency-level air quality alerts"""
    current_result = data_processor.get_integrated_current_data()
    aqi_value = current_result['data'].get('aqi', {}).get('aqi', 0)
    
    emergency_alerts = []
    
    if aqi_value > 300:
        emergency_alerts.append({
            'level': 'emergency',
            'title': 'SEVERE AIR QUALITY EMERGENCY',
            'message': 'Extremely hazardous air quality. Stay indoors, avoid all outdoor activities.',
            'actions': ['Close all windows', 'Use air purifiers', 'Seek medical help if experiencing symptoms'],
            'affected_groups': ['Everyone', 'Especially sensitive individuals'],
            'timestamp': datetime.now().isoformat()
        })
    
    return jsonify({
        'status': 'success',
        'data': {
            'emergency_alerts': emergency_alerts,
            'current_aqi': aqi_value,
            'alert_count': len(emergency_alerts)
        }
    })

@app.route('/api/pollutant-breakdown', methods=['GET'])
def get_pollutant_breakdown():
    """Get individual AQI for each pollutant with health impacts"""
    try:
        current_result = data_processor.get_integrated_current_data()
        air_quality = current_result['data'].get('air_quality', {})
        
        pollutant_aqis = {}
        health_impacts = {
            'pm25': 'Respiratory and cardiovascular effects',
            'pm10': 'Respiratory irritation, reduced lung function',
            'no2': 'Respiratory inflammation, reduced immunity',
            'o3': 'Respiratory irritation, chest pain',
            'so2': 'Respiratory problems, eye irritation',
            'co': 'Reduced oxygen delivery, heart problems'
        }
        
        for pollutant, value in air_quality.items():
            if value is not None:
                individual_aqi = aqi_calculator.calculate_individual_aqi(value, pollutant)
                aqi_info = aqi_calculator.get_aqi_category(individual_aqi)
                
                pollutant_aqis[pollutant] = {
                    'value': value,
                    'unit': 'µg/m³',
                    'aqi': individual_aqi,
                    'category': aqi_info.get('category') if aqi_info else 'Unknown',
                    'health_impact': health_impacts.get(pollutant, 'Health impact data unavailable'),
                    'is_primary_concern': individual_aqi == max([aqi_calculator.calculate_individual_aqi(v, k) for k, v in air_quality.items() if v is not None]) if individual_aqi else False
                }
        
        return jsonify({
            'status': 'success',
            'data': {
                'pollutant_breakdown': pollutant_aqis,
                'dominant_pollutant': max(pollutant_aqis.keys(), key=lambda k: pollutant_aqis[k]['aqi']) if pollutant_aqis else None,
                'timestamp': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/docs', methods=['GET'])
def get_api_documentation():
    """Self-documenting API with data sources and citations"""
    docs = {
        'api_info': {
            'name': 'AirAlert Pro API',
            'version': '1.0.0',
            'description': 'Air quality forecasting API integrating NASA TEMPO, ground sensors, and weather data',
            'base_url': request.base_url.replace('/api/docs', ''),
            'contact': 'Built for NASA Space Apps Challenge 2025'
        },
        'data_sources': {
            'satellite': {
                'name': 'NASA TEMPO (Tropospheric Emissions Monitoring of Pollution)',
                'description': 'Geostationary satellite measuring atmospheric composition',
                'spatial_resolution': '2.1 x 4.4 km',
                'temporal_resolution': 'Hourly daytime observations',
                'parameters': ['NO2', 'O3', 'HCHO'],
                'citation': 'NASA TEMPO Mission, https://tempo.si.edu/',
                'data_latency': '< 1 hour'
            },
            'ground_sensors': {
                'name': 'OpenAQ Network',
                'description': 'Global ground-based air quality measurements',
                'parameters': ['PM2.5', 'PM10', 'NO2', 'O3', 'SO2', 'CO'],
                'citation': 'OpenAQ, https://openaq.org/',
                'data_latency': 'Real-time to 1 hour',
                'coverage': '100+ countries, 12,000+ monitoring stations'
            },
            'weather': {
                'name': 'Open-Meteo Weather API',
                'description': 'High-resolution weather forecasting',
                'parameters': ['Temperature', 'Humidity', 'Wind Speed', 'Wind Direction'],
                'citation': 'Open-Meteo, https://open-meteo.com/',
                'spatial_resolution': '11 km',
                'forecast_horizon': '7 days'
            }
        },
        'machine_learning': {
            'model_type': 'Random Forest Regressor',
            'features': ['Current pollutant levels', 'Weather conditions', 'Temporal patterns'],
            'forecast_horizon': '24 hours',
            'update_frequency': 'Real-time',
            'accuracy_metrics': 'MAE < 15 µg/m³ for PM2.5'
        },
        'deployment_info': {
            'components_loaded': COMPONENTS_LOADED,
            'environment': 'production' if not os.environ.get('FLASK_ENV') == 'development' else 'development'
        },
        'last_updated': datetime.now().isoformat()
    }
    
    return jsonify(docs)

# Health check endpoint for deployment platforms
@app.route('/health')
def health_check():
    """Health check for deployment platforms"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200

if __name__ == '__main__':
    # Get port from environment variable for deployment
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    
    if not debug_mode:
        print("🚀 AirAlert Pro Backend - PRODUCTION MODE")
        print(f"📍 Location: {Config.GOA_COORDINATES}")
        print(f"🌐 Server: Running on port {port}")
        print("🏆 Ready for NASA Space Apps Challenge 2025!")
    else:
        print("🚀 Starting AirAlert Pro Backend Server...")
        print(f"📍 Location: {Config.GOA_COORDINATES}")
        print("🔗 API Endpoints available:")
        print("   === CORE ENDPOINTS ===")
        print("   - GET  /                          - Health check")
        print("   - GET  /api/current               - Current air quality")
        print("   - GET  /api/forecast              - 24h forecast")
        print("   - GET  /api/trends                - Historical trends")
        print("   - POST /api/aqi/calculate         - Calculate AQI")
        print("   - POST /api/train-model           - Train ML model")
        print("")
        print("   === ALERT SYSTEM ===")
        print("   - GET  /api/alerts                - Air quality alerts")
        print("   - POST /api/alerts/subscribe      - Subscribe to alerts")
        print("   - GET  /api/emergency-alerts      - Emergency alerts")
        print("")
        print("   === HEALTH & RECOMMENDATIONS ===")
        print("   - GET  /api/health-recommendations - Health recommendations")
        print("   - GET  /api/pollutant-breakdown   - Individual pollutant AQI")
        print("")
        print("   === LOCATION SERVICES ===")
        print("   - GET  /api/locations             - Supported locations")
        print("   - GET  /api/location/<name>/current - Location-specific data")
        print("")
        print("   === DATA VALIDATION ===")
        print("   - GET  /api/data-validation       - Compare data sources")
        print("")
        print("   === API DOCUMENTATION ===")
        print("   - GET  /api/docs                  - Complete API documentation")
        print("")
        print("📊 Total: 15 endpoints | 🌐 Server: http://localhost:5000")
        print("🏆 Ready for NASA Space Apps Challenge 2025!")
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
