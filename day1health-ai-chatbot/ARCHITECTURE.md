# Structured Responses Architecture

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ChatWidget Component                        │
│  • Captures user input                                          │
│  • Sends to /api/chat                                           │
│  • Displays messages                                            │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Route (/api/chat)                       │
│  • Receives user message                                        │
│  • Builds conversation history                                  │
│  • Calls Hugging Face API                                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Hugging Face (Qwen Model)                     │
│  • Receives system prompt + user message                        │
│  • Generates structured JSON response                           │
│  • Returns JSON with messageType                                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      JSON Parsing Logic                          │
│  • Strips markdown code blocks (```json)                        │
│  • Parses JSON                                                  │
│  • Validates structure                                          │
│  • Fallback to text type if parsing fails                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MessageRenderer                             │
│  • Reads messageType field                                      │
│  • Routes to appropriate component                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
        ┌───────────────────┐     ┌───────────────────┐
        │   PlanCarousel    │     │ ComparisonTable   │
        │   • Swipeable     │     │   • Side-by-side  │
        │   • Color-coded   │     │   • Checkmarks    │
        └───────────────────┘     └───────────────────┘
                    ▼                         ▼
        ┌───────────────────┐     ┌───────────────────┐
        │     PlanCard      │     │   QuickReplies    │
        │   • Single plan   │     │   • Buttons       │
        │   • Detailed      │     │   • Interactive   │
        └───────────────────┘     └───────────────────┘
                    ▼                         ▼
        ┌───────────────────┐     ┌───────────────────┐
        │     IconList      │     │ ProgressStepper   │
        │   • Features      │     │   • Multi-step    │
        │   • Icons         │     │   • Status        │
        └───────────────────┘     └───────────────────┘
```

## Component Hierarchy

```
ChatWidget
├── MessageRenderer
│   ├── PlanCarousel
│   │   └── CarouselItem (multiple)
│   ├── ComparisonTable
│   │   └── TableRow (multiple)
│   ├── PlanCard
│   │   ├── Benefits List
│   │   ├── Limitations List
│   │   └── Action Buttons
│   ├── QuickReplies
│   │   └── Reply Button (multiple)
│   ├── IconList
│   │   └── ListItem (multiple)
│   ├── ProgressStepper
│   │   └── Step (multiple)
│   └── TextBubble (fallback)
```

## Data Flow

### 1. User Input
```typescript
User types: "Show me affordable plans"
  ↓
ChatWidget captures input
  ↓
Sends POST to /api/chat with:
{
  sessionId: "uuid",
  message: "Show me affordable plans",
  context: { currentPage: "/" }
}
```

### 2. API Processing
```typescript
API receives request
  ↓
Builds message history
  ↓
Calls Hugging Face with system prompt
  ↓
Receives response:
{
  "messageType": "carousel",
  "content": { ... }
}
```

### 3. Response Parsing
```typescript
Raw response from HF
  ↓
Strip markdown: ```json ... ```
  ↓
Parse JSON
  ↓
Validate structure
  ↓
Return to frontend:
{
  reply: { messageType, content },
  suggestions: [...],
  metadata: { ... }
}
```

### 4. Frontend Rendering
```typescript
ChatWidget receives response
  ↓
Adds to messages array
  ↓
MessageRenderer reads messageType
  ↓
Routes to PlanCarousel component
  ↓
Renders swipeable cards with colors
```

## Message Type Decision Tree

```
User Message
    │
    ├─ Contains "show", "all", "options"?
    │  └─ YES → carousel (multiple plans)
    │
    ├─ Contains "compare", "vs", "difference"?
    │  └─ YES → comparison (side-by-side)
    │
    ├─ Contains "tell me about", specific plan name?
    │  └─ YES → card (single plan detail)
    │
    ├─ AI asking a question?
    │  └─ YES → quick_replies (button choices)
    │
    ├─ Explaining features/benefits?
    │  └─ YES → list (icon list)
    │
    ├─ Multi-step process?
    │  └─ YES → progress (stepper)
    │
    └─ Simple greeting/clarification?
       └─ YES → text (plain text)
```

## Error Handling

```
Hugging Face API Call
    │
    ├─ Success?
    │  ├─ YES → Parse JSON
    │  │   ├─ Valid JSON?
    │  │   │  ├─ YES → Render component
    │  │   │  └─ NO → Fallback to text type
    │  │   │
    │  └─ NO → Return error message
    │
    └─ Network Error?
       └─ Display: "Call us at 0876 100 600"
```

## Type Safety

```typescript
// TypeScript ensures type safety throughout

StructuredMessage
    ├─ messageType: MessageType
    └─ content: 
        ├─ CarouselContent
        ├─ ComparisonContent
        ├─ CardContent
        ├─ QuickRepliesContent
        ├─ ListContent
        ├─ ProgressContent
        └─ TextContent
```

## Performance Considerations

1. **Lazy Loading**: Components only render when needed
2. **Memoization**: React components use proper keys
3. **Scroll Performance**: Carousel uses CSS snap points
4. **API Caching**: Conversation history stored in memory
5. **Token Limits**: Max 500 tokens per response

## Security

1. **Input Validation**: User messages sanitized
2. **JSON Parsing**: Try-catch with fallback
3. **API Keys**: Stored in environment variables
4. **CORS**: API route handles OPTIONS requests
5. **Rate Limiting**: 2-second delay in tests

## Scalability

1. **Stateless API**: No server-side session storage
2. **Client-side History**: Stored in component state
3. **Modular Components**: Easy to add new message types
4. **Type Definitions**: Centralized in messageTypes.ts
5. **Example Library**: exampleResponses.ts for reference
