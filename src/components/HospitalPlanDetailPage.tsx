import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimatedContactButton } from './ui/animated-contact-button';
import { RollingNumber } from './ui/rolling-number';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { DownloadHeroButton } from './ui/download-hero-button';
import { hasSupabaseEnv, supabase } from '../admin/supabaseClient';
import { useCmsAssetHref } from '../utils/cmsAssets';

type CmsRow = Record<string, any> & { id: string };

const coverItems = [
  'Private Hospital Benefits',
  'Illness',
  'Accident',
  'Ambulance',
];

const hospitalDayCardTitles = new Set(['1st Day in Hospital', '2nd Day in Hospital', '3rd Day in Hospital']);

const splitHospitalDayCardText = (text: string): { amount: string; benefit: string } | null => {
  const parts = text.split(/\s+—\s+/);
  if (parts.length < 2) return null;

  const [left, ...remaining] = parts;
  const right = remaining.join(' — ').trim();
  const leftText = left.trim();

  if (/^up to\b/i.test(leftText)) return { amount: leftText, benefit: right };
  if (/^up to\b/i.test(right)) return { amount: right, benefit: leftText };
  return null;
};

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

const normalizeHospitalVariant = (variant: string): 'single' | 'couple' | 'family' => {
  if (variant === 'couple' || variant === 'couples') return 'couple';
  if (variant === 'family') return 'family';
  return 'single';
};

const normalizeHospitalTier = (tier: string): 'value' | 'platinum' | 'executive' => {
  if (tier === 'platinum') return 'platinum';
  if (tier === 'executive') return 'executive';
  return 'value';
};

