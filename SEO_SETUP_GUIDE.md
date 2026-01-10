# SEO Setup Guide - Quick Start

## What Was Implemented

Your medical directory now has enterprise-grade SEO with:

1. **Dynamic Provider Pages** - Each provider gets their own SEO-optimized page at `/provider/{id}`
2. **Automatic Meta Tags** - Title, description, keywords, and Open Graph tags generated dynamically
3. **Structured Data** - Schema.org markup for search engines to understand provider information
4. **Dynamic Sitemap** - Automatically includes all providers at `/api/sitemap.xml`
5. **Healthcare Keywords** - Optimized for medical insurance, GP, dentist, and location-based searches

## Files Created/Modified

### New Files
- `src/utils/seoHelpers.ts` - SEO utility functions
- `src/directory/ProviderDetailPage.tsx` - Provider detail page component
- `api/generate-sitemap.ts` - Sitemap generation (Vercel serverless)
- `public/robots.txt` - Search engine crawling rules
- `SEO_IMPLEMENTATION.md` - Detailed documentation

### Modified Files
- `src/App.tsx` - Added provider route
- `src/directory/DirectoryPage.tsx` - Added SEO meta tags
- `server.js` - Added sitemap endpoint
- `index.html` - Enhanced with structured data and meta tags

## Environment Setup

Ensure these environment variables are set:

```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_BASE_URL=https://day1health.co.za  # For production
```

## Testing Locally

### 1. Start the development server
```bash
npm run dev
```

### 2. Start the API server
```bash
node server.js
```

### 3. Test provider pages
- Visit: `http://localhost:3000/provider/{provider_id}`
- Check browser DevTools > Elements to see meta tags
- Verify structured data in console

### 4. Test sitemap
- Visit: `http://localhost:3001/api/sitemap.xml`
- Should see XML with all providers

### 5. Test robots.txt
- Visit: `http://localhost:3000/robots.txt`
- Should see crawling rules

## Validation Tools

### 1. Structured Data Validation
- [Schema.org Validator](https://validator.schema.org/)
- Paste provider page URL to validate schema

### 2. Open Graph Validation
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 3. SEO Audit
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### 4. Sitemap Validation
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

## Google Search Console Setup

### 1. Add Property
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property"
3. Enter: `https://day1health.co.za`
4. Verify ownership (DNS or HTML file)

### 2. Submit Sitemap
1. Go to Sitemaps section
2. Click "Add/test sitemap"
3. Enter: `https://day1health.co.za/api/sitemap.xml`
4. Click "Submit"

### 3. Monitor Performance
- Check "Performance" tab for impressions and clicks
- Monitor "Coverage" for indexing status
- Review "Enhancements" for structured data issues

## Deployment Checklist

### Before Going Live

- [ ] Update `VITE_BASE_URL` to production domain
- [ ] Verify Supabase credentials are correct
- [ ] Test provider pages on staging
- [ ] Verify sitemap generates correctly
- [ ] Test robots.txt is accessible
- [ ] Validate structured data with Schema.org validator
- [ ] Test Open Graph tags with social debuggers

### After Deployment

- [ ] Add property to Google Search Console
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor crawl stats for 24-48 hours
- [ ] Check for any crawl errors
- [ ] Verify providers are being indexed
- [ ] Monitor ranking for target keywords

## Monitoring & Optimization

### Weekly Tasks
- Check Google Search Console for errors
- Monitor provider page impressions
- Review top performing keywords

### Monthly Tasks
- Analyze provider page traffic
- Update keywords based on performance
- Check for new indexing opportunities
- Review competitor keywords

### Quarterly Tasks
- Comprehensive SEO audit
- Update structured data if needed
- Analyze ranking progress
- Plan content improvements

## Common Issues & Solutions

### Issue: Sitemap not generating
**Solution:**
- Check server logs: `node server.js`
- Verify Supabase connection
- Ensure `providers` table has data
- Check that `updated_at` field exists

### Issue: Meta tags not showing
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors
- Verify `setMetaTags()` is called
- Check that meta tags are in `<head>`

### Issue: Providers not indexed
**Solution:**
- Check Google Search Console coverage
- Verify robots.txt allows indexing
- Check for noindex meta tags
- Ensure provider pages are linked from directory

### Issue: Structured data errors
**Solution:**
- Validate with Schema.org validator
- Check for missing required fields
- Ensure URLs are absolute (not relative)
- Verify JSON syntax is correct

## Performance Tips

### 1. Optimize Images
- Use WebP format where possible
- Compress images before uploading
- Add alt text to all images

### 2. Improve Page Speed
- Enable gzip compression
- Minify CSS/JS
- Use CDN for static assets
- Lazy load images

### 3. Mobile Optimization
- Test on mobile devices
- Ensure touch targets are large enough
- Optimize for mobile viewport
- Test Core Web Vitals

## Next Steps

1. **Test Everything** - Verify all pages work correctly
2. **Deploy** - Push to production
3. **Monitor** - Watch Google Search Console
4. **Optimize** - Adjust keywords based on performance
5. **Scale** - Add more providers and content

## Support Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

## Questions?

Refer to `SEO_IMPLEMENTATION.md` for detailed technical documentation.
