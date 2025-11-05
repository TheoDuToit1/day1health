import React from 'react';
import { Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface WhyChooseProps {
  isSidebarCollapsed: boolean;
}

const WhyChoose: React.FC<WhyChooseProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  const features = [
    {
      // Replaces Lucide Shield with custom icon
      img: '/icons/immunity.png',
      title: "Real Health Cover",
      description: "Not just gap cover - comprehensive medical insurance that covers doctor visits, medications, hospital stays, and emergencies.",
      size: 'w-[37px] h-[37px] md:w-[45px] md:h-[45px]'
    },
    {
      img: '/icons/duration-alt.png',
      title: "No Waiting Periods",
      description: "Coverage starts from Day 1 for accidents and emergency ambulance services. No waiting around when you need care most.\n\n*Terms & Conditions Apply*",
    },
    {
      img: '/icons/features-alt.png',
      title: "Underwritten by African Unity",
      description: "Underwritten by African Unity Life — with decades of experience in the South African medical insurance market.",
    },
    {
      img: '/icons/population-globe.png',
      title: "Nationwide Network",
      description: "Access thousands of healthcare providers across South Africa. Use your cover wherever you are.",
    },
    {
      img: '/icons/users-loyalty.png',
      title: "Inclusive & Accessible",
      description: "Inclusive and accessible design for all South Africans and foreign residents.",
    },
    {
      img: '/icons/skill.png',
      title: "24/7 Support",
      description: "24/7 emergency assistance via Africa Assist (0861-144-144). Call-centre support during office hours (0876 100 600). We're here when you need us most.",
    }
  ];

  return (
    <section 
      className={`py-20 transition-all duration-700 ease-in-out border-b scroll-mt-32 ${
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
            Why Choose Day1Health
          </span>
          <h2 id="why-choose" className={`text-4xl lg:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Healthcare That Works for You
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We believe every South African deserves access to quality healthcare. Here's what makes us different.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border group ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
                isDark ? 'bg-blue-900/30' : 'bg-blue-100'
              } ring-1 ring-blue-500/20`}>
                {('img' in feature && feature.img) ? (
                  <img src={feature.img} alt={feature.title} width="32" height="32" className={`${(feature as any).size ?? 'w-8 h-8'} object-contain`} />
                ) : (
                  // Fallback to Lucide if needed
                  <Shield className="w-8 h-8 text-green-600" />
                )}
              </div>
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{feature.title}</h3>
              <p className={`leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className={`rounded-2xl shadow-lg p-8 md:p-12 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">1000's</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>of Happy Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">100's</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>of Network Providers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Emergency Support</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
                <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default WhyChoose;