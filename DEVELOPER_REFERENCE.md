# Developer Reference - Day1Health SEO Implementation

## Quick Reference Guide

### Key Files

| File | Purpose | Key Functions |
|------|---------|---------------|
| `src/utils/seoHelpers.ts` | SEO utilities | `generateProviderSEO()`, `setMetaTags()` |
| `src/directory/ProviderDetailPage.tsx` | Provider page | Displays provider with SEO |
| `src/directory/DirectoryPage.tsx` | Directory page | Lists providers with SEO |
| `server.js` | Backend API | `/api/sitemap.xml` endpoint |
| `index.html` | HTML template | Meta tags, structured data |
| `public/robots.txt` | Crawl rules | Search engine directives |

### Key Functions

#### `generateProviderSEO(provider, baseUrl)`
Generates SEO data for a provider page.

```typescript
const seo = generateProviderSEO(provider, 'https://day1health.co.za');
// Returns: SEOMetaTags object with title, description, keywords, schema
```

**Parameters:**
- `provider: Provider` - Provider object from database
- `baseUrl: string` - Base URL of the site

**Returns:**
- `SEOMetaTags` - Object with all SEO data

#### `generateDirectorySEO(baseUrl, totalProviders)`
Generates SEO data for the directory page.

```typescript
const seo = generateDirectorySEO('https://day1health.co.za', 150);
// Returns: SEOMetaTags object for directory
```

**Parameters:**
- `baseUrl: string` - Base URL of the site
- `totalProviders: number` - Total number of providers

**Returns:**
- `SEOMetaTags` - Object with all SEO data

#### `setMetaTags(seo)`
Applies SEO meta tags to the document head.

```typescript
setMetaTags(seo);
// Updates document.title, meta tags, canonical URL, structured data
```

**Parameters:**
- `seo: SEOMetaTags` - SEO data object

**Side Effects:**
- Updates `document.title`
- Injects/updates meta tags in `<head>`
- Sets canonical URL
- Injects JSON-LD structured data

#### `generateSitemapEntry(loc, lastmod, changefreq, priority)`
Generates a single sitemap entry.

```typescript
const entry = generateSitemapEntry(
  'https://day1health.co.za/provider/123',
  '2025-01-10',
  'monthly',
  0.7
);
// Returns: XML string for sitemap entry
```

**Parameters:**
- `loc: string` - Full URL
- `lastmod: string` - Last modification date (YYYY-MM-DD)
- `changefreq: string` - Change frequency (always, hourly, daily, weekly, monthly, yearly, never)
- `priority: number` - Priority (0.0 to 1.0)

**Returns:**
- `string` - XML formatted sitemap entry

### Usage Examples

#### In a React Component

```typescript
import { generateProviderSEO, setMetaTags } from '../utils/seoHelpers';

function ProviderPage() {
  useEffect(() => {
    // Fetch provider data
    const provider = await fetchProvider(id);
    
    // Generate SEO data
    const baseUrl = window.location.origin;
    const seo = generateProviderSEO(provider, baseUrl);
    
    // Apply to page
    setMetaTags(seo);
  }, [id]);
  
  return <div>Provider content</div>;
}
```

#### In Server Endpoint

```typescript
import { generateSitemapEntry } from '../utils/seoHelpers';

app.get('/api/sitemap.xml', async (req, res) => {
  // Fetch providers
  const providers = await supabase.from('providers').select('*');
  
  // Build sitemap
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset>...';
  
  providers.forEach(provider => {
    xml += generateSitemapEntry(
      `${baseUrl}/provider/${provider.id}`,
      provider.updated_at,
      'monthly',
      0.7
    );
  });
  
  xml += '</urlset>';
  res.send(xml);
});
```

### SEO Meta Tags Structure

```typescript
interface SEOMetaTags {
  title: string;              // Page title
  description: string;        // Meta description
  keywords: string[];         // Array of keywords
  ogTitle: string;           // Open Graph title
  ogDescription: string;     // Open Graph description
  ogImage: string;           // Open Graph image URL
  ogUrl: string;             // Open Graph URL
  canonicalUrl: string;      // Canonical URL
  structuredData: Record<string, any>; // JSON-LD schema
}
```

### Provider Type

```typescript
interface Provider {
  id?: string;
  REGION?: string;
  SUBURB?: string;
  ADDRESS?: string;
  'DOCTOR SURNAME'?: string;
  PRNO?: string;
  TEL?: string;
  FAX?: string;
  'DISPENSE/SCRIPT'?: string;
  PROVINCE?: string;
  profession?: string;
  profile_picture?: string;
}
```

