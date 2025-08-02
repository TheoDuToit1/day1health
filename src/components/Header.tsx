import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, ChevronLeft, ChevronRight, Home, Settings, HelpCircle, MessageSquare, Users, Quote, Calendar, MessageCircle, MapPin } from 'lucide-react';
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
    { id: 'contact', label: 'Contact us', icon: Phone },
    { id: 'faqs', label: 'Faqs', icon: HelpCircle }
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
        
        <div className={`p-6 transition-all duration-700 ease-in-out ${
          isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'
        }`}
        style={{
          transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}>
          <div className={`flex items-center transition-all duration-700 ease-in-out ${
            isSidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'
          }`}
          style={{
            transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}>
            <div className={`${isSidebarCollapsed ? 'w-12 h-12' : 'w-10 h-10'} bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center transition-all duration-700 ease-in-out shadow-lg transform`}
            style={{
              transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}>
              <span className={`text-white font-bold ${isSidebarCollapsed ? 'text-lg' : 'text-base'}`}>D1</span>
            </div>
            {showText && (
              <div className="flex flex-col transition-all duration-300 ease-in-out transform"
              style={{
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}>
                <span className={`font-bold text-lg transition-all duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {companyText}
                  {isTyping && companyText.length < 'Day1Health'.length && (
                    <span className="animate-pulse text-green-500">|</span>
                  )}
                </span>
                <span className={`text-sm transition-all duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {taglineText}
                  {isTyping && companyText.length === 'Day1Health'.length && taglineText.length < 'Health Solutions'.length && (
                    <span className="animate-pulse text-green-500">|</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <nav className="p-6 pb-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center rounded-lg transition-all duration-500 ease-in-out group relative transform ${
                    isSidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3 justify-start space-x-3'
                  } ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-xl scale-105 shadow-green-500/25'
                      : isDark
                        ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white hover:shadow-lg hover:scale-102'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-lg hover:scale-102'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                  style={{
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <item.icon className={`transition-all duration-500 ease-in-out transform ${
                    isSidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                  } ${
                    activeSection === item.id ? 'text-white scale-110' : 'group-hover:scale-105'
                  }`} />
                  {!isSidebarCollapsed && (
                    <span className={`font-medium text-sm transition-all duration-500 ease-in-out ${
                      activeSection === item.id ? 'transform translate-x-1' : ''
                    }`}>{item.label}</span>
                  )}

                </button>
              </li>
            ))}
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
                isSidebarCollapsed ? 'p-3' : 'p-3'
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
                isSidebarCollapsed ? 'p-3' : 'p-3'
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
            <button 
              className={`flex items-center justify-center rounded-lg transition-all duration-300 group ${
                isSidebarCollapsed ? 'p-3' : 'p-3'
              } ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-600'
              }`}
              title="Live Chat"
            >
              <MessageCircle className={`${
                isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5'
              }`} />
              {!isSidebarCollapsed && <span className="ml-2 text-sm font-medium">Chat</span>}
            </button>
            <button 
              className={`flex items-center justify-center rounded-lg transition-all duration-300 group ${
                isSidebarCollapsed ? 'p-3' : 'p-3'
              } ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-600'
              }`}
              title="Find Office"
            >
              <MapPin className={`${
                isSidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5'
              }`} />
              {!isSidebarCollapsed && <span className="ml-2 text-sm font-medium">Office</span>}
            </button>
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
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-md'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D1</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Day1Health</span>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <nav className="py-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    activeSection === item.id
                      ? 'bg-green-50 text-green-600 border-r-4 border-green-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;