import { Provider } from '../../admin/types';

/**
 * Quality criteria for including a provider in the sitemap
 */
export interface QualityCheck {
  hasName: boolean;
  hasSpecialty: boolean;
  hasLocation: boolean;
  hasContact: boolean;
  isComplete: boolean;
  score: number;
}

/**
 * Evaluate provider quality for sitemap inclusion
 */
export function evaluateProviderQuality(provider: Provider): QualityCheck {
  const hasName = !!(provider['DOCTOR SURNAME'] && provider['DOCTOR SURNAME'].trim().length > 0);
  const hasSpecialty = !!(provider.profession && provider.profession.trim().length > 0);
  const hasLocation = !!(
    (provider.SUBURB && provider.SUBURB.trim().length > 0) ||
    (provider.PROVINCE && provider.PROVINCE.trim().length > 0)
  );
  const hasContact = !!(
    (provider.TEL && provider.TEL.trim().length > 0) ||
    (provider.ADDRESS && provider.ADDRESS.trim().length > 0)
  );

  // Calculate quality score (0-100)
  let score = 0;
  if (hasName) score += 40; // Name is critical
  if (hasSpecialty) score += 30; // Specialty is very important
  if (hasLocation) score += 20; // Location is important
  if (hasContact) score += 10; // Contact is nice to have

  // Profile is complete if it has all critical fields
  const isComplete = hasName && hasSpecialty && hasLocation;

  return {
    hasName,
    hasSpecialty,
    hasLocation,
    hasContact,
    isComplete,
    score,
  };
}

/**
 * Filter providers suitable for sitemap inclusion
 * Only includes high-quality, complete profiles
 */
export function filterSitemapProviders(providers: Provider[]): Provider[] {
  return providers.filter((provider) => {
    const quality = evaluateProviderQuality(provider);
    
    // Minimum requirements for sitemap inclusion:
    // - Must have name, specialty, and location (score >= 90)
    // - Must be marked as complete
    return quality.isComplete && quality.score >= 90;
  });
}

/**
 * Get sitemap statistics
 */
export function getSitemapStats(providers: Provider[]): {
  total: number;
  included: number;
  excluded: number;
  qualityDistribution: {
    excellent: number; // 100
    good: number; // 90-99
    fair: number; // 70-89
    poor: number; // <70
  };
} {
  const total = providers.length;
  const sitemapProviders = filterSitemapProviders(providers);
  const included = sitemapProviders.length;
  const excluded = total - included;

  const qualityDistribution = {
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0,
  };

  providers.forEach((provider) => {
    const quality = evaluateProviderQuality(provider);
    if (quality.score === 100) qualityDistribution.excellent++;
    else if (quality.score >= 90) qualityDistribution.good++;
    else if (quality.score >= 70) qualityDistribution.fair++;
    else qualityDistribution.poor++;
  });

  return {
    total,
    included,
    excluded,
    qualityDistribution,
  };
}
