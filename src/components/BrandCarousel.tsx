import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface BrandCarouselProps {
  isSidebarCollapsed: boolean;
}

const BrandCarousel: React.FC<BrandCarouselProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();

  // Healthcare company brands
  const brands = [
    {
      name: 'African Assist',
      logo: '/assets/images/Trusted By/african-assist.jpg'
    },
    {
      name: 'African Health Care',
      logo: '/assets/images/Trusted By/african-health-care.png'
    },
    {
      name: 'Clinix',
      logo: '/assets/images/Trusted By/clinix.png'
    },
    {
      name: 'Life Healthcare',
      logo: '/assets/images/Trusted By/life-healthcare.png'
    },
    {
      name: 'Mediclinic',
      logo: '/assets/images/Trusted By/mediclinic.png'
    }
  ];

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section
      className={`relative py-16 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      } ${isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-64'}`}
      style={{
        transition: 'padding-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2
            className={`text-3xl lg:text-4xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Trusted by Leading Brands
          </h2>
          <p
            className={`mt-4 text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Our partners in the healthcare sector nationwide
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden"
          onWheel={(e) => {
            e.preventDefault();
            const container = e.currentTarget.querySelector('.scrollable-track') as HTMLElement;
            if (container) {
              container.scrollLeft += e.deltaY;
            }
          }}
        >
          {/* Gradient Overlays */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none ${
              isDark
                ? 'bg-gradient-to-r from-gray-900 to-transparent'
                : 'bg-gradient-to-r from-gray-50 to-transparent'
            }`}
          />
          <div
            className={`absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none ${
              isDark
                ? 'bg-gradient-to-l from-gray-900 to-transparent'
                : 'bg-gradient-to-l from-gray-50 to-transparent'
            }`}
          />

          {/* Scrolling Track */}
          <div className="flex animate-scroll scrollable-track overflow-x-auto scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
            {duplicatedBrands.map((brand, index) => (
              <div
                key={index}
                className={`flex-shrink-0 mx-8 flex flex-col items-center justify-center w-64 h-48 rounded-xl border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                } shadow-lg hover:shadow-xl transition-shadow duration-300 p-4`}
              >
                {/* Company Logo */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className={`object-contain ${
                    brand.name === 'Life Healthcare' ? 'w-40 h-40' : 'w-36 h-36'
                  }`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        /* Hide scrollbar */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Pause animation when user is scrolling */
        .scrollable-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default BrandCarousel;


