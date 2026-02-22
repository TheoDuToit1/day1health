import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimatedPaymentButton } from './ui/animated-payment-button';
import { AnimatedContactButton } from './ui/animated-contact-button';
import { RollingNumber } from './ui/rolling-number';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { DownloadHeroButton } from './ui/download-hero-button';

const coverItems = [
  'Unlimited Doctor Visits',
  'Acute/Chronic Medication',
  'Dentistry / Optometry',
  'Radiology',
  'Pathology',
  'Out-of-Area Visits',
  'Funeral Cover',
];

// descriptionItems will be set in the component based on Senior category

const legalCopy = `Practical Medical Insurance – Providing cover since 2003 Day1 Health (Pty) Ltd is an authorised Financial Services Provider – FSP Number 11319. Day1 Health (Pty) Ltd is duly approved and accredited by the Council for Medical Schemes – CMS Ref: 1074. Powered by Day1 Health – Underwritten by African Unity Life Ltd, a licensed Life Insurer and an authorised Financial Services Provider. FSP No: FSP 8447. Day1 Health offers Medical Insurance plans and is not a Medical Aid product.

Day1 Health complies with the principles of open enrollment, community rating and cross-subsidisation and does not discriminate or refuse membership on the basis of race, age, gender, marital status, ethnic or social origin, sexual orientation, pregnancy, disability, state of health, geographical location or any other means of discrimination.`;

const SeniorPlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [option, setOption] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');
  const [coverCarouselIndex, setCoverCarouselIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  // Only Single or Couple for Senior
  const rawVariant = (searchParams.get('variant') || 'single').toLowerCase();
  const variantParam = rawVariant === 'family' ? 'single' : rawVariant; // guard
  const variantDisplay = (variantParam === 'couple' || variantParam === 'couples') ? 'couple' : 'single';
  // Category segment (Senior categories): day-to-day, comprehensive, hospital. Default to 'day-to-day'.
  const rawCategory = (searchParams.get('category') || 'day-to-day').toLowerCase();
  const allowedSeniorCategories = new Set(['day-to-day', 'comprehensive', 'hospital']);
  const categoryDisplay = allowedSeniorCategories.has(rawCategory) ? rawCategory : 'day-to-day';
  // Create display-friendly version for page title
  const categoryDisplayTitle = categoryDisplay === 'day-to-day' ? 'Day-to-Day' : 
                               categoryDisplay === 'comprehensive' ? 'Comprehensive' : 
                               categoryDisplay === 'hospital' ? 'Hospital' : 'Day-to-Day';
  const pageTitle = ['Senior-Plan', categoryDisplayTitle, variantDisplay].filter(Boolean).join(' / ');

  type CardKey = 'single' | 'couple';
  const [expanded, setExpanded] = useState<Record<CardKey, boolean>>({
    single: false,
    couple: false,
  });
  const toggleExpanded = (key: CardKey) =>
    setExpanded((prev) => ({ single: false, couple: false, [key]: !prev[key] } as Record<CardKey, boolean>));

  // Build cover badges based on Senior category
  const displayCoverItems: string[] = (() => {
    if (categoryDisplay === 'hospital') {
      return [
        'Private Hospital Benefits',
        'Illness / Accident Benefit / Ambulance',
        'Funeral Cover',
      ];
    }
    if (categoryDisplay === 'comprehensive') {
      const dayToDayItems = coverItems;
      const extraItems = [
        'Unlimited Doctor Visits etc.',
        'Private Hospital Benefits',
        'Illness / Accident / Ambulance',
        'Funeral Cover',
      ];
      const combined: string[] = [...dayToDayItems];
      extraItems.forEach((item) => {
        if (!combined.includes(item)) {
          combined.push(item);
        }
      });
      return combined;
    }
    // day-to-day uses default with Funeral Cover already included
    return coverItems;
  })();

  // Category-aware description list
  const descriptionItems: { title: string; text: string }[] = (() => {
    if (categoryDisplay === 'hospital') {
      return [
        {
          title: 'In-hospital Illness Benefit',
          text:
            'Covers up to R10,000 after the first 24 Hours in hospital, up to R10,000 for the second day in hospital, up to R10,000 for the third day in hospital. Thereafter R1,500 per day up to a maximum of 21 days. A 3 month waiting period applies and a 12 month pre-existing conditions exclusion applies. (Excludes Maternity Benefits)',
        },
        { title: '1st Day in Hospital', text: 'Not less than 24 hours from time of admission to time of discharge — Up to R 10 000.00' },
        { title: '2nd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R 10 000.00 payable in units of R 2 500.00' },
        { title: '3rd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R 10 000.00 payable in units of R 2 500.00' },
        { title: 'Every subsequent day thereafter', text: 'R 1 500.00' },
        { title: 'Maximum Benefit payable for 21 day period', text: 'Up To R 57 000.00' },
        { title: 'Accident/Trauma Benefit', text: 'Up to R 75,000 per event. Limited to two events per annum. A 1 month waiting period applies. (Excludes Sport Injuries)' },
        { title: 'Funeral Benefit', text: 'Principal Member and Spouse – R 5,000. A 3-month waiting period applies. (Benefit only available to plan members.)' },
        { title: '24 Hour Emergency Services Ambulance & Pre-Authorisation', text: '24 Hour emergency services and pre-authorisation provided by Africa-Assist, including 24 hour medical advice and access to unlimited Pay-as-you-Go Virtual Doctor Consultations. Immediate Cover. Guaranteed private hospital admission with preference to all Life Healthcare and Mediclinic hospitals nationwide' },
      ];
    }
    if (categoryDisplay === 'comprehensive') {
      return [
        { title: 'Doctor Visits', text: 'Consultations available via a registered Day1 Health Network Partner. Limited to 5 doctor visits per member per annum. A Pay-as-you-Go Virtual Doctor consultation platform is available for members to utilise thereafter. Pre-authorisation is required. A 1 month waiting period applies.' },
        { title: 'Acute Medication', text: 'Acute medication covered according to the 1Doctor Health formulary. Linked to the 1Doctor consultation dispensed by the 1Doctor Health Network Partner or obtained on script from a Network Partner Pharmacy. A 1 month waiting period applies.' },
        { title: 'Chronic Medication', text: 'Chronic medication covered according to the Day1 Health formulary. Chronic Medication is limited to R500 per member per month and up to R6000 per member per annum. A 3 month waiting period applies on chronic medication for unknown conditions and a 12 month waiting period on pre-existing conditions. All chronic medication is subject to pre-authorisation.' },
        { title: 'Radiology', text: 'Basic radiology according to the 1Doctor Health formulary via a 1Doctor Health Network Partner. Black and white diagnostic x-rays only. A 1 month waiting period applies.' },
        { title: 'Pathology', text: 'Basic diagnostic blood tests on referral by a 1Doctor Health Network Partner and subject to a list of basic pathology tests approved by Day1 Health. A 1 month waiting period applies.' },
        { title: 'Basic Dentistry', text: 'Basic treatment includes preventative cleaning, fillings, extractions and emergency pain and sepsis control via a Day1 Health Network Partner. 2 visits per member per annum. Pre-authorisation is required for each visit. A 3 month waiting period applies.' },
        { title: 'Optometry (Iso Leso Optics)', text: 'One eye test and one set of glasses every 24 months per the specific Iso Leso Optics agreed protocol range. A 12 month waiting period applies.' },
        { title: 'Out-of-Area Visits', text: 'In the event that you cannot see your Network Partner, the Plan will allow 3 "out of area" visits per family per annum to an alternative Network Partner or GP of your choice, subject to pre-authorisation. A 1 month waiting period applies.' },
        { title: 'In-hospital Illness Benefit', text: 'Covers up to R10,000 after the first 24 Hours in hospital, up to R10,000 for the second day in hospital, up to R10,000 for the third day in hospital. Thereafter R1,500 per day up to a maximum of 21 days. A 3 month waiting period applies and a 12 month pre-existing conditions exclusion applies.' },
        { title: '1st Day in Hospital', text: 'Not less than 24 hours from time of admission to time of discharge — Up to R10 000.00' },
        { title: '2nd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R10 000.00 payable in units of R2 500.00' },
        { title: '3rd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R10 000.00 payable in units of R2 500.00' },
        { title: 'Every subsequent day thereafter', text: 'R1 500.00' },
        { title: 'Maximum Benefit payable for 21 day period', text: 'Up To R57 000.00' },
        { title: 'Accident/Trauma Benefit', text: 'Up to R 75,000 per single member and up to R 150,000 per family incident. Immediate cover. (limited to two events per annum)' },
        { title: 'Funeral Benefits', text: 'Principal Member and spouse – R 5,000. A 3-month waiting period applies. (Benefit only available to plan members.)' },
        { title: '24 Hour Emergency Services Ambulance & Pre-Authorisation (0861 144 144)', text: '24 Hour Emergency Services, Medical Assistance and Pre-Authorisation provided by Africa Assist. Immediate Cover. Guaranteed private hospital admission with preference to all Life Healthcare and Mediclinic hospitals' },
      ];
    }
    // Default to Day-to-Day content
    return [
      {
        title: 'Doctor Visits',
        text:
          'Consultations available via a registered Day1 Health Network Partner. Limited to 5 doctor visits per member per annum. Pre-authorisation is required. A 1 month waiting period applies.',
      },
      {
        title: 'Acute Medication',
        text:
          'Acute medication covered according to the 1Doctor Health formulary. Linked to the 1Doctor consultation dispensed by the 1Doctor Health Network Partner or obtained on script from a Network Partner Pharmacy. A 1 month waiting period applies.',
      },
      {
        title: 'Chronic Medication',
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
          'In the event that you cannot see your Network Partner, the Plan will allow 3 "out of area" visits per family per annum to an alternative Network Partner or GP of your choice, subject to pre-authorisation. A 1 month waiting period applies.',
      },
      {
        title: 'Funeral Benefit',
        text:
          'Principal Member and Spouse – R 5,000. A 3-month waiting period applies. (Benefit only available to plan members.)',
      },
    ];
  })();

  // Pagination for description list
  const pageSize = 4;
  const [page, setPage] = useState(0);
  useEffect(() => { if (activeTab === 'description') setPage(0); }, [activeTab]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  // Map Senior category to the correct PDF
  const seniorPdfMap: Record<string, string> = {
    'day-to-day': 'Senior Day-To-Day Plan.pdf',
    'comprehensive': 'Senior Comprehensive Plan.pdf',
    'hospital': 'Senior Hospital Plan.pdf',
  };
  const seniorPdfFile = seniorPdfMap[categoryDisplay] || seniorPdfMap['day-to-day'];
  const seniorPdfPath = `/assets/pdf's/${seniorPdfFile}`;

  const handleNavigate = (section: string) => {
    const targetSection = section === 'home' ? 'hero' : section;
    window.location.href = `/#${targetSection}`;
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const initial = (variantParam === 'couple' || variantParam === 'couples') ? 'couple' : 'single';
    setOption(initial);
  }, [variantParam]);

  // Quantity is fixed to 1 for Senior (Single/Couple only); no qty handling

  // Category-aware pricing: Different prices per category
  const ADULT_PRICE = (() => {
    switch (categoryDisplay) {
      case 'comprehensive':
        return 875;
      case 'hospital':
        return 580;
      case 'day-to-day':
      default:
        return 425;
    }
  })();
  const currentPrice = ((): number => {
    const adultCount = (option === 'couple') ? 2 : 1;
    return ADULT_PRICE * adultCount;
  })();

  const updateUrl = (nextVariant: 'single' | 'couple') => {
    const params = new URLSearchParams(searchParams);
    params.set('variant', nextVariant);
    params.delete('children');
    // Always remove qty for Senior to enforce quantity=1
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigate('plans');
                        }}
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
                      {categoryDisplay === 'day-to-day' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>Senior Day to Day Plan</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: R425.00 - R850.00</div>
                        </div>
                      )}
                      {categoryDisplay === 'comprehensive' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>Senior Comprehensive Plan</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: R875.00 - R1,750.00</div>
                        </div>
                      )}
                      {categoryDisplay === 'hospital' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>Value Plus Hospital Plan | Senior</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: R580.00 - R1,160.00</div>
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
                    {displayCoverItems.map((c: string, i: number) => (
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
                          {descriptionItems.map((item: { title: string; text: string }, i: number) => (
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
                          href={seniorPdfPath}
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
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {['Senior Member','Senior Couple'].map((opt: string, i: number) => (
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
                          <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Senior-Plan</div>
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
                              const v = (e.target.value as 'single' | 'couple');
                              setOption(v);
                              updateUrl(v);
                            }}
                            className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          >
                            <option value="">Choose an option</option>
                            <option value="single">Single</option>
                            <option value="couple">Couple</option>
                          </select>
                        </div>
                        
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
                          onClick={() => {
                            const link = document.createElement('a');
                            const pdfMap: Record<string, string> = {
                              'comprehensive': '/assets/pdf\'s/Application forms/Senior-Comprehensive.pdf',
                              'hospital': '/assets/pdf\'s/Application forms/Senior-Hospital.pdf',
                              'day-to-day': '/assets/pdf\'s/Application forms/Senior-Day-To-Day.pdf'
                            };
                            const fileNameMap: Record<string, string> = {
                              'comprehensive': 'Senior Comprehensive - Application Form.pdf',
                              'hospital': 'Senior Hospital - Application Form.pdf',
                              'day-to-day': 'Senior Day-To-Day - Application Form.pdf'
                            };
                            link.href = pdfMap[categoryDisplay] || pdfMap['day-to-day'];
                            link.download = fileNameMap[categoryDisplay] || fileNameMap['day-to-day'];
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

export default SeniorPlanDetailPage;




