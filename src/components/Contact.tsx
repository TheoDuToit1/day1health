import React, { useEffect, useState } from 'react';
import { Phone, Mail, Clock, X, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import EmailDirectory from './EmailDirectory';

interface ContactProps {
  isSidebarCollapsed: boolean;
}

const Contact: React.FC<ContactProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  const [isExistingMemberOpen, setIsExistingMemberOpen] = useState(false);
  const [isProspectiveOpen, setIsProspectiveOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);

  const [existingMemberData, setExistingMemberData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    enquiry: '',
    message: ''
  });

  // Listen for global event or session flag to open Prospective modal
  useEffect(() => {
    const handler = () => setIsProspectiveOpen(true);
    window.addEventListener('openProspective', handler as EventListener);
    const callHandler = () => setIsCallOpen(true);
    window.addEventListener('openCallModal', callHandler as EventListener);
    const quoteHandler = () => setIsQuoteOpen(true);
    window.addEventListener('openQuoteModal', quoteHandler as EventListener);
    // session flag support
    if (sessionStorage.getItem('openProspective') === '1') {
      setIsProspectiveOpen(true);
      sessionStorage.removeItem('openProspective');
    }
    return () => {
      window.removeEventListener('openProspective', handler as EventListener);
      window.removeEventListener('openCallModal', callHandler as EventListener);
      window.removeEventListener('openQuoteModal', quoteHandler as EventListener);
    };
  }, []);

  const [prospectiveData, setProspectiveData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    infoAbout: '',
    heardFrom: '',
    message: ''
  });

  // Quote form data
  const [quoteData, setQuoteData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    planCategory: '', // day-to-day, hospital, comprehensive, senior
    seniorCategory: '', // when planCategory === 'senior': day-to-day, hospital, comprehensive
    tier: '', // when planCategory is hospital or comprehensive (non-senior): value, platinum, executive
    subCategory: '', // single, couple, family (Senior: single, couple)
    message: '',
    children: [] as { name: string; age: string }[]
  });

  // Schedule a call form data
  const [scheduleData, setScheduleData] = useState({
    name: '',
    phone: '',
    email: '',
    reason: '',
    date: '',
    time: ''
  });

  const handleExistingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExistingMemberData(prev => ({ ...prev, [name]: value }));
  };

  const handleProspectiveChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProspectiveData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteData(prev => {
      const next = { ...prev, [name]: value } as typeof prev;
      if (name === 'planCategory') {
        // Clear tier when not hospital/comprehensive
        if (value !== 'hospital' && value !== 'comprehensive') {
          next.tier = '';
        }
        // Clear seniorCategory when not senior
        if (value !== 'senior') {
          next.seniorCategory = '';
        }
        // Senior cannot have family
        if (value === 'senior' && next.subCategory === 'family') {
          next.subCategory = '';
        }
        // If switching to senior or away from family context, clear children
        if (value === 'senior') {
          (next as any).children = [];
        }
      }
      // Defensive: if changing seniorCategory, nothing else to clear
      if (name === 'seniorCategory') {
        // no-op for now
      }
      // If subCategory changes away from family, clear children
      if (name === 'subCategory' && value !== 'family') {
        (next as any).children = [];
      }
      return next;
    });
  };

  // Handlers for dynamic children when subCategory === 'family'
  const addChild = () => {
    setQuoteData(prev => ({
      ...prev,
      children: [...(prev.children || []), { name: '', age: '' }]
    }));
  };

  const removeChild = (index: number) => {
    setQuoteData(prev => ({
      ...prev,
      children: (prev.children || []).filter((_, i) => i !== index)
    }));
  };

  const handleChildChange = (index: number, field: 'name' | 'age', value: string) => {
    setQuoteData(prev => {
      const children = [...(prev.children || [])];
      children[index] = { ...children[index], [field]: value };
      return { ...prev, children };
    });
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({ ...prev, [name]: value }));
  };

  const submitExisting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'existing', data: existingMemberData })
      });
      
      if (response.ok) {
        setIsExistingMemberOpen(false);
        setExistingMemberData({ firstName: '', lastName: '', phone: '', email: '', enquiry: '', message: '' });
        alert("Thanks! We'll assist you shortly.");
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const submitProspective = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'prospective', data: prospectiveData })
      });
      
      if (response.ok) {
        setIsProspectiveOpen(false);
        setProspectiveData({ firstName: '', lastName: '', phone: '', email: '', infoAbout: '', heardFrom: '', message: '' });
        alert("Thanks! We'll be in touch soon.");
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType: 'quote', data: quoteData })
      });
      
      if (response.ok) {
        setIsQuoteOpen(false);
        setQuoteData({ firstName: '', lastName: '', phone: '', email: '', planCategory: '', seniorCategory: '', tier: '', subCategory: '', message: '', children: [] });
        alert('Thanks! We\'ll prepare a quote and contact you shortly.');
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const submitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Schedule a Call form submitted:', scheduleData);
    setIsScheduleOpen(false);
    setScheduleData({ name: '', phone: '', email: '', reason: '', date: '', time: '' });
    alert('Thanks! Your call has been scheduled.');
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
            Ready to get covered or have any questions? Our team is here to help you find the perfect healthcare solution.
          </p>
        </div>

      {/* Call Modal */}
      {isCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCallOpen(false)} />
          <div className={`relative w-full max-w-md mx-4 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              aria-label="Close"
              className={`absolute top-3 right-3 p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => setIsCallOpen(false)}
            >
              <X className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <div className="p-6 sm:p-8 text-center">
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Call Us</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Our team is ready to help. Call the number below:</p>
              <div className="mt-5 mb-2">
                <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                  <span className={`text-2xl font-extrabold tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>0876 100 600</span>
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={async () => { await navigator.clipboard.writeText('0876100600'); }}
                  className={`px-4 py-2 rounded-lg text-sm ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                >
                  Copy Number
                </button>
                <a
                  href="https://api.whatsapp.com/send/?phone=27727205511&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  }`}>Mon–Fri 8:00–16:30, Sat 8:00–13:00</p>
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
                  <div>
                    <a href="mailto:admin@day1.co.za" className={`${
                      isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}>admin@day1.co.za</a>
                  </div>
                  <div className="mt-1">
                    <a href="mailto:sales@day1.co.za" className={`${
                      isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}>sales@day1.co.za</a>
                  </div>
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
                  }`}>Emergency Hospital Hotline</h4>
                  <p className={`mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <a href="tel:0861144144" className="font-semibold text-green-600 hover:underline">0861-144-144</a>
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>24/7 Available • Always here when you need us</p>
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
                <button onClick={() => setIsQuoteOpen(true)} className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-900 hover:bg-gray-50'
                }`}>
                  📋 Quote me
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
              {/* Email Directory */}
              <div className="mb-6">
                <EmailDirectory />
              </div>
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
          <div className={`relative w-full max-w-2xl mx-4 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              aria-label="Close"
              className={`absolute top-3 right-3 p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => setIsExistingMemberOpen(false)}
            >
              <X className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <form onSubmit={submitExisting} className="p-6 sm:p-8">
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>How can We help</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <textarea name="message" value={existingMemberData.message} onChange={handleExistingChange} rows={3} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
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

      {/* Quote me Modal */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsQuoteOpen(false)} />
          <div className={`relative w-full max-w-2xl mx-4 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              aria-label="Close"
              className={`absolute top-3 right-3 p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => setIsQuoteOpen(false)}
            >
              <X className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <form onSubmit={submitQuote} className="p-6 sm:p-8">
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quote me</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>First Name</label>
                  <input name="firstName" value={quoteData.firstName} onChange={handleQuoteChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Last Name</label>
                  <input name="lastName" value={quoteData.lastName} onChange={handleQuoteChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                  <input type="tel" name="phone" value={quoteData.phone} onChange={handleQuoteChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input type="email" name="email" value={quoteData.email} onChange={handleQuoteChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Plan Category</label>
                  <select name="planCategory" value={quoteData.planCategory} onChange={handleQuoteChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <option value="">Select a plan</option>
                    <option value="day-to-day">Day-to-Day</option>
                    <option value="hospital">Hospital</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
                {quoteData.planCategory === 'senior' && (
                  <div className="sm:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Senior Plan Type</label>
                    <select name="seniorCategory" value={quoteData.seniorCategory} onChange={handleQuoteChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                      <option value="">Select a senior plan</option>
                      <option value="day-to-day">Day-to-Day</option>
                      <option value="hospital">Hospital</option>
                      <option value="comprehensive">Comprehensive</option>
                    </select>
                  </div>
                )}
                {(quoteData.planCategory === 'hospital' || quoteData.planCategory === 'comprehensive') && (
                  <div className="sm:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Tier</label>
                    <select name="tier" value={quoteData.tier} onChange={handleQuoteChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                      <option value="">Select a tier</option>
                      <option value="value">Value Plus</option>
                      <option value="platinum">Platinum</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Subcategory</label>
                  <select name="subCategory" value={quoteData.subCategory} onChange={handleQuoteChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <option value="">Select a subcategory</option>
                    <option value="single">Single</option>
                    <option value="couple">Couple</option>
                    {quoteData.planCategory !== 'senior' && (
                      <option value="family">Family</option>
                    )}
                  </select>
                </div>
                {quoteData.subCategory === 'family' && quoteData.planCategory !== 'senior' && (
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Children</label>
                      <button type="button" onClick={addChild} className="text-sm px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700">Add child</button>
                    </div>
                    <div className="space-y-3">
                      {(quoteData.children || []).length === 0 && (
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No children added yet.</p>
                      )}
                      {(quoteData.children || []).map((child, idx) => (
                        <div key={idx} className={`grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div className="sm:col-span-2">
                            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Child Name</label>
                            <input
                              value={child.name}
                              onChange={(e) => handleChildChange(idx, 'name', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                              placeholder="e.g., Alex"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Age</label>
                            <input
                              type="number"
                              min={0}
                              value={child.age}
                              onChange={(e) => handleChildChange(idx, 'age', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                              placeholder="e.g., 7"
                            />
                          </div>
                          <div className="sm:col-span-1 flex items-end">
                            <button type="button" onClick={() => removeChild(idx)} className={`w-full px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-200'}`}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Message (Optional)</label>
                  <textarea name="message" value={quoteData.message} onChange={handleQuoteChange} rows={3} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus-border-transparent resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsQuoteOpen(false)} className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule a Call Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsScheduleOpen(false)} />
          <div className={`relative w-full max-w-2xl mx-4 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              aria-label="Close"
              className={`absolute top-3 right-3 p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => setIsScheduleOpen(false)}
            >
              <X className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <form onSubmit={submitSchedule} className="p-6 sm:p-8">
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Schedule a Call Back</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                  <input name="name" value={scheduleData.name} onChange={handleScheduleChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                  <input type="tel" name="phone" value={scheduleData.phone} onChange={handleScheduleChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input type="email" name="email" value={scheduleData.email} onChange={handleScheduleChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Reason for Call</label>
                  <textarea name="reason" value={scheduleData.reason} onChange={handleScheduleChange} rows={3} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Preferred Date</label>
                  <input type="date" name="date" value={scheduleData.date} onChange={handleScheduleChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Preferred Time</label>
                  <input type="time" name="time" value={scheduleData.time} onChange={handleScheduleChange} required className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsScheduleOpen(false)} className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>Cancel</button>
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
          <div className={`relative w-full max-w-2xl mx-4 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              aria-label="Close"
              className={`absolute top-3 right-3 p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => setIsProspectiveOpen(false)}
            >
              <X className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <form onSubmit={submitProspective} className="p-6 sm:p-8">
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Us Today!</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option>Plan Benefits & Pricing</option>
                    <option>Doctor Visits & Day-to-Day Cover</option>
                    <option>Private Hospital Cover</option>
                    <option>Combined Cover (Hospital + Doctor Visits)</option>
                    <option>Existing Member Support</option>
                    <option>Claims & Benefits Enquiries</option>
                    <option>Add a Spouse / Child / Family Member</option>
                    <option>Upgrade or Change My Plan</option>
                    <option>Employer / Business Group Cover</option>
                    <option>Partnership or Broker Enquiries</option>
                    <option>Technical Support (App Login)</option>
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