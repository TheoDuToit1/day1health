import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import { useTheme } from '../contexts/ThemeContext';
import {
  chatbotLabRegistry,
  chatbotLabTriggerOrder,
  type ChatbotLabComponentName,
} from './chatbot-lab/ChatbotLabPanels';

function Day1HealthAiChatbotPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeSection] = useState('hero');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ChatbotLabComponentName>('PlanSummaryCard');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      navigate('/');
      return;
    }

    navigate(`/#${sectionId}`);
  };

  useEffect(() => {
    const onScroll = () => {
      const footer = document.getElementById('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setIsFooterInView(rect.top < window.innerHeight * 0.8);
      }
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isPanelOpen]);

  const openComponent = (componentName: ChatbotLabComponentName) => {
    setSelectedComponent(componentName);
    setIsPanelOpen(true);
  };

  const closePanel = () => setIsPanelOpen(false);
  const ActiveComponent = chatbotLabRegistry[selectedComponent].component;

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
          <div
            className={`${isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-64'}`}
            style={{ transition: 'padding-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          >
            <section className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
              <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-16">
                <header className="mb-10">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/');
                      window.scrollTo(0, 0);
                    }}
                    className={`inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-sm transition-colors ${
                      isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back
                  </button>

                  <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                        }`}
                      >
                        <Sparkles className="h-4 w-4" />
                        Manual prototype
                      </span>
                      <h1 className={`mt-4 text-3xl font-bold sm:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Day1Health AI Chatbot UI Lab
                      </h1>
                      <p className={`mt-3 max-w-2xl text-base leading-7 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Manual trigger page for testing chatbot visual responses before AI integration.
                      </p>
                    </div>

                    <div
                      className={`rounded-3xl border px-5 py-4 lg:max-w-sm ${
                        isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Active response
                      </p>
                      <p className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {chatbotLabRegistry[selectedComponent].label.replace('Show ', '')}
                      </p>
                      <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isPanelOpen ? 'Panel open' : 'Ready to preview'}
                      </p>
                    </div>
                  </div>
                </header>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className={`rounded-[2rem] border p-5 sm:p-6 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                    <div className="mb-5">
                      <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Manual triggers</h2>
                      <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Each trigger opens the same panel shell the future chatbot can use, with the selected reusable component inside it.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                      {chatbotLabTriggerOrder.map((componentName) => {
                        const item = chatbotLabRegistry[componentName];
                        const Icon = item.icon;
                        const isSelected = selectedComponent === componentName;

                        return (
                          <button
                            key={componentName}
                            type="button"
                            onClick={() => openComponent(componentName)}
                            className={`rounded-3xl border p-4 text-left transition-all ${
                              isSelected
                                ? 'border-green-500 bg-green-600 text-white shadow-lg shadow-green-600/20'
                                : isDark
                                  ? 'border-gray-800 bg-gray-950 hover:border-gray-700 hover:bg-gray-900'
                                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                                  isSelected
                                    ? 'bg-white/15 text-white'
                                    : isDark
                                      ? 'bg-gray-900 text-green-400'
                                      : 'bg-white text-green-600'
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className={`text-base font-semibold ${isSelected ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {item.label}
                                </p>
                                <p className={`mt-2 text-sm leading-6 ${isSelected ? 'text-green-50' : isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {item.blurb}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`rounded-[2rem] border p-5 sm:p-6 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Panel behaviour</h2>
                    <div className="mt-5 space-y-4">
                      {[
                        'Desktop opens a right-side drawer.',
                        'Mobile opens a bottom sheet with a full-width layout.',
                        'Nested actions can switch components without closing the panel.',
                        'No AI, Supabase, member data, claims, or authorisations are connected.',
                      ].map((line) => (
                        <div
                          key={line}
                          className={`flex items-start gap-3 rounded-2xl border px-4 py-4 ${
                            isDark ? 'border-gray-800 bg-gray-950/70' : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-600" />
                          <p className={`text-sm leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{line}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => openComponent(selectedComponent)}
                      className="mt-6 inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      Open current preview
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <Footer id="footer" />
          </div>

          <FloatingWhatsApp />
        </div>
      </div>

      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            className={`fixed inset-0 z-[70] ${isSidebarCollapsed ? 'lg:left-24' : 'lg:left-64'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close panel"
              className="absolute inset-0 bg-gray-950/45 backdrop-blur-[2px]"
              onClick={closePanel}
            />

            <div className="absolute inset-x-0 bottom-0 top-auto lg:inset-y-0 lg:right-0 lg:left-auto lg:flex lg:w-[32rem] lg:max-w-[calc(100vw-16rem)]">
              <motion.aside
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className={`max-h-[88vh] w-full overflow-hidden rounded-t-[2rem] border border-b-0 p-4 shadow-2xl lg:max-h-none lg:rounded-none lg:rounded-l-[2rem] lg:border-b lg:p-5 ${
                  isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'
                }`}
              >
                <div className={`flex items-start justify-between gap-4 border-b pb-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Chatbot component
                    </p>
                    <h2 className={`mt-2 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {chatbotLabRegistry[selectedComponent].label.replace('Show ', '')}
                    </h2>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Manual trigger preview for the future AI response layer.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closePanel}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-colors ${
                      isDark
                        ? 'border-gray-800 bg-gray-900 text-gray-200 hover:bg-gray-800'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 max-h-[calc(88vh-7rem)] overflow-y-auto pr-1 lg:max-h-[calc(100vh-6.5rem)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedComponent}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      <ActiveComponent
                        isDark={isDark}
                        onShowComponent={openComponent}
                        onNavigateToPlanPage={() => navigate('/plans/day-to-day')}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Day1HealthAiChatbotPage;
