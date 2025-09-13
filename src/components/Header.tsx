import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, ChevronLeft, ChevronRight, Home, Settings, HelpCircle, MessageSquare, Users, Search, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isFooterInView: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate, isSidebarCollapsed, setIsSidebarCollapsed, isFooterInView: _isFooterInView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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

  // Removed legacy typewriter effect and related state

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'how-it-works', label: 'How it works', icon: Settings },
    { id: 'feedback', label: 'Reviews', icon: MessageSquare },
    { id: 'why-choose', label: 'Why Us', icon: Users },
    { id: 'contact', label: 'Contact us', icon: Phone },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'network-search', label: 'Network Search', icon: Search },
    { id: 'procedures', label: 'Procedures', icon: Plus },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // No animations or dynamic behavior for hotline per request

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
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); onNavigate('hero'); }}
              aria-label="Go to Home"
              className="relative w-48 h-16 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-lg cursor-pointer"
            >
              <div className={`absolute inset-0 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${isDark ? 'bg-gray-900 border-2 border-gray-700' : 'bg-white border-2 border-green-500'}`}>
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  <img 
                    src="/assets/images/Logo.jpg" 
                    alt="Day 1 Health Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </a>
          </div>
        </div>
        
        <nav className="p-6 pb-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = _isFooterInView ? (item.id === 'procedures') : (activeSection === item.id);
              const baseClasses = `w-full flex items-center rounded-lg transition-all duration-500 ease-in-out group relative transform ${
                isSidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3 justify-start space-x-3'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-xl scale-105 shadow-green-500/25'
                  : isDark
                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white hover:shadow-lg hover:scale-102'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-lg hover:scale-102'
              }`;
              if (item.id === 'network-search') {
                return (
                  <li key={item.id} className="relative group">
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.id);
                      }}
                      className={baseClasses}
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
                    {/* Hover submenu (improved) */}
                    <div
                      className={`absolute top-0 left-full ml-2 z-50 w-72 rounded-xl border shadow-2xl p-3 opacity-0 invisible translate-y-1 scale-95 origin-left
                        group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100
                        group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100
                        transition-all duration-200 ${
                        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                      }`}
                      role="menu"
                      aria-label="Network Search submenu"
                    >
                      {/* Pointer arrow */}
                      <div
                        className={`absolute -left-1 top-3 w-3 h-3 rotate-45 ${
                          isDark ? 'bg-gray-900 border-l border-t border-gray-700' : 'bg-white border-l border-t border-gray-200'
                        }`}
                        aria-hidden="true"
                      />
                      <ul className="space-y-1">
                        {[
                          { label: 'Doctor Directory', href: 'https://day1health.co.za/medical-directory/' },
                          { label: 'Life Healthcare Hospitals', href: 'https://www.lifehealthcare.co.za/hospitals/' },
                          { label: 'Mediclinic Hospitals', href: 'https://www.mediclinic.co.za/en/corporate/hospitals.html' },
                          { label: 'Africa Health Care', href: 'https://www.africahealthcare.co.za/' },
                          { label: 'Iso Leso Optics', href: 'https://search.mymembership.co.za/Search/?Id=dff1cb34-a717-47e0-a58d-8e5d15744e77' },
                          { label: 'Clinix Health Group', href: 'https://clinix.co.za/hospitals/' },
                        ].map((item) => (
                          <li key={item.label}>
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              role="menuitem"
                              className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg outline-none transition-all focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
                                isDark
                                  ? 'text-gray-300 hover:text-white hover:bg-gray-800 focus-visible:ring-offset-gray-900'
                                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus-visible:ring-offset-white'
                              }`}
                            >
                              <span className="truncate">{item.label}</span>
                              <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-700'}`} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }
              if (item.id === 'procedures') {
                return (
                  <li key={item.id}>
                    <a
                      href="#footer"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('footer');
                      }}
                      className={baseClasses}
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
              }
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    className={baseClasses}
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

        {/* Sidebar Quick Actions */}
        <div className={`${isSidebarCollapsed ? 'px-0' : 'px-6'} pt-1 pb-2 transition-all duration-700 ease-in-out`}>
          {!isSidebarCollapsed && (
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h4>
          )}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm ${isSidebarCollapsed ? 'p-2' : 'p-3'}`}>
            <div className={`grid w-full ${isSidebarCollapsed ? 'grid-cols-1 gap-1' : 'grid-cols-2 gap-2'}`}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new Event('openCallModal'));
                }}
                aria-label="Call Day1Health"
                className={`rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } ${isSidebarCollapsed ? 'w-10 h-10 flex items-center justify-center mx-auto px-0' : 'w-full px-3 py-2'} text-center`}
              >
                {isSidebarCollapsed ? (
                  <Phone className="w-5 h-5 shrink-0 text-white" />
                ) : (
                  'Call'
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Open the "Quote me" modal and also navigate to Contact section
                  window.dispatchEvent(new Event('openQuoteModal'));
                  onNavigate('contact');
                }}
                aria-label="Quote"
                className={`rounded-lg text-sm font-medium transition-colors border ${
                  isDark
                    ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-800 hover:bg-gray-50'
                } ${isSidebarCollapsed ? 'w-10 h-10 flex items-center justify-center mx-auto px-0' : 'w-full px-3 py-2'}`}
              >
                {isSidebarCollapsed ? (
                  <MessageSquare className={`w-5 h-5 shrink-0 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} />
                ) : (
                  'Quote'
                )}
              </button>
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
                  }`}>admin@day1.co.za</span>
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
            ? 'bg-gray-900/90 backdrop-blur-md border-b border-transparent' 
            : 'bg-white/90 backdrop-blur-md border-b border-transparent'
      }`}>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-0">
            {/* Logo removed on mobile per request */}
            <div className="flex flex-col justify-center h-9 min-w-0">
              <span className={`text-lg font-bold leading-none whitespace-nowrap transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Day1Health</span>
              <span className={`text-xs font-medium leading-none whitespace-nowrap transition-colors duration-300 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>Smart Health Cover</span>
            </div>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`relative p-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              isMenuOpen 
                ? isDark 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/25' 
                  : 'bg-red-50 text-red-600 shadow-lg shadow-red-500/10'
                : isDark 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 shadow-lg'
            }`}
          >
            <div className="relative w-5 h-5">
              <Menu className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                isMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
              }`} />
              <X className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
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
                {navItems.map((item, index) => {
                  const isItemActive = _isFooterInView ? (item.id === 'procedures') : (activeSection === item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'procedures') {
                          onNavigate('footer');
                        } else {
                          onNavigate(item.id);
                        }
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center space-x-4 group ${
                        isItemActive
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
                        isItemActive 
                          ? 'text-current scale-110' 
                          : 'group-hover:scale-105'
                      }`} />
                      <span className="font-medium text-base">{item.label}</span>
                      {isItemActive && (
                        <div className="ml-auto w-2 h-2 bg-current rounded-full animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Quick Contact in Mobile Menu */}
              <div className={`mt-6 pt-6 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new Event('openCallModal'));
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isDark 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                        : 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-medium text-sm">Call</span>
                  </button>
                  <a 
                    href="mailto:admin@day1.co.za"
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