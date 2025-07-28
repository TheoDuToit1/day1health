import React from 'react';
import { Search, FileText, Shield, Stethoscope } from 'lucide-react';

interface HowItWorksProps {
  isSidebarCollapsed: boolean;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ isSidebarCollapsed }) => {
  const steps = [
    {
      icon: Search,
      title: "Choose a Plan",
      description: "Browse our transparent plans and select the one that fits your needs and budget. No hidden fees, just clear pricing.",
      color: "bg-blue-500"
    },
    {
      icon: FileText,
      title: "Apply Online or By Phone",
      description: "Quick 5-minute application online or call us. We'll guide you through every step with our friendly consultants.",
      color: "bg-green-500"
    },
    {
      icon: Shield,
      title: "Start Your Cover from Day 1",
      description: "No waiting periods for accidents and emergencies. Your cover starts immediately after approval and payment.",
      color: "bg-yellow-500"
    },
    {
      icon: Stethoscope,
      title: "Visit Any Network Provider",
      description: "Use your cover at thousands of healthcare providers across South Africa. Present your membership card and you're covered.",
      color: "bg-purple-500"
    }
  ];

  return (
    <section 
      id="how-it-works" 
      className={`py-20 bg-white relative overflow-hidden transition-all duration-500 ${
        isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-40'
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Getting Covered is Simple
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From application to using your benefits, we've made healthcare coverage as simple as possible.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-purple-500 opacity-30"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center group">
                  {/* Step Number */}
                  <div className="relative mb-6">
                    <div className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-100">
                      <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of South Africans who trust Day1Health for their healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Start Application
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Call 087 610 0600
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Separator */}
      <svg className="absolute bottom-0 left-0 w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,120 L1200,120 L1200,60 Q600,0 0,60 Z" fill="#f9fafb"></path>
      </svg>
    </section>
  );
};

export default HowItWorks;