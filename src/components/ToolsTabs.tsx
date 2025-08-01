import React, { useState } from 'react';
import { Shield, CreditCard, Heart, Users, Check, Phone, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SeniorPackageBuilder from './senior/SeniorPackageBuilder';
import { useTheme } from '../contexts/ThemeContext';

interface ToolsTabsProps {
  isSidebarCollapsed: boolean;
}

const ToolsTabs: React.FC<ToolsTabsProps> = ({ isSidebarCollapsed }) => {
  const [activeTab, setActiveTab] = useState('comprehensive');
  const { isDark } = useTheme();

  const tabs = [
    { 
      id: 'comprehensive', 
      label: 'Comprehensive', 
      icon: Shield,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-200'
    },
    { 
      id: 'daytoday', 
      label: 'Day-to-Day', 
      icon: Heart,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-200'
    },
    { 
      id: 'hospital', 
      label: 'Hospital', 
      icon: CreditCard,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      hoverBg: 'hover:bg-green-200'
    },
    { 
      id: 'senior', 
      label: 'Your ChoicePlan', 
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      hoverBg: 'hover:bg-green-200'
    }
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
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Platinum Elite</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-green-600">R1,199</span>
                    <span className={`ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Comprehensive coverage with premium benefits</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Private hospital cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Unlimited GP visits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Specialist consultations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Chronic medication</span>
                  </li>
                </ul>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Choose Plan
                </button>
              </motion.div>

              {/* Gold Plus Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-blue-700 hover:border-blue-500' 
                    : 'bg-white border-blue-200 hover:border-blue-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Gold Plus</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-blue-600">R899</span>
                    <span className={`ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Great value with extensive coverage</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Private hospital cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>15 GP visits per year</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Limited specialist cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Chronic medication (PDP)</span>
                  </li>
                </ul>
                <motion.button 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>

              {/* Silver Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 hover:border-gray-500' 
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Silver</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-blue-600">R649</span>
                    <span className={`ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Essential coverage for individuals</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Private hospital cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>6 GP visits per year</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Basic dentistry</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Acute medication</span>
                  </li>
                </ul>
                <motion.button 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>

              {/* Bronze Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Bronze</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-green-600">R459</span>
                    <span className={`ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Basic coverage for essential needs</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Hospital network cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>3 GP visits per year</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Emergency cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Basic medication</span>
                  </li>
                </ul>
                <motion.button 
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>
            </div>
          </div>
        );
      
      case 'daytoday':
        return (
          <motion.div 
            className="max-w-7xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Premium Care */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-blue-700 hover:border-blue-500' 
                    : 'bg-white border-blue-200 hover:border-blue-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Premium Care</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">R499<span className={`text-sm font-normal ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Unlimited GP visits</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Chronic medication</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Dental & optical</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>24/7 Virtual doctor</span></li>
                </ul>
                <motion.button 
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>

              {/* Family Care */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Family Care</h3>
                <div className="text-3xl font-bold text-green-600 mb-4">R399<span className={`text-sm font-normal ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>20 GP visits/year</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Essential medicines</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Child immunizations</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Maternity benefits</span></li>
                </ul>
                <motion.button 
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>

              {/* Basic Care */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-blue-700 hover:border-blue-500' 
                    : 'bg-white border-blue-200 hover:border-blue-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Basic Care</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">R249<span className={`text-sm font-normal ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>12 GP visits/year</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Acute medication</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Basic pathology</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Telehealth services</span></li>
                </ul>
                <motion.button 
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>

              {/* Student Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Student Care</h3>
                <div className="text-3xl font-bold text-green-600 mb-4">R199<span className={`text-sm font-normal ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>8 GP visits/year</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Acute medication</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>24/7 Nurse line</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Campus clinic discounts</span></li>
                </ul>
                <motion.button 
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        );
      
      case 'hospital':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Executive Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-blue-700 hover:border-blue-500' 
                    : 'bg-white border-blue-200 hover:border-blue-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Executive</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">R1,899<span className={`text-sm font-normal ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Private hospital cover</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Full surgical procedures</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Specialist consultations</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Advanced diagnostics</span></li>
                </ul>
                <motion.button 
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>

              {/* Family Hospital Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-blue-700 hover:border-blue-500' 
                    : 'bg-white border-blue-200 hover:border-blue-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Family Cover</h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">R1,299<span className={`text-sm font-normal ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Family hospital cover</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Surgical procedures</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Maternity benefits</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-blue-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Pediatric care</span></li>
                </ul>
                <motion.button 
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>

              {/* Standard Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Standard</h3>
                <div className="text-3xl font-bold text-green-600 mb-4">R899<span className={`text-sm font-normal ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Hospital network cover</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Basic surgical procedures</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Emergency cover</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Limited diagnostics</span></li>
                </ul>
                <motion.button 
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>

              {/* Basic Hospital Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 hover:border-gray-500' 
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                }}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Basic Cover</h3>
                <div className={`text-3xl font-bold mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>R599<span className={`text-sm font-normal ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><Check className="w-5 h-5 text-gray-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Essential hospital cover</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-gray-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Emergency procedures</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-gray-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Limited hospital stay</span></li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-gray-500 mr-2" /> <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Basic diagnostics</span></li>
                </ul>
                <motion.button 
                  className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Choose Plan
                </motion.button>
              </motion.div>
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
                  <span>Call Us: 0876 100 600</span>
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
    <div className={`relative z-30 -mt-20 transition-all duration-700 ease-in-out ${
      isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-64'
    } ${
      isSidebarCollapsed ? 'lg:w-[calc(100%-6rem)]' : 'lg:w-[calc(100%-16rem)]'
    } ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}
    style={{
      transition: 'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }}>
      <div className="container mx-auto px-4">
        {/* Floating Tabs */}
        <div className="flex justify-center mb-12">
          <div className={`rounded-2xl shadow-lg p-3 backdrop-blur-sm transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800/95 border border-gray-700' 
              : 'bg-white/95 border border-gray-100'
          }`}>
            <div className="flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.id
                      ? isDark 
                        ? 'bg-green-900/50 text-green-400 shadow-sm border border-green-800'
                        : 'bg-green-50 text-green-700 shadow-sm border border-green-100'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-colors ${
                    activeTab === tab.id
                      ? isDark
                        ? 'bg-green-900/50 hover:bg-green-900/70'
                        : tab.bgColor + ' ' + tab.hoverBg
                      : isDark
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : tab.bgColor + ' ' + tab.hoverBg
                  }`}>
                    <tab.icon className={`w-4 h-4 ${
                      activeTab === tab.id 
                        ? isDark 
                          ? 'text-green-400' 
                          : tab.iconColor
                        : isDark
                          ? 'text-gray-400'
                          : 'text-gray-600'
                    }`} />
                  </span>
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content Panel */}
        <div className={`transition-all duration-500 ease-in-out rounded-2xl p-6 ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}>
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