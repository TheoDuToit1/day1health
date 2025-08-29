import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SocialLinksProps {
  isSidebarCollapsed?: boolean;
  activeSection?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ isSidebarCollapsed = false, activeSection = '' }) => {
  const { isDark } = useTheme();
  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/day1healthsa/',
      color: 'bg-blue-600'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/day1legacy?igshid=MzRlODBiNWFlZA%3D%3D',
      color: 'bg-pink-600'
    }
    // Removed unused social links as per user's current active platforms
  ];

  // Hide social links when on hero section
  if (activeSection === 'hero') {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 w-auto ${
        isSidebarCollapsed ? 'lg:left-[calc(50%+64px)]' : 'lg:left-[calc(50%+128px)]'
      }`}
      style={{
        transition: 'left 0.3s ease-in-out'
      }}
    >
      <div className={`flex items-center justify-center backdrop-blur-sm rounded-xl px-4 py-2.5 sm:px-6 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-500 group ${
        isDark 
          ? 'bg-gray-800/95 border border-gray-700' 
          : 'bg-white/95 border border-gray-200'
      }`}>
        {socialLinks.map((social, index) => {
          const colorMap: { [key: string]: string } = {
            'bg-blue-600': '#2563eb',
            'bg-blue-500': '#3b82f6', 
            'bg-green-600': '#16a34a',
            'bg-blue-700': '#1d4ed8',
            'bg-green-500': '#22c55e'
          };
          
          return (
            <div
              key={index}
              className="relative mx-2 transition-all duration-500 group-hover:blur-sm group-hover:scale-90 hover:!blur-none hover:!scale-110 hover:z-10"
            >
              {/* Tooltip */}
              <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-20">
                <div 
                  className="text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap relative"
                  style={{ backgroundColor: colorMap[social.color] || '#1d4ed8' }}
                >
                  {social.name}
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: '7px solid transparent',
                      borderRight: '7px solid transparent', 
                      borderTop: `10px solid ${colorMap[social.color] || '#1d4ed8'}`
                    }}
                  ></div>
                </div>
              </div>

              {/* Social Icon */}
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 cursor-pointer relative group/icon"
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colorMap[social.color] || '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6b7280';
                }}
              >
                <social.icon className="w-4 h-4" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;
