import React from 'react';
import { Mail, Phone, Shield } from 'lucide-react';
import BB8Toggle from './BB8Toggle';
import { useTheme } from '../contexts/ThemeContext';

interface FooterProps {
  id?: string;
  isSidebarCollapsed?: boolean;
}

const Footer: React.FC<FooterProps> = ({ id, isSidebarCollapsed = false }) => {
  const { isDark } = useTheme();
  
  return (
    <footer 
      id={id} 
      className={`mt-auto transition-all duration-700 ease-in-out ${
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      } ${
        isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-64'
      } ${
        isSidebarCollapsed ? 'lg:w-[calc(100%-6rem)]' : 'lg:w-[calc(100%-16rem)]'
      }`}
      style={{
        transition: 'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <div className="mx-auto px-4 pt-16 pb-8 w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">D1</span>
              </div>
              <span className="text-2xl font-bold">Day1Health</span>
            </div>
            <p className={`text-xl mb-6 max-w-md ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Affordable health cover for every South African.
            </p>
            <p className={`leading-relaxed mb-6 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Real medical insurance that covers doctor visits, medications, hospital stays, and emergencies. 
              Underwritten by African Unity Life, we provide trusted healthcare coverage across South Africa.
            </p>
            

          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#plans" className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Our Plans
                </a>
              </li>
              <li>
                <a href="#how-it-works" className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#why-choose" className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#faqs" className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  FAQs
                </a>
              </li>
              <li>
                <a href="#contact" className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>0876 100 600</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>info@day1health.co.za</span>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Underwritten by</div>
                  <div className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>African Unity Life</div>
                </div>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Emergency Helpline</h4>
              <p className="text-green-400 font-bold">24/7 Available</p>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Always here when you need us</p>
            </div>

            {/* Dark Theme Toggle */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-sm">Theme</h4>
              <div className="flex items-center justify-center">
                <BB8Toggle />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">Toggle between light and dark themes</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t mt-12 pt-8 ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className={`transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Terms of Service
              </a>
              <a href="#" className={`transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Privacy Policy
              </a>
              <a href="#" className={`transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Cookie Policy
              </a>
              <a href="#" className={`transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Complaints
              </a>
            </div>
            
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2025 Day1Health. All rights reserved.
            </div>
          </div>

          <div className={`mt-4 p-3 rounded-lg text-center ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Day1Health is an authorized Financial Services Provider (FSP). 
              Medical insurance products are underwritten by African Unity Life Limited, 
              a licensed life insurer and authorized FSP.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;