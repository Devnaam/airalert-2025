import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AirQualityProvider } from './context/AirQualityContext.jsx';
import Header from './components/layout/Header.jsx';
import Navigation from './components/layout/Navigation.jsx';
import Dashboard from './pages/Dashboard.jsx';

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
            </Routes>
          </div>
        </div>
      </div>
    </AirQualityProvider>
  );
}

export default App;
