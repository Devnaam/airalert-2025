import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, RefreshCw } from 'lucide-react';
import { useAirQualityContext } from '../../context/AirQualityContext';

const AppNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { refreshData, loading } = useAirQualityContext();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/forecast', label: 'Forecast' },
    { to: '/trends', label: 'Trends' },
    { to: '/alerts', label: 'Alerts' },
    { to: '/health', label: 'Health' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-xl font-bold">AQ</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-extrabold text-blue-700 tracking-tight">
                AirAlert Pro
              </h1>
              <p className="text-xs text-blue-400 font-medium">NASA Space Apps 2025</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <button
              onClick={refreshData}
              disabled={loading}
              title="Refresh Data"
              className={`p-2 rounded-lg transition-all duration-200 text-blue-600 hover:bg-blue-50 border border-blue-100 ${
                loading ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Home Button */}
            <Link
              to="/"
              className="hidden sm:flex items-center space-x-2 px-4 py-2 border border-blue-100 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-blue-100 py-4 rounded-b-xl shadow-md">
            <div className="space-y-2">
              {navItems.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <span>{label}</span>
                </Link>
              ))}

              {/* Back to Home */}
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <Home className="w-5 h-5 text-blue-600" />
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
