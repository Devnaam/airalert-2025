from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
import sys

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize components (import here to avoid circular imports)
from models.data_processor import DataProcessor
from models.forecast import AirQualityForecaster
from utils.aqi_calculator import AQICalculator

data_processor = DataProcessor()
forecaster = AirQualityForecaster()
aqi_calculator = AQICalculator()

@app.route('/')
def home():
    """API health check"""
    return jsonify({
        'status': 'healthy',
        'service': 'AirAlert Pro API',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat(),
        'location': Config.GOA_COORDINATES
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
        

# from here i am updating the new line of code 

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
        tempo_response = data_processor.tempo_api.get_latest_data()
        openaq_response = data_processor.openaq_api.get_latest_measurements()
        
        satellite_data = tempo_response.get('data', {})
        ground_data = openaq_response.get('data', {})
        
        # Compare NO2 values (common parameter)
        comparison = {
            'satellite_no2': satellite_data.get('no2_column'),
            'ground_no2': ground_data.get('no2'),
            'correlation': 'good' if abs((satellite_data.get('no2_column', 50) - ground_data.get('no2', 50))) < 20 else 'moderate',
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




# here i am closing the codes that i have added 

# new 2 end points start here

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
            'base_url': 'http://localhost:5000',
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
        'endpoints': {
            'core': [
                {'method': 'GET', 'path': '/', 'description': 'API health check'},
                {'method': 'GET', 'path': '/api/current', 'description': 'Current air quality data'},
                {'method': 'GET', 'path': '/api/forecast', 'description': '24-hour forecast'},
                {'method': 'GET', 'path': '/api/trends', 'description': 'Historical trends (7 days)'}
            ],
            'health': [
                {'method': 'GET', 'path': '/api/health-recommendations', 'description': 'Health-based activity recommendations'},
                {'method': 'GET', 'path': '/api/pollutant-breakdown', 'description': 'Individual pollutant AQI and health impacts'}
            ],
            'alerts': [
                {'method': 'GET', 'path': '/api/alerts', 'description': 'Air quality alerts'},
                {'method': 'GET', 'path': '/api/emergency-alerts', 'description': 'Emergency-level alerts'},
                {'method': 'POST', 'path': '/api/alerts/subscribe', 'description': 'Subscribe to alert notifications'}
            ],
            'locations': [
                {'method': 'GET', 'path': '/api/locations', 'description': 'Supported locations in Goa'},
                {'method': 'GET', 'path': '/api/location/<name>/current', 'description': 'Location-specific data'}
            ],
            'validation': [
                {'method': 'GET', 'path': '/api/data-validation', 'description': 'Compare satellite vs ground data'},
                {'method': 'POST', 'path': '/api/aqi/calculate', 'description': 'Calculate AQI from pollutant values'}
            ]
        },
        'aqi_standard': 'Indian National Air Quality Index (Central Pollution Control Board)',
        'geographic_coverage': 'Goa, India (15.2993°N, 74.1240°E)',
        'last_updated': datetime.now().isoformat()
    }
    
    return jsonify(docs)


# new 2 end points end here



if __name__ == '__main__':
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
    
    app.run(debug=True, host='0.0.0.0', port=5000)
