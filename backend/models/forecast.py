import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
from datetime import datetime, timedelta
import os

class AirQualityForecaster:
    """
    Machine Learning model for 24-hour air quality forecasting
    """
    
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = [
            'pm25_current', 'pm10_current', 'no2_current', 'o3_current',
            'temperature', 'humidity', 'wind_speed', 'hour_of_day',
            'day_of_week', 'month', 'pm25_lag1', 'pm10_lag1'
        ]
    
    def prepare_features(self, current_data, weather_data, historical_data=None):
        """
        Prepare features for ML model
        """
        now = datetime.now()
        
        features = {
            'pm25_current': current_data.get('pm25', 50),
            'pm10_current': current_data.get('pm10', 80),
            'no2_current': current_data.get('no2', 40),
            'o3_current': current_data.get('o3', 100),
            'temperature': weather_data.get('temperature', 28),
            'humidity': weather_data.get('humidity', 75),
            'wind_speed': weather_data.get('wind_speed', 10),
            'hour_of_day': now.hour,
            'day_of_week': now.weekday(),
            'month': now.month,
            'pm25_lag1': current_data.get('pm25', 50) * 0.9,  # Mock lag feature
            'pm10_lag1': current_data.get('pm10', 80) * 0.9   # Mock lag feature
        }
        
        return pd.DataFrame([features])
    
    def generate_training_data(self, days=30):
        """
        Generate synthetic training data for demonstration
        In production, use real historical data
        """
        np.random.seed(42)
        training_data = []
        
        for day in range(days):
            for hour in range(24):
                # Generate realistic synthetic data with patterns
                base_pm25 = 40 + 20 * np.sin(hour * np.pi / 12) + np.random.normal(0, 10)
                base_pm10 = 70 + 30 * np.sin(hour * np.pi / 12) + np.random.normal(0, 15)
                
                # Weather influence
                temp = 25 + 5 * np.sin(hour * np.pi / 12) + np.random.normal(0, 2)
                humidity = 70 + 10 * np.cos(hour * np.pi / 12) + np.random.normal(0, 5)
                wind = 8 + 4 * np.sin(hour * np.pi / 6) + np.random.normal(0, 2)
                
                # Traffic patterns (higher pollution during rush hours)
                if hour in [7, 8, 9, 18, 19, 20]:
                    base_pm25 += 15
                    base_pm10 += 25
                
                features = {
                    'pm25_current': max(5, base_pm25),
                    'pm10_current': max(10, base_pm10),
                    'no2_current': max(10, 30 + np.random.normal(0, 10)),
                    'o3_current': max(20, 80 + np.random.normal(0, 15)),
                    'temperature': temp,
                    'humidity': max(30, min(95, humidity)),
                    'wind_speed': max(0, wind),
                    'hour_of_day': hour,
                    'day_of_week': day % 7,
                    'month': 11,  # November
                    'pm25_lag1': max(5, base_pm25 * 0.95),
                    'pm10_lag1': max(10, base_pm10 * 0.95),
                    # Target: next hour's PM2.5 (simplified single target)
                    'pm25_next': max(5, base_pm25 + np.random.normal(0, 5))
                }
                
                training_data.append(features)
        
        return pd.DataFrame(training_data)
    
    def train_model(self):
        """
        Train the forecasting model
        """
        print("Generating training data...")
        df = self.generate_training_data(days=60)
        
        # Prepare features and target
        X = df[self.feature_names]
        y = df['pm25_next']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        print("Training Random Forest model...")
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"Model Performance - MAE: {mae:.2f}, R²: {r2:.3f}")
        
        self.is_trained = True
        
        # Save model
        self.save_model()
        
        return {
            'mae': mae,
            'r2_score': r2,
            'status': 'trained'
        }
    
    def predict_24h_forecast(self, current_data, weather_data):
        """
        Generate 24-hour forecast
        """
        if not self.is_trained:
            self.train_model()
        
        forecasts = []
        
        for hour in range(1, 25):  # Next 24 hours
            # Prepare features for this hour
            future_time = datetime.now() + timedelta(hours=hour)
            
            # Modify features based on time
            modified_current = current_data.copy()
            modified_weather = weather_data.copy()
            
            # Add time-based variations
            if hour <= 12:  # Morning pollution increase
                modified_current['pm25'] = current_data.get('pm25', 50) * (1 + 0.1 * hour/12)
                modified_current['pm10'] = current_data.get('pm10', 80) * (1 + 0.1 * hour/12)
            
            features_df = self.prepare_features(modified_current, modified_weather)
            features_df['hour_of_day'] = future_time.hour
            features_df['day_of_week'] = future_time.weekday()
            
            # Scale features
            features_scaled = self.scaler.transform(features_df[self.feature_names])
            
            # Predict
            predicted_pm25 = self.model.predict(features_scaled)[0]
            
            # Generate other pollutant predictions (simplified)
            predicted_pm10 = predicted_pm25 * 1.8 + np.random.normal(0, 5)
            predicted_no2 = max(10, 35 + np.random.normal(0, 8))
            predicted_o3 = max(20, 85 + np.random.normal(0, 12))
            
            forecast = {
                'hour': hour,
                'datetime': future_time.isoformat(),
                'pm25': max(5, round(predicted_pm25, 1)),
                'pm10': max(10, round(predicted_pm10, 1)),
                'no2': round(predicted_no2, 1),
                'o3': round(predicted_o3, 1),
                'confidence': 0.85 - (hour * 0.02)  # Confidence decreases with time
            }
            
            forecasts.append(forecast)
        
        return forecasts
    
    def save_model(self):
        """Save trained model and scaler"""
        try:
            os.makedirs('models/saved', exist_ok=True)
            joblib.dump(self.model, 'models/saved/aqi_model.pkl')
            joblib.dump(self.scaler, 'models/saved/scaler.pkl')
            print("Model saved successfully")
        except Exception as e:
            print(f"Error saving model: {e}")
    
    def load_model(self):
        """Load pre-trained model"""
        try:
            self.model = joblib.load('models/saved/aqi_model.pkl')
            self.scaler = joblib.load('models/saved/scaler.pkl')
            self.is_trained = True
            print("Model loaded successfully")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
