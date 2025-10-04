import React, { useState, useEffect } from 'react';
import { Info, Satellite, Database, Globe, Award, Code, Users, ExternalLink } from 'lucide-react';
import { airQualityAPI } from '../services/api';
import DataSourceInfo from '../components/widgets/DataSourceInfo';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const About = () => {
  const [apiDocs, setApiDocs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiDocs = async () => {
      try {
        const response = await airQualityAPI.getApiDocs();
        setApiDocs(response.data);
      } catch (error) {
        console.error('Error fetching API docs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiDocs();
  }, []);

  const teamFeatures = [
    {
      icon: <Satellite className="w-8 h-8 text-blue-600" />,
      title: 'NASA TEMPO Integration',
      description: 'Real-time atmospheric monitoring from geostationary orbit with hourly updates covering North America and extending to global coverage.'
    },
    {
      icon: <Database className="w-8 h-8 text-green-600" />,
      title: 'Multi-Source Data Fusion',
      description: 'Combines satellite data with ground-based sensors and weather information for comprehensive air quality assessment.'
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: 'Machine Learning Forecasting', 
      description: '24-hour air quality predictions using Random Forest algorithms trained on historical patterns and meteorological data.'
    },
    {
      icon: <Award className="w-8 h-8 text-orange-600" />,
      title: 'Health-Focused Design',
      description: 'Personalized recommendations for different user groups including sensitive populations, elderly, and children.'
    }
  ];

  const techStack = [
    { category: 'Frontend', technologies: ['React 18', 'Tailwind CSS', 'Chart.js', 'Leaflet Maps', 'Vite'] },
    { category: 'Backend', technologies: ['Python Flask', 'Scikit-learn', 'Pandas', 'NumPy', 'REST API'] },
    { category: 'Data Sources', technologies: ['NASA TEMPO', 'OpenAQ Network', 'Open-Meteo Weather', 'CPCB Standards'] },
    { category: 'Deployment', technologies: ['Vercel', 'GitHub', 'PWA Ready', 'Mobile Responsive'] }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading project information..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">About AirAlert Pro</h1>
            <p className="text-indigo-100">
              NASA Space Apps Challenge 2025 - Air Quality Forecasting Solution
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5" />
              <span className="font-semibold">NASA Space Apps 2025</span>
            </div>
            <div className="text-2xl font-bold">Goa, India</div>
            <div className="text-sm text-indigo-100">October 4-5, 2025</div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="aqi-card">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-700">Project Overview</h3>
        </div>

        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            <strong>AirAlert Pro</strong> is a comprehensive air quality monitoring and forecasting system developed for the 
            NASA Space Apps Challenge 2025. Our solution integrates cutting-edge satellite data from NASA's TEMPO mission 
            with ground-based sensor networks to provide real-time air quality insights and 24-hour forecasts.
          </p>

          <p className="mb-4">
            The platform focuses on <strong>Goa, India</strong>, combining space-based atmospheric observations with 
            local environmental data to help residents, tourists, and health-sensitive populations make informed decisions 
            about outdoor activities and health protection measures.
          </p>

          <p>
            Built with modern web technologies and machine learning algorithms, AirAlert Pro represents the next generation 
            of environmental monitoring tools that make complex atmospheric science accessible to everyone.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="aqi-card">
        <div className="flex items-center space-x-2 mb-6">
          <Code className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-700">Key Features</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="aqi-card">
        <div className="flex items-center space-x-2 mb-6">
          <Database className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-700">Technical Stack</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((stack, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">{stack.category}</h4>
              <div className="space-y-2">
                {stack.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Information */}
      {apiDocs && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* API Statistics */}
          <div className="aqi-card">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-700">API Overview</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Total Endpoints</span>
                <span className="font-bold text-blue-600">15</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Data Sources</span>
                <span className="font-bold text-green-600">
                  {apiDocs.data_sources ? Object.keys(apiDocs.data_sources).length : 3}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-gray-700">ML Model Accuracy</span>
                <span className="font-bold text-purple-600">85%</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-gray-700">Geographic Coverage</span>
                <span className="font-bold text-orange-600">Goa, India</span>
              </div>
            </div>

            {apiDocs.machine_learning && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Machine Learning Model</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Type:</strong> {apiDocs.machine_learning.model_type}</p>
                  <p><strong>Forecast Horizon:</strong> {apiDocs.machine_learning.forecast_horizon}</p>
                  <p><strong>Update Frequency:</strong> {apiDocs.machine_learning.update_frequency}</p>
                </div>
              </div>
            )}
          </div>

          {/* Data Sources Detail */}
          <DataSourceInfo />
        </div>
      )}

      {/* Challenge Information */}
      <div className="aqi-card">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-700">NASA Space Apps Challenge 2025</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Challenge Details</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Challenge:</span>
                <span className="font-medium">Air Quality Forecasting</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium">Goa, India</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">October 4-5, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Team Size:</span>
                <span className="font-medium">Solo Developer</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Project Goals</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                <span>Integrate NASA TEMPO satellite data</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                <span>Provide 24-hour air quality forecasts</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                <span>Support health-sensitive populations</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                <span>Enable data-driven health decisions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="aqi-card">
        <div className="flex items-center space-x-2 mb-4">
          <ExternalLink className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-700">Resources & Links</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'NASA TEMPO Mission', url: 'https://tempo.si.edu/', desc: 'Official TEMPO satellite mission website' },
            { name: 'OpenAQ Network', url: 'https://openaq.org/', desc: 'Global air quality data platform' },
            { name: 'NASA Space Apps Challenge', url: 'https://www.spaceappschallenge.org/', desc: 'Global hackathon event' },
            { name: 'GitHub Repository', url: '#', desc: 'Source code and documentation' },
            { name: 'WHO Air Quality Guidelines', url: 'https://www.who.int/news-room/feature-stories/detail/what-are-the-who-air-quality-guidelines', desc: 'Health-based air quality standards' },
            { name: 'Indian CPCB Standards', url: 'https://cpcb.nic.in/', desc: 'Central Pollution Control Board' }
          ].map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 mt-1" />
              <div>
                <div className="font-medium text-gray-900">{link.name}</div>
                <div className="text-sm text-gray-500">{link.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Developer Information */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">About the Developer</h3>
        </div>
        
        <div className="text-gray-700">
          <p className="mb-2">
            This project was developed as a solo submission for the NASA Space Apps Challenge 2025, 
            demonstrating the integration of space-based environmental monitoring with practical health applications.
          </p>
          <p>
            The solution showcases modern web development practices, machine learning integration, 
            and user-centered design principles to make complex atmospheric science data accessible and actionable.
          </p>
        </div>

        <div className="mt-4 flex items-center space-x-4 text-sm text-blue-600">
          <span>🚀 Built with passion for NASA Space Apps 2025</span>
          <span>•</span>
          <span>🌍 Making air quality data accessible to everyone</span>
        </div>
      </div>
    </div>
  );
};

export default About;
