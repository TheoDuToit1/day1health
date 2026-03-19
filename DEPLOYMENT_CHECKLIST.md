# Deployment Checklist - Directory Routing

## 🚀 Pre-Deployment

### Code Quality
- [x] All TypeScript errors resolved
- [x] No console errors in dev mode
- [x] All routes tested locally
- [x] Quality filtering implemented
- [x] 404 handling in place

### Files Updated
- [x] `src/directory/DirectoryPage.tsx` - Slug routing
- [x] `src/App.tsx` - Route definitions
- [x] `vercel.json` - 301 redirects
- [x] `api/generate-sitemap.ts` - Quality filtering
- [x] `public/sitemap.xml` - Sitemap index
- [x] `public/robots.txt` - Updated references

### New Files Created
- [x] `src/directory/utils/slugHelpers.ts`
- [x] `src/directory/utils/providerSEO.ts`
- [x] `src/directory/utils/sitemapQuality.ts`
- [x] `api/sitemap-directory.ts`
- [x] `api/sitemap-index.ts`

## 📦 Build & Deploy

### 1. Build Production Bundle
```bash
npm run build
```

**Verify:**
- [ ] Build completes without errors
- [ ] No warnings about large chunks
- [ ] Output size is reasonable

### 2. Test Production Build Locally
```bash
npm run preview
```

**Test these URLs:**
- [ ] http://localhost:4173/directory
- [ ] http://localhost:4173/directory/dr-test-provider
- [ ] http://localhost:4173/directory/invalid-slug (should 404)

### 3. Deploy to Vercel
```bash
vercel --prod
```

**Or via Git:**
- [ ] Push to main branch
- [ ] Vercel auto-deploys
- [ ] Wait for deployment to complete

## ✅ Post-Deployment Testing

### Route Testing (Production)

Test each route in production:

1. **Directory Landing**
   - [ ] Visit: https://day1health.co.za/directory
   - [ ] Page loads successfully
   - [ ] Provider cards visible
   - [ ] Search and filters work

2. **Provider Profile (Direct Link)**
   - [ ] Visit: https://day1health.co.za/directory/dr-{actual-slug}
   - [ ] Profile opens automatically
   - [ ] Directory grid visible in background
   - [ ] Meta tags present (view source)

3. **Invalid Slug**
   - [ ] Visit: https://day1health.co.za/directory/nonexistent-xyz
   - [ ] Shows 404 page
   - [ ] Does NOT redirect to homepage
   - [ ] "Browse All Providers" button works

4. **Navigation Flow**
   - [ ] Click provider card → URL updates
   - [ ] Profile opens without page reload
   - [ ] Click back button → Returns to /directory
   - [ ] Sidebar closes
   - [ ] Scroll position maintained

5. **Refresh Test**
   - [ ] Open profile via slug URL
   - [ ] Refresh page (F5)
   - [ ] Profile stays open
   - [ ] No errors in console

6. **Incognito Test**
   - [ ] Copy profile URL
   - [ ] Open in incognito/private window
   - [ ] Profile opens correctly
   - [ ] All content visible

### Sitemap Testing

1. **Sitemap Index**
   - [ ] Visit: https://day1health.co.za/sitemap.xml
   - [ ] Returns valid XML
   - [ ] References both sub-sitemaps
   - [ ] No errors

2. **Main Sitemap**
   - [ ] Visit: https://day1health.co.za/api/generate-sitemap
   - [ ] Returns valid XML
   - [ ] Contains static pages
   - [ ] Contains /directory landing page
   - [ ] Quality providers included

3. **Directory Sitemap**
   - [ ] Visit: https://day1health.co.za/api/sitemap-directory
   - [ ] Returns valid XML
   - [ ] Contains /directory landing
   - [ ] Contains provider slug URLs (not ID-based)
   - [ ] Only quality providers included
   - [ ] Check sample URLs are valid

4. **Sitemap Validation**
   - [ ] Use: https://www.xml-sitemaps.com/validate-xml-sitemap.html
   - [ ] Paste sitemap index URL
   - [ ] Verify no errors
   - [ ] Check URL count is reasonable

### Legacy URL Redirects

Test 301 redirects:

1. **Directory Redirect**
   - [ ] Visit: https://day1health.co.za/medical-directory
   - [ ] Redirects to: https://day1health.co.za/directory
   - [ ] HTTP 301 status (check network tab)

2. **Provider Redirect**
   - [ ] Visit: https://day1health.co.za/medical-directory/dr-test
   - [ ] Redirects to: https://day1health.co.za/directory/dr-test
   - [ ] HTTP 301 status

### SEO Verification

For a sample provider profile:

1. **View Page Source** (Ctrl+U)
   - [ ] Doctor name visible in HTML
   - [ ] Specialty visible
   - [ ] Location visible
   - [ ] Contact info visible
   - [ ] Not just empty divs

2. **Meta Tags**
   - [ ] `<title>` includes doctor name
   - [ ] `<meta name="description">` is unique
   - [ ] `<link rel="canonical">` points to itself
   - [ ] Open Graph tags present
   - [ ] Twitter Card tags present

3. **Structured Data**
   - [ ] `<script type="application/ld+json">` present
   - [ ] Contains MedicalBusiness schema
   - [ ] Has doctor name, location, specialty
   - [ ] Valid JSON (no syntax errors)

4. **Rich Results Test**
   - [ ] Visit: https://search.google.com/test/rich-results
   - [ ] Enter profile URL
   - [ ] Run test
   - [ ] Verify structured data detected
   - [ ] No errors or warnings

5. **Mobile-Friendly Test**
   - [ ] Visit: https://search.google.com/test/mobile-friendly
   - [ ] Enter profile URL
   - [ ] Run test
   - [ ] Verify page is mobile-friendly

