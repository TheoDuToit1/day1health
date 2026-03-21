// Type definitions for Day1Health AI Chatbot

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  sessionId: string;
  startedAt: Date;
  endedAt?: Date;
  messages: ChatMessage[];
}

export interface InsurancePlan {
  id: string;
  planName: string;
  category: 'day-to-day' | 'hospital' | 'comprehensive' | 'senior';
  tier?: 'value-plus' | 'platinum' | 'executive' | 'standard';
  variant: 'single' | 'couple' | 'family';
  basePrice: number;
  adultPrice?: number;
  childPrice?: number;
  description: string;
  keyBenefits: string[];
  exclusions?: string[];
  pdfUrl?: string;
  pageUrl?: string;
}

export interface PlanBenefit {
  id: string;
  planId: string;
  benefitCategory: string;
  benefitName: string;
  benefitLimit?: string;
  benefitDescription?: string;
}

export interface UserProfile {
  budget: number;
  familySize: {
    adults: number;
    children: number;
  };
  age: number;
  priorities: string[];
}

export interface PlanRecommendation {
  plan: InsurancePlan;
  monthlyPrice: number;
  matchScore: number;
  reasons: string[];
  pros: string[];
  cons: string[];
}

export interface ChatLead {
  id?: string;
  sessionId: string;
  name?: string;
  email?: string;
  phone?: string;
  interestedPlans: string[];
  budgetRange?: string;
  familySize?: number;
  ageRange?: string;
  notes?: string;
  leadScore: number;
  status: 'new' | 'contacted' | 'converted' | 'lost';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  usageCount: number;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  context?: {
    currentPage?: string;
    viewedPlans?: string[];
  };
}

export interface ChatResponse {
  reply: string;
  suggestions?: string[];
  recommendedPlans?: Array<{
    id: string;
    name: string;
    price: string;
    reason: string;
  }>;
  needsHumanAgent?: boolean;
  metadata?: Record<string, any>;
}

export interface RecommendationRequest {
  budget: number;
  familySize: {
    adults: number;
    children: number;
  };
  age: number;
  priorities: string[];
}

export interface AnalyticsData {
  date: Date;
  totalSessions: number;
  totalMessages: number;
  avgSessionDuration?: string;
  plansRecommended?: Record<string, number>;
  commonQuestions?: string[];
  leadConversionRate?: number;
}
