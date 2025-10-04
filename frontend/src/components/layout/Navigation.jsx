import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Calendar, 
  Bell, 
  Heart, 
  Info 
} from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/forecast', icon: TrendingUp, label: 'Forecast' },
    { to: '/trends', icon: Calendar, label: 'Trends' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
    { to: '/health', icon: Heart, label: 'Health' },
    { to: '/about', icon: Info, label: 'About' },
  ];

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200">
      <div className="px-4 py-6">
        <div className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {/* Render the icon component */}
              {Icon && <Icon className="w-5 h-5" />}
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
