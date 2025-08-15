import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, ChevronLeft, ChevronRight, Home, Settings, HelpCircle, MessageSquare, Users, Quote, Calendar, MessageCircle, MapPin, Download, Mic } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isFooterInView: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate, isSidebarCollapsed, setIsSidebarCollapsed, isFooterInView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showText, setShowText] = useState(!isSidebarCollapsed);
  const [companyText, setCompanyText] = useState('');
  const [taglineText, setTaglineText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Close mobile menu when switching to desktop view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when sidebar is toggled on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isSidebarCollapsed, isMobile]);

  // Typewriter effect for sidebar text
  useEffect(() => {
    if (isSidebarCollapsed) {
      // Reset text immediately when collapsing
      setShowText(false);
      setCompanyText('');
      setTaglineText('');
      setIsTyping(false);
    } else {
      // Start typewriter effect after sidebar expansion completes (700ms)
      const timer = setTimeout(() => {
        setShowText(true);
        setIsTyping(true);
        
        // Type "Day1Health" first
        const companyName = 'Day1Health';
        let companyIndex = 0;
        
        const typeCompany = () => {
          if (companyIndex < companyName.length) {
            setCompanyText(companyName.slice(0, companyIndex + 1));
            companyIndex++;
            setTimeout(typeCompany, 80); // 80ms per character
          } else {
            // After company name is done, type tagline
            setTimeout(() => {
              const tagline = 'Health Solutions';
              let taglineIndex = 0;
              
              const typeTagline = () => {
                if (taglineIndex < tagline.length) {
                  setTaglineText(tagline.slice(0, taglineIndex + 1));
                  taglineIndex++;
                  setTimeout(typeTagline, 60); // 60ms per character for tagline
                } else {
                  setIsTyping(false);
                }
              };
              
              typeTagline();
            }, 200); // 200ms pause between company name and tagline
          }
        };
        
        typeCompany();
      }, 700);
      
      return () => clearTimeout(timer);
    }
  }, [isSidebarCollapsed]);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'how-it-works', label: 'How it works', icon: Settings },
    { id: 'feedback', label: 'Reviews', icon: MessageSquare },
    { id: 'why-choose', label: 'Why Us', icon: Users },
    { id: 'voice-assistants', label: 'Voice AI', icon: Mic, isRoute: true },
    { id: 'contact', label: 'Contact us', icon: Phone },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:shadow-xl lg:z-40 lg:flex lg:flex-col transition-all duration-700 ease-in-out ${
        isSidebarCollapsed ? 'w-24' : 'w-64'
      } ${isDark ? 'bg-gray-900' : 'bg-white'}`}
      style={{
        transition: 'width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.3s ease'
      }}>
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`absolute -right-4 top-8 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-110 ${
            isDark 
              ? 'bg-gray-800 border border-gray-600 hover:bg-gray-700' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
          style={{
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className={`w-4 h-4 ${
              isDark ? 'text-white' : 'text-gray-600'
            }`} />
          ) : (
            <ChevronLeft className={`w-4 h-4 ${
              isDark ? 'text-white' : 'text-gray-600'
            }`} />
          )}
        </button>
        
        <div className={`px-6 pt-4 pb-2 transition-all duration-700 ease-in-out ${
          isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'
        }`}
        style={{
          transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}>
          <div 
          className="flex items-center justify-center h-16 w-full"
          style={{
            transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <div className="relative w-48 h-16 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${isDark ? 'bg-gray-900 border-2 border-gray-700' : 'bg-white border-2 border-green-500'}`}>
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  <img 
                    src="/assets/images/Logo.jpg" 
                    alt="Day 1 Health Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="p-6 pb-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.isRoute ? `/${item.id}` : `#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.isRoute) {
                        window.location.href = `/${item.id}`;
                      } else {
                        onNavigate(item.id);
                      }
                    }}
                    className={`w-full flex items-center rounded-lg transition-all duration-500 ease-in-out group relative transform ${
                      isSidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3 justify-start space-x-3'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-xl scale-105 shadow-green-500/25'
                        : isDark
                          ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white hover:shadow-lg hover:scale-102'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-lg hover:scale-102'
                    }`}
                    style={{
                      transition: '0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    <item.icon className={`transition-all duration-500 ease-in-out transform w-5 h-5 ${
                      isActive ? 'text-white' : 'group-hover:scale-110'
                    }`} />
                    {!isSidebarCollapsed && (
                      <span className="font-medium text-sm transition-all duration-500 ease-in-out">
                        {item.label}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Actions - Always visible with icons */}
        <div className={`px-6 py-2 transition-all duration-300 ${
          isDark 
            ? 'border-t border-gray-700' 
            : 'border-t border-gray-200'
        }`}>
          {!isSidebarCollapsed && (
            <h4 className={`font-medium mb-4 text-sm uppercase tracking-wide ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>Quick Actions</h4>
          )}
          <div className={`grid gap-2 ${
            isSidebarCollapsed ? 'grid-cols-1' : 'grid-cols-2'
          }`}>
            <button 
              className={`flex items-center justify-center rounded-lg transition-all duration-300 group ${
                isSidebarCollapsed ? 'p-2.5' : 'p-2.5'
              } ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-600'
              }`}
              title="Get a Quote"
            >
              <Quote className={`${
                isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5'
              }`} />
              {!isSidebarCollapsed && <span className="ml-2 text-sm font-medium">Quote</span>}
            </button>
            <button 
              className={`flex items-center justify-center rounded-lg transition-all duration-300 group ${
                isSidebarCollapsed ? 'p-2.5' : 'p-2.5'
              } ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-600'
              }`}
              title="Schedule Call"
            >
              <Calendar className={`${
                isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5'
              }`} />
              {!isSidebarCollapsed && <span className="ml-2 text-sm font-medium">Call</span>}
            </button>
            {/* Corporate Hotline Marquee Banner (replaces Chat + Office) */}
            <div
              className={`${!isSidebarCollapsed ? 'col-span-2' : ''} relative overflow-hidden rounded-lg ${
                isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-green-50 border border-green-200'
              } p-2.5`}
              role="region"
              aria-label="Corporate hotline banner"
            >
              {/* marquee track */}
              <div
                className={`flex items-center gap-10 whitespace-nowrap animate-marquee ${
                  isDark ? 'text-gray-100' : 'text-green-800'
                }`}
                style={{
                  // @ts-ignore custom css var for gap and speed
                  '--gap': '2.5rem',
                  '--duration': '18s'
                }}
              >
                {/* Repeat content chunks to create seamless loop */}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-baseline gap-3">
                    <span className={`text-[10px] tracking-widest uppercase font-semibold ${
                      isDark ? 'text-emerald-300' : 'text-emerald-700'
                    }`}>
                      Corporate hotline
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      Your 2 step link to our CEO
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information - Always visible */}
        <div className={`p-6 mt-auto transition-all duration-300 ${
          isDark 
            ? 'border-t border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900' 
            : 'border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100'
        }`}>
          {!isSidebarCollapsed && (
            <h4 className={`font-medium mb-4 text-sm uppercase tracking-wide ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>Contact Info</h4>
          )}
          <div className={`space-y-3 ${
            isSidebarCollapsed ? 'flex flex-col items-center' : ''
          }`}>
            <div className={`flex items-center transition-all duration-300 ${
              isSidebarCollapsed ? 'justify-center' : 'space-x-3'
            }`}>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-green-600' : 'bg-green-100'
              }`}>
                <Phone className={`w-4 h-4 ${
                  isDark ? 'text-white' : 'text-green-600'
                }`} />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>0876 100 600</span>
                  <span className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Call us now</span>
                </div>
              )}
            </div>
            <div className={`flex items-center transition-all duration-300 ${
              isSidebarCollapsed ? 'justify-center' : 'space-x-3'
            }`}>
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-green-600' : 'bg-green-100'
              }`}>
                <Mail className={`w-4 h-4 ${
                  isDark ? 'text-white' : 'text-green-600'
                }`} />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>info@day1health.co.za</span>
                  <span className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Send us an email</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? isDark 
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-800' 
            : 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100'
          : isDark 
            ? 'bg-gray-900/90 backdrop-blur-md' 
            : 'bg-white/90 backdrop-blur-md'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105 overflow-hidden ${
              isScrolled ? 'shadow-green-500/20' : ''
            }`}>
              <img 
                src="/assets/images/Logo.jpg" 
                alt="Day 1 Health Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Day1Health</span>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>Smart Health Cover</span>
            </div>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`relative p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              isMenuOpen 
                ? isDark 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/25' 
                  : 'bg-red-50 text-red-600 shadow-lg shadow-red-500/10'
                : isDark 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 shadow-lg'
            }`}
          >
            <div className="relative w-6 h-6">
              <Menu className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                isMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
              }`} />
              <X className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
              }`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`absolute top-full left-0 right-0 overflow-hidden transition-all duration-500 ease-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`transition-all duration-300 ${
            isDark 
              ? 'bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 shadow-2xl' 
              : 'bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl'
          }`}>
            <nav className="py-6 px-4">
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center space-x-4 group ${
                      activeSection === item.id
                        ? isDark 
                          ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/25'
                          : 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-2 border-green-200 shadow-lg shadow-green-500/10'
                        : isDark 
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMenuOpen ? 'slideInFromRight 0.4s ease-out forwards' : 'none'
                    }}
                  >
                    <item.icon className={`w-5 h-5 transition-all duration-300 ${
                      activeSection === item.id 
                        ? 'text-current scale-110' 
                        : 'group-hover:scale-105'
                    }`} />
                    <span className="font-medium text-base">{item.label}</span>
                    {activeSection === item.id && (
                      <div className="ml-auto w-2 h-2 bg-current rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Quick Contact in Mobile Menu */}
              <div className={`mt-6 pt-6 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="tel:0876100600"
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isDark 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                        : 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-medium text-sm">Call</span>
                  </a>
                  <a 
                    href="mailto:info@day1health.co.za"
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isDark 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 shadow-lg'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="font-medium text-sm">Email</span>
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;