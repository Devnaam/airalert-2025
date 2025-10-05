import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AirQualityProvider } from './context/AirQualityContext';

// Layout Components
import HomeNavbar from './components/layout/HomeNavbar';
import AppNavbar from './components/layout/AppNavbar';
import Navigation from './components/layout/Navigation';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Forecast from './pages/Forecast';
import Trends from './pages/Trends';
import Alerts from './pages/Alerts';
import Health from './pages/Health';
import About from './pages/About';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Home page has different layout
  if (isHomePage) {
    return <Home />;
  }

  // App pages have sidebar + navbar layout
  return (
    <AirQualityProvider>
      <div className="min-h-screen bg-gray-50">
        {/* App Navigation */}
        <AppNavbar />
        
        {/* Main Layout */}
        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block w-64 bg-white shadow-sm min-h-screen">
            <Navigation />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/health" element={<Health />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>

        {/* Mobile Navigation for App Pages */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around">
            {[
              { to: '/dashboard', icon: '📊', label: 'Dashboard' },
              { to: '/forecast', icon: '📈', label: 'Forecast' },
              { to: '/trends', icon: '📉', label: 'Trends' },
              { to: '/alerts', icon: '🔔', label: 'Alerts' },
              { to: '/health', icon: '❤️', label: 'Health' }
            ].map(({ to, icon, label }) => (
              <a
                key={to}
                href={to}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </AirQualityProvider>
  );
}

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </div>
  );
}

export default App;
