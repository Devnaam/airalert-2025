import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import LiveDataPreview from '../components/home/LiveDataPreview';
import TechStack from '../components/home/TechStack';
import CallToAction from '../components/home/CallToAction';
import HomeNavbar from '../components/layout/HomeNavbar';
import ChatWidget from '../components/chat/ChatWidget';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <HomeNavbar scrollY={scrollY} />
      
      {/* Hero Section */}
      <HeroSection scrollY={scrollY} />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Live Data Preview */}
      <LiveDataPreview />
      
      {/* Technology Stack */}
      <TechStack />
      
      {/* Call to Action */}
      <CallToAction />
      
      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🌬️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">AirAlert Pro</h3>
                  <p className="text-slate-400 text-sm">NASA Space Apps 2025</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm max-w-md">
                Advanced air quality monitoring and forecasting system powered by NASA TEMPO satellite data, 
                designed to protect public health in Goa, India.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/forecast" className="hover:text-white transition-colors">Forecast</Link></li>
                <li><Link to="/trends" className="hover:text-white transition-colors">Trends</Link></li>
                <li><Link to="/health" className="hover:text-white transition-colors">Health</Link></li>
                <li><Link to="/alerts" className="hover:text-white transition-colors">Alerts</Link></li>
              </ul>
            </div>
            
            {/* Challenge Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Challenge</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>NASA Space Apps 2025</li>
                <li>Goa, India</li>
                <li>October 4-5, 2025</li>
                <li>Air Quality Forecasting</li>
              </ul>
            </div>

            {/* AI Assistant Promo */}
            <div>
              <h4 className="text-lg font-semibold mb-4">AI Assistant</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p>🤖 Smart air quality advisor</p>
                <p>🏥 Health recommendations</p>
                <p>🌡️ Weather integration</p>
                <p>📱 Available 24/7</p>
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-xs bg-blue-600/20 text-blue-300 px-3 py-2 rounded-lg">
                    <span className="animate-pulse">💬</span>
                    <span>Click the chat icon to start!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 AirAlert Pro - NASA Space Apps Challenge. Built with ❤️ for public health awareness.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Powered by NASA TEMPO • OpenAQ • Gemini AI • Made in Goa, India
            </p>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget - Available on Home Page */}
      <ChatWidget />
    </div>
  );
};

export default Home;
