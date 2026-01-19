import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
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

/**
 * Generate directory-specific sitemap
 */
export async function generateDirectorySitemap(): Promise<string> {
  try {
    // Fetch all providers with full data for quality filtering
    let allProviders = [];
    let offset = 0;
    const pageSize = 500;
    let hasMore = true;

    while (hasMore) {
      const { data, error, count } = await supabase
        .from('providers')
        .select('id, updated_at, "DOCTOR SURNAME", SUBURB, PROVINCE, profession, TEL, ADDRESS', { count: 'exact' })
        .range(offset, offset + pageSize - 1);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allProviders = [...allProviders, ...data];
        offset += pageSize;

        if (count !== null && allProviders.length >= count) {
          hasMore = false;
        }
      }
    }

    // Filter for quality providers only
    const qualityProviders = allProviders.filter(isQualityProvider);
    
    console.log(`Directory Sitemap: ${qualityProviders.length} quality providers out of ${allProviders.length} total`);

    const today = new Date().toISOString().split('T')[0];

    // Build sitemap XML
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    // Main directory page
    sitemapXml += `  <url>
    <loc>${baseUrl}/directory</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

    // Provider pages - quality filtered, slug-based URLs
    qualityProviders.forEach((provider) => {
      const lastmod = provider.updated_at
        ? new Date(provider.updated_at).toISOString().split('T')[0]
        : today;

      const slug = generateProviderSlug(provider);
      
      sitemapXml += `  <url>
    <loc>${baseUrl}/directory/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    sitemapXml += '</urlset>';

    return sitemapXml;
  } catch (error) {
    console.error('Error generating directory sitemap:', error);
    throw error;
  }
}

// For Vercel serverless function
export default async function handler(req: any, res: any) {
  try {
    const sitemap = await generateDirectorySitemap();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Directory sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate directory sitemap' });
  }
}
