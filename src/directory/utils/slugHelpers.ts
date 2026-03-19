import { Provider } from '../../admin/types';

/**
 * Generate a URL-safe slug from provider data
 * Format: dr-firstname-lastname-suburb
 */
export function generateProviderSlug(provider: Provider): string {
  const name = provider['DOCTOR SURNAME'] || '';
  const suburb = provider.SUBURB || '';
  
  // Clean and format the name
  const cleanName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove duplicate hyphens
  
  // Clean and format the suburb
  const cleanSuburb = suburb
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  
  // Combine: dr-name-suburb
  const slug = cleanSuburb 
    ? `dr-${cleanName}-${cleanSuburb}`
    : `dr-${cleanName}`;
  
  return slug;
}

/**
 * Parse a slug and extract search terms
 */
export function parseSlug(slug: string): { name: string; suburb: string } {
  // Remove 'dr-' prefix if present
  const withoutPrefix = slug.replace(/^dr-/, '');
  
  // Split by hyphens
  const parts = withoutPrefix.split('-');
  
  // Last part is likely suburb, rest is name
  const suburb = parts.length > 1 ? parts[parts.length - 1] : '';
  const name = parts.slice(0, -1).join(' ');
  
  return { name, suburb };
}

/**
 * Find provider by slug
 * This performs a fuzzy match on name and suburb
 */
export function findProviderBySlug(
  providers: Provider[],
  slug: string
): Provider | null {
  const { name, suburb } = parseSlug(slug);
  
  // Try exact match first (case-insensitive)
  const exactMatch = providers.find((provider) => {
    const providerSlug = generateProviderSlug(provider);
    return providerSlug === slug;
  });
  
  if (exactMatch) return exactMatch;
  
  // Try fuzzy match on name and suburb
  const fuzzyMatch = providers.find((provider) => {
    const providerName = (provider['DOCTOR SURNAME'] || '').toLowerCase();
    const providerSuburb = (provider.SUBURB || '').toLowerCase();
    
    const nameMatch = providerName.includes(name.toLowerCase()) || 
                      name.toLowerCase().includes(providerName);
    const suburbMatch = !suburb || 
                        providerSuburb.includes(suburb.toLowerCase()) ||
                        suburb.toLowerCase().includes(providerSuburb);
    
    return nameMatch && suburbMatch;
  });
  
  return fuzzyMatch || null;
}

/**
 * Get provider URL path
 */
export function getProviderPath(provider: Provider): string {
  const slug = generateProviderSlug(provider);
  return `/directory/${slug}`;
}
