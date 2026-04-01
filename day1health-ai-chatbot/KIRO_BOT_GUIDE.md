# Developer Guide: Day1 Health AI Assistant Logic & Implementation

Hi Kiro! This guide explains the core logic, behavior, and integration patterns for the Day1 Health Chatbot.

## 1. The Bot's Purpose
The bot is a **Purely Informational Assistant**. 
- **Goal**: Guide users through plan benefits, waiting periods, and finding network providers.
- **Constraint**: It MUST NOT simulate a member portal or login. It should emphasize that claims are processed offline via PDF downloads.

## 2. Core Logic Flow
The bot operates on a **Stateless API -> Stateful Frontend** model.
1. **Frontend**: Maintains the message history array.
2. **Backend**: Receives the full history, injects the `systemInstruction` (the "Brain"), and calls the Gemini API.
3. **AI Response**: Returns a structured JSON object (not just text).
4. **Frontend Action**: Parses the JSON and executes UI updates (navigation, rendering HTML, showing buttons).

## 3. Response Structure (The JSON Contract)
The bot must **always** return a JSON object. This is critical for the frontend to function.

```json
{
  "message": "The text the user sees in the chat bubble.",
  "customHtml": "<div class='...'>Tailwind HTML for tables/cards</div>",
  "navigation": "page-id-to-navigate-to",
  "suggestedActions": ["Button 1", "Button 2"]
}
```

### Field Explanations:
- **`message`**: The primary conversational response.
- **`customHtml`**: Used for "Detailed Views". When the bot needs to show a table (like GP lists or Plan Comparisons), it generates a string of HTML using **Tailwind CSS classes**. 
    - *Frontend Logic*: The frontend should detect if `customHtml` exists and render it in a special container (e.g., a modal or an expandable card).
- **`navigation`**: A string ID representing a page on the website (e.g., `day-to-day`, `claims`, `network`).
    - *Frontend Logic*: If this field is present, the website should automatically switch the current view to that page.
- **`suggestedActions`**: An array of strings.
    - *Frontend Logic*: Render these as clickable "Quick Reply" chips below the bot's message.

## 4. Key Capabilities & "How-To"

### A. Provider Search (GPs & Dentists)
When a user asks "Find a GP in Benoni":
1. The bot searches the `FULL NETWORK PROVIDER DIRECTORY` (provided in the spec).
2. It identifies matches by Suburb or Region.
3. **Response Logic**: It should generate a `customHtml` table.
    - **Columns**: Name, Profession, Suburb, Address, Tel.
    - **Styling**: Use `table-auto`, `w-full`, `text-sm`, and zebra-striping (`even:bg-gray-50`).

### B. Plan Comparisons
When a user asks "Compare the plans":
1. **Clarification**: The bot is instructed to ask if they need cover for themselves or a family first.
2. **Generation**: Once info is gathered, it generates a `customHtml` comparison table using the data in the `INSURANCE_KNOWLEDGE_BASE`.

### C. Navigation Triggers
The bot acts as a site navigator.
- User: "How do I claim?"
- Bot: "We process claims offline..." + `navigation: "claims"`.
- Result: The user is automatically moved to the Claims & Downloads page while reading the explanation.

## 5. Implementation Tips for Kiro

### 1. Handling Rate Limits (429 Errors)
The Gemini API can occasionally hit rate limits. Your backend function should implement **Exponential Backoff**.
- If you get a 429 error, wait 1s, then 2s, then 4s before giving up.

### 2. System Instruction Injection
Never send the `systemInstruction` from the frontend. Keep it in your backend service. Every time you call the API, prepend the instructions to the conversation history so the bot never "forgets" its identity or the provider data.

### 3. Safety & Constraints
- **No Scripts**: Ensure the bot never returns `<script>` tags in `customHtml`.
- **Tailwind Only**: The `customHtml` assumes Tailwind CSS is available globally on the site.

### 4. State Persistence
Ensure the chat history is stored in a high-level component (like `App.tsx` or a Global Store). If the user navigates to a new page, the chat window should stay open and the history should remain visible.

---
*Good luck with the build! Refer to `CHATBOT_REBUILD_SPEC.md` for the raw data and prompt text.*
