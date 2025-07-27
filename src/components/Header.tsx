import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, ChevronLeft, ChevronRight, Home, Settings, HelpCircle, MessageSquare, Users } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isFooterInView: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate, isSidebarCollapsed, setIsSidebarCollapsed, isFooterInView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'how-it-works', label: 'How It Works', icon: Settings },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'why-choose', label: 'Why Choose Us', icon: Users },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'contact', label: 'Contact', icon: Phone }
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
      <aside className={`hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:shadow-lg lg:z-40 lg:flex lg:flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:w-16' : 'lg:w-56'
      } ${
        isFooterInView ? 'lg:bg-gray-900' : 'lg:bg-white'
      }`}>
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>
        
        <div className={`p-6 transition-all duration-300 ${
          isFooterInView ? 'border-b border-gray-700' : 'border-b border-gray-200'
        }`}>
          <div className={`flex items-center transition-all duration-300 ${
            isSidebarCollapsed ? 'justify-center' : 'space-x-2'
          }`}>
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D1</span>
            </div>
            {!isSidebarCollapsed && (
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isFooterInView ? 'text-white' : 'text-gray-900'
              }`}>Day1Health</span>
            )}
          </div>
        </div>
        
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors group ${
                    activeSection === item.id
                      ? 'bg-green-600 text-white'
                      : activeSection === 'contact'
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  {isSidebarCollapsed ? (
                    <item.icon className="w-5 h-5 mx-auto" />
                  ) : (
                    <span>{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {!isSidebarCollapsed && (
          <div className={`px-6 py-4 transition-all duration-300 ${
            isFooterInView 
              ? 'border-t border-gray-700' 
              : 'border-t border-gray-200'
          }`}>
            <h3 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
              isFooterInView ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center ${
                isFooterInView 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
                <span className="mr-2">📋</span> Get a Quote
              </button>
              <button className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center ${
                isFooterInView 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
                <span className="mr-2">📞</span> Schedule Call
              </button>
              <button className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center ${
                isFooterInView 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
                <span className="mr-2">💬</span> Live Chat
              </button>
              <button className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center ${
                isFooterInView 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
                <span className="mr-2">📍</span> Find Office
              </button>
            </div>
          </div>
        )}

        {!isSidebarCollapsed && (
          <div className={`p-6 transition-all duration-300 ${
            isFooterInView 
              ? 'border-t border-gray-700 bg-gray-800' 
              : 'border-t border-gray-200 bg-gray-50'
          }`}>
            <div className={`space-y-2 text-sm transition-colors duration-300 ${
              isFooterInView ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <div className="flex items-center space-x-2">
                <Phone className={`w-4 h-4 ${
                  isFooterInView ? 'text-green-400' : 'text-gray-600'
                }`} />
                <span>087 610 0600</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className={`w-4 h-4 ${
                  isFooterInView ? 'text-green-400' : 'text-gray-600'
                }`} />
                <span>info@day1health.co.za</span>
              </div>
            </div>
          </div>
        )}
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