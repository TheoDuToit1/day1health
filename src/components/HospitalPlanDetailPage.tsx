import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { DownloadHeroButton } from './ui/download-hero-button';
import { RollingNumber } from './ui/rolling-number';

const coverItems = [
  'Private Hospital Benefits',
  'Illness',
  'Accident',
  'Ambulance',
  'Funeral',
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

// descriptionItems are built per tier inside the component

const legalCopy = `Practical Medical Insurance – Providing cover since 2003 Day1 Health (Pty) Ltd is an authorised Financial Services Provider – FSP Number 11319. Day1 Health (Pty) Ltd is duly approved and accredited by the Council for Medical Schemes – CMS Ref: 1074. Powered by Day1 Health – Underwritten by African Unity Life Ltd, a licensed Life Insurer and an authorised Financial Services Provider. FSP No: FSP 8447. Day1 Health offers Medical Insurance plans and is not a Medical Aid product.

Day1 Health complies with the principles of open enrollment, community rating and cross-subsidisation and does not discriminate or refuse membership on the basis of race, age, gender, marital status, ethnic or social origin, sexual orientation, pregnancy, disability, state of health, geographical location or any other means of discrimination.`;

const HospitalPlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [option, setOption] = useState('');
  const [childCount, setChildCount] = useState(1);
  const [adultCount, setAdultCount] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');
  const [coverCarouselIndex, setCoverCarouselIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const variantParam = (searchParams.get('variant') || 'single').toLowerCase();
  const variantDisplay = variantParam === 'couple' || variantParam === 'couples' ? 'Couple' : variantParam === 'family' ? 'Family' : 'Single';
  const tierParam = (searchParams.get('tier') || 'value').toLowerCase();
  const tierDisplay = tierParam === 'platinum' ? 'Platinum' : tierParam === 'executive' ? 'Executive' : tierParam === 'value plus' ? 'Value Plus' : 'Value';
  const tierKey = (tierParam === 'platinum' || tierParam === 'executive') ? tierParam : 'value';
  const pageTitle = `Hospital - ${tierDisplay} - ${variantDisplay}`;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  useEffect(() => {
    const initial = (variantParam === 'couple' || variantParam === 'couples')
      ? 'couple' : (variantParam === 'family' ? 'family' : 'single');
    setOption(initial);
  }, [variantParam]);

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

  // Map tier to the correct Hospital plan PDF
  const hospitalPdfMap: Record<string, string> = {
    value: "Hospital Value Plus Plan.pdf",
    platinum: "Hospital Platinum Plan.pdf",
    executive: "Hospital Executive Plan.pdf",
  };
  const hospitalPdfFile = hospitalPdfMap[tierKey] || hospitalPdfMap['value'];
  const pdfPath = `/assets/pdf's/${hospitalPdfFile}`;

  // Build cover badges per tier
  const displayCoverItems = ((): string[] => {
    if (tierKey === 'executive') return [...coverItems, 'Illness Top-Up', 'Critical Illness', 'Accidental Permanent Disability'];
    if (tierKey === 'platinum') return [...coverItems, 'Critical Illness', 'Accidental Permanent Disability'];
    return coverItems;
  })();

  // Tier-aware description items (Value base; Platinum/Executive add-ons)
  const descriptionItems: { title: string; text: string }[] = (() => {
    const base: { title: string; text: string }[] = [
      {
        title: 'In-hospital Illness Benefit',
        text:
          'Covers up to R10,000 after the first 24 Hours in hospital, up to R10,000 for the second day in hospital, up to R10,000 for the third day in hospital. Thereafter R1,500 per day up to a maximum of 21 days. A 3 month waiting period applies and a 12 month pre-existing conditions exclusion applies.',
      },
      { title: '1st Day in Hospital', text: 'Not less than 24 hours from time of admission to time of discharge — Up to R10 000.00' },
      { title: '2nd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R10 000.00 payable in units of R 2 500.00' },
      { title: '3rd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R 10 000.00 payable in units of R 2 500.00' },
      { title: 'Every subsequent day thereafter', text: 'R1 500.00' },
      { title: 'Maximum Benefit payable for 21 day period', text: 'Up To R 57 000.00' },
      { title: 'Accident/Trauma Benefit', text: 'Up to R 150,000 per single member per incident and up to R 300,000 per family incident. Immediate cover.' },
      { title: '24 Hour Emergency Services ambulance & Pre-Authorisation (0861 144 144)', text: '24 Hour Emergency Services, Medical Assistance and Pre-Authorisation provided by Africa Assist. Immediate Cover. Guaranteed private hospital admission with preference to all Life Healthcare and Mediclinic hospitals.' },
      { title: 'Maternity Benefit', text: 'Covers up to R20,000 for the birth of a child in hospital. 12 month waiting period applies. Benefit only available to plan members (16 years and older).' },
      {
        title: 'Family Funeral Benefit',
        text:
          'Principal member – R20,000. Spouse & Child > 14 years – R 10,000. Child > 6 years – R 5,000. Child > 0 years – R 2,500. Child > 28 weeks – R1,250. A 3 month waiting period applies. (Benefit only available to plan members.)',
      },
    ];
    if (tierKey === 'platinum') {
      return [
        ...base,
        { title: 'Critical Illness Benefit', text: '1 Incident per family per annum. Critical Illness up to R250,000, however the benefit is limited to R50,000 unless the insured person accedes to a short medical examination (at their own cost) to be arranged by Day1 Health. The underwriter’s decision is final. A 3 month waiting period applies.' },
        { title: 'Accidental Permanent Disability Benefit', text: 'R 250 000 for the Principal Member only. Single event only. Immediate cover.' },
      ];
    }
    if (tierKey === 'executive') {
      return [
        { title: 'In-hospital Illness Benefit', text: 'Covers up to R10,000 after the first 24 Hours in hospital, up to R10,000 for the second day in hospital, up to R10,000 for the third day in hospital. Thereafter R2,000 per day up to a maximum of 21 days. A 3 month waiting period applies and a 12 month pre-existing conditions exclusion applies.' },
        { title: '1st Day in Hospital', text: 'Not less than 24 hours from time of admission to time of discharge — Up to R10 000.00' },
        { title: '2nd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R10 000.00 payable in units of R 2 500.00' },
        { title: '3rd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R 10 000.00 payable in units of R 2 500.00' },
        { title: 'Every subsequent day thereafter', text: 'R2 000.00' },
        { title: 'Maximum Benefit payable for 21 day period', text: 'Up To R 66 000.00' },
        { title: 'Illness Top-up', text: 'Up to R25,000 per insured person per year subject to an overall limit of 2 events per family policy per annum. A 3 month waiting period applies' },
        { title: 'Accident/Trauma Benefit', text: 'Up to R250,000 per single member per incident and up to R500,000 per family per incident. Immediate cover.' },
        { title: 'Critical Illness Benefit', text: '1 Incident per family per annum. Critical Illness up to R250,000, however the benefit is limited to R50,000 unless the insured person accedes to a short medical examination (at their own cost) to be arranged by Day1 Health. The underwriter’s decision is final. A 3 month waiting period applies.' },
        { title: 'Accidental Permanent Disability Benefit', text: 'R 250 000 for the Principal Member only. Single event only. Immediate cover.' },
        { title: '24 Hour Emergency Services ambulance & Pre-Authorisation (0861 144 144)', text: '24 Hour Emergency Services, Medical Assistance and Pre-Authorisation provided by Africa Assist. Immediate Cover. Guaranteed private hospital admission with preference to all Life Healthcare and Mediclinic hospitals' },
        { title: 'Maternity Benefit', text: 'Covers up to R20,000 for the birth of a child in hospital. 12 month waiting period applies. Benefit only available to plan members (16 years and older).' },
        { title: 'Family Funeral Benefit', text: 'Principal member & Spouse – R 30,000. Child > 14 years – R 10,000. Child > 6 years  – R 5,000. Child > 0 years – R 2,500. Child > 28 weeks – R1,250. A 3-month waiting period applies. (Benefit only available to plan members.)' },
      ];
    }
    return base;
  })();

  // Pagination for description list
  const pageSize = 4;
  const pageCount = Math.ceil(descriptionItems.length / pageSize);
  const pagedItems = descriptionItems.slice(page * pageSize, page * pageSize + pageSize);

  // Reset pagination when switching back to Description tab
  useEffect(() => {
    if (activeTab === 'description') setPage(0);
  }, [activeTab]);

  // Hospital plan pricing by tier
  const ADULT_PRICE = tierKey === 'platinum' ? 560 : tierKey === 'executive' ? 640 : 390;
  const COUPLE_PRICE = tierKey === 'platinum' ? 1008 : tierKey === 'executive' ? 1152 : 702;
  const CHILD_PRICE = tierKey === 'platinum' ? 224 : tierKey === 'executive' ? 256 : 156;
  const currentPrice = ((): number => {
    if (adultCount === 2) {
      return COUPLE_PRICE + CHILD_PRICE * childCount;
    }
    return ADULT_PRICE * adultCount + CHILD_PRICE * childCount;
  })();

  const updateUrl = (nextVariant: string, nextChildren?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('variant', nextVariant);
    if (nextVariant === 'family') {
      const c = Math.max(1, Math.min(4, nextChildren ?? childCount));
      params.set('children', String(c));
    } else {
      params.delete('children');
    }
    // Always remove qty for Single/Couple to enforce a fixed quantity of 1
    params.delete('qty');
    setSearchParams(params);
  };

  const handleNavigate = (section: string) => {
    const targetSection = section === 'home' ? 'hero' : section;
    window.location.href = `/#${targetSection}`;
    window.scrollTo(0, 0);
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
                      {tierKey === 'value' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>Value Plus Hospital Plan</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: R390.00 - R1,326.00</div>
                        </div>
                      )}
                      {tierKey === 'platinum' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>Platinum Hospital Plan</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: R560.00 - R1,904.00</div>
                        </div>
                      )}
                      {tierKey === 'executive' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>Executive Hospital Plan</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: R640.00 - R2,176.00</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Cover highlights */}
                <motion.div
                  className={`mt-4 rounded-xl border p-4 ${isDark ? 'bg-emerald-900/10 border-emerald-800' : 'bg-white/70 backdrop-blur-md border-gray-200'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  {/* Desktop: Grid layout */}
                  <div className="hidden sm:flex flex-wrap items-center gap-2">
                    <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Cover:</div>
                    {displayCoverItems.map((c, i) => (
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
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{coverCarouselIndex + 1} / {displayCoverItems.length}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCoverCarouselIndex((prev) => (prev === 0 ? displayCoverItems.length - 1 : prev - 1))}
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
                          <Check className="w-3.5 h-3.5" /> {displayCoverItems[coverCarouselIndex]}
                        </motion.span>
                      </motion.div>
                      <button
                        onClick={() => setCoverCarouselIndex((prev) => (prev === displayCoverItems.length - 1 ? 0 : prev + 1))}
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
            <div className={`max-w-[73rem] mx-auto px-4 md:px-6`}>
              <div className="grid grid-cols-12 gap-6">
                {/* Left: Details & Tabs */}
                <motion.div 
                  className="col-span-12 lg:col-span-8 xl:col-span-9"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
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
                          filename={hospitalPdfFile}
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
                              animate={{ opacity: 1, y: 0 }}
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
                              updateUrl(v);
                            }}
                            className={`w-full mt-1 px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          >
                            <option value="">Choose an option</option>
                            <option value="single">Single</option>
                            <option value="couple">Couple</option>
                            <option value="family">Family</option>
                          </select>
                        </div>
                        {option === 'family' && (
                          <div>
                            <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Children</label>
                            <select
                              value={childCount}
                              onChange={(e) => {
                                const c = parseInt(e.target.value, 10);
                                setChildCount(c);
                                updateUrl('family', c);
                              }}
                              className={`w-full mt-1 px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
                          onClick={() => {
                            const link = document.createElement('a');
                            const pdfMap: Record<string, string> = {
                              'value': '/assets/pdf\'s/Application forms/Hospital-ValuePlus.pdf',
                              'platinum': '/assets/pdf\'s/Application forms/hospital-platinum.pdf',
                              'executive': '/assets/pdf\'s/Application forms/Hospital-Executive.pdf'
                            };
                            const fileNameMap: Record<string, string> = {
                              'value': 'Hospital-ValuePlus.pdf',
                              'platinum': 'hospital-platinum.pdf',
                              'executive': 'Hospital-Executive.pdf'
                            };
                            link.href = pdfMap[tierKey] || pdfMap['value'];
                            link.download = fileNameMap[tierKey] || fileNameMap['value'];
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

export default HospitalPlanDetailPage;
