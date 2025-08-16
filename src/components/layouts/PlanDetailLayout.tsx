import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Check } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';
import { useTheme } from '../../contexts/ThemeContext';

export type PlanDetailLayoutProps = {
  pageTitle: string;
  subtitle?: string;
  breadcrumbLabel?: string; // defaults to pageTitle
  coverItems?: string[]; // optional chips under title
  left: ReactNode; // main content left column (tabs/content)
  right?: ReactNode; // optional sidebar content
  onNavigate?: (section: string) => void; // header navigation handler
};

const PlanDetailLayout: React.FC<PlanDetailLayoutProps> = ({
  pageTitle,
  subtitle,
  breadcrumbLabel,
  coverItems,
  left,
  right,
  onNavigate,
}) => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // default navigation mirrors existing pages
  const handleNavigate = (section: string) => {
    const targetSection = section === 'home' ? 'hero' : section;
    sessionStorage.setItem('navigatingToSection', targetSection);
    window.location.href = `/#${targetSection}`;
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-all duration-700 ease-in-out ${isDark ? 'bg-gray-900' : 'bg-gray-50'} ${
        isSidebarCollapsed ? 'lg:ml-24 lg:w-[calc(100%-6rem)]' : 'lg:ml-64 lg:w-[calc(100%-16rem)]'
      }`}
      style={{
        transition:
          'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <div className="flex min-h-screen w-full">
        <Header
          activeSection="plans"
          onNavigate={onNavigate ?? handleNavigate}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isFooterInView={false}
        />

        <div className="flex-1 w-0">
          <main className="w-full py-8 md:py-12">
            {/* Spacer animation container to match existing pages */}
            <motion.div
              className={`max-w-[74rem] mx-auto px-4 md:px-6`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            {/* Hero / Title */}
            <section className={`${isDark ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900' : 'bg-gradient-to-b from-white via-gray-50 to-gray-50'} border-y ${isDark ? 'border-gray-800' : 'border-gray-200'} py-6 md:py-8 mb-6`}>
              <motion.div
                className={`max-w-[74rem] mx-auto px-4 md:px-6`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-3 md:mb-4">
                  <ol className="flex items-center gap-1 text-[13px]">
                    <li>
                      <Link
                        to="/"
                        onClick={(e) => {
                          e.preventDefault();
                          (onNavigate ?? handleNavigate)('plans');
                        }}
                        className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm px-0.5`}
                      >
                        Home
                      </Link>
                    </li>
                    <li aria-hidden="true" className={`${isDark ? 'text-gray-500' : 'text-gray-400'} px-1`}>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </li>
                    <li>
                      <span className={`${isDark ? 'text-white/90' : 'text-gray-900'} font-medium`}>
                        {breadcrumbLabel || pageTitle}
                      </span>
                    </li>
                  </ol>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-emerald-400/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className={`text-2xl md:text-3xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{pageTitle}</h1>
                      {subtitle && (
                        <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cover highlights (optional) */}
                {coverItems && coverItems.length > 0 && (
                  <motion.div
                    className={`mt-4 rounded-xl border p-4 ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/70 backdrop-blur-md border-gray-200'}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Cover:</div>
                      {coverItems.map((c, i) => (
                        <motion.span
                          key={c}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.05 * i }}
                          whileHover={{ scale: 1.03 }}
                        >
                          <Check className="w-3.5 h-3.5" /> {c}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </section>

            {/* Main content grid */}
            <div className={`max-w-[74rem] mx-auto px-4 md:px-6`}>
              <div className="grid grid-cols-12 gap-6">
                <motion.div
                  className="col-span-12 lg:col-span-8"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  {left}
                </motion.div>

                {right && (
                  <aside className="col-span-12 lg:col-span-4">
                    <div className="lg:sticky lg:top-24">
                      {right}
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PlanDetailLayout;
