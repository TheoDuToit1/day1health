-- Day1Health AI Chatbot Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chat Sessions Table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX idx_chat_sessions_started_at ON chat_sessions(started_at DESC);

-- Chat Messages Table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  tokens_used INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp DESC);

-- Insurance Plans Table
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
  waiting_periods JSONB DEFAULT '{}'::jsonb,
  pdf_url TEXT,
  page_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insurance_plans_category ON insurance_plans(category);
CREATE INDEX idx_insurance_plans_variant ON insurance_plans(variant);
CREATE INDEX idx_insurance_plans_active ON insurance_plans(is_active);

-- Plan Benefits Table
CREATE TABLE plan_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES insurance_plans(id) ON DELETE CASCADE,
  benefit_category TEXT NOT NULL,
  benefit_name TEXT NOT NULL,
  benefit_limit TEXT,
  benefit_description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_plan_benefits_plan_id ON plan_benefits(plan_id);
CREATE INDEX idx_plan_benefits_category ON plan_benefits(benefit_category);

-- Chat Leads Table
CREATE TABLE chat_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  interested_plans TEXT[],
  budget_range TEXT,
  family_size INTEGER,
  age_range TEXT,
  notes TEXT,
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_leads_status ON chat_leads(status);
CREATE INDEX idx_chat_leads_created_at ON chat_leads(created_at DESC);
CREATE INDEX idx_chat_leads_email ON chat_leads(email);

-- Chatbot Analytics Table
CREATE TABLE chatbot_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  total_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  avg_session_duration INTERVAL,
  plans_recommended JSONB DEFAULT '{}'::jsonb,
  common_questions TEXT[],
  lead_conversion_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chatbot_analytics_date ON chatbot_analytics(date DESC);

-- FAQ Knowledge Base Table
CREATE TABLE faq_knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  keywords TEXT[],
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_faq_category ON faq_knowledge_base(category);
CREATE INDEX idx_faq_active ON faq_knowledge_base(is_active);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Public read access to insurance plans and benefits
CREATE POLICY "Public can read active insurance plans"
  ON insurance_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read plan benefits"
  ON plan_benefits FOR SELECT
  USING (true);

CREATE POLICY "Public can read active FAQs"
  ON faq_knowledge_base FOR SELECT
  USING (is_active = true);

-- Service role can do everything (for API)
CREATE POLICY "Service role can manage chat sessions"
  ON chat_sessions FOR ALL
  USING (true);

CREATE POLICY "Service role can manage chat messages"
  ON chat_messages FOR ALL
  USING (true);

CREATE POLICY "Service role can manage leads"
  ON chat_leads FOR ALL
  USING (true);

CREATE POLICY "Service role can manage analytics"
  ON chatbot_analytics FOR ALL
  USING (true);

-- Functions

-- Function to update analytics daily
CREATE OR REPLACE FUNCTION update_daily_analytics()
RETURNS void AS $$
DECLARE
  today DATE := CURRENT_DATE;
BEGIN
  INSERT INTO chatbot_analytics (
    date,
    total_sessions,
    total_messages,
    avg_session_duration
  )
  SELECT
    today,
    COUNT(DISTINCT cs.id),
    COUNT(cm.id),
    AVG(EXTRACT(EPOCH FROM (cs.ended_at - cs.started_at)) * INTERVAL '1 second')
  FROM chat_sessions cs
  LEFT JOIN chat_messages cm ON cm.session_id = cs.id
  WHERE DATE(cs.started_at) = today
  ON CONFLICT (date) DO UPDATE SET
    total_sessions = EXCLUDED.total_sessions,
    total_messages = EXCLUDED.total_messages,
    avg_session_duration = EXCLUDED.avg_session_duration,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to increment FAQ usage
CREATE OR REPLACE FUNCTION increment_faq_usage(faq_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE faq_knowledge_base
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE id = faq_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_insurance_plans_updated_at
  BEFORE UPDATE ON insurance_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_leads_updated_at
  BEFORE UPDATE ON chat_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_updated_at
  BEFORE UPDATE ON faq_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE chat_sessions IS 'Stores user chat sessions with metadata';
COMMENT ON TABLE chat_messages IS 'Stores individual messages in conversations';
COMMENT ON TABLE insurance_plans IS 'Master table of all Day1Health insurance plans';
COMMENT ON TABLE plan_benefits IS 'Detailed benefits for each insurance plan';
COMMENT ON TABLE chat_leads IS 'Captured leads from chatbot conversations';
COMMENT ON TABLE chatbot_analytics IS 'Daily analytics and metrics';
COMMENT ON TABLE faq_knowledge_base IS 'Frequently asked questions and answers';
