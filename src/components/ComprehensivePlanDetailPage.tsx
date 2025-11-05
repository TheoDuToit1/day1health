import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, ChevronRight } from 'lucide-react';
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

// descriptionItems will be defined inside the component where tierParam is available

const legalCopy = `Practical Medical Insurance – Providing cover since 2003 Day1 Health (Pty) Ltd is an authorised Financial Services Provider – FSP Number 11319. Day1 Health (Pty) Ltd is duly approved and accredited by the Council for Medical Schemes – CMS Ref: 1074. Powered by Day1 Health – Underwritten by African Unity Life Ltd, a licensed Life Insurer and an authorised Financial Services Provider. FSP No: FSP 8447. Day1 Health offers Medical Insurance plans and is not a Medical Aid product.

Day1 Health complies with the principles of open enrollment, community rating and cross-subsidisation and does not discriminate or refuse membership on the basis of race, age, gender, marital status, ethnic or social origin, sexual orientation, pregnancy, disability, state of health, geographical location or any other means of discrimination.`;

const ComprehensivePlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [option, setOption] = useState('');
  const [childCount, setChildCount] = useState(0);
  const [adultCount, setAdultCount] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');
  const [searchParams, setSearchParams] = useSearchParams();
  const variantParam = (searchParams.get('variant') || 'single').toLowerCase();
  const variantDisplay = variantParam === 'couple' || variantParam === 'couples' ? 'Couple' : variantParam === 'family' ? 'Family' : 'Single';
  const tierParam = (searchParams.get('tier') || 'value').toLowerCase();
  const tierDisplay = tierParam === 'platinum' ? 'Platinum' : tierParam === 'executive' ? 'Executive' : 'Value Plus';
  const pageTitle = `Comprehensive - ${tierDisplay} - ${variantDisplay}`;
  type CardKey = 'single' | 'couple' | 'family';
  const [expanded, setExpanded] = useState<Record<CardKey, boolean>>({
    single: false,
    couple: false,
    family: false,
  });
  const toggleExpanded = (key: CardKey) =>
    setExpanded((prev) => {
      const willOpen = !prev[key];
      return {
        single: false,
        couple: false,
        family: false,
        [key]: willOpen,
      } as Record<CardKey, boolean>;
    });
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  // Map tier to the correct Comprehensive plan PDF
  const comprehensivePdfMap: Record<string, string> = {
    value: "Comprehensive Value Plus Plan 2025.pdf",
    platinum: "Comprehensive Platinum Plan 2025.pdf",
    executive: "Comprehensive Executive Plan 2025.pdf",
  };

  // Build cover badges per Comprehensive tier
  const displayCoverItems = ((): string[] => {
    // For Value: include hospital-related items as provided
    if (tierParam === 'value') {
      return [
        ...coverItems,
        'Private Hospital Benefits',
        'Illness',
        'Accident',
        'Ambulance',
      ];
    }
    if (tierParam === 'platinum') {
      return [
        ...coverItems,
        'Private Hospital Benefits',
        'Illness',
        'Accident',
        'Critical Illness',
        'Ambulance',
      ];
    }
    if (tierParam === 'executive') {
      return [
        ...coverItems,
        'Private Hospital Benefits',
        'Illness',
        'Illness Top-Up',
        'Accident',
        'Critical Illness',
        'Ambulance',
      ];
    }
    return coverItems;
  })();

  // Tier-aware description items (Value base; Platinum/Executive add-ons)
  const descriptionItems: { title: string; text: string }[] = (() => {
    const base: { title: string; text: string }[] = [
      {
        title: 'Unlimited Managed Doctor Visits',
        text:
          'Via a registered Day1 Health Network Provider. An upfront co-payment of R300.00 will apply for all additional visits after the 5th visit per member per annum. Pre-authorisation is required. A 1 month waiting period applies.',
      },
      {
        title: 'Pathology',
        text:
          'Basic diagnostic blood tests on referral by a 1Doctor Health Network GP and subject to a list of basic pathology tests approved by Day1 Health. A 1 month waiting period applies.',
      },
      {
        title: 'Specialist Benefit',
        text:
          'Specialist Benefit of up to R 1000 per family per annum. Subject to pre-authorisation and referral from a 1Doctor Health Network GP. A 3 month waiting period applies.',
      },
      {
        title: 'Basic Dentistry',
        text:
          'Basic treatment includes preventative cleaning, fillings, extractions and emergency pain and sepsis control via a Day1 Health Network Dentist. 2 visits per member per annum. Pre-authorisation is required for each visit. A 3 month waiting period applies.',
      },
      {
        title: 'Acute & Chronic Medication',
        text:
          'Chronic medication covered according to the 1Doctor Health formulary. A 3 month waiting period applies on chronic medication for unknown conditions and 12 months waiting period on pre-existing conditions. (All chronic medication is subject to pre-authorisation. An additional administration fee may be levied on all approved chronic medication.)',
      },
      {
        title: 'Optometry (Iso Leso Optics)',
        text:
          'One eye test and one set of glasses every 24 months per the specific Iso Leso Optics agreed protocol range. A 12 month waiting period applies.',
      },
      {
        title: 'Radiology',
        text:
          'Basic radiology according to the 1Doctor Health formulary via a 1Doctor Health network GP. Black and white diagnostic x-rays only. A 1 month waiting period applies.',
      },
      {
        title: 'Out-of-Area Visits',
        text:
          'In the event that you cannot see your Network GP, the Plan will allow 3 "out of area" visits per family per annum to an alternative Network GP or GP of your choice, subject to pre-authorisation. A 1 month waiting period applies.',
      },
      {
        title: 'In-hospital Illness Benefit',
        text:
          'Covers up to R 10,000 after the first 24 Hours in hospital, up to R 10,000 for the second day in hospital, up to R 10,000 for the third day in hospital. Thereafter R 1,500 per day up to a maximum of 21 days. A 3 month waiting period applies and a 12 month pre-existing conditions exclusion applies.',
      },
      { title: '1st Day in Hospital', text: 'Not less than 24 hours from time of admission to time of discharge — Up to R10 000.00' },
      { title: '2nd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R10 000.00 payable in units of R 2 500.00' },
      { title: '3rd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R 10 000.00 payable in units of R 2 500.00' },
      { title: 'Every subsequent day thereafter', text: 'R1 500.00' },
      { title: 'Maximum Benefit payable for 21 day period', text: 'Up To R57 000.00' },
      { title: 'Accident/Trauma Benefit', text: 'Up to R 150,000 per single member per incident and up to R 300,000 per family incident. Immediate cover.' },
      { title: '24 Hour Emergency Services ambulance & Pre-Authorisation (0861 144 144)', text: '24 Hour Emergency Services, Medical Assistance and Pre-Authorisation provided by Africa Assist. Immediate Cover. Guaranteed private hospital admission with preference to all Life Healthcare and Mediclinic hospitals' },
      { title: 'Maternity Benefit', text: 'Covers up to R20,000 for the birth of a child in hospital. 12 month waiting period applies. Benefit only available to plan members (16 years and older).' },
      {
        title: 'Family Funeral Benefit',
        text:
          'Principal member – R20,000. Spouse & Child > 14 years – R 10,000. Child > 6 years – R 5,000. Child > 0 years – R 2,500. Child > 28 weeks – R1,250. A 3 month waiting period applies. (Benefit only available to plan members.)',
      },
    ];
    if (tierParam === 'platinum') {
      return [
        ...base,
        { title: 'Critical Illness Benefit', text: '1 Incident per family per annum. Critical Illness up to R250,000, however the benefit is limited to R50,000 unless the insured person accedes to a short medical examination (at their own cost) to be arranged by Day1 Health. The underwriter’s decision is final. A 3 month waiting period applies.' },
        { title: 'Accidental Permanent Disability Benefit', text: 'R 250 000 for the Principal Member only. Single event only. Immediate cover.' },
      ];
    }
    if (tierParam === 'executive') {
      return [
        base[0],
        base[1],
        base[2],
        base[3],
        base[4],
        base[5],
        base[6],
        base[7],
        { title: 'In-hospital Illness Benefit', text: 'Covers up to R10,000 after the first 24 Hours in hospital, up to R10,000 for the second day in hospital, up to R10,000 for the third day in hospital. Thereafter R2,000 per day up to a maximum of 21 days. A 3 month waiting period applies and a 12 month pre-existing conditions exclusion applies.' },
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
  const comprehensivePdfFile = comprehensivePdfMap[tierParam] || '';
  const compPdfPath = comprehensivePdfFile
    ? `/assets/pdf's/${comprehensivePdfFile}`
    : "/assets/pdf's/Day 1 Comparative guide 2025_v2.pdf";

  const handleNavigate = (section: string) => {
    const targetSection = section === 'home' ? 'hero' : section;
    sessionStorage.setItem('navigatingToSection', targetSection);
    window.location.href = `/#${targetSection}`;
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const initial = (variantParam === 'couple' || variantParam === 'couples')
      ? 'couple'
      : (variantParam === 'family' ? 'family' : 'single');
    setOption(initial);

    // Initialize adult and child counts
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

  // Tier-aware pricing: All Comprehensive plans have different base prices per adult + per child
  const pricing = (() => {
    switch (tierParam) {
      case 'platinum':
        return { adult: 895, child: 358 };
      case 'executive':
        return { adult: 985, child: 394 };
      case 'value':
      default:
        return { adult: 665, child: 266 };
    }
  })();
  const ADULT_PRICE = pricing.adult;
  const CHILD_PRICE = pricing.child;
  const currentPrice = ((): number => {
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
                      {tierParam === 'value' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>Value Plus Plan</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: R665.00 through R2,195.00</div>
                        </div>
                      )}
                      {tierParam === 'platinum' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>Platinum Plan</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: R895.00 through R3,043.00</div>
                        </div>
                      )}
                      {tierParam === 'executive' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>Executive Plan</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: R985.00 through R3,300.00</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Cover highlights */}
                <motion.div
                  className={`mt-4 rounded-xl border p-4 ${isDark ? 'bg-emerald-900/10 border-emerald-800' : 'bg-white/70 backdrop-blur-md border-gray-200'}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Cover:</div>
                    {displayCoverItems.map((c: string, i: number) => (
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
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <div className="prose max-w-none">
                        <div className="grid md:grid-cols-2 gap-6">
                          {descriptionItems.map((item: { title: string; text: string }, i: number) => (
                            <motion.div 
                              key={item.title}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
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
                          href={compPdfPath}
                          className="hero-cta-xs hero-cta-green hero-cta-fast hero-cta-left"
                          sentText="Downloaded info Plan"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className={`rounded-xl border p-5 ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <h3 className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Additional information</h3>
                      <div>
                        <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Options</div>
                        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {additionalInfoOptions.map((opt: string, i: number) => (
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

                  {/* Related products */}
                  <div className="mt-8">
                    <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Other related products</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                      {/* Single */}
                      <motion.div 
                        className={`relative self-start group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                          isDark 
                            ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                            : 'bg-white border-green-200 hover:border-green-400'
                        } min-h-[140px]`}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true, margin: '-50px' }}
                      >
                        {expanded.single && (
                          <motion.div
                            key="single-bg"
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <img
                              src="/assets/images/single (1).jpg"
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className={`${isDark ? 'bg-black/30' : 'bg-black/20'} absolute inset-0`} />
                          </motion.div>
                        )}
                        <div className="mb-[17px]">
                          <AnimatePresence mode="wait" initial={false}>
                            {expanded.single ? (
                              <motion.div
                                key="hdr-expanded-single"
                                className={`relative z-20 flex items-center justify-between`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  <motion.span
                                    className="inline-flex"
                                    initial="hidden"
                                    animate="show"
                                    variants={{ show: { transition: { staggerChildren: 0.035 } } }}
                                  >
                                    {'Comprehensive'.split('')?.map((ch, i) => (
                                      <motion.span
                                        key={i}
                                        className="inline-block"
                                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                                        transition={{ duration: 0.18 }}
                                      >
                                        {ch === ' ' ? '\u00A0' : ch}
                                      </motion.span>
                                    ))}
                                  </motion.span>
                                </motion.span>
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: 8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  Single
                                </motion.span>
                              </motion.div>
                            ) : (
                              <motion.h3
                                key="hdr-collapsed-single"
                                className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                Single
                              </motion.h3>
                            )}
                          </AnimatePresence>
                        </div>
                        {expanded.single && (
                          <motion.div
                            layoutId="student-price"
                            className={`relative z-10 mb-4 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                            transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <span className="text-2xl font-bold text-emerald-400">{`R${ADULT_PRICE}`}</span>
                            <span className={`text-white text-sm font-normal`}>/month</span>
                          </motion.div>
                        )}
                        <motion.div key="single-content"
                          initial={false}
                          animate={{ height: expanded.single ? 'auto' : 0, opacity: expanded.single ? 1 : 0 }}
                          transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                          aria-hidden={!expanded.single}
                          className="relative z-10"
                        >
                           <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                            <ul className="space-y-3">
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>GP and specialist consultations</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute and chronic medication</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Blood tests and x-rays</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Dentistry and optometry</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefit</span></li>
                            </ul>
                          </div>
                        </motion.div>
                        <div className={(expanded.single ? 'mt-[-3px] ' : 'mt-6 ') + 'relative z-10'}>
                          <AnimatedPaymentButton 
                            text="Choose Plan"
                            className="bronze"
                            hoverMessages={[
                              'GP and specialist consultations',
                              'Acute and chronic medication',
                              'Blood tests and x-rays',
                              'Dentistry and optometry',
                              'Funeral benefit',
                            ]}
                            hoverIcons={['wallet','card','payment','check']}
                            showArrow={false}
                            expanded={expanded.single}
                            onToggleExpand={() => toggleExpanded('single')}
                            to={`/plans/comprehensive?tier=${tierParam}&variant=single`}
                          />
                          <button
                            type="button"
                            aria-label={expanded.single ? 'Collapse Single details' : 'Expand Single details'}
                            className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                              transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                              ${isDark 
                                ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                                : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                              ${expanded.single ? 'rotate-180' : ''}`}
                            onClick={() => toggleExpanded('single')}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                            </svg>
                          </button>
                        </div>
                        {!expanded.single && (
                          <div
                            className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                              isDark ? 'bg-white/10 border-white/15' : 'bg-white/30 border-white/40'
                            }`}
                          >
                            <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Comprehensive</div>
                            <motion.div layoutId="student-price" className={`leading-none text-emerald-400`} transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}>
                              <span className="text-sm align-top mr-1">R</span>
                              <span className="text-2xl font-bold">{ADULT_PRICE}</span>
                              <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                            </motion.div>
                          </div>
                        )}
                      </motion.div>

                      {/* Couple */}
                      <motion.div 
                        className={`relative self-start group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                          isDark 
                            ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                            : 'bg-white border-green-200 hover:border-green-400'
                        } min-h-[140px]`}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true, margin: '-50px' }}
                      >
                        {expanded.couple && (
                          <motion.div
                            key="couple-bg"
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <img
                              src="/assets/images/couple (1).jpg"
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className={`${isDark ? 'bg-black/30' : 'bg-black/20'} absolute inset-0`} />
                          </motion.div>
                        )}
                        <div className="mb-[17px]">
                          <AnimatePresence mode="wait" initial={false}>
                            {expanded.couple ? (
                              <motion.div
                                key="hdr-expanded-couple"
                                className={`relative z-20 flex items-center justify-between`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  <motion.span
                                    className="inline-flex"
                                    initial="hidden"
                                    animate="show"
                                    variants={{ show: { transition: { staggerChildren: 0.035 } } }}
                                  >
                                    {'Comprehensive'.split('')?.map((ch, i) => (
                                      <motion.span
                                        key={i}
                                        className="inline-block"
                                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                                        transition={{ duration: 0.18 }}
                                      >
                                        {ch === ' ' ? '\u00A0' : ch}
                                      </motion.span>
                                    ))}
                                  </motion.span>
                                </motion.span>
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: 8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  Couples
                                </motion.span>
                              </motion.div>
                            ) : (
                              <motion.h3
                                key="hdr-collapsed-couple"
                                className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                Couples
                              </motion.h3>
                            )}
                          </AnimatePresence>
                        </div>
                        {expanded.couple && (
                          <motion.div
                            layoutId="basic-price"
                            className={`relative z-10 mb-4 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                            transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <span className="text-2xl font-bold text-emerald-400">{`R${ADULT_PRICE * 2}`}</span>
                            <span className={`text-white text-sm font-normal`}>/month</span>
                          </motion.div>
                        )}
                        <motion.div key="couple-content"
                          initial={false}
                          animate={{ height: expanded.couple ? 'auto' : 0, opacity: expanded.couple ? 1 : 0 }}
                          transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                          aria-hidden={!expanded.couple}
                          className="relative z-10"
                        >
                          <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                            <ul className="space-y-3">
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>GP and specialist consultations</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute and chronic medication</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Blood tests and x-rays</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Dentistry and optometry</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefit</span></li>
                            </ul>
                          </div>
                        </motion.div>
                        <div className={(expanded.couple ? 'mt-[-3px] ' : 'mt-6 ') + 'relative z-10'}>
                          <AnimatedPaymentButton 
                            text="Choose Plan"
                            className="silver"
                            hoverMessages={[
                              'GP and specialist consultations',
                              'Acute and chronic medication',
                              'Blood tests and x-rays',
                              'Dentistry and optometry',
                              'Funeral benefit',
                            ]}
                            hoverIcons={['wallet','card','payment','check']}
                            showArrow={false}
                            expanded={expanded.couple}
                            onToggleExpand={() => toggleExpanded('couple')}
                            to={`/plans/comprehensive?tier=${tierParam}&variant=couple`}
                          />
                          <button
                            type="button"
                            aria-label={expanded.couple ? 'Collapse Couples details' : 'Expand Couples details'}
                            className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                              transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                              ${isDark 
                                ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                                : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                              ${expanded.couple ? 'rotate-180' : ''}`}
                            onClick={() => toggleExpanded('couple')}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                            </svg>
                          </button>
                        </div>
                        {!expanded.couple && (
                          <div
                            className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
                              isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/90 border-gray-200'
                            }`}
                          >
                            <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>Comprehensive</div>
                            <motion.div layoutId="basic-price" className={`leading-none text-green-600`}>
                              <span className="text-sm align-top mr-1">R</span>
                              <span className="text-2xl font-bold">{ADULT_PRICE * 2}</span>
                              <span className={`ml-1 text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                            </motion.div>
                          </div>
                        )}
                      </motion.div>

                      {/* Family */}
                      <motion.div 
                        className={`relative self-start group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                          isDark 
                            ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                            : 'bg-white border-green-200 hover:border-green-400'
                        } min-h-[140px]`}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true, margin: '-50px' }}
                      >
                        {expanded.family && (
                          <motion.div
                            key="family-bg"
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <img
                              src="/assets/images/family (1).jpg"
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className={`${isDark ? 'bg-black/30' : 'bg-black/20'} absolute inset-0`} />
                          </motion.div>
                        )}
                        <div className="mb-[17px]">
                          <AnimatePresence mode="wait" initial={false}>
                            {expanded.family ? (
                              <motion.div
                                key="hdr-expanded-family"
                                className={`relative z-20 flex items-center justify-between`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  <motion.span
                                    className="inline-flex"
                                    initial="hidden"
                                    animate="show"
                                    variants={{ show: { transition: { staggerChildren: 0.035 } } }}
                                  >
                                    {'Comprehensive'.split('')?.map((ch, i) => (
                                      <motion.span
                                        key={i}
                                        className="inline-block"
                                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                                        transition={{ duration: 0.18 }}
                                      >
                                        {ch === ' ' ? '\u00A0' : ch}
                                      </motion.span>
                                    ))}
                                  </motion.span>
                                </motion.span>
                                <motion.span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                                  initial={{ opacity: 0, x: 8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 8 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  Family
                                </motion.span>
                              </motion.div>
                            ) : (
                              <motion.h3
                                key="hdr-collapsed-family"
                                className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18 }}
                              >
                                Family
                              </motion.h3>
                            )}
                          </AnimatePresence>
                        </div>
                        {expanded.family && (
                          <motion.div
                            layoutId="family-price"
                            className={`relative z-10 mb-4 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                            transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <span className="text-2xl font-bold text-emerald-400">{`R${ADULT_PRICE * adultCount + CHILD_PRICE * childCount}`}</span>
                            <span className={`text-white text-sm font-normal`}>/child</span>
                          </motion.div>
                        )}
                        <motion.div key="family-content"
                          initial={false}
                          animate={{ height: expanded.family ? 'auto' : 0, opacity: expanded.family ? 1 : 0 }}
                          transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                          aria-hidden={!expanded.family}
                          className="relative z-10"
                        >
                          <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                            <ul className="space-y-3">
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>GP and specialist consultations</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute and chronic medication</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Blood tests and x-rays</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Dentistry and optometry</span></li>
                              <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Up to 4 children</span></li>
                            </ul>
                          </div>
                        </motion.div>
                        <div className={(expanded.family ? 'mt-[-3px] ' : 'mt-6 ') + 'relative z-10'}>
                          <AnimatedPaymentButton 
                            text="Choose Plan"
                            className="bronze"
                            hoverMessages={[
                              'GP and specialist consultations',
                              'Acute and chronic medication',
                              'Blood tests and x-rays',
                              'Dentistry and optometry',
                              'Funeral benefit',
                              'Up to 4 children',
                            ]}
                            hoverIcons={['wallet','card','payment','check']}
                            showArrow={false}
                            expanded={expanded.family}
                            onToggleExpand={() => toggleExpanded('family')}
                            to={`/plans/comprehensive?tier=${tierParam}&variant=family&children=${childCount}`}
                          />
                          <button
                            type="button"
                            aria-label={expanded.family ? 'Collapse Family details' : 'Expand Family details'}
                            className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                              transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                              ${isDark 
                                ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                                : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                              ${expanded.family ? 'rotate-180' : ''}`}
                            onClick={() => toggleExpanded('family')}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                            </svg>
                          </button>
                        </div>
                        {!expanded.family && (
                          <div
                            className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
                              isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/90 border-gray-200'
                            }`}
                          >
                            <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>Comprehensive</div>
                            <motion.div layoutId="family-price" className={`leading-none text-green-600`}>
                              <span className="text-sm align-top mr-1">R</span>
                              <span className="text-2xl font-bold">{ADULT_PRICE * adultCount + CHILD_PRICE * childCount}</span>
                              <span className={`ml-1 text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                            </motion.div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
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
                          <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Comprehensive</div>
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
                        <AnimatedContactButton
                          type="button"
                          className="w-full"
                          labelDefault="Sign Up Now"
                          labelSent="Sent"
                          onClick={() => { /* TODO: hook into sign up flow */ }}
                        />
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

export default ComprehensivePlanDetailPage;
