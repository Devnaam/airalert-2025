import React from "react";
import {
  Satellite,
  Brain,
  Heart,
  Map,
  BarChart3,
  Shield,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Satellite className="w-8 h-8" />,
      title: "NASA TEMPO Integration",
      description:
        "Harness real-time atmospheric data directly from NASA’s geostationary satellites to monitor air quality with precision.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Forecasting",
      description:
        "Predict air quality levels 24 hours ahead using advanced machine learning models trained on global datasets.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health Intelligence",
      description:
        "Get actionable health insights and recommendations tailored to your age, region, and sensitivity level.",
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Dynamic Geo Mapping",
      description:
        "Interact with a real-time 3D map that visualizes pollution intensity, hotspots, and air trends across Goa.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Deep Data Analytics",
      description:
        "Dive into historical and comparative air quality data with intuitive graphs and smart insights.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Instant Alerts",
      description:
        "Get notified instantly when air quality reaches unsafe levels through smart adaptive alerting.",
    },
  ];

  return (
    <section className="relative py-28 overflow-hidden">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "linear-gradient(-45deg, #FFF5F2, #FFF1E6, #E8F6FF, #FFE9E0)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 10s ease infinite",
        }}
      ></div>

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes floatUp {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
        {/* Header Section */}
        <div className="mb-20">
          <div className="inline-flex items-center px-6 py-2 bg-[#FF7F50]/10 text-[#FF7F50] rounded-full text-sm font-semibold mb-5">
            <span className="w-2 h-2 bg-[#FF7F50] rounded-full mr-2"></span>
            Core Highlights
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Experience the Future of{" "}
            <span className="text-[#FF7F50]">Air Intelligence</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every feature is designed with precision, innovation, and impact —
            giving you deep visibility into your environment and empowering
            informed decisions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative group p-[2px] rounded-3xl bg-gradient-to-r from-[#FF7F50]/30 via-white/50 to-[#FF7F50]/30 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-500"
            >
              {/* Card Content */}
              <div className="relative bg-white/50 backdrop-blur-xl rounded-3xl p-8 h-full flex flex-col justify-start items-start hover:bg-white/70 transition-all duration-500">
                {/* Floating Glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FF7F50]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[floatUp_5s_ease-in-out_infinite]"></div>

                {/* Icon */}
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF7F50] to-[#E56D3B] text-white shadow-xl mb-6 group-hover:rotate-6 transition-transform duration-500">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-[#FF7F50] transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-700 leading-relaxed text-base group-hover:text-slate-800 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-24 flex flex-col items-center justify-center space-y-6">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-10 h-10 bg-[#FF7F50]/20 border-2 border-white rounded-full flex items-center justify-center"
              >
                <span className="text-[#FF7F50] text-sm">👤</span>
              </div>
            ))}
          </div>

          <p className="text-slate-700 text-base sm:text-lg">
            <span className="font-semibold text-[#FF7F50]">Join 1,000+</span>{" "}
            innovators building a cleaner, healthier tomorrow 🌍
          </p>

          <button className="mt-4 px-6 py-3 bg-gradient-to-r from-[#FF7F50] to-[#E56D3B] text-white font-medium rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-500">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
