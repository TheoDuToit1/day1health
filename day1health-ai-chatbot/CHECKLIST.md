# Day1Health AI Chatbot - Setup Checklist

Use this checklist to track your progress setting up the chatbot.

## ✅ Phase 1: Initial Setup (COMPLETED)

- [x] Project folder created
- [x] Dependencies installed (`npm install`)
- [x] Development server running (`npm run dev`)
- [x] Can access http://localhost:3001
- [x] Chat widget appears on page

## 📋 Phase 2: Database Setup (TODO)

- [ ] Created Supabase account at supabase.com
- [ ] Created new Supabase project
- [ ] Ran `database/schema.sql` in SQL Editor
- [ ] Ran `database/seed-data.sql` in SQL Editor
- [ ] Verified tables created:
  - [ ] chat_sessions
  - [ ] chat_messages
  - [ ] insurance_plans
  - [ ] plan_benefits
  - [ ] chat_leads
  - [ ] chatbot_analytics
  - [ ] faq_knowledge_base
- [ ] Copied Supabase URL from Settings > API
- [ ] Copied `anon` key from Settings > API
- [ ] Copied `service_role` key from Settings > API

## 🤖 Phase 3: AI Setup (TODO)

- [ ] Created Anthropic account at console.anthropic.com
- [ ] Created API key
- [ ] Added billing/credits (minimum R500)
- [ ] Copied API key (starts with `sk-ant-`)

## ⚙️ Phase 4: Configuration (TODO)

- [ ] Opened `.env` file in chatbot folder
- [ ] Added `ANTHROPIC_API_KEY`
- [ ] Added `SUPABASE_URL`
- [ ] Added `SUPABASE_ANON_KEY`
- [ ] Added `SUPABASE_SERVICE_KEY`
- [ ] Saved `.env` file
- [ ] Restarted dev server (Ctrl+C, then `npm run dev`)

## 🧪 Phase 5: Testing (TODO)

Test these conversations to verify everything works:

- [ ] Test 1: "I need health insurance for my family"
  - Should ask qualifying questions
  - Should recommend plans
  
- [ ] Test 2: "What's the difference between hospital and comprehensive?"
  - Should explain in simple terms
  
- [ ] Test 3: "How much for 2 adults and 1 child?"
  - Should calculate pricing
  
- [ ] Test 4: "How do I apply?"
  - Should explain application process
  
- [ ] Test 5: Check database
  - [ ] Open Supabase > Table Editor
  - [ ] Check `chat_messages` table has your test messages
  - [ ] Check `chat_sessions` table has your session

## 🔗 Phase 6: Integration (OPTIONAL)

If you want to add the chatbot to your main Day1Health website:

- [ ] Read `docs/INTEGRATION_GUIDE.md`
- [ ] Choose integration method:
  - [ ] Option A: Embedded widget (recommended)
  - [ ] Option B: React component
  - [ ] Option C: Standalone page
  - [ ] Option D: Iframe
- [ ] Add chatbot script to main site
- [ ] Test on main site
- [ ] Verify chat works on main site

## 🚀 Phase 7: Production Deployment (OPTIONAL)

When ready to deploy to production:

- [ ] Read `docs/DEPLOYMENT.md`
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Deploy: `vercel`
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy to production: `vercel --prod`
- [ ] Test production URL
- [ ] Update main site to use production URL

## 📊 Phase 8: Monitoring (OPTIONAL)

Set up monitoring and analytics:

- [ ] Monitor Supabase usage in dashboard
- [ ] Monitor Claude API usage in Anthropic console
- [ ] Set up billing alerts
- [ ] Review chatbot analytics:
  ```sql
  SELECT * FROM chatbot_analytics ORDER BY date DESC;
  ```
- [ ] Review captured leads:
  ```sql
  SELECT * FROM chat_leads WHERE status = 'new';
  ```
- [ ] Review popular FAQs:
  ```sql
  SELECT question, usage_count 
  FROM faq_knowledge_base 
  ORDER BY usage_count DESC;
  ```

## 🎯 Current Status

**Phase Completed**: Phase 1 ✅  
**Next Phase**: Phase 2 (Database Setup)  
**Estimated Time to Complete**: 10 minutes

## 📝 Notes

Use this space to track any issues or customizations:

```
Date: ___________
Issue/Note: 




Resolution: 




```

## 🆘 Common Issues

### Issue: Chat doesn't respond
**Solution**: Complete Phase 2-4 (add API keys)

### Issue: "Failed to connect to database"
**Solution**: Check Supabase credentials in `.env`

### Issue: "Claude API error"
**Solution**: Verify API key and billing in Anthropic console

### Issue: Port already in use
**Solution**: Change port in `package.json` or stop other process

## 📞 Support

If you get stuck:
- 📧 Email: admin@day1.co.za
- 📞 Phone: 0876 100 600
- 📚 Docs: See README.md and other .md files

## ✨ Success Criteria

You'll know everything is working when:
- ✅ Chat widget appears on page
- ✅ You can type messages
- ✅ Bot responds with intelligent answers
- ✅ Conversations are saved in database
- ✅ Plan recommendations work
- ✅ Lead capture works

---

**Last Updated**: March 20, 2026  
**Version**: 1.0  
**Status**: Ready for Phase 2
