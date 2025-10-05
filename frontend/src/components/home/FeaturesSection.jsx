import React from 'react';
import { Satellite, Brain, Heart, Map, BarChart3, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Satellite className="w-8 h-8" />,
      title: 'NASA TEMPO Integration',
      description: 'Real-time atmospheric monitoring from geostationary orbit with hourly updates covering North America and extending to global coverage.',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Forecasting',
      description: '24-hour air quality predictions using Random Forest algorithms trained on historical patterns and meteorological data.',
      color: 'text-primary-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Health-Focused Design',
      description: 'Personalized recommendations for different user groups including sensitive populations, elderly, and children.',
      color: 'text-primary-800',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200'
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: 'Interactive Mapping',
      description: 'Real-time air quality visualization across Goa with location-specific data and geographic insights.',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Historical trend analysis, pattern recognition, and statistical insights for informed decision-making.',
      color: 'text-primary-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Real-time Alerts',
      description: 'Intelligent alert system with customizable thresholds and multi-channel notifications for immediate response.',
      color: 'text-primary-800',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
            Platform Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Built for{' '}
            <span className="text-primary-600">
              Excellence
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive air quality monitoring system combines cutting-edge technology 
            with user-centered design to deliver actionable environmental insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group ${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-xl text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className={`text-xl font-bold ${feature.color} mb-4 group-hover:text-primary-700 transition-colors`}>
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-6">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 bg-primary-100 border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-xs font-bold">👤</span>
                </div>
              ))}
            </div>
            <p className="text-slate-600">
              <span className="font-semibold text-slate-900">Join 1,000+</span> researchers and environmentalists
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
