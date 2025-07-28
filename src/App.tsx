import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ToolsTabs from './components/ToolsTabs';
import HowItWorks from './components/HowItWorks';
import Feedback from './components/Feedback';
import WhyChoose from './components/WhyChoose';
import FAQs from './components/FAQs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SocialLinks from './components/SocialLinks';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    // Special case for home/hero section
    if (sectionId === 'hero') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Track active section and footer visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'how-it-works', 'feedback', 'why-choose', 'faqs', 'contact'];
      const scrollPosition = window.scrollY + 100; // Reduced offset for better accuracy
      
      // Check if footer is in view
      const footer = document.getElementById('footer');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        setIsFooterInView(footerTop < windowHeight * 0.8);
      }

      // Special case for hero section
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        if (heroRect.top <= 150 && heroRect.bottom >= window.innerHeight / 2) {
          setActiveSection('hero');
          return;
        }
      }

      // Update active section for other sections
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] === 'hero') continue; // Skip hero as we handle it above
        
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionBottom = sectionTop + sectionHeight;
          
          // If scroll position is within this section's boundaries
          if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionBottom - 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="flex min-h-screen w-full">
        {/* Simple Sticky Text */}
        <div className="fixed top-7 left-24 lg:left-48 xl:left-64 z-50">
          <span className="text-2xl font-bold text-[#16a34a] bg-white/80 px-2 py-1 rounded">Day1Health</span>
        </div>
        
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
}

export default App;