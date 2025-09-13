import React from 'react';
import Header from './Header';
import Hero from './Hero';
import ToolsTabs from './ToolsTabs';
import HowItWorks from './HowItWorks';
import Feedback from './Feedback';
import WhyChoose from './WhyChoose';
import FAQs from './FAQs';
import Contact from './Contact';
import Footer from './Footer';
import SocialLinks from './SocialLinks';
import FloatingWhatsApp from './FloatingWhatsApp';

interface AppContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isFooterInView: boolean;
  scrollToSection: (sectionId: string) => void;
  specificSlide?: number | null;
}

const AppContent: React.FC<AppContentProps> = ({
  activeSection,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isFooterInView,
  scrollToSection,
  specificSlide
}) => {

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
            <Hero isSidebarCollapsed={isSidebarCollapsed} specificSlide={specificSlide} />
            <ToolsTabs isSidebarCollapsed={isSidebarCollapsed} />
            <HowItWorks isSidebarCollapsed={isSidebarCollapsed} />
            <Feedback isSidebarCollapsed={isSidebarCollapsed} />
            <WhyChoose isSidebarCollapsed={isSidebarCollapsed} />
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
      </div>
    </div>
  );
};

export default AppContent;
