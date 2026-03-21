-- Day1Health AI Chatbot - Seed Data
-- Run this AFTER schema.sql

-- Insert Day-to-Day Plans
INSERT INTO insurance_plans (plan_name, category, tier, variant, base_price, adult_price, child_price, description, key_benefits, page_url) VALUES
('Day-to-Day Single', 'day-to-day', 'standard', 'single', 385.00, NULL, 193.00, 'Affordable day-to-day medical cover for individuals', 
  ARRAY['GP visits', 'Acute medication', 'Basic dentistry', 'Optometry benefits'], 
  'https://day1health.co.za/plans/day-to-day?variant=single'),
  
('Day-to-Day Couple', 'day-to-day', 'standard', 'couple', 674.00, NULL, 193.00, 'Day-to-day medical cover for couples', 
  ARRAY['GP visits', 'Acute medication', 'Basic dentistry', 'Optometry benefits'], 
  'https://day1health.co.za/plans/day-to-day?variant=couple'),
  
('Day-to-Day Family', 'day-to-day', 'standard', 'family', 385.00, 385.00, 193.00, 'Day-to-day medical cover for families', 
  ARRAY['GP visits', 'Acute medication', 'Basic dentistry', 'Optometry benefits'], 
  'https://day1health.co.za/plans/day-to-day?variant=family');

-- Insert Hospital Plans (Value Plus, Platinum, Executive)
INSERT INTO insurance_plans (plan_name, category, tier, variant, base_price, adult_price, child_price, description, key_benefits, page_url) VALUES
('Hospital Value Plus Single', 'hospital', 'value-plus', 'single', 390.00, 390.00, 156.00, 'Essential hospital cover at an affordable price', 
  ARRAY['Hospital stays', 'Surgical procedures', 'Specialist consultations', 'Emergency ambulance'], 
  'https://day1health.co.za/plans/hospital?tier=value-plus&variant=single'),
  
('Hospital Platinum Single', 'hospital', 'platinum', 'single', 390.00, 390.00, 156.00, 'Enhanced hospital cover with higher limits', 
  ARRAY['Hospital stays', 'Surgical procedures', 'Specialist consultations', 'Emergency ambulance', 'Higher benefit limits'], 
  'https://day1health.co.za/plans/hospital?tier=platinum&variant=single'),
  
('Hospital Executive Single', 'hospital', 'executive', 'single', 390.00, 390.00, 156.00, 'Premium hospital cover with maximum benefits', 
  ARRAY['Hospital stays', 'Surgical procedures', 'Specialist consultations', 'Emergency ambulance', 'Maximum benefit limits'], 
  'https://day1health.co.za/plans/hospital?tier=executive&variant=single');

-- Insert Comprehensive Plans (Value Plus, Platinum, Executive)
INSERT INTO insurance_plans (plan_name, category, tier, variant, base_price, adult_price, child_price, description, key_benefits, page_url) VALUES
('Comprehensive Value Plus Single', 'comprehensive', 'value-plus', 'single', 665.00, 665.00, 266.00, 'Complete medical cover including day-to-day and hospital', 
  ARRAY['GP visits', 'Medication', 'Hospital stays', 'Specialists', 'Chronic conditions', 'Emergency ambulance'], 
  'https://day1health.co.za/plans/comprehensive?tier=value-plus&variant=single'),
  
('Comprehensive Platinum Single', 'comprehensive', 'platinum', 'single', 665.00, 665.00, 266.00, 'Enhanced comprehensive cover with higher limits', 
  ARRAY['GP visits', 'Medication', 'Hospital stays', 'Specialists', 'Chronic conditions', 'Emergency ambulance', 'Higher limits'], 
  'https://day1health.co.za/plans/comprehensive?tier=platinum&variant=single'),
  
('Comprehensive Executive Single', 'comprehensive', 'executive', 'single', 665.00, 665.00, 266.00, 'Premium comprehensive cover with maximum benefits', 
  ARRAY['GP visits', 'Medication', 'Hospital stays', 'Specialists', 'Chronic conditions', 'Emergency ambulance', 'Maximum limits'], 
  'https://day1health.co.za/plans/comprehensive?tier=executive&variant=single');

-- Insert Senior Plans
INSERT INTO insurance_plans (plan_name, category, tier, variant, base_price, adult_price, child_price, description, key_benefits, page_url) VALUES
('Senior Day-to-Day Single', 'senior', 'standard', 'single', 425.00, 425.00, NULL, 'Day-to-day medical cover designed for seniors', 
  ARRAY['GP visits', 'Chronic medication', 'Acute medication', 'Basic dentistry', 'Optometry'], 
  'https://day1health.co.za/plans/senior?category=day-to-day&variant=single'),
  
('Senior Comprehensive Single', 'senior', 'standard', 'single', 425.00, 425.00, NULL, 'Comprehensive medical cover for seniors', 
  ARRAY['GP visits', 'Chronic medication', 'Hospital stays', 'Specialists', 'Emergency ambulance'], 
  'https://day1health.co.za/plans/senior?category=comprehensive&variant=single'),
  
('Senior Hospital Single', 'senior', 'standard', 'single', 425.00, 425.00, NULL, 'Hospital cover designed for seniors', 
  ARRAY['Hospital stays', 'Surgical procedures', 'Specialist consultations', 'Emergency ambulance'], 
  'https://day1health.co.za/plans/senior?category=hospital&variant=single');

-- Insert FAQ Knowledge Base
INSERT INTO faq_knowledge_base (question, answer, category, keywords) VALUES
('What is Day1Health?', 
 'Day1Health is a South African medical insurance provider offering affordable health cover since 2003. We are underwritten by African Unity Life Ltd (FSP 8447) and provide medical insurance products (not a medical aid). Our plans cover individuals, couples, and families with options for day-to-day, hospital, and comprehensive coverage.',
 'company',
 ARRAY['about', 'company', 'who', 'what is']),

('What''s the difference between medical insurance and medical aid?',
 'Medical insurance (like Day1Health) provides fixed benefits for medical expenses, while medical aids are registered with the Council for Medical Schemes and offer different benefit structures. Day1Health is a medical insurance product (CMS Ref. DM 1074), not a medical aid. We offer affordable, transparent pricing with clear benefit limits.',
 'products',
 ARRAY['medical aid', 'medical insurance', 'difference', 'cms']),

('How do I apply for cover?',
 'You can apply in 3 easy ways: 1) Online at day1health.co.za (takes 5 minutes), 2) Call us at 0876 100 600 (Mon-Fri 8:00-16:30, Sat 8:00-13:00), or 3) Email sales@day1.co.za for an application form. You''ll need your ID, banking details, and medical history information.',
 'application',
 ARRAY['apply', 'application', 'how to apply', 'sign up', 'join']),

('When does my cover start?',
 'Your cover starts from Day 1 for accidents and emergency ambulance services (no waiting periods). For other benefits, standard waiting periods may apply. Once your application is approved and first payment is received, you can start using your benefits immediately for covered emergencies.',
 'coverage',
 ARRAY['start', 'waiting period', 'when', 'coverage start', 'day 1']),

('How do I make a claim?',
 'For day-to-day benefits, simply present your membership card at network providers - they bill us directly. For hospital admissions, call our emergency hotline 0861-144-144 for pre-authorization. For reimbursements, complete a claim form (available on our website) and submit with supporting documents to admin@day1.co.za.',
 'claims',
 ARRAY['claim', 'claims process', 'how to claim', 'reimbursement']),

('Which doctors and hospitals can I use?',
 'You can use thousands of healthcare providers across South Africa including Life Healthcare, Mediclinic, Clinix, African Health Care, and many GPs and specialists. Visit our website for the full network directory or call 0876 100 600 to check if your preferred provider is in our network.',
 'providers',
 ARRAY['doctors', 'hospitals', 'network', 'providers', 'where can i go']),

('Can I add my children to my plan?',
 'Yes! Day-to-Day, Hospital, and Comprehensive plans allow you to add up to 4 children. Child rates are: Day-to-Day R193/child, Hospital R156/child, Comprehensive R266/child. Senior plans do not cover children. Simply select the Family variant when applying.',
 'family',
 ARRAY['children', 'kids', 'family', 'add children', 'dependents']),

