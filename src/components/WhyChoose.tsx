import React from 'react';
import { Shield, Clock, Users, Heart, Globe, Award } from 'lucide-react';

interface WhyChooseProps {
  isSidebarCollapsed: boolean;
}

const WhyChoose: React.FC<WhyChooseProps> = ({ isSidebarCollapsed }) => {
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
      color: "text-purple-600"
    },
    {
      icon: Globe,
      title: "Nationwide Network",
      description: "Access thousands of healthcare providers across South Africa. Use your cover wherever you are.",
      color: "text-yellow-600"
    },
    {
      icon: Users,
      title: "Inclusive & Accessible",
      description: "Designed for all South Africans with affordable options and support in multiple languages.",
      color: "text-red-600"
    },
    {
      icon: Heart,
      title: "24/7 Support",
      description: "Round-the-clock emergency assistance and member support. We're here when you need us most.",
      color: "text-indigo-600"
    }
  ];

  return (
    <section 
      id="why-choose" 
      className={`py-20 bg-gray-50 transition-all duration-500 ${
        isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-40'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
            Why Choose Day1Health
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Healthcare That Works for You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe every South African deserves access to quality healthcare. Here's what makes us different.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                <div className="text-gray-600">Happy Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">5,000+</div>
                <div className="text-gray-600">Network Providers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-600">Emergency Support</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default WhyChoose;