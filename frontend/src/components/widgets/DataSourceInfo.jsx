import React, { useState, useEffect } from 'react';
import { Database, Satellite, Activity, Cloud, CheckCircle, AlertTriangle } from 'lucide-react';
import { airQualityAPI } from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';

const DataSourceInfo = ({ className = '' }) => {
  const [validation, setValidation] = useState(null);
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [validationResponse, docsResponse] = await Promise.all([
          airQualityAPI.getDataValidation(),
          airQualityAPI.getApiDocs()
        ]);
        
        setValidation(validationResponse.data.data);
        setDocs(docsResponse.data);
      } catch (error) {
        console.error('Error fetching data source info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`aqi-card ${className}`}>
        <LoadingSpinner text="Loading data sources..." />
      </div>
    );
  }

  const getSourceIcon = (sourceType) => {
    switch (sourceType) {
      case 'satellite':
        return <Satellite className="w-5 h-5 text-blue-600" />;
      case 'ground':
        return <Activity className="w-5 h-5 text-green-600" />;
      case 'weather':
        return <Cloud className="w-5 h-5 text-purple-600" />;
      default:
        return <Database className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCorrelationColor = (correlation) => {
    switch (correlation) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`aqi-card ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Database className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-700">Data Sources</h3>
      </div>

      {/* Data Validation */}
      {validation && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">Data Validation</h4>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCorrelationColor(validation.correlation)}`}>
              {validation.correlation} correlation
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700 font-medium">Satellite NO₂</div>
              <div className="text-lg font-bold text-blue-900">
                {validation.satellite_no2 ? `${validation.satellite_no2.toFixed(1)} µg/m³` : 'N/A'}
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-700 font-medium">Ground NO₂</div>
              <div className="text-lg font-bold text-green-900">
                {validation.ground_no2 ? `${validation.ground_no2.toFixed(1)} µg/m³` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Sources */}
      {docs && docs.data_sources && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Active Data Sources</h4>
          
          {Object.entries(docs.data_sources).map(([key, source]) => (
            <div key={key} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                  {getSourceIcon(key)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">{source.name}</h5>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    {source.spatial_resolution && (
                      <div>
                        <span className="font-medium">Resolution:</span> {source.spatial_resolution}
                      </div>
                    )}
                    {source.temporal_resolution && (
                      <div>
                        <span className="font-medium">Frequency:</span> {source.temporal_resolution}
                      </div>
                    )}
                    {source.data_latency && (
                      <div>
                        <span className="font-medium">Latency:</span> {source.data_latency}
                      </div>
                    )}
                    {source.coverage && (
                      <div>
                        <span className="font-medium">Coverage:</span> {source.coverage}
                      </div>
                    )}
                  </div>

                  {source.parameters && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-700 mb-1">Parameters:</div>
                      <div className="flex flex-wrap gap-1">
                        {source.parameters.map((param, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {param}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Citation Info */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div className="font-medium mb-1">Built for NASA Space Apps Challenge 2025</div>
          <div>Data sources properly cited and documented in API</div>
        </div>
      </div>
    </div>
  );
};

export default DataSourceInfo;
