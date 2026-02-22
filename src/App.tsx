import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppContent from './components/AppContent';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load route components for code splitting
const PlanDetailPage = lazy(() => import('./components/PlanDetailPage'));
const HospitalPlanDetailPage = lazy(() => import('./components/HospitalPlanDetailPage'));
const ComprehensivePlanDetailPage = lazy(() => import('./components/ComprehensivePlanDetailPage'));
const SeniorPlanDetailPage = lazy(() => import('./components/SeniorPlanDetailPage'));
const RegulatoryInformationPage = lazy(() => import('./components/RegulatoryInformationPage'));
const JuniorExecutivePlanDetailPage = lazy(() => import('./components/JuniorExecutivePlanDetailPage'));
const ProceduresPage = lazy(() => import('./components/ProceduresPage'));
const ProtectedAdminPage = lazy(() => import('./admin/ProtectedAdminPage'));
const DirectoryPage = lazy(() => import('./directory/DirectoryPage'));
const ProviderDetailPage = lazy(() => import('./directory/ProviderDetailPage'));

// Smooth scroll enhancement hook
const useSmoothScrollEnhancement = () => {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return; // Don't enhance scrolling for users who prefer reduced motion
    }

    // Enhanced smooth scrolling for mouse wheel (optional enhancement)
    // This is disabled by default as native smooth scrolling is usually sufficient
    // Uncomment if you want custom wheel smoothing:
    /*
    let isScrolling = false;
    
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      
      e.preventDefault();
      isScrolling = true;
      
      const scrollAmount = e.deltaY * 0.8; // Adjust multiplier for sensitivity
      
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        isScrolling = false;
      }, 50);
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
    */
  }, []);
};

function AppWrapper() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);
  
  // Enable smooth scrolling enhancements
  useSmoothScrollEnhancement();



  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    // Special case for footer: scroll all the way down
    if (sectionId === 'footer') {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
      return;
    }
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

  // Handle hash navigation
  useEffect(() => {
    const handleNavigation = () => {
      // Check URL hash
      const hash = window.location.hash.substring(1);
      if (hash) {
        if (hash === 'footer') {
          setTimeout(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
          }, 100);
          return;
        } else {
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
    />
  );
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<AppWrapper />} />
        <Route path="/plans/day-to-day" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <PlanDetailPage />
          </Suspense>
        } />
        <Route path="/plans/hospital" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <HospitalPlanDetailPage />
          </Suspense>
        } />
        <Route path="/plans/comprehensive" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ComprehensivePlanDetailPage />
          </Suspense>
        } />
        <Route path="/plans/senior-plan" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <SeniorPlanDetailPage />
          </Suspense>
        } />
        <Route path="/plans/junior-executive" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <JuniorExecutivePlanDetailPage />
          </Suspense>
        } />
        <Route path="/regulatory-information" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <RegulatoryInformationPage />
          </Suspense>
        } />
        <Route path="/procedures" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ProceduresPage />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ProtectedAdminPage />
          </Suspense>
        } />
        <Route path="/directory" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <DirectoryPage />
          </Suspense>
        } />
        <Route path="/directory/:slug" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <DirectoryPage />
          </Suspense>
        } />
        <Route path="/provider/:id" element={
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ProviderDetailPage />
          </Suspense>
        } />
        {/* Catch-all: render the SPA for any other route */}
        <Route path="*" element={<AppWrapper />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;