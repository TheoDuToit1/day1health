// Test script to verify structured JSON responses from Hugging Face
// Run with: node test-structured-responses.js

const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('❌ Missing HUGGINGFACE_API_KEY in .env file');
  process.exit(1);
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const SYSTEM_PROMPT = `You are a helpful AI assistant for Day1Health, a South African medical insurance provider.

CRITICAL - RESPONSE FORMAT:
You MUST ALWAYS respond with valid JSON in this exact format:
{
  "messageType": "carousel|comparison|card|text|quick_replies|list",
  "content": { ... }
}

MESSAGE TYPES:
1. "carousel" - When showing 3+ plan options
2. "comparison" - When comparing 2-3 specific plans
3. "card" - When explaining ONE specific plan
4. "quick_replies" - When asking user a question with choices
5. "list" - When explaining features/benefits
6. "text" - ONLY for simple greetings or clarifications

PLAN COLORS:
- Day-to-Day: "#0D9488"
- Value Plus: "#4F46E5"
- Executive: "#7C3AED"
- Platinum: "#DB504A"
- Senior Plans: "#FFCE26"

NEVER return long paragraphs. Always use the most visual format possible.`;

async function testStructuredResponse(userMessage) {
  console.log('\n' + '='.repeat(60));
  console.log(`📝 User: "${userMessage}"`);
  console.log('='.repeat(60));

  try {
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    console.log('\n🤖 AI Response (raw):');
    console.log(content);

    // Try to parse JSON
    let jsonContent = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(jsonContent);
    
    console.log('\n✅ Parsed JSON:');
    console.log(JSON.stringify(parsed, null, 2));
    
    console.log(`\n📊 Message Type: ${parsed.messageType}`);
    
    return parsed;
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing Structured JSON Responses with Hugging Face\n');

  const testCases = [
    'Show me affordable plans',
    'Compare day-to-day vs comprehensive',
    'Tell me about the executive plan',
    'What matters most to you in a health plan?',
    'What are the waiting periods?',
    'Hi there!',
  ];

  for (const testCase of testCases) {
    await testStructuredResponse(testCase);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests complete!');
  console.log('='.repeat(60));
}

// Run tests
runTests().catch(console.error);
