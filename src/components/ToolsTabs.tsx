import React, { useState, useEffect } from 'react';
import { Shield, CreditCard, Heart, Users, Check, Phone, Mail, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { AnimatedPaymentButton } from './ui/animated-payment-button';
import { hasSupabaseEnv, supabase } from '../admin/supabaseClient';

// Enhanced Animated background carousel for intro cards
const IntroCarousel: React.FC<{
  images: string[];
  intervalMs?: number;
  overlayClassName?: string;
}> = ({ images, intervalMs = 4200, overlayClassName = 'bg-black/40' }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images, intervalMs]);

  const len = images.length || 1;
  const current = images[index] ?? images[0];
  const prev = images[(index - 1 + len) % len] ?? images[0];
  const dir = index % 2 === 0 ? 1 : -1; // alternate direction for Ken Burns

  return (
    <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0">
      {/* Backdrop: previous image, static underlay */}
      <motion.img
        key={`prev-${prev}-${index}`}
        src={prev}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        initial={false}
        animate={{
          scale: 1.08,
          x: `${-2 * dir}%`,
          filter: 'saturate(1.0) contrast(1.0) brightness(0.96)'
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Morph-reveal: current image revealed via blob-like keyframed clip-path (top-left biased) */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`reveal-${current}-${index}`}
          className="absolute inset-0"
          initial={{
            clipPath:
              'polygon(18% 10%, 38% 12%, 52% 24%, 44% 40%, 28% 42%, 16% 34%, 12% 22%, 14% 14%)'
          }}
          animate={{
            clipPath: [
              'polygon(18% 10%, 38% 12%, 52% 24%, 44% 40%, 28% 42%, 16% 34%, 12% 22%, 14% 14%)',
              'polygon(0% 0%, 50% 8%, 70% 30%, 60% 60%, 35% 65%, 12% 55%, 6% 30%, 8% 10%)',
              'polygon(-30% -30%, 130% -30%, 130% 130%, -30% 130%, -30% -30%, 130% -30%, 130% 130%, -30% 130%)'
            ]
          }}
          exit={{
            clipPath:
              'polygon(-30% -30%, 130% -30%, 130% 130%, -30% 130%, -30% -30%, 130% -30%, 130% 130%, -30% 130%)'
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src={current}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.06, x: `${6 * dir}%`, opacity: 1, filter: 'blur(6px) saturate(1.08) contrast(1.05) brightness(0.98)' }}
            animate={{
              scale: 1.14,
              x: '0%',
              filter: 'blur(0px) saturate(1.08) contrast(1.05) brightness(0.98)'
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Vignettes and edge gradients for text contrast */}
      <div className={`${overlayClassName} absolute inset-0`} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />
    </div>
  );
};

type CmsRow = Record<string, any> & { id: string };

const slugifyCmsValue = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeDayToDayVariant = (variant: string): 'single' | 'couple' | 'family' => {
  if (variant === 'couple' || variant === 'couples') return 'couple';
  if (variant === 'family') return 'family';
  return 'single';
};

const normalizeTier = (tier: string): 'value' | 'platinum' | 'executive' => {
  if (tier === 'platinum') return 'platinum';
  if (tier === 'executive') return 'executive';
  return 'value';
};

const normalizeSeniorVariant = (variant: string): 'single' | 'couple' => {
  if (variant === 'couple' || variant === 'couples') return 'couple';
  return 'single';
};

const getSortOrder = (page: CmsRow): number => {
  const sortOrder = typeof page.sort_order === 'number' ? page.sort_order : Number(page.sort_order ?? Number.MAX_SAFE_INTEGER);
  return Number.isFinite(sortOrder) ? sortOrder : Number.MAX_SAFE_INTEGER;
};

const selectDayToDayCmsPage = (pages: CmsRow[], variant: 'single' | 'couple' | 'family'): CmsRow | null => {
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

      if (score < 0) return null;

      return { page, score, sortOrder: getSortOrder(page), index };
    })
    .filter((entry): entry is { page: CmsRow; score: number; sortOrder: number; index: number } => entry !== null)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
      return left.index - right.index;
    });

  return rankedPages[0]?.page ?? null;
};

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
      else if (routePath.includes('/plans/hospital') && routePath.includes(`tier=${tier}`) && routePath.includes(`variant=${variant}`)) score = 110;
      else if (tierValue === tier && variant === 'single') score = 90;
      else if (planKey === tierPlanKey && variant === 'single') score = 80;
      else if (routePath.includes('/plans/hospital') && routePath.includes(`tier=${tier}`) && variant === 'single') score = 70;

      if (score < 0) return null;

      return { page, score, sortOrder: getSortOrder(page), index };
    })
    .filter((entry): entry is { page: CmsRow; score: number; sortOrder: number; index: number } => entry !== null)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
      return left.index - right.index;
    });

  return rankedPages[0]?.page ?? null;
};

const selectComprehensiveCmsPage = (
  pages: CmsRow[],
  tier: 'value' | 'platinum' | 'executive',
  variant: 'single' | 'couple' | 'family',
): CmsRow | null => {
  const tierPlanKey = `comprehensive-${tier}`;
  const variantPlanKey = `${tierPlanKey}-${variant}`;

  const rankedPages = pages
    .map((page, index) => {
      const planFamily = String(page.plan_family ?? '').toLowerCase();
      if (planFamily.length > 0 && planFamily !== 'comprehensive') {
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
      else if (routePath.includes('/plans/comprehensive') && routePath.includes(`tier=${tier}`) && routePath.includes(`variant=${variant}`)) score = 110;
      else if (tierValue === tier && variant === 'single') score = 90;
      else if (planKey === tierPlanKey && variant === 'single') score = 80;
      else if (routePath.includes('/plans/comprehensive') && routePath.includes(`tier=${tier}`) && variant === 'single') score = 70;

      if (score < 0) return null;

      return { page, score, sortOrder: getSortOrder(page), index };
    })
    .filter((entry): entry is { page: CmsRow; score: number; sortOrder: number; index: number } => entry !== null)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
      return left.index - right.index;
    });

  return rankedPages[0]?.page ?? null;
};

const selectSeniorCmsPage = (
  pages: CmsRow[],
  category: 'day-to-day' | 'comprehensive' | 'hospital',
  variant: 'single' | 'couple',
): CmsRow | null => {
  const categoryPlanKey = `senior-${category}`;
  const variantPlanKey = `${categoryPlanKey}-${variant}`;

  const rankedPages = pages
    .map((page, index) => {
      const planFamily = String(page.plan_family ?? '').toLowerCase();
      if (planFamily.length > 0 && planFamily !== 'senior') {
        return null;
      }

      const planKey = slugifyCmsValue(page.plan_key);
      const pageHeading = slugifyCmsValue(page.page_heading);
      const heroTitle = slugifyCmsValue(page.hero_title);
      const categoryValue = slugifyCmsValue(page.senior_category);
      const routePath = String(page.route_path ?? '').toLowerCase();
      let score = -1;

      if (planKey === variantPlanKey || planKey.includes(`${variantPlanKey}-`)) score = 140;
      else if (pageHeading === variantPlanKey || pageHeading.includes(`${variantPlanKey}-`)) score = 130;
      else if (heroTitle === variantPlanKey || heroTitle.includes(`${variantPlanKey}-`)) score = 120;
      else if (routePath.includes('/plans/senior-plan') && routePath.includes(`category=${category}`) && routePath.includes(`variant=${variant}`)) score = 110;
      else if (categoryValue === category && variant === 'single') score = 90;
      else if (planKey === categoryPlanKey && variant === 'single') score = 80;
      else if (routePath.includes('/plans/senior-plan') && routePath.includes(`category=${category}`) && variant === 'single') score = 70;
      else if (categoryValue === category) score = 65;
      else if (planKey === categoryPlanKey) score = 60;
      else if (routePath.includes('/plans/senior-plan') && routePath.includes(`category=${category}`)) score = 50;

      if (score < 0) return null;

      return { page, score, sortOrder: getSortOrder(page), index };
    })
    .filter((entry): entry is { page: CmsRow; score: number; sortOrder: number; index: number } => entry !== null)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
      return left.index - right.index;
    });

  return rankedPages[0]?.page ?? null;
};

const parseCmsPrice = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const getCmsPriceValue = (
  priceRows: CmsRow[],
  pageId: string | undefined,
  variant: 'single' | 'couple' | 'family',
  adults: number,
  children: number,
): number | null => {
  if (!pageId) return null;

  const matchedRow = priceRows.find((row) => {
    if (String(row.page_id ?? '') !== pageId) return false;
    const rowVariant = normalizeDayToDayVariant(String(row.variant_type ?? 'single'));
    const rowAdults = Number(row.adults_count ?? row.adults ?? 1);
    const rowChildren = Number(row.children_count ?? row.children ?? 0);
    return rowVariant === variant && rowAdults === adults && rowChildren === children;
  });

  return parseCmsPrice(matchedRow?.price);
};

const getSeniorCmsPriceValue = (
  priceRows: CmsRow[],
  pageId: string | undefined,
  variant: 'single' | 'couple',
  adults: number,
): number | null => {
  if (!pageId) return null;

  const matchedRow = priceRows.find((row) => {
    if (String(row.page_id ?? '') !== pageId) return false;
    const rowVariant = normalizeSeniorVariant(String(row.variant_type ?? 'single'));
    const rowAdults = Number(row.adults_count ?? row.adults ?? 1);
    const rowChildren = Number(row.children_count ?? row.children ?? 0);
    return rowVariant === variant && rowAdults === adults && rowChildren === 0;
  });

  return parseCmsPrice(matchedRow?.price);
};

const formatPriceText = (value: number): string => `R${Math.round(value).toLocaleString('en-ZA')}`;

const stripPricePrefix = (priceText: string): string => priceText.replace(/^R\s*/i, '');

const getToolbarLabel = (page: CmsRow | null, fallback: string): string => {
  const pageHeading = typeof page?.page_heading === 'string' ? page.page_heading.trim() : '';
  const heroTitle = typeof page?.hero_title === 'string' ? page.hero_title.trim() : '';
  return pageHeading || heroTitle || fallback;
};

