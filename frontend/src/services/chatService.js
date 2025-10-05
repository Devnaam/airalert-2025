import geminiService from './geminiService';

class ChatService {
  constructor() {
    this.lastDataRefresh = null;
    this.conversationHistory = [];
  }

  // Create welcome message when city is selected
  createWelcomeMessage(city, airQualityData) {
    const aqi = airQualityData?.aqi?.aqi || 0;
    const category = airQualityData?.aqi?.category || 'Unknown';
    const emoji = this.getAQIEmoji(aqi);
    
    let welcomeText = `Hello! I'm your AirAlert AI assistant for ${city}. `;
    welcomeText += `Current AQI: ${aqi} (${category}) ${emoji}\n\n`;
    welcomeText += `I can help you with:\n`;
    welcomeText += `• Current air quality conditions\n`;
    welcomeText += `• Health recommendations\n`;
    welcomeText += `• Outdoor activity safety\n`;
    welcomeText += `• Weather conditions\n`;
    welcomeText += `• Pollutant level details\n\n`;
    welcomeText += `What would you like to know? 😊`;

    return {
      id: Date.now(),
      text: welcomeText,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      data: {
        type: 'aqi_status',
        aqi: aqi,
        category: category,
        location: city,
        timestamp: airQualityData?.timestamp || new Date().toISOString()
      },
      status: 'delivered'
    };
  }

  // Process user message and generate AI response
  async processMessage(userMessage, airQualityData, city, conversationHistory = []) {
    try {
      // Update conversation history
      this.conversationHistory = conversationHistory.slice(-10); // Keep last 10 messages

      // Analyze message intent
      const intent = this.analyzeMessageIntent(userMessage);
      
      // Generate response based on intent
      let response;
      
      switch (intent.type) {
        case 'current_conditions':
          response = await this.generateCurrentConditionsResponse(userMessage, airQualityData, city);
          break;
          
        case 'health_advice':
          response = await this.generateHealthAdviceResponse(userMessage, airQualityData, city);
          break;
          
        case 'activity_safety':
          response = await this.generateActivitySafetyResponse(userMessage, airQualityData, city);
          break;
          
        case 'pollutant_details':
          response = await this.generatePollutantDetailsResponse(userMessage, airQualityData, city);
          break;
          
        case 'weather_info':
          response = await this.generateWeatherInfoResponse(userMessage, airQualityData, city);
          break;
          
        case 'forecast':
          response = await this.generateForecastResponse(userMessage, airQualityData, city);
          break;
          
        default:
          response = await this.generateGeneralResponse(userMessage, airQualityData, city);
      }

      return {
        ...response,
        confidence: intent.confidence,
        source: response.source || 'ai'
      };

    } catch (error) {
      console.error('Error processing message:', error);
      return {
        text: "I'm experiencing some technical difficulties. Let me try to help you with the available data I have.",
        data: null,
        confidence: 0.5,
        source: 'fallback'
      };
    }
  }

  // Analyze message intent using keywords and patterns
  analyzeMessageIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    const intents = [
      {
        type: 'current_conditions',
        keywords: ['current', 'now', 'today', 'aqi', 'air quality', 'status'],
        patterns: [/what.*current/i, /how.*air.*quality/i, /aqi.*now/i],
        weight: 0
      },
      {
        type: 'health_advice',
        keywords: ['health', 'safe', 'mask', 'recommendation', 'advice', 'symptoms'],
        patterns: [/should.*wear/i, /health.*recommendation/i, /safe.*for/i],
        weight: 0
      },
      {
        type: 'activity_safety',
        keywords: ['exercise', 'outdoor', 'running', 'cycling', 'walking', 'play', 'sport'],
        patterns: [/safe.*exercise/i, /outdoor.*activity/i, /can.*i.*run/i],
        weight: 0
      },
      {
        type: 'pollutant_details',
        keywords: ['pm2.5', 'pm10', 'no2', 'o3', 'ozone', 'pollutant', 'levels'],
        patterns: [/pm.*level/i, /pollutant.*breakdown/i, /ozone.*concentration/i],
        weight: 0
      },
      {
        type: 'weather_info',
        keywords: ['weather', 'temperature', 'humidity', 'wind', 'condition'],
        patterns: [/weather.*like/i, /temperature.*today/i, /wind.*speed/i],
        weight: 0
      },
      {
        type: 'forecast',
        keywords: ['tomorrow', 'forecast', 'prediction', 'future', 'later', 'tonight'],
        patterns: [/tomorrow.*air/i, /forecast.*aqi/i, /later.*today/i],
        weight: 0
      }
    ];

