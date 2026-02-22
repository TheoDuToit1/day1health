import { createClient } from '@supabase/supabase-js';

// Vercel serverless functions use different env var names
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const baseUrl = process.env.VITE_BASE_URL || 'https://day1health.co.za';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generate a URL-safe slug from provider data
 */
function generateProviderSlug(provider: any): string {
  try {
    const name = provider['DOCTOR SURNAME'] || provider.DOCTOR_SURNAME || '';
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
    
    return slug || 'dr-unknown';
  } catch (error) {
    console.error('Error generating slug:', error, provider);
    return 'dr-unknown';
  }
}

/**
 * Evaluate provider quality for sitemap inclusion
 */
function isQualityProvider(provider: any): boolean {
  try {
    const doctorSurname = provider['DOCTOR SURNAME'] || provider.DOCTOR_SURNAME || '';
    const hasName = !!(doctorSurname && doctorSurname.trim().length > 0);
    const hasSpecialty = !!(provider.profession && provider.profession.trim().length > 0);
    const hasLocation = !!(
      (provider.SUBURB && provider.SUBURB.trim().length > 0) ||
      (provider.PROVINCE && provider.PROVINCE.trim().length > 0)
    );
    
    // Must have name, specialty, and location to be included
    return hasName && hasSpecialty && hasLocation;
  } catch (error) {
    console.error('Error checking provider quality:', error, provider);
    return false;
  }
}

/**
 * Generate directory-specific sitemap
 */
export async function generateDirectorySitemap(): Promise<string> {
  try {
    // Fetch providers - use * to get all columns (table doesn't have 'id' column)
    const { data: allProviders, error } = await supabase
      .from('providers')
      .select('*')
      .limit(1000); // Limit to prevent timeout

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!allProviders || allProviders.length === 0) {
      console.log('No providers found');
      // Return empty sitemap with just directory landing page
      const today = new Date().toISOString().split('T')[0];
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/directory</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
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
      // Use today's date since we don't have updated_at
      const lastmod = today;
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
    // Set timeout header
    res.setHeader('X-Vercel-Timeout', '10');
    
    // Debug: Log environment
    console.log('Starting sitemap generation...');
    console.log('Supabase URL configured:', !!supabaseUrl);
    console.log('Supabase Key configured:', !!supabaseKey);

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return res.status(500).json({ 
        error: 'Failed to generate directory sitemap',
        details: 'Missing Supabase environment variables'
      });
    }

    const sitemap = await generateDirectorySitemap();
    
    console.log('Sitemap generated successfully, length:', sitemap.length);
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Directory sitemap generation error:', error);
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('Error details:', { message: errorMessage, stack: errorStack });
    
    res.status(500).json({ 
      error: 'Failed to generate directory sitemap',
      details: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
}
