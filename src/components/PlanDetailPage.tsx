import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedContactButton } from './ui/animated-contact-button';
import { RollingNumber } from './ui/rolling-number';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { DownloadHeroButton } from './ui/download-hero-button';
import { hasSupabaseEnv, supabase } from '../admin/supabaseClient';
import { useCmsAssetHref } from '../utils/cmsAssets';

type CmsRow = Record<string, any> & { id: string };

const excludedBenefitTitles = new Set([
  'basic dentistry',
  'dentistry / optometry',
  'optometry (iso leso optics)',
  'chronic medication',
]);

const coverItems = [
  'Private Managed Doctor Visits',
  'Radiology and pathology',
  'Acute Medication',
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
    title: 'Private Managed Doctor Visits',
    text:
      'Consultations available via a registered Day1 Health Network Partner. Limited to 5 doctor visits per member per annum. Pre-authorisation is required. A 1 month waiting period applies.',
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
    title: 'Acute Medication',
    text:
      'Acute medication covered according to the 1Doctor Health formulary. Linked to the 1Doctor consultation dispensed by the 1Doctor Health Network GP or obtained on script from a Network Pharmacy. A 1 month waiting period applies.',
  },
  {
    title: 'Out-of-Area Visits',
    text:
      'In the event that you cannot see your Network GP, the Plan will allow 3 "out of area" visits per family per annum to an alternative Network GP or GP of your choice, subject to pre-authorisation. A 1 month waiting period applies.',
  },
  {
    title: 'Radiology',
    text:
      'Basic radiology according to the 1Doctor Health formulary via a 1Doctor Health network GP. Black and white diagnostic x-rays only. A 1 month waiting period applies.',
  },
  {
    title: 'Funeral Benefit',
    text:
      'Principal, Spouse & Child > 14 years R10,000. Child > 6 years R5,000. Child > 0 years > R2,500. Stillborn > 28 weeks R1,250. A 3 month waiting period applies.',
  },
];

const legalCopy = `Practical Medical Insurance - Providing cover since 2003 Day1 Health (Pty) Ltd is an authorised Financial Services Provider - FSP Number 11319. Day1 Health (Pty) Ltd is duly approved and accredited by the Council for Medical Schemes - CMS Ref: 1074. Powered by Day1 Health - Underwritten by African Unity Life Ltd, a licensed Life Insurer and an authorised Financial Services Provider. FSP No: FSP 8447. Day1 Health offers Medical Insurance plans and is not a Medical Aid product.

Day1 Health complies with the principles of open enrollment, community rating and cross-subsidisation and does not discriminate or refuse membership on the basis of race, age, gender, marital status, ethnic or social origin, sexual orientation, pregnancy, disability, state of health, geographical location or any other means of discrimination.`;

const normalizeDayToDayVariant = (variant: string): 'single' | 'couple' | 'family' => {
  if (variant === 'couple' || variant === 'couples') return 'couple';
  if (variant === 'family') return 'family';
  return 'single';
};

const slugifyCmsValue = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const selectDayToDayCmsPage = (
  pages: CmsRow[],
  variant: 'single' | 'couple' | 'family',
): CmsRow | null => {
  const targetSlug = `day-to-day-${variant}`;

  const rankedPages = pages
    .map((page, index) => {
      const planFamily = String(page.plan_family ?? '').toLowerCase();
      if (planFamily.length > 0 && planFamily !== 'day-to-day') {
        return null;
      }

      const planKey = slugifyCmsValue(page.plan_key);
      const pageHeading = slugifyCmsValue(page.page_heading);
      const heroTitle = slugifyCmsValue(page.hero_title);
      const routePath = String(page.route_path ?? '').toLowerCase();
      let score = -1;

      if (planKey === targetSlug || planKey.includes(`${targetSlug}-`)) score = 120;
      else if (pageHeading === targetSlug || pageHeading.includes(`${targetSlug}-`)) score = 110;
      else if (heroTitle === targetSlug || heroTitle.includes(`${targetSlug}-`)) score = 100;
      else if (routePath.includes('/plans/day-to-day') && routePath.includes(`variant=${variant}`)) score = 90;
      else if (variant === 'single' && (planKey === 'day-to-day' || pageHeading === 'day-to-day')) score = 60;
      else if (variant === 'single' && routePath === '/plans/day-to-day') score = 50;

      if (score < 0) {
        return null;
      }

      const sortOrder =
        typeof page.sort_order === 'number' ? page.sort_order : Number(page.sort_order ?? Number.MAX_SAFE_INTEGER);

      return {
        page,
        score,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : Number.MAX_SAFE_INTEGER,
        index,
      };
    })
    .filter((entry): entry is { page: CmsRow; score: number; sortOrder: number; index: number } => entry !== null)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
      return left.index - right.index;
    });

  return rankedPages[0]?.page ?? null;
};

