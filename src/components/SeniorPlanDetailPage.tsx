import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { RollingNumber } from './ui/rolling-number';

const SeniorPlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const variantParam = (searchParams.get('variant') || 'single').toLowerCase();
  const categoryParam = searchParams.get('category');
  const [option, setOption] = useState('');
  const [quantity, setQuantity] = useState(1);
  // Senior has 3 categories passed in from ToolsTabs: Day-to-Day, Comprehensive, Hospital
  const displayCategory = (categoryParam && categoryParam.trim()) || 'Day-to-Day';
  const pageTitle = `Senior - ${displayCategory}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Initialize selected option from variant
  useEffect(() => {
    const initial = (variantParam === 'couple' || variantParam === 'couples') ? 'couple' : 'single';
    setOption(initial);
  }, [variantParam]);

  // Initialize quantity (single/couple only)
  useEffect(() => {
    const raw = searchParams.get('qty');
    const parsed = raw ? parseInt(raw, 10) : NaN;
    const clamped = Math.max(1, isNaN(parsed) ? 1 : parsed);
    setQuantity(clamped);
  }, [option, searchParams]);

  // Pricing based on Senior category
  const pricing = {
    'day-to-day': { single: 425, couple: 850 },
    'comprehensive': { single: 875, couple: 1750 },
    'hospital': { single: 640, couple: 1280 },
  } as const;
  const categoryKey = displayCategory.toLowerCase() as 'day-to-day' | 'comprehensive' | 'hospital';
  const SINGLE_PRICE = pricing[categoryKey]?.single ?? 425;
  const COUPLE_PRICE = pricing[categoryKey]?.couple ?? 850;
  const currentPrice = (() => {
    if (option === 'couple') return COUPLE_PRICE * quantity;
    return SINGLE_PRICE * quantity;
  })();

  // Update URL path and query
  const updateUrl = (nextVariant: string, _nextChildren?: number, nextQty?: number) => {
    const sub = displayCategory.toLowerCase();
    const path = `/senior/${sub}/${nextVariant}`;
    navigate(path, { replace: false });
    const params = new URLSearchParams(searchParams);
    params.set('variant', nextVariant);
    params.delete('children');
    params.set('qty', String(Math.max(1, nextQty ?? quantity)));
    setSearchParams(params);
  };

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
          onNavigate={() => {}}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isFooterInView={false}
        />

        <div className="flex-1 w-0">
          <main className="w-full py-8 md:py-12">
            <motion.div
              className={`max-w-[74rem] mx-auto px-4 md:px-6`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            <section
              className={`${
                isDark ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900' : 'bg-gradient-to-b from-white via-gray-50 to-gray-50'
              } border-y ${isDark ? 'border-gray-800' : 'border-gray-200'} py-6 md:py-8 mb-6`}
            >
              <motion.div
                className={`max-w-[74rem] mx-auto px-4 md:px-6`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <nav aria-label="Breadcrumb" className="mb-3 md:mb-4">
                  <ol className="flex items-center gap-1 text-[13px]">
                    <li>
                      <Link
                        to="/"
                        className={`${
                          isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        } underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm px-0.5`}
                      >
                        Home
                      </Link>
                    </li>
                    <li aria-hidden="true" className={`${isDark ? 'text-gray-500' : 'text-gray-400'} px-1`}>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </li>
                    <li>
                      <span className={`${isDark ? 'text-white/90' : 'text-gray-900'} font-medium`}>{pageTitle}</span>
                    </li>
                  </ol>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isDark ? 'bg-emerald-400/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h1
                        className={`text-2xl md:text-3xl font-bold leading-tight ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {pageTitle}
                      </h1>
                      <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Tailored benefits designed for seniors
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            <div className={`max-w-[74rem] mx-auto px-4 md:px-6`}>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                  <motion.div
                    className={`rounded-xl border p-6 ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Benefits</h2>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Detailed benefits coming soon.</p>
                  </motion.div>
                </div>
                <aside className="col-span-12 lg:col-span-4">
                  <div className="lg:sticky lg:top-24">
                    <motion.div
                      className={`rounded-xl border p-5 ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Plan</div>
                          <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Senior</div>
                        </div>
                        <RollingNumber
                          value={currentPrice}
                          prefix="R"
                          className={`text-lg font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}
                          digitClassName={`${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4">
                        <div>
                          <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Options</label>
                          <select
                            value={option}
                            onChange={(e) => {
                              const v = e.target.value;
                              setOption(v);
                              updateUrl(v, undefined, quantity);
                            }}
                            className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          >
                            <option value="">Choose an option</option>
                            <option value="single">Single</option>
                            <option value="couple">Couples</option>
                          </select>
                        </div>

                        {option !== 'family' ? (
                          <div>
                            <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Quantity</label>
                            <input
                              type="number"
                              min={1}
                              value={quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value || '1', 10);
                                const q = Math.max(1, isNaN(val) ? 1 : val);
                                setQuantity(q);
                                updateUrl(option || 'single', undefined, q);
                              }}
                              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  </div>
                </aside>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SeniorPlanDetailPage;
