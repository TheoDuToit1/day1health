import React from 'react';
import { Shield, Clock, Users, Heart, Globe, Award } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface WhyChooseProps {
  isSidebarCollapsed: boolean;
}

const WhyChoose: React.FC<WhyChooseProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  const features = [
    {
      icon: Shield,
      title: "Real Health Cover",
      description: "Not just gap cover - comprehensive medical insurance that covers doctor visits, medications, hospital stays, and emergencies.",
      color: "text-green-600"
    },
    {
      icon: Clock,
      title: "No Waiting Periods",
      description: "Coverage starts from Day 1 for accidents and emergencies. No waiting around when you need care most.",
      color: "text-blue-600"
    },
    {
      icon: Award,
      title: "Underwritten by African Unity",
      description: "Backed by a trusted South African insurer with decades of experience and financial stability.",
      color: "text-blue-600"
    },
    {
      icon: Globe,
      title: "Nationwide Network",
      description: "Access thousands of healthcare providers across South Africa. Use your cover wherever you are.",
      color: "text-green-600"
    },
    {
      icon: Users,
      title: "Inclusive & Accessible",
      description: "Designed for all South Africans with affordable options and support in multiple languages.",
      color: "text-blue-600"
    },
    {
      icon: Heart,
      title: "24/7 Support",
      description: "Round-the-clock emergency assistance and member support. We're here when you need us most.",
      color: "text-green-600"
    }
  ];

  return (
    <section 
      id="why-choose" 
      className={`py-20 transition-all duration-700 ease-in-out ${
        isDark ? 'bg-gray-900' : 'bg-white'
      } ${
        isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-64'
      } ${
        isSidebarCollapsed ? 'lg:w-[calc(100%-6rem)]' : 'lg:w-[calc(100%-16rem)]'
      }`}
      style={{
        transition: 'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 ${
            isDark 
              ? 'bg-green-900/50 text-green-400' 
              : 'bg-green-100 text-green-800'
          }`}>
            Why Choose Day1Health
          </span>
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Healthcare That Works for You
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We believe every South African deserves access to quality healthcare. Here's what makes us different.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border group ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{feature.title}</h3>
              <p className={`leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className={`rounded-2xl shadow-lg p-8 md:p-12 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Happy Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">5,000+</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Network Providers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Emergency Support</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default WhyChoose;