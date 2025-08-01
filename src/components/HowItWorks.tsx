import React from 'react';
import { Shield, Stethoscope, Search, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import UniqueButton from './ui/unique-button';

interface HowItWorksProps {
  isSidebarCollapsed: boolean;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
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
      color: "bg-green-500"
    },
    {
      icon: Stethoscope,
      title: "Visit Any Network Provider",
      description: "Use your cover at thousands of healthcare providers across South Africa. Present your membership card and you're covered.",
      color: "bg-blue-500"
    }
  ];

  return (
    <section 
      id="how-it-works" 
      className={`relative py-20 transition-all duration-700 ease-in-out ${
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

      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 ${
            isDark 
              ? 'bg-green-900/50 text-green-400' 
              : 'bg-green-100 text-green-800'
          }`}>
            How It Works
          </span>
          <h2 className={`text-4xl lg:text-5xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          } mb-6`}>
            Getting Covered is Simple
          </h2>
          <p className={`text-xl text-center mb-16 max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            From application to using your benefits, we've made healthcare coverage as simple as possible.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 opacity-30"></div>
            
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="text-center group">
                  {/* Step Number */}
                  <motion.div 
                    className="relative mb-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div 
                      className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg`}
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ 
                        duration: 0.3,
                        rotate: { duration: 0.5, ease: "easeInOut" }
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ 
                          delay: index * 0.2 + 0.3,
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                        viewport={{ once: true }}
                      >
                        <step.icon className="w-10 h-10 text-white" />
                      </motion.div>
                    </motion.div>
                    <motion.div 
                      className={`absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-md flex items-center justify-center border-2 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-600' 
                          : 'bg-white border-gray-100'
                      }`}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: index * 0.2 + 0.5,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                      viewport={{ once: true }}
                    >
                      <span className={`text-sm font-bold ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>{index + 1}</span>
                    </motion.div>
                  </motion.div>
                  
                  <motion.h3 
                    className={`text-xl font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.4, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    className={`leading-relaxed ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.6, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {step.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className={`rounded-2xl p-8 shadow-lg border group ${
              isDark 
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
            }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <motion.h3 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ready to Get Started?
            </motion.h3>
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Join thousands of South Africans who trust Day1Health for their healthcare needs.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <UniqueButton
                  width="200px"
                  height="60px"
                  className="font-semibold"
                >
                  Start Application
                </UniqueButton>
              </motion.div>
              <motion.button 
                className={`border-2 border-white px-8 py-4 rounded-xl font-semibold transition-colors ${
                  isDark 
                    ? 'text-white hover:bg-white hover:text-green-600' 
                    : 'text-green-600 hover:bg-green-600 hover:text-white border-green-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Call 0876 100 600
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>


    </section>
  );
};

export default HowItWorks;