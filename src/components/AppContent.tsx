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
            <Contact isSidebarCollapsed={isSidebarCollapsed} />
            <FAQs isSidebarCollapsed={isSidebarCollapsed} />
          </main>
          
          <Footer id="footer" isSidebarCollapsed={isSidebarCollapsed} />
          <SocialLinks isSidebarCollapsed={isSidebarCollapsed} activeSection={activeSection} />
        </div>
      </div>
    </div>
  );
};

export default AppContent;
