# Social Media Sharing - Meta Tags Issue

## 🚨 The Problem

When you share `/directory/dr-name` links on social media, they show the default site meta tags instead of the doctor's info.

**Why?** Social media crawlers (Facebook, WhatsApp, Twitter) don't execute JavaScript. They only read the initial HTML from `index.html`, which has the default meta tags.

## ✅ What I Fixed (Partial)

I updated the code to set meta tags IMMEDIATELY from the slug (before data loads). This helps with:
- Google SEO (Googlebot executes JavaScript)
- Users who visit the page directly
- Browser tab titles

But it **doesn't help** with social media previews because they don't run JavaScript.

## 🔧 Quick Fix (Do This Now)

### Force Social Media to Re-Scrape:

1. **Facebook/WhatsApp:**
   - Go to: https://developers.facebook.com/tools/debug/
   - Paste your URL: `https://day1health.co.za/directory/dr-abderoof-am-salie-s-cape-town`
   - Click "Scrape Again"
   - The preview will update

2. **LinkedIn:**
   - Go to: https://www.linkedin.com/post-inspector/
   - Paste your URL
   - Click "Inspect"

3. **Twitter:**
   - Go to: https://cards-dev.twitter.com/validator
   - Paste your URL
   - Preview will update

**Note:** After you do this once, future shares will work correctly for ~7 days (cache period).

## 🎯 Permanent Solutions

### Option 1: Prerender.io (EASIEST - Recommended)

**What it does:** Intercepts crawler requests and serves pre-rendered HTML with correct meta tags.

**Setup:**
1. Sign up at https://prerender.io (free tier: 250 pages/month)
2. Add this to `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/directory/:slug",
      "has": [
        {
          "type": "header",
          "key": "user-agent",
          "value": ".*(bot|crawler|spider|facebook|twitter|whatsapp).*"
        }
      ],
      "destination": "https://service.prerender.io/https://day1health.co.za/directory/:slug"
    }
  ]
}
```

3. Set environment variable in Vercel:
   ```
   PRERENDER_TOKEN=your_token_here
   ```

**Cost:** Free for 250 pages/month, then $20/month

---

### Option 2: Switch to Next.js (BEST LONG-TERM)

**What it does:** Server-Side Rendering - generates HTML on the server with correct meta tags.

**Pros:**
- Perfect SEO
- Perfect social media sharing
- Better performance
- Industry standard

**Cons:**
- Requires migration (2-3 days of work)
- Learning curve if unfamiliar with Next.js

**Migration steps:**
1. Create new Next.js project
2. Move components to `app/` directory
3. Convert routes to Next.js App Router
4. Deploy

---

### Option 3: Vercel Edge Functions (COMPLEX)

**What it does:** Intercepts requests at the edge and injects meta tags before serving HTML.

**Setup:** Create `middleware.ts` (requires Next.js or custom setup)

**Pros:**
- Fast
- No external service

**Cons:**
- Complex to implement
- Requires Next.js or custom Vercel config

---

### Option 4: React-Snap (MEDIUM COMPLEXITY)

**What it does:** Pre-renders your React app to static HTML at build time.

**Setup:**
1. Install:
   ```bash
   npm install --save-dev react-snap
   ```

2. Update `package.json`:
   ```json
   {
     "scripts": {
       "postbuild": "react-snap"
     }
   }
   ```

3. Update `src/main.tsx`:
   ```typescript
   import { hydrate, render } from 'react-dom';
   
   const rootElement = document.getElementById('root');
   if (rootElement.hasChildNodes()) {
     hydrate(<App />, rootElement);
   } else {
     render(<App />, rootElement);
   }
   ```

**Pros:**
- Works with current setup
- No external service
- Free

**Cons:**
- Increases build time
- May have issues with dynamic routes
- Requires configuration for 1000+ pages

---

## 📊 Comparison

| Solution | Difficulty | Cost | Effectiveness | Recommended |
|----------|-----------|------|---------------|-------------|
| Prerender.io | Easy | $0-20/mo | ⭐⭐⭐⭐⭐ | ✅ Yes (quick fix) |
| Next.js | Hard | Free | ⭐⭐⭐⭐⭐ | ✅ Yes (long-term) |
| Edge Functions | Hard | Free | ⭐⭐⭐⭐ | ⚠️ Complex |
| React-Snap | Medium | Free | ⭐⭐⭐ | ⚠️ May have issues |
| Manual refresh | Easy | Free | ⭐⭐ | ❌ Temporary only |

## 🎯 My Recommendation

**For now (this week):**
1. Use the Facebook Debugger to refresh link previews manually
2. This will work for the next 7 days

**For permanent fix (next sprint):**
1. Sign up for Prerender.io (free tier)
2. Add the rewrite rule to `vercel.json`
3. Test with Facebook Debugger
4. Done! All future shares will work automatically

**Long-term (next quarter):**
- Consider migrating to Next.js for better SEO and performance
- This is the industry standard for React apps that need SEO

## 🧪 Testing

After implementing any solution, test with:

1. **Facebook Debugger:**
   ```
   https://developers.facebook.com/tools/debug/
   ```

2. **LinkedIn Inspector:**
   ```
   https://www.linkedin.com/post-inspector/
   ```

3. **Twitter Validator:**
   ```
   https://cards-dev.twitter.com/validator
   ```

4. **WhatsApp:**
   - Just share the link in a chat
   - Check the preview

## ✅ Success Criteria

After fixing, you should see:
- ✅ Doctor name in preview title
- ✅ Doctor specialty and location in description
- ✅ Correct image (if available)
- ✅ Correct URL

## 📞 Need Help?

If you choose Prerender.io and need help setting it up, let me know!

---

**Current Status:**
- ✅ Meta tags update immediately in browser
- ✅ Google will index correctly
- ❌ Social media crawlers still see default tags (need one of the solutions above)
