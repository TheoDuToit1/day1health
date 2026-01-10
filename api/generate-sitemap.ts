import { createClient } from '@supabase/supabase-js';
import { generateSitemapEntry } from '../src/utils/seoHelpers';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const baseUrl = process.env.VITE_BASE_URL || 'https://day1health.co.za';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function generateSitemap(): Promise<string> {
  try {
    // Fetch all providers
    let allProviders = [];
    let offset = 0;
    const pageSize = 500;
    let hasMore = true;

    while (hasMore) {
      const { data, error, count } = await supabase
        .from('providers')
        .select('id, updated_at', { count: 'exact' })
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

    // Provider pages
    allProviders.forEach((provider) => {
      const lastmod = provider.updated_at
        ? new Date(provider.updated_at).toISOString().split('T')[0]
        : today;

      sitemapXml += generateSitemapEntry(
        `${baseUrl}/provider/${provider.id}`,
        lastmod,
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
    const sitemap = await generateSitemap();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
