# Card Format Update - Rich HTML Design

## What Changed?

The `card` message type now supports a **richer, more beautiful format** with:
- ✅ Header images
- ✅ Markdown-style bold text (`**text**`)
- ✅ Bullet points with checkmarks
- ✅ Better button styling
- ✅ Gradient backgrounds
- ✅ Responsive design

## New Card Format

```json
{
  "messageType": "card",
  "content": {
    "title": "Comprehensive Value Plus Plan",
    "subtitle": "For families who need complete coverage",
    "color": "#4F46E5",
    "image_url": "https://day1health.co.za/images/comprehensive-value-plus.png",
    "price": "Starting at R665 per adult + R266 per child",
    "text": [
      "The Comprehensive Value Plus Plan offers full medical insurance coverage for you and your family, including:",
      "- **Day-to-Day Care**: GP visits, acute medication, basic dentistry, optometry",
      "- **Hospital Care**: Hospital stays, surgeries, specialists, emergency ambulance",
      "- **Chronic Medication**: Coverage for ongoing conditions",
      "- **Value Plus Benefits**: Balanced coverage with moderate limits, ideal for most families"
    ],
    "buttons": [
      {
        "type": "postback",
        "title": "See Coverage Details",
        "payload": "coverage_details_comprehensive_value_plus"
      },
      {
        "type": "postback",
        "title": "Get a Quote",
        "payload": "get_quote_comprehensive_value_plus"
      }
    ]
  }
}
```

## Visual Preview

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              [Plan Image - 192px height]                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Comprehensive Value Plus Plan                   │   │
│  │ For families who need complete coverage         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Starting at R665 per adult + R266 per child           │
│  ─────────────────────────────────────────────────     │
│                                                         │
│  The Comprehensive Value Plus Plan offers full         │
│  medical insurance coverage for you and your family,   │
│  including:                                             │
│                                                         │
│  ✓ Day-to-Day Care: GP visits, acute medication,       │
│    basic dentistry, optometry                          │
│                                                         │
│  ✓ Hospital Care: Hospital stays, surgeries,           │
│    specialists, emergency ambulance                    │
│                                                         │
│  ✓ Chronic Medication: Coverage for ongoing            │
│    conditions                                          │
│                                                         │
│  ✓ Value Plus Benefits: Balanced coverage with         │
│    moderate limits, ideal for most families           │
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │ See Coverage Details │  │    Get a Quote       │   │
│  └──────────────────────┘  └──────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Features

### 1. Image Header (Optional)
- Displays a hero image at the top
- Gradient overlay for text readability
- Title and subtitle overlaid on image
- Graceful fallback if image fails to load

### 2. Markdown Support
Text array supports:
- `**Bold text**` - Renders as `<strong>`
- `- Bullet points` - Renders with green checkmarks
- Regular paragraphs - Normal text

### 3. Styled Buttons
- Primary button (first): Filled with plan color
- Secondary buttons: Outlined with plan color
- Hover effects and shadows
- Responsive: Stack on mobile, row on desktop

### 4. Color Theming
Each card uses the plan's color for:
- Left border accent
- Background gradient
- Price text
- Button colors

## Text Formatting Examples

### Bold Text
```json
"text": ["This is **bold text** in a sentence"]
```
Renders: This is **bold text** in a sentence

### Bullet Points
```json
"text": [
  "- First benefit",
  "- Second benefit",
  "- Third benefit"
]
```
Renders:
- ✓ First benefit
- ✓ Second benefit
- ✓ Third benefit

### Combined
```json
"text": [
  "Our plan includes:",
  "- **Hospital Cover**: Full coverage for surgeries",
  "- **Day-to-Day**: GP visits and medication",
  "Perfect for families who need comprehensive care."
]
```

## Button Actions

Buttons trigger the `onAction` callback with:
```javascript
onAction(button.payload, {
  title: data.title,
  type: button.type
})
```

Example payloads:
- `get_quote_plan_name` - Trigger quote form
- `coverage_details_plan_name` - Show detailed coverage
- `compare_plans` - Open comparison view

## Legacy Format Support

The component still supports the old format for backward compatibility:

```json
{
  "messageType": "card",
  "content": {
    "plan": {
      "name": "Executive Comprehensive",
      "tagline": "For complete peace of mind",
      "price": "R665/month",
      "color": "#7C3AED",
      "benefits": ["Benefit 1", "Benefit 2"],
      "limitations": ["Limitation 1"],
      "buttons": [
        { "text": "Get Quote", "action": "capture_lead" }
      ]
    }
  }
}
```

## CSS Classes Used

- `rounded-xl` - Rounded corners
- `shadow-lg` - Drop shadow
- `overflow-hidden` - Clip image to card bounds
- `bg-gradient-to-t` - Gradient overlay on image
- `flex-col sm:flex-row` - Responsive button layout
- `hover:shadow-md` - Button hover effect

## Responsive Behavior

### Mobile (< 640px)
- Buttons stack vertically
- Full width buttons
- Image height: 192px

### Desktop (≥ 640px)
- Buttons in a row
- Equal width buttons
- Image height: 192px

## Example Usage in System Prompt

```
When user asks "tell me about comprehensive plan", respond with:

{
  "messageType": "card",
  "content": {
    "title": "Comprehensive Value Plus Plan",
    "subtitle": "Complete coverage for your family",
    "color": "#4F46E5",
    "price": "R665 per adult + R266 per child",
    "text": [
      "Full medical insurance including:",
      "- **Day-to-Day**: GP visits, medication, dentistry",
      "- **Hospital**: Surgeries, specialists, emergency",
      "- **Chronic**: Ongoing condition coverage"
    ],
    "buttons": [
      {"type": "postback", "title": "Get Quote", "payload": "get_quote"}
    ]
  }
}
```

## Testing

Test the new format:

```bash
cd day1health-ai-chatbot
npm run dev
```

Try: "Tell me about the comprehensive plan"

Expected: Beautiful card with image, formatted text, and action buttons

## Files Modified

- `src/types/messageTypes.ts` - Updated CardContent interface
- `src/components/PlanCard.tsx` - New rendering logic
- `src/lib/prompts.ts` - Updated card format example
- `src/lib/exampleResponses.ts` - New example card

## Benefits

✅ More visually appealing
✅ Better information hierarchy
✅ Supports images
✅ Markdown-style formatting
✅ Professional button design
✅ Responsive layout
✅ Backward compatible
