import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const JuniorExecutivePlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <main className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <section className="py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="mb-8">
            <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              DAY1 Junior Executive Product
            </h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              A smart blend of Private Hospital and Day-to-Day benefits, tailored for young professionals.
              Full brochure and pricing will be added once confirmed.
            </p>
          </div>

          <div className={`rounded-2xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Highlights</h2>
            <ul className="space-y-3">
              <li className={`flex items-start ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 mr-2" />
                Private Hospital and Day-to-Day blend
              </li>
              <li className={`flex items-start ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 mr-2" />
                Core primary care benefits (GP, basic meds, diagnostics)
              </li>
              <li className={`flex items-start ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 mr-2" />
                Accident and emergency support
              </li>
            </ul>

            <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mt-6`}>
              Note: This page is a placeholder. Content (benefits, pricing, Ts & Cs) will be finalized with client input.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default JuniorExecutivePlanDetailPage;
