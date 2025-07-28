import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQsProps {
  isSidebarCollapsed: boolean;
}

const FAQs: React.FC<FAQsProps> = ({ isSidebarCollapsed }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

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
      className={`py-20 bg-white transition-all duration-500 ${
        isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-40'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
            Frequently Asked Questions
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Got Questions? We Have Answers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to the most common questions about Day1Health medical insurance.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronUp className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openFAQ === index && (
                <div className="px-8 pb-6">
                  <div className="w-full h-px bg-gray-200 mb-6"></div>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-green-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our friendly consultants are available to help you understand your options and find the right plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                Call 087 610 0600
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