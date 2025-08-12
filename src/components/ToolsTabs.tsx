import React, { useState } from 'react';
import { Shield, CreditCard, Heart, Users, Check, ArrowRight, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { AnimatedPaymentButton } from './ui/animated-payment-button';

interface ToolsTabsProps {
  isSidebarCollapsed: boolean;
}

const ToolsTabs: React.FC<ToolsTabsProps> = ({ isSidebarCollapsed }) => {
  const [activeTab, setActiveTab] = useState('comprehensive');
  const { isDark } = useTheme();

  const tabs = [
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
      id: 'comprehensive', 
      label: 'Comprehensive', 
      icon: Shield,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-200'
    },
    { 
      id: 'senior', 
      label: 'Senior-Plan', 
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      hoverBg: 'hover:bg-green-200'
    }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderTabContent = (): JSX.Element => {
    switch (activeTab) {
      case 'comprehensive':
        return (
          <div className="max-w-7xl mx-auto px-4">
            {/* Styles for the custom Uiverse card */}
            <style>{`
              .card {
                width: min(300px, 100%);
                margin: auto;
                background-color: #f4f5f2;
                background-image: url('https://media.istockphoto.com/id/1372065700/photo/portrait-of-a-confident-young-businessman-working-in-a-modern-office.jpg?s=612x612&w=0&k=20&c=oPRp9aiGEb_00Y0Q_eR40MiOisM2eFfeP7lDf0IqJDw=');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                text-align: center;
                border-top-left-radius: 4rem;
                border: 2px solid #fff;
                position: relative;
                overflow: hidden;
                box-shadow: 0 18px 35px rgba(0,0,0,0.14);
                transform: translateY(0);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }
              .card:hover { transform: translateY(-6px); box-shadow: 0 28px 60px rgba(0,0,0,0.20); }
              /* Glassmorphism overlay over full image */
              .card::after {
                content: "";
                position: absolute;
                inset: 0;
                background: rgba(255, 255, 255, 0.08);
                backdrop-filter: blur(6px) saturate(110%);
                -webkit-backdrop-filter: blur(6px) saturate(110%);
                z-index: 0;
              }
              .card::before { display: none; }
              .card__banner {
                position: absolute;
                top: 32px;
                right: -2.5px;
                height: 30px;
                background-color: #16a34a; /* green-600 */
                color: #fff;
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 0 14px 0 18px;
                clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%);
                z-index: 2;
                white-space: nowrap;
              }
              .card__banner span { font-weight: 800; font-size: 0.9rem; letter-spacing: 0.2px; }
              .card__banner svg { width: 20px; height: 20px; stroke: currentColor; }
              .card__body { padding: 3rem 1.5rem 2rem; max-width: 25ch; margin: auto; position: relative; z-index: 2; }
              .card__icon { display: flex; justify-content: center; margin-bottom: 0.75rem; }
              .card__title { font-weight: 800; color: #121513; font-size: 1.25rem; margin-block: 1.5rem 0.75rem; }
              .card__paragraph { color: #303830; font-size: 0.875rem; margin-top: 1.25rem; }
              .card__list { list-style: none; margin: 1rem auto 0; padding: 0; max-width: 25ch; text-align: left; }
              .card__list li { display: flex; align-items: flex-start; gap: 0.5rem; color: #121513; font-size: 0.875rem; margin-bottom: 0.5rem; }
              .card__list svg { width: 16px; height: 16px; color: #2f855a; margin-top: 2px; flex-shrink: 0; }
              .card__ribbon { margin-top: 1.5rem; display: grid; place-items: center; height: 50px; background-color: #16a34a; position: relative; width: 110%; left: -5%; top: 10px; border-radius: 0 0 2rem 2rem; z-index: 2; }
              .card__ribbon::after, .card__ribbon::before { content: ""; position: absolute; width: 20px; aspect-ratio: 1/1; bottom: 100%; z-index: -2; background-color: #14532d; /* green-900 */ }
              .card__ribbon::before { left: 0; transform-origin: left bottom; transform: rotate(45deg); }
              .card__ribbon::after { right: 0; transform-origin: right bottom; transform: rotate(-45deg); }
              .card__ribbon-label { display: block; width: 84px; aspect-ratio: 1/1; background-color: #fff; position: relative; transform: translateY(-50%); border-radius: 50%; border: 8px solid #16a34a; display: grid; place-items: center; font-weight: 900; line-height: 1; font-size: 1.5rem; }
              .card__ribbon-label::before, .card__ribbon-label::after { content: ""; position: absolute; width: 25px; height: 25px; bottom: 50%; }
              .card__ribbon-label::before { right: calc(100% + 4px); border-bottom-right-radius: 20px; box-shadow: 5px 5px 0 #16a34a; }
              .card__ribbon-label::after { left: calc(100% + 4px); border-bottom-left-radius: 20px; box-shadow: -5px 5px 0 #16a34a; }
            `}</style>
            <div className="grid md:grid-cols-4 gap-8">
              {/* Intro Text - Left Side */}
              <motion.div 
                className="md:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Comprehensive Healthcare Plans
                </h2>
                <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    Choose the coverage that fits your lifestyle. Our comprehensive plans are designed to provide peace of mind at every stage of life.
                  </p>
                  <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'} my-4`} />
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>24/7 Customer Support</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Nationwide Network</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>No Waiting Periods</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Plans Grid - 3 Columns */}
              <div className="md:col-span-3">
                <div className="grid md:grid-cols-3 gap-6">
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
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.03,
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="platinum"
                />
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="gold"
                />
              </motion.div>

              {/* Silver Plan replaced with Uiverse card */}
              <div className="card">
                <div className="card__banner">
                  <span>Silver</span>
                  <svg height="20" width="20" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" strokeLinejoin="round" strokeLinecap="round"></path>
                  </svg>
                </div>
                <div className="card__body">
                  <p className="card__paragraph">
                    Essential coverage for individuals. Private hospital cover, 6 GP visits per year, basic dentistry, and acute medication.
                  </p>
                  <ul className="card__list">
                    <li>
                      <Check className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Private hospital cover</span>
                    </li>
                    <li>
                      <Check className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>6 GP visits per year</span>
                    </li>
                    <li>
                      <Check className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Basic dentistry</span>
                    </li>
                    <li>
                      <Check className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Acute medication</span>
                    </li>
                  </ul>
                </div>
                <div className="card__ribbon">
                  <label className="card__ribbon-label">03</label>
                </div>
              </div>
            </div>
          </div>
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="gold"
                />
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="bronze"
                />
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="silver"
                />
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="bronze"
                />
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="platinum"
                />
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="gold"
                />
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="silver"
                />
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="bronze"
                />
              </motion.div>
            </div>
          </div>
        );
      
      case 'senior':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.3
                  }
                }
              }}
            >
              {/* Gold Senior Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-yellow-600 hover:border-yellow-500' 
                    : 'bg-white border-yellow-200 hover:border-yellow-400'
                }`}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                      duration: 0.5
                    }
                  }
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Gold Senior</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-yellow-600">R1,299</span>
                    <span className={`ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Comprehensive senior health coverage</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Hospital cover (100% of rate)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Chronic medication</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Dental and optical benefits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>24/7 emergency assistance</span>
                  </li>
                </ul>
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="yellow"
                />
              </motion.div>

              {/* Silver Senior Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 hover:border-gray-400' 
                    : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                      duration: 0.5,
                      delay: 0.15
                    }
                  }
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Silver Senior</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-gray-600">R999</span>
                    <span className={`ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Essential senior health coverage</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Hospital cover (100% of rate)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Chronic medication</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Basic optical benefits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>24/7 emergency assistance</span>
                  </li>
                </ul>
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="gray"
                />
              </motion.div>

              {/* Bronze Senior Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                  isDark 
                    ? 'bg-gray-800 border-amber-800 hover:border-amber-600' 
                    : 'bg-white border-amber-200 hover:border-amber-400'
                }`}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                      duration: 0.5,
                      delay: 0.3
                    }
                  }
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Bronze Senior</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-amber-600">R799</span>
                    <span className={`ml-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Basic senior health coverage</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Hospital cover (100% of rate)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Chronic medication</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>Basic emergency cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>24/7 emergency assistance</span>
                  </li>
                </ul>
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="amber"
                />
              </motion.div>
              {/* End of Senior plans grid */}
            </motion.div>
          </div>
        );
      
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
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div 
        className={`w-full mx-auto px-4 ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56'}`}
        style={{
          transition: 'padding-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? `${tab.bgColor} ${tab.iconColor} shadow-md`
                  : `bg-gray-100 text-gray-600 hover:bg-gray-200 ${isDark ? '!bg-gray-800 !text-gray-300 hover:!bg-gray-700' : ''}`
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
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