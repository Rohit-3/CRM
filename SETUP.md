# 🚀 Quick Setup - Enterprise CRM

Get your CRM up and running in 10 minutes!

---

## ✅ Prerequisites

- **Node.js** ≥ 20 ([Download](https://nodejs.org/))
- **pnpm** package manager
- **Google account** (for AI features)
- **Supabase account** (for database)

---

## 📦 Installation

### Step 1: Clone or Download

```bash
git clone YOUR_REPO_URL
cd CRM
```

### Step 2: Install pnpm

```bash
npm install -g pnpm
```

### Step 3: Install Dependencies

```bash
pnpm install
```

---

## 🔐 Configuration

### Step 4: Set Up Environment Variables

1. **Copy the template:**
   ```bash
   cp .env.example .env
   ```

2. **Get Google AI API Key** (FREE)
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in and click "Create API Key"
   - Copy your key

3. **Get Supabase Credentials** (FREE)
   - Visit: https://supabase.com
   - Create a new project
   - Go to Settings → API
   - Copy your Project URL and anon key

4. **Edit `.env` file:**
   ```env
   VITE_LOGIN_TYPE=gmail
   VITE_GOOGLE_AI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 🎯 Configure AI Features

### Step 5: Update Import Statements

Change imports in these 6 files to use Google AI directly:

**Files to update:**
- `src/pages/Dashboard.tsx`
- `src/pages/AIInsights.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Contacts.tsx`
- `src/pages/Opportunities.tsx`
- `src/pages/Pipeline.tsx`

**In each file, change:**
```typescript
// FROM:
import { ... } from '@/services/aiService';

// TO:
import { ... } from '@/services/aiService.direct';
```

---

## 🚀 Run the Application

### Step 6: Start Development Server

```bash
npx vite --host 127.0.0.1
```

### Step 7: Open in Browser

Navigate to: **http://127.0.0.1:5173/**

---

## ✅ Verify Everything Works

### Test Checklist:

- [ ] App loads without errors
- [ ] Can log in with Gmail
- [ ] Dashboard displays
- [ ] Can create a lead
- [ ] Can create a contact
- [ ] AI features work (try "AI Insights" button)
- [ ] Pipeline Kanban board loads
- [ ] Can drag and drop opportunities

---

## 🎉 You're Ready!

Your Enterprise CRM is now running with:
- ✅ Full CRM functionality
- ✅ AI-powered features
- ✅ Modern UI
- ✅ Secure authentication

---

## 📚 Next Steps

### Explore Features:
- **Dashboard** - View analytics and insights
- **Pipeline** - Manage deals with Kanban board
- **AI Insights** - Try all 10 AI features
- **Reports** - Generate analytics

### Read Documentation:
- `AI_SETUP_GUIDE.md` - Detailed AI configuration
- `COMPLETE_FEATURE_LIST.md` - All 150+ features
- `QUICK_START_GUIDE.md` - User guide
- `FINAL_SUMMARY.md` - Complete overview

---

## 💰 Costs

**Everything is FREE for development:**
- ✅ Google AI: 1,500 requests/day free
- ✅ Supabase: Free tier (500MB database)
- ✅ All features included

---

## 🆘 Troubleshooting

### "Cannot find module" errors
```bash
pnpm install
```

### "API key not configured"
- Check `.env` file exists in root directory
- Verify `VITE_GOOGLE_AI_API_KEY` is set
- Restart dev server

### "Supabase connection failed"
- Verify Supabase URL and key in `.env`
- Check Supabase project is active
- Restart dev server

### AI features not working
- Confirm imports changed to `aiService.direct`
- Check Google AI API key is valid
- Verify you haven't exceeded rate limits

---

## 🔧 Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server
npx vite --host 127.0.0.1

# Build for production
npx vite build

# Preview production build
npx vite preview
```

---

## 📞 Support

Check the documentation files for detailed guides:
- Setup issues → `README.md`
- AI configuration → `AI_SETUP_GUIDE.md`
- Feature questions → `COMPLETE_FEATURE_LIST.md`

---

**Setup Time**: ~10 minutes
**Status**: ✅ Production Ready
**Last Updated**: 2025-11-29