const ensureVariantInTitle = (title: string, variantDisplay: 'Single' | 'Couple' | 'Family'): string => {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    return `Day-to-Day - ${variantDisplay}`;
  }

  const lowerTitle = normalizedTitle.toLowerCase();
  const hasVariant =
    lowerTitle.includes('single') ||
    lowerTitle.includes('couple') ||
    lowerTitle.includes('family');

  return hasVariant ? normalizedTitle : `${normalizedTitle} - ${variantDisplay}`;
};

const PlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [option, setOption] = useState('');
  const [childCount, setChildCount] = useState(0);
  const [adultCount, setAdultCount] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');
  const [coverCarouselIndex, setCoverCarouselIndex] = useState(0);
  const [cmsPage, setCmsPage] = useState<CmsRow | null>(null);
  const [cmsBenefits, setCmsBenefits] = useState<CmsRow[]>([]);
  const [cmsCoverHighlights, setCmsCoverHighlights] = useState<CmsRow[]>([]);
  const [cmsPriceRows, setCmsPriceRows] = useState<CmsRow[]>([]);
  const [cmsAssets, setCmsAssets] = useState<CmsRow[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const variantParam = (searchParams.get('variant') || 'single').toLowerCase();
  const currentVariant = normalizeDayToDayVariant(variantParam);
  const variantDisplay = currentVariant === 'couple' ? 'Couple' : currentVariant === 'family' ? 'Family' : 'Single';
  const defaultPageTitle = `Day-to-Day - ${variantDisplay}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!hasSupabaseEnv) {
      setCmsPage(null);
      setCmsBenefits([]);
      setCmsCoverHighlights([]);
      setCmsPriceRows([]);
      setCmsAssets([]);
      return;
    }

    let isActive = true;

    const clearCmsState = () => {
      if (!isActive) return;
      setCmsPage(null);
      setCmsBenefits([]);
      setCmsCoverHighlights([]);
      setCmsPriceRows([]);
      setCmsAssets([]);
    };

    const fetchCmsContent = async () => {
      const { data: pageData, error: pageError } = await supabase
        .from('cms_plan_pages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (pageError || !pageData || pageData.length === 0) {
        clearCmsState();
        return;
      }

      const matchedPage = selectDayToDayCmsPage(pageData, currentVariant);
      if (!matchedPage) {
        clearCmsState();
        return;
      }

      const pageId = matchedPage.id;
      const [benefitsResult, highlightsResult, priceRowsResult, assetsResult] = await Promise.all([
        supabase.from('cms_plan_benefits').select('*').eq('page_id', pageId).order('sort_order', { ascending: true }),
        supabase.from('cms_plan_cover_highlights').select('*').eq('page_id', pageId).order('sort_order', { ascending: true }),
        supabase.from('cms_plan_price_rows').select('*').eq('page_id', pageId).order('sort_order', { ascending: true }),
        supabase.from('cms_plan_assets').select('*').eq('page_id', pageId).order('sort_order', { ascending: true }),
      ]);

      if (!isActive) {
        return;
      }

      setCmsPage(matchedPage);
      setCmsBenefits(benefitsResult.data ?? []);
      setCmsCoverHighlights(highlightsResult.data ?? []);
      setCmsPriceRows(priceRowsResult.data ?? []);
      setCmsAssets(assetsResult.data ?? []);
    };

    void fetchCmsContent();

    return () => {
      isActive = false;
    };
  }, [currentVariant]);

  const handleNavigate = (section: string) => {
    const targetSection = section === 'home' ? 'hero' : section;
    sessionStorage.setItem('navigatingToSection', targetSection);
    window.location.href = `/#${targetSection}`;
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setOption(currentVariant);
  }, [currentVariant]);

  useEffect(() => {
    if (currentVariant === 'family') {
      setAdultCount((prev) => (prev >= 1 && prev <= 2 ? prev : 1));
    } else if (currentVariant === 'single') {
      setAdultCount(1);
    } else if (currentVariant === 'couple') {
      setAdultCount(2);
    } else {
      setAdultCount(1);
    }
  }, [currentVariant]);

  useEffect(() => {
    const raw = searchParams.get('children');
    const parsed = raw ? parseInt(raw, 10) : NaN;
    if (currentVariant === 'family') {
      const clamped = Math.max(1, Math.min(4, isNaN(parsed) ? 1 : parsed));
      setChildCount(clamped);
    } else if (currentVariant === 'single') {
      setChildCount(0);
    } else if (currentVariant === 'couple') {
      const clamped = Math.max(0, Math.min(4, isNaN(parsed) ? 0 : parsed));
      setChildCount(clamped);
    } else {
      setChildCount(0);
    }
  }, [currentVariant, searchParams]);

  const SINGLE_PRICES = [440, 660, 880, 1100, 1320];
  const COUPLE_PRICES = [770, 990, 1210, 1430, 1650];
  const ADULT_PRICE = 440;
  const CHILD_PRICE = 220;
  const selectedVariant = (option || currentVariant) as 'single' | 'couple' | 'family';

  const getPriceForVariant = (variant: 'single' | 'couple' | 'family', adults: number, children: number) => {
    const safeChildren = Math.max(0, Math.min(4, children));
    if (variant === 'couple') {
      return COUPLE_PRICES[safeChildren];
    }
    if (variant === 'family') {
      if (adults === 1) return SINGLE_PRICES[safeChildren];
      if (adults === 2) return COUPLE_PRICES[safeChildren];
      return adults * ADULT_PRICE + safeChildren * CHILD_PRICE;
    }
    return SINGLE_PRICES[safeChildren];
  };

  const cmsPriceRow = cmsPriceRows.find((row) => {
    const rowVariant = normalizeDayToDayVariant(String(row.variant_type ?? 'single'));
    const rowAdults = Number(row.adults_count ?? row.adults ?? 1);
    const rowChildren = Number(row.children_count ?? row.children ?? 0);
    return rowVariant === selectedVariant && rowAdults === adultCount && rowChildren === childCount;
  });

  const parsedCmsPrice =
    typeof cmsPriceRow?.price === 'number'
      ? cmsPriceRow.price
      : typeof cmsPriceRow?.price === 'string' && cmsPriceRow.price.trim().length > 0
        ? Number(cmsPriceRow.price)
        : null;

  const currentPrice = Number.isFinite(parsedCmsPrice) ? Number(parsedCmsPrice) : getPriceForVariant(selectedVariant, adultCount, childCount);

  const cmsDisplayCoverItems = cmsCoverHighlights
    .map((row) => (typeof row.highlight_text === 'string' ? row.highlight_text.trim() : ''))
    .filter((item) => {
      if (item.length === 0) return false;
      const normalizedItem = item.toLowerCase();
      return !normalizedItem.includes('dental') && !normalizedItem.includes('optometry') && !normalizedItem.includes('chronic');
    })
    .map((item) => {
      const normalizedItem = item.toLowerCase();
      if (normalizedItem === 'pathology') return 'Radiology and pathology';
      if (normalizedItem === 'acute medication') return 'Acute Medication';
      return item;
    });
  const displayCoverItems = (cmsDisplayCoverItems.length > 0 ? cmsDisplayCoverItems : coverItems).filter(
    (item, index, items) => items.findIndex((entry) => entry.toLowerCase() === item.toLowerCase()) === index,
  );
  if (!displayCoverItems.some((item) => item.toLowerCase() === 'funeral benefit')) {
    displayCoverItems.push('Funeral Benefit');
  }

  const cmsDescriptionItems = cmsBenefits
    .map((row) => ({
      title: typeof row.benefit_title === 'string' ? row.benefit_title.trim() : '',
      text: typeof row.benefit_summary === 'string' ? row.benefit_summary.trim() : '',
    }))
    .filter((item) => item.title.length > 0 && item.text.length > 0)
    .filter((item) => !excludedBenefitTitles.has(item.title.toLowerCase()));
  const displayDescriptionItems = cmsDescriptionItems.length > 0 ? cmsDescriptionItems : descriptionItems;

  useEffect(() => {
    setCoverCarouselIndex((prev) => (prev >= displayCoverItems.length ? 0 : prev));
  }, [displayCoverItems.length]);

  const effectivePageTitle =
    typeof cmsPage?.page_heading === 'string' && cmsPage.page_heading.length > 0
      ? ensureVariantInTitle(cmsPage.page_heading, variantDisplay)
      : defaultPageTitle;
  const effectivePlanLabel =
    typeof cmsPage?.hero_title === 'string' && cmsPage.hero_title.length > 0 ? cmsPage.hero_title : 'Day-to-Day Plan';
  const defaultPriceRange =
    variantDisplay === 'Couple' ? 'R770.00 - R1,650.00' : variantDisplay === 'Family' ? 'R440.00 - R1,650.00' : 'R440.00 - R1,320.00';
  const effectivePriceRange =
    typeof cmsPage?.price_range === 'string' && cmsPage.price_range.length > 0 ? cmsPage.price_range : defaultPriceRange;
  const effectiveLegalCopy =
    typeof cmsPage?.legal_copy === 'string' && cmsPage.legal_copy.length > 0 ? cmsPage.legal_copy : legalCopy;
  const brochureHref = useCmsAssetHref(
    cmsAssets.find((asset) => asset.asset_type === 'brochure') ?? null,
    `/assets/pdf's/Day-To-Day ${variantDisplay} Plan.pdf`,
  );
  const applicationHref = useCmsAssetHref(
    cmsAssets.find((asset) => asset.asset_type === 'application_form') ?? null,
    "/assets/pdf's/Application forms/Day-to-day.pdf",
  );

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
    params.delete('qty');
    setSearchParams(params);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-700 ease-in-out ${isDark ? 'bg-gray-900' : 'bg-gray-50'} ${
        isSidebarCollapsed ? 'lg:ml-24 lg:w-[calc(100%-6rem)]' : 'lg:ml-64 lg:w-[calc(100%-16rem)]'
      }`}
      style={{
        transition: 'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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

        <div className="flex-1 min-w-0">
          <main className="w-full py-8 md:py-12">
            <motion.div
              className="max-w-[90rem] mx-auto px-4 md:px-8 lg:px-12"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            <section className={`${isDark ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900' : 'bg-gradient-to-b from-white via-gray-50 to-gray-50'} border-y ${isDark ? 'border-gray-800' : 'border-gray-200'} py-6 md:py-8 mb-6`}>
              <motion.div
                className="max-w-[90rem] mx-auto px-4 md:px-8 lg:px-12"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <nav aria-label="Breadcrumb" className="mb-3 md:mb-4">
                  <ol className="flex items-center gap-1 text-[13px]">
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNavigate('plans')}
                        className="group relative h-10 w-36 rounded-lg border-[0.5px] border-gray-300 bg-[#F9FAFB] text-center text-base font-semibold text-black shadow-sm transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                        aria-label="Go back to plans"
                      >
                        <div className="absolute left-1 top-[4px] z-10 flex h-8 w-1/4 items-center justify-center rounded-lg bg-green-400 duration-500 group-hover:w-[136px]">
                          <ArrowLeft className="h-5 w-5 text-black" strokeWidth={2} />
                        </div>
                        <p className="translate-x-2">Go Back</p>
                      </button>
                    </li>
                    <li aria-hidden="true" className={`${isDark ? 'text-gray-500' : 'text-gray-400'} px-1`}>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </li>
                    <li>
                      <span className={`${isDark ? 'text-white/90' : 'text-gray-900'} font-medium`}>{effectivePageTitle}</span>
                    </li>
                  </ol>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-emerald-400/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{effectivePageTitle}</h1>
                      <p className={`mt-2 text-base md:text-lg ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>{effectivePlanLabel}</p>
                      <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Price range: {effectivePriceRange}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  className={`mt-4 rounded-xl border p-4 ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/70 backdrop-blur-md border-gray-200'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="md:hidden">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Cover:</div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {coverCarouselIndex + 1} / {displayCoverItems.length}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCoverCarouselIndex((prev) => (prev === 0 ? displayCoverItems.length - 1 : prev - 1))}
                        className={`p-2 rounded-lg ${isDark ? 'text-emerald-300 hover:bg-emerald-500/10' : 'text-emerald-700 hover:bg-emerald-50'}`}
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={coverCarouselIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm border w-full ${isDark ? 'bg-emerald-500/10 border-emerald-200/20 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
                          >
                            <Check className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{displayCoverItems[coverCarouselIndex]}</span>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <button
                        onClick={() => setCoverCarouselIndex((prev) => (prev === displayCoverItems.length - 1 ? 0 : prev + 1))}
                        className={`p-2 rounded-lg ${isDark ? 'text-emerald-300 hover:bg-emerald-500/10' : 'text-emerald-700 hover:bg-emerald-50'}`}
                        aria-label="Next"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-wrap items-center gap-2">
                    <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Cover:</div>
                    {displayCoverItems.map((item, index) => (
                      <motion.span
                        key={item}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 * index }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <Check className="w-3.5 h-3.5" /> {item}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </section>

            <div className="max-w-[90rem] mx-auto px-4 md:px-8 lg:px-12">
              <div className="grid grid-cols-12 gap-6 lg:gap-8">
                <motion.div
                  className="col-span-12 lg:col-span-8 xl:col-span-9"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <motion.button
                      className={`px-4 py-2.5 text-base rounded-lg border transition-colors ${activeTab === 'description' ? (isDark ? 'bg-emerald-600/20 border-emerald-400 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-800') : (isDark ? 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')}`}
                      onClick={() => setActiveTab('description')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Description
                    </motion.button>
                    <motion.button
                      className={`px-4 py-2.5 text-base rounded-lg border transition-colors ${activeTab === 'additional' ? (isDark ? 'bg-emerald-600/20 border-emerald-400 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-800') : (isDark ? 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')}`}
                      onClick={() => setActiveTab('additional')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Additional information
                    </motion.button>
                  </div>

                  {activeTab === 'description' ? (
                    <motion.div
                      className={`rounded-xl border p-6 lg:p-8 ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <div className="prose max-w-none">
                        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                          {displayDescriptionItems.map((item, index) => (
                            <motion.div
                              key={item.title}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.03 * index }}
                              className={`rounded-lg border p-5 lg:p-6 ${isDark ? 'bg-gray-900/50 border-gray-700 hover:border-emerald-500/50' : 'bg-gray-50 border-gray-200 hover:border-emerald-400/50'} transition-colors duration-200`}
                            >
                              <div className={`font-semibold mb-3 text-lg lg:text-xl ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{item.title}</div>
                              <div className={`text-base lg:text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.text}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-8 text-sm lg:text-base opacity-80 whitespace-pre-line leading-relaxed">{effectiveLegalCopy}</div>
                      <div className="mt-4">
                        <DownloadHeroButton
                          href={brochureHref}
                          className="hero-cta-xs hero-cta-green hero-cta-fast hero-cta-left"
                          sentText="Downloaded Plan Details"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className={`rounded-xl border p-6 lg:p-8 ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <h3 className={`text-xl lg:text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Additional information</h3>
                      <div>
                        <div className={`text-base lg:text-lg font-medium mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Options</div>
                        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {additionalInfoOptions.map((item, index) => (
                            <motion.li
                              key={item}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.35, delay: 0.02 * index }}
                              className={`text-base lg:text-lg rounded-lg border px-4 py-3 ${isDark ? 'bg-gray-900/60 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                            >
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <aside className="col-span-12 lg:col-span-4 xl:col-span-3 -mt-4 sm:-mt-6 lg:mt-16" style={{ position: 'relative' }}>
                  <div style={{ position: 'sticky', top: '6rem', zIndex: 10 }}>
                    <motion.div
                      className={`rounded-xl border p-6 lg:p-7 shadow-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Plan</div>
                          <div className={`text-xl lg:text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Day To Day</div>
                        </div>
                        <RollingNumber
                          value={currentPrice}
                          prefix="R"
                          className={`text-xl lg:text-2xl font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}
                          digitClassName={`${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}
                        />
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-5">
                        <div>
                          <label className={isDark ? 'text-gray-200 text-base' : 'text-gray-700 text-base'}>Options</label>
                          <select
                            value={option}
                            onChange={(event) => {
                              const nextVariant = event.target.value;
                              setOption(nextVariant);
                              updateUrl(nextVariant, nextVariant === 'family' ? childCount : undefined);
                            }}
                            className={`mt-2 w-full rounded-lg border px-4 py-3 text-base outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          >
                            <option value="">Choose an option</option>
                            <option value="single">Single</option>
                            <option value="couple">Couple</option>
                            <option value="family">Family</option>
                          </select>
                        </div>

                        {option === 'single' && (
                          <div>
                            <div className="flex items-center justify-between">
                              <label className={isDark ? 'text-gray-200 text-base' : 'text-gray-700 text-base'}>Adults 18+</label>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <div className={`h-10 px-4 rounded-md border flex items-center justify-center text-base ${isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300'}`}>
                                {adultCount}
                              </div>
                            </div>
                          </div>
                        )}

                        {option === 'couple' && (
                          <>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Adults 18+</label>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <div className={`h-8 px-3 rounded-md border flex items-center justify-center text-sm ${isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300'}`}>
                                  {adultCount}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}>Children 0-21</label>
                                <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>0-4</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease children"
                                  onClick={() => {
                                    const nextChildren = Math.max(0, childCount - 1);
                                    setChildCount(nextChildren);
                                    updateUrl('couple', nextChildren);
                                  }}
                                  className={`h-8 w-8 rounded-md border flex items-center justify-center text-sm transition-colors ${isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                                >
                                  -
                                </button>
                                <div className={`h-8 px-3 rounded-md border flex items-center justify-center text-sm ${childCount === 0 ? (isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300') : (isDark ? 'bg-gray-900/60 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-300')}`}>
                                  {childCount}
                                </div>
                                <button
                                  type="button"
                                  aria-label="Increase children"
                                  onClick={() => {
                                    const nextChildren = Math.min(4, childCount + 1);
                                    setChildCount(nextChildren);
                                    updateUrl('couple', nextChildren);
                                  }}
                                  className={`h-8 w-8 rounded-md border flex items-center justify-center text-sm transition-colors ${isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </>
                        )}

                        {option === 'family' && (
                          <>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-base' : 'text-gray-700 text-base'}>Adults 18+</label>
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1-2</span>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease adults"
                                  onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                                  className={`h-10 w-10 rounded-md border flex items-center justify-center text-base transition-colors ${isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                                >
                                  -
                                </button>
                                <div className={`h-10 px-4 rounded-md border flex items-center justify-center text-base ${adultCount === 1 ? (isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300') : (isDark ? 'bg-gray-900/60 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-300')}`}>
                                  {adultCount}
                                </div>
                                <button
                                  type="button"
                                  aria-label="Increase adults"
                                  onClick={() => setAdultCount(Math.min(2, adultCount + 1))}
                                  className={`h-10 w-10 rounded-md border flex items-center justify-center text-base transition-colors ${isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-base' : 'text-gray-700 text-base'}>Children 0-21</label>
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1-4</span>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease children"
                                  onClick={() => {
                                    const nextChildren = Math.max(1, childCount - 1);
                                    setChildCount(nextChildren);
                                    updateUrl('family', nextChildren);
                                  }}
                                  className={`h-10 w-10 rounded-md border flex items-center justify-center text-base transition-colors ${isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                                >
                                  -
                                </button>
                                <div className={`h-10 px-4 rounded-md border flex items-center justify-center text-base ${childCount === 1 ? (isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300') : (isDark ? 'bg-gray-900/60 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-300')}`}>
                                  {childCount}
                                </div>
                                <button
                                  type="button"
                                  aria-label="Increase children"
                                  onClick={() => {
                                    const nextChildren = Math.min(4, childCount + 1);
                                    setChildCount(nextChildren);
                                    updateUrl('family', nextChildren);
                                  }}
                                  className={`h-10 w-10 rounded-md border flex items-center justify-center text-base transition-colors ${isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="mt-5">
                        <a href={applicationHref} download className="block w-full">
                          <AnimatedContactButton
                            type="button"
                            className="w-full"
                            labelDefault="Sign Up Now"
                            labelSent="Downloaded Application"
                          />
                        </a>
                      </div>

                      <div className={`mt-5 text-sm lg:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div>SKU: N/A</div>
                        <div>Category: Normal</div>
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