### Healthcare Keywords

```typescript
const HEALTHCARE_KEYWORDS = {
  general: [
    'medical insurance',
    'health insurance',
    'healthcare',
    'medical aid',
    'insurance plans',
    'health coverage'
  ],
  gp: [
    'general practitioner',
    'GP',
    'family doctor',
    'primary care physician',
    'doctor near me'
  ],
  dentist: [
    'dentist',
    'dental care',
    'dental services',
    'teeth cleaning',
    'dental treatment'
  ],
  location: [
    'South Africa',
    'medical provider',
    'healthcare provider',
    'clinic',
    'practice'
  ]
};
```

### Sitemap Endpoint

**URL:** `/api/sitemap.xml`

**Method:** GET

**Response:** XML sitemap

**Cache:** 1 hour

**Example Response:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://day1health.co.za/</loc>
    <lastmod>2025-01-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://day1health.co.za/provider/123</loc>
    <lastmod>2025-01-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

### Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | AppWrapper | Homepage |
| `/directory` | DirectoryPage | Provider directory |
| `/provider/:id` | ProviderDetailPage | Individual provider |
| `/plans/*` | PlanDetailPage | Insurance plans |
| `/procedures` | ProceduresPage | Medical procedures |
| `/regulatory-information` | RegulatoryInformationPage | Compliance info |

### Environment Variables

```bash
# Required for SEO
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BASE_URL=https://day1health.co.za  # For production

# Optional
VITE_API_URL=http://localhost:3001  # For development
```

### Common Tasks

#### Add a New Provider Page
1. Provider data is fetched from Supabase
2. `generateProviderSEO()` creates SEO data
3. `setMetaTags()` applies to page
4. Sitemap automatically includes provider

#### Update Keywords
1. Edit `HEALTHCARE_KEYWORDS` in `seoHelpers.ts`
2. Keywords automatically apply to all pages
3. No need to update individual pages

#### Test SEO
1. Visit provider page
2. Right-click → Inspect → Elements
3. Look for meta tags in `<head>`
4. Check for `<script type="application/ld+json">`

#### Debug Sitemap
1. Visit `/api/sitemap.xml`
2. Check for all providers
3. Verify URLs are correct
4. Check lastmod dates

#### Monitor Rankings
1. Go to Google Search Console
2. Check "Performance" tab
3. Review impressions and clicks
4. Analyze top keywords

### Troubleshooting

#### Meta tags not showing
```typescript
// Check if setMetaTags is called
console.log('Setting meta tags:', seo);
setMetaTags(seo);

// Verify in DevTools
document.title; // Should be updated
document.querySelector('meta[name="description"]'); // Should exist
```

#### Sitemap not generating
```javascript
// Check server logs
node server.js

// Verify Supabase connection
const { data, error } = await supabase.from('providers').select('*');
console.log(error); // Check for errors

// Test endpoint
curl http://localhost:3001/api/sitemap.xml
```

#### Provider not indexed
```typescript
// Check robots.txt
// Verify provider page is linked from directory
// Check Google Search Console for errors
// Submit URL manually to Google
```

### Performance Tips

1. **Lazy Load Components**
   ```typescript
   const ProviderDetailPage = lazy(() => import('./ProviderDetailPage'));
   ```

2. **Cache Sitemap**
   ```javascript
   res.setHeader('Cache-Control', 'public, max-age=3600');
   ```

3. **Optimize Images**
   - Use WebP format
   - Compress before uploading
   - Add alt text

4. **Minimize Bundle**
   - Code splitting
   - Tree shaking
   - Remove unused code

### Testing Checklist

- [ ] Provider page loads correctly
- [ ] Meta tags are in document head
- [ ] Structured data is valid JSON
- [ ] Sitemap generates without errors
- [ ] Robots.txt is accessible
- [ ] Page load time < 3 seconds
- [ ] Mobile responsive
- [ ] No console errors

### Deployment Checklist

- [ ] Update `VITE_BASE_URL` to production
- [ ] Verify Supabase credentials
- [ ] Test all pages on staging
- [ ] Verify sitemap generation
- [ ] Test robots.txt
- [ ] Validate structured data
- [ ] Test Open Graph tags
- [ ] Monitor Search Console

### Useful Links

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Validator](https://validator.schema.org/)
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Search Console](https://search.google.com/search-console)

### Support

For issues:
1. Check browser console for errors
2. Check server logs
3. Verify Supabase connection
4. Review documentation files
5. Validate with online tools

---

**Last Updated:** January 10, 2026
**Version:** 1.0
