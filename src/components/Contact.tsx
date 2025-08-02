import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { AnimatedContactButton } from './ui/animated-contact-button';

interface ContactProps {
  isSidebarCollapsed: boolean;
}

const Contact: React.FC<ContactProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', phone: '', email: '', message: '' });
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <section 
      className={`py-20 transition-all duration-700 ease-in-out border-b ${
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
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 ${
            isDark 
              ? 'bg-green-900/50 text-green-400' 
              : 'bg-green-100 text-green-800'
          }`}>
            Contact Us
          </span>
          <h2 id="contact" className={`text-4xl lg:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Get in Touch
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Ready to get covered or have questions? Our team is here to help you find the perfect healthcare solution.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <h3 className={`text-2xl font-bold mb-8 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Let's Connect</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                  isDark ? 'bg-green-900/50' : 'bg-green-100'
                }`}>
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className={`font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Call Us</h4>
                  <p className={`mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>0876 100 600</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Mon - Fri: 8AM - 6PM | Sat: 8AM - 1PM</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                  isDark ? 'bg-green-900/50' : 'bg-green-100'
                }`}>
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className={`font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Email Us</h4>
                  <p className={`mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>info@day1health.co.za</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                  isDark ? 'bg-green-900/50' : 'bg-green-100'
                }`}>
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className={`font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Visit Us</h4>
                  <p className={`mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Cape Town, Johannesburg, Durban</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Multiple locations across South Africa</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                  isDark ? 'bg-green-900/50' : 'bg-green-100'
                }`}>
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className={`font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Emergency Support</h4>
                  <p className={`mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>24/7 Emergency Helpline</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Always available when you need us</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`mt-8 p-6 rounded-2xl shadow-sm ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h4 className={`font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Quick Actions</h4>
              <div className="space-y-3">
                <button className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-900 hover:bg-gray-50'
                }`}>
                  📋 Get a Quote Online
                </button>
                <button className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-900 hover:bg-gray-50'
                }`}>
                  📞 Schedule a Call Back
                </button>
                <button className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-900 hover:bg-gray-50'
                }`}>
                  💬 Start Live Chat
                </button>
                <button className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-900 hover:bg-gray-50'
                }`}>
                  📍 Find Nearest Office
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className={`rounded-2xl shadow-lg p-8 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Send us a Message</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <div className="flex justify-center">
                  <AnimatedContactButton
                    type="button"
                    className="w-64 px-8 opacity-100"
                    onClick={() => {
                      // Demo purposes - just trigger the animation
                      console.log('Contact button clicked for demo');
                    }}
                  />
                </div>
              </div>

              <p className={`text-sm mt-4 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;