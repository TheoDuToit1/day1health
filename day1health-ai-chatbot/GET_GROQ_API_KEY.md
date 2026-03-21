# 🚀 Get Your FREE Groq API Key (2 Minutes)

## Why Groq?

- ✅ **Completely FREE** - No credit card required
- ✅ **14,400 requests per day** - Very generous!
- ✅ **Super fast** - Fastest AI responses available
- ✅ **High quality** - Uses Llama 3.3 70B model
- ✅ **Easy setup** - Just 2 minutes!

## Step 1: Sign Up (1 minute)

1. Go to: https://console.groq.com
2. Click "Sign Up" or "Get Started"
3. Sign up with:
   - Google account (easiest)
   - GitHub account
   - Or email

## Step 2: Create API Key (30 seconds)

1. After signing in, you'll see the dashboard
2. Click on "API Keys" in the left sidebar
3. Click "Create API Key"
4. Give it a name (e.g., "Day1Health Chatbot")
5. Click "Create"
6. **COPY THE KEY IMMEDIATELY** (you won't see it again!)

The key will look like:
```
gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Step 3: Add to .env File (30 seconds)

1. Open `day1health-ai-chatbot/.env`
2. Find this line:
```env
GROQ_API_KEY=your_groq_api_key_here
```

3. Replace with your actual key:
```env
GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

4. **SAVE THE FILE!**

## Step 4: Start the Server

```bash
cd day1health-ai-chatbot
npm run dev
```

## Step 5: Test It!

1. Go to http://localhost:3001
2. Click the chat button
3. Type: "Hello, can you help me?"
4. Press Enter

**IT SHOULD WORK NOW!** 🎉

## What You Get with Groq FREE Tier

- ✅ **14,400 requests per day** (about 1 request every 6 seconds)
- ✅ **30 requests per minute**
- ✅ **No credit card required**
- ✅ **No expiration**
- ✅ **Super fast responses** (faster than ChatGPT!)

## Troubleshooting

### "Missing GROQ_API_KEY"
→ Make sure you saved the `.env` file

### "Invalid API key"
→ Copy the key again from Groq console
→ Make sure there are no spaces before/after the key

### Still not working?
→ Restart the server (Ctrl+C, then `npm run dev`)
→ Check browser console (F12) for errors

## Test Questions

Once it's working, try:

1. "What is Day1Health?"
2. "I need health insurance for my family"
3. "Compare hospital and comprehensive plans"
4. "How much for 2 adults and 2 children?"

## Why Groq is Better Than Google Gemini

| Feature | Groq | Google Gemini |
|---------|------|---------------|
| Free tier | 14,400/day | Issues with API keys |
| Speed | ⚡ Super fast | Normal |
| Setup | Easy | Complicated |
| Credit card | Not required | Sometimes required |
| Reliability | ✅ Works | ❌ Your key didn't work |

## Next Steps

Once your chatbot is working:
1. Test different questions
2. See how it explains insurance plans
3. Try plan recommendations
4. Integrate with your main Day1Health site

---

**Time to working chatbot**: 2 minutes  
**Cost**: FREE forever  
**Requests per day**: 14,400  

🚀 Let's get this working!