### Social Media Sharing

1. **Facebook Debugger**
   - [ ] Visit: https://developers.facebook.com/tools/debug/
   - [ ] Enter profile URL
   - [ ] Scrape
   - [ ] Verify OG tags detected
   - [ ] Image, title, description correct

2. **Twitter Card Validator**
   - [ ] Visit: https://cards-dev.twitter.com/validator
   - [ ] Enter profile URL
   - [ ] Preview card
   - [ ] Verify card renders correctly

3. **LinkedIn Post Inspector**
   - [ ] Visit: https://www.linkedin.com/post-inspector/
   - [ ] Enter profile URL
   - [ ] Inspect
   - [ ] Verify preview looks good

## 🔍 Google Search Console Setup

### 1. Submit Sitemap

1. **Login to Search Console**
   - [ ] Visit: https://search.google.com/search-console
   - [ ] Select day1health.co.za property

2. **Submit Sitemap Index**
   - [ ] Go to: Sitemaps section
   - [ ] Add new sitemap
   - [ ] Enter: `sitemap.xml`
   - [ ] Submit
   - [ ] Wait for processing (can take hours/days)

3. **Verify Submission**
   - [ ] Check status shows "Success"
   - [ ] Note number of discovered URLs
   - [ ] Check for any errors

### 2. Monitor Indexing

**Week 1:**
- [ ] Check Coverage report daily
- [ ] Look for "Valid" pages increasing
- [ ] Check for errors or warnings
- [ ] Fix any issues immediately

**Week 2-4:**
- [ ] Monitor indexing ratio (submitted vs indexed)
- [ ] Target: >80% indexed
- [ ] Check "Discovered - not indexed" count
- [ ] Should be low due to quality filtering

**Month 2+:**
- [ ] Monitor Performance report
- [ ] Look for impressions on `/directory/*` URLs
- [ ] Check CTR and average position
- [ ] Identify top-performing profiles

### 3. Check for Issues

Common issues to watch for:

- [ ] **"Discovered - not indexed"** - Too many = quality issue
- [ ] **"Crawled - currently not indexed"** - Google doesn't see value
- [ ] **"Soft 404"** - Page returns 200 but looks like 404
- [ ] **"Duplicate content"** - Multiple URLs for same content
- [ ] **"Redirect error"** - 301 redirects not working

## 📊 Analytics Setup

### Google Analytics

1. **Set Up Events**
   - [ ] Track profile views
   - [ ] Track sidebar opens
   - [ ] Track "Contact" button clicks
   - [ ] Track search usage

2. **Create Custom Reports**
   - [ ] Directory traffic report
   - [ ] Top provider profiles
   - [ ] Search queries leading to profiles
   - [ ] Conversion funnel

### Monitor These Metrics

**Traffic:**
- [ ] Organic sessions to `/directory/*`
- [ ] Direct traffic (shared links)
- [ ] Referral traffic

**Engagement:**
- [ ] Bounce rate (<60% is good)
- [ ] Time on page (>1 min is good)
- [ ] Pages per session
- [ ] Scroll depth

**Conversions:**
- [ ] Contact form submissions
- [ ] Phone clicks
- [ ] Email clicks
- [ ] Plan page visits from directory

## 🎯 Success Criteria

### Week 1
- [ ] All routes working in production
- [ ] No 404 errors (except invalid slugs)
- [ ] Sitemap submitted to Search Console
- [ ] No crawl errors

### Month 1
- [ ] 50-100 provider pages indexed
- [ ] Indexing ratio >60%
- [ ] Long-tail impressions appearing
- [ ] No manual actions or penalties

### Month 3
- [ ] 80%+ quality providers indexed
- [ ] Indexing ratio >80%
- [ ] Organic traffic to directory
- [ ] CTR 5-10%

### Month 6
- [ ] 90%+ quality providers indexed
- [ ] Directory is traffic source
- [ ] Local searches ranking
- [ ] CTR 10-15%
- [ ] Backlinks to profiles

## 🚨 Rollback Plan

If critical issues occur:

### Immediate Rollback
```bash
# Revert to previous deployment
vercel rollback
```

### Partial Rollback
- [ ] Remove sitemap submission from Search Console
- [ ] Revert specific files via Git
- [ ] Redeploy

### Issues That Require Rollback
- [ ] Site completely broken
- [ ] All directory pages 404
- [ ] Infinite redirect loops
- [ ] Database connection failures
- [ ] Critical SEO penalty

## 📞 Support Contacts

**Technical Issues:**
- Check documentation in repo
- Review error logs in Vercel
- Check browser console

**SEO Issues:**
- Review Google Search Console
- Check sitemap validity
- Verify meta tags in source

**Emergency:**
- Rollback deployment
- Contact team lead
- Document issue for post-mortem

## ✅ Final Sign-Off

Before marking deployment complete:

- [ ] All routes tested and working
- [ ] Sitemaps submitted and processing
- [ ] No critical errors in Search Console
- [ ] Analytics tracking verified
- [ ] Team notified of deployment
- [ ] Documentation updated
- [ ] Monitoring in place

**Deployed by:** _________________

**Date:** _________________

**Deployment URL:** https://day1health.co.za

**Sitemap URL:** https://day1health.co.za/sitemap.xml

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## 🎉 Post-Deployment

Congratulations! The SEO-optimized directory routing is now live.

**Next Steps:**
1. Monitor Search Console daily for first week
2. Check analytics for traffic patterns
3. Optimize low-performing profiles
4. Gradually expand quality provider list
5. Build backlinks to top profiles

**Remember:** Quality over quantity. Better to have 100 excellent profiles indexed than 1000 thin ones.
