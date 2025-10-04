import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AirQualityProvider } from './context/AirQualityContext.jsx';
import Header from './components/layout/Header.jsx';
import Navigation from './components/layout/Navigation.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Forecast from './pages/Forecast.jsx';
import Trends from './pages/Trends.jsx';
import Alerts from './pages/Alerts.jsx';
import Health from './pages/Health.jsx';
import About from './pages/About.jsx';

function App() {
  return (
    <AirQualityProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex">
          <div className="hidden md:block w-64 bg-white shadow-sm min-h-screen">
            <Navigation />
          </div>
          
          <div className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/health" element={<Health />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </div>
    </AirQualityProvider>
  );
}

export default App;
