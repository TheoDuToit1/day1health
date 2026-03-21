# Structured Responses - Quick Reference

## 🎯 What Changed?

Your chatbot now returns **visual components** instead of plain text using Hugging Face AI.

## 📋 Message Types Cheat Sheet

### Carousel (3+ Plans)
```json
{
  "messageType": "carousel",
  "content": {
    "title": "Our affordable options:",
    "items": [
      {
        "planName": "Day-to-Day",
        "price": "R385/month",
        "highlights": ["GP visits", "Medication"],
        "color": "#0D9488"
      }
    ]
  }
}
```

### Comparison (2-3 Plans)
```json
{
  "messageType": "comparison",
  "content": {
    "plans": [
      {
        "name": "Day-to-Day",
        "price": "R385",
        "gpVisits": "✅ Yes",
        "hospital": "❌ No"
      }
    ]
  }
}
```

### Card (Single Plan)
```json
{
  "messageType": "card",
  "content": {
    "plan": {
      "name": "Executive",
      "price": "R665/month",
      "color": "#7C3AED",
      "benefits": ["Benefit 1", "Benefit 2"],
      "buttons": [
        { "text": "Get Quote", "action": "capture_lead" }
      ]
    }
  }
}
```

### Quick Replies (Buttons)
```json
{
  "messageType": "quick_replies",
  "content": {
    "text": "What matters most?",
    "quickReplies": ["Hospital", "Budget", "Everything"]
  }
}
```

### List (Features)
```json
{
  "messageType": "list",
  "content": {
    "title": "Waiting Periods",
    "items": [
      { "icon": "⏱️", "label": "1 month", "text": "GP visits" }
    ]
  }
}
```

### Text (Simple)
```json
{
  "messageType": "text",
  "content": {
    "text": "Hi there! How can I help?"
  }
}
```

## 🎨 Plan Colors

| Plan | Color | Hex |
|------|-------|-----|
| Day-to-Day | Teal | `#0D9488` |
| Value Plus | Indigo | `#4F46E5` |
| Executive | Purple | `#7C3AED` |
| Platinum | Red | `#DB504A` |
| Senior | Yellow | `#FFCE26` |

## 🧪 Testing

### Test AI Responses
```bash
cd day1health-ai-chatbot
node test-structured-responses.js
```

### Test in Browser
```bash
npm run dev
```

Try these messages:
- "Show me plans" → Carousel
- "Compare plans" → Table
- "Tell me about executive" → Card

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/prompts.ts` | System prompt with JSON instructions |
| `pages/api/chat.ts` | JSON parsing logic |
| `src/components/MessageRenderer.tsx` | Routes to correct component |
| `src/types/messageTypes.ts` | TypeScript types |

## 🔧 Troubleshooting

**AI returns plain text?**
- API has fallback to wrap in text type
- Check system prompt is sent correctly

**JSON parsing fails?**
- Handler strips markdown code blocks
- Check console logs for raw response

**Components don't render?**
- Check browser console for errors
- Verify imports are correct

## 📚 Full Documentation

- `STRUCTURED_RESPONSES_GUIDE.md` - Detailed examples
- `IMPLEMENTATION_SUMMARY.md` - What was changed
- `src/lib/exampleResponses.ts` - Example JSON structures
