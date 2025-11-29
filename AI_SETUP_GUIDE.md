# 🤖 AI Setup Guide

This CRM includes 10+ AI-powered features using Google Gemini AI.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Google AI API Key (FREE)

1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key (starts with `AIza...`)

### Step 2: Configure Environment

Add to your `.env` file:

```env
VITE_GOOGLE_AI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Update Import Statements

In the following files, change the import:

**Files to update:**
- `src/pages/Dashboard.tsx`
- `src/pages/AIInsights.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Contacts.tsx`
- `src/pages/Opportunities.tsx`
- `src/pages/Pipeline.tsx`

**Change from:**
```typescript
import { 
  analyzeLeadScore,
  predictOpportunityWinProbability,
  // ... other imports
} from '@/services/aiService';
```

**Change to:**
```typescript
import { 
  analyzeLeadScore,
  predictOpportunityWinProbability,
  // ... other imports
} from '@/services/aiService.direct';
```

### Step 4: Restart Development Server

```bash
npx vite --host 127.0.0.1
```

**Done!** AI features will now work. 🎉

---

## 💰 Google AI Pricing

**Free Tier:**
- ✅ **1,500 requests per day** - FREE
- ✅ **60 requests per minute** - FREE
- ✅ **32,000 tokens per request** - FREE
- ✅ No credit card required

Perfect for development and production use!

**Pricing Details:** https://ai.google.dev/pricing

---

## 🎯 AI Features Available

1. **Lead Scoring** - Automatically score leads 0-100
2. **Win Probability** - Predict deal closure likelihood
3. **Churn Prediction** - Identify at-risk customers
4. **Next Best Action** - AI-recommended next steps
5. **Sentiment Analysis** - Analyze customer communications
6. **Customer Segmentation** - Auto-group customers
7. **Email Generation** - Draft professional emails
8. **Customer Lifetime Value** - Estimate long-term value
9. **Smart Search** - Intelligent search suggestions
10. **Dashboard Insights** - Real-time business intelligence

---

## 🔧 Technical Details

### API Configuration

The AI service uses Google's Gemini 2.0 Flash model:

```typescript
// src/services/aiService.direct.ts
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_AI_API_KEY}`;
```

### Request Format

All AI requests follow this structure:

```typescript
{
  contents: [
    {
      role: 'user',
      parts: [{ text: 'Your prompt here' }]
    }
  ],
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048
  }
}
```

### Response Handling

Responses are parsed as JSON and include fallback mechanisms for reliability.

---

## 📝 Example Usage

### Lead Scoring

```typescript
import { analyzeLeadScore } from '@/services/aiService.direct';

const result = await analyzeLeadScore(lead);
// Returns: { score, reasoning, recommendations }
```

### Win Probability

```typescript
import { predictOpportunityWinProbability } from '@/services/aiService.direct';

const result = await predictOpportunityWinProbability(opportunity);
// Returns: { probability, reasoning, riskFactors, strengthFactors }
```

---

## ⚠️ Important Notes

1. **API Key Security**
   - Never commit your `.env` file
   - Keep your API key private
   - Use environment variables only

2. **Rate Limits**
   - Free tier: 1,500 requests/day
   - 60 requests per minute
   - Monitor your usage at https://aistudio.google.com

3. **Error Handling**
   - All AI functions include fallback responses
   - Errors are logged to console
   - User-friendly error messages displayed

---

## 🆘 Troubleshooting

### "API key not configured" Error

**Solution:** Make sure you've added `VITE_GOOGLE_AI_API_KEY` to your `.env` file.

### "Failed to get AI response" Error

**Possible causes:**
1. Invalid API key
2. Rate limit exceeded
3. Network connection issue

**Solution:** Check your API key and usage limits.

### AI Features Not Working

**Checklist:**
- [ ] API key added to `.env`
- [ ] Imports changed to `aiService.direct`
- [ ] Development server restarted
- [ ] `.env` file in root directory

---

## 📊 Monitoring Usage

Track your API usage at:
https://aistudio.google.com/app/apikey

You can see:
- Requests per day
- Remaining quota
- Usage patterns

---

## 🎉 You're Ready!

Your CRM now has full AI capabilities powered by Google Gemini!

**Next Steps:**
1. Try the AI features in the app
2. Monitor your usage
3. Customize prompts if needed

---

**Created**: 2025-11-29
**Status**: ✅ Ready to Use
