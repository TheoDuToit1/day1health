import React, { useState } from 'react';
import { Shield, CreditCard, Heart, Users, Check, Phone, Mail, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { AnimatedPaymentButton } from './ui/animated-payment-button';

interface ToolsTabsProps {
  isSidebarCollapsed: boolean;
}

const ToolsTabs: React.FC<ToolsTabsProps> = ({ isSidebarCollapsed }) => {
  const [activeTab, setActiveTab] = useState('comprehensive');
  const { isDark } = useTheme();
  // Track expanded state for Day-to-Day pricing cards
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    intro: false,
    family: false,
    basic: false,
    student: false,
  });
  // Reveal pricing cards by default (no need to open intro)
  const [showDayToDayCards, setShowDayToDayCards] = useState(true);
  const toggleExpanded = (key: 'family' | 'basic' | 'student') =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleIntro = () =>
    setExpanded((prev) => {
      const nextIntro = !prev.intro;
      if (nextIntro) setShowDayToDayCards(true);
      return { ...prev, intro: nextIntro };
    });


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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'comprehensive':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Platinum Elite Plan */}
              <motion.div 
                className={`relative group rounded-2xl shadow-lg p-6 border-2 transition-all overflow-visible ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                } ${expanded.student ? 'min-h-[420px]' : 'min-h-[180px]'} `}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  layout: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={expanded.student ? {} : { scale: 1.02, boxShadow: "0 16px 32px rgba(0,0,0,0.10)" }}
                style={{ willChange: 'transform, opacity' }}
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
                {/* Hover Overlay (collapsed only) */}
                {!expanded.student && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotate: -1, skewY: -2 }}
                    whileHover={{ opacity: 1, y: 0, rotate: 0, skewY: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4 ${
                      isDark ? 'bg-gray-900/40' : 'bg-white/40'
                    } backdrop-blur-[2px] opacity-0 group-hover:opacity-100`}
                  >
                    <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                      {tabs.find(t => t.id === activeTab)?.label}
                    </div>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileHover={{ scale: 1.02, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.03 }}
                      className={`font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      <span className="text-2xl align-top mr-1">R</span>
                      <span className="text-4xl">1,299</span>
                      <span className={`ml-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                    </motion.div>
                  </motion.div>
                )}
                <motion.div 
                  className={`absolute top-4 right-4 z-10 ${expanded.student ? 'rotate-180' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <ArrowRight className="w-5 h-5 text-green-500" />
                </motion.div>
              </motion.div>

              {/* Gold Plus Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all overflow-visible ${
                  isDark 
                    ? 'bg-gray-800 border-blue-700 hover:border-blue-500' 
                    : 'bg-white border-blue-200 hover:border-blue-400'
                } ${expanded.basic ? 'min-h-[420px]' : 'min-h-[180px]'} relative`}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  layout: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={expanded.basic ? {} : { scale: 1.02, boxShadow: "0 16px 32px rgba(0,0,0,0.10)" }}
                style={{ willChange: 'transform, opacity' }}
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
                  ease: [0.25, 0.46, 0.45, 0.94],
                  layout: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="silver"
                />
              </motion.div>

              {/* Bronze Plan */}
              <motion.div 
                className={`rounded-2xl shadow-lg p-6 border-2 transition-all overflow-visible ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                } ${expanded.family ? 'min-h-[420px]' : 'min-h-[180px]'} `}
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
                <AnimatedPaymentButton 
                  text="Choose Plan"
                  className="bronze"
                />
              </motion.div>
            </div>
          </div>
        );
      
      case 'daytoday':
        return (
          <LayoutGroup>
            <motion.div className={`${isSidebarCollapsed ? 'max-w-[74rem]' : 'max-w-[min(74rem,calc(100vw-14rem-0.5rem))]'} mx-auto px-2`}>
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-[1.02fr_0.85fr_0.85fr_0.85fr] gap-5 items-start overflow-visible">
              {/* Introduction Column */}
              <motion.div 
                className={`relative rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ring-1 ring-emerald-400/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] ${
                  isDark 
                    ? 'bg-gray-800 border-emerald-700 hover:border-emerald-500' 
                    : 'bg-white border-emerald-200 hover:border-emerald-400'
                } ${expanded.intro ? 'min-h-[420px]' : 'min-h-[140px]'} `}
                layout="position"
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{}}
              >
                {/* Background accent */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0">
                  <img
                    src="/assets/images/daytoday/single/daytodaysingle.png"
                    alt=""
                    className="w-full h-full object-cover opacity-50"
                    loading="lazy"
                  />
                  <div className={`bg-black/40 absolute inset-0`} />
                </div>
                <div
                  className="relative z-10 flex items-start justify-between gap-3 text-white cursor-pointer select-none"
                  onClick={toggleIntro}
                  role="button"
                  aria-label={expanded.intro ? 'Collapse introduction' : 'Expand introduction'}
                >
                  <div>
                    <motion.span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm mb-2 bg-emerald-500/10 border-emerald-200/30 text-white`}
                      animate={{ scale: [1, 1.05, 1] , boxShadow: [
                        '0 0 0px rgba(16,185,129,0.0)',
                        '0 0 18px rgba(16,185,129,0.35)',
                        '0 0 0px rgba(16,185,129,0.0)'
                      ] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      Start here
                    </motion.span>
                    <h3 className={`text-xl font-bold text-white`}>Choose day-to-day care that fits your life</h3>
                  </div>
                  <motion.button
                    type="button"
                    aria-label={expanded.intro ? 'Collapse introduction' : 'Expand introduction'}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm transition-transform ${
                      expanded.intro ? 'rotate-180' : ''
                    } text-white border-white/30 bg-white/10 hover:bg-white/15`}
                    onClick={(e) => { e.stopPropagation(); toggleIntro(); }}
                    animate={!expanded.intro ? { y: [0, -3, 0] } : { y: 0 }}
                    transition={!expanded.intro ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                    </svg>
                  </motion.button>
                </div>
                {/* Collapsed teaser actions */}
                {!expanded.intro && (
                  <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2 text-white">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                      onClick={(e) => { e.stopPropagation(); toggleIntro(); setShowDayToDayCards(true); }}
                    >
                      Open introduction
                    </button>
                    <span className="text-[11px] text-white/80">or jump to</span>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                      onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: true, family: false, basic: false })); }}
                    >
                      Single
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                      onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: false, family: false, basic: true })); }}
                    >
                      Couple
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                      onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: false, family: true, basic: false })); }}
                    >
                      Family
                    </button>
                  </div>
                )}
                <motion.div
                  key="intro-content"
                  initial={false}
                  animate={{ height: expanded.intro ? 'auto' : 0, opacity: expanded.intro ? 1 : 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                  aria-hidden={!expanded.intro}
                  className="relative z-10 text-white"
                >
                  <p className={`mt-2 text-white`}>
                    Practical, affordable healthcare for everyday needs. Choose from our flexible options
                    to cover GP visits, basic medication, and essential health services for you and your family.
                  </p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                      <span className={`text-white`}>GP consultations and virtual care</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                      <span className={`text-white`}>Acute and chronic medication options</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                      <span className={`text-white`}>Dental, optical and basic diagnostics</span>
                    </li>
                  </ul>
                  {/* Intro helper */}
                  <div className="mt-5 text-sm text-gray-200">
                    Open the Introduction to reveal the pricing options below. Cards will slide in one by one.
                  </div>
                  {/* Intro actions: reveal and jump */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition-all border backdrop-blur-sm hover:scale-[1.02] ${isDark ? 'bg-emerald-500/15 border-emerald-200/20 text-white hover:bg-emerald-500/20' : 'bg-emerald-500/20 border-emerald-500/40 text-white hover:bg-emerald-500/25'}`}
                      onClick={() => {
                        setShowDayToDayCards(true);
                      }}
                    >
                      Show pricing
                    </button>
                    <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>or jump to</span>
                    <button
                      type="button"
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                      onClick={() => {
                        setShowDayToDayCards(true);
                        setExpanded(prev => ({ ...prev, student: true, family: false, basic: false }));
                      }}
                    >
                      Single
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                      onClick={() => {
                        setShowDayToDayCards(true);
                        setExpanded(prev => ({ ...prev, student: false, family: false, basic: true }));
                      }}
                    >
                      Couple
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                      onClick={() => {
                        setShowDayToDayCards(true);
                        setExpanded(prev => ({ ...prev, student: false, family: true, basic: false }));
                      }}
                    >
                      Family
                    </button>
                  </div>
                  <div className={`mt-3 text-xs text-gray-200`}>
                    Cancel anytime • No hidden fees
                  </div>
                </motion.div>
              </motion.div>

              {/* Family Care */}
              <motion.div 
                className={`order-3 relative group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                } min-h-[140px] `}
                layout="position"
                initial={false}
                animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{}}
              >
                {expanded.family && (
                  <motion.div
                    key="family-bg"
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                  >
                    <img
                      src="/assets/images/daytoday/single/daytodaysingle.png"
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`${isDark ? 'bg-black/30' : 'bg-black/20'} absolute inset-0`} />
                  </motion.div>
                )}
                <div className="relative z-10 mb-[17px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {expanded.family ? (
                      <motion.div
                        key="hdr-expanded-family"
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <motion.span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.18 }}
                        >
                          <motion.span
                            className="inline-flex"
                            initial="hidden"
                            animate="show"
                            variants={{ show: { transition: { staggerChildren: 0.03 } } }}
                          >
                            {'Day-to-Day'.split('').map((ch, i) => (
                              <motion.span
                                key={i}
                                className="inline-block"
                                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                                transition={{ duration: 0.18 }}
                              >
                                {ch === ' ' ? '\u00A0' : ch}
                              </motion.span>
                            ))}
                          </motion.span>
                        </motion.span>
                        <motion.span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.18 }}
                        >
                          Family
                        </motion.span>
                      </motion.div>
                    ) : (
                      <motion.h3
                        key="hdr-collapsed-family"
                        className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                      >
                        Family
                      </motion.h3>
                    )}
                  </AnimatePresence>
                </div>
                {expanded.family && (
                  <motion.div
                    layoutId="family-price"
                    className={`relative z-10 mb-4 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                    transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  >
                    <span className="text-2xl font-bold text-emerald-400">R399</span>
                    <span className={`text-white text-sm font-normal`}>/month</span>
                  </motion.div>
                )}
                <motion.div key="family-content"
                  initial={false}
                  animate={{ height: expanded.family ? 'auto' : 0, opacity: expanded.family ? 1 : 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                  aria-hidden={!expanded.family}
                >
                  <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                    <ul className="space-y-3">
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>20 GP visits/year</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Essential medicines</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Child immunizations</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Maternity benefits</span></li>
                    </ul>
                  </div>
                </motion.div>
                <div className={(expanded.family ? 'mt-[-3px]' : 'mt-8')}>
                  <div className="relative">
                    <AnimatedPaymentButton 
                      text="Choose Plan"
                      className="bronze"
                      hoverMessages={[
                        '20 GP visits/year',
                        'Essential medicines',
                        'Child immunizations',
                        'Maternity benefits',
                      ]}
                      hoverIcons={['wallet','card','payment','check']}
                      showArrow={false}
                      expanded={expanded.family}
                      onToggleExpand={() => toggleExpanded('family')}
                      to="/plans/day-to-day"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={expanded.family ? 'Collapse Family Care details' : 'Expand Family Care details'}
                    className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                      transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                      ${isDark 
                        ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                        : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                      ${expanded.family ? 'rotate-180' : ''}`}
                    onClick={() => toggleExpanded('family')}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                    </svg>
                  </button>
                </div>
                {/* Hover Badge (collapsed only) */}
                {!expanded.family && (
                  <div
                    className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
                      isDark
                        ? 'bg-gray-900/80 border-gray-700'
                        : 'bg-white/90 border-gray-200'
                    }`}
                  >
                      <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {tabs.find(t => t.id === activeTab)?.label}
                      </div>
                      <motion.div layoutId="family-price" className={`leading-none text-green-600`}>
                        <span className="text-sm align-top mr-1">R</span>
                        <span className="text-2xl font-bold">399</span>
                        <span className={`ml-1 text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                      </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Couple Plan */}
              <motion.div 
                className={`order-2 relative group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                } min-h-[140px] `}
                layout="position"
                initial={false}
                animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{}}
                style={{ pointerEvents: showDayToDayCards ? 'auto' : 'none' }}
              >
                {expanded.basic && (
                  <motion.div
                    key="couple-bg"
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                  >
                    <img
                      src="/assets/images/daytoday/single/daytodaysingle.png"
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`${isDark ? 'bg-black/30' : 'bg-black/20'} absolute inset-0`} />
                  </motion.div>
                )}
                <div className="mb-[17px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {expanded.basic ? (
                      <motion.div
                        key="hdr-expanded-couple"
                        className={`relative z-20 flex items-center justify-between`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <motion.span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.18 }}
                        >
                          <motion.span
                            className="inline-flex"
                            initial="hidden"
                            animate="show"
                            variants={{ show: { transition: { staggerChildren: 0.035 } } }}
                          >
                            {'Day-to-Day'.split('')?.map((ch, i) => (
                              <motion.span
                                key={i}
                                className="inline-block"
                                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                                transition={{ duration: 0.18 }}
                              >
                                {ch === ' ' ? '\u00A0' : ch}
                              </motion.span>
                            ))}
                          </motion.span>
                        </motion.span>
                        <motion.span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.18 }}
                        >
                          Couple
                        </motion.span>
                      </motion.div>
                    ) : (
                      <motion.h3
                        key="hdr-collapsed-couple"
                        className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                      >
                        Couple
                      </motion.h3>
                    )}
                  </AnimatePresence>
                </div>
                {expanded.basic && (
                  <motion.div
                    layoutId="basic-price"
                    className={`relative z-10 mb-4 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                    transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  >
                    <span className="text-2xl font-bold text-emerald-400">R249</span>
                    <span className={`text-white text-sm font-normal`}>/month</span>
                  </motion.div>
                )}
                <motion.div key="couple-content"
                  initial={false}
                  animate={{ height: expanded.basic ? 'auto' : 0, opacity: expanded.basic ? 1 : 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                  aria-hidden={!expanded.basic}
                  className="relative z-10"
                >
                  <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                    <ul className="space-y-3">
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>12 GP visits/year</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute medication</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Basic pathology</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Telehealth services</span></li>
                    </ul>
                  </div>
                </motion.div>
                <div className={(expanded.basic ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                  <div className="relative">
                    <AnimatedPaymentButton 
                      text="Choose Plan"
                      className="silver"
                      hoverMessages={[
                        '12 GP visits/year',
                        'Acute medication',
                        'Basic pathology',
                        'Telehealth services',
                      ]}
                      hoverIcons={['wallet','card','payment','check']}
                      showArrow={false}
                      expanded={expanded.basic}
                      onToggleExpand={() => toggleExpanded('basic')}
                      to="/plans/day-to-day"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={expanded.basic ? 'Collapse Couple Care details' : 'Expand Couple Care details'}
                    className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                      transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                      ${isDark 
                        ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                        : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                      ${expanded.basic ? 'rotate-180' : ''}`}
                    onClick={() => toggleExpanded('basic')}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                    </svg>
                  </button>
                </div>
                {/* Hover Badge (collapsed only) */}
                {!expanded.basic && (
                  <div
                    className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                      isDark
                        ? 'bg-white/10 border-white/15'
                        : 'bg-white/30 border-white/40'
                    }`}
                  >
                    <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      {tabs.find(t => t.id === activeTab)?.label}
                    </div>
                    <motion.div layoutId="basic-price" className={`leading-none text-emerald-400`} transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}>
                      <span className="text-sm align-top mr-1">R</span>
                      <span className="text-2xl font-bold">249</span>
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Student Plan (Single) */}
              <motion.div 
                className={`order-1 relative z-30 group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                } min-h-[140px] `}
                layout="position"
                initial={false}
                animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{}}
                style={{ pointerEvents: showDayToDayCards ? 'auto' : 'none' }}
              >
                {expanded.student && (
                  <motion.div
                    key="student-bg"
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                  >
                    <img
                      src="/assets/images/daytoday/single/daytodaysingle.png"
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`${isDark ? 'bg-black/30' : 'bg-black/20'} absolute inset-0`} />
                  </motion.div>
                )}
                <div className="mb-[17px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {expanded.student ? (
                      <motion.div
                        key="hdr-expanded-student"
                        className={`relative z-20 flex items-center justify-between`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <motion.span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.18 }}
                        >
                          <motion.span
                            className="inline-flex"
                            initial="hidden"
                            animate="show"
                            variants={{ show: { transition: { staggerChildren: 0.035 } } }}
                          >
                            {'Day-to-Day'.split('')?.map((ch, i) => (
                              <motion.span
                                key={i}
                                className="inline-block"
                                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                                transition={{ duration: 0.18 }}
                              >
                                {ch === ' ' ? '\u00A0' : ch}
                              </motion.span>
                            ))}
                          </motion.span>
                        </motion.span>
                        <motion.span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.18 }}
                        >
                          Single
                        </motion.span>
                      </motion.div>
                    ) : (
                      <motion.h3
                        key="hdr-collapsed-student"
                        className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                      >
                        Single
                      </motion.h3>
                    )}
                  </AnimatePresence>
                </div>
                {expanded.student && (
                  <motion.div
                    layoutId="student-price"
                    className={`relative z-10 mb-4 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                    transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  >
                    <span className="text-2xl font-bold text-emerald-400">R199</span>
                    <span className={`text-white text-sm font-normal`}>/month</span>
                  </motion.div>
                )}
                <motion.div key="student-content"
                  initial={false}
                  animate={{ height: expanded.student ? 'auto' : 0, opacity: expanded.student ? 1 : 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                  aria-hidden={!expanded.student}
                  className="relative z-10"
                >
                  <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                    <ul className="space-y-3">
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>8 GP visits/year</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute medication</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>24/7 Nurse line</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Campus clinic discounts</span></li>
                    </ul>
                  </div>
                </motion.div>
                <div className={(expanded.student ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                  <div className="relative">
                    <AnimatedPaymentButton 
                      text="Choose Plan"
                      className="bronze"
                      hoverMessages={[
                        '8 GP visits/year',
                        'Acute medication',
                        '24/7 Nurse line',
                        'Campus clinic discounts',
                      ]}
                      hoverIcons={['wallet','card','payment','check']}
                      showArrow={false}
                      expanded={expanded.student}
                      onToggleExpand={() => toggleExpanded('student')}
                      to="/plans/day-to-day"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={expanded.student ? 'Collapse Student Care details' : 'Expand Student Care details'}
                    className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                      transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                      ${isDark 
                        ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                        : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                      ${expanded.student ? 'rotate-180' : ''}`}
                    onClick={() => toggleExpanded('student')}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                    </svg>
                  </button>
                </div>
                {/* Hover Badge (collapsed only) */}
                {!expanded.student && (
                  <div
                    className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                      isDark
                        ? 'bg-white/10 border-white/15'
                        : 'bg-white/30 border-white/40'
                    }`}
                  >
                    <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      {tabs.find(t => t.id === activeTab)?.label}
                    </div>
                    <motion.div layoutId="student-price" className={`leading-none text-emerald-400`} transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}>
                      <span className="text-sm align-top mr-1">R</span>
                      <span className="text-2xl font-bold">199</span>
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </LayoutGroup>
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
      <div className={`w-full mx-auto px-4 ${
        isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56'
      }`} style={{
        transition: 'padding-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}>
        {/* Floating Tabs */}
        <div className="flex justify-center mb-12">
          <div className={`w-full ${isSidebarCollapsed ? 'max-w-[74rem]' : 'max-w-[min(74rem,calc(100vw-14rem-0.5rem))]'} mx-auto rounded-2xl shadow-lg px-2 py-3 backdrop-blur-sm transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800/95 border border-gray-700' 
              : 'bg-white/95 border border-gray-100'
          }`}>
            <div className="flex flex-wrap justify-between gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center px-6 py-3 text-xs md:text-sm font-medium rounded-lg transition-all min-w-[200px] sm:min-w-[240px] justify-center ${
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
        <div className={`transition-all duration-500 ease-in-out`}>
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