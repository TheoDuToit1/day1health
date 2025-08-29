import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AppContent from './components/AppContent';
import BlogPage from './components/BlogPage';
import BlogDetailPage from './components/BlogDetailPage';
import VoiceAssistantsPage from './components/VoiceAssistantsPage';
import PlanDetailPage from './components/PlanDetailPage';
import HospitalPlanDetailPage from './components/HospitalPlanDetailPage';
import ComprehensivePlanDetailPage from './components/ComprehensivePlanDetailPage';
import SeniorPlanDetailPage from './components/SeniorPlanDetailPage';
import RegulatoryInformationPage from './components/RegulatoryInformationPage';
import JuniorExecutivePlanDetailPage from './components/JuniorExecutivePlanDetailPage';
import ProceduresPage from './components/ProceduresPage';
import { ThemeProvider } from './contexts/ThemeContext';

function AppWrapper() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);
  const location = useLocation();

  // Get slide number from route
  const getSlideFromRoute = () => {
    const path = location.pathname;
    // Handle explicit slide paths
    if (path === '/slide-1') return 0;
    if (path === '/slide-2') return 1;
    if (path === '/slide-3') return 2;
    if (path === '/slide-4') return 3;
    // Handle dynamic /slide-:num pattern
    const match = path.match(/^\/slide-(\d+)$/);
    if (match) {
      const n = parseInt(match[1], 10);
      // Map slide-1..4 to indexes 0..3
      if (n >= 1 && n <= 4) return n - 1;
    }
    return null; // Main route
  };

  const specificSlide = getSlideFromRoute();

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
      // For heading elements, scroll with some offset to position them better
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const offset = 60; // Adjust this value to move screen up/down
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
  };

  // Handle hash navigation when coming from blog
  useEffect(() => {
    const handleNavigation = () => {
      // First check URL hash
      const hash = window.location.hash.substring(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            const offset = 60; // keep header clearance
            window.scrollTo({ top: elementTop - offset, behavior: 'smooth' });
          }, 100);
          return;
        }
      }

      // Then check session storage for navigation from blog
      const storedSection = sessionStorage.getItem('navigatingToSection');
      if (storedSection) {
        // Clear the stored section
        sessionStorage.removeItem('navigatingToSection');
        // Scroll to the section after a short delay to ensure the page is loaded
        setTimeout(() => {
          const element = document.getElementById(storedSection);
          if (element) {
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            const offset = 60; // keep header clearance
            window.scrollTo({ top: elementTop - offset, behavior: 'smooth' });
          }
        }, 300);
      }
    };

    // Initial check
    handleNavigation();

    // Also handle hash changes
    window.addEventListener('hashchange', handleNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  // Track active section and footer visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'plans', 'how-it-works', 'feedback', 'why-choose', 'faqs', 'contact'];
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

      // Update active section for other sections (now using heading elements)
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] === 'hero') continue; // Skip hero as we handle it above
        
        const heading = document.getElementById(sections[i]);
        if (heading) {
          // Get the parent section element to calculate section boundaries
          const section = heading.closest('section');
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
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppContent
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      isSidebarCollapsed={isSidebarCollapsed}
      setIsSidebarCollapsed={setIsSidebarCollapsed}
      isFooterInView={isFooterInView}
      scrollToSection={scrollToSection}
      specificSlide={specificSlide}
    />
  );
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<AppWrapper />} />
        <Route path="/slide-1" element={<AppWrapper />} />
        <Route path="/slide-2" element={<AppWrapper />} />
        <Route path="/slide-3" element={<AppWrapper />} />
        <Route path="/slide-4" element={<AppWrapper />} />
        {/* Dynamic slide route to catch /slide-:num */}
        <Route path="/slide-:num" element={<AppWrapper />} />
        <Route path="/voice-assistants" element={<VoiceAssistantsPage />} />
        <Route path="/whoisyomama" element={<BlogPage />} />
        <Route path="/whoisyomama/:id" element={<BlogDetailPage />} />
        <Route path="/plans/day-to-day" element={<PlanDetailPage />} />
        <Route path="/plans/hospital" element={<HospitalPlanDetailPage />} />
        <Route path="/plans/comprehensive" element={<ComprehensivePlanDetailPage />} />
        <Route path="/plans/senior-plan" element={<SeniorPlanDetailPage />} />
        <Route path="/plans/junior-executive" element={<JuniorExecutivePlanDetailPage />} />
        <Route path="/regulatory-information" element={<RegulatoryInformationPage />} />
        <Route path="/procedures" element={<ProceduresPage />} />
        {/* Catch-all: render the SPA for any other route */}
        <Route path="*" element={<AppWrapper />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;