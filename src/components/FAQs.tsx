import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface FAQsProps {
  isSidebarCollapsed: boolean;
}

const FAQs: React.FC<FAQsProps> = ({ isSidebarCollapsed }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { isDark } = useTheme();

  const faqs = [
    {
      question: "What's the difference between medical aid and medical insurance?",
      answer: "Medical aid is a scheme where members pool resources to cover healthcare costs, regulated by the Medical Schemes Act. Medical insurance (like Day1Health) is an insurance product that covers specific medical events and treatments, offering more flexibility and often more affordable options."
    },
    {
      question: "Are pre-existing conditions covered?",
      answer: "Pre-existing conditions are covered after a 12-month waiting period, except for accidents and emergencies which are covered from Day 1. We assess each case individually and provide clear information about your coverage during the application process."
    },
    {
      question: "What are the waiting periods?",
      answer: "There are no waiting periods for accidents and emergencies - you're covered from Day 1. General conditions have a 3-month waiting period, and pre-existing conditions have a 12-month waiting period. Maternity benefits have a 10-month waiting period."
    },
    {
      question: "Can I use any doctor or hospital?",
      answer: "You can visit any healthcare provider, but using our network providers offers direct billing and better rates. Outside the network, you may need to pay upfront and claim back, subject to our benefit limits."
    },
    {
      question: "How do I claim for medical expenses?",
      answer: "For network providers, we handle direct billing. For out-of-network providers, simply submit your claim online or via our mobile app with your receipts and medical records. Most claims are processed within 48 hours."
    },
    {
      question: "What happens if I miss a payment?",
      answer: "We offer a 30-day grace period for missed payments. During this time, your cover continues. If payment isn't received within 30 days, your policy will be suspended. You can reinstate your policy by paying outstanding premiums."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Upgrades are subject to waiting periods for new benefits. Downgrades take effect from your next renewal date. Contact our customer service team to discuss your options."
    },
    {
      question: "Is there an age limit for joining?",
      answer: "You can join Day1Health from birth up to age 64. After 65, you can continue with your existing plan or switch to our Senior Plan designed specifically for older adults with age-appropriate benefits."
    }
  ];

  return (
    <section 
      id="faqs" 
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
            Frequently Asked Questions
          </span>
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Got Questions? We Have Answers
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Find answers to the most common questions about Day1Health medical insurance.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`mb-4 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              }`}
              whileHover={{ 
                scale: 1.02,
                boxShadow: isDark 
                  ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
                  : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.button
                className={`w-full px-8 py-6 text-left flex items-center justify-between transition-colors duration-200 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className={`text-lg font-semibold pr-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className={`w-6 h-6 flex-shrink-0 ${
                    isDark ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.04, 0.62, 0.23, 0.98]
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <motion.div 
                        className={`w-full h-px mb-6 ${
                          isDark ? 'bg-gray-600' : 'bg-gray-200'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      ></motion.div>
                      <motion.p 
                        className={`leading-relaxed ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {faq.answer}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className={`rounded-2xl p-8 max-w-2xl mx-auto ${
            isDark ? 'bg-green-900/20' : 'bg-green-50'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Still Have Questions?
            </h3>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Our friendly consultants are available to help you understand your options and find the right plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                Call 0876 100 600
              </button>
              <button className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-colors">
                Email Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;