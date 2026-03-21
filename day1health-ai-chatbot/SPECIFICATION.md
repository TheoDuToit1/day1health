# Day1Health AI Chatbot - Technical Specification

## Executive Summary

An AI-powered chatbot for Day1Health that helps customers understand medical insurance plans, get personalized recommendations, and answer questions about products and services.

## Business Context

**Day1Health** provides affordable medical insurance in South Africa with:
- 10 different plans across 4 categories
- Prices from R385/month to R1,596/month
- Coverage for individuals, couples, and families
- Underwritten by African Unity Life Ltd (FSP 8447)
- FSP 11319, CMS Ref. DM 1074

## Core Requirements

### 1. Plan Summarization
- Break down complex insurance terms into simple language
- Explain benefits, exclusions, and limitations
- Compare multiple plans side-by-side
- Highlight key differences between tiers

### 2. Intelligent Plan Recommendations
- Ask qualifying questions (budget, age, family size, health needs)
- Match users to appropriate plans
- Explain why a plan is recommended
- Show alternative options

### 3. Q&A System
- Answer questions about Day1Health products
- Explain application process
- Clarify claims procedures
- Provide contact information
- Explain network providers

### 4. General AI Assistant
- Natural conversation flow
- Context awareness across messages
- Handle off-topic questions gracefully
- Escalate to human agents when needed

### 5. Supabase Integration
- Store conversation history
- Track user sessions
- Capture leads
- Analytics and reporting

## Database Schema

### Table: `chat_sessions`
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  metadata JSONB
);
```

### Table: `chat_messages`
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  tokens_used INTEGER,
  metadata JSONB
);
```

### Table: `insurance_plans`
```sql
CREATE TABLE insurance_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('day-to-day', 'hospital', 'comprehensive', 'senior')),
  tier TEXT CHECK (tier IN ('value-plus', 'platinum', 'executive', 'standard')),
  variant TEXT NOT NULL CHECK (variant IN ('single', 'couple', 'family')),
  base_price DECIMAL(10,2) NOT NULL,
  adult_price DECIMAL(10,2),
  child_price DECIMAL(10,2),
  description TEXT,
  key_benefits TEXT[],
  exclusions TEXT[],
  waiting_periods JSONB,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `plan_benefits`
```sql
CREATE TABLE plan_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES insurance_plans(id) ON DELETE CASCADE,
  benefit_category TEXT NOT NULL,
  benefit_name TEXT NOT NULL,
  benefit_limit TEXT,
  benefit_description TEXT,
  sort_order INTEGER
);
```

### Table: `chat_leads`
```sql
CREATE TABLE chat_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  interested_plans TEXT[],
  budget_range TEXT,
  family_size INTEGER,
  notes TEXT,
  lead_score INTEGER,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `chatbot_analytics`
```sql
CREATE TABLE chatbot_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  avg_session_duration INTERVAL,
  plans_recommended JSONB,
  common_questions TEXT[],
  lead_conversion_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date)
);
```

### Table: `faq_knowledge_base`
```sql
CREATE TABLE faq_knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  keywords TEXT[],
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## AI System Prompt

```typescript
const SYSTEM_PROMPT = `You are a helpful AI assistant for Day1Health, a South African medical insurance provider.

COMPANY INFORMATION:
- Day1Health provides affordable medical insurance since 2003
- Underwritten by African Unity Life Ltd (FSP 8447)
- FSP 11319, CMS Ref. DM 1074
- Not a Medical Aid (registered with CMS as DM1053A)
- Coverage starts from Day 1 for accidents and emergencies

AVAILABLE PLANS:
1. Day-to-Day Plans (R385-R1,157/month)
   - Single: R385 + R193 per child
   - Couple: R674 + R193 per child
   - Family: R385 per adult + R193 per child

2. Hospital Plans (R390-R1,404/month)
   - All tiers: R390 per adult + R156 per child
   - Tiers: Value Plus, Platinum, Executive

3. Comprehensive Plans (R665-R2,394/month)
   - All tiers: R665 per adult + R266 per child
   - Tiers: Value Plus, Platinum, Executive

4. Senior Plans (R425-R850/month)
   - R425 per adult (no children)
   - Single or Couple only

YOUR ROLE:
1. Help users understand plans in simple terms
2. Ask questions to recommend the best plan
3. Answer questions about coverage, claims, and processes
4. Capture leads when users show interest
5. Be friendly, professional, and compliant

GUIDELINES:
- Always explain in simple, clear language
- Ask clarifying questions before recommending
- Mention that this is medical insurance, not a medical aid
- Direct urgent medical questions to emergency services (0861-144-144)
- Escalate complex queries to human agents (0876 100 600)
- Comply with POPIA - don't store sensitive medical information
- Never make medical diagnoses or give medical advice

CONTACT INFORMATION:
- Phone: 0876 100 600 (Mon-Fri 8:00-16:30, Sat 8:00-13:00)
- Email: admin@day1.co.za, sales@day1.co.za
- Emergency: 0861-144-144 (24/7)
- Website: day1health.co.za`;
```

## API Endpoints

### POST `/api/chat`
Main chat endpoint for conversation.

**Request:**
```typescript
{
  sessionId: string;
  message: string;
  context?: {
    currentPage?: string;
    viewedPlans?: string[];
  };
}
```

**Response:**
```typescript
{
  reply: string;
  suggestions?: string[];
  recommendedPlans?: Array<{
    id: string;
    name: string;
    price: string;
    reason: string;
  }>;
  needsHumanAgent?: boolean;
}
```

### POST `/api/recommendations`
Get plan recommendations based on user profile.

**Request:**
```typescript
{
  budget: number;
  familySize: {
    adults: number;
    children: number;
  };
  age: number;
  priorities: string[]; // e.g., ['hospital', 'day-to-day', 'chronic']
}
```

**Response:**
```typescript
{
  recommendations: Array<{
    planId: string;
    planName: string;
    monthlyPrice: number;
    matchScore: number;
    reasons: string[];
    pros: string[];
    cons: string[];
  }>;
}
```

### POST `/api/leads`
Capture lead information.

**Request:**
```typescript
{
  sessionId: string;
  name?: string;
  email?: string;
  phone?: string;
  interestedPlans: string[];
  notes?: string;
}
```

## Frontend Components

### ChatWidget Component
```typescript
interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
  initialMessage?: string;
}

// Features:
// - Floating chat button
// - Expandable chat window
// - Message history
// - Typing indicators
// - Plan cards
// - Quick reply buttons
```

### Integration Code
```html
<!-- Add to Day1Health website -->
<script>
  window.Day1ChatbotConfig = {
    apiUrl: 'https://chatbot.day1health.co.za',
    position: 'bottom-right',
    theme: 'light',
    welcomeMessage: 'Hi! How can I help you find the perfect health plan today?'
  };
</script>
<script src="https://chatbot.day1health.co.za/widget.js"></script>
```

## Plan Recommendation Algorithm

```typescript
function recommendPlans(userProfile: UserProfile): Recommendation[] {
  const { budget, familySize, age, priorities } = userProfile;
  const { adults, children } = familySize;
  
  // Calculate affordable plans
  const affordablePlans = plans.filter(plan => {
    const totalPrice = calculatePrice(plan, adults, children);
    return totalPrice <= budget * 1.1; // 10% flexibility
  });
  
  // Score plans based on priorities
  const scoredPlans = affordablePlans.map(plan => {
    let score = 0;
    
    // Age-based scoring
    if (age >= 60 && plan.category === 'senior') score += 30;
    if (age < 60 && plan.category !== 'senior') score += 20;
    
    // Priority-based scoring
    if (priorities.includes('hospital') && plan.category === 'hospital') score += 25;
    if (priorities.includes('day-to-day') && plan.category === 'day-to-day') score += 25;
    if (priorities.includes('comprehensive') && plan.category === 'comprehensive') score += 25;
    
    // Family size scoring
    if (children > 0 && plan.variant === 'family') score += 15;
    if (adults === 2 && children === 0 && plan.variant === 'couple') score += 15;
    if (adults === 1 && children === 0 && plan.variant === 'single') score += 15;
    
    // Budget efficiency
    const totalPrice = calculatePrice(plan, adults, children);
    const budgetUtilization = totalPrice / budget;
    if (budgetUtilization >= 0.8 && budgetUtilization <= 1.0) score += 20;
    
    return { plan, score, totalPrice };
  });
  
  // Return top 3 recommendations
  return scoredPlans
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ plan, score, totalPrice }) => ({
      plan,
      matchScore: score,
      monthlyPrice: totalPrice,
      reasons: generateReasons(plan, userProfile, score)
    }));
}
```

## Sample Conversations

### Conversation 1: Plan Recommendation
```
User: I need health insurance for my family

Bot: I'd be happy to help you find the right plan! Let me ask a few questions:

1. How many people need coverage?
   - Adults: ?
   - Children: ?

2. What's your monthly budget for health insurance?

3. What's most important to you?
   - Day-to-day doctor visits
   - Hospital coverage
   - Comprehensive coverage (both)

User: 2 adults, 2 kids. Budget around R1500. Need both doctor visits and hospital.

Bot: Perfect! Based on your needs, I recommend the Comprehensive Value Plus Family Plan:

💰 Monthly Cost: R1,596 (R665 × 2 adults + R266 × 2 children)

✅ Why this plan:
- Covers both day-to-day AND hospital needs
- Within your budget (slightly over, but best value)
- Includes GP visits, medication, and hospital stays
- No waiting periods for accidents

