import fs from 'fs';
import path from 'path';

let cachedKnowledgeBase: string | null = null;

/**
 * Loads the KNOWLEDGE_BASE.md file and returns its content
 * Caches the result for performance
 */
export function loadKnowledgeBase(): string {
  if (cachedKnowledgeBase) {
    return cachedKnowledgeBase;
  }

  try {
    const knowledgeBasePath = path.join(process.cwd(), 'KNOWLEDGE_BASE.md');
    cachedKnowledgeBase = fs.readFileSync(knowledgeBasePath, 'utf-8');
    return cachedKnowledgeBase;
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return ''; // Return empty string if file not found
  }
}

/**
 * Gets a condensed version of the knowledge base for the system prompt
 * (Full version might be too long for some AI models)
 */
export function getCondensedKnowledgeBase(): string {
  const fullKB = loadKnowledgeBase();
  
  // Extract key sections (you can customize this)
  const sections = [
    'Company Information',
    'Plan Pricing Details',
    'Plan Benefits',
    'Contact Information',
  ];

  // Simple extraction - in production you might want more sophisticated parsing
  return fullKB;
}

/**
 * Searches the knowledge base for relevant information
 * @param query - User's question
 * @returns Relevant section from knowledge base
 */
export function searchKnowledgeBase(query: string): string {
  const kb = loadKnowledgeBase();
  const queryLower = query.toLowerCase();

  // Simple keyword matching
  const keywords = {
    pricing: ['price', 'cost', 'how much', 'expensive', 'cheap', 'afford'],
    benefits: ['cover', 'benefit', 'include', 'what does'],
    application: ['apply', 'sign up', 'join', 'register'],
    claims: ['claim', 'reimburse', 'pay'],
    contact: ['contact', 'phone', 'email', 'call'],
    emergency: ['emergency', 'urgent', 'ambulance'],
  };

  // Find which category the query belongs to
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => queryLower.includes(word))) {
      // Extract relevant section from knowledge base
      const sectionStart = kb.indexOf(`## ${category}`);
      if (sectionStart !== -1) {
        const nextSection = kb.indexOf('##', sectionStart + 3);
        const section = nextSection !== -1 
          ? kb.substring(sectionStart, nextSection)
          : kb.substring(sectionStart);
        return section.substring(0, 2000); // Limit to 2000 chars
      }
    }
  }

  return ''; // No relevant section found
}
