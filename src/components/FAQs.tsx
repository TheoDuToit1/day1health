import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface FAQsProps {
  isSidebarCollapsed: boolean;
}

const FAQs: React.FC<FAQsProps> = ({ isSidebarCollapsed }) => {
  // Support opening multiple and a global open/close all toggle
  const [expandedAll, setExpandedAll] = useState(false);
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  const [showFaqs, setShowFaqs] = useState(false);
  const { isDark } = useTheme();

  // Selected 8 most relevant FAQs from the list provided by the user
  const faqs = [
    {
      question: "Can I go to any private hospital?",
      answer: "Day1 Health has formal contracts with Life Healthcare, Mediclinic, Africa Health Care and Clinix hospitals nationwide. All hospital admissions must be pre-authorised via Africa Assist (0861 144 144)."
    },
    {
      question: "What is the procedure if I'm diagnosed with a chronic condition?",
      answer: "Register on the Day1 Health Chronic Disease Management Programme via your Day1 Health Network GP to receive chronic medication. Collect at Clicks, Dischem or Medirite nationwide. Subject to pre-authorisation."
    },
    {
      question: "Can I buy my medication over the counter?",
      answer: "No. Your Day1 Network GP must prescribe in line with our formulary. Both acute and chronic medication are covered (unlimited) according to the formulary. If your GP scripts (does not dispense), collect at Clicks, Dischem or Medirite."
    },
    {
      question: "When I see a GP/Dentist, do I have to pay cash?",
      answer: "No. By paying your monthly contribution in advance, your consultation is covered. Accredited providers claim directly from Day1 Health."
    },
    {
      question: "What happens if there isn’t a Network doctor in my area?",
      answer: "Contact us on 0876 100 600 and we will endeavour to contract directly with your preferred GP."
    },
    {
      question: "What happens if I am ill and out of town?",
      answer: "Your Day-to-Day benefits allow 3 out-of-area visits per policy per year to an alternative Network GP or GP of your choice. For non-network GP visits, submit a Reimbursement Form and receipt to be reimbursed the agreed tariff (e.g. R340)."
    },
    {
      question: "Are pre-existing conditions covered?",
      answer: "Yes, after a 12-month waiting period. Accidents and emergencies remain covered from Day 1."
    },
    {
      question: "What are the waiting periods for day-to-day benefits?",
      answer: "Typical waiting periods: General day-to-day and Acute/Pathology/Radiology – 1 month; Specialists – 3 months; Dentistry – 3 months; Optometry – 12 months; Chronic (unknown) – 3 months; Chronic (pre-existing) – 12 months."
    }
  ];

  const allOpen = useMemo(() => expandedAll || openSet.size === faqs.length, [expandedAll, openSet, faqs.length]);

  const toggleAll = () => {
    if (allOpen) {
      setExpandedAll(false);
      setOpenSet(new Set());
    } else {
      setExpandedAll(true);
      setOpenSet(new Set(faqs.map((_, i) => i)));
    }
  };

  return (
    <section 
      className={`py-20 transition-all duration-700 ease-in-out border-b scroll-mt-32 ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
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
          <span className={`inline-block mt-2.5 px-4 py-1.5 text-base font-medium rounded-full mb-4 ${
            isDark 
              ? 'bg-green-900/50 text-green-400' 
              : 'bg-green-100 text-green-800'
          }`}>
            Frequently Asked Questions
          </span>
          <h2 id="faqs" className={`text-4xl lg:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Got Questions? We Have Answers
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-3 mb-[2px] w-full mt-[26px]">
            <button
              onClick={() => setShowFaqs(v => !v)}
              className={`px-6 sm:px-8 py-2 rounded-lg border text-sm font-semibold transition-colors min-w-[9.5rem] ${
                isDark
                  ? 'bg-blue-900/30 text-blue-200 hover:bg-blue-900/50 border-blue-800'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300'
              }`}
            >
              {showFaqs ? 'Hide FAQs' : 'Show Frequently Asked Questions'}
            </button>
            {showFaqs && (
              <button
                onClick={toggleAll}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                  isDark
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300'
                }`}
              >
                {allOpen ? 'Collapse all' : 'Expand all'}
              </button>
            )}
          </div>
          {showFaqs && faqs.map((faq, index) => (
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
              
            >
              <motion.button
                className={`w-full px-8 py-6 text-left flex items-center justify-between transition-colors duration-200 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  // If previously in expand-all mode, switch to manual and toggle this item
                  setExpandedAll(false);
                  setOpenSet(prev => {
                    const next = new Set(prev);
                    if (next.has(index)) next.delete(index); else next.add(index);
                    return next;
                  });
                }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className={`text-lg font-semibold pr-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{faq.question}</h3>
                <motion.div
                  animate={{ rotate: (expandedAll || openSet.has(index)) ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className={`w-6 h-6 flex-shrink-0 ${
                    isDark ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {(expandedAll || openSet.has(index)) && (
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
            isDark ? 'bg-blue-900/30' : 'bg-blue-100'
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
              <button
                onClick={() => {
                  window.dispatchEvent(new Event('openCallModal'));
                }}
                aria-label="Call Day1Health"
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors text-center"
              >
                Call 0876 100 600
              </button>
              <button
                onClick={() => {
                  // Scroll to contact section and open Prospective modal
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  // Support both immediate event and delayed open via sessionStorage (in case of navigation)
                  try { sessionStorage.setItem('openProspective', '1'); } catch {}
                  window.dispatchEvent(new Event('openProspective'));
                }}
                className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-colors"
              >
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