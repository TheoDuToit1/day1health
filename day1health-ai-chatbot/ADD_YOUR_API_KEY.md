# 🔑 Add Your Google API Key

## Quick Instructions

### Step 1: Get Your Full API Key

1. Go to [Google AI Studio API Keys](https://aistudio.google.com/app/apikey)
2. Find your key: **ty1kGemini API Key** (created Mar 20, 2026)
3. Click on it to reveal the full key
4. Copy the entire key (should start with `AIzaSy...`)

### Step 2: Open the .env File

In the `day1health-ai-chatbot` folder, open the `.env` file.

### Step 3: Paste Your Key

Replace `your_api_key_here` with your actual key:

```env
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Example:**
```env
# Before:
GOOGLE_API_KEY=your_api_key_here

# After:
GOOGLE_API_KEY=AIzaSyDfG8h3J9kL2mN4pQ6rS7tU8vW9xY0zA1B
```

### Step 4: Save the File

Save the `.env` file.

### Step 5: Start the Server

```bash
npm run dev
```

### Step 6: Test It!

Visit http://localhost:3001 and try chatting!

## 📍 Where is the .env File?

```
day1health-ai-chatbot/
├── .env  ← THIS FILE (edit this one)
├── .env.example
└── ...
```

## ✅ What Your .env Should Look Like

```env
# Google Gemini API (FREE tier available!)
GOOGLE_API_KEY=AIzaSyDfG8h3J9kL2mN4pQ6rS7tU8vW9xY0zA1B

# Supabase Configuration (optional for now)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_MAIN_SITE_URL=http://localhost:5173
```

## 🎯 Testing Without Supabase

You can test the chatbot with JUST the Google API key!

The Supabase keys are optional for now. The chatbot will:
- ✅ Respond to your messages
- ✅ Have intelligent conversations
- ❌ Won't save conversation history (needs Supabase)

## 🚀 After Adding Your Key

Run these commands:

```bash
cd day1health-ai-chatbot
npm run dev
```

Then visit: http://localhost:3001

## 🧪 Test Questions

Try these to test the AI:

1. "I need health insurance for my family"
2. "What's the difference between hospital and comprehensive plans?"
3. "How much does it cost for 2 adults and 2 children?"
4. "Explain Day1Health plans in simple terms"

## 🆘 Troubleshooting

### Can't find .env file?
- It's in the `day1health-ai-chatbot` folder
- If it doesn't exist, copy `.env.example` and rename to `.env`

### API key not working?
- Make sure you copied the FULL key
- Check there are no spaces before/after the key
- Verify the key is active in Google AI Studio

### Still getting errors?
- Check the browser console (F12) for error messages
- Make sure you saved the `.env` file
- Restart the server after editing `.env`

## 💡 Pro Tip

You can test if your key works by running:

```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

Replace `YOUR_API_KEY` with your actual key.

---

**Next Step**: Add your key and run `npm run dev`! 🚀
