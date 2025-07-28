import React from 'react';
import { Mail, Phone, Shield } from 'lucide-react';
import FacebookButton from './FacebookButton';
import LinkedInButton from './LinkedInButton';
import WhatsAppButton from './WhatsAppButton';

interface FooterProps {
  id?: string;
  isSidebarCollapsed?: boolean;
}

const Footer: React.FC<FooterProps> = ({ id, isSidebarCollapsed = false }) => {
  return (
    <footer 
      id={id} 
      className={`bg-gray-900 text-white mt-auto ${
        isSidebarCollapsed ? 'ml-12' : 'ml-12'
      } w-[calc(100%-3rem)]`}
    >
      <div className="mx-auto px-4 py-16 w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">D1</span>
              </div>
              <span className="text-2xl font-bold">Day1Health</span>
            </div>
            <p className="text-xl text-gray-300 mb-6 max-w-md">
              Affordable health cover for every South African.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              Real medical insurance that covers doctor visits, medications, hospital stays, and emergencies. 
              Underwritten by African Unity Life, we provide trusted healthcare coverage across South Africa.
            </p>
            
            <div className="mt-6 flex space-x-4 flex-wrap gap-4">
              <FacebookButton />
              <LinkedInButton />
              <WhatsAppButton />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#plans" className="text-gray-400 hover:text-white transition-colors">
                  Our Plans
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#why-choose" className="text-gray-400 hover:text-white transition-colors">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#faqs" className="text-gray-400 hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">087 610 0600</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">info@day1health.co.za</span>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <div className="text-gray-400">Underwritten by</div>
                  <div className="text-white font-medium">African Unity Life</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2">Emergency Helpline</h4>
              <p className="text-green-400 font-bold">24/7 Available</p>
              <p className="text-sm text-gray-400">Always here when you need us</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Complaints
              </a>
            </div>
            
            <div className="text-sm text-gray-400">
              © 2025 Day1Health. All rights reserved.
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
            <p className="text-sm text-gray-400">
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