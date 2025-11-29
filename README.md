# Enterprise CRM Platform

A modern, AI-powered Customer Relationship Management system built with React, TypeScript, and Supabase.

## Project Overview

This is a full-featured CRM application with advanced AI capabilities, designed for sales teams and businesses to manage leads, contacts, opportunities, and customer relationships.

## Project Directory

```
├── README.md # Documentation
├── components.json # Component library configuration
├── eslint.config.js # ESLint configuration
├── index.html # Entry file
├── package.json # Package management
├── postcss.config.js # PostCSS configuration
├── public # Static resources directory
│   ├── favicon.png # Icon
│   └── images # Image resources
├── src # Source code directory
│   ├── App.tsx # Entry file
│   ├── components # Components directory
│   ├── context # Context directory
│   ├── db # Database configuration directory
│   ├── hooks # Common hooks directory
│   ├── index.css # Global styles
│   ├── layout # Layout directory
│   ├── lib # Utility library directory
│   ├── main.tsx # Entry file
│   ├── routes.tsx # Routing configuration
│   ├── pages # Pages directory
│   ├── services # Database interaction directory
│   ├── types # Type definitions directory
├── tsconfig.app.json # TypeScript frontend configuration file
├── tsconfig.json # TypeScript configuration file
├── tsconfig.node.json # TypeScript Node.js configuration file
└── vite.config.ts # Vite configuration file
```

## Tech Stack

Vite, TypeScript, React, Supabase

## Development Guidelines

### How to edit code locally?

You can choose [VSCode](https://code.visualstudio.com/Download) or any IDE you prefer. The only requirement is to have Node.js and npm installed.

### Environment Requirements

```
# Node.js ≥ 20
# npm ≥ 10
Example:
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

### Installing Node.js on Windows

```
# Step 1: Visit the Node.js official website: https://nodejs.org/, click download. The website will automatically suggest a suitable version (32-bit or 64-bit) for your system.
# Step 2: Run the installer: Double-click the downloaded installer to run it.
# Step 3: Complete the installation: Follow the installation wizard to complete the process.
# Step 4: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### Installing Node.js on macOS

```
# Step 1: Using Homebrew (Recommended method): Open Terminal. Type the command `brew install node` and press Enter. If Homebrew is not installed, you need to install it first by running the following command in Terminal:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Alternatively, use the official installer: Visit the Node.js official website. Download the macOS .pkg installer. Open the downloaded .pkg file and follow the prompts to complete the installation.
# Step 2: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### After installation, follow these steps:

```
# Step 1: Download the code package or clone from GitHub
# Step 2: Extract the code package (if downloaded as zip)
# Step 3: Open the code package with your IDE and navigate into the code directory
# Step 4: Copy .env.example to .env and configure your environment variables
cp .env.example .env
# Edit .env with your actual Supabase credentials and App ID
# Step 5: In the IDE terminal, run the command to install dependencies: pnpm i
# Step 6: In the IDE terminal, run the command to start the development server: npx vite --host 127.0.0.1
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
VITE_LOGIN_TYPE=gmail
VITE_APP_ID=your_app_id_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Note**: Never commit your `.env` file to version control. Use `.env.example` as a template.

### How to develop backend services?

Configure environment variables and install relevant dependencies. If you need to use a database, please use the official version of Supabase.

## Features

- 📊 **Dashboard** - Real-time analytics and insights
- 👥 **Contact Management** - Comprehensive customer database
- 💼 **Lead Tracking** - Sales pipeline management
- 💰 **Opportunity Management** - Deal tracking with Kanban board
- ✅ **Task Management** - Organize and track activities
- 📈 **Reports & Analytics** - Data-driven insights
- 🤖 **AI Features** - 10+ AI-powered capabilities including lead scoring, churn prediction, and win probability
- 🔐 **Authentication** - Secure Gmail-based login
- 🎨 **Modern UI** - Dark theme with professional design

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.0 Flash
- **Authentication**: Supabase Auth

## Learn More

For detailed documentation, check the included guides:
- `QUICK_START_GUIDE.md` - Get started quickly
- `AI_SETUP_GUIDE.md` - Configure AI features
- `COMPLETE_FEATURE_LIST.md` - All 150+ features
- `FINAL_SUMMARY.md` - Comprehensive overview
