# Structured JSON Responses Guide

## Overview

Your Day1Health chatbot now uses **structured JSON responses** instead of plain text. The Hugging Face AI returns JSON with a `messageType` field, and the frontend renders beautiful visual components based on that type.

## How It Works

### 1. AI Returns Structured JSON

The system prompt instructs Hugging Face to return JSON like this:

```json
{
  "messageType": "carousel",
  "content": {
    "title": "Here are 3 plans that fit your budget:",
    "items": [
      {
        "planName": "Value Plus Comprehensive",
        "price": "R1,326/month",
        "highlights": ["Unlimited GP visits", "Dentistry included", "24/7 Emergency"],
        "color": "#4F46E5"
      }
    ]
  }
}
```

### 2. Frontend Renders Visual Components

The `MessageRenderer` component reads `messageType` and displays the appropriate UI:

- `carousel` → Swipeable plan cards
- `comparison` → Side-by-side table
- `card` → Single plan detail view
- `quick_replies` → Button choices
- `list` → Icon list with features
- `progress` → Step-by-step progress indicator
- `text` → Simple text bubble (fallback)

## Message Types

### 1. Carousel - Browse Multiple Plans

**When to use:** Showing 3+ plan options

**Example:**
```json
{
  "messageType": "carousel",
  "content": {
    "title": "Here are our most affordable options:",
    "items": [
      {
        "planName": "Day-to-Day Single",
        "price": "R385/month",
        "highlights": ["GP visits", "Acute medication", "Basic dentistry"],
        "color": "#0D9488",
        "cta": "Learn More"
      },
      {
        "planName": "Hospital Value Plus",
        "price": "R390/month",
        "highlights": ["Hospital cover", "Surgeries", "Emergency ambulance"],
        "color": "#4F46E5",
        "cta": "Learn More"
      }
    ],
    "actionButtons": ["Compare These", "Get Quote"]
  }
}
```

### 2. Comparison - Side-by-Side Plans

**When to use:** User asks to compare 2-3 specific plans

**Example:**
```json
{
  "messageType": "comparison",
  "content": {
    "title": "Day-to-Day vs Comprehensive",
    "plans": [
      {
        "name": "Day-to-Day",
        "price": "R385/month",
        "gpVisits": "✅ Unlimited",
        "hospital": "❌ Not covered",
        "chronic": "❌ Not covered"
      },
      {
        "name": "Comprehensive",
        "price": "R665/month",
        "gpVisits": "✅ Unlimited",
        "hospital": "✅ Full cover",
        "chronic": "✅ Covered"
      }
    ]
  }
}
```

### 3. Card - Single Plan Detail

**When to use:** Explaining ONE specific plan in detail

**Example:**
```json
{
  "messageType": "card",
  "content": {
    "plan": {
      "name": "Executive Comprehensive",
      "tagline": "For complete peace of mind",
      "price": "R665/month per adult + R266/child",
      "color": "#7C3AED",
      "benefits": [
        "Unlimited GP visits at network doctors",
        "Full hospital cover with no sub-limits",
        "Chronic medication included"
      ],
      "limitations": [
        "3-month waiting period for new chronic conditions"
      ],
      "buttons": [
        { "text": "Get Quote", "action": "capture_lead" },
        { "text": "Compare Plans", "action": "show_comparison" }
      ]
    }
  }
}
```

### 4. Quick Replies - Button Choices

**When to use:** Asking user a question with 3-5 limited choices

**Example:**
```json
{
  "messageType": "quick_replies",
  "content": {
    "text": "What matters most to you in a health plan?",
    "quickReplies": [
      "Hospital Cover",
      "Day-to-Day Visits",
      "Chronic Medication",
      "Budget Under R500"
    ]
  }
}
```

### 5. List - Features/Benefits

**When to use:** Explaining features or details of one plan

**Example:**
```json
{
  "messageType": "list",
  "content": {
    "title": "Waiting Period Breakdown",
    "items": [
      { "icon": "⏱️", "label": "1 month", "text": "GP visits & basic medication", "color": "green" },
      { "icon": "⏳", "label": "3 months", "text": "New chronic conditions", "color": "orange" },
      { "icon": "📅", "label": "12 months", "text": "Pre-existing conditions", "color": "red" }
    ]
  }
}
```

### 6. Progress - Multi-Step Flow

**When to use:** Guiding through enrollment or application process