    // Calculate weights for each intent
    intents.forEach(intent => {
      // Keyword matching
      intent.keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
          intent.weight += 1;
        }
      });

      // Pattern matching
      intent.patterns.forEach(pattern => {
        if (pattern.test(message)) {
          intent.weight += 2; // Patterns have higher weight
        }
      });
    });

    // Find the intent with highest weight
    const topIntent = intents.reduce((max, intent) => 
      intent.weight > max.weight ? intent : max
    );

    const confidence = Math.min(0.9, Math.max(0.3, topIntent.weight / 3));

    return {
      type: topIntent.weight > 0 ? topIntent.type : 'general',
      confidence: confidence,
      allIntents: intents.filter(i => i.weight > 0).sort((a, b) => b.weight - a.weight)
    };
  }

  // Generate current conditions response
  async generateCurrentConditionsResponse(message, data, city) {
    const aqi = data?.aqi?.aqi || 0;
    const category = data?.aqi?.category || 'Unknown';
    
    const aiResponse = await geminiService.generateResponse(message, data, city);
    
    return {
      text: aiResponse.message,
      data: {
        type: 'aqi_status',
        aqi: aqi,
        category: category,
        location: city,
        timestamp: data?.timestamp || new Date().toISOString()
      },
      source: aiResponse.success ? 'gemini' : 'fallback'
    };
  }

  // Generate health advice response
  async generateHealthAdviceResponse(message, data, city) {
    const aqi = data?.aqi?.aqi || 0;
    
    const recommendations = this.getHealthRecommendations(aqi);
    const aiResponse = await geminiService.generateResponse(message, data, city);
    
    return {
      text: aiResponse.message,
      data: {
        type: 'health_recommendation',
        recommendations: recommendations,
        aqi: aqi,
        location: city
      },
      source: aiResponse.success ? 'gemini' : 'fallback'
    };
  }

  // Generate activity safety response
  async generateActivitySafetyResponse(message, data, city) {
    const aqi = data?.aqi?.aqi || 0;
    const activityAdvice = this.getActivityAdvice(aqi);
    
    const aiResponse = await geminiService.generateResponse(message, data, city);
    
    return {
      text: aiResponse.message,
      data: {
        type: 'health_recommendation',
        recommendations: [activityAdvice],
        aqi: aqi,
        location: city
      },
      source: aiResponse.success ? 'gemini' : 'fallback'
    };
  }

  // Generate pollutant details response
  async generatePollutantDetailsResponse(message, data, city) {
    const pollutants = data?.air_quality || {};
    
    const aiResponse = await geminiService.generateResponse(message, data, city);
    
    return {
      text: aiResponse.message,
      data: {
        type: 'pollutant_levels',
        pollutants: pollutants,
        location: city,
        timestamp: data?.timestamp || new Date().toISOString()
      },
      source: aiResponse.success ? 'gemini' : 'fallback'
    };
  }

  // Generate weather info response
  async generateWeatherInfoResponse(message, data, city) {
    const weather = data?.weather || {};
    
    const aiResponse = await geminiService.generateResponse(message, data, city);
    
    return {
      text: aiResponse.message,
      data: {
        type: 'weather_info',
        temperature: weather.temperature,
        humidity: weather.humidity,
        windSpeed: weather.wind_speed,
        condition: weather.condition || 'Unknown',
        location: city
      },
      source: aiResponse.success ? 'gemini' : 'fallback'
    };
  }

  // Generate forecast response
  async generateForecastResponse(message, data, city) {
    const aiResponse = await geminiService.generateResponse(message, data, city);
    
    // Note: For actual forecast, you'd call the forecast API endpoint
    return {
      text: aiResponse.message + "\n\nFor detailed 24-hour forecasts, check the Forecast section in the app! 📊",
      data: null,
      source: aiResponse.success ? 'gemini' : 'fallback'
    };
  }

  // Generate general response
  async generateGeneralResponse(message, data, city) {
    const aiResponse = await geminiService.generateResponse(message, data, city);
    
    return {
      text: aiResponse.message,
      data: null,
      source: aiResponse.success ? 'gemini' : 'fallback'
    };
  }

  // Helper functions
  getAQIEmoji(aqi) {
    if (aqi <= 50) return '🟢';
    if (aqi <= 100) return '🟡';
    if (aqi <= 200) return '🟠';
    if (aqi <= 300) return '🔴';
    if (aqi <= 400) return '🟣';
    return '🟤';
  }

  getHealthRecommendations(aqi) {
    if (aqi <= 50) {
      return ["Air quality is excellent! Perfect for all outdoor activities.", "No health precautions needed."];
    } else if (aqi <= 100) {
      return ["Good air quality for most people.", "Sensitive individuals should monitor symptoms."];
    } else if (aqi <= 200) {
      return ["Limit prolonged outdoor activities.", "Consider wearing a mask if sensitive.", "Keep windows closed."];
    } else if (aqi <= 300) {
      return ["Avoid outdoor activities.", "Wear N95 mask when going outside.", "Use air purifiers indoors.", "Seek medical help if experiencing symptoms."];
    } else {
      return ["Stay indoors.", "Emergency health alert - seek immediate medical attention if experiencing symptoms.", "Use air purifiers and keep all windows closed."];
    }
  }

  getActivityAdvice(aqi) {
    if (aqi <= 50) return "Perfect conditions for all outdoor activities! 🏃‍♂️";
    if (aqi <= 100) return "Good for most activities, sensitive individuals should monitor symptoms. 🚶‍♀️";
    if (aqi <= 200) return "Limit intense outdoor activities, especially for sensitive groups. ⚠️";
    if (aqi <= 300) return "Avoid outdoor activities, exercise indoors instead. 🏠";
    return "Stay indoors, avoid all outdoor activities. 🚫";
  }

  shouldRefreshData(data) {
    if (!data || !data.timestamp) return true;
    
    const dataAge = Date.now() - new Date(data.timestamp).getTime();
    const maxAge = 10 * 60 * 1000; // 10 minutes
    
    return dataAge > maxAge;
  }
}

export default new ChatService();
