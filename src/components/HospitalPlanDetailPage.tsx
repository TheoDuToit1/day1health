import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { RollingNumber } from './ui/rolling-number';

const HospitalPlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const variantParam = (searchParams.get('variant') || 'single').toLowerCase();
  const categoryParam = searchParams.get('category');
  const [option, setOption] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [childCount, setChildCount] = useState(1);
  // Map variant to main categories
  const categoryFromVariant =
    variantParam === 'family' ? 'Executive' :
    (variantParam === 'couple' || variantParam === 'couples') ? 'Platinum' :
    'Value';
  const displayCategory = (categoryParam && categoryParam.trim()) || categoryFromVariant;
  const pageTitle = `Hospital - ${displayCategory}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle sidebar navigation back to main site sections
  const handleNavigate = (section: string) => {
    const targetSection = section === 'home' ? 'hero' : section;
    sessionStorage.setItem('navigatingToSection', targetSection);
    window.location.href = `/#${targetSection}`;
    window.scrollTo(0, 0);
  };

  // Initialize selected option from variant
  useEffect(() => {
    const initial = (variantParam === 'couple' || variantParam === 'couples')
      ? 'couple'
      : (variantParam === 'family' ? 'family' : 'single');
    setOption(initial);
  }, [variantParam]);

  // Initialize child count if family
  useEffect(() => {
    if (option === 'family') {
      const raw = searchParams.get('children');
      const parsed = raw ? parseInt(raw, 10) : NaN;
      const clamped = Math.max(1, Math.min(4, isNaN(parsed) ? 1 : parsed));
      setChildCount(clamped);
    }
  }, [option, searchParams]);

  // Initialize quantity for non-family
  useEffect(() => {
    if (option !== 'family') {
      const raw = searchParams.get('qty');
      const parsed = raw ? parseInt(raw, 10) : NaN;
      const clamped = Math.max(1, isNaN(parsed) ? 1 : parsed);
      setQuantity(clamped);
    }
  }, [option, searchParams]);

  // Pricing constants (placeholder values; replace with category-specific values if needed)
  const SINGLE_PRICE = 385;
  const COUPLE_PRICE = 674;
  const FAMILY_CHILD_PRICE = 193;
  const currentPrice = (() => {
    if (option === 'family') return FAMILY_CHILD_PRICE * childCount;
    if (option === 'couple') return COUPLE_PRICE * quantity;
    return SINGLE_PRICE * quantity;
  })();

  // Update URL path and query
  const updateUrl = (nextVariant: string, nextChildren?: number, nextQty?: number) => {
    const sub = displayCategory.toLowerCase();
    const path = `/hospital/${sub}/${nextVariant}`;
    navigate(path, { replace: false });
    const params = new URLSearchParams(searchParams);
    params.set('variant', nextVariant);
    if (nextVariant === 'family') {
      params.set('children', String(Math.max(1, Math.min(4, nextChildren ?? childCount))));
      params.delete('qty');
    } else {
      params.delete('children');
      params.set('qty', String(Math.max(1, nextQty ?? quantity)));
    }
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
          onNavigate={handleNavigate}
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
                        Private hospital cover with smart benefits
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            <div className={`max-w-[74rem] mx-auto px-4 md:px-6`}>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                  {/* Placeholder for plan content/benefits */}
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
                          <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Hospital</div>
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
                              updateUrl(v, v === 'family' ? childCount : undefined, v !== 'family' ? quantity : undefined);
                            }}
                            className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          >
                            <option value="">Choose an option</option>
                            <option value="single">Single</option>
                            <option value="couple">Couples</option>
                            <option value="family">Family</option>
                          </select>
                        </div>

                        {option === 'family' ? (
                          <div>
                            <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Number of children</label>
                            <input
                              type="number"
                              min={1}
                              max={4}
                              value={childCount}
                              onChange={(e) => {
                                const val = parseInt(e.target.value || '1', 10);
                                const clamped = Math.max(1, Math.min(4, isNaN(val) ? 1 : val));
                                setChildCount(clamped);
                                updateUrl('family', clamped);
                              }}
                              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                            <div className={`mt-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Max 4 children</div>
                          </div>
                        ) : (
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
                        )}
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

export default HospitalPlanDetailPage;
