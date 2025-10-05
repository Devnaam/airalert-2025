import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, RefreshCw } from 'lucide-react';
import { useAirQualityContext } from '../../context/AirQualityContext';

const AppNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { refreshData, loading } = useAirQualityContext();

  const navItems = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/forecast', icon: '📈', label: 'Forecast' },
    { to: '/trends', icon: '📉', label: 'Trends' },
    { to: '/alerts', icon: '🔔', label: 'Alerts' },
    { to: '/health', icon: '❤️', label: 'Health' },
    { to: '/about', icon: 'ℹ️', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">🌬️</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">AirAlert Pro</h1>
              <p className="text-xs text-gray-500">NASA Space Apps 2025</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Refresh Button */}
            <button
              onClick={refreshData}
              disabled={loading}
              className={`p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ${
                loading ? 'animate-spin' : ''
              }`}
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Home Button */}
            <Link
              to="/"
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(to)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </Link>
              ))}
              
              <Link
                to="/"
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;
