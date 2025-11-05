import React from 'react';
import { Mail, Phone, Shield } from 'lucide-react';
import BB8Toggle from './BB8Toggle';
import { useTheme } from '../contexts/ThemeContext';

interface FooterProps {
  id?: string;
}

const Footer: React.FC<FooterProps> = ({ id }) => {
  const { isDark } = useTheme();
  
  return (
    <footer 
      id={id} 
      className={`w-full transition-all duration-700 ease-in-out ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
      style={{
        transition: 'padding 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.3s ease'
      }}
    >
      <div className="mx-auto px-4 pt-16 pb-8 w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            {/* Heading area without logo (logo moved below FSP) */}
            <div className="flex items-center space-x-3 mb-6"></div>
            <p className={`text-xl mb-6 -mt-6 max-w-md ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Affordable health cover for every South African.
            </p>
            <p className={`leading-relaxed mb-6 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Real medical insurance that covers doctor visits, medications, hospital stays, and emergencies. 
              Underwritten by African Unity Life Ltd, we provide trusted healthcare coverage across South Africa.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-600" />
                <a href="mailto:admin@day1.co.za" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}>admin@day1.co.za</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-600" />
                <a href="mailto:sales@day1.co.za" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}>sales@day1.co.za</a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-600" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>0876 100 600</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-600" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>FSP 11319 • CMS Ref. 1074</span>
              </div>
              {/* Logo moved here, ensure it's clearly lower to align with theme toggle */}
              <div className="pt-[70px]">
                <div className="relative w-64 h-[111px] flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${isDark ? 'bg-gray-900 border-2 border-gray-700' : 'bg-white border-2 border-green-500'}`}>
                    <div className="absolute inset-0 flex items-center justify-center p-1.5">
                      <img 
                        src="/assets/images/Logo.jpg" 
                        alt="Day 1 Health Logo" 
                        className="w-full h-full object-contain"
                        width="256"
                        height="111"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              <li>
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Network Search</div>
                <ul className="mt-2 ml-3 space-y-2 list-disc">
                  <li>
                    <a href="https://day1health.co.za/medical-directory/" target="_blank" rel="noopener noreferrer" className={`transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}>
                      Doctor Directory
                    </a>
                  </li>
                  <li>
                    <a href="https://www.lifehealthcare.co.za/hospitals/" target="_blank" rel="noopener noreferrer" className={`transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}>
                      Life Healthcare Hospitals
                    </a>
                  </li>
                  <li>
                    <a href="https://www.mediclinic.co.za/en/corporate/hospitals.html" target="_blank" rel="noopener noreferrer" className={`transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}>
                      Mediclinic Hospitals
                    </a>
                  </li>
                  <li>
                    <a href="https://www.africahealthcare.co.za/" target="_blank" rel="noopener noreferrer" className={`transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}>
                      Africa Health Care
                    </a>
                  </li>
                  <li>
                    <a href="https://search.mymembership.co.za/Search/?Id=dff1cb34-a717-47e0-a58d-8e5d15744e77" target="_blank" rel="noopener noreferrer" className={`transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}>
                      Iso Leso Optics
                    </a>
                  </li>
                  <li>
                    <a href="https://clinix.co.za/hospitals/" target="_blank" rel="noopener noreferrer" className={`transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}>
                      Clinix Health Group
                    </a>
                  </li>
                </ul>
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
                <a href="mailto:admin@day1.co.za" className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>admin@day1.co.za</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <a href="mailto:sales@day1.co.za" className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>sales@day1.co.za</a>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Emergency Hospital Hotline</h4>
              <div className="flex items-center gap-3 mb-1">
                <a href="tel:0861144144" className="text-green-500 font-extrabold tracking-wide">0861-144-144</a>
              </div>
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
              <a href="/regulatory-information" className={`pl-2 font-semibold transition-colors ${
                isDark 
                  ? 'text-gray-300 hover:text-white bg-blue-900/30 border border-blue-800 rounded-lg px-3 py-1.5 text-base' 
                  : 'text-gray-800 hover:text-gray-900 bg-blue-100 border border-blue-300 rounded-lg px-3 py-1.5 text-base'
              }`}>
                Legal and Regulatory Information
              </a>
              <a href="/procedures" className={`transition-colors ${
                isDark 
                  ? 'text-gray-300 hover:text-white bg-blue-900/30 border border-blue-800 rounded-lg px-3 py-1.5 text-base' 
                  : 'text-gray-800 hover:text-gray-900 bg-blue-100 border border-blue-300 rounded-lg px-3 py-1.5 text-base'
              }`}>
                Procedures
              </a>
            </div>
            
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              &copy; 2025 Day1Health. All rights reserved.
            </div>
          </div>

          <div className={`mt-4 px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-center max-w-5xl mx-auto ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Day1 Health (Pty) Ltd is an authorised Financial Services Provider (FSP 11319), underwritten by African Unity Life Ltd. (2003/016142/06),<br/>
              a licensed life insurer and an authorised Financial Services Provider - FSP 8447. The Day1 Health Plan is demarcated by CMS.<br/>
              This product is a Medical Insurance Product and not a Medical Aid registered by the Council for Medical Schemes DM1053A.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;