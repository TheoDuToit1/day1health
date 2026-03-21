# Deployment Guide - Day1Health AI Chatbot

Complete guide for deploying the chatbot to production.

## Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Anthropic API key (Claude)
- Hosting account (Vercel recommended)
- Domain name (optional)

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and region
4. Set database password (save this!)
5. Wait for project to be created

### 1.2 Run Database Schema

1. Open Supabase SQL Editor
2. Copy contents of `database/schema.sql`
3. Paste and execute
4. Verify tables are created

### 1.3 Seed Initial Data

1. Copy contents of `database/seed-data.sql`
2. Paste and execute in SQL Editor
3. Verify data is inserted:
```sql
SELECT COUNT(*) FROM insurance_plans;
SELECT COUNT(*) FROM faq_knowledge_base;
```

### 1.4 Get API Keys

1. Go to Project Settings > API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep secure!)

## Step 2: Get Anthropic API Key

### 2.1 Create Anthropic Account

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys section
4. Create new API key
5. Copy and save securely

### 2.2 Add Credits

1. Go to Billing section
2. Add payment method
3. Add credits (R500 = ~50 conversations)

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

### 3.3 Configure Project

```bash
cd day1health-ai-chatbot
vercel
```

Follow prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? day1health-ai-chatbot
- Directory? ./
- Override settings? No

### 3.4 Add Environment Variables

```bash
vercel env add ANTHROPIC_API_KEY
# Paste your Claude API key

vercel env add SUPABASE_URL
# Paste your Supabase URL

vercel env add SUPABASE_ANON_KEY
# Paste your Supabase anon key

vercel env add SUPABASE_SERVICE_KEY
# Paste your Supabase service key

vercel env add NEXT_PUBLIC_APP_URL
# Enter your chatbot URL (e.g., https://chatbot.day1health.co.za)

vercel env add NEXT_PUBLIC_MAIN_SITE_URL
# Enter your main site URL (e.g., https://day1health.co.za)
```

### 3.5 Deploy to Production

```bash
vercel --prod
```

Your chatbot is now live! 🎉

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Domains
4. Add domain: `chatbot.day1health.co.za`

### 4.2 Configure DNS

Add CNAME record in your DNS provider:

```
Type: CNAME
Name: chatbot
Value: cname.vercel-dns.com
TTL: 3600
```

Wait for DNS propagation (5-30 minutes).

## Step 5: Integrate with Main Site

### 5.1 Add Chatbot Script

Add to your main Day1Health website (before `</body>`):

```html
<script>
  window.Day1ChatbotConfig = {
    apiUrl: 'https://chatbot.day1health.co.za/api/chat',
    position: 'bottom-right',
    theme: 'light'
  };
</script>
<script src="https://chatbot.day1health.co.za/widget.js"></script>
<div id="day1health-chatbot-root"></div>
```

### 5.2 Test Integration

1. Visit your main website
2. Look for chat button in bottom-right
3. Click and test conversation
4. Verify responses are working

## Step 6: Monitoring & Analytics

### 6.1 Set Up Error Tracking (Optional)

Install Sentry:

```bash
npm install @sentry/nextjs
```

Configure:

```javascript
// sentry.config.js
Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: 'production',
});
```

### 6.2 Monitor Supabase

1. Go to Supabase Dashboard
2. Check Database > Usage
3. Monitor API requests
4. Set up alerts for high usage

### 6.3 Monitor Claude API Usage

1. Go to Anthropic Console
2. Check Usage section
3. Monitor token consumption
4. Set up billing alerts

### 6.4 View Analytics

Query chatbot analytics:

```sql
-- Daily usage
SELECT * FROM chatbot_analytics 
ORDER BY date DESC 
LIMIT 30;

-- Top FAQs
SELECT question, usage_count 
FROM faq_knowledge_base 
ORDER BY usage_count DESC 
LIMIT 10;

-- Recent leads
SELECT * FROM chat_leads 
WHERE status = 'new' 
ORDER BY created_at DESC;
```

## Step 7: Maintenance

### 7.1 Update Plan Data

When plans change, update database:

```sql
UPDATE insurance_plans 
SET base_price = 400.00, updated_at = NOW()
WHERE plan_name = 'Day-to-Day Single';
```

### 7.2 Add New FAQs

```sql
INSERT INTO faq_knowledge_base (question, answer, category, keywords)
VALUES (
  'New question?',
  'Answer here',
  'category',
  ARRAY['keyword1', 'keyword2']
);
```

### 7.3 Update System Prompt

Edit `src/lib/prompts.ts` and redeploy:

```bash
vercel --prod
```

### 7.4 Monitor Costs

Weekly cost check:
- Anthropic API: Check console
- Supabase: Check dashboard
- Vercel: Check billing

Expected monthly costs:
- Anthropic: R5,000-R10,000 (500-1000 conversations)
- Supabase: Free tier (up to 500MB)
- Vercel: Free tier (hobby projects)

## Troubleshooting

### Deployment Fails

```bash
# Check build logs
vercel logs

# Try local build first
npm run build

# Clear cache and retry
vercel --force
```

### Database Connection Issues

1. Verify Supabase URL is correct
2. Check service key has proper permissions
3. Test connection:
```bash
curl -X GET 'YOUR_SUPABASE_URL/rest/v1/insurance_plans' \
  -H "apikey: YOUR_ANON_KEY"
```

### Claude API Errors

1. Verify API key is valid
2. Check billing/credits
3. Test API directly:
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":100,"messages":[{"role":"user","content":"Hello"}]}'
```

### Widget Not Showing

1. Check browser console for errors
2. Verify script URL is accessible
3. Check CORS settings
4. Test in incognito mode

## Rollback Procedure

If deployment has issues:

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] Service keys are not exposed in client code
- [ ] CORS is configured properly
- [ ] Rate limiting is enabled
- [ ] Supabase RLS policies are active
- [ ] HTTPS is enforced
- [ ] API keys are rotated regularly

## Performance Optimization

### Enable Caching

```javascript
// In API route
export const config = {
  runtime: 'edge', // Use edge runtime for faster responses
};
```

### Optimize Database Queries

```sql
-- Add indexes for common queries
CREATE INDEX idx_chat_messages_session_timestamp 
ON chat_messages(session_id, timestamp DESC);

CREATE INDEX idx_insurance_plans_category_active 
ON insurance_plans(category, is_active);
```

### CDN Configuration

Use Vercel's CDN for static assets automatically.

## Backup Strategy

### Database Backups

Supabase automatically backs up daily. To manually backup:

```bash
# Export data
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Code Backups

Use Git for version control:

```bash
git add .
git commit -m "Production deployment"
git push origin main
```

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Anthropic Docs: https://docs.anthropic.com
- Next.js Docs: https://nextjs.org/docs

## Post-Deployment Checklist

- [ ] Chatbot is accessible at production URL
- [ ] All environment variables are set
- [ ] Database is populated with plan data
- [ ] Widget appears on main website
- [ ] Test conversation works end-to-end
- [ ] Error tracking is configured
- [ ] Monitoring is set up
- [ ] Team has access to dashboards
- [ ] Documentation is updated
- [ ] Backup strategy is in place

Congratulations! Your Day1Health AI Chatbot is now live! 🚀
