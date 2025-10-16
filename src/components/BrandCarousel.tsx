import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface BrandCarouselProps {
  isSidebarCollapsed: boolean;
}

const BrandCarousel: React.FC<BrandCarouselProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();

  // Demo brand names
  const brands = [
    'Coca-Cola',
    'Microsoft',
    'Amazon',
    'Google',
    'Apple',
    'Samsung',
    'Nike',
    'Adidas',
    'BMW',
    'Mercedes',
    'Toyota',
    'Tesla'
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
            Join the companies that trust us with their healthcare
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
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
          <div className="flex animate-scroll">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={index}
                className={`flex-shrink-0 mx-8 flex items-center justify-center w-48 h-32 rounded-xl border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                } shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                {/* SVG Logo Placeholder */}
                <svg
                  className={`w-24 h-24 ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
                {/* Brand Name */}
                <span
                  className={`absolute bottom-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {brand}
                </span>
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
      `}</style>
    </section>
  );
};

export default BrandCarousel;
