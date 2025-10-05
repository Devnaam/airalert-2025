import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, ChevronDown } from "lucide-react";

const HeroSection = ({ scrollY }) => {
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/current");
        const data = await response.json();
        setCurrentData(data.data);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const parallaxOffset = scrollY * 0.3;

  // Weather icon based on condition
  const getWeatherIcon = (condition) => {
    const icons = {
      'clear': '☀️',
      'sunny': '☀️',
      'partly cloudy': '⛅',
      'cloudy': '☁️',
      'overcast': '☁️',
      'rainy': '🌧️',
      'thunderstorm': '⛈️',
      'default': '⛅'
    };
    return icons[condition?.toLowerCase()] || icons.default;
  };

  // Calculate RealFeel (simplified formula)
  const calculateRealFeel = (temp, humidity, windSpeed) => {
    // Simple heat index calculation
    const realFeel = temp + (humidity / 100) * 2 - (windSpeed / 10);
    return Math.round(realFeel);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Background Circles for minimal animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-200/30 rounded-full blur-3xl"
            style={{
              width: `${80 + Math.random() * 120}px`,
              height: `${80 + Math.random() * 120}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Content */}
        <div className="text-center lg:text-left space-y-6 max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
            🚀 NASA Space Apps Challenge 2025
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-800 leading-tight">
            AirAlert{" "}
            <span className="text-blue-600">Pro</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Real-time air quality monitoring and forecasting for{" "}
            <span className="font-semibold text-blue-700">Goa, India</span> — powered by{" "}
            <span className="font-semibold text-blue-700">NASA TEMPO satellite data</span> and AI.
          </p>

          {/* AQI Info */}
          {!loading && currentData?.aqi && (
            <div className="flex items-center justify-center lg:justify-start space-x-8 bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {Math.round(currentData.aqi.aqi)}
                </div>
                <div className="text-sm text-gray-500">Current AQI</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div
                  className="text-lg font-semibold mb-1"
                  style={{ color: currentData.aqi.color }}
                >
                  {currentData.aqi.category}
                </div>
                <div className="text-sm text-gray-500">Air Quality</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700 mb-1">Goa</div>
                <div className="text-sm text-gray-500">Location</div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-5 pt-4">
            <Link
              to="/dashboard"
              className="group bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center space-x-2">
                <span>Explore Dashboard</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </Link>

            <button className="group flex items-center space-x-3 bg-white border border-blue-200 text-blue-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md">
              <Play className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
            {[
              { icon: "🛰️", label: "TEMPO Data", desc: "NASA verified" },
              { icon: "🤖", label: "AI Forecast", desc: "24-hour predictions" },
              { icon: "🏥", label: "Health Alerts", desc: "Instant updates" },
              { icon: "📱", label: "Responsive", desc: "Works everywhere" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-gray-100 text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-gray-800 font-medium text-sm">{item.label}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Weather Card */}
        <div className="mt-10 lg:mt-0 lg:ml-8 w-full lg:w-1/2 flex justify-center">
          {loading ? (
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-white shadow-2xl w-80 h-60 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white/80">Loading weather data...</p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-white shadow-2xl w-80 hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
              {/* Location */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">
                  {currentData?.location?.name || "Panaji"}
                </h2>
                <p className="text-blue-100 text-sm">
                  {currentData?.location?.region || "Goa, India"}
                </p>
              </div>

              {/* Weather Icon and Temperature */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">
                    {getWeatherIcon(currentData?.weather?.condition)}
                  </div>
                  <div className="text-5xl font-bold">
                    {currentData?.weather?.temperature || "29"}°
                    <span className="text-2xl font-normal">C</span>
                  </div>
                </div>
              </div>

              {/* Weather Condition */}
              <div className="mb-4">
                <p className="text-blue-100 text-lg capitalize">
                  {currentData?.weather?.condition || "Partly Cloudy"}
                </p>
              </div>

              {/* RealFeel Temperature */}
              <div className="border-t border-blue-300/30 pt-4">
                <p className="text-blue-100 text-sm">
                  RealFeel®{' '}
                  <span className="font-semibold text-white">
                    {currentData?.weather ? 
                      calculateRealFeel(
                        currentData.weather.temperature,
                        currentData.weather.humidity,
                        currentData.weather.wind_speed
                      ) : 36}°
                  </span>
                </p>
              </div>

              {/* Additional Weather Info */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-blue-100 text-xs">Humidity</div>
                  <div className="font-semibold">
                    {currentData?.weather?.humidity || "72"}%
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-blue-100 text-xs">Wind</div>
                  <div className="font-semibold">
                    {currentData?.weather?.wind_speed || "12"} km/h
                  </div>
                </div>
              </div>

              {/* Data Source Badge */}
              <div className="mt-4 text-center">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-xs px-3 py-1 rounded-full text-blue-100">
                  🛰️ NASA & OpenWeather Data
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-blue-500" />
      </div>

      {/* Floating Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </section>
  );
};

export default HeroSection;
