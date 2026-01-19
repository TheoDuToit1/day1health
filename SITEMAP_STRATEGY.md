# Sitemap Strategy - Quality-Filtered Directory SEO

## 🎯 Philosophy

**We don't dump everything into the sitemap blindly.**

We only include **high-quality, complete provider profiles** that can actually rank and provide value to searchers.

## ✅ Quality Criteria for Sitemap Inclusion

A provider profile is included in the sitemap ONLY if it has:

1. ✅ **Doctor Name** (critical - 40 points)
2. ✅ **Specialty/Profession** (very important - 30 points)
3. ✅ **Location** (Suburb OR Province) (important - 20 points)
4. ⭐ **Contact Info** (nice to have - 10 points)

**Minimum Score Required: 90/100**

This means: Name + Specialty + Location are **mandatory**.

## 📊 Quality Scoring System

```typescript
Score Breakdown:
- 100 points = Excellent (all fields complete)
- 90-99 points = Good (name, specialty, location + partial contact)
- 70-89 points = Fair (missing location or specialty)
- <70 points = Poor (excluded from sitemap)
```

## 🗂️ Sitemap Structure (Best Practice)

### Main Sitemap Index
**URL:** `/api/sitemap-index`

References two sub-sitemaps:
1. Main sitemap (static pages + directory landing)
2. Directory sitemap (provider profiles)

### 1. Main Sitemap
**URL:** `/api/generate-sitemap`

Contains:
- Homepage (priority: 1.0, daily)
- Plan pages (priority: 0.8, monthly)
- Procedures (priority: 0.6, yearly)
- Regulatory info (priority: 0.6, yearly)
- Directory landing page (priority: 0.9, weekly)

### 2. Directory Sitemap (Separate)
**URL:** `/api/sitemap-directory`

Contains:
- `/directory` (priority: 0.9, weekly)
- `/directory/{slug}` for each **quality** provider (priority: 0.7, monthly)

**Why separate?**
- Keeps crawl logic clean
- Easier to regenerate directory independently
- Better for large provider lists (1000+)
- Clearer analytics

## 🚫 What We EXCLUDE

### Never Include:
- ❌ Incomplete profiles (missing name/specialty/location)
- ❌ Test accounts
- ❌ Duplicate entries
- ❌ Legacy URLs (`/medical-directory/*`)
- ❌ Parameter URLs (`?v=123`)
- ❌ URLs returning 404 or 410
- ❌ Profiles with score < 90

### Why?
Google penalizes "thin mass listings" - low-quality directory pages that don't provide value.

## 📈 Rollout Strategy (Recommended)

### Phase 1: Start Small (Week 1)
- Include only **top 50 complete profiles**
- Let Google crawl and index
- Monitor Search Console for:
  - Indexing status
  - Crawl errors
  - Impressions

### Phase 2: Expand Gradually (Week 2-4)
- Add next 100 quality profiles
- Monitor trust signals:
  - Click-through rate
  - Average position
  - "Discovered - not indexed" warnings

### Phase 3: Full Rollout (Month 2+)
- Include all quality providers (score >= 90)
- Exclude low-quality profiles
- Regenerate weekly

### Why Gradual?
Prevents Google from flagging the site as "mass-generated content."

## 🔄 Update Frequency

| Sitemap | Update When | Frequency |
|---------|-------------|-----------|
| Main | Static pages change | As needed |
| Directory | New provider added/removed | Weekly |
| Index | Sub-sitemap changes | Weekly |

## 📊 Monitoring & Analytics

### Google Search Console Metrics to Track:

1. **Coverage Report**
   - Valid pages
   - Excluded pages
   - Errors

2. **Performance Report**
   - Impressions for `/directory/*` URLs
   - CTR by provider
   - Average position

3. **Sitemaps Report**
   - Submitted URLs
   - Indexed URLs
   - Ratio (should be >80%)

### Expected Results (3-6 months):

- ✅ 80%+ of submitted URLs indexed
- ✅ Long-tail traffic ("Dr Kent Cape Town")
- ✅ Low "Discovered - not indexed" rate
- ✅ Increasing impressions for provider names

## 🧪 Quality Validation Script

Before submitting sitemap, run this check:

```bash
# Pick 5 random provider URLs from sitemap
# For each URL:
1. Open in incognito
2. View source (Ctrl+U)
3. Verify visible:
   - Doctor name
   - Specialty
   - Location
   - Contact info
4. Check meta tags present
5. Check structured data present
```

If all 5 pass → sitemap ready.

## 🚨 Red Flags to Watch For

### In Google Search Console:

❌ **"Discovered - not indexed"** for many directory pages
→ Quality issue - profiles too thin

❌ **"Crawled - currently not indexed"**
→ Google doesn't see value - improve content

❌ **Low indexing ratio** (<50%)
→ Too many low-quality profiles in sitemap

❌ **Manual action warning**
→ Thin content penalty - remove low-quality profiles immediately

## 💡 Pro Tips

### 1. Use `<lastmod>` Properly
```xml
<url>
  <loc>https://day1health.co.za/directory/dr-kent</loc>
  <lastmod>2026-01-18</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

Update `lastmod` when:
- Provider info changes
- Profile picture added
- Contact details updated

### 2. Priority Guidelines
- 1.0 = Homepage only
- 0.9 = Directory landing
- 0.8 = Key plan pages
- 0.7 = Provider profiles
- 0.6 = Supporting pages

### 3. Changefreq Reality Check
- `daily` = Homepage, blog
- `weekly` = Directory landing
- `monthly` = Provider profiles
- `yearly` = Static legal pages

Don't lie - Google ignores if you say "daily" but never update.

## 📁 File Structure

```
api/
├── generate-sitemap.ts      # Main sitemap (static pages)
├── sitemap-directory.ts     # Directory sitemap (providers)
└── sitemap-index.ts         # Sitemap index (references both)

src/directory/utils/
└── sitemapQuality.ts        # Quality evaluation logic
```

## 🔗 Submission URLs

### Google Search Console:
1. Submit: `https://day1health.co.za/api/sitemap-index`
2. Or submit both:
   - `https://day1health.co.za/api/generate-sitemap`
   - `https://day1health.co.za/api/sitemap-directory`

### robots.txt:
```
Sitemap: https://day1health.co.za/api/sitemap-index
```

## ✅ Success Checklist

Before going live:

- [ ] Quality filtering implemented (score >= 90)
- [ ] Separate directory sitemap created
- [ ] Sitemap index references both sitemaps
- [ ] Legacy URLs excluded
- [ ] Test 5 random provider URLs
- [ ] All have complete data
- [ ] Meta tags present
- [ ] Structured data present
- [ ] No 404s in sitemap
- [ ] `lastmod` dates accurate
- [ ] robots.txt updated
- [ ] Submitted to Search Console

## 🎯 Expected Outcomes

### Month 1:
- 50-100 provider pages indexed
- Long-tail impressions start appearing
- CTR: 2-5%

### Month 3:
- 80%+ quality providers indexed
- Branded searches ("Dr Kent Day1Health")
- CTR: 5-10%

### Month 6:
- Directory becomes traffic source
- Local searches ranking
- CTR: 10-15%
- Backlinks to provider profiles

## 🚀 Next Steps

1. **Deploy** quality-filtered sitemaps
2. **Submit** to Google Search Console
3. **Monitor** indexing progress weekly
4. **Expand** gradually based on trust signals
5. **Optimize** low-performing profiles
6. **Remove** profiles that don't index after 3 months

---

**Remember:** Quality over quantity. 100 excellent profiles beat 1000 thin ones.
