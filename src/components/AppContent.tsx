import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Hero from './Hero';
import ToolsTabs from './ToolsTabs';
import HowItWorks from './HowItWorks';
import Feedback from './Feedback';
import WhyChoose from './WhyChoose';
import BrandCarousel from './BrandCarousel';
import FAQs from './FAQs';
import Contact from './Contact';
import Footer from './Footer';
import SocialLinks from './SocialLinks';
import FloatingWhatsApp from './FloatingWhatsApp';
import { useTheme } from '../contexts/ThemeContext';

interface AppContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isFooterInView: boolean;
  scrollToSection: (sectionId: string) => void;
}

const AppContent: React.FC<AppContentProps> = ({
  activeSection,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isFooterInView,
  scrollToSection
}) => {
  const { isDark } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      
      
      <div className="flex min-h-screen w-full">
        <Header 
          activeSection={activeSection} 
          onNavigate={scrollToSection}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isFooterInView={isFooterInView}
        />
        
        <div className="flex-1 w-0">
          <main className="w-full">
            <Hero isSidebarCollapsed={isSidebarCollapsed} />
            <ToolsTabs isSidebarCollapsed={isSidebarCollapsed} />
            <HowItWorks isSidebarCollapsed={isSidebarCollapsed} />
            <Feedback isSidebarCollapsed={isSidebarCollapsed} />
            <WhyChoose isSidebarCollapsed={isSidebarCollapsed} />
            <BrandCarousel isSidebarCollapsed={isSidebarCollapsed} />
            <Contact isSidebarCollapsed={isSidebarCollapsed} />
            <FAQs isSidebarCollapsed={isSidebarCollapsed} />
          </main>
          
          <div
            className={`${isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-64'}`}
            style={{
              transition: 'padding-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <Footer id="footer" />
          </div>
          {!isFooterInView && (
            <SocialLinks isSidebarCollapsed={isSidebarCollapsed} activeSection={activeSection} />
          )}
          <FloatingWhatsApp />
        </div>
        
        {/* Animated Scrollbar Indicator */}
        <motion.div
          className="fixed right-2 top-0 bottom-0 w-1 z-50"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 1,
            duration: 0.8,
            delay: 0.3
          }}
        >
          <div className={`w-full h-full rounded-full ${
            isDark ? 'bg-gray-800/50' : 'bg-gray-200/50'
          }`}>
            <motion.div
              className="w-full bg-gradient-to-b from-green-400 to-green-600 rounded-full origin-top"
              style={{ height: `${scrollProgress}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppContent;