const getCardLabel = (toolbarLabel: string, fallback: string): string => {
  const compactLabel = toolbarLabel.replace(/\s+plan$/i, '').trim();
  return compactLabel || fallback;
};

interface ToolsTabsProps {
  isSidebarCollapsed: boolean;
}

const ToolsTabs: React.FC<ToolsTabsProps> = ({ isSidebarCollapsed }) => {
  const [activeTab, setActiveTab] = useState('daytoday');
  const { isDark } = useTheme();
  // Track expanded state for Day-to-Day pricing cards
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    intro: false,
    family: false,
    basic: false,
    student: false,
  });
  // Reveal pricing cards by default (no need to open intro)
  const [showDayToDayCards, setShowDayToDayCards] = useState(true);
  const [cmsPages, setCmsPages] = useState<CmsRow[]>([]);
  const [cmsPriceRows, setCmsPriceRows] = useState<CmsRow[]>([]);
  const toggleExpanded = (key: 'family' | 'basic' | 'student') =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleIntro = () =>
    setExpanded((prev) => {
      const nextIntro = !prev.intro;
      if (nextIntro) setShowDayToDayCards(true);
      return { ...prev, intro: nextIntro };
    });

  const familyChildren = 1;

  useEffect(() => {
    if (!hasSupabaseEnv) {
      setCmsPages([]);
      setCmsPriceRows([]);
      return;
    }

    let isActive = true;

    const fetchLandingCms = async () => {
      const [pagesResult, priceRowsResult] = await Promise.all([
        supabase.from('cms_plan_pages').select('*').order('sort_order', { ascending: true }),
        supabase.from('cms_plan_price_rows').select('*').order('sort_order', { ascending: true }),
      ]);

      if (!isActive) {
        return;
      }

      setCmsPages(pagesResult.error ? [] : pagesResult.data ?? []);
      setCmsPriceRows(priceRowsResult.error ? [] : priceRowsResult.data ?? []);
    };

    void fetchLandingCms();

    return () => {
      isActive = false;
    };
  }, []);

  const landingDayToDaySinglePage = selectDayToDayCmsPage(cmsPages, 'single');
  const landingDayToDayCouplePage = selectDayToDayCmsPage(cmsPages, 'couple');
  const landingDayToDayFamilyPage = selectDayToDayCmsPage(cmsPages, 'family');
  const landingHospitalValuePage = selectHospitalCmsPage(cmsPages, 'value', 'single');
  const landingHospitalExecutivePage = selectHospitalCmsPage(cmsPages, 'executive', 'single');
  const landingHospitalPlatinumPage = selectHospitalCmsPage(cmsPages, 'platinum', 'single');
  const landingComprehensiveValuePage = selectComprehensiveCmsPage(cmsPages, 'value', 'single');
  const landingComprehensiveExecutivePage = selectComprehensiveCmsPage(cmsPages, 'executive', 'single');
  const landingComprehensivePlatinumPage = selectComprehensiveCmsPage(cmsPages, 'platinum', 'single');
  const landingSeniorDayToDayPage = selectSeniorCmsPage(cmsPages, 'day-to-day', 'single');
  const landingSeniorHospitalPage = selectSeniorCmsPage(cmsPages, 'hospital', 'single');
  const landingSeniorComprehensivePage = selectSeniorCmsPage(cmsPages, 'comprehensive', 'single');

  const landingToolbarLabels = {
    daytoday: getToolbarLabel(landingDayToDaySinglePage, 'Day-To-Day Plan'),
    hospital: getToolbarLabel(landingHospitalValuePage, 'Hospital Plan'),
    comprehensive: getToolbarLabel(landingComprehensiveValuePage, 'Comprehensive Plan'),
    senior: getToolbarLabel(landingSeniorDayToDayPage, 'Senior Plan'),
  };

  const landingCardLabels = {
    daytoday: getCardLabel(landingToolbarLabels.daytoday, 'Day-To-Day'),
    hospital: getCardLabel(landingToolbarLabels.hospital, 'Hospital'),
    comprehensive: getCardLabel(landingToolbarLabels.comprehensive, 'Comprehensive'),
    senior: getCardLabel(landingToolbarLabels.senior, 'Senior'),
  };

  const landingPriceTexts = {
    dayToDaySingle:
      (() => {
        const price = getCmsPriceValue(cmsPriceRows, landingDayToDaySinglePage?.id, 'single', 1, 0);
        return price !== null ? formatPriceText(price) : 'R440';
      })(),
    dayToDayCouple:
      (() => {
        const price = getCmsPriceValue(cmsPriceRows, landingDayToDayCouplePage?.id, 'couple', 2, 0);
        return price !== null ? formatPriceText(price) : 'R792';
      })(),
    dayToDayFamily:
      (() => {
        const familyTotal = getCmsPriceValue(cmsPriceRows, landingDayToDayFamilyPage?.id, 'family', 1, 1);
        const singleTotal = getCmsPriceValue(cmsPriceRows, landingDayToDaySinglePage?.id, 'single', 1, 0);
        const addonPrice = familyTotal !== null && singleTotal !== null ? familyTotal - singleTotal : null;
        return addonPrice !== null && addonPrice > 0 ? formatPriceText(addonPrice) : 'R221';
      })(),
    comprehensiveValue:
      (() => {
        const price = getCmsPriceValue(cmsPriceRows, landingComprehensiveValuePage?.id, 'single', 1, 0);
        return price !== null ? formatPriceText(price) : 'R750';
      })(),
    comprehensiveExecutive:
      (() => {
        const price = getCmsPriceValue(cmsPriceRows, landingComprehensiveExecutivePage?.id, 'single', 1, 0);
        return price !== null ? formatPriceText(price) : 'R1,050';
      })(),
    comprehensivePlatinum:
      (() => {
        const price = getCmsPriceValue(cmsPriceRows, landingComprehensivePlatinumPage?.id, 'single', 1, 0);
        return price !== null ? formatPriceText(price) : 'R980';
      })(),
    hospitalValue:
      (() => {
        const price = getCmsPriceValue(cmsPriceRows, landingHospitalValuePage?.id, 'single', 1, 0);
        return price !== null ? formatPriceText(price) : 'R420';
      })(),
    hospitalExecutive:
      (() => {
        const price = getCmsPriceValue(cmsPriceRows, landingHospitalExecutivePage?.id, 'single', 1, 0);
        return price !== null ? formatPriceText(price) : 'R670';
      })(),
    hospitalPlatinum:
      (() => {
        const price = getCmsPriceValue(cmsPriceRows, landingHospitalPlatinumPage?.id, 'single', 1, 0);
        return price !== null ? formatPriceText(price) : 'R590';
      })(),
    seniorDayToDay:
      (() => {
        const price = getSeniorCmsPriceValue(cmsPriceRows, landingSeniorDayToDayPage?.id, 'single', 1);
        return price !== null ? formatPriceText(price) : 'R480';
      })(),
    seniorHospital:
      (() => {
        const price = getSeniorCmsPriceValue(cmsPriceRows, landingSeniorHospitalPage?.id, 'single', 1);
        return price !== null ? formatPriceText(price) : 'R600';
      })(),
    seniorComprehensive:
      (() => {
        const price = getSeniorCmsPriceValue(cmsPriceRows, landingSeniorComprehensivePage?.id, 'single', 1);
        return price !== null ? formatPriceText(price) : 'R970';
      })(),
  };

  const tabs = [
    { 
      id: 'daytoday', 
      label: 'Day-To-Day Plan',
      cardLabel: landingCardLabels.daytoday,
      icon: Heart,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-200'
    },
    { 
      id: 'hospital', 
      label: 'Hospital Plan',
      cardLabel: landingCardLabels.hospital,
      icon: CreditCard,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-200'
    },
    { 
      id: 'comprehensive', 
      label: 'Comprehensive Plan',
      cardLabel: landingCardLabels.comprehensive,
      icon: Shield,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-200'
    },
    { 
      id: 'senior', 
      label: 'Senior Plan',
      cardLabel: landingCardLabels.senior,
      icon: Users,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-200'
    }
  ];

  const handleTabClick = (tabId: string) => {
    // When changing tabs, ensure any open pricing cards are closed
    setActiveTab(tabId);
    setExpanded({ intro: false, family: false, basic: false, student: false });
  };

  // Defensive: if activeTab changes from anywhere, collapse any open cards
  useEffect(() => {
    // Force complete reset of expanded state
    setExpanded({ intro: false, family: false, basic: false, student: false });
    // Keep cards visible - no flashing
    setShowDayToDayCards(true);
  }, [activeTab]);

  // On mount, do not restore any saved tab; always default to Day-To-Day
  useEffect(() => {
    setActiveTab('daytoday');
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'comprehensive':
        return (
          <LayoutGroup>
            <motion.div className={`w-full max-w-[85vw] ${isSidebarCollapsed ? 'md:max-w-[74rem]' : 'md:max-w-[min(74rem,calc(100vw-14rem-0.5rem))]'} mx-auto px-5 sm:px-6 md:px-2`}>
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-5 items-start overflow-visible">
                {/* Introduction Column (copied from Day-to-Day) */}
                <motion.div 
                  className={`relative rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ring-1 ring-emerald-400/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] ${
                    isDark 
                      ? 'bg-gray-800 border-emerald-700 hover:border-emerald-500' 
                      : 'bg-white border-emerald-200 hover:border-emerald-400'
                  } ${expanded.intro ? 'min-h-[420px] md:min-h-[460px] lg:min-h-[500px]' : 'min-h-[140px]'} `}
                  layout="position"
                  transition={{ 
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
                >
                  {/* Background accent: animated Single/Couple/Family */}
                  <IntroCarousel
                    images={[
                      '/assets/images/single.jpg',
                      '/assets/images/couple.jpg',
                      '/assets/images/family.jpg',
                    ]}
                  />
                  <div
                    className="relative z-10 flex items-start justify-between gap-3 text-white cursor-pointer select-none"
                    onClick={toggleIntro}
                    role="button"
                    aria-label={expanded.intro ? 'Collapse introduction' : 'Expand introduction'}
                  >
                    <div>
                      <motion.span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm mb-2 bg-emerald-500/10 border-emerald-200/30 text-white`}
                        animate={{ scale: [1, 1.05, 1], boxShadow: [
                          '0 0 0px rgba(16,185,129,0.0)',
                          '0 0 18px rgba(16,185,129,0.35)',
                          '0 0 0px rgba(16,185,129,0.0)'
                        ] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        Start here
                      </motion.span>
                      <h3 className={`text-xl font-bold text-white`}>
                        Choose a Comprehensive Plan that fits your life
                      </h3>
                    </div>
                    <motion.button
                      type="button"
                      aria-label={expanded.intro ? 'Collapse introduction' : 'Expand introduction'}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm text-white border-white/30 bg-white/10 hover:bg-white/15`}
                      onClick={(e) => { e.stopPropagation(); toggleIntro(); }}
                      animate={
                        expanded.intro
                          ? { y: 0, rotate: 180 }
                          : { y: [0, -3, 0], rotate: 0 }
                      }
                      transition={
                        expanded.intro
                          ? { duration: 0.2 }
                          : { y: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 0.2 } }
                      }
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </motion.button>
                  </div>
                  {/* Collapsed teaser actions */}
                  {!expanded.intro && (
                    <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2 text-white">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); toggleIntro(); setShowDayToDayCards(true); }}
                      >
                        Open introduction
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: true, family: false, basic: false })); }}
                      >
                        Value Plus
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: false, family: false, basic: true })); }}
                      >
                        Platinum
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: false, family: true, basic: false })); }}
                      >
                        Executive
                      </button>
                    </div>
                  )}
                  <motion.div
                    key="intro-content"
                    initial={false}
                    animate={{ height: expanded.intro ? 'auto' : 0, opacity: expanded.intro ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.intro}
                    className="relative z-10 text-white"
                  >
                    <p className={`mt-2 text-white`}>
                      Practical, affordable healthcare for everyday needs. Choose from our flexible options
                      to cover GP visits, basic medication, and essential health services for you and your family.
                    </p>
                    <ul className="space-y-3 mt-4">
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                        <span className={`text-white`}>GP consultations and virtual care</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                        <span className={`text-white`}>Radiology and pathology.</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                        <span className={`text-white`}>Acute medication</span>
                      </li>
                    </ul>
                    {/* Intro helper */}
                    <div className="mt-5 text-sm text-gray-200">
                      Open the Introduction to reveal the pricing options below. Cards will slide in one by one.
                    </div>
                    {/* Intro actions: reveal and jump */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                        onClick={() => {
                          setShowDayToDayCards(true);
                          setExpanded(prev => ({ ...prev, student: true, family: false, basic: false }));
                        }}
                      >
                        Value Plus
                      </button>
                      <button
                        type="button"
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                        onClick={() => {
                          setShowDayToDayCards(true);
                          setExpanded(prev => ({ ...prev, student: false, family: false, basic: true }));
                        }}
                      >
                        Platinum
                      </button>
                      <button
                        type="button"
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                        onClick={() => {
                          setShowDayToDayCards(true);
                          setExpanded(prev => ({ ...prev, student: false, family: true, basic: false }));
                        }}
                      >
                        Executive
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
                {/* Student Plan (Single) (copied from Day-to-Day) */}
                <motion.div 
                  className={`order-1 relative z-30 group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                    isDark 
                      ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                      : 'bg-white border-green-200 hover:border-green-400'
                  } min-h-[140px] `}
                  layout="position"
                  initial={false}
                  animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
                  style={{ pointerEvents: showDayToDayCards ? 'auto' : 'none' }}
                >
                  {/* Background accent (only when expanded) */}
                  {expanded.student && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0">
                      <img
                        src="/assets/images/single.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                    </div>
                  )}
                  <div className="relative z-10 mb-[17px]">
                    <AnimatePresence mode="wait">
                      {expanded.student ? (
                        <motion.div
                          key={`${activeTab}-hdr-expanded-student-${expanded.student}`}
                          className={`relative z-20 flex flex-col items-start gap-1`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          <motion.span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-base font-bold text-emerald-400`}
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
                          <div className="flex items-baseline gap-2">
                            <motion.span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 8 }}
                              transition={{ duration: 0.18 }}
                            >
                              Value Plus
                            </motion.span>
                            <motion.div
                              className={`inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 w-fit whitespace-nowrap self-start ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.18 }}
                            >
                              <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.comprehensiveValue}</span>
                              <span className={`text-white text-sm font-normal`}>/month</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.h3
                          key={`${activeTab}-hdr-collapsed-student`}
                          className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          Value Plus
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>
                  {expanded.student && null}
                  <motion.div key="student-content"
                    initial={false}
                    animate={{ height: expanded.student ? 'auto' : 0, opacity: expanded.student ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.student}
                    className="relative z-10"
                  >
                    <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                      <ul className="space-y-3">
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Comprehensive</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Private Hospital Benefits / Day to Day Benefits</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Comprehensive primary healthcare benefits and includes</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Illness</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Accident</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Maternity</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Ambulance</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefits</span></li>
                      </ul>
                    </div>
                  </motion.div>
                  <div className={(expanded.student ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                    <div className="relative">
                      <AnimatedPaymentButton 
                        text="Choose Plan"
                        className="bronze"
                        hoverMessages={[
                          'Hospital & Day-to-Day benefits',
                          'Comprehensive primary care',
                          'Illness & accident',
                          'Maternity, ambulance & funeral',
                        ]}
                        hoverIcons={['wallet','card','payment','check']}
                        showArrow={false}
                        expanded={expanded.student}
                        onToggleExpand={() => toggleExpanded('student')}
                        to="/plans/comprehensive?variant=single&tier=value"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={expanded.student ? 'Collapse Value Plus details' : 'Expand Value Plus details'}
                      className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                        transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                        ${isDark 
                          ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                          : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                        ${expanded.student ? 'rotate-180' : ''}`}
                      onClick={() => toggleExpanded('student')}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </button>
                  </div>
                  {/* Hover Badge (collapsed only) */}
                  {!expanded.student && (
                    <div
                      className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                        isDark
                          ? 'bg-white/10 border-white/15'
                          : 'bg-white/30 border-white/40'
                      }`}
                    >
                      <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {tabs.find(t => t.id === activeTab)?.cardLabel}
                      </div>
                      <motion.div layoutId={`${activeTab}-student-price`} className={`leading-none text-green-600`}>
                        <span className="text-sm align-top mr-1">R</span>
                        <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.comprehensiveValue)}</span>
                        <span className={`ml-1 text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
                {/* Family Care (copied from Day-to-Day) */}
                <motion.div 
                  className={`order-3 relative group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                    isDark 
                      ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                      : 'bg-white border-green-200 hover:border-green-400'
                  } min-h-[140px] `}
                  layout="position"
                  initial={false}
                  animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
                >
                  {/* Background accent (only when expanded) */}
                  {expanded.family && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0">
                      <img
                        src="/assets/images/family.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                    </div>
                  )}
                  <div className="relative z-10 mb-[17px]">
                    <AnimatePresence mode="wait">
                      {expanded.family ? (
                        <motion.div
                          key={`${activeTab}-hdr-expanded-family-${expanded.family}`}
                          className={`relative z-20 flex flex-col gap-2`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          <motion.span
                            className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.18 }}
                          >
                            Comprehensive
                          </motion.span>
                          <div className="flex items-baseline gap-2 mt-2">
                            <motion.span
                              className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-base font-semibold text-emerald-300`}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 8 }}
                              transition={{ duration: 0.18 }}
                            >
                              Executive
                            </motion.span>
                            <motion.div
                              className={`inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 w-fit whitespace-nowrap self-start ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.18 }}
                            >
                              <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.comprehensiveExecutive}</span>
                              <span className={`text-white text-sm font-normal`}>/month</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.h3
                          key={`${activeTab}-hdr-collapsed-family`}
                          className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          Executive
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <motion.div key="family-content" className="relative z-10 mt-4"
                    initial={false}
                    animate={{ height: expanded.family ? 'auto' : 0, opacity: expanded.family ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.family}
                  >
                    <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                      <ul className="space-y-3">
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Private Hospital Benefits / Day to Day Benefits</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Comprehensive primary healthcare benefits and includes</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Illness</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Top-up illness</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Critical illness</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Increased accident cover</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Maternity</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Accidental permanent disability</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Ambulance</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefits</span></li>
                      </ul>
                    </div>
                  </motion.div>
                  {/* Children stepper removed for Executive card */}
                  <div className={(expanded.family ? 'mt-[-3px]' : 'mt-8') + ' relative z-10'}>
                    <div className="relative">
                      <AnimatedPaymentButton 
                        text="Choose Plan"
                        className="bronze"
                        hoverMessages={[
                          'Hospital & Day-to-Day benefits',
                          'Illness + top-up illness',
                          'Critical illness',
                          'Increased accident cover',
                        ]}
                        hoverIcons={['wallet','card','payment','check']}
                        showArrow={false}
                        expanded={expanded.family}
                        onToggleExpand={() => toggleExpanded('family')}
                        to="/plans/comprehensive?variant=single&tier=executive"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={expanded.family ? 'Collapse Executive details' : 'Expand Executive details'}
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
                  {/* Hover Badge (collapsed only) */}
                  {!expanded.family && (
                    <div
                      className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                        isDark
                          ? 'bg-white/10 border-white/15'
                          : 'bg-white/30 border-white/40'
                      }`}
                    >
                        <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                          {tabs.find(t => t.id === activeTab)?.cardLabel}
                        </div>
                        <motion.div layoutId="comprehensive-executive-price" className={`leading-none text-green-600`}>
                          <span className="text-sm align-top mr-1">R</span>
                          <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.comprehensiveExecutive)}</span>
                          <span className={`ml-1 text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                        </motion.div>
                    </div>
                  )}
                </motion.div>

                {/* Couple Plan (copied from Day-to-Day) */}
                <motion.div 
                  className={`order-2 relative group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                    isDark 
                      ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                      : 'bg-white border-green-200 hover:border-green-400'
                  } min-h-[140px] `}
                  layout="position"
                  initial={false}
                  animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
                  style={{ pointerEvents: showDayToDayCards ? 'auto' : 'none' }}
                >
                  {/* Background accent (only when expanded) */}
                  {expanded.basic && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0">
                      <img
                        src="/assets/images/couple.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                    </div>
                  )}
                  <div className="relative z-10 mb-[17px]">
                    <AnimatePresence mode="wait">
                      {expanded.basic ? (
                        <motion.div
                          key={`${activeTab}-hdr-expanded-couple-${expanded.basic}`}
                          className={`relative z-20 flex flex-col items-start gap-1`}
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
                          <div className="flex items-baseline gap-2 mt-2">
                            <motion.span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 8 }}
                              transition={{ duration: 0.18 }}
                            >
                              Platinum
                            </motion.span>
                            <motion.div
                              className={`inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 w-fit whitespace-nowrap self-start ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.18 }}
                            >
                              <span className={`text-emerald-400 text-2xl font-bold`}>{landingPriceTexts.comprehensivePlatinum}</span>
                              <span className={`text-white text-sm font-normal`}>/month</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.h3
                          key={`${activeTab}-hdr-collapsed-couple`}
                          className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          Platinum
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <motion.div key="couple-content" className="relative z-10 mt-4"
                    initial={false}
                    animate={{ height: expanded.basic ? 'auto' : 0, opacity: expanded.basic ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.basic}
                  >
                    <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                      <ul className="space-y-3">
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Private Hospital Benefits / Day to Day Benefits –</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Comprehensive primary healthcare benefits and includes</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Illness</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Critical illness</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Accident</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Maternity</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Accidental permanent disability</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Ambulance</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefits</span></li>
                      </ul>
                    </div>
                  </motion.div>
                  <div className={(expanded.basic ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                    <div className="relative">
                      <AnimatedPaymentButton 
                        text="Choose Plan"
                        className="silver"
                        hoverMessages={[
                          'Hospital & Day-to-Day benefits',
                          'Illness & critical illness',
                          'Accident & maternity',
                          'Disability, ambulance & funeral',
                        ]}
                        hoverIcons={['wallet','card','payment','check']}
                        showArrow={false}
                        expanded={expanded.basic}
                        onToggleExpand={() => toggleExpanded('basic')}
                        to="/plans/comprehensive?variant=single&tier=platinum"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={expanded.basic ? 'Collapse Platinum details' : 'Expand Platinum details'}
                      className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                        transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                        ${isDark 
                          ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                          : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                        ${expanded.basic ? 'rotate-180' : ''}`}
                      onClick={() => toggleExpanded('basic')}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </button>
                  </div>
                  {/* Hover Badge (collapsed only) */}
                  {!expanded.basic && (
                    <div
                      className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                        isDark
                          ? 'bg-white/10 border-white/15'
                          : 'bg-white/30 border-white/40'
                      }`}
                    >
                      <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {tabs.find(t => t.id === activeTab)?.cardLabel}
                      </div>
                      <motion.div layoutId="comprehensive-platinum-price" className={`leading-none text-green-600`} transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}>
                        <span className="text-sm align-top mr-1">R</span>
                        <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.comprehensivePlatinum)}</span>
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </LayoutGroup>
        );
      
      case 'daytoday':
        return (
          <LayoutGroup>
            <motion.div className={`w-full max-w-[85vw] ${isSidebarCollapsed ? 'md:max-w-[74rem]' : 'md:max-w-[min(74rem,calc(100vw-14rem-0.5rem))]'} mx-auto px-5 sm:px-6 md:px-2`}>
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-5 items-start overflow-visible">
              {/* Introduction Column */}
              <motion.div 
                className={`min-w-0 relative rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ring-1 ring-emerald-400/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] ${
                  isDark 
                    ? 'bg-gray-800 border-emerald-700 hover:border-emerald-500' 
                    : 'bg-white border-emerald-200 hover:border-emerald-400'
                } ${expanded.intro ? 'min-h-[420px] md:min-h-[460px] lg:min-h-[500px]' : 'min-h-[140px]'} `}
                layout="position"
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{}}
              >
                {/* Background accent: animated Single/Couple/Family */}
                <IntroCarousel
                  images={[
                    '/assets/images/single.jpg',
                    '/assets/images/couple.jpg',
                    '/assets/images/family.jpg',
                  ]}
                />
                <div
                  className="relative z-10 flex items-start justify-between gap-3 text-white cursor-pointer select-none"
                  onClick={toggleIntro}
                  role="button"
                  aria-label={expanded.intro ? 'Collapse introduction' : 'Expand introduction'}
                >
                  <div>
                    <motion.span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm mb-2 bg-emerald-500/10 border-emerald-200/30 text-white`}
                      animate={{ scale: [1, 1.05, 1], boxShadow: [
                        '0 0 0px rgba(16,185,129,0.0)',
                        '0 0 18px rgba(16,185,129,0.35)',
                        '0 0 0px rgba(16,185,129,0.0)'
                      ] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      Start here
                    </motion.span>
                    <h3 className={`text-xl font-bold text-white`}>
                      Choose a Day-To-Day plan that fits your life
                    </h3>
                  </div>
                  <motion.button
                    type="button"
                    aria-label={expanded.intro ? 'Collapse introduction' : 'Expand introduction'}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm text-white border-white/30 bg-white/10 hover:bg-white/15`}
                    onClick={(e) => { e.stopPropagation(); toggleIntro(); }}
                    animate={
                      expanded.intro
                        ? { y: 0, rotate: 180 }
                        : { y: [0, -3, 0], rotate: 0 }
                    }
                    transition={
                      expanded.intro
                        ? { duration: 0.2 }
                        : { y: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 0.2 } }
                    }
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                    </svg>
                  </motion.button>
                </div>
                {/* Collapsed teaser actions */}
                {!expanded.intro && (
                  <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2 text-white">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                      onClick={(e) => { e.stopPropagation(); toggleIntro(); setShowDayToDayCards(true); }}
                    >
                      Open introduction
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                      onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: true, family: false, basic: false })); }}
                    >
                      Single
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                      onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: false, family: false, basic: true })); }}
                    >
                      Couple
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                      onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: false, family: true, basic: false })); }}
                    >
                      Family
                    </button>
                  </div>
                )}
                <motion.div
                  key="intro-content"
                  initial={false}
                  animate={{ height: expanded.intro ? 'auto' : 0, opacity: expanded.intro ? 1 : 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                  aria-hidden={!expanded.intro}
                  className="relative z-10 text-white"
                >
                  <p className={`mt-2 text-white`}>
                    Practical, affordable healthcare for everyday needs. Choose from our flexible options
                    to cover GP visits, basic medication, and essential health services for you and your family.
                  </p>
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                      <span className={`text-white`}>GP consultations and virtual care</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                      <span className={`text-white`}>Radiology and pathology.</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                      <span className={`text-white`}>Acute medication</span>
                    </li>
                  </ul>
                  {/* Intro helper */}
                  <div className="mt-5 text-sm text-gray-200">
                    Open the Introduction to reveal the pricing options below. Cards will slide in one by one.
                  </div>
                  {/* Intro actions: reveal and jump */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    
                    <button
                      type="button"
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                      onClick={() => {
                        setShowDayToDayCards(true);
                        setExpanded(prev => ({ ...prev, student: true, family: false, basic: false }));
                      }}
                    >
                      Single
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                      onClick={() => {
                        setShowDayToDayCards(true);
                        setExpanded(prev => ({ ...prev, student: false, family: false, basic: true }));
                      }}
                    >
                      Couple
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                      onClick={() => {
                        setShowDayToDayCards(true);
                        setExpanded(prev => ({ ...prev, student: false, family: true, basic: false }));
                      }}
                    >
                      Family
                    </button>
                  </div>
                  <div className={`mt-3 text-xs text-gray-200`}>
                    Cancel anytime • No hidden fees
                  </div>
                </motion.div>
              </motion.div>

              {/* Family Care */}
              <motion.div 
                className={`min-w-0 order-3 relative group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                } min-h-[140px] `}
                layout="position"
                initial={false}
                animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{}}
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
                      src="/assets/images/family.jpg"
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                  </motion.div>
                )}
                <div className="relative z-10 mb-[17px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {expanded.family ? (
                      <motion.div
                        key="hdr-expanded-family"
                        className={`relative z-20 flex flex-col gap-2`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.span
                            className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.18 }}
                          >
                            <motion.span
                              className="inline-flex"
                              initial="hidden"
                              animate="show"
                              variants={{ show: { transition: { staggerChildren: 0.03 } } }}
                            >
                              {'Day-to-Day'.split('').map((ch, i) => (
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
                            className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-base font-semibold text-emerald-300`}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.18 }}
                          >
                            Family
                          </motion.span>
                        </div>
                        <motion.div
                          className={`inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 w-fit whitespace-nowrap self-start ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                        >
                          <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.dayToDayFamily}</span>
                          <span className={`text-white text-sm font-normal`}>
                            /mo per child
                          </span>
                        </motion.div>
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
                {expanded.family && null}
                <motion.div key="family-content"
                  initial={false}
                  animate={{ height: expanded.family ? 'auto' : 0, opacity: expanded.family ? 1 : 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                  aria-hidden={!expanded.family}
                >
                  <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm px-4 pt-4 pb-2 mb-0`}>
                    <ul className="space-y-3">
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>GP and specialist consultations</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute medication</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Radiology and pathology.</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefit</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Up to 4 children</span></li>
                    </ul>
                  </div>
                </motion.div>
                <div className={(expanded.family ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                  <div className="relative">
                    <AnimatedPaymentButton 
                      text="Choose Plan"
                      className="bronze"
                      hoverMessages={[
                        'GP consultations & virtual care',
                        'Radiology and pathology.',
                        'Acute medication',
                      ]}
                      hoverIcons={['wallet','card','payment','check']}
                      showArrow={false}
                      expanded={expanded.family}
                      onToggleExpand={() => toggleExpanded('family')}
                      to={`/plans/day-to-day?variant=family&children=${familyChildren}`}
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={expanded.family ? 'Collapse Family Care details' : 'Expand Family Care details'}
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
                {/* Hover Badge (collapsed only) */}
                {!expanded.family && (
                  <div
                    className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                      isDark
                        ? 'bg-white/10 border-white/15'
                        : 'bg-white/30 border-white/40'
                    }`}
                  >
                      <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {tabs.find(t => t.id === activeTab)?.cardLabel}
                      </div>
                      <motion.div layoutId={`${activeTab}-family-price`} className={`leading-none text-green-600`}>
                        <span className="text-sm align-top mr-1">R</span>
                        <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.dayToDayFamily)}</span>
                        <span className={`ml-1 text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                      </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Couple Plan */}
              <motion.div 
                className={`min-w-0 order-2 relative group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                } min-h-[140px] `}
                layout="position"
                initial={false}
                animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{}}
                style={{ pointerEvents: showDayToDayCards ? 'auto' : 'none' }}
              >
                {expanded.basic && (
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
                      src="/assets/images/couple.jpg"
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                  </motion.div>
                )}
                <div className="mb-[17px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {expanded.basic ? (
                      <motion.div
                        key="hdr-expanded-couple"
                        className={`relative z-20 flex flex-col gap-2`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.span
                            className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
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
                              {'Day-to-Day'.split('')?.map((ch, i) => (
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
                            className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-base font-semibold text-emerald-300`}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.18 }}
                          >
                            Couple
                          </motion.span>
                        </div>
                        <motion.div
                          className={`inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 w-fit whitespace-nowrap self-start ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                        >
                          <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.dayToDayCouple}</span>
                          <span className={`text-white text-sm font-normal`}>/month</span>
                        </motion.div>
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
                        Couple
                      </motion.h3>
                    )}
                  </AnimatePresence>
                </div>
                {expanded.basic && null}
                <motion.div key="couple-content"
                  initial={false}
                  animate={{ height: expanded.basic ? 'auto' : 0, opacity: expanded.basic ? 1 : 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                  aria-hidden={!expanded.basic}
                >
                  <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                    <ul className="space-y-3">
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>GP and specialist consultations</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute medication</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Radiology and pathology.</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefit</span></li>
                    </ul>
                  </div>
                </motion.div>
                <div className={(expanded.basic ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                  <div className="relative">
                    <AnimatedPaymentButton 
                      text="Choose Plan"
                      className="silver"
                      hoverMessages={[
                        'GP consultations & virtual care',
                        'Radiology and pathology.',
                        'Acute medication',
                      ]}
                      hoverIcons={['wallet','card','payment','check']}
                      showArrow={false}
                      expanded={expanded.basic}
                      onToggleExpand={() => toggleExpanded('basic')}
                      to="/plans/day-to-day?variant=couple"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={expanded.basic ? 'Collapse Couple Care details' : 'Expand Couple Care details'}
                    className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                      transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                      ${isDark 
                        ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                        : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                      ${expanded.basic ? 'rotate-180' : ''}`}
                    onClick={() => toggleExpanded('basic')}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                    </svg>
                  </button>
                </div>
                {/* Hover Badge (collapsed only) */}
                {!expanded.basic && (
                  <div
                    className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                      isDark
                        ? 'bg-white/10 border-white/15'
                        : 'bg-white/30 border-white/40'
                    }`}
                  >
                    <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                      {tabs.find(t => t.id === activeTab)?.cardLabel}
                    </div>
                    <motion.div layoutId={`${activeTab}-basic-price`} className={`leading-none text-green-600`} transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}>
                      <span className="text-sm align-top mr-1">R</span>
                      <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.dayToDayCouple)}</span>
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Student Plan (Single) */}
              <motion.div 
                className={`order-1 relative z-30 group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                  isDark 
                    ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                    : 'bg-white border-green-200 hover:border-green-400'
                } min-h-[140px] `}
                layout="position"
                initial={false}
                animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{}}
                style={{ pointerEvents: showDayToDayCards ? 'auto' : 'none' }}
              >
                {expanded.student && (
                  <motion.div
                    key="student-bg"
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                  >
                    <img
                      src="/assets/images/single.jpg"
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                  </motion.div>
                )}
                <div className="mb-[17px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {expanded.student ? (
                      <motion.div
                        key="hdr-expanded-student"
                        className={`relative z-20 flex flex-col items-start gap-1`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-center gap-2">
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
                                {'Day-to-Day'.split('')?.map((ch, i) => (
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
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }}
                              transition={{ duration: 0.18 }}
                            >
                              Single
                            </motion.span>
                          </div>
                          <motion.div
                            layoutId="student-price"
                            className={`inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 w-fit whitespace-nowrap self-start ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                            transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.dayToDaySingle}</span>
                            <span className={`text-white text-sm font-normal`}>/month</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.h3
                        key="hdr-collapsed-student"
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
                {/* Price shown in header for Single card when expanded */}
                <motion.div key="student-content"
                  initial={false}
                  animate={{ height: expanded.student ? 'auto' : 0, opacity: expanded.student ? 1 : 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                  aria-hidden={!expanded.student}
                  className="relative z-10"
                >
                  <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                    <ul className="space-y-3">
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>GP and specialist consultations</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Acute medication</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Radiology and pathology.</span></li>
                      <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefit</span></li>
                    </ul>
                  </div>
                </motion.div>
                <div className={(expanded.student ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                  <div className="relative">
                    <AnimatedPaymentButton 
                      text="Choose Plan"
                      className="bronze"
                      hoverMessages={[
                        'GP consultations & virtual care',
                        'Radiology and pathology.',
                        'Acute medication',
                      ]}
                      hoverIcons={['wallet','card','payment','check']}
                      showArrow={false}
                      expanded={expanded.student}
                      onToggleExpand={() => toggleExpanded('student')}
                      to="/plans/day-to-day?variant=single"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={expanded.student ? 'Collapse Student Care details' : 'Expand Student Care details'}
                    className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                      transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                      ${isDark 
                        ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                        : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                      ${expanded.student ? 'rotate-180' : ''}`}
                    onClick={() => toggleExpanded('student')}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                    </svg>
                  </button>
                </div>
                {/* Hover Badge (collapsed only) */}
                {!expanded.student && (
                  <div
                    className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                      isDark
                        ? 'bg-white/10 border-white/15'
                        : 'bg-white/30 border-white/40'
                    }`}
                  >
                    <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                      {tabs.find(t => t.id === activeTab)?.cardLabel}
                    </div>
                    <motion.div layoutId="student-price" className={`leading-none text-green-600`} transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}>
                      <span className="text-sm align-top mr-1">R</span>
                      <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.dayToDaySingle)}</span>
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </LayoutGroup>
      );
    
      case 'hospital':
        return (
          <LayoutGroup>
            <motion.div className={`w-full max-w-[85vw] ${isSidebarCollapsed ? 'md:max-w-[74rem]' : 'md:max-w-[min(74rem,calc(100vw-14rem-0.5rem))]'} mx-auto px-4 md:px-2`}>
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-[1.02fr_repeat(3,1fr)] gap-6 md:gap-5 items-start overflow-visible">
                {/* Introduction Column (same as Comprehensive) */}
                <motion.div 
                  className={`relative rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ring-1 ring-emerald-400/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] ${
                    isDark 
                      ? 'bg-gray-800 border-emerald-700 hover:border-emerald-500' 
                      : 'bg-white border-emerald-200 hover:border-emerald-400'
                  } ${expanded.intro ? 'min-h-[420px]' : 'min-h-[140px]'} `}
                  layout="position"
                  transition={{ 
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
                >
                  {/* Background accent: animated Single/Couple/Family */}
                  <IntroCarousel
                    images={[
                      '/assets/images/single.jpg',
                      '/assets/images/couple.jpg',
                      '/assets/images/family.jpg',
                    ]}
                  />
                  <div
                    className="relative z-10 flex items-start justify-between gap-3 text-white cursor-pointer select-none"
                    onClick={toggleIntro}
                    role="button"
                    aria-label={expanded.intro ? 'Collapse introduction' : 'Expand introduction'}
                  >
                    <div>
                      <motion.span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm mb-2 bg-emerald-500/10 border-emerald-200/30 text-white`}
                        animate={{ scale: [1, 1.05, 1], boxShadow: [
                          '0 0 0px rgba(16,185,129,0.0)',
                          '0 0 18px rgba(16,185,129,0.35)',
                          '0 0 0px rgba(16,185,129,0.0)'
                        ] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        Start here
                      </motion.span>
                      <h3 className={`text-xl font-bold text-white`}>
                        Choose a Hospital Plan that fits your life
                      </h3>
                    </div>
                    <motion.button
                      type="button"
                      aria-label={expanded.intro ? 'Collapse introduction' : 'Expand introduction'}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm text-white border-white/30 bg-white/10 hover:bg-white/15`}
                      onClick={(e) => { e.stopPropagation(); toggleIntro(); }}
                      animate={
                        expanded.intro
                          ? { y: 0, rotate: 180 }
                          : { y: [0, -3, 0], rotate: 0 }
                      }
                      transition={
                        expanded.intro
                          ? { duration: 0.2 }
                          : { y: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 0.2 } }
                      }
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </motion.button>
                  </div>
                  {/* Collapsed teaser actions (match Day-To-Day style; Hospital uses tiers) */}
                  {!expanded.intro && (
                    <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2 text-white">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); toggleIntro(); setShowDayToDayCards(true); }}
                      >
                        Open introduction
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: true, family: false, basic: false })); }}
                      >
                        Value
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: false, family: false, basic: true })); }}
                      >
                        Platinum
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: false, family: true, basic: false })); }}
                      >
                        Executive
                      </button>
                    </div>
                  )}
                  <motion.div
                    key="intro-content"
                    initial={false}
                    animate={{ height: expanded.intro ? 'auto' : 0, opacity: expanded.intro ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.intro}
                    className="relative z-10 text-white"
                  >
                    <p className={`mt-2 text-white`}>
                      Practical, affordable healthcare for everyday needs. Choose from our flexible options
                      to cover GP visits, basic medication, and essential health services for you and your family.
                    </p>
                    <ul className="space-y-3 mt-4">
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                        <span className={`text-white`}>GP consultations and virtual care</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                        <span className={`text-white`}>Radiology and pathology.</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                        <span className={`text-white`}>Acute medication</span>
                      </li>
                    </ul>
                    {/* Intro helper */}
                    <div className="mt-5 text-sm text-gray-200">
                      Open the Introduction to reveal the pricing options below. Cards will slide in one by one.
                    </div>
                    {/* Intro actions: reveal and jump */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      
                      <button
                        type="button"
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                        onClick={() => {
                          setShowDayToDayCards(true);
                          setExpanded(prev => ({ ...prev, student: true, family: false, basic: false }));
                        }}
                      >
                        Value
                      </button>
                      <button
                        type="button"
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                        onClick={() => {
                          setShowDayToDayCards(true);
                          setExpanded(prev => ({ ...prev, student: false, family: false, basic: true }));
                        }}
                      >
                        Platinum
                      </button>
                      <button
                        type="button"
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                        onClick={() => {
                          setShowDayToDayCards(true);
                          setExpanded(prev => ({ ...prev, student: false, family: true, basic: false }));
                        }}
                      >
                        Executive
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
                {/* Student Plan (Single) (same as Comprehensive) */}
                <motion.div 
                  className={`order-1 relative z-30 group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                    isDark 
                      ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                      : 'bg-white border-green-200 hover:border-green-400'
                  } min-h-[140px] `}
                  layout="position"
                  initial={false}
                  animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
                  style={{ pointerEvents: showDayToDayCards ? 'auto' : 'none' }}
                >
                  {expanded.student && (
                    <motion.div
                      key="student-bg"
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                    >
                      <img
                        src="/assets/images/single.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                    </motion.div>
                  )}
                  <div className="relative z-10 mb-[17px]">
                    <AnimatePresence mode="wait">
                      {expanded.student ? (
                        <motion.div
                          key={`${activeTab}-hdr-expanded-student-${expanded.student}`}
                          className={`relative z-20 flex flex-col items-start gap-1`}
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
                              {'Hospital'.split('')?.map((ch, i) => (
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
                          <div className="flex items-baseline gap-2">
                            <motion.span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 8 }}
                              transition={{ duration: 0.18 }}
                            >
                              Value
                            </motion.span>
                            <motion.div
                              layoutId="hospital-value-price"
                              className={`relative z-30 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                              transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                            >
                              <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.hospitalValue}</span>
                              <span className={`text-white text-sm font-normal`}>/month</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.h3
                          key={`${activeTab}-hdr-collapsed-student`}
                          className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          Value
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>
                  {expanded.student && null}
                  <motion.div key="student-content"
                    initial={false}
                    animate={{ height: expanded.student ? 'auto' : 0, opacity: expanded.student ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.student}
                    className="relative z-10"
                  >
                    <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                      <ul className="space-y-3">
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Private Hospital Benefits</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Illness & accident cover</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Ambulance services</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Funeral benefits</span></li>
                      </ul>
                    </div>
                  </motion.div>
                  <div className={(expanded.student ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                    <div className="relative">
                      <AnimatedPaymentButton 
                        text="Choose Plan"
                        className="bronze"
                        hoverMessages={[
                          'Private Hospital Benefits',
                          'Illness & accident',
                          'Ambulance',
                          'Funeral benefits',
                        ]}
                        hoverIcons={['wallet','card','payment','check']}
                        showArrow={false}
                        expanded={expanded.student}
                        onToggleExpand={() => toggleExpanded('student')}
                        to="/plans/hospital?tier=Value&variant=single"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={expanded.student ? 'Collapse Student Care details' : 'Expand Student Care details'}
                      className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                        transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                        ${isDark 
                          ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                          : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                        ${expanded.student ? 'rotate-180' : ''}`}
                      onClick={() => toggleExpanded('student')}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </button>
                  </div>
                  {/* Hover Badge (collapsed only) */}
                  {!expanded.student && (
                    <div
                      className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                        isDark
                          ? 'bg-white/10 border-white/15'
                          : 'bg-white/30 border-white/40'
                      }`}
                    >
                      <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {tabs.find(t => t.id === activeTab)?.cardLabel}
                      </div>
                      <motion.div layoutId="student-price" className={`leading-none text-green-600`} transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}>
                        <span className="text-sm align-top mr-1">R</span>
                        <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.hospitalValue)}</span>
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                      </motion.div>
                    </div>
                  )}
                </motion.div>

                {/* Family Care (same as Comprehensive) */}
                <motion.div 
                  className={`order-3 relative group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                    isDark 
                      ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                      : 'bg-white border-green-200 hover:border-green-400'
                  } min-h-[140px] `}
                  layout="position"
                  initial={false}
                  animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
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
                        src="/assets/images/family.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                    </motion.div>
                  )}
                  <div className="relative z-10 mb-[17px]">
                    <AnimatePresence mode="wait">
                      {expanded.family ? (
                        <motion.div
                          key={`${activeTab}-hdr-expanded-family-${expanded.family}`}
                          className={`relative z-20 flex flex-col items-start gap-1`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          {/* Main category badge */}
                          <div className="flex items-baseline gap-2">
                            <motion.span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.18 }}
                            >
                              Hospital
                            </motion.span>
                          </div>
                          {/* Tier badge */}
                          <div className="flex items-baseline gap-2">
                            <motion.span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 8 }}
                              transition={{ duration: 0.18 }}
                            >
                              Executive
                            </motion.span>
                            <motion.div
                              layoutId="hospital-executive-price"
                              className={`relative z-30 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                              transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                            >
                              <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.hospitalExecutive}</span>
                              <span className={`text-white text-sm font-normal`}>/month</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.h3
                          key={`${activeTab}-hdr-collapsed-family`}
                          className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          Executive
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.div key="family-content"
                    initial={false}
                    animate={{ height: expanded.family ? 'auto' : 0, opacity: expanded.family ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.family}
                  >
                    <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                      <ul className="space-y-3">
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Private Hospital Benefits</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Illness cover and Illness Top-up</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Critical illness</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Increased accident cover</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Maternity</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Accidental permanent disability</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Ambulance and funeral benefits</span></li>
                      </ul>
                    </div>
                  </motion.div>
                  <div className={(expanded.family ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                    <div className="relative">
                      <AnimatedPaymentButton 
                        text="Choose Plan"
                        className="bronze"
                        hoverMessages={[
                          'Private Hospital Benefits',
                          'Illness Top-up',
                          'Critical illness',
                          'Increased accident cover',
                        ]}
                        hoverIcons={['wallet','card','payment','check']}
                        showArrow={false}
                        expanded={expanded.family}
                        onToggleExpand={() => toggleExpanded('family')}
                        to="/plans/hospital?tier=Executive&variant=single"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={expanded.family ? 'Collapse Family Care details' : 'Expand Family Care details'}
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
                  {/* Hover Badge (collapsed only) */}
                  {!expanded.family && (
                    <div
                      className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                        isDark
                          ? 'bg-white/10 border-white/15'
                          : 'bg-white/30 border-white/40'
                      }`}
                    >
                        <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                          {tabs.find(t => t.id === activeTab)?.cardLabel}
                        </div>
                        <motion.div layoutId="family-price" className={`leading-none text-green-600`}>
                          <span className="text-sm align-top mr-1">R</span>
                        <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.hospitalExecutive)}</span>
                          <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                        </motion.div>
                    </div>
                  )}
                </motion.div>

                {/* Couple Plan (same as Comprehensive) */}
                <motion.div 
                  className={`order-2 relative group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                    isDark 
                      ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                      : 'bg-white border-green-200 hover:border-green-400'
                  } min-h-[140px] `}
                  layout="position"
                  initial={false}
                  animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
                  style={{ pointerEvents: showDayToDayCards ? 'auto' : 'none' }}
                >
                  {expanded.basic && (
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
                        src="/assets/images/couple.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                    </motion.div>
                  )}
                  <div className="relative z-10 mb-[17px]">
                    <AnimatePresence mode="wait">
                      {expanded.basic ? (
                        <motion.div
                          key={`${activeTab}-hdr-expanded-couple-${expanded.basic}`}
                          className={`relative z-20 flex flex-col items-start gap-1`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          {/* Main category badge */}
                          <motion.span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.18 }}
                          >
                            Hospital
                          </motion.span>
                          {/* Tier badge */}
                          <div className="flex items-baseline gap-2">
                            <motion.span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-lg font-bold text-emerald-400`}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 8 }}
                              transition={{ duration: 0.18 }}
                            >
                              Platinum
                            </motion.span>
                            <motion.div
                              layoutId="hospital-platinum-price"
                              className={`relative z-30 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                              transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                            >
                              <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.hospitalPlatinum}</span>
                              <span className={`text-white text-sm font-normal`}>/month</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.h3
                          key={`${activeTab}-hdr-collapsed-couple`}
                          className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          Platinum
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.div key="couple-content"
                    initial={false}
                    animate={{ height: expanded.basic ? 'auto' : 0, opacity: expanded.basic ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.basic}
                  >
                    <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                      <ul className="space-y-3">
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Private Hospital Benefits</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Illness & accident cover</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Critical illness</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Maternity</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Accidental permanent disability</span></li>
                        <li className="flex items-center"><Check className="w-5 h-5 text-emerald-400 mr-2" /> <span className={`text-white`}>Ambulance and funeral benefits</span></li>
                      </ul>
                    </div>
                  </motion.div>
                  <div className={(expanded.basic ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                    <div className="relative">
                      <AnimatedPaymentButton 
                        text="Choose Plan"
                        className="silver"
                        hoverMessages={[
                          'Private Hospital Benefits',
                          'Illness & accident',
                          'Critical illness',
                          'Maternity',
                        ]}
                        hoverIcons={['wallet','card','payment','check']}
                        showArrow={false}
                        expanded={expanded.basic}
                        onToggleExpand={() => toggleExpanded('basic')}
                        to="/plans/hospital?tier=Platinum&variant=single"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={expanded.basic ? 'Collapse Couple Care details' : 'Expand Couple Care details'}
                      className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                        transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                        ${isDark 
                          ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                          : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                        ${expanded.basic ? 'rotate-180' : ''}`}
                      onClick={() => toggleExpanded('basic')}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </button>
                  </div>
                  {/* Hover Badge (collapsed only) */}
                  {!expanded.basic && (
                    <div
                      className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                        isDark
                          ? 'bg-white/10 border-white/15'
                          : 'bg-white/30 border-white/40'
                      }`}
                    >
                      <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {tabs.find(t => t.id === activeTab)?.cardLabel}
                      </div>
                      <motion.div layoutId="basic-price" className={`leading-none text-green-600`} transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}>
                        <span className="text-sm align-top mr-1">R</span>
                        <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.hospitalPlatinum)}</span>
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] ml-1`}>/mo</span>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </LayoutGroup>
        );
      
      case 'senior':
        return (
          <LayoutGroup>
            <motion.div className={`w-full max-w-full ${isSidebarCollapsed ? 'md:max-w-[74rem]' : 'md:max-w-[min(74rem,calc(100vw-14rem-0.5rem))]'} mx-auto px-4 md:px-2`}>
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-[1.02fr_repeat(3,1fr)] gap-6 md:gap-5 items-start overflow-visible">
                {/* Introduction Column (Senior-Plan intro) */}
                <motion.div 
                  className={`relative rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ring-1 ring-emerald-400/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] ${
                    isDark 
                      ? 'bg-gray-800 border-emerald-700 hover:border-emerald-500' 
                      : 'bg-white border-emerald-200 hover:border-emerald-400'
                  } ${expanded.intro ? 'min-h-[420px]' : 'min-h-[140px]'} `}
                  layout="position"
                  transition={{ 
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
                >
                  {/* Background accent: animated Single/Couple/Family */}
                  <IntroCarousel
                    images={[
                      '/assets/images/single.jpg',
                      '/assets/images/couple.jpg',
                      '/assets/images/family.jpg',
                    ]}
                  />
                  <div
                    className="relative z-10 flex items-start justify-between gap-3 text-white cursor-pointer select-none"
                    onClick={toggleIntro}
                    role="button"
                    aria-label={expanded.intro ? 'Collapse introduction' : 'Expand introduction'}
                  >
                    <div>
                      <motion.span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 border backdrop-blur-sm mb-2 bg-emerald-500/10 border-emerald-200/30 text-white`}
                        animate={{ scale: [1, 1.05, 1], boxShadow: [
                          '0 0 0px rgba(16,185,129,0.0)',
                          '0 0 18px rgba(16,185,129,0.35)',
                          '0 0 0px rgba(16,185,129,0.0)'
                        ] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        Start here
                      </motion.span>
                      <h3 className={`text-xl font-bold text-white`}>
                        Choose a Senior Plan that fits your life
                      </h3>
                    </div>
                    <motion.button
                      type="button"
                      aria-label={expanded.intro ? 'Collapse introduction' : 'Expand introduction'}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm text-white border-white/30 bg-white/10 hover:bg-white/15`}
                      onClick={(e) => { e.stopPropagation(); toggleIntro(); }}
                      animate={
                        expanded.intro
                          ? { y: 0, rotate: 180 }
                          : { y: [0, -3, 0], rotate: 0 }
                      }
                      transition={
                        expanded.intro
                          ? { duration: 0.2 }
                          : { y: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 0.2 } }
                      }
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </motion.button>
                  </div>
                  {/* Collapsed teaser actions (match Day-To-Day style; mapped to Senior categories) */}
                  {!expanded.intro && (
                    <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2 text-white">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); toggleIntro(); setShowDayToDayCards(true); }}
                      >
                        Open introduction
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: true, family: false, basic: false })); }}
                      >
                        Day-to-Day
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: false, family: true, basic: false })); }}
                      >
                        Hospital
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border backdrop-blur-sm bg-white/10 border-white/15 hover:bg-white/15 transition-all"
                        onClick={(e) => { e.stopPropagation(); setShowDayToDayCards(true); setExpanded(prev => ({ ...prev, student: false, family: false, basic: true })); }}
                      >
                        Comprehensive
                      </button>
                    </div>
                  )}
                  <motion.div
                    key="intro-content"
                    initial={false}
                    animate={{ height: expanded.intro ? 'auto' : 0, opacity: expanded.intro ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.intro}
                    className="relative z-10 text-white"
                  >
                    <p className={`mt-2 text-white`}>
                      Practical, affordable healthcare for everyday needs. Choose from our flexible options
                      to cover GP visits, basic medication, and essential health services for you and your family.
                    </p>
                    <ul className="space-y-3 mt-4">
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                        <span className={`text-white`}>GP consultations and virtual care</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                        <span className={`text-white`}>Radiology and pathology.</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-400 mr-2 mt-0.5" />
                        <span className={`text-white`}>Acute medication</span>
                      </li>
                    </ul>
                    {/* Intro helper */}
                    <div className="mt-5 text-sm text-gray-200">
                      Open the Introduction to reveal the pricing options below. Cards will slide in one by one.
                    </div>
                    {/* Intro actions: reveal and jump (match Day-To-Day style; mapped to Senior categories) */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                        onClick={() => {
                          setShowDayToDayCards(true);
                          setExpanded(prev => ({ ...prev, student: true, family: false, basic: false }));
                        }}
                      >
                        Day-to-Day
                      </button>
                      <button
                        type="button"
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                        onClick={() => {
                          setShowDayToDayCards(true);
                          setExpanded(prev => ({ ...prev, student: false, family: true, basic: false }));
                        }}
                      >
                        Hospital
                      </button>
                      <button
                        type="button"
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-sm bg-white/10 border-white/15 text-white hover:bg-white/15 transition-all`}
                        onClick={() => {
                          setShowDayToDayCards(true);
                          setExpanded(prev => ({ ...prev, student: false, family: false, basic: true }));
                        }}
                      >
                        Comprehensive
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
                {/* Day-to-Day (Single/Couple) */}
                <motion.div 
                  className={`order-1 relative z-30 group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                    isDark 
                      ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                      : 'bg-white border-green-200 hover:border-green-400'
                  } min-h-[140px] `}
                  layout="position"
                  initial={false}
                  animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
                  style={{ pointerEvents: showDayToDayCards ? 'auto' : 'none' }}
                >
                  {expanded.student && (
                    <motion.div
                      key="student-bg"
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                    >
                      <img
                        src="/assets/images/single.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                    </motion.div>
                  )}
                  <div className="relative z-10 mb-[17px]">
                    <AnimatePresence mode="wait">
                      {expanded.student ? (
                        <motion.div
                          key={`${activeTab}-hdr-expanded-student-${expanded.student}`}
                          className={`relative z-20 flex flex-col items-start gap-1`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="flex items-center gap-2">
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
                                {'Senior'.split('')?.map((ch, i) => (
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
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.18 }}
                            >
                              Day-to-Day
                            </motion.span>
                          </div>
                          <motion.div
                            className={`mt-2 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 w-fit whitespace-nowrap self-start ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.seniorDayToDay}</span>
                            <span className={`text-white text-sm font-normal`}>/month</span>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.h3
                          key={`${activeTab}-hdr-collapsed-student`}
                          className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          Day-to-Day
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Removed Senior Day-to-Day detailed price breakdown (Single/Couple) */}
                  <motion.div key="student-content"
                    initial={false}
                    animate={{ height: expanded.student ? 'auto' : 0, opacity: expanded.student ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.student}
                    className="relative z-10"
                  >
                    <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                      <ul className="space-y-2">
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Senior Day to Day Plan</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Acute medication</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Radiology and pathology.</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Funeral benefits</span></li>
                      </ul>
                    </div>
                  </motion.div>
                  <div className={(expanded.student ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                    <div className="relative">
                      <AnimatedPaymentButton 
                      text="Choose Plan"
                      className="bronze"
                      hoverMessages={[
                          'GP consultations & virtual care',
                          'Radiology and pathology.',
                          'Acute medication',
                      ]}
                        hoverIcons={['wallet','card','payment','check']}
                        showArrow={false}
                        expanded={expanded.student}
                        onToggleExpand={() => toggleExpanded('student')}
                        to="/plans/senior-plan?category=Day-to-Day&variant=single"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={expanded.student ? 'Collapse Student Care details' : 'Expand Student Care details'}
                      className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                        transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                        ${isDark 
                          ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                          : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                        ${expanded.student ? 'rotate-180' : ''}`}
                      onClick={() => toggleExpanded('student')}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </button>
                  </div>
                  {/* Hover Badge (collapsed only) */}
                  {!expanded.student && (
                    <div
                      className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                        isDark
                          ? 'bg-white/10 border-white/15'
                          : 'bg-white/30 border-white/40'
                      }`}
                    >
                      <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {tabs.find(t => t.id === activeTab)?.cardLabel}
                      </div>
                      <motion.div layoutId={`${activeTab}-student-price`} className={`leading-none text-green-600`}>
                        <span className="text-sm align-top mr-1">R</span>
                        <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.seniorDayToDay)}</span>
                        <span className={`ml-1 text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                      </motion.div>
                    </div>
                  )}
                </motion.div>

                {/* Hospital (Single/Couple) */}
                <motion.div 
                  className={`order-3 relative group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                    isDark 
                      ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                      : 'bg-white border-green-200 hover:border-green-400'
                  } min-h-[140px] `}
                  layout="position"
                  initial={false}
                  animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
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
                        src="/assets/images/single.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                    </motion.div>
                  )}
                  <div className="relative z-10 mb-[17px]">
                    <AnimatePresence mode="wait">
                      {expanded.family ? (
                        <motion.div
                          key={`${activeTab}-hdr-expanded-family-${expanded.family}`}
                          className="relative z-20 flex flex-col items-start gap-1"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="flex items-center gap-2">
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
                                variants={{ show: { transition: { staggerChildren: 0.03 } } }}
                            >
                                {'Senior'.split('').map((ch, i) => (
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
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.18 }}
                            >
                              Hospital
                            </motion.span>
                          </div>
                          <motion.div
                            className={`mt-2 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 w-fit whitespace-nowrap self-start ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                              <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.seniorHospital}</span>
                            <span className={`text-white text-sm font-normal`}>/month</span>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.h3
                          key={`${activeTab}-hdr-collapsed-family`}
                          className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          Hospital
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Removed Senior Hospital detailed price breakdown (Single/Couple) */}
                  <motion.div key="family-content"
                    initial={false}
                    animate={{ height: expanded.family ? 'auto' : 0, opacity: expanded.family ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.family}
                  >
                    <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                      <ul className="space-y-2">
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Private Hospital Benefits</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Illness</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Accident</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Ambulance & funeral benefits</span></li>
                      </ul>
                    </div>
                  </motion.div>
                  <div className={(expanded.family ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                    <div className="relative">
                      <AnimatedPaymentButton 
                        text="Choose Plan"
                        className="bronze"
                        hoverMessages={[
                          'Private Hospital Benefits',
                          'Illness & accident',
                          'Ambulance',
                          'Funeral benefits',
                        ]}
                        hoverIcons={['wallet','card','payment','check']}
                        showArrow={false}
                        expanded={expanded.family}
                        onToggleExpand={() => toggleExpanded('family')}
                        to="/plans/senior-plan?category=Hospital&variant=single"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={expanded.family ? 'Collapse Family Care details' : 'Expand Family Care details'}
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
                  {/* Hover Badge (collapsed only) */}
                  {!expanded.family && (
                    <div
                      className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
                        isDark
                          ? 'bg-gray-900/80 border-gray-700'
                          : 'bg-white/90 border-gray-200'
                      }`}
                    >
                        <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                          {tabs.find(t => t.id === activeTab)?.cardLabel}
                        </div>
                        <motion.div layoutId={`${activeTab}-family-price`} className={`leading-none text-green-600`}>
                          <span className="text-sm align-top mr-1">R</span>
                          <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.seniorHospital)}</span>
                          <span className={`ml-1 text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                        </motion.div>
                    </div>
                  )}
                </motion.div>

                {/* Comprehensive (Single/Couple) */}
                <motion.div 
                  className={`order-2 relative group rounded-2xl shadow-lg p-5 border-2 transition-all overflow-visible transform-gpu ${
                    isDark 
                      ? 'bg-gray-800 border-green-700 hover:border-green-500' 
                      : 'bg-white border-green-200 hover:border-green-400'
                  } min-h-[140px] `}
                  layout="position"
                  initial={false}
                  animate={showDayToDayCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{}}
                  style={{ pointerEvents: showDayToDayCards ? 'auto' : 'none' }}
                >
                  {expanded.basic && (
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
                        src="/assets/images/single.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className={`${isDark ? 'bg-black/50' : 'bg-black/35'} absolute inset-0`} />
                    </motion.div>
                  )}
                  <div className="relative z-10 mb-[17px]">
                    <AnimatePresence mode="wait">
                      {expanded.basic ? (
                        <motion.div
                          key={`${activeTab}-hdr-expanded-couple-${expanded.basic}`}
                          className={`relative z-20 flex flex-col items-start gap-1`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="flex items-center gap-2">
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
                                {'Senior'.split('')?.map((ch, i) => (
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
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.18 }}
                            >
                              Comprehensive
                            </motion.span>
                          </div>
                          <motion.div
                            className={`mt-2 inline-flex items-baseline gap-2 rounded-xl border backdrop-blur-sm px-3 py-1 w-fit whitespace-nowrap self-start ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <span className="text-2xl font-bold text-emerald-400">{landingPriceTexts.seniorComprehensive}</span>
                            <span className={`text-white text-sm font-normal`}>/month</span>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.h3
                          key={`${activeTab}-hdr-collapsed-couple`}
                          className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          Comprehensive
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Removed Senior Comprehensive detailed price breakdown (Single/Couple) */}
                  <motion.div key="couple-content"
                    initial={false}
                    animate={{ height: expanded.basic ? 'auto' : 0, opacity: expanded.basic ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0.0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                    aria-hidden={!expanded.basic}
                  >
                    <div className={`rounded-xl border ${isDark ? 'bg-emerald-500/10 border-emerald-200/20' : 'bg-emerald-500/10 border-emerald-500/20'} backdrop-blur-sm p-4 mb-6`}>
                      <ul className="space-y-2">
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Doctor visits</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Acute & chronic medication</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Blood tests & x-rays</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Dentistry & optometry</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Funeral benefits</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Illness</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Accident</span></li>
                        <li className="flex items-start"><Check className="w-4 h-4 text-emerald-400 mr-2 mt-0.5" /> <span className={`text-white text-sm leading-snug`}>Ambulance & funeral benefits</span></li>
                      </ul>
                    </div>
                  </motion.div>
                  <div className={(expanded.basic ? 'mt-[-3px] ' : 'mt-8 ') + 'relative z-10'}>
                    <div className="relative">
                      <AnimatedPaymentButton 
                        text="Choose Plan"
                        className="silver"
                        hoverMessages={[
                          'Doctor visits & medication',
                          'Blood tests & x-rays',
                          'Illness & accident',
                          'Ambulance & funeral',
                        ]}
                        hoverIcons={['wallet','card','payment','check']}
                        showArrow={false}
                        expanded={expanded.basic}
                        onToggleExpand={() => toggleExpanded('basic')}
                        to="/plans/senior-plan?category=Comprehensive&variant=single"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={expanded.basic ? 'Collapse Couple Care details' : 'Expand Couple Care details'}
                      className={`absolute left-1/2 -translate-x-1/2 bottom-[-36px] inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-sm z-[999]
                        transition-transform duration-200 ease-out shadow-md hover:shadow-lg hover:scale-105 focus:outline-none
                        ${isDark 
                          ? 'bg-gray-900/60 border-white/15 text-white ring-1 ring-white/10'
                          : 'bg-white/80 border-gray-200 text-gray-800 ring-1 ring-black/5'}
                        ${expanded.basic ? 'rotate-180' : ''}`}
                      onClick={() => toggleExpanded('basic')}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </button>
                  </div>
                  {/* Hover Badge (collapsed only) */}
                  {!expanded.basic && (
                    <div
                      className={`pointer-events-none absolute top-3 right-3 rounded-xl px-3 py-2 shadow-sm border text-right opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 backdrop-blur-sm ${
                        isDark
                          ? 'bg-white/10 border-white/15'
                          : 'bg-white/30 border-white/40'
                      }`}
                    >
                      <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {tabs.find(t => t.id === activeTab)?.cardLabel}
                      </div>
                      <motion.div layoutId={`${activeTab}-basic-price`} className={`leading-none text-green-600`}>
                        <span className="text-sm align-top mr-1">R</span>
                        <span className="text-2xl font-bold">{stripPricePrefix(landingPriceTexts.seniorComprehensive)}</span>
                        <span className={`ml-1 text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/mo</span>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </LayoutGroup>
        );
      
      default:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Your Quote Today</h3>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
              </div>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  Get My Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </form>
              <div className="flex items-center justify-center space-x-4 mt-8 pt-8 border-t border-gray-200">
                <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>Call Us: 0876 100 600</span>
                </button>
                <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>Email Us</span>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="plans" className={`relative z-30 -mt-[150px] transition-all duration-700 ease-in-out ${
      isDark ? 'bg-gray-900' : 'bg-white'
    } ${
      isSidebarCollapsed ? 'lg:ml-24 lg:w-[calc(100%-6rem)]' : 'lg:ml-64 lg:w-[calc(100%-16rem)]'
    }`} style={{
      transition: 'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }}>
      <div className={`w-full mx-auto px-2 sm:px-4`}>
        {/* Floating Tabs */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className={`w-auto mx-auto rounded-2xl shimmer-border shadow-lg px-4 py-2 sm:py-3 backdrop-blur-sm transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800/95 border border-gray-700' 
              : 'bg-white/95 border border-gray-100'
          }`}>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 px-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-shrink-0 flex flex-row items-center px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded-xl transition-all justify-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? isDark 
                        ? 'bg-green-900/50 text-green-300 shadow-sm border border-green-800'
                        : 'bg-green-50 text-green-700 shadow-sm border border-green-200'
                      : isDark
                        ? 'bg-blue-900/20 text-green-200 border border-blue-800/50 hover:bg-green-900/30 hover:text-green-200 hover:border-green-800/60'
                        : 'bg-blue-50 text-green-700 border border-blue-100 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-colors flex-shrink-0 ${
                    activeTab === tab.id
                      ? isDark
                        ? 'bg-green-900/50 hover:bg-green-900/70'
                        : 'bg-green-100 hover:bg-green-200'
                      : isDark
                        ? 'bg-blue-900/30 hover:bg-green-900/50'
                        : 'bg-blue-100 hover:bg-green-200'
                  }`}>
                  <tab.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    activeTab === tab.id 
                      ? isDark 
                          ? 'text-green-300' 
                          : 'text-green-600'
                      : isDark
                          ? 'text-green-300/80'
                          : 'text-green-600'
                  }`} />
                  </span>
                  <span className="text-center sm:text-left leading-tight sm:leading-normal">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content Panel */}
        <div className={`transition-all duration-500 ease-in-out`}>
          <div className={`transform transition-all duration-500 ${
            activeTab ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsTabs;
