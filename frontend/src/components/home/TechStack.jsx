import React, { useState } from "react";
import { Code2, Database, Globe, Smartphone, Cloud, Cpu } from "lucide-react";

const TechStack = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const techCategories = [
    {
      category: "Frontend",
      icon: <Code2 className="w-8 h-8" />,
      technologies: ["⚛️", "🎨", "📊", "🗺️", "⚡"],
    },
    {
      category: "Backend", 
      icon: <Database className="w-8 h-8" />,
      technologies: ["🐍", "🤖", "🐼", "🔢", "🔌"],
    },
    {
      category: "Data Sources",
      icon: <Globe className="w-8 h-8" />,
      technologies: ["🛰️", "📡", "🌤️", "📋", "🏥"],
    },
    {
      category: "AI/ML",
      icon: <Cpu className="w-8 h-8" />,
      technologies: ["🌲", "📈", "🔍", "⚙️", "✅"],
    },
  ];

  return (
    <section id="technology" className="py-24 bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={`bg-tech-${i}`}
            className="absolute text-3xl text-[#FF7F50] animate-float-bg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            {['⚛️', '🐍', '🛰️', '🤖', '📊', '🔌', '🌤️', '⚡', '🐼', '🔢', '📡', '📋', '🏥', '🌲', '📈'][i]}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-white border-2 border-[#FF7F50] text-[#FF7F50] rounded-full text-sm font-medium mb-6 shadow-lg">
            <Cpu className="w-4 h-4 mr-2" />
            Technology Stack
          </div>
          
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Powered by{" "}
            <span className="text-[#FF7F50]">Innovation</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Built with cutting-edge technologies and integrated with world-class
            data sources to deliver reliable, accurate, and actionable air
            quality insights.
          </p>
        </div>

        {/* Single Rectangle with All Tech Categories */}
        <div className="bg-white border-4 border-[#FF7F50] rounded-3xl p-12 shadow-2xl mb-16 relative overflow-hidden">
          
          {/* Category Headers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {techCategories.map((category, index) => (
              <div
                key={index}
                className="text-center"
                onMouseEnter={() => setHoveredCategory(index)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-[#FF7F50] rounded-2xl text-white shadow-lg transform hover:scale-110 transition-all duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {category.category}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Tech Icons Display Area */}
          <div className="relative h-96 bg-gray-50 rounded-2xl border-2 border-gray-200 overflow-hidden">
            
            {/* Static Display - Show all icons when no hover */}
            {hoveredCategory === null && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-8">
                  {techCategories.map((category, catIndex) => (
                    <div key={catIndex} className="flex flex-col items-center space-y-3">
                      {category.technologies.map((tech, techIndex) => (
                        <div
                          key={`${catIndex}-${techIndex}`}
                          className="text-4xl opacity-60 hover:opacity-100 hover:scale-125 transition-all duration-300 cursor-pointer"
                          style={{
                            animation: `gentle-bounce 3s ease-in-out infinite ${techIndex * 0.2}s`,
                          }}
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Animated Display - Show moving icons on hover */}
            {hoveredCategory !== null && (
              <div className="absolute inset-0">
                {techCategories[hoveredCategory].technologies.map((tech, techIndex) => (
                  <div
                    key={`moving-${techIndex}`}
                    className="absolute text-6xl transition-all duration-500 hover:scale-150 cursor-pointer"
                    style={{
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 80 + 10}%`,
                      animation: `random-move 4s ease-in-out infinite ${techIndex * 0.3}s`,
                      zIndex: 10,
                    }}
                  >
                    {tech}
                  </div>
                ))}
                
                {/* Category Title Overlay */}
                <div className="absolute top-4 left-4 bg-[#FF7F50] text-white px-4 py-2 rounded-lg font-bold text-lg">
                  {techCategories[hoveredCategory].category}
                </div>
              </div>
            )}

            {/* Hover Instructions */}
            <div className="absolute bottom-4 right-4 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
              {hoveredCategory === null ? "Hover on categories above" : "Moving tech stack!"}
            </div>
          </div>

        </div>

        {/* Architecture Highlight */}
        <div className="bg-white border-2 border-[#FF7F50] rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4 text-[#FF7F50]">
              System Architecture
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Scalable, resilient, and performance-optimized architecture
              designed for real-time environmental monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Cloud className="w-10 h-10" />,
                title: "Data Ingestion",
                description: "Multi-source data collection from satellites, ground sensors, and weather stations",
              },
              {
                icon: <Cpu className="w-10 h-10" />,
                title: "AI Processing", 
                description: "Machine learning models for forecasting, pattern recognition, and anomaly detection",
              },
              {
                icon: <Smartphone className="w-10 h-10" />,
                title: "User Interface",
                description: "Responsive web application with real-time updates and interactive visualizations",
              }
            ].map((item, index) => (
              <div
                key={index}
                className="text-center group transform hover:scale-105 transition-all duration-300"
              >
                <div className="mx-auto mb-6 w-20 h-20 bg-[#FF7F50] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:rotate-12 transition-all duration-300">
                  {item.icon}
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-900">
                  {item.title}
                </h4>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { number: "20+", label: "Technologies Used" },
            { number: "24/7", label: "Real-time Monitoring" },
            { number: "5", label: "Goa Cities Covered" },
            { number: "NASA", label: "Satellite Integration" }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-[#FF7F50] transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-3xl font-bold text-[#FF7F50] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float-bg {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
            opacity: 0.1;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.3;
          }
        }
        
        @keyframes gentle-bounce {
          0%, 100% { 
            transform: translateY(0) scale(1); 
          }
          50% { 
            transform: translateY(-10px) scale(1.1); 
          }
        }
        
        @keyframes random-move {
          0% { 
            transform: translateX(0) translateY(0) rotate(0deg) scale(1);
          }
          25% { 
            transform: translateX(-30px) translateY(-20px) rotate(90deg) scale(1.2);
          }
          50% { 
            transform: translateX(20px) translateY(-40px) rotate(180deg) scale(0.9);
          }
          75% { 
            transform: translateX(-10px) translateY(10px) rotate(270deg) scale(1.3);
          }
          100% { 
            transform: translateX(0) translateY(0) rotate(360deg) scale(1);
          }
        }
        
        .animate-float-bg {
          animation: float-bg 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default TechStack;