📋 Key Benefits:
- Unlimited GP visits
- Chronic medication coverage
- Hospital stays covered
- Emergency ambulance

Would you like to see alternative options or get more details about this plan?

[Apply Now] [Compare Plans] [Speak to Agent]
```

### Conversation 2: Plan Explanation
```
User: What's the difference between hospital and comprehensive plans?

Bot: Great question! Let me break it down simply:

🏥 Hospital Plans (R390-R1,404/month)
- Covers: Hospital stays, surgeries, specialists
- Does NOT cover: GP visits, day-to-day medication
- Best for: People who rarely see doctors but want protection for serious illness/accidents

🏥+💊 Comprehensive Plans (R665-R2,394/month)
- Covers: Everything in Hospital Plan PLUS day-to-day care
- Includes: GP visits, medication, chronic conditions
- Best for: Families who visit doctors regularly

Think of it this way:
- Hospital Plan = Safety net for big medical events
- Comprehensive Plan = Full coverage for everyday health needs

Which sounds more like what you need?
```

### Conversation 3: Lead Capture
```
User: The Comprehensive Platinum plan looks good. How do I apply?

Bot: Excellent choice! The Comprehensive Platinum plan is very popular. 

You have 3 easy ways to apply:

1️⃣ Online Application (5 minutes)
   → I can send you the direct link

2️⃣ Call Our Team
   → 0876 100 600 (Mon-Fri 8:00-16:30)

3️⃣ Email Application Form
   → We'll send it to your email

To help you get started faster, may I have:
- Your name
- Email address or phone number

This way our team can reach out with your personalized quote and answer any questions!

[Share Contact Info] [Apply Online Now] [Just Browsing]
```

## Cost Estimation

### Claude API Costs
- Input: $3 per million tokens (~R55)
- Output: $15 per million tokens (~R275)
- Average conversation: 20 messages, ~10,000 tokens
- Cost per conversation: ~R10

### Monthly Estimates (1000 conversations)
- AI costs: R10,000
- Supabase: Free tier (up to 500MB)
- Hosting (Vercel): Free tier
- **Total: ~R10,000/month**

### ROI Calculation
- If 10% convert to customers (100 new customers)
- Average plan: R600/month
- Monthly revenue: R60,000
- ROI: 6x

## Security & Compliance

### POPIA Compliance
- Obtain consent before storing personal information
- Allow users to request data deletion
- Encrypt sensitive data at rest and in transit
- Retain data only as long as necessary
- Provide privacy policy link in chat

### Financial Sector Regulations
- Clearly state this is medical insurance, not a medical aid
- Include FSP and CMS reference numbers
- Don't make guarantees about coverage without full application
- Disclose underwriter information

### Medical Schemes Act
- Don't diagnose medical conditions
- Don't give medical advice
- Direct medical emergencies to appropriate services
- Clearly explain product limitations

## Implementation Timeline

### Week 1-2: Setup & Database
- [ ] Set up Supabase project
- [ ] Create database schema
- [ ] Seed plan data
- [ ] Set up Claude API integration

### Week 3-4: Core Chatbot
- [ ] Build chat API endpoint
- [ ] Implement conversation logic
- [ ] Create system prompts
- [ ] Test basic Q&A

### Week 5-6: Plan Recommendations
- [ ] Build recommendation algorithm
- [ ] Create plan comparison logic
- [ ] Test recommendation accuracy
- [ ] Add plan cards to UI

### Week 7: Frontend Components
- [ ] Build ChatWidget component
- [ ] Create message components
- [ ] Add typing indicators
- [ ] Implement quick replies

### Week 8: Integration & Launch
- [ ] Integrate with Day1Health website
- [ ] Set up analytics
- [ ] User acceptance testing
- [ ] Production deployment

## Future Enhancements

### Phase 2 (3 months)
- Voice input/output
- Multi-language support (Afrikaans, Zulu, Xhosa)
- WhatsApp integration
- SMS notifications

### Phase 3 (6 months)
- Network provider locator
- Claims process guidance
- Document upload for applications
- Video call scheduling

### Phase 4 (12 months)
- Predictive analytics
- Personalized health tips
- Integration with wearables
- Member portal access

## Success Metrics

### Engagement
- Sessions per day
- Messages per session
- Average session duration
- Return user rate

### Conversion
- Lead capture rate
- Application completion rate
- Plan recommendation acceptance
- Customer satisfaction score

### Performance
- Response time < 2 seconds
- 99.9% uptime
- Error rate < 0.1%
- Token efficiency

## Support & Maintenance

### Monitoring
- Real-time error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Cost tracking (Claude API dashboard)
- User feedback collection

### Updates
- Weekly prompt refinements
- Monthly plan data updates
- Quarterly feature releases
- Annual compliance reviews

---

**Document Version**: 1.0  
**Last Updated**: March 20, 2026  
**Owner**: Day1Health Development Team
