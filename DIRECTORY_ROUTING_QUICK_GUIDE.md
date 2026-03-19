# Directory Routing - Quick Reference Guide

## 🎯 What Changed?

Provider profiles now have **SEO-friendly URLs** with **quality-filtered sitemaps**:

### Before:
```
/provider/abc123-def456-ghi789
```

### After:
```
/directory/dr-john-smith-sandton
```

## 🔗 URL Structure

| Route | Purpose | Example |
|-------|---------|---------|
| `/directory` | Browse all providers | Main directory page |
| `/directory/:slug` | View specific provider | `/directory/dr-jane-doe-cape` |

## 🗺️ Sitemap Structure (NEW!)

### Sitemap Index (Best Practice)
**URL:** `/api/sitemap-index`

References:
1. **Main Sitemap** (`/api/generate-sitemap`) - Static pages
2. **Directory Sitemap** (`/api/sitemap-directory`) - Provider profiles

### Quality Filtering
Only providers with **complete profiles** are included:
- ✅ Name (required)
- ✅ Specialty (required)
- ✅ Location (required)
- ⭐ Contact (bonus)

**Minimum Score: 90/100**

This prevents Google penalties for "thin content."

## 🧪 Quick Test

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test these URLs:**
   - http://localhost:3000/directory
   - http://localhost:3000/directory/dr-test-provider
   - http://localhost:3000/directory/invalid-slug (should show 404)

3. **Test sitemaps:**
   - http://localhost:3000/api/sitemap-index
   - http://localhost:3000/api/generate-sitemap
   - http://localhost:3000/api/sitemap-directory

4. **Verify:**
   - ✅ Profile opens automatically
   - ✅ URL updates when clicking cards
   - ✅ Back button works
   - ✅ Refresh keeps profile open
   - ✅ 404 for invalid slugs
   - ✅ Only quality providers in sitemap

## 📝 How It Works

### 1. Slug Generation
```typescript
// Automatic slug creation from provider data
generateProviderSlug(provider)
// Input: { "DOCTOR SURNAME": "Dr. John Smith", "SUBURB": "Sandton" }
// Output: "dr-john-smith-sandton"
```

### 2. Quality Filtering (NEW!)
```typescript
// Only complete profiles in sitemap
isQualityProvider(provider)
// Checks: name + specialty + location
// Returns: true/false
```

### 3. Navigation
```typescript
// Old way (DON'T USE):
onClick={() => setSelectedProvider(provider)}

// New way (USE THIS):
onClick={() => handleProviderClick(provider)}
// This navigates to /directory/{slug}
```

### 4. URL → State
```typescript
// URL is the source of truth
const { slug } = useParams();

// Automatically loads provider from slug
useEffect(() => {
  if (slug) {
    const provider = findProviderBySlug(allpartners, slug);
    setSelectedProvider(provider);
  }
}, [slug]);
```

## 🔧 Key Files

| File | Purpose |
|------|---------|
| `src/directory/utils/slugHelpers.ts` | Slug generation & parsing |
| `src/directory/utils/providerSEO.ts` | SEO meta tags |
| `src/directory/utils/sitemapQuality.ts` | **Quality filtering (NEW!)** |
| `src/directory/DirectoryPage.tsx` | Main directory component |
| `src/App.tsx` | Route definitions |
| `vercel.json` | Redirects & rewrites |
| `api/generate-sitemap.ts` | Main sitemap (static pages) |
| `api/sitemap-directory.ts` | **Directory sitemap (NEW!)** |
| `api/sitemap-index.ts` | **Sitemap index (NEW!)** |
| `public/robots.txt` | Updated with sitemap index |

## � Cosmmon Issues & Solutions

### Issue: Profile doesn't open on direct URL visit
**Solution:** Check that `useEffect` with slug dependency is running

### Issue: URL doesn't update when clicking cards
**Solution:** Ensure using `handleProviderClick()` not `setSelectedProvider()`

### Issue: 404 for valid provider
**Solution:** Check slug format matches `generateProviderSlug()` output

### Issue: Back button doesn't work
**Solution:** Verify using `navigate()` not `window.location`

### Issue: Too many "Discovered - not indexed" in Search Console
**Solution:** Quality filtering is working - only complete profiles are submitted

## 📊 SEO Checklist

For each `/directory/:slug` page, verify:

- [ ] Title tag includes doctor name
- [ ] Meta description is unique
- [ ] Canonical URL is correct
- [ ] Open Graph tags present
- [ ] Structured data (Schema.org)
- [ ] Doctor name in HTML (not just JS)
- [ ] **Only in sitemap if quality score >= 90**

## 🔍 Debug Commands

```bash
# Check for TypeScript errors
npm run lint

# Build for production
npm run build

# Test production build locally
npm run preview

# Test sitemap generation
curl http://localhost:3000/api/sitemap-index
curl http://localhost:3000/api/sitemap-directory
```

## 📱 Testing Checklist

- [ ] Desktop browser
- [ ] Mobile browser
- [ ] Incognito mode
- [ ] Direct URL access
- [ ] Page refresh
- [ ] Back/forward buttons
- [ ] Social media sharing
- [ ] View page source (Ctrl+U)
- [ ] **Sitemap only includes quality providers**
- [ ] **Sitemap index references both sitemaps**

## 🎨 User Experience

### Expected Behavior:

1. **Click provider card** → URL changes to `/directory/{slug}`, sidebar opens
2. **Click close/back** → URL changes to `/directory`, sidebar closes
3. **Share URL** → Recipient sees same profile open
4. **Refresh page** → Profile stays open
5. **Invalid slug** → Shows 404 page with navigation option

## 🚀 Deployment

1. **Build:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Post-deployment:**
   - Test all routes in production
   - **Submit sitemap index to Google Search Console**
   - Verify 301 redirects work
   - Check social media preview cards
   - **Monitor indexing ratio (should be >80%)**

## 📈 Google Search Console Setup

1. **Submit Sitemap Index:**
   ```
   https://day1health.co.za/api/sitemap-index
   ```

2. **Monitor:**
   - Coverage report (valid vs excluded)
   - Performance (impressions for `/directory/*`)
   - Sitemaps report (submitted vs indexed ratio)

3. **Expected Results (3-6 months):**
   - 80%+ indexing ratio
   - Long-tail traffic ("Dr Kent Cape Town")
   - Low "Discovered - not indexed" rate

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify URL format matches slug pattern
3. Check network tab for failed requests
4. **Verify provider meets quality criteria**
5. Review `SITEMAP_STRATEGY.md` for details
6. Check `DIRECTORY_ROUTING_IMPLEMENTATION.md` for technical details

## ✅ Success Indicators

- URLs are human-readable
- Direct links work
- Back button works
- No page reloads on navigation
- SEO meta tags present
- 404 for invalid slugs
- Legacy URLs redirect
- **Only quality providers in sitemap**
- **Sitemap index structure in place**
- **High indexing ratio in Search Console**

## 🎯 Quality Filtering Benefits

1. **Prevents Google Penalties** - No thin content
2. **Higher Indexing Ratio** - Google trusts quality
3. **Better Rankings** - Complete profiles rank better
4. **Cleaner Analytics** - Focus on valuable pages
5. **Gradual Rollout** - Build trust over time

---

**Key Takeaway:** We're not just making URLs pretty - we're building a **quality-first directory** that Google will trust and rank.

