# Day1Health AI Chatbot

A standalone AI-powered chatbot for Day1Health medical insurance website.

## Overview

This chatbot provides intelligent assistance for Day1Health customers with:
- Plan summarization and comparison
- Personalized plan recommendations
- Q&A about insurance products and processes
- General AI assistant capabilities
- Supabase database integration for conversation history and analytics

## Features

✅ Summarize complex insurance plan details in simple terms
✅ Recommend plans based on user needs (budget, age, family size)
✅ Answer questions about Day1Health products and services
✅ Store conversation history in Supabase
✅ Lead capture and analytics
✅ Mobile-responsive chat interface

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Next.js API Routes
- **AI Model**: Google Gemini 1.5 Flash (FREE tier!)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (recommended)

## Project Structure

```
day1health-ai-chatbot/
├── README.md                          # This file
├── SPECIFICATION.md                   # Detailed technical specification
├── package.json                       # Dependencies
├── .env.example                       # Environment variables template
├── database/
│   ├── schema.sql                     # Supabase database schema
│   └── seed-data.sql                  # Initial plan data
├── src/
│   ├── components/
│   │   ├── ChatWidget.tsx             # Main chat interface
│   │   ├── ChatMessage.tsx            # Individual message component
│   │   ├── PlanCard.tsx               # Plan recommendation card
│   │   └── TypingIndicator.tsx        # Loading animation
│   ├── api/
│   │   ├── chat.ts                    # Main chat endpoint
│   │   └── recommendations.ts         # Plan recommendation logic
│   ├── lib/
│   │   ├── supabase.ts                # Supabase client
│   │   ├── claude.ts                  # Claude AI integration
│   │   └── prompts.ts                 # System prompts
│   ├── types/
│   │   └── index.ts                   # TypeScript types
│   └── utils/
│       ├── planMatcher.ts             # Plan recommendation algorithm
│       └── formatters.ts              # Text formatting utilities
└── docs/
    ├── INTEGRATION_GUIDE.md           # How to integrate with main site
    ├── API_DOCUMENTATION.md           # API endpoints documentation
    └── DEPLOYMENT.md                  # Deployment instructions

```

## Quick Start

### 1. Install Dependencies
```bash
cd day1health-ai-chatbot
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
GOOGLE_API_KEY=your_google_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

**Get Google API Key (FREE):**
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create or use existing API key
- Copy and paste into `.env`

### 3. Set Up Database
Run the SQL scripts in Supabase:
```bash
# Copy contents of database/schema.sql to Supabase SQL Editor
# Copy contents of database/seed-data.sql to Supabase SQL Editor
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Integrate with Main Site
Add this snippet to your Day1Health website:
```html
<script src="https://your-domain.com/chatbot.js"></script>
<div id="day1health-chatbot"></div>
```

## Integration with Main Day1Health Site

This chatbot is designed as a standalone module that can be:
1. **Embedded as a widget** - Floating chat button on main site
2. **Standalone page** - Dedicated `/chat` route
3. **Iframe integration** - Embedded in existing pages

See `docs/INTEGRATION_GUIDE.md` for detailed instructions.

## Database Schema

The chatbot uses 7 Supabase tables:
- `chat_sessions` - User chat sessions
- `chat_messages` - Conversation history
- `insurance_plans` - All Day1Health plans
- `plan_benefits` - Detailed benefit information
- `chat_leads` - Captured leads from conversations
- `chatbot_analytics` - Usage metrics
- `faq_knowledge_base` - Quick answers database

## Cost Estimation

- Claude API: ~R10 per conversation (20 messages)
- Supabase: Free tier supports 500MB database
- Hosting: Vercel free tier or R50/month

## Roadmap

- [ ] Voice input/output
- [ ] Multi-language support (Afrikaans, Zulu, Xhosa)
- [ ] Network provider locator
- [ ] Claims process guidance
- [ ] Admin analytics dashboard
- [ ] WhatsApp integration

## Compliance

This chatbot adheres to:
- POPIA (Protection of Personal Information Act)
- Financial Sector Conduct Authority regulations
- Medical Schemes Act requirements

## Support

For questions or issues, contact the development team.

## License

Proprietary - Day1Health (Pty) Ltd
