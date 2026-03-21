# How the Knowledge Base Works

## Overview

The chatbot uses the `KNOWLEDGE_BASE.md` file to answer questions accurately. Here's how it works:

## Architecture

```
User Question
     ↓
Chat API (src/api/chat.ts)
     ↓
Load System Prompt (src/lib/prompts.ts)
     ↓
Load Knowledge Base (src/lib/loadKnowledgeBase.ts)
     ↓
Combine: System Prompt + Knowledge Base
     ↓
Send to AI (Gemini/Groq/etc.)
     ↓
AI Response (uses knowledge base to answer)
     ↓
Return to User
```

## How It Works

### 1. Knowledge Base File

The `KNOWLEDGE_BASE.md` file contains all information about:
- Company details
- All plans and pricing
- Benefits and coverage
- FAQs
- Application process
- Claims process
- Contact information

### 2. Loading the Knowledge Base

When the chatbot starts, `src/lib/loadKnowledgeBase.ts` reads the `KNOWLEDGE_BASE.md` file:

```typescript
import { loadKnowledgeBase } from './loadKnowledgeBase';

const knowledgeBase = loadKnowledgeBase();
// Returns the full content of KNOWLEDGE_BASE.md
```

### 3. Including in System Prompt

The `src/lib/prompts.ts` file automatically includes the knowledge base in the system prompt:

```typescript
export const SYSTEM_PROMPT = `
You are a Day1Health AI assistant.

KNOWLEDGE BASE:
${loadKnowledgeBase()}

Use the knowledge base above to answer questions.
`;
```

### 4. AI Uses Knowledge Base

When a user asks a question:
1. The question is sent to the AI
2. The AI has access to the full knowledge base in its system prompt
3. The AI searches the knowledge base for relevant information
4. The AI formulates an answer based on the knowledge base
5. The answer is returned to the user

## Example Flow

**User asks**: "How much does it cost for 2 adults and 2 children?"

1. Chat API receives the question
2. Loads system prompt with knowledge base
3. Sends to AI: 
   ```
   System: [Full knowledge base with all pricing]
   User: "How much does it cost for 2 adults and 2 children?"
   ```
4. AI searches knowledge base and finds pricing section
5. AI calculates:
   - Day-to-Day: (R385 × 2) + (R193 × 2) = R1,156/month
   - Hospital: (R390 × 2) + (R156 × 2) = R1,092/month
   - Comprehensive: (R665 × 2) + (R266 × 2) = R1,862/month
6. AI responds with accurate pricing

## Updating the Knowledge Base

### When to Update

Update `KNOWLEDGE_BASE.md` when:
- ✅ Plan pricing changes
- ✅ New plans are introduced
- ✅ Benefits are modified
- ✅ Contact information changes
- ✅ FAQs need to be added/updated
- ✅ Regulatory requirements change

### How to Update

1. Open `KNOWLEDGE_BASE.md`
2. Edit the relevant section
3. Save the file
4. Restart the chatbot server
5. The AI will now use the updated information!

**No code changes needed!** Just edit the markdown file.

## Performance Considerations

### Knowledge Base Size

The current knowledge base is ~25KB of text. This is:
- ✅ Small enough to include in every request
- ✅ Fast to load and cache
- ✅ Within AI model context limits

### Caching

The knowledge base is cached in memory:
```typescript
let cachedKnowledgeBase: string | null = null;
```

This means:
- First request: Reads file from disk (~1ms)
- Subsequent requests: Uses cached version (~0ms)
- Very fast performance!

### Token Usage

Including the knowledge base uses ~6,000 tokens per request:
- **Cost**: Minimal (Gemini free tier handles this easily)
- **Benefit**: Accurate, consistent answers
- **Trade-off**: Worth it for quality responses

## Advanced Features

### Search Function

The `searchKnowledgeBase()` function can find relevant sections:

```typescript
import { searchKnowledgeBase } from './loadKnowledgeBase';

const relevantInfo = searchKnowledgeBase("How do I apply?");
// Returns just the "Application Process" section
```

This can be used to:
- Reduce token usage (send only relevant sections)
- Improve response speed
- Focus AI on specific topics

### Condensed Version

For models with smaller context limits:

```typescript
import { getCondensedKnowledgeBase } from './loadKnowledgeBase';

const condensed = getCondensedKnowledgeBase();
// Returns a shorter version with key information only
```

## Troubleshooting

### Knowledge Base Not Loading

**Symptom**: AI gives generic answers, doesn't know specific details

**Solution**:
1. Check `KNOWLEDGE_BASE.md` exists in project root
2. Check file permissions (readable)
3. Restart the server
4. Check console for errors

### Outdated Information

**Symptom**: AI gives old pricing or incorrect details

**Solution**:
1. Update `KNOWLEDGE_BASE.md`
2. Restart server to clear cache
3. Test with a new conversation

### AI Not Using Knowledge Base

**Symptom**: AI says "I don't know" despite info being in knowledge base

**Solution**:
1. Check the system prompt includes knowledge base
2. Make sure the information is clearly written
3. Try rephrasing the question
4. Check AI model is receiving the full prompt

## Best Practices

### Writing Knowledge Base Content

✅ **DO:**
- Use clear, simple language
- Include specific examples
- Organize with headers and sections
- Keep information up-to-date
- Include all relevant details

❌ **DON'T:**
- Use vague or ambiguous language
- Include outdated information
- Make it too long (keep under 50KB)
- Forget to update when things change

### Testing Updates

After updating the knowledge base:

1. **Restart server**: `npm run dev`
2. **Test specific questions**: Ask about the updated info
3. **Verify accuracy**: Check AI gives correct answers
4. **Test edge cases**: Try unusual questions

## Alternative Approaches

### Option 1: Current Approach (Recommended)
- ✅ Load full knowledge base in system prompt
- ✅ Simple, reliable, fast
- ✅ AI has all information available
- ❌ Uses more tokens

### Option 2: Search-Based (Advanced)
- ✅ Only send relevant sections
- ✅ Uses fewer tokens
- ❌ More complex code
- ❌ Might miss relevant info

### Option 3: Database (Production)
- ✅ Store in Supabase
- ✅ Easy to update via admin panel
- ✅ Version control
- ❌ Requires database setup
- ❌ More complex architecture

## Summary

The knowledge base works by:
1. **Storing** all information in `KNOWLEDGE_BASE.md`
2. **Loading** the file when server starts
3. **Including** it in the AI system prompt
4. **Using** it to answer questions accurately

**To update**: Just edit `KNOWLEDGE_BASE.md` and restart the server!

---

**Current Status**: ✅ Knowledge base is loaded and working  
**Location**: `KNOWLEDGE_BASE.md` in project root  
**Size**: ~25KB  
**Last Updated**: March 20, 2026