**Example:**
```json
{
  "messageType": "progress",
  "content": {
    "currentStep": 2,
    "totalSteps": 4,
    "steps": [
      { "label": "Tell us about you", "status": "complete" },
      { "label": "Choose your plan", "status": "active" },
      { "label": "Payment details", "status": "pending" },
      { "label": "Confirmation", "status": "pending" }
    ]
  }
}
```

### 7. Text - Simple Response

**When to use:** ONLY for greetings, clarifications, or simple conversational responses

**Example:**
```json
{
  "messageType": "text",
  "content": {
    "text": "Hi there! How can I help you today?"
  }
}
```

## Plan Color Codes

Use these colors consistently for visual recognition:

```javascript
const planColors = {
  "Day-to-Day": "#0D9488",    // Teal
  "Value Plus": "#4F46E5",    // Indigo
  "Executive": "#7C3AED",     // Purple
  "Platinum": "#DB504A",      // Red
  "Senior Plans": "#FFCE26"   // Yellow
}
```

## Example Conversations

### User: "Show me affordable plans"

**AI Response:**
```json
{
  "messageType": "carousel",
  "content": {
    "title": "Our most affordable options:",
    "items": [
      {
        "planName": "Day-to-Day Single",
        "price": "R385/month",
        "highlights": ["GP visits", "Acute medication", "Basic dentistry"],
        "color": "#0D9488"
      },
      {
        "planName": "Hospital Value Plus",
        "price": "R390/month",
        "highlights": ["Hospital cover", "Surgeries", "24/7 Emergency"],
        "color": "#4F46E5"
      }
    ]
  }
}
```

**Frontend renders:** Swipeable carousel with colorful cards

---

### User: "Compare Day-to-Day vs Comprehensive"

**AI Response:**
```json
{
  "messageType": "comparison",
  "content": {
    "plans": [
      {
        "name": "Day-to-Day",
        "price": "R385/month",
        "gpVisits": "✅ Unlimited",
        "hospital": "❌ None"
      },
      {
        "name": "Comprehensive",
        "price": "R665/month",
        "gpVisits": "✅ Unlimited",
        "hospital": "✅ Full cover"
      }
    ]
  }
}
```

**Frontend renders:** Side-by-side comparison table

---

### User: "What are the waiting periods?"

**AI Response:**
```json
{
  "messageType": "list",
  "content": {
    "title": "Waiting Period Breakdown",
    "items": [
      { "icon": "⏱️", "label": "1 month", "text": "GP visits & basic medication" },
      { "icon": "⏳", "label": "3 months", "text": "New chronic conditions" },
      { "icon": "📅", "label": "12 months", "text": "Pre-existing conditions" }
    ]
  }
}
```

**Frontend renders:** Clean icon list with timeline feel

## Testing

To test the structured responses:

1. Start your dev server: `npm run dev`
2. Open the chat widget
3. Try these test messages:
   - "Show me all plans" → Should return carousel
   - "Compare day-to-day and comprehensive" → Should return comparison
   - "Tell me about executive plan" → Should return card
   - "What matters most to you?" → Should return quick_replies

## Troubleshooting

### AI Returns Plain Text Instead of JSON

The API handler has a fallback that wraps plain text in a text message type:

```typescript
{
  messageType: 'text',
  content: { text: 'the plain text response' }
}
```

### JSON Parsing Fails

The handler strips markdown code blocks before parsing:

```typescript
// Removes ```json and ``` wrappers
jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
```

### Unknown Message Type

The `MessageRenderer` component has a default case that displays a fallback message.

## Files Modified

1. `src/lib/prompts.ts` - Updated system prompt with JSON instructions
2. `pages/api/chat.ts` - Added JSON parsing logic
3. `src/types/messageTypes.ts` - TypeScript definitions
4. `src/components/MessageRenderer.tsx` - Main message router
5. `src/components/PlanCarousel.tsx` - Carousel component
6. `src/components/ComparisonTable.tsx` - Comparison table
7. `src/components/PlanCard.tsx` - Single plan card
8. `src/components/QuickReplies.tsx` - Button choices
9. `src/components/IconList.tsx` - Feature list
10. `src/components/ProgressStepper.tsx` - Progress indicator
11. `src/components/ChatWidget.tsx` - Updated to use MessageRenderer

## Next Steps

1. Test with real Hugging Face responses
2. Adjust the system prompt if AI doesn't follow JSON format consistently
3. Add more visual components as needed
4. Customize colors and styling to match your brand
