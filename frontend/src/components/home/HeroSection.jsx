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
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col sm:flex-row items-center justify-between">
        {/* Left Content */}
        <div className="text-center sm:text-left space-y-6 max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
            🚀 NASA Space Apps Challenge 2025
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-800 leading-tight">
            AirAlert{" "}
            <span className="text-blue-600">
              Pro
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Real-time air quality monitoring and forecasting for{" "}
            <span className="font-semibold text-blue-700">Goa, India</span> — powered by{" "}
            <span className="font-semibold text-blue-700">NASA TEMPO satellite data</span> and AI.
          </p>

          {/* AQI Info */}
          {!loading && currentData?.aqi && (
            <div className="flex items-center justify-center sm:justify-start space-x-8 bg-white shadow-md rounded-2xl p-5 border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {Math.round(currentData.aqi.aqi)}
                </div>
                <div className="text-sm text-gray-500">Current AQI</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div
                  className="text-lg font-semibold mb-1"
                  style={{ color: currentData.aqi.color }}
                >
                  {currentData.aqi.category}
                </div>
                <div className="text-sm text-gray-500">Air Quality</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700 mb-1">Goa</div>
                <div className="text-sm text-gray-500">Location</div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-5 pt-4">
            <Link
              to="/dashboard"
              className="group bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md"
            >
              <span className="flex items-center space-x-2">
                <span>Explore Dashboard</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </Link>

            <button className="group flex items-center space-x-3 bg-white border border-blue-200 text-blue-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-sm">
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

        {/* Right Image */}
        <div className="mt-10 sm:mt-0 sm:ml-8 w-full sm:w-1/2 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80"
            alt="Air Quality Visualization"
            className="rounded-3xl shadow-xl w-full max-w-md border border-blue-100 hover:scale-105 transition-transform duration-500"
          />
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
