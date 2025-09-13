import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Shield, CreditCard, Heart, Users, Check, ArrowRight, Phone, Mail } from 'lucide-react';

// Types
interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface Plan {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
}

// Animation variants for the pricing cards
const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  })
};

// Stagger animation for container
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
};

const ToolsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('comprehensive');

  const tabs: Tab[] = [
    { id: 'comprehensive', label: 'Comprehensive', icon: Shield },
    { id: 'daytoday', label: 'Day-to-Day', icon: Heart },
    { id: 'hospital', label: 'Hospital', icon: CreditCard },
    { id: 'senior', label: 'Senior Cover', icon: Users }
  ];

  const comprehensivePlans: Plan[] = [
    {
      id: 'platinum',
      title: 'Platinum Elite',
      price: 'R1,199',
      description: 'Comprehensive coverage with premium benefits',
      features: [
        'Private hospital cover',
        'Unlimited GP visits',
        'Specialist consultations',
        'Chronic medication',
        'Dental and optical benefits',
        'Maternity benefits'
      ],
      isPopular: true,
      buttonText: 'Choose Plan',
      buttonVariant: 'primary'
    },
    {
      id: 'gold',
      title: 'Gold Plus',
      price: 'R899',
      description: 'Great coverage for families',
      features: [
        'Private hospital cover',
        '15 GP visits per year',
        'Specialist network',
        'Chronic medication',
        'Basic dental',
        'Emergency cover'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'secondary'
    },
    {
      id: 'silver',
      title: 'Silver',
      price: 'R699',
      description: 'Essential coverage at an affordable price',
      features: [
        'Private hospital cover',
        '10 GP visits per year',
        'Network specialists',
        'Emergency cover',
        'Basic medication',
        '24/7 support'
      ],
      buttonText: 'Select Plan',
      buttonVariant: 'outline'
    },
    {
      id: 'bronze',
      title: 'Bronze',
      price: 'R499',
      description: 'Basic hospital cover',
      features: [
        'Basic hospital cover',
        '5 GP visits per year',
        'Emergency cover only',
        'Network hospitals',
        'Basic medication',
        'Email support'
      ],
      buttonText: 'Learn More',
      buttonVariant: 'outline'
    }
  ];

  const renderPlanCard = (plan: Plan, index: number) => (
    <motion.div
      key={plan.id}
      className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all ${
        plan.isPopular 
          ? 'border-blue-500 transform scale-105' 
          : 'border-transparent hover:border-gray-200'
      }`}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center mb-6">
        {plan.isPopular && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            MOST POPULAR
          </span>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
        <div className="flex items-baseline justify-center mb-4">
          <span className="text-3xl font-bold text-blue-600">{plan.price}</span>
          <span className="text-gray-500 ml-1">/month</span>
        </div>
        <div className="h-16 mb-4">
          <p className="text-sm text-gray-600">{plan.description}</p>
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        className={`w-full py-3 rounded-xl font-semibold transition-colors ${
          plan.buttonVariant === 'primary' 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : plan.buttonVariant === 'secondary'
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
        }`}
      >
        {plan.buttonText || 'Get Started'}
      </button>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'comprehensive':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {comprehensivePlans.map((plan, index) => renderPlanCard(plan, index))}
            </motion.div>
          </div>
        );
      case 'daytoday':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[1, 2, 3].map((_, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-blue-200 transition-all"
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Day Plan {index + 1}</h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-3xl font-bold text-blue-600">R{499 + (index * 100)}</span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>
                    <div className="h-16 mb-4">
                      <p className="text-sm text-gray-600">Day-to-day benefits for your needs</p>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {['GP visits', 'Dental checkups', 'Optical benefits', 'Pharmacy benefits'].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    Choose Plan
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case 'hospital':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[1, 2, 3].map((_, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-blue-200 transition-all"
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Hospital Plan {index + 1}</h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-3xl font-bold text-blue-600">R{699 + (index * 150)}</span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>
                    <div className="h-16 mb-4">
                      <p className="text-sm text-gray-600">Comprehensive hospital coverage</p>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {['Hospital cover', 'Specialist consultations', 'Surgical procedures', 'ICU cover'].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    Get Coverage
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case 'senior':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Senior Cover Plans</h2>
              <p className="text-gray-600 mb-8">
                Our senior cover plans are designed specifically for those over 65, with comprehensive benefits
                and affordable premiums to suit your retirement needs.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Plan Options</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Basic Senior Plan</h4>
                        <p className="text-sm text-gray-500">Essential coverage for seniors</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Comprehensive Senior Plan</h4>
                        <p className="text-sm text-gray-500">Full coverage with additional benefits</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Premium Senior Plan</h4>
                        <p className="text-sm text-gray-500">Top-tier coverage with premium benefits</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Speak to an Advisor</h3>
                  <p className="text-gray-600 mb-6">
                    Our senior care specialists are available to help you choose the right plan for your needs.
                  </p>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </button>
                  <button className="mt-3 w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-blue-50 transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Find the Right Plan for You
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose from our range of affordable health insurance plans
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-gray-200">
          <nav className="flex space-x-1 md:space-x-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {renderTabContent()}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-12 sm:p-12 lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Need help choosing?</h2>
              <p className="mt-4 max-w-3xl text-lg text-gray-500">
                Our team of experts is here to help you find the perfect plan for your needs.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:ml-8">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Get a Free Quote
                  <ArrowRight className="ml-3 -mr-1 h-5 w-5" />
                </a>
              </div>
              <div className="ml-3 inline-flex">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderTabContent = () => {
    switch (activeTab) {
      case 'comprehensive':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Platinum Elite Plan */}
              <motion.div 
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 transition-all"
                custom={0}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
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
              </motion.div>
              </motion.div>
              {/* Gold Plus Plan */}
              <motion.div 
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-200 hover:border-yellow-400 transition-all"
                custom={1}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
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
              </motion.div>

              {/* Silver Plan */}
              <motion.div 
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 hover:border-gray-400 transition-all"
                custom={2}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
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
              </motion.div>

              {/* Bronze Plan */}
              <motion.div 
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200 hover:border-amber-400 transition-all"
                custom={3}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
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
              </motion.div>
            </div>
          </div>
        );
      
      case 'daytoday':
        return (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Premium Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Care</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-blue-600">R499</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Premium day-to-day healthcare coverage</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited GP visits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Chronic medication</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Dental & optical benefits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>24/7 Virtual doctor</span>
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Choose Plan
                </button>
              </div>

              {/* Family Care */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Family Care</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-green-600">R399</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Complete family healthcare coverage</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>20 GP visits per year</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Essential medicines</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Child immunizations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Maternity benefits</span>
                  </li>
                </ul>
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                  Choose Plan
                </button>
              </div>

              {/* Basic Care */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-200 hover:border-yellow-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Care</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-yellow-600">R249</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Essential day-to-day healthcare</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>12 GP visits per year</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Acute medication</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic pathology</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Telehealth services</span>
                  </li>
                </ul>
                <button className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors">
                  Choose Plan
                </button>
              </div>

              {/* Student Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:border-purple-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Student Care</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-purple-600">R199</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Affordable healthcare for students</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>8 GP visits per year</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Acute medication</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>24/7 Nurse line</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Campus clinic discounts</span>
                  </li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                  Choose Plan
                </button>
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
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Executive</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-red-600">R1,899</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Premium hospital coverage with full benefits and priority access</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Private hospital cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Full surgical procedures</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Specialist consultations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced diagnostics</span>
                  </li>
                </ul>
                <button className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors">
                  Choose Plan
                </button>
              </div>

              {/* Family Hospital Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Family Cover</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-blue-600">R1,299</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Complete hospital coverage for the entire family's needs</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Family hospital cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Surgical procedures</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Maternity benefits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Pediatric care</span>
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Choose Plan
                </button>
              </div>

              {/* Standard Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:border-green-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Standard</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-green-600">R899</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Reliable hospital coverage for individuals and small families</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Hospital cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic surgical procedures</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Emergency care</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic diagnostics</span>
                  </li>
                </ul>
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                  Choose Plan
                </button>
              </div>

              {/* Essential Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200 hover:border-amber-400 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Essential</h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-3xl font-bold text-amber-600">R599</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <div className="h-16 mb-4">
                    <p className="text-sm text-gray-600">Affordable hospital coverage for essential healthcare needs</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Network hospital cover</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Emergency procedures</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic diagnostics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>24/7 Emergency line</span>
                  </li>
                </ul>
                <button className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">
                  Choose Plan
                </button>
              </div>
            </div>
          </div>
        );

      case 'senior':
        return <SeniorPackageBuilder />;
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Find the Right Plan for You
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose from our range of affordable health insurance plans
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-gray-200">
          <nav className="flex space-x-1 md:space-x-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {renderTabContent()}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-12 sm:p-12 lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Need help choosing?</h2>
              <p className="mt-4 max-w-3xl text-lg text-gray-500">
                Our team of experts is here to help you find the perfect plan for your needs.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:ml-8">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Get a Free Quote
                  <ArrowRight className="ml-3 -mr-1 h-5 w-5" />
                </a>
              </div>
              <div className="ml-3 inline-flex">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsTabs;