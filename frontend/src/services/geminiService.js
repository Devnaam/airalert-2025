// Gemini 2.0 Flash API Service for AirAlert Pro
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBtgRmkYVpxsCuSpYdYbHJATwAy82Yt1Ds';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

class GeminiService {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.baseUrl = GEMINI_API_URL;
  }

  // Create contextual prompt with air quality data
  createContextualPrompt(userMessage, airQualityData, location) {
    const context = `
You are an AI assistant for AirAlert Pro, an air quality monitoring system for Goa, India.

CURRENT AIR QUALITY DATA for ${location}:
- AQI: ${airQualityData?.aqi?.aqi || 'N/A'}
- Category: ${airQualityData?.aqi?.category || 'Unknown'}
- PM2.5: ${airQualityData?.air_quality?.pm25 || 'N/A'} µg/m³
- PM10: ${airQualityData?.air_quality?.pm10 || 'N/A'} µg/m³
- NO2: ${airQualityData?.air_quality?.no2 || 'N/A'} µg/m³
- O3: ${airQualityData?.air_quality?.o3 || 'N/A'} µg/m³
- Temperature: ${airQualityData?.weather?.temperature || 'N/A'}°C
- Humidity: ${airQualityData?.weather?.humidity || 'N/A'}%
- Wind Speed: ${airQualityData?.weather?.wind_speed || 'N/A'} km/h

AQI GUIDELINES:
- 0-50: Good (Green) - Air quality is satisfactory
- 51-100: Satisfactory (Yellow) - Acceptable for most people
- 101-200: Moderate (Orange) - Unhealthy for sensitive groups
- 201-300: Poor (Red) - Unhealthy for everyone
- 301-400: Very Poor (Purple) - Health warnings
- 401+: Severe (Maroon) - Emergency conditions

INSTRUCTIONS:
- Provide specific, actionable advice based on current data
- Be conversational and helpful
- Include health recommendations when relevant
- Mention specific pollutant levels if asked
- Use emojis sparingly but appropriately
- Keep responses concise but informative (max 150 words)
- If data is unavailable, acknowledge it and provide general guidance

USER QUESTION: ${userMessage}

Respond as a knowledgeable air quality expert for the people of ${location}, Goa.
`;

    return context;
  }

  // Generate AI response using Gemini 2.0 Flash
  async generateResponse(userMessage, airQualityData, location) {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = this.createContextualPrompt(userMessage, airQualityData, location);

      // Log API request in development
      if (import.meta.env.DEV) {
        console.log('🤖 Sending request to Gemini 2.0 Flash API...');
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500, // Reduced for concise responses
            stopSequences: []
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      // Log response status in development
      if (import.meta.env.DEV) {
        console.log(`🔄 Gemini API Response Status: ${response.status}`);
      }

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API Error Response:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      // Log successful response in development
      if (import.meta.env.DEV) {
        console.log('✅ Gemini API Success:', data);
      }
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const aiMessage = data.candidates[0].content.parts[0].text.trim();
        
        return {
          success: true,
          message: aiMessage,
          timestamp: new Date().toISOString(),
          model: 'gemini-2.0-flash',
          tokensUsed: data.usageMetadata?.totalTokenCount || 0
        };
      } else {
        throw new Error('Invalid response structure from Gemini API');
      }

    } catch (error) {
      console.error('❌ Gemini Service Error:', error);
      
      // Fallback response based on air quality data
      return {
        success: false,
        message: this.getFallbackResponse(userMessage, airQualityData, location),
        timestamp: new Date().toISOString(),
        error: error.message,
        model: 'fallback'
      };
    }
  }

  // Enhanced fallback response when Gemini API is not available
  getFallbackResponse(userMessage, airQualityData, location) {
    const aqi = airQualityData?.aqi?.aqi || 0;
    const category = airQualityData?.aqi?.category || 'Unknown';
    const temperature = airQualityData?.weather?.temperature || 'N/A';
    
    // Simple pattern matching for common questions
    const message = userMessage.toLowerCase();
    
    if (message.includes('safe') || message.includes('exercise') || message.includes('outdoor')) {
      if (aqi <= 100) {
        return `✅ Good news! With AQI ${aqi} (${category}) in ${location}, it's safe for outdoor activities. Temperature is ${temperature}°C - perfect for exercise! 🏃‍♂️`;
      } else if (aqi <= 200) {
        return `⚠️ AQI is ${aqi} (${category}) in ${location}. Sensitive individuals should limit outdoor activities. Others can exercise with caution. Consider shorter workouts. 🚶‍♀️`;
      } else {
        return `❌ Air quality is poor in ${location} with AQI ${aqi} (${category}). Avoid outdoor activities and exercise indoors today. Stay safe! 🏠`;
      }
    }
    
    if (message.includes('aqi') || message.includes('current') || message.includes('quality')) {
      return `📊 Current AQI in ${location}: ${aqi} (${category})\n🌡️ Temperature: ${temperature}°C\n\n${this.getAQIDescription(aqi)}`;
    }
    
    if (message.includes('mask') || message.includes('wear')) {
      if (aqi > 100) {
        return `😷 With AQI ${aqi} in ${location}, I recommend wearing an N95 mask when going outside. Protect your lungs, especially if you're sensitive to air pollution!`;
      } else {
        return `😊 Air quality is good in ${location} (AQI: ${aqi}). You don't need a mask, but it's always your choice for extra protection!`;
      }
    }

    if (message.includes('health') || message.includes('symptoms') || message.includes('recommendation')) {
      return `🏥 Health recommendations for ${location} (AQI: ${aqi}):\n\n${this.getHealthRecommendations(aqi).join('\n')}`;
    }

    if (message.includes('weather') || message.includes('temperature')) {
      const weather = airQualityData?.weather;
      if (weather) {
        return `🌤️ Current weather in ${location}:\n• Temperature: ${weather.temperature}°C\n• Humidity: ${weather.humidity}%\n• Wind: ${weather.wind_speed} km/h\n• AQI: ${aqi} (${category})`;
      }
    }
    
    // Default response
    return `🌬️ I'm your AirAlert AI assistant for ${location}!\n\n📊 Current AQI: ${aqi} (${category})\n🌡️ Temperature: ${temperature}°C\n\nAsk me about:\n• Air quality safety\n• Exercise recommendations  \n• Health advice\n• Mask requirements\n\nWhat would you like to know? 😊`;
  }

  // Get AQI description with emojis
  getAQIDescription(aqi) {
    if (aqi <= 50) return '🟢 Excellent air quality! Perfect for all outdoor activities.';
    if (aqi <= 100) return '🟡 Good air quality. Suitable for most activities.';
    if (aqi <= 200) return '🟠 Moderate air quality. Sensitive groups should be cautious.';
    if (aqi <= 300) return '🔴 Poor air quality. Limit outdoor exposure.';
    if (aqi <= 400) return '🟣 Very poor air quality. Avoid outdoor activities.';
    return '🟤 Severe air quality. Emergency conditions - stay indoors!';
  }

  // Get health recommendations based on AQI
  getHealthRecommendations(aqi) {
    if (aqi <= 50) {
      return ["✅ Perfect air quality - enjoy all activities!", "🏃‍♂️ Great time for outdoor sports"];
    } else if (aqi <= 100) {
      return ["😊 Good for most people", "⚠️ Sensitive individuals monitor symptoms"];
    } else if (aqi <= 200) {
      return ["🚶‍♀️ Limit prolonged outdoor activities", "😷 Consider wearing a mask", "🏠 Keep windows closed"];
    } else if (aqi <= 300) {
      return ["🚫 Avoid outdoor activities", "😷 Wear N95 mask outside", "🏠 Use air purifiers indoors"];
    } else {
      return ["🚨 Stay indoors", "🏥 Seek medical help if symptoms occur", "🚫 Emergency conditions"];
    }
  }

  // Test API connection
  async testConnection() {
    try {
      console.log('🧪 Testing Gemini 2.0 Flash API connection...');
      
      const response = await this.generateResponse(
        'Hello, test connection', 
        { aqi: { aqi: 50, category: 'Good' } }, 
        'Test Location'
      );

      if (response.success) {
        console.log('✅ Gemini API connection successful!');
        return {
          success: true,
          message: 'API connection working',
          model: response.model
        };
      } else {
        console.log('⚠️ Using fallback mode');
        return {
          success: false,
          message: 'API unavailable, using fallback',
          error: response.error
        };
      }
    } catch (error) {
      console.error('❌ API test failed:', error);
      return {
        success: false,
        message: 'Connection test failed',
        error: error.message
      };
    }
  }

  // Check service health
  async checkServiceHealth() {
    try {
      if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
        return {
          available: false,
          error: 'API key not configured properly',
          fallbackMode: true
        };
      }

      const testResult = await this.testConnection();
      
      return {
        available: testResult.success,
        error: testResult.error || null,
        fallbackMode: !testResult.success,
        model: testResult.model || 'fallback',
        apiKey: this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'Not set'
      };
    } catch (error) {
      return {
        available: false,
        error: error.message,
        fallbackMode: true
      };
    }
  }
}

export default new GeminiService();
