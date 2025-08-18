import React, { useState } from 'react';
import { Phone, Mail, Clock, X, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ContactProps {
  isSidebarCollapsed: boolean;
}

const Contact: React.FC<ContactProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  const [isExistingMemberOpen, setIsExistingMemberOpen] = useState(false);
  const [isProspectiveOpen, setIsProspectiveOpen] = useState(false);

  const [existingMemberData, setExistingMemberData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    enquiry: '',
    message: ''
  });

  const [prospectiveData, setProspectiveData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    infoAbout: '',
    heardFrom: '',
    message: ''
  });

  const handleExistingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExistingMemberData(prev => ({ ...prev, [name]: value }));
  };

  const handleProspectiveChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProspectiveData(prev => ({ ...prev, [name]: value }));
  };

  const submitExisting = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Existing Member form submitted:', existingMemberData);
    setIsExistingMemberOpen(false);
    setExistingMemberData({ firstName: '', lastName: '', phone: '', email: '', enquiry: '', message: '' });
    alert("Thanks! We'll assist you shortly.");
  };

  const submitProspective = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Prospective Client form submitted:', prospectiveData);
    setIsProspectiveOpen(false);
    setProspectiveData({ firstName: '', lastName: '', phone: '', email: '', infoAbout: '', heardFrom: '', message: '' });
    alert("Thanks! We'll be in touch soon.");
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
          <div className="mt-2.5">
            <h3 className={`text-2xl font-bold mb-6 ${
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
                  📋 Get a Quote
                </button>
                <button className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-900 hover:bg-gray-50'
                }`}>
                  📞 Schedule Call Back
                </button>
              </div>
            </div>
          </div>

          {/* Actions and Modal Triggers */}
          <div className="lg:-mt-4">
            <div className={`rounded-2xl shadow-lg p-8 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <HelpCircle className="w-6 h-6 text-green-600" />
                How can we help?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  className={`w-full p-3 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700`}
                  onClick={() => setIsExistingMemberOpen(true)}
                >
                  Existing Member
                </button>
                <button
                  className={`w-full p-3 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700`}
                  onClick={() => setIsProspectiveOpen(true)}
                >
                  Prospective Client
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Member Modal */}
      {isExistingMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsExistingMemberOpen(false)} />
          <div className={`relative w-full max-w-2xl mx-4 rounded-2xl shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              aria-label="Close"
              className={`absolute top-3 right-3 p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => setIsExistingMemberOpen(false)}
            >
              <X className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <form onSubmit={submitExisting} className="p-6 sm:p-8">
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>How can We help</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>First Name</label>
                  <input name="firstName" value={existingMemberData.firstName} onChange={handleExistingChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Last Name</label>
                  <input name="lastName" value={existingMemberData.lastName} onChange={handleExistingChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                  <input type="tel" name="phone" value={existingMemberData.phone} onChange={handleExistingChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input type="email" name="email" value={existingMemberData.email} onChange={handleExistingChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>I have an enquiry about</label>
                  <select name="enquiry" value={existingMemberData.enquiry} onChange={handleExistingChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <option value="">Select an option</option>
                    <option>Debit Order Claims</option>
                    <option>Doctor Claims</option>
                    <option>Administration</option>
                    <option>Hospital Claims</option>
                    <option>Remittance</option>
                    <option>Reimbursements</option>
                    <option>Authorisations</option>
                    <option>Complaints</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                  <textarea name="message" value={existingMemberData.message} onChange={handleExistingChange} rows={4} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsExistingMemberOpen(false)} className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prospective Client Modal */}
      {isProspectiveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsProspectiveOpen(false)} />
          <div className={`relative w-full max-w-2xl mx-4 rounded-2xl shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              aria-label="Close"
              className={`absolute top-3 right-3 p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => setIsProspectiveOpen(false)}
            >
              <X className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <form onSubmit={submitProspective} className="p-6 sm:p-8">
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Us Today!</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>First Name</label>
                  <input name="firstName" value={prospectiveData.firstName} onChange={handleProspectiveChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Last Name</label>
                  <input name="lastName" value={prospectiveData.lastName} onChange={handleProspectiveChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                  <input type="tel" name="phone" value={prospectiveData.phone} onChange={handleProspectiveChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input type="email" name="email" value={prospectiveData.email} onChange={handleProspectiveChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>I need Info about..</label>
                  <select name="infoAbout" value={prospectiveData.infoAbout} onChange={handleProspectiveChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <option value="">Select an option</option>
                    <option>How to Sign Up</option>
                    <option>General Information</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Where did you hear about us?</label>
                  <select name="heardFrom" value={prospectiveData.heardFrom} onChange={handleProspectiveChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <option value="">Select an option</option>
                    <option>From a friend</option>
                    <option>Google search</option>
                    <option>Google Ad</option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                  <textarea name="message" value={prospectiveData.message} onChange={handleProspectiveChange} rows={4} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsProspectiveOpen(false)} className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;