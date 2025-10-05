import React from 'react';
import { Code2, Database, Globe, Smartphone, Cloud, Cpu } from 'lucide-react';

const TechStack = () => {
  const techCategories = [
    {
      category: 'Frontend',
      icon: <Code2 className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      technologies: [
        { name: 'React 18', description: 'Modern UI framework', logo: '⚛️' },
        { name: 'Tailwind CSS', description: 'Utility-first styling', logo: '🎨' },
        { name: 'Chart.js', description: 'Interactive charts', logo: '📊' },
        { name: 'Leaflet Maps', description: 'Interactive mapping', logo: '🗺️' },
        { name: 'Vite', description: 'Fast build tool', logo: '⚡' }
      ]
    },
    {
      category: 'Backend',
      icon: <Database className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      technologies: [
        { name: 'Python Flask', description: 'Web framework', logo: '🐍' },
        { name: 'Scikit-learn', description: 'Machine learning', logo: '🤖' },
        { name: 'Pandas', description: 'Data processing', logo: '🐼' },
        { name: 'NumPy', description: 'Numerical computing', logo: '🔢' },
        { name: 'REST API', description: 'API architecture', logo: '🔌' }
      ]
    },
    {
      category: 'Data Sources',
      icon: <Globe className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      technologies: [
        { name: 'NASA TEMPO', description: 'Satellite data', logo: '🛰️' },
        { name: 'OpenAQ Network', description: 'Ground sensors', logo: '📡' },
        { name: 'Open-Meteo', description: 'Weather data', logo: '🌤️' },
        { name: 'CPCB Standards', description: 'Indian regulations', logo: '📋' },
        { name: 'WHO Guidelines', description: 'Health standards', logo: '🏥' }
      ]
    },
    {
      category: 'AI/ML',
      icon: <Cpu className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      technologies: [
        { name: 'Random Forest', description: 'Forecasting model', logo: '🌲' },
        { name: 'Time Series', description: 'Trend analysis', logo: '📈' },
        { name: 'Pattern Recognition', description: 'Data insights', logo: '🔍' },
        { name: 'Feature Engineering', description: 'Data preparation', logo: '⚙️' },
        { name: 'Model Validation', description: 'Accuracy testing', logo: '✅' }
      ]
    }
  ];

  return (
    <section id="technology" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <Cpu className="w-4 h-4 mr-2" />
            Technology Stack
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Powered by{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Innovation
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Built with cutting-edge technologies and integrated with world-class data sources 
            to deliver reliable, accurate, and actionable air quality insights.
          </p>
        </div>

        {/* Tech Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {techCategories.map((category, index) => (
            <div
              key={index}
              className={`${category.bgColor} rounded-2xl p-8 border-2 border-gray-100 hover:shadow-lg transition-all duration-300`}
            >
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 bg-gradient-to-br ${category.color} rounded-xl text-white`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
              </div>

              {/* Technologies */}
              <div className="grid grid-cols-1 gap-4">
                {category.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl hover:bg-white transition-colors duration-200"
                  >
                    <div className="text-2xl">{tech.logo}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{tech.name}</div>
                      <div className="text-sm text-gray-600">{tech.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Highlight */}
        <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">System Architecture</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Scalable, resilient, and performance-optimized architecture designed for real-time environmental monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/10 rounded-xl p-6 mb-4">
                <Cloud className="w-8 h-8 mx-auto mb-3 text-blue-300" />
                <h4 className="font-semibold mb-2">Data Ingestion</h4>
                <p className="text-sm text-gray-300">
                  Multi-source data collection from satellites, ground sensors, and weather stations
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-xl p-6 mb-4">
                <Cpu className="w-8 h-8 mx-auto mb-3 text-green-300" />
                <h4 className="font-semibold mb-2">AI Processing</h4>
                <p className="text-sm text-gray-300">
                  Machine learning models for forecasting, pattern recognition, and anomaly detection
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 rounded-xl p-6 mb-4">
                <Smartphone className="w-8 h-8 mx-auto mb-3 text-purple-300" />
                <h4 className="font-semibold mb-2">User Interface</h4>
                <p className="text-sm text-gray-300">
                  Responsive web application with real-time updates and interactive visualizations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
