# Quick Start Guide - Day1Health AI Chatbot

Get your AI chatbot running in 15 minutes!

## What You're Building

An intelligent chatbot that:
- ✅ Explains Day1Health insurance plans in simple terms
- ✅ Recommends plans based on user needs
- ✅ Answers questions about coverage and claims
- ✅ Captures leads for your sales team
- ✅ Stores conversation history in Supabase

## Prerequisites

You need:
- Node.js 18+ ([download](https://nodejs.org))
- Supabase account ([sign up free](https://supabase.com))
- Anthropic API key ([get one](https://console.anthropic.com))

## 5-Step Setup

### Step 1: Install Dependencies (2 min)

```bash
cd day1health-ai-chatbot
npm install
```

### Step 2: Set Up Database (3 min)

1. Create new project at [supabase.com](https://supabase.com)
2. Open SQL Editor
3. Copy & paste `database/schema.sql` → Execute
4. Copy & paste `database/seed-data.sql` → Execute
5. Go to Settings > API, copy your keys

### Step 3: Configure Environment (2 min)

```bash
cp .env.example .env
```

Edit `.env` with your keys:
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
```

### Step 4: Run Locally (1 min)

```bash
npm run dev
```

Visit http://localhost:3001 - your chatbot is running! 🎉

### Step 5: Test It (2 min)

Try these questions:
- "I need health insurance for my family"
- "What's the difference between hospital and comprehensive plans?"
- "How much does it cost for 2 adults and 1 child?"

## What's Included

```
day1health-ai-chatbot/
├── README.md                    # Full documentation
├── SPECIFICATION.md             # Technical details
├── QUICK_START.md              # This file
├── database/
│   ├── schema.sql              # Database structure
│   └── seed-data.sql           # Initial plan data
├── src/
│   ├── api/chat.ts             # Main chat endpoint
│   ├── components/
│   │   └── ChatWidget.tsx      # React chat UI
│   ├── lib/
│   │   ├── claude.ts           # AI integration
│   │   ├── supabase.ts         # Database client
│   │   └── prompts.ts          # AI instructions
│   ├── types/index.ts          # TypeScript types
│   └── utils/
│       └── planMatcher.ts      # Recommendation logic
└── docs/
    ├── INTEGRATION_GUIDE.md    # How to add to main site
    └── DEPLOYMENT.md           # Production deployment
```

## Next Steps

### Option A: Integrate with Main Site

Add this to your Day1Health website:

```html
<script src="http://localhost:3001/widget.js"></script>
<div id="day1health-chatbot"></div>
```

See [INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md) for details.

### Option B: Deploy to Production

```bash
npm install -g vercel
vercel login
vercel
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for full guide.

### Option C: Customize

Edit these files to customize:
- `src/lib/prompts.ts` - Change AI personality
- `src/components/ChatWidget.tsx` - Modify UI
- `database/seed-data.sql` - Update plan data

## Common Issues

### "Missing environment variable"
→ Make sure `.env` file exists with all required keys

### "Failed to connect to Supabase"
→ Check your Supabase URL and keys are correct

### "Claude API error"
→ Verify your Anthropic API key and billing is set up

### Widget not showing
→ Check browser console for errors, verify script URL

## Features Overview

### 1. Plan Summarization
Chatbot explains complex insurance terms in simple language:
```
User: "What does comprehensive cover?"
Bot: "Comprehensive plans cover EVERYTHING - doctor visits, 
      medication, hospital stays, and emergencies. It's like 
      having both day-to-day and hospital plans combined!"
```

### 2. Smart Recommendations
Asks questions to find the perfect plan:
```
Bot: "To recommend the best plan, I need to know:
     1. How many people need coverage?
     2. What's your monthly budget?
     3. Do you visit doctors often?"
```

### 3. Q&A System
Answers questions using FAQ database + AI:
```
User: "How do I make a claim?"
Bot: "For day-to-day benefits, just present your membership 
      card at network providers - they bill us directly..."
```

### 4. Lead Capture
Collects contact info when users show interest:
```
Bot: "Great! I can have a consultant call you to complete 
      the application. May I have your name and phone number?"
```

## Cost Estimate

For 1000 conversations/month:
- Claude API: ~R10,000
- Supabase: Free (up to 500MB)
- Vercel hosting: Free
- **Total: ~R10,000/month**

ROI: If 10% convert → 100 customers × R600/month = R60,000 revenue

## Architecture

```
User Browser
    ↓
ChatWidget (React)
    ↓
API Endpoint (/api/chat)
    ↓
┌─────────────┬──────────────┐
│   Claude    │   Supabase   │
│   (AI)      │  (Database)  │
└─────────────┴──────────────┘
```

## Database Tables

- `chat_sessions` - User sessions
- `chat_messages` - Conversation history
- `insurance_plans` - All Day1Health plans
- `plan_benefits` - Detailed benefits
- `chat_leads` - Captured leads
- `chatbot_analytics` - Usage metrics
- `faq_knowledge_base` - Quick answers

## Key Files to Know

### `src/lib/prompts.ts`
Contains AI instructions. Edit to change chatbot personality.

### `src/api/chat.ts`
Main API endpoint. Handles all chat requests.

### `src/components/ChatWidget.tsx`
React component for chat UI. Customize appearance here.

### `database/seed-data.sql`
Plan pricing and FAQs. Update when plans change.

## Testing

### Test Conversations

1. Plan recommendation:
```
"I need insurance for 2 adults and 2 kids, budget R1500"
```

2. Plan comparison:
```
"What's the difference between Value Plus and Platinum?"
```

3. Application process:
```
"How do I apply for the Comprehensive plan?"
```

4. Lead capture:
```
"I want to sign up for the Hospital Executive plan"
```

### Check Database

```sql
-- View recent conversations
SELECT * FROM chat_messages 
ORDER BY timestamp DESC 
LIMIT 20;

-- View captured leads
SELECT * FROM chat_leads 
WHERE status = 'new';

-- View analytics
SELECT * FROM chatbot_analytics 
ORDER BY date DESC;
```

## Support

Need help?
- 📧 Email: admin@day1.co.za
- 📞 Phone: 0876 100 600
- 📚 Docs: See README.md and docs/ folder

## Roadmap

Coming soon:
- [ ] Voice input/output
- [ ] Multi-language (Afrikaans, Zulu, Xhosa)
- [ ] WhatsApp integration
- [ ] Network provider locator
- [ ] Claims guidance
- [ ] Admin dashboard

## Compliance

This chatbot complies with:
- ✅ POPIA (data protection)
- ✅ Financial Sector regulations
- ✅ Medical Schemes Act

## License

Proprietary - Day1Health (Pty) Ltd

---

**Ready to go?** Run `npm run dev` and start chatting! 🚀

For detailed documentation, see:
- [README.md](./README.md) - Full overview
- [SPECIFICATION.md](./SPECIFICATION.md) - Technical details
- [docs/INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md) - Integration
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Production deployment
