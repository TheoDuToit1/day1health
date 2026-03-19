/**
 * Sitemap Index - References all sub-sitemaps
 * Best practice for large sites with multiple content types
 */

const baseUrl = process.env.VITE_BASE_URL || 'https://day1health.co.za';

export async function generateSitemapIndex(): Promise<string> {
  const today = new Date().toISOString().split('T')[0];

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/api/generate-sitemap</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/api/sitemap-directory</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  return sitemapIndex;
}

// For Vercel serverless function
export default async function handler(req: any, res: any) {
  try {
    const sitemapIndex = await generateSitemapIndex();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(sitemapIndex);
  } catch (error) {
    console.error('Sitemap index generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap index' });
  }
}
