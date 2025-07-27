import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

interface SocialLinksProps {
  isSidebarCollapsed?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ isSidebarCollapsed = false }) => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/day1health',
      color: 'bg-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/day1health',
      color: 'bg-sky-500'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/day1health',
      color: 'bg-pink-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/day1health',
      color: 'bg-blue-700'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/day1health',
      color: 'bg-red-600'
    }
  ];

  // Calculate the horizontal offset based on sidebar state
  const horizontalOffset = isSidebarCollapsed ? '-translate-x-36' : '-translate-x-8';

  return (
    <div 
      className={`fixed bottom-6 left-[calc(50%+15px)] transform -translate-x-1/2 z-50 transition-all duration-300 ${horizontalOffset}`}
    >
      <div className="flex items-center justify-center bg-gray-100/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 group">
        {socialLinks.map((social, index) => {
          const colorMap: { [key: string]: string } = {
            'bg-blue-600': '#1d4ed8',
            'bg-sky-500': '#0ea5e9', 
            'bg-pink-600': '#db2777',
            'bg-blue-700': '#1d4ed8',
            'bg-red-600': '#dc2626'
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
