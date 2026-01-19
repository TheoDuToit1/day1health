# Fix: Sitemap Error on Vercel

## ❌ The Error You're Seeing

```json
{"error":"Failed to generate directory sitemap"}
```

When visiting: `https://day1health.co.za/api/sitemap-directory`

## 🔍 Why This Happens

Your API routes (sitemaps) need to connect to Supabase database, but **Vercel doesn't automatically pass your environment variables to serverless functions**.

Your `.env.local` file works locally, but Vercel needs the variables configured in its dashboard.

## ✅ How to Fix (5 minutes)

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/
2. Login
3. Click on your `day1health` project

### Step 2: Add Environment Variables

1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)
3. Add these two variables:

**Variable 1:**
```
Name: SUPABASE_URL
Value: https://penvtncreoyymdcgzkjx.supabase.co
```

**Variable 2:**
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbnZ0bmNyZW95eW1kY2d6a2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MTg3MDEsImV4cCI6MjA4MTA5NDcwMX0.MKZPz0sqBSIgVcd1ATio2iFsjMgrMfgKeatMkNYR_TY
```

4. **Important:** For each variable, select:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. Click **Save** for each

### Step 3: Redeploy

After adding the variables, you need to redeploy:

**Option A: Trigger redeploy in Vercel**
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

**Option B: Push a small change**
```bash
git commit --allow-empty -m "Trigger redeploy for env vars"
git push
```

### Step 4: Test

Wait 1-2 minutes for deployment, then test:

1. Visit: `https://day1health.co.za/api/sitemap-directory`
2. You should see XML (not an error)
3. Visit: `https://day1health.co.za/api/generate-sitemap`
4. Should also work
5. Visit: `https://day1health.co.za/sitemap.xml`
6. Should show sitemap index

## 🎯 What Should Work After Fix

### ✅ These URLs should return XML:

1. **Sitemap Index:**
   ```
   https://day1health.co.za/sitemap.xml
   ```
   Shows: List of sub-sitemaps

2. **Main Sitemap:**
   ```
   https://day1health.co.za/api/generate-sitemap
   ```
   Shows: Static pages (homepage, plans, etc.)

3. **Directory Sitemap:**
   ```
   https://day1health.co.za/api/sitemap-directory
   ```
   Shows: Directory landing + quality doctor profiles

## 🚨 If Still Not Working

### Check Vercel Logs:

1. Go to Vercel dashboard
2. Click **Deployments**
3. Click on latest deployment
4. Click **Functions** tab
5. Find `api/sitemap-directory`
6. Check the logs for errors

### Common Issues:

**Issue 1: "Missing Supabase configuration"**
- Solution: Environment variables not set correctly
- Double-check spelling: `SUPABASE_URL` and `SUPABASE_ANON_KEY`

**Issue 2: "Supabase error"**
- Solution: Database connection issue
- Check if Supabase is accessible
- Verify the URL and key are correct

**Issue 3: Still getting JSON error**
- Solution: Old deployment cached
- Force redeploy
- Clear browser cache
- Try in incognito mode

## 📝 Why We Need Two Sets of Variables

**Local Development (`.env.local`):**
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
- Used by Vite (your frontend)
- Prefix `VITE_` makes them available in browser

**Vercel Serverless Functions:**
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```
- Used by API routes (backend)
- No `VITE_` prefix
- Set in Vercel dashboard

The code checks for both:
```typescript
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
```

## ✅ Verification Checklist

After fixing, verify:

- [ ] `https://day1health.co.za/sitemap.xml` returns XML
- [ ] `https://day1health.co.za/api/generate-sitemap` returns XML
- [ ] `https://day1health.co.za/api/sitemap-directory` returns XML
- [ ] No JSON errors
- [ ] Doctor profiles listed in directory sitemap
- [ ] Can submit sitemap to Google Search Console

## 🎉 Once Fixed

After sitemaps work:

1. **Submit to Google Search Console:**
   - URL: `https://day1health.co.za/sitemap.xml`
   
2. **Monitor indexing:**
   - Check Search Console after 24-48 hours
   - Look for indexed pages increasing

3. **Verify quality filtering:**
   - Check directory sitemap
   - Should only show complete doctor profiles
   - Not all 1000+ doctors (only quality ones)

---

**Need Help?**
- Check Vercel logs for specific errors
- Verify environment variables are saved
- Make sure you redeployed after adding variables