const slugifyCmsValue = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const selectHospitalCmsPage = (
  pages: CmsRow[],
  tier: 'value' | 'platinum' | 'executive',
  variant: 'single' | 'couple' | 'family',
): CmsRow | null => {
  const tierPlanKey = `hospital-${tier}`;
  const variantPlanKey = `${tierPlanKey}-${variant}`;

  const rankedPages = pages
    .map((page, index) => {
      const planFamily = String(page.plan_family ?? '').toLowerCase();
      if (planFamily.length > 0 && planFamily !== 'hospital') {
        return null;
      }

      const planKey = slugifyCmsValue(page.plan_key);
      const pageHeading = slugifyCmsValue(page.page_heading);
      const heroTitle = slugifyCmsValue(page.hero_title);
      const tierValue = slugifyCmsValue(page.tier);
      const routePath = String(page.route_path ?? '').toLowerCase();
      let score = -1;

      if (planKey === variantPlanKey || planKey.includes(`${variantPlanKey}-`)) score = 140;
      else if (pageHeading === variantPlanKey || pageHeading.includes(`${variantPlanKey}-`)) score = 130;
      else if (heroTitle === variantPlanKey || heroTitle.includes(`${variantPlanKey}-`)) score = 120;
      else if (
        routePath.includes('/plans/hospital') &&
        routePath.includes(`tier=${tier}`) &&
        routePath.includes(`variant=${variant}`)
      ) {
        score = 110;
      } else if (tierValue === tier && variant === 'single') {
        score = 90;
      } else if (planKey === tierPlanKey && variant === 'single') {
        score = 80;
      } else if (routePath.includes('/plans/hospital') && routePath.includes(`tier=${tier}`) && variant === 'single') {
        score = 70;
      }

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

const HospitalPlanDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [option, setOption] = useState('');
  const [childCount, setChildCount] = useState(1);
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
  const currentVariant = normalizeHospitalVariant(variantParam);
  const variantDisplay = currentVariant === 'couple' ? 'Couple' : currentVariant === 'family' ? 'Family' : 'Single';
  const tierParam = (searchParams.get('tier') || 'value').toLowerCase();
  const currentTier = normalizeHospitalTier(tierParam);
  const tierDisplay = currentTier === 'platinum' ? 'Platinum' : currentTier === 'executive' ? 'Executive' : 'Value';
  const tierKey = currentTier;
  const defaultPageTitle = `Hospital - ${tierDisplay} - ${variantDisplay}`;
  const pageTitle = typeof cmsPage?.page_heading === 'string' && cmsPage.page_heading.length > 0
    ? cmsPage.page_heading
    : defaultPageTitle;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  useEffect(() => {
    if (!hasSupabaseEnv) {
      setCmsPage(null);
      setCmsBenefits([]);
      setCmsCoverHighlights([]);
      setCmsPriceRows([]);
      setCmsAssets([]);
      return;
    }

    const fetchCmsContent = async () => {
      const { data: pageData, error: pageError } = await supabase
        .from('cms_plan_pages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (pageError || !pageData || pageData.length === 0) {
        setCmsPage(null);
        setCmsBenefits([]);
        setCmsCoverHighlights([]);
        setCmsPriceRows([]);
        setCmsAssets([]);
        return;
      }

      const matchedPage = selectHospitalCmsPage(pageData, currentTier, currentVariant);
      if (!matchedPage) {
        setCmsPage(null);
        setCmsBenefits([]);
        setCmsCoverHighlights([]);
        setCmsPriceRows([]);
        setCmsAssets([]);
        return;
      }

      const pageId = matchedPage.id;
      const [benefitsResult, highlightsResult, priceRowsResult, assetsResult] = await Promise.all([
        supabase.from('cms_plan_benefits').select('*').eq('page_id', pageId).order('sort_order', { ascending: true }),
        supabase.from('cms_plan_cover_highlights').select('*').eq('page_id', pageId).order('sort_order', { ascending: true }),
        supabase.from('cms_plan_price_rows').select('*').eq('page_id', pageId).order('sort_order', { ascending: true }),
        supabase.from('cms_plan_assets').select('*').eq('page_id', pageId).order('sort_order', { ascending: true }),
      ]);

      setCmsPage(matchedPage);
      setCmsBenefits(benefitsResult.data ?? []);
      setCmsCoverHighlights(highlightsResult.data ?? []);
      setCmsPriceRows(priceRowsResult.data ?? []);
      setCmsAssets(assetsResult.data ?? []);
    };

    void fetchCmsContent();
  }, [currentTier, currentVariant]);

  // Map tier to the correct Hospital plan PDF
  const hospitalPdfMap: Record<string, string> = {
    value: "Hospital Value Plus Plan.pdf",
    platinum: "Hospital Platinum Plan.pdf",
    executive: "Hospital Executive Plan.pdf",
  };
  const hospitalPdfFile = hospitalPdfMap[tierKey] || 'Day 1 Comparative guide 2025_v2.pdf';
  const defaultPdfPath = `/assets/pdf's/${hospitalPdfFile}`;
  const pdfPath = useCmsAssetHref(
    cmsAssets.find((asset) => asset.asset_type === 'brochure') ?? null,
    defaultPdfPath,
  );
  const applicationHref = useCmsAssetHref(
    cmsAssets.find((asset) => asset.asset_type === 'application_form') ?? null,
    `/assets/pdf's/Application forms/${tierParam === 'platinum' ? 'hospital-platinum' : tierParam === 'executive' ? 'Hospital-Executive' : 'Hospital-ValuePlus'}.pdf`,
  );

  // Build cover badges per tier
  const defaultDisplayCoverItems = ((): string[] => {
    if (tierKey === 'executive') return [...coverItems, 'Illness Top-Up', 'Critical Illness'];
    if (tierKey === 'platinum') return [...coverItems, 'Critical Illness'];
    return coverItems;
  })();
  const displayCoverItems = cmsCoverHighlights.length > 0
    ? cmsCoverHighlights
        .map((row) => (typeof row.highlight_text === 'string' ? row.highlight_text.trim() : ''))
        .filter((item) => item.length > 0)
    : defaultDisplayCoverItems;

  // Tier-aware description items - separated by tier for easier maintenance
  const defaultDescriptionItems: { title: string; text: string }[] = (() => {
    // Hospital Value Plus information cards
    const valuePlusItems: { title: string; text: string }[] = [
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
      { title: 'Accident/Trauma Benefit', text: 'Up to R150,000 per single member and up to R300,000 per family incident. A 1 month waiting period applies. (Exclusion: Sports Injuries)' },
      { title: 'Funeral Benefit', text: 'Principal member R20,000, Spouse & Child > 14 years R 10,000. Child > 6 years R 5,000. Child > 0 years > R 2,500. Stillborn > 28 weeks R1,250. A 3 month waiting period applies. (Benefit only available to Plan members.)' },
      { title: '24 Hour Emergency Services ambulance & Pre-Authorisation', text: '24 Hour emergency services and pre-authorisation provided by Africa-Assist, including 24 hour medical advice and access to unlimited Pay-as-you-Go Virtual Doctor Consultations. Immediate Cover.' },
    ];
    if (tierKey === 'platinum') {
      // Hospital Platinum information cards
      const platinumItems: { title: string; text: string }[] = [
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
        { title: 'Accident/Trauma Benefit', text: 'Up to R150,000 per single member and up to R300,000 per family incident. Immediate cover.' },
        { title: '24 Hour Emergency Services ambulance & Pre-Authorisation', text: '24 Hour emergency services and pre-authorisation provided by Africa-Assist, including 24 hour medical advice and access to unlimited Pay-as-you-Go Virtual Doctor Consultations. Immediate Cover.' },
        { title: 'Funeral Benefit', text: 'Principal member R20,000, Spouse & Child > 14 years R 10,000. Child > 6 years R 5,000. Child > 0 years > R 2,500. Stillborn > 28 weeks R1,250. A 3 month waiting period applies. (Benefit only available to Plan members.)' },
        { title: 'Critical Illness Benefit', text: '1 Incident per family per annum. Critical Illness up to R250,000, however the benefit is limited to R50,000 unless the insured person accedes to a short medical examination (at their own cost) to be arranged by Day1 Health. The underwriter’s decision is final. A 3 month waiting period applies.' },
        { title: 'Accidental Permanent Disability Benefit', text: 'R 250 000 for the Principal Member only. Single event only. Immediate cover.' },
        { title: 'Maternity Benefit', text: 'Covers up to R20,000 for the birth of a child in hospital. 12 month waiting period applies. Benefit only available to plan members (16 years and older).' },
      ];
      return platinumItems;
    }
    if (tierKey === 'executive') {
      // Hospital Executive information cards
      const executiveItems: { title: string; text: string }[] = [
        { title: 'In-hospital Illness Benefit', text: 'Covers up to R10,000 after the first 24 Hours in hospital, up to R10,000 for the second day in hospital, up to R10,000 for the third day in hospital. Thereafter R2,000 per day up to a maximum of 21 days. A 3 month waiting period applies and a 12 month pre-existing conditions exclusion applies.' },
        { title: '1st Day in Hospital', text: 'Not less than 24 hours from time of admission to time of discharge — Up to R10 000.00' },
        { title: '2nd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R10 000.00 payable in units of R 2 500.00' },
        { title: '3rd Day in Hospital', text: 'Payable in units of R2 500.00 for every quarter day (6 hours) — Up to R 10 000.00 payable in units of R 2 500.00' },
        { title: 'Every subsequent day thereafter', text: 'R2 000.00' },
        { title: 'Maximum Benefit payable for 21 day period', text: 'Up To R 66 000.00' },
        { title: 'Illness Top-up', text: 'Up to R25,000 per insured person per year subject to an overall limit of 2 events per family policy per annum. A 3 month waiting period applies' },
        { title: 'Accident/Trauma Benefit', text: 'Up to R 250,000 per single member per incident and up to R 500,000 per family incident. Immediate cover.' },
        { title: 'Critical Illness Benefit', text: '1 Incident per family per annum. Critical Illness up to R250,000, however the benefit is limited to R50,000 unless the insured person accedes to a short medical examination (at their own cost) to be arranged by Day1 Health. The underwriter’s decision is final. A 3 month waiting period applies.' },
        { title: 'Accidental Permanent Disability Benefit', text: 'R 250 000 for the Principal Member only. Single event only. Immediate cover.' },
        { title: '24 Hour Emergency Services ambulance & Pre-Authorisation', text: '24 Hour emergency services and pre-authorisation provided by Africa-Assist, including 24 hour medical advice and access to unlimited Pay-as-you-Go Virtual Doctor Consultations. Immediate Cover.' },
        { title: 'Maternity Benefit', text: 'Covers up to R20,000 for the birth of a child in hospital. 12 month waiting period applies. Benefit only available to plan members (16 years and older).' },
        { title: 'Funeral Benefit', text: 'Principal member & Spouse R 30,000, Child > 14 years R 10 000. Child > 6 years R 5,000. Child > 0 years > R 2,500. Stillborn> 28 weeks R1,250. A 3 month waiting period applies. (Benefit only available to Plan members.)' },
      ];
      return executiveItems;
    }
    return valuePlusItems;
  })();
  const descriptionItems: { title: string; text: string }[] = cmsBenefits.length > 0
    ? cmsBenefits
        .map((row) => ({
          title: typeof row.benefit_title === 'string' ? row.benefit_title : '',
          text: typeof row.benefit_summary === 'string' ? row.benefit_summary : '',
        }))
        .filter((row) => row.title.length > 0 && row.text.length > 0)
    : defaultDescriptionItems;

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
      setChildCount(0); // Single always has 0 children
    } else if (currentVariant === 'couple') {
      const clamped = Math.max(0, Math.min(4, isNaN(parsed) ? 0 : parsed));
      setChildCount(clamped);
    } else {
      setChildCount(0);
    }
  }, [currentVariant, searchParams]);

  // Hospital plan pricing per tier
  // Value Plus: R420 single, R756 couple + R168 per child
  // Platinum: R590 single, R1062 couple + R236 per child
  // Executive: R670 single, R1206 couple + R268 per child
  const getPricing = () => {
    if (tierKey === 'platinum') {
      if (adultCount === 1) return 590 + (CHILD_PRICE_PLATINUM * childCount);
      return 1062 + (CHILD_PRICE_PLATINUM * childCount);
    }
    if (tierKey === 'executive') {
      if (adultCount === 1) return 670 + (CHILD_PRICE_EXECUTIVE * childCount);
      return 1206 + (CHILD_PRICE_EXECUTIVE * childCount);
    }
    // Value Plus
    if (adultCount === 1) return 420 + (CHILD_PRICE_VALUE * childCount);
    return 756 + (CHILD_PRICE_VALUE * childCount);
  };
  
  const CHILD_PRICE_VALUE = 168;
  const CHILD_PRICE_PLATINUM = 236;
  const CHILD_PRICE_EXECUTIVE = 268;
  const selectedVariant = (option || currentVariant) as 'single' | 'couple' | 'family';
  const cmsPriceRow = cmsPriceRows.find((row) => {
    const rowVariant = normalizeHospitalVariant(String(row.variant_type ?? 'single'));
    const rowAdults = Number(row.adults_count ?? row.adults ?? 1);
    const rowChildren = Number(row.children_count ?? row.children ?? 0);
    return rowVariant === selectedVariant && rowAdults === adultCount && rowChildren === childCount;
  });
  const parsedCmsPrice = cmsPriceRow && typeof cmsPriceRow.price === 'number'
    ? cmsPriceRow.price
    : cmsPriceRow && typeof cmsPriceRow.price === 'string' && cmsPriceRow.price.trim().length > 0
      ? Number(cmsPriceRow.price)
      : null;
  const currentPrice = Number.isFinite(parsedCmsPrice)
    ? Number(parsedCmsPrice)
    : getPricing();
  const effectiveLegalCopy = typeof cmsPage?.legal_copy === 'string' && cmsPage.legal_copy.length > 0
    ? cmsPage.legal_copy
    : legalCopy;
  const effectivePriceRange = typeof cmsPage?.price_range === 'string' && cmsPage.price_range.length > 0
    ? cmsPage.price_range
    : currentTier === 'platinum'
      ? 'R590.00 through R2,006.00'
      : currentTier === 'executive'
        ? 'R670.00 through R2,278.00'
        : 'R420.00 through R1,428.00';
  const effectivePlanLabel = typeof cmsPage?.hero_title === 'string' && cmsPage.hero_title.length > 0
    ? cmsPage.hero_title
    : currentTier === 'platinum'
      ? 'Platinum Hospital Plan'
      : currentTier === 'executive'
        ? 'Executive Hospital Plan'
        : 'Value Plus Hospital Plan';

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
      className={`min-h-screen transition-all duration-700 ease-in-out ${isDark ? 'bg-gray-900' : 'bg-gray-50'} ${
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
                className={`max-w-[90rem] mx-auto px-4 md:px-8 lg:px-12`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Breadcrumb */}
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
                      <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{pageTitle}</h1>
                      {tierKey === 'value' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>{effectivePlanLabel}</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: {effectivePriceRange}</div>
                          <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>SKU: N/A · Category: Normal</div>
                        </div>
                      )}
                      {tierKey === 'platinum' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>{effectivePlanLabel}</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: {effectivePriceRange}</div>
                          <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>SKU: N/A · Category: Normal</div>
                        </div>
                      )}
                      {tierKey === 'executive' && (
                        <div className="mt-1">
                          <div className={`${isDark ? 'text-emerald-300' : 'text-emerald-700'} text-sm font-semibold`}>{effectivePlanLabel}</div>
                          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Price range: {effectivePriceRange}</div>
                          <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>SKU: N/A · Category: Normal</div>
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
                  {/* Mobile: Carousel */}
                  <div className="md:hidden">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Cover:</div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {coverCarouselIndex + 1} / {displayCoverItems.length}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCoverCarouselIndex((prev) => prev === 0 ? displayCoverItems.length - 1 : prev - 1)}
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
                        onClick={() => setCoverCarouselIndex((prev) => prev === displayCoverItems.length - 1 ? 0 : prev + 1)}
                        className={`p-2 rounded-lg ${isDark ? 'text-emerald-300 hover:bg-emerald-500/10' : 'text-emerald-700 hover:bg-emerald-50'}`}
                        aria-label="Next"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Desktop: Flex wrap */}
                  <div className="hidden md:flex flex-wrap items-center gap-2">
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
                </motion.div>
              </motion.div>
              </section>

            {/* Main content grid */}
            <div className={`max-w-[90rem] mx-auto px-4 md:px-8 lg:px-12`}>
              <div className="grid grid-cols-12 gap-6 lg:gap-8">
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
                      className={`px-4 py-2.5 text-base rounded-lg border transition-colors ${activeTab === 'description' ? (isDark ? 'bg-emerald-600/20 border-emerald-400 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-800') : (isDark ? 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')}`}
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
                      className={`rounded-xl border p-6 lg:p-8 ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <div className="prose max-w-none">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                          {descriptionItems.map((item, i) => {
                            const hospitalDayCard = hospitalDayCardTitles.has(item.title)
                              ? splitHospitalDayCardText(item.text)
                              : null;

                            return (
                              <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.03 * i }}
                                className={`rounded-2xl border p-5 lg:p-6 ${
                                  isDark
                                    ? 'bg-gray-900/50 border-gray-700 hover:border-emerald-500/50'
                                    : 'bg-white border-gray-200 hover:border-emerald-400/50'
                                } transition-colors duration-200`}
                              >
                                <div className={`font-semibold text-lg lg:text-xl ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                  {item.title}
                                </div>

                                {hospitalDayCard ? (
                                  <>
                                    <div className={`mt-4 rounded-xl px-4 py-3 ${isDark ? 'bg-gray-800' : 'bg-emerald-50/70'}`}>
                                      <div className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                        Amount payable
                                      </div>
                                      <div className={`mt-1 text-lg font-normal leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {hospitalDayCard.amount}
                                      </div>
                                    </div>
                                    <div className={`mt-3 border-t border-dashed pt-3 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                                      <div className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Benefit
                                      </div>
                                      <div className={`mt-1 text-base lg:text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                                        {hospitalDayCard.benefit}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className={`mt-3 text-base lg:text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.text}</div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mt-8 text-sm lg:text-base opacity-80 whitespace-pre-line leading-relaxed">{effectiveLegalCopy}</div>
                      <div className="mt-4">
                        <DownloadHeroButton
                          href={pdfPath}
                          className="hero-cta-xs hero-cta-green hero-cta-fast hero-cta-left"
                          sentText="Downloaded Plan Details"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className={`rounded-xl border p-6 lg:p-8 ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
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
                <aside className="col-span-12 lg:col-span-4 xl:col-span-3 -mt-4 sm:-mt-6 lg:mt-16">
                  <div className="lg:sticky lg:top-24">
                    <motion.div 
                      className={`rounded-xl border p-5 ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Plan</div>
                          <div className={`text-xl lg:text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Hospital</div>
                        </div>
                        <RollingNumber
                          value={currentPrice}
                          prefix="R"
                          className={`text-xl lg:text-2xl font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}
                          digitClassName={`${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4">
                        <div>
                          <label className={isDark ? 'text-gray-200 text-base' : 'text-gray-700 text-base'}>Options</label>
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
                            className={`mt-2 w-full rounded-lg border px-4 py-3 text-base outline-none ${isDark ? 'bg-gray-900/70 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
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
                                <label className={isDark ? 'text-gray-200 text-base' : 'text-gray-700 text-base'}>Adults 18+</label>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <div className={`h-10 px-4 rounded-md border flex items-center justify-center text-base ${
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
                                <label className={isDark ? 'text-gray-200 text-base' : 'text-gray-700 text-base'}>Adults 18+</label>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <div className={`h-10 px-4 rounded-md border flex items-center justify-center text-base ${
                                  isDark ? 'bg-emerald-600/30 text-white border-emerald-400' : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                }`}>
                                  {adultCount}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-base' : 'text-gray-700 text-base'}>Children 0-21</label>
                                <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>0–4</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease children"
                                  onClick={() => { setChildCount(Math.max(0, childCount - 1)); updateUrl('couple', Math.max(0, childCount - 1)); }}
                                  className={`h-10 w-10 rounded-md border flex items-center justify-center text-base transition-colors ${
                                    isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  -
                                </button>
                                <div className={`h-10 px-4 rounded-md border flex items-center justify-center text-base ${
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
                                  className={`h-10 w-10 rounded-md border flex items-center justify-center text-base transition-colors ${
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
                                <label className={isDark ? 'text-gray-200 text-base' : 'text-gray-700 text-base'}>Adults 18+</label>
                                <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1–2</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease adults"
                                  onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                                  className={`h-10 w-10 rounded-md border flex items-center justify-center text-base transition-colors ${
                                    isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  -
                                </button>
                                <div className={`h-10 px-4 rounded-md border flex items-center justify-center text-base ${
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
                                  className={`h-10 w-10 rounded-md border flex items-center justify-center text-base transition-colors ${
                                    isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <label className={isDark ? 'text-gray-200 text-base' : 'text-gray-700 text-base'}>Children 0-21</label>
                                <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1–4</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease children"
                                  onClick={() => { setChildCount(Math.max(1, childCount - 1)); updateUrl('family', Math.max(1, childCount - 1)); }}
                                  className={`h-10 w-10 rounded-md border flex items-center justify-center text-base transition-colors ${
                                    isDark ? 'border-gray-700 text-gray-200 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                  }`}
                                >
                                  -
                                </button>
                                <div className={`h-10 px-4 rounded-md border flex items-center justify-center text-base ${
                                  childCount === 1
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
                        <a
                          href={applicationHref}
                          download
                          className="block w-full"
                        >
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
                        <div>Category: Hospital</div>
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
