import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { RollingNumber } from './ui/rolling-number';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { DownloadHeroButton } from './ui/download-hero-button';

const coverItems = [
  'Unlimited Managed Doctor Visits',
  'Acute/Chronic Medication',
  'Dentistry / Optometry',
  'Specialist',
  'Radiology',
  'Pathology',
  'Out-of-Area Visits',
  'Funeral Benefit',
];

const additionalInfoOptions: string[] = [
  'Single',
  'Single + 1 Child',
  'Single + 2 Children',
  'Single + 3 Children',
  'Single + 4 Children',
  'Couple',
  'Couple + 1 Child',
  'Couple + 2 Children',
  'Couple + 3 Children',
  'Couple + 4 Children',
];

const descriptionItems: { title: string; text: string }[] = [
  {
    title: 'Doctor Visits',
    text:
      'Consultations available via a registered Day1 Health Network Partner. Limited to 5 doctor visits per member per annum. Pre-authorisation is required. A 1 month waiting period applies.',
  },
  {
    title: 'Specialist Benefit',
    text:
      'Specialist Benefit of up to R 1000 per family per annum. Subject to pre-authorisation and referral from a 1Doctor Health Network Partner. A 3 month waiting period applies.',
  },
  {
    title: 'Chronic Medication',
    text:
      'Acute medication covered according to the Day1 Health formulary. Linked to the doctor consultation dispensed by the Day1 Health Network Partner or obtained on script from a Network Partner Pharmacy. A 1 month waiting period applies.',
  },
    {
    title: 'ACUTE MEDICATION',
    text:
      'Chronic medication covered according to the Day1 Health formulary. Chronic Medication is limited to R500 per member per month and up to R6000 per member per annum. A 3 month waiting period applies on chronic medication for unknown conditions and a 12 month waiting period on pre-existing conditions. All chronic medication is subject to pre-authorisation.',
  },
  {
    title: 'Radiology',
    text:
      'Basic radiology according to the 1Doctor Health formulary via a 1Doctor Health Network Partner. Black and white diagnostic x-rays only. A 1 month waiting period applies.',
  },
  {
    title: 'Pathology',
    text:
      'Basic diagnostic blood tests on referral by a 1Doctor Health Network Partner and subject to a list of basic pathology tests approved by Day1 Health. A 1 month waiting period applies.',
  },
  {
    title: 'Basic Dentistry',
    text:
      'Basic treatment includes preventative cleaning, fillings, extractions and emergency pain and sepsis control via a Day1 Health Network Partner. 2 visits per member per annum. Pre-authorisation is required for each visit. A 3 month waiting period applies.',
  },

  {
    title: 'Optometry (Iso Leso Optics)',
    text:
      'One eye test and one set of glasses every 24 months per the specific Iso Leso Optics agreed protocol range. A 12 month waiting period applies.',
  },

  {
    title: 'Out-of-Area Visits',
    text:
      'In the event that you cannot see your Network Partner, the Plan will allow 3 “out of area” visits per family per annum to an alternative Network Partner or GP of your choice, subject to pre-authorisation. A 1 month waiting period applies.',
  },
  {
    title: 'Family Funeral Benefit',
    text:
      'Principal, Spouse & Child > 14 years R10,000. Child > 6 years R5,000. Child > 0 years > R2,500. Stillborn > 28 weeks R1,250. A 3 month waiting period applies.',
  },
];

const legalCopy = `Practical Medical Insurance – Providing cover since 2003 Day1 Health (Pty) Ltd is an authorised Financial Services Provider – FSP Number 11319. Day1 Health (Pty) Ltd is duly approved and accredited by the Council for Medical Schemes – CMS Ref: 1074. Powered by Day1 Health – Underwritten by African Unity Life Ltd, a licensed Life Insurer and an authorised Financial Services Provider. FSP No: FSP 8447. Day1 Health offers Medical Insurance plans and is not a Medical Aid product.

Day1 Health complies with the principles of open enrollment, community rating and cross-subsidisation and does not discriminate or refuse membership on the basis of race, age, gender, marital status, ethnic or social origin, sexual orientation, pregnancy, disability, state of health, geographical location or any other means of discrimination.`;

const PlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [option, setOption] = useState('');
  const [childCount, setChildCount] = useState(0);
  const [adultCount, setAdultCount] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');
  const [coverCarouselIndex, setCoverCarouselIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const variantParam = (searchParams.get('variant') || 'single').toLowerCase();
  const variantDisplay = variantParam === 'couple' || variantParam === 'couples' ? 'Couple' : variantParam === 'family' ? 'Family' : 'Single';
  const pageTitle = `Day-to-Day - ${variantDisplay}`;
  
  // Map variant to the correct Day-to-Day plan detail PDF
  const dayToDayPdfMap: Record<string, string> = {
    'single': 'Day-To-Day Single Plan.pdf',
    'couple': 'Day-To-Day Couple Plan.pdf',
    'family': 'Day-To-Day Family Plan.pdf',
  };
  const dayToDayPdfFile = dayToDayPdfMap[variantParam] || dayToDayPdfMap['single'];
  const pdfPath = `/assets/pdf's/${dayToDayPdfFile}`;

  // Pagination for description list
  const pageSize = 4;
  const [page, setPage] = useState(0);

  // Reset pagination when switching back to Description tab
  useEffect(() => {
    if (activeTab === 'description') setPage(0);
  }, [activeTab]);
  
  // Scroll to top when this page loads (e.g., after clicking "Choose Plan")
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle sidebar navigation
  const handleNavigate = (section: string) => {
    const targetSection = section === 'home' ? 'hero' : section;
    // Redirect to main site with hash
    window.location.href = `/#${targetSection}`;
    // Ensure top scroll during transition
    window.scrollTo(0, 0);
  };

  // Initialize selected option based on URL variant
  useEffect(() => {
    const initial = (variantParam === 'couple' || variantParam === 'couples')
      ? 'couple'
      : (variantParam === 'family' ? 'family' : 'single');
    setOption(initial);
  }, [variantParam]);

  // Initialize adult and child counts based on variant
  useEffect(() => {
    const raw = searchParams.get('children');
    const parsed = raw ? parseInt(raw, 10) : NaN;
    if (variantParam === 'family') {
      const clamped = Math.max(1, Math.min(4, isNaN(parsed) ? 1 : parsed));
      setChildCount(clamped);
      setAdultCount(1); // Family starts with 1 adult
    } else if (variantParam === 'single') {
      setChildCount(0); // Single always has 0 children
      setAdultCount(1); // Single is 1 adult
    } else if (variantParam === 'couple' || variantParam === 'couples') {
      const clamped = Math.max(0, Math.min(4, isNaN(parsed) ? 0 : parsed));
      setChildCount(clamped);
      setAdultCount(2); // Couple is 2 adults
    } else {
      setChildCount(0);
      setAdultCount(1);
    }
  }, [variantParam, searchParams]);

  // Quantity is fixed at 1 for non-family variants; no qty URL handling

  // Pricing rules
  const SINGLE_PRICE = 385;
  const COUPLE_PRICE = 674;
  const FAMILY_CHILD_PRICE = 193;
  const ADULT_PRICE = 385;
  const [currentPrice, setCurrentPrice] = useState(() => {
    const v = (option || (variantParam === 'couples' ? 'couple' : variantParam)) as 'single' | 'couple' | 'family';
    if (v === 'family') return ADULT_PRICE * adultCount + FAMILY_CHILD_PRICE * childCount;
    if (v === 'couple') return COUPLE_PRICE + FAMILY_CHILD_PRICE * childCount;
    // single: base + per-child
    return SINGLE_PRICE + FAMILY_CHILD_PRICE * childCount;
  });

  useEffect(() => {
    const v = (option || (variantParam === 'couples' ? 'couple' : variantParam)) as 'single' | 'couple' | 'family';
    let next = SINGLE_PRICE + FAMILY_CHILD_PRICE * childCount;
    if (v === 'family') next = ADULT_PRICE * adultCount + FAMILY_CHILD_PRICE * childCount;
    else if (v === 'couple') next = COUPLE_PRICE + FAMILY_CHILD_PRICE * childCount;
    setCurrentPrice(next);
  }, [childCount, adultCount, option, variantParam]);

  // Helper to keep URL in sync with selections
  const updateUrl = (nextVariant: string, nextChildren?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('variant', nextVariant);
    if (nextVariant === 'family') {
      const c = Math.max(1, Math.min(4, nextChildren ?? childCount));
      params.set('children', String(c));
    } else if (nextVariant === 'single') {
      const c = Math.max(0, Math.min(4, nextChildren ?? childCount));
      params.set('children', String(c));
    } else {
      params.delete('children');
    }
    // Always remove qty for Single/Couple to enforce a fixed quantity of 1
    params.delete('qty');
    setSearchParams(params);
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-all duration-700 ease-in-out ${isDark ? 'bg-gray-900' : 'bg-gray-50'} ${
        isSidebarCollapsed ? 'lg:ml-24 lg:w-[calc(100%-6rem)]' : 'lg:ml-64 lg:w-[calc(100%-16rem)]'
      }`}
      style={{
        transition: 'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
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
            {/* Page header */}
            <motion.div
              className={`max-w-[73rem] mx-auto px-4 md:px-6`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
            </motion.div>

            {/* Hero / Title */}
            <section className={`${isDark ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900' : 'bg-gradient-to-b from-white via-gray-50 to-gray-50'} border-y ${isDark ? 'border-gray-800' : 'border-gray-200'} py-6 md:py-8 mb-6`}>
              <motion.div
                className={`max-w-[73rem] mx-auto px-4 md:px-6`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-3 md:mb-4">
                  <ol className="flex items-center gap-1 text-[16px]">
                    <li>
                      <Link
                        to="/"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigate('plans');
                        }}
                        className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm px-0.5`}
                      >
                        Back
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
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-emerald-400/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className={`text-2xl md:text-3xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{pageTitle}</h1>
                      <div className="mt-1">
                        <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>Day-to-Day Plan</div>
                        <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: R385.00 - R1,155.00</div>
                      </div>
                    </div>
                  </div>
                  {/* Right side price block removed per request; title now reflects selected plan name */}
                </div>
                {/* Cover highlights */}
                <motion.div
                  className={`mt-4 rounded-xl border p-4 ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/70 backdrop-blur-md border-gray-200'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  {/* Desktop: Grid layout */}
                  <div className="hidden sm:flex flex-wrap items-center gap-2">
                    <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Cover:</div>
                    {coverItems.map((c, i) => (
                      <motion.span
                        key={c}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 * i }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <Check className="w-3.5 h-3.5" /> {c}
                      </motion.span>
                    ))}
                  </div>

                  {/* Mobile: Carousel */}
                  <div className="sm:hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Cover:</div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{coverCarouselIndex + 1} / {coverItems.length}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCoverCarouselIndex((prev) => (prev === 0 ? coverItems.length - 1 : prev - 1))}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        aria-label="Previous cover item"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <motion.div
                        key={coverCarouselIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1"
                      >
                        <motion.span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs border w-full justify-center ${isDark ? 'bg-emerald-500/10 border-emerald-200/20 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
                          whileHover={{ scale: 1.03 }}
                        >
                          <Check className="w-3.5 h-3.5" /> {coverItems[coverCarouselIndex]}
                        </motion.span>
                      </motion.div>
                      <button
                        onClick={() => setCoverCarouselIndex((prev) => (prev === coverItems.length - 1 ? 0 : prev + 1))}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        aria-label="Next cover item"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              </section>

            {/* Main content grid */}
            <div className={`max-w-[73rem] mx-auto px-4 md:px-6 overflow-visible`}>
              <div className="grid grid-cols-12 gap-6 auto-rows-max lg:auto-rows-auto">
                {/* Left: Details & Tabs */}
                <motion.div 
                  className="col-span-12 lg:col-span-8 xl:col-span-9"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  {/* Tabs */}
                  <div className="mb-3 flex items-center gap-2">
                    <motion.button
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${activeTab === 'description' ? (isDark ? 'bg-emerald-600/20 border-emerald-400 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-800') : (isDark ? 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')}`}
                      onClick={() => setActiveTab('description')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Description
                    </motion.button>
                    <motion.button
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${activeTab === 'additional' ? (isDark ? 'bg-emerald-600/20 border-emerald-400 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-800') : (isDark ? 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')}`}
                      onClick={() => setActiveTab('additional')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Additional information
                    </motion.button>
                  </div>

                  {/* Tab content */}
                  {activeTab === 'description' ? (
                    <motion.div 
                      className={`rounded-xl border p-5 ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <div className="prose max-w-none">
                        <div className="grid md:grid-cols-2 gap-6">
                          {descriptionItems.map((item, i) => (
                            <motion.div 
                              key={item.title}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.03 * i }}
                              className={`rounded-lg border p-4 ${
                                isDark 
                                  ? 'bg-gray-900/50 border-gray-700 hover:border-emerald-500/50' 
                                  : 'bg-gray-50 border-gray-200 hover:border-emerald-400/50'
                              } transition-colors duration-200`}
                            >
                              <div className={`font-semibold mb-2 text-base ${
                                isDark ? 'text-emerald-400' : 'text-emerald-600'
                              }`}>{item.title}</div>
                              <div className={`text-sm leading-relaxed ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                              }`}>{item.text}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 text-xs opacity-80 whitespace-pre-line">{legalCopy}</div>
                      <div className="mt-4">
                        <DownloadHeroButton
                          href={pdfPath}
                          className="hero-cta-xs hero-cta-green hero-cta-fast hero-cta-left"
                          sentText="Downloaded info Plan"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className={`rounded-xl border p-5 ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <h3 className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Additional information</h3>
                      <div>
                        <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Options</div>
                        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {additionalInfoOptions.map((opt, i) => (
                            <motion.li
                              key={opt}
                              initial={{ opacity: 0, y: 8 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.35, delay: 0.02 * i }}
                              className={`text-sm rounded-lg border px-3 py-2 ${isDark ? 'bg-gray-900/60 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                            >
                              {opt}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Right: Sticky summary / purchase card */}
                <aside className="col-span-12 lg:col-span-4 xl:col-span-3 -mt-4 sm:-mt-6 lg:mt-0">
                  <div className="lg:sticky lg:top-24 lg:h-fit">
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
                          <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Day To Day</div>
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
                            updateUrl(
                              v,
                              v === 'family' ? childCount : undefined
                            );
                          }}
                            className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          >
                            <option value="">Choose an option</option>
                            <option value="single">Single</option>
                            <option value="couple">Couple</option>
                            <option value="family">Family</option>
                          </select>
                        </div>

                        {option === 'single' && (
                          <>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Adults 18+</label>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <div className={`h-8 px-3 rounded-md border flex items-center justify-center text-sm ${
                                  isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                }`}>
                                  {adultCount}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {option === 'couple' && (
                          <>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Adults 18+</label>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <div className={`h-8 px-3 rounded-md border flex items-center justify-center text-sm ${
                                  isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                }`}>
                                  {adultCount}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Children 0-21</label>
                                <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>0–4</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease children"
                                  onClick={() => { setChildCount(Math.max(0, childCount - 1)); updateUrl('couple', Math.max(0, childCount - 1)); }}
                                  className={`h-8 w-8 rounded-md border flex items-center justify-center text-sm transition-colors ${
                                    isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  -
                                </button>
                                <div className={`h-8 px-3 rounded-md border flex items-center justify-center text-sm ${
                                  childCount === 0
                                    ? (isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300')
                                    : (isDark ? 'bg-gray-900/60 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-300')
                                }`}>
                                  {childCount}
                                </div>
                                <button
                                  type="button"
                                  aria-label="Increase children"
                                  onClick={() => { setChildCount(Math.min(4, childCount + 1)); updateUrl('couple', Math.min(4, childCount + 1)); }}
                                  className={`h-8 w-8 rounded-md border flex items-center justify-center text-sm transition-colors ${
                                    isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        {option === 'family' ? (
                          <>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Adults 18+</label>
                                <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1–2</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease adults"
                                  onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                                  className={`h-8 w-8 rounded-md border flex items-center justify-center text-sm transition-colors ${
                                    isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  -
                                </button>
                                <div className={`h-8 px-3 rounded-md border flex items-center justify-center text-sm ${
                                  adultCount === 1
                                    ? (isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300')
                                    : (isDark ? 'bg-gray-900/60 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-300')
                                }`}>
                                  {adultCount}
                                </div>
                                <button
                                  type="button"
                                  aria-label="Increase adults"
                                  onClick={() => setAdultCount(Math.min(2, adultCount + 1))}
                                  className={`h-8 w-8 rounded-md border flex items-center justify-center text-sm transition-colors ${
                                    isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Children 0-21</label>
                                <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>0–4</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease children"
                                  onClick={() => { setChildCount(Math.max(0, childCount - 1)); updateUrl('family', Math.max(0, childCount - 1)); }}
                                  className={`h-8 w-8 rounded-md border flex items-center justify-center text-sm transition-colors ${
                                    isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  -
                                </button>
                                <div className={`h-8 px-3 rounded-md border flex items-center justify-center text-sm ${
                                  childCount === 0
                                    ? (isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300')
                                    : (isDark ? 'bg-gray-900/60 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-300')
                                }`}>
                                  {childCount}
                                </div>
                                <button
                                  type="button"
                                  aria-label="Increase children"
                                  onClick={() => { setChildCount(Math.min(4, childCount + 1)); updateUrl('family', Math.min(4, childCount + 1)); }}
                                  className={`h-8 w-8 rounded-md border flex items-center justify-center text-sm transition-colors ${
                                    isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = pdfPath;
                            link.download = dayToDayPdfFile;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          Download Application
                        </button>
                      </div>

                    </motion.div>
                  </div>
                </aside>
              </div>
            </div>
          </main>

          <Footer id="footer" />
        </div>
      </div>
    </div>
  );
};

export default PlanDetailPage;



