# Integration Guide - Day1Health AI Chatbot

This guide explains how to integrate the Day1Health AI Chatbot with your main website.

## Integration Options

### Option 1: Embedded Widget (Recommended)

Add the chatbot as a floating widget on your existing Day1Health website.

#### Step 1: Build the Chatbot
```bash
cd day1health-ai-chatbot
npm run build
```

#### Step 2: Deploy to Hosting
Deploy the built files to your hosting provider (Vercel, Netlify, etc.)

#### Step 3: Add Script to Main Site
Add this code to your main Day1Health website's HTML (before closing `</body>` tag):

```html
<!-- Day1Health AI Chatbot -->
<script>
  window.Day1ChatbotConfig = {
    apiUrl: 'https://chatbot.day1health.co.za/api/chat',
    position: 'bottom-right', // or 'bottom-left'
    theme: 'light', // or 'dark'
    welcomeMessage: 'Hi! How can I help you find the perfect health plan today?'
  };
</script>
<script src="https://chatbot.day1health.co.za/widget.js"></script>
<div id="day1health-chatbot-root"></div>
```

### Option 2: React Component Integration

If your main site uses React, you can import the component directly.

#### Step 1: Install as Dependency
```bash
# In your main project
npm install ../day1health-ai-chatbot
```

#### Step 2: Import and Use
```tsx
import ChatWidget from 'day1health-ai-chatbot/src/components/ChatWidget';

function App() {
  return (
    <div>
      {/* Your existing app */}
      <ChatWidget 
        apiUrl="https://chatbot.day1health.co.za/api/chat"
        position="bottom-right"
        theme="light"
      />
    </div>
  );
}
```

### Option 3: Standalone Page

Create a dedicated chat page on your website.

#### Add Route
```tsx
// In your routing configuration
<Route path="/chat" element={<ChatPage />} />
```

#### Create Chat Page
```tsx
import ChatWidget from 'day1health-ai-chatbot/src/components/ChatWidget';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Chat with Day1Health</h1>
        <ChatWidget 
          apiUrl="/api/chat"
          position="bottom-right"
        />
      </div>
    </div>
  );
}
```

### Option 4: Iframe Integration

Embed the chatbot using an iframe (simplest but less flexible).

```html
<iframe 
  src="https://chatbot.day1health.co.za" 
  width="400" 
  height="600"
  frameborder="0"
  style="position: fixed; bottom: 20px; right: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
></iframe>
```

## Configuration Options

### ChatWidget Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | string | `/api/chat` | API endpoint for chat requests |
| `position` | `'bottom-right'` \| `'bottom-left'` | `'bottom-right'` | Widget position on screen |
| `theme` | `'light'` \| `'dark'` | `'light'` | Color theme |
| `welcomeMessage` | string | Default message | First message shown to users |

### Environment Variables

Create `.env` file in the chatbot project:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
NEXT_PUBLIC_APP_URL=https://chatbot.day1health.co.za
NEXT_PUBLIC_MAIN_SITE_URL=https://day1health.co.za
```

## Styling Customization

### Custom Colors

Override default colors using CSS variables:

```css
:root {
  --chatbot-primary: #2563eb; /* Blue */
  --chatbot-secondary: #f3f4f6; /* Gray */
  --chatbot-text: #111827; /* Dark gray */
  --chatbot-border: #e5e7eb; /* Light gray */
}
```

### Custom CSS

Add custom styles to match your brand:

```css
/* Override chatbot styles */
#day1health-chatbot-root {
  font-family: 'Your Brand Font', sans-serif;
}

#day1health-chatbot-root .chat-button {
  background-color: #your-brand-color;
}

#day1health-chatbot-root .chat-window {
  border: 2px solid #your-brand-color;
}
```

## Context Passing

Pass page context to improve chatbot responses:

```javascript
// When user is viewing a specific plan
window.Day1ChatbotConfig.context = {
  currentPage: '/plans/comprehensive',
  viewedPlans: ['Comprehensive Value Plus', 'Hospital Platinum'],
  userBudget: 1500
};
```

## Event Tracking

Track chatbot interactions for analytics:

```javascript
// Listen to chatbot events
window.addEventListener('day1-chatbot-message-sent', (event) => {
  console.log('User sent:', event.detail.message);
  // Send to Google Analytics, etc.
});

window.addEventListener('day1-chatbot-lead-captured', (event) => {
  console.log('Lead captured:', event.detail);
  // Track conversion
});
```

## Mobile Optimization

The chatbot is mobile-responsive by default. For mobile-specific behavior:

```javascript
window.Day1ChatbotConfig.mobile = {
  fullScreen: true, // Use full screen on mobile
  position: 'bottom', // Position at bottom on mobile
};
```

## Testing Integration

### Local Testing

1. Run chatbot locally:
```bash
cd day1health-ai-chatbot
npm run dev
```

2. Update main site to point to local API:
```javascript
window.Day1ChatbotConfig.apiUrl = 'http://localhost:3001/api/chat';
```

### Production Testing

1. Deploy chatbot to staging environment
2. Test on staging version of main site
3. Verify all features work correctly
4. Deploy to production

## Troubleshooting

### Chatbot Not Appearing

1. Check browser console for errors
2. Verify script URL is correct
3. Ensure `#day1health-chatbot-root` div exists
4. Check for CSS conflicts

### API Errors

1. Verify environment variables are set
2. Check Supabase connection
3. Verify Claude API key is valid
4. Check CORS settings

### Styling Issues

1. Check for CSS conflicts with main site
2. Use browser dev tools to inspect elements
3. Add `!important` to override conflicting styles
4. Use more specific CSS selectors

## Performance Optimization

### Lazy Loading

Load chatbot only when needed:

```javascript
// Load chatbot script on user interaction
document.getElementById('chat-trigger').addEventListener('click', () => {
  const script = document.createElement('script');
  script.src = 'https://chatbot.day1health.co.za/widget.js';
  document.body.appendChild(script);
});
```

### Caching

Enable caching for chatbot assets:

```nginx
# Nginx configuration
location /chatbot/ {
  expires 1d;
  add_header Cache-Control "public, immutable";
}
```

## Security Considerations

### CORS Configuration

Configure CORS to allow requests from your domain:

```typescript
// In API route
res.setHeader('Access-Control-Allow-Origin', 'https://day1health.co.za');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// Example using express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/chat', limiter);
```

## Support

For integration support:
- Email: admin@day1.co.za
- Phone: 0876 100 600
- Documentation: See other docs in this folder

## Next Steps

1. Review [API Documentation](./API_DOCUMENTATION.md)
2. Check [Deployment Guide](./DEPLOYMENT.md)
3. Test integration thoroughly
4. Monitor performance and user feedback
