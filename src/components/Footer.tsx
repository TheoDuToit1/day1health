import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Shield } from 'lucide-react';
import BB8Toggle from './BB8Toggle';
import { useTheme } from '../contexts/ThemeContext';
import { BlogCard } from './ui/blog-card';
import './Footer.css';

interface FooterProps {
  id?: string;
  isSidebarCollapsed?: boolean;
}

const Footer: React.FC<FooterProps> = ({ id, isSidebarCollapsed = false }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // Blog data sets with navigation IDs
  const blogSets = [
    [
      {
        title: "Health Tips",
        description: "Essential wellness advice for better living",
        badge: "HEALTH",
        imageColor: "#22c55e",
        price: "Read More",
        blogId: "health-tips-immune-system"
      },
      {
        title: "Insurance Guide",
        description: "Understanding your medical aid benefits",
        badge: "GUIDE",
        imageColor: "#3b82f6",
        price: "Learn More",
        blogId: "insurance-guide-medical-aid"
      },
      {
        title: "Latest News",
        description: "Updates from the healthcare industry",
        badge: "NEWS",
        imageColor: "#1f2937",
        price: "View All",
        blogId: "latest-news-healthcare-trends"
      }
    ],
    [
      {
        title: "Mental Wellness",
        description: "Daily practices for mental health support",
        badge: "WELLNESS",
        imageColor: "#22c55e",
        price: "Read More",
        blogId: "mental-wellness-daily-practices"
      },
      {
        title: "Family Care",
        description: "Comprehensive health planning for families",
        badge: "FAMILY",
        imageColor: "#3b82f6",
        price: "Learn More",
        blogId: "family-care-health-planning"
      },
      {
        title: "Prevention",
        description: "Early detection and preventive care strategies",
        badge: "PREVENTION",
        imageColor: "#1f2937",
        price: "Discover",
        blogId: "prevention-early-detection"
      }
    ],
    [
      {
        title: "Nutrition Facts",
        description: "Healthy eating tips for stronger immunity",
        badge: "NUTRITION",
        imageColor: "#22c55e",
        price: "Read More",
        blogId: "health-tips-immune-system"
      },
      {
        title: "Exercise Tips",
        description: "Simple daily fitness routines for everyone",
        badge: "FITNESS",
        imageColor: "#3b82f6",
        price: "Get Started",
        blogId: "mental-wellness-daily-practices"
      },
      {
        title: "Sleep Health",
        description: "Natural ways to improve sleep quality",
        badge: "SLEEP",
        imageColor: "#1f2937",
        price: "Learn More",
        blogId: "prevention-early-detection"
      }
    ]
  ];
  
  // Navigation state
  const [currentBlogSet, setCurrentBlogSet] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Navigation functions
  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    // Wait for cards to fade out (400ms + 160ms for last card delay)
    setTimeout(() => {
      setCurrentBlogSet(prev => prev === 0 ? blogSets.length - 1 : prev - 1);
      // Wait for new cards to fade in (400ms + 160ms for last card delay)
      setTimeout(() => {
        setIsAnimating(false);
      }, 560);
    }, 560);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    // Wait for cards to fade out (400ms + 160ms for last card delay)
    setTimeout(() => {
      setCurrentBlogSet(prev => (prev + 1) % blogSets.length);
      // Wait for new cards to fade in (400ms + 160ms for last card delay)
      setTimeout(() => {
        setIsAnimating(false);
      }, 560);
    }, 560);
  };
  
  return (
    <footer 
      id={id} 
      className={`w-full transition-all duration-700 ease-in-out ${
        isDark ? 'bg-gray-900' : 'bg-white'
      } ${
        // Only apply sidebar padding if not on the blog page
        window.location.pathname.includes('/blog') 
          ? '' 
          : isSidebarCollapsed 
            ? 'lg:pl-24' 
            : 'lg:pl-64'
      }`}
      style={{
        transition: 'padding 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.3s ease'
      }}
    >
      <div className="mx-auto px-4 pt-16 pb-8 w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">D1</span>
              </div>
              <span className="text-2xl font-bold">Day1Health</span>
            </div>
            <p className={`text-xl mb-6 max-w-md ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Affordable health cover for every South African.
            </p>
            <p className={`leading-relaxed mb-6 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Real medical insurance that covers doctor visits, medications, hospital stays, and emergencies. 
              Underwritten by African Unity Life, we provide trusted healthcare coverage across South Africa.
            </p>
            
            {/* Blog Cards */}
            <div className="flex gap-6 justify-start min-h-[240px]">
              {blogSets[currentBlogSet].map((blog, index) => (
                <div
                  key={`${currentBlogSet}-${index}`}
                  className={`blog-card-container transition-all duration-400 ease-in-out ${
                    isAnimating 
                      ? 'blog-card-exit' 
                      : 'blog-card-enter'
                  }`}
                  style={{
                    transitionDelay: `${index * 80}ms`
                  }}
                >
                  <BlogCard 
                    title={blog.title}
                    description={blog.description}
                    badge={blog.badge}
                    imageColor={blog.imageColor}
                    price={blog.price}
                    onClick={() => navigate(`/blog/${blog.blogId}`)}
                  />
                </div>
              ))}
            </div>


            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-6 mt-6">
              {/* Previous Button */}
              <button
                className={`text-center w-32 rounded-xl h-10 relative text-sm font-semibold group ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}
                type="button"
                onClick={goToPrevious}
              >
                <div className="bg-green-400 rounded-lg h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[120px] z-10 duration-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                    height="16px"
                    width="16px"
                  >
                    <path
                      d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                      fill="#000000"
                    />
                    <path
                      d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                      fill="#000000"
                    />
                  </svg>
                </div>
                <p className="translate-x-1">Previous</p>
              </button>
              
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}>
                <span>{currentBlogSet + 1} of {blogSets.length}</span>
              </div>
              
              {/* Next Button */}
              <button
                className={`text-center w-32 rounded-xl h-10 relative text-sm font-semibold group ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}
                type="button"
                onClick={goToNext}
              >
                <div className="bg-green-400 rounded-lg h-8 w-1/4 flex items-center justify-center absolute right-1 top-[4px] group-hover:w-[120px] z-10 duration-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                    height="16px"
                    width="16px"
                  >
                    <path
                      d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                      fill="#000000"
                    />
                    <path
                      d="m786.752 512-265.408-265.344a32 32 0 0 1 45.312-45.312l288 288a32 32 0 0 1 0 45.312l-288 288a32 32 0 1 1-45.312-45.312L786.752 512z"
                      fill="#000000"
                    />
                  </svg>
                </div>
                <p className="-translate-x-1">Next</p>
              </button>
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#plans" className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Our Plans
                </a>
              </li>
              <li>
                <a href="#how-it-works" className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#why-choose" className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#faqs" className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  FAQs
                </a>
              </li>
              <li>
                <a href="#contact" className={`transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>0876 100 600</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>info@day1health.co.za</span>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Underwritten by</div>
                  <div className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>African Unity Life</div>
                </div>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Emergency Helpline</h4>
              <p className="text-green-400 font-bold">24/7 Available</p>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Always here when you need us</p>
            </div>

            {/* Dark Theme Toggle */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-sm">Theme</h4>
              <div className="flex items-center justify-center">
                <BB8Toggle />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">Toggle between light and dark themes</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t mt-12 pt-8 ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className={`transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Terms of Service
              </a>
              <a href="#" className={`transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Privacy Policy
              </a>
              <a href="#" className={`transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Cookie Policy
              </a>
              <a href="#" className={`transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Complaints
              </a>
            </div>
            
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2025 Day1Health. All rights reserved.
            </div>
          </div>

          <div className={`mt-4 p-3 rounded-lg text-center ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Day1Health is an authorized Financial Services Provider (FSP). 
              Medical insurance products are underwritten by African Unity Life Limited, 
              a licensed life insurer and authorized FSP.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;