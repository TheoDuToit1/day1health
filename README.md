# Day1Health - Medical Insurance Solutions

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fday1health)

## SEO Setup

This project includes comprehensive SEO optimization with the following features:

- **Meta Tags**: Optimized for search engines and social sharing
- **Sitemap**: Auto-generated sitemap for search engine crawling
- **robots.txt**: Configured to allow all search engines to index the site
- **Open Graph & Twitter Cards**: Enhanced social media sharing
- **Security Headers**: Added for better security and SEO ranking
- **PWA Support**: With manifest.json for better mobile experience

## Deployment to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and sign in with your GitHub account
3. Click "Add New" -> "Project"
4. Import your GitHub repository
5. Configure project settings (defaults are usually fine)
6. Click "Deploy"

## Verifying SEO

After deployment, verify your SEO setup with these tools:

1. [Google Search Console](https://search.google.com/search-console)
2. [Bing Webmaster Tools](https://www.bing.com/webmasters)
3. [SEO Meta in 1 Click](https://chrome.google.com/webstore/detail/meta-seo-in-1-click/khapcenmekkicagcdlkenkdlgedbnhmf) Chrome extension
4. [Lighthouse](https://developers.google.com/web/tools/lighthouse) for performance and SEO audits

## Adding New Pages

When adding new pages, remember to:

1. Add the page to `sitemap.xml`
2. Include proper meta tags in the page component
3. Test with the above SEO tools

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SITE_URL=https://day1health.vercel.app
# Add other environment variables as needed
```
