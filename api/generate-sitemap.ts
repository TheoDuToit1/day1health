import { createClient } from '@supabase/supabase-js';
import { generateSitemapEntry } from '../src/utils/seoHelpers';

// Vercel serverless functions use different env var names
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const baseUrl = process.env.VITE_BASE_URL || 'https://day1health.co.za';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generate a URL-safe slug from provider data
 */
function generateProviderSlug(provider: any): string {
  const name = provider['DOCTOR SURNAME'] || '';
  const suburb = provider.SUBURB || '';
  
  const cleanName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  
  const cleanSuburb = suburb
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  
  const slug = cleanSuburb 
    ? `dr-${cleanName}-${cleanSuburb}`
    : `dr-${cleanName}`;
  
  return slug;
}

/**
 * Evaluate provider quality for sitemap inclusion
 */
function isQualityProvider(provider: any): boolean {
  const hasName = !!(provider['DOCTOR SURNAME'] && provider['DOCTOR SURNAME'].trim().length > 0);
  const hasSpecialty = !!(provider.profession && provider.profession.trim().length > 0);
  const hasLocation = !!(
    (provider.SUBURB && provider.SUBURB.trim().length > 0) ||
    (provider.PROVINCE && provider.PROVINCE.trim().length > 0)
  );
  
  // Must have name, specialty, and location to be included
  return hasName && hasSpecialty && hasLocation;
}

export async function generateSitemap(): Promise<string> {
  try {
    // Fetch providers - simplified to avoid timeout and column issues
    const { data: allProviders, error } = await supabase
      .from('providers')
      .select('*')
      .limit(1000);

    if (error) {
      console.error('Supabase error:', error);
      // Continue without providers if there's an error
      console.log('Continuing with static pages only');
    }

    // Filter for quality providers only
    const qualityProviders = allProviders ? allProviders.filter(isQualityProvider) : [];
    
    console.log(`Sitemap: ${qualityProviders.length} quality providers out of ${allProviders?.length || 0} total`);

    const today = new Date().toISOString().split('T')[0];

    // Build sitemap XML
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    // Static pages
    const staticPages = [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/plans/day-to-day', changefreq: 'monthly', priority: 0.8 },
      { loc: '/plans/hospital', changefreq: 'monthly', priority: 0.8 },
      { loc: '/plans/comprehensive', changefreq: 'monthly', priority: 0.8 },
      { loc: '/plans/senior-plan', changefreq: 'monthly', priority: 0.8 },
      { loc: '/plans/junior-executive', changefreq: 'monthly', priority: 0.8 },
      { loc: '/procedures', changefreq: 'yearly', priority: 0.6 },
      { loc: '/regulatory-information', changefreq: 'yearly', priority: 0.6 },
      { loc: '/directory', changefreq: 'weekly', priority: 0.9 },
    ];

    staticPages.forEach((page) => {
      sitemapXml += generateSitemapEntry(
        `${baseUrl}${page.loc}`,
        today,
        page.changefreq as any,
        page.priority
      ) + '\n';
    });

    // Provider pages - use slug-based URLs (quality filtered)
    qualityProviders.forEach((provider) => {
      const slug = generateProviderSlug(provider);
      
      sitemapXml += generateSitemapEntry(
        `${baseUrl}/directory/${slug}`,
        today,
        'monthly',
        0.7
      ) + '\n';
    });

    sitemapXml += '</urlset>';

    return sitemapXml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}

// For Vercel serverless function
export default async function handler(req: any, res: any) {
  try {
    // Log environment check (remove in production)
    if (!process.env.VITE_SUPABASE_URL && !process.env.SUPABASE_URL) {
      console.error('Missing Supabase URL environment variable');
      return res.status(500).json({ 
        error: 'Failed to generate sitemap',
        details: 'Missing Supabase configuration'
      });
    }

    const sitemap = await generateSitemap();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate sitemap',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
