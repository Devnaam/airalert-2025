import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, ChevronDown, CloudSun } from "lucide-react";

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

  const getWeatherIcon = (condition) => {
    const icons = {
      clear: "☀️",
      sunny: "☀️",
      "partly cloudy": "⛅",
      cloudy: "☁️",
      overcast: "☁️",
      rainy: "🌧️",
      thunderstorm: "⛈️",
      default: "⛅",
    };
    return icons[condition?.toLowerCase()] || icons.default;
  };

  const calculateRealFeel = (temp, humidity, windSpeed) => {
    const realFeel = temp + (humidity / 100) * 2 - windSpeed / 10;
    return Math.round(realFeel);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white">
      {/* Animated Air Quality Elements Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {/* Floating Air Molecules */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`molecule-${i}`}
            className="absolute w-4 h-4 bg-blue-400 rounded-full animate-float-slow opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Rotating Wind Patterns */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`wind-${i}`}
            className="absolute border-2 border-blue-300 rounded-full animate-spin-slow opacity-40"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              animationDuration: `${20 + i * 10}s`,
            }}
          />
        ))}

        {/* Moving Clouds */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`cloud-${i}`}
            className="absolute text-4xl opacity-50 animate-drift"
            style={{
              left: `${-10 + Math.random() * 120}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          >
            ☁️
          </div>
        ))}

        {/* Satellite Path */}
        <div className="absolute top-10 left-0 w-full h-px bg-orange-300 opacity-60">
          <div className="w-6 h-6 bg-orange-500 rounded-full animate-satellite-move flex items-center justify-center text-xs">
            🛰️
          </div>
        </div>

        {/* Data Points */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`data-${i}`}
            className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}

        {/* Air Quality Icons */}
        {[...Array(6)].map((_, i) => {
          const icons = ['🌬️', '🍃', '💨', '🌡️', '📊', '🔬'];
          return (
            <div
              key={`icon-${i}`}
              className="absolute text-2xl opacity-40 animate-bounce-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            >
              {icons[i]}
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Side */}
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-5 py-1.5 rounded-full text-sm font-semibold shadow-sm border border-orange-200">
            🚀 NASA Space Apps Challenge 2025
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900">
            Discover <span className="text-orange-500">Cleaner Skies</span>
            <br /> with <span className="underline decoration-orange-300">AirAlert Pro</span>
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl max-w-lg mx-auto lg:mx-0">
            Real-time air quality insights for{" "}
            <span className="text-orange-500 font-semibold">Goa, India</span> — powered by{" "}
            <span className="text-orange-500 font-semibold">NASA TEMPO</span> satellite data and AI precision.
          </p>

          {/* AQI Panel */}
          {!loading && currentData?.aqi && (
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-6 flex justify-between items-center text-center max-w-md mx-auto lg:mx-0">
              <div>
                <h2 className="text-4xl font-bold text-orange-500">{Math.round(currentData.aqi.aqi)}</h2>
                <p className="text-sm text-gray-600">Current AQI</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: currentData.aqi.color }}
                >
                  {currentData.aqi.category}
                </h2>
                <p className="text-sm text-gray-600">Air Quality</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            <Link
              to="/dashboard"
              className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-1"
            >
              Explore Dashboard →
            </Link>
            <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-orange-300 bg-white text-orange-500 font-semibold hover:bg-orange-50 transition-all shadow-sm hover:shadow-md">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Side Weather Card */}
        <div className="flex-1 mt-16 lg:mt-0 flex justify-center relative">
          {loading ? (
            <div className="bg-orange-500 rounded-3xl shadow-2xl p-10 text-white w-80 h-72 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="opacity-90">Loading data...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl w-80 p-8 relative overflow-hidden transition-all hover:shadow-2xl">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full opacity-60"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-60"></div>

              <div className="mb-6 text-center relative z-10">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentData?.location?.name || "Panaji"}
                </h2>
                <p className="text-gray-500 text-sm">
                  {currentData?.location?.region || "Goa, India"}
                </p>
              </div>

              <div className="flex justify-center mb-6 relative z-10">
                <div className="text-5xl">
                  {getWeatherIcon(currentData?.weather?.condition)}
                </div>
              </div>

              <div className="text-center mb-4 relative z-10">
                <h3 className="text-4xl font-extrabold text-orange-500">
                  {currentData?.weather?.temperature || "29"}°
                  <span className="text-2xl text-gray-700">C</span>
                </h3>
                <p className="capitalize text-gray-600 mt-1">
                  {currentData?.weather?.condition || "Partly Cloudy"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 text-sm relative z-10">
                <div className="bg-blue-50 rounded-lg py-3 text-center border border-blue-100">
                  <p className="text-gray-600 text-xs">Humidity</p>
                  <p className="font-semibold text-blue-600">
                    {currentData?.weather?.humidity || "72"}%
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg py-3 text-center border border-green-100">
                  <p className="text-gray-600 text-xs">Wind</p>
                  <p className="font-semibold text-green-600">
                    {currentData?.weather?.wind_speed || "12"} km/h
                  </p>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-gray-500 relative z-10">
                RealFeel®{" "}
                <span className="font-semibold text-orange-500">
                  {currentData?.weather
                    ? calculateRealFeel(
                        currentData.weather.temperature,
                        currentData.weather.humidity,
                        currentData.weather.wind_speed
                      )
                    : 36}
                  °
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-orange-500" />
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
          }
          25% { 
            transform: translateY(-15px) translateX(10px); 
          }
          50% { 
            transform: translateY(-30px) translateX(0); 
          }
          75% { 
            transform: translateY(-15px) translateX(-10px); 
          }
        }
        
        @keyframes spin-slow {
          from { 
            transform: rotate(0deg); 
          }
          to { 
            transform: rotate(360deg); 
          }
        }
        
        @keyframes drift {
          0% { 
            transform: translateX(-100px); 
          }
          100% { 
            transform: translateX(calc(100vw + 100px)); 
          }
        }
        
        @keyframes satellite-move {
          0% { 
            transform: translateX(0); 
          }
          100% { 
            transform: translateX(100vw); 
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-drift {
          animation: drift 25s linear infinite;
        }
        
        .animate-satellite-move {
          animation: satellite-move 30s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
