import React, { useState } from 'react';
import { Shield, CreditCard, Heart, Users, Check, Phone, Mail, ArrowRight } from 'lucide-react';
import SeniorPackageBuilder from './senior/SeniorPackageBuilder';

interface ToolsTabsProps {
  isSidebarCollapsed: boolean;
}

const ToolsTabs: React.FC<ToolsTabsProps> = ({ isSidebarCollapsed }) => {
  const [activeTab, setActiveTab] = useState('comprehensive');

  const tabs = [
    { id: 'comprehensive', label: 'Comprehensive', icon: Shield },
    { id: 'daytoday', label: 'Day-to-Day', icon: Heart },
    { id: 'hospital', label: 'Hospital', icon: CreditCard },
    { id: 'senior', label: 'Senior Cover', icon: Users }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'comprehensive':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Platinum Elite Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Platinum Elite</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-green-600">R1,199</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Comprehensive coverage with premium benefits</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Private hospital cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited GP visits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Specialist consultations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Chronic medication</span>
                  </li>
                </ul>
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                  Choose Plan
                </button>
              </div>

              {/* Gold Plus Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-200 hover:border-yellow-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Gold Plus</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-yellow-600">R899</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Great value with extensive coverage</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Private hospital cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>15 GP visits per year</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Limited specialist cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Chronic medication (PDP)</span>
                  </li>
                </ul>
                <button className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors">
                  Choose Plan
                </button>
              </div>

              {/* Silver Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 hover:border-gray-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Silver</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-gray-600">R649</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Essential coverage for individuals</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Private hospital cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>6 GP visits per year</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic dentistry</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Acute medication</span>
                  </li>
                </ul>
                <button className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors">
                  Choose Plan
                </button>
              </div>

              {/* Bronze Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200 hover:border-amber-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bronze</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-amber-600">R459</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Basic coverage for essential needs</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Hospital network cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>3 GP visits per year</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Emergency cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic medication</span>
                  </li>
                </ul>
                <button className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">
                  Choose Plan
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'daytoday':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Premium Care */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Care</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">R499<span className="text-sm font-normal text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> Unlimited GP visits</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> Chronic medication</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> Dental & optical</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> 24/7 Virtual doctor</li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Choose Plan</button>
              </div>

              {/* Family Care */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Family Care</h3>
                <div className="text-3xl font-bold text-green-600 mb-4">R399<span className="text-sm font-normal text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> 20 GP visits/year</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Essential medicines</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Child immunizations</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Maternity benefits</li>
                </ul>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Choose Plan</button>
              </div>

              {/* Basic Care */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-200 hover:border-yellow-400 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Care</h3>
                <div className="text-3xl font-bold text-yellow-600 mb-4">R249<span className="text-sm font-normal text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-yellow-500 mr-2" /> 12 GP visits/year</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-yellow-500 mr-2" /> Acute medication</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-yellow-500 mr-2" /> Basic pathology</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-yellow-500 mr-2" /> Telehealth services</li>
                </ul>
                <button className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">Choose Plan</button>
              </div>

              {/* Student Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Student Care</h3>
                <div className="text-3xl font-bold text-purple-600 mb-4">R199<span className="text-sm font-normal text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-purple-500 mr-2" /> 8 GP visits/year</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-purple-500 mr-2" /> Acute medication</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-purple-500 mr-2" /> 24/7 Nurse line</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-purple-500 mr-2" /> Campus clinic discounts</li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">Choose Plan</button>
              </div>
            </div>
          </div>
        );
      
      case 'hospital':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Executive Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200 hover:border-red-400 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Executive</h3>
                <div className="text-3xl font-bold text-red-600 mb-4">R1,899<span className="text-sm font-normal text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-red-500 mr-2" /> Private hospital cover</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-red-500 mr-2" /> Full surgical procedures</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-red-500 mr-2" /> Specialist consultations</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-red-500 mr-2" /> Advanced diagnostics</li>
                </ul>
                <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">Choose Plan</button>
              </div>

              {/* Family Hospital Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Family Cover</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">R1,299<span className="text-sm font-normal text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> Family hospital cover</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> Surgical procedures</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> Maternity benefits</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> Pediatric care</li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Choose Plan</button>
              </div>

              {/* Standard Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Standard</h3>
                <div className="text-3xl font-bold text-green-600 mb-4">R899<span className="text-sm font-normal text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Hospital network cover</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Basic surgical procedures</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Emergency cover</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Limited diagnostics</li>
                </ul>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Choose Plan</button>
              </div>

              {/* Basic Hospital Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 hover:border-gray-400 transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Cover</h3>
                <div className="text-3xl font-bold text-gray-600 mb-4">R599<span className="text-sm font-normal text-gray-500">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-gray-500 mr-2" /> Essential hospital cover</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-gray-500 mr-2" /> Emergency procedures</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-gray-500 mr-2" /> Limited hospital stay</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-gray-500 mr-2" /> Basic diagnostics</li>
                </ul>
                <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition">Choose Plan</button>
              </div>
            </div>
          </div>
        );
      
      case 'senior':
        return <SeniorPackageBuilder />;
      
      default:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Your Quote Today</h3>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
              </div>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  Get My Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </form>
              <div className="flex items-center justify-center space-x-4 mt-8 pt-8 border-t border-gray-200">
                <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>Call Us: 087 610 0600</span>
                </button>
                <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>Email Us</span>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative z-30 -mt-10 transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'
    }`}>
      <div className="container mx-auto px-4">
        {/* Floating Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-md border border-gray-100 p-2 backdrop-blur-sm bg-white/95">
            <div className="flex flex-wrap justify-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-md transform scale-105'
                      : 'text-green-600 border border-transparent hover:border-green-200 hover:bg-green-50'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${
                    activeTab === tab.id ? 'text-white' : 'text-green-600'
                  }`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.replace('Your ', '')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content Panel */}
        <div className="transition-all duration-500 ease-in-out">
          <div className={`transform transition-all duration-500 ${
            activeTab ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsTabs;