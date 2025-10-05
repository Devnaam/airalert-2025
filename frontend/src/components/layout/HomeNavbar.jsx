import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const HomeNavbar = ({ scrollY }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navbarBg = scrollY > 50 
    ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
    : 'bg-transparent';
    
  const textColor = scrollY > 50 ? 'text-gray-900' : 'text-white';
  const logoColor = scrollY > 50 ? 'from-blue-600 to-green-600' : 'from-white to-gray-100';

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Technology', href: '#technology' },
    { name: 'Live Data', href: '#live-data' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${logoColor} rounded-lg flex items-center justify-center transition-all duration-300`}>
              <span className={`text-xl font-bold ${scrollY > 50 ? 'text-white' : 'text-blue-600'}`}>🌬️</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-300 ${textColor}`}>
                AirAlert Pro
              </h1>
              <p className={`text-xs transition-colors duration-300 ${scrollY > 50 ? 'text-gray-500' : 'text-gray-200'}`}>
                NASA Space Apps 2025
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-blue-500 ${textColor}`}
              >
                {item.name}
              </a>
            ))}
            
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105"
            >
              Launch Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md transition-colors duration-300 ${textColor}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-lg mt-2 p-4 shadow-lg">
            <div className="space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-900 text-sm font-medium hover:text-blue-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Link
                to="/dashboard"
                className="block bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-medium text-center hover:from-blue-600 hover:to-green-600 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Launch Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;
