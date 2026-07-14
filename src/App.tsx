import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import AppContent from './components/AppContent';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load route components for code splitting
const PlanDetailPage = lazy(() => import('./components/PlanDetailPage'));
const HospitalPlanDetailPage = lazy(() => import('./components/HospitalPlanDetailPage'));
const ComprehensivePlanDetailPage = lazy(() => import('./components/ComprehensivePlanDetailPage'));
const SeniorPlanDetailPage = lazy(() => import('./components/SeniorPlanDetailPage'));
const RegulatoryInformationPage = lazy(() => import('./components/RegulatoryInformationPage'));
const ProceduresPage = lazy(() => import('./components/ProceduresPage'));
const ProtectedAdminPage = lazy(() => import('./admin/ProtectedAdminPage'));
const AdminPage = lazy(() => import('./admin/AdminPage'));
const AdminCmsPlaceholderPage = lazy(() => import('./admin/AdminCmsPlaceholderPage'));
const DirectoryPage = lazy(() => import('./directory/DirectoryPage'));
const ProviderDetailPage = lazy(() => import('./directory/ProviderDetailPage'));
const Day1HealthAiChatbotPage = lazy(() => import('./components/Day1HealthAiChatbotPage'));

// Smooth scroll enhancement hook
const useSmoothScrollEnhancement = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }
  }, []);
};

function AppWrapper() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);

  useSmoothScrollEnhancement();

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'footer') {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
      return;
    }

    if (sectionId === 'hero') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const offset = 60;
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        if (hash === 'footer') {
          setTimeout(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
          }, 100);
          return;
        }

        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            const offset = 60;
            window.scrollTo({ top: elementTop - offset, behavior: 'smooth' });
          }, 100);
        }
      }
    };

    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);

    return () => {
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'plans', 'how-it-works', 'feedback', 'why-choose', 'faqs', 'contact'];
      const scrollPosition = window.scrollY + 100;

      const footer = document.getElementById('footer');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        setIsFooterInView(footerTop < windowHeight * 0.8);
      }

      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        if (heroRect.top <= 150 && heroRect.bottom >= window.innerHeight / 2) {
          setActiveSection('hero');
          return;
        }
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] === 'hero') continue;

        const heading = document.getElementById(sections[i]);
        if (heading) {
          const section = heading.closest('section');
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;

            if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionBottom - 200) {
              setActiveSection(sections[i]);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
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
        <Route
          path="/plans/day-to-day"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <PlanDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/plans/hospital"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <HospitalPlanDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/plans/comprehensive"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <ComprehensivePlanDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/plans/senior-plan"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <SeniorPlanDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/regulatory-information"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <RegulatoryInformationPage />
            </Suspense>
          }
        />
        <Route
          path="/procedures"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <ProceduresPage />
            </Suspense>
          }
        />
        <Route
          path="/day1health-ai-chatbot"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Day1HealthAiChatbotPage />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <ProtectedAdminPage />
            </Suspense>
          }
        >
          <Route
            path="providers"
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <AdminPage />
              </Suspense>
            }
          />
          <Route
            path="cms"
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <AdminCmsPlaceholderPage />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/directory"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <DirectoryPage />
            </Suspense>
          }
        />
        <Route
          path="/directory/:slug"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <DirectoryPage />
            </Suspense>
          }
        />
        <Route
          path="/provider/:id"
          element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <ProviderDetailPage />
            </Suspense>
          }
        />
        <Route path="*" element={<AppWrapper />} />
      </Routes>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