('What if I need emergency care?',
 'Call our 24/7 emergency hotline at 0861-144-144 immediately. Emergency ambulance services are covered from Day 1 with no waiting periods. For life-threatening emergencies, get to the nearest hospital first, then call us as soon as possible for authorization.',
 'emergency',
 ARRAY['emergency', 'urgent', '24/7', 'ambulance', 'accident']),

('Can I upgrade or downgrade my plan?',
 'Yes, you can change your plan at your next renewal date. Contact us at 0876 100 600 or admin@day1.co.za at least 30 days before your renewal to discuss your options. Upgrades may be subject to underwriting and waiting periods for new benefits.',
 'changes',
 ARRAY['upgrade', 'downgrade', 'change plan', 'switch', 'modify']),

('What are chronic conditions and are they covered?',
 'Chronic conditions are long-term health conditions requiring ongoing treatment (e.g., diabetes, hypertension, asthma). Comprehensive plans include chronic medication benefits. Hospital plans cover hospital admissions related to chronic conditions. Day-to-Day plans cover acute medication only. Specific limits apply - check your plan details.',
 'benefits',
 ARRAY['chronic', 'chronic conditions', 'diabetes', 'hypertension', 'ongoing treatment']),

('How much does Day1Health cost?',
 'Plans start from R385/month for Day-to-Day Single cover. Prices vary by plan type and family size: Day-to-Day (R385-R1,157), Hospital (R390-R1,404), Comprehensive (R665-R2,394), Senior (R425-R850). Use our online calculator or chat with us to get a personalized quote based on your needs.',
 'pricing',
 ARRAY['cost', 'price', 'how much', 'rates', 'premiums', 'fees']),

('What is not covered?',
 'Common exclusions include: pre-existing conditions (during waiting periods), cosmetic procedures, experimental treatments, over-the-counter medication (unless prescribed), and non-emergency overseas treatment. Each plan has specific exclusions - review your policy document or ask us for details.',
 'exclusions',
 ARRAY['not covered', 'exclusions', 'what is excluded', 'limitations']);

-- Insert sample plan benefits (for Comprehensive Value Plus as example)
DO $$
DECLARE
  comp_vp_id UUID;
BEGIN
  SELECT id INTO comp_vp_id FROM insurance_plans WHERE plan_name = 'Comprehensive Value Plus Single' LIMIT 1;
  
  IF comp_vp_id IS NOT NULL THEN
    INSERT INTO plan_benefits (plan_id, benefit_category, benefit_name, benefit_limit, sort_order) VALUES
    (comp_vp_id, 'Day-to-Day', 'GP Consultations', 'Unlimited', 1),
    (comp_vp_id, 'Day-to-Day', 'Acute Medication', 'R2,500 per family per year', 2),
    (comp_vp_id, 'Day-to-Day', 'Chronic Medication', 'R5,000 per family per year', 3),
    (comp_vp_id, 'Day-to-Day', 'Basic Dentistry', 'R1,500 per family per year', 4),
    (comp_vp_id, 'Day-to-Day', 'Optometry', 'R1,000 per family per year', 5),
    (comp_vp_id, 'Hospital', 'Hospital Accommodation', 'R10,000 per day', 10),
    (comp_vp_id, 'Hospital', 'Surgical Procedures', 'R50,000 per procedure', 11),
    (comp_vp_id, 'Hospital', 'Specialist Consultations', 'R1,500 per visit', 12),
    (comp_vp_id, 'Emergency', 'Emergency Ambulance', 'Unlimited', 20),
    (comp_vp_id, 'Emergency', 'Emergency Room', 'R5,000 per visit', 21);
  END IF;
END $$;

-- Create initial analytics record for today
INSERT INTO chatbot_analytics (date, total_sessions, total_messages)
VALUES (CURRENT_DATE, 0, 0)
ON CONFLICT (date) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Plans inserted: %', (SELECT COUNT(*) FROM insurance_plans);
  RAISE NOTICE 'FAQs inserted: %', (SELECT COUNT(*) FROM faq_knowledge_base);
  RAISE NOTICE 'Benefits inserted: %', (SELECT COUNT(*) FROM plan_benefits);
END $$;
