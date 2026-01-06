# Setup Guide: Google Gemini & Firebase Configuration

This guide walks you through configuring Google Gemini AI and Firebase Firestore for the Campus AI Grievance System.

## Table of Contents

1. [Google Gemini Setup](#google-gemini-setup)
2. [Firebase Setup](#firebase-setup)
3. [Local Development](#local-development)
4. [Troubleshooting](#troubleshooting)

## Google Gemini Setup

### Why Gemini?

Google Gemini AI provides intelligent natural language processing to:

- Categorize complaints into predefined categories
- Assess urgency levels
- Detect emotional sentiment
- Generate concise summaries for administrators

### Step 1: Get Your API Key

1. **Open Google AI Studio**
   - Go to [Google AI Studio](https://aistudio.google.com/apikey)
   - Sign in with your Google account (create one if needed)

2. **Create API Key**
   - Click the "Get API Key" button
   - Click "Create API key in new project"
   - Click "Create API key"

3. **Copy Your Key**
   - Copy the generated API key
   - Keep it safe (don't share it publicly!)

### Step 2: Configure in Your Project

1. **Create `.env` file**

   ```bash
   cd your-project-directory
   touch .env
   ```

2. **Add Gemini API Key**

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Restart Dev Server**
   ```bash
   pnpm dev
   ```

### Step 3: Verify It Works

1. **Submit a Test Grievance**
   - Go to `http://localhost:5173/submit-grievance`
   - Fill out the form completely
   - Click "Submit"

2. **Check Results**
   - Look for AI analysis results showing:
     - Category (e.g., "Infrastructure")
     - Urgency (e.g., "High")
     - Sentiment (e.g., "Angry")
     - Summary (2-3 lines)

3. **Check Server Logs**
   - Look for "Using Gemini API analysis" message
   - If you see "Using mock AI analysis", the API key isn't configured correctly

### API Key Security Tips

- ✅ **DO**: Use environment variables
- ✅ **DO**: Restrict API key to only Generative Language API
- ✅ **DO**: Monitor API usage in Google Cloud Console
- ❌ **DON'T**: Commit `.env` file to git
- ❌ **DON'T**: Share API key in emails/chats
- ❌ **DON'T**: Use in public frontend code

## Firebase Setup

### Why Firebase?

Firebase Firestore provides:

- Real-time database with automatic scaling
- Secure data storage with authentication
- Easy to use API
- Free tier for development

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project"
   - Enter project name: `campus-ai-grievance`
   - Accept terms and click "Create project"
   - Wait for project creation (1-2 minutes)

### Step 2: Create Firestore Database

1. **Navigate to Firestore**
   - In Firebase Console, go to "Build" → "Firestore Database"

2. **Create Database**
   - Click "Create database"
   - Select "Start in production mode"
   - Choose location (select closest to your campus)
   - Click "Create"

3. **Set Security Rules** (for development)
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow all reads and writes for now (NOT for production!)
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

### Step 3: Get Firebase Configuration

1. **Open Project Settings**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"

2. **Navigate to "Your Apps"**
   - Scroll down to "Your apps" section
   - Under "SDK setup and configuration", look for your web app
   - If no app exists, click "Add app" and select "Web" (</> icon)

3. **Copy Configuration**
   - Under "Firebase SDK snippet", select "Config"
   - Copy the config object that looks like:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
   };
   ```

### Step 4: Configure in Your Project

1. **Update `.env` file**

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=campus-ai-grievance
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

2. **Restart Dev Server**
   ```bash
   pnpm dev
   ```

### Step 5: Initialize Firestore in App

The app uses the configuration to automatically initialize Firestore. Data will be saved when you submit grievances.

### Step 6: Verify It Works

1. **Submit a Grievance**
   - Go to `http://localhost:5173/submit-grievance`
   - Fill out and submit a test grievance

2. **Check Firebase Console**
   - Go back to Firebase Console
   - Navigate to "Firestore Database"
   - You should see a `grievances` collection created
   - Expand it to see your submitted grievance

3. **Check Admin Dashboard**
   - Go to `http://localhost:5173/admin-dashboard`
   - You should see the grievance listed

### Firebase Security Best Practices

#### Development Mode

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /grievances/{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Production Mode (Recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow authenticated users to read/write
    match /grievances/{grievanceId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null;
      allow delete: if request.auth.token.admin == true;
    }
  }
}
```

#### Admin-only Mode

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only admins can access
    match /grievances/{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
```

## Local Development

### Complete Setup Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Project cloned/downloaded
- [ ] `pnpm install` completed
- [ ] `.env` file created with Gemini API key
- [ ] `.env` file updated with Firebase config (optional)
- [ ] `pnpm dev` running successfully
- [ ] Can access `http://localhost:5173`

### Running Without External Services

The app works perfectly without external services:

- **Without Gemini**: Uses mock AI analysis (rule-based)
- **Without Firebase**: Uses in-memory database (data lost on restart)

This is perfect for:

- Local development and testing
- Demos and prototypes
- Learning and understanding the codebase

## Troubleshooting

### Gemini API Issues

#### Issue: "Gemini API key not configured"

**Solution**:

```bash
# 1. Check .env file exists
cat .env

# 2. Verify GEMINI_API_KEY is set
# 3. Restart dev server
pnpm dev
```

#### Issue: "Invalid API key"

**Solution**:

- Go back to [Google AI Studio](https://aistudio.google.com/apikey)
- Delete old key and create a new one
- Copy and paste new key exactly into `.env`

#### Issue: "Quota exceeded"

**Solution**:

- Check usage in [Google Cloud Console](https://console.cloud.google.com/)
- Wait for quota to reset (usually daily)
- Consider upgrading Google Cloud plan

#### Issue: Still seeing "Using mock AI analysis"

**Solution**:

1. Check server logs for error messages
2. Verify API key is correct
3. Check internet connection
4. Try restarting dev server: `pnpm dev`

### Firebase Issues

#### Issue: "Firebase initialization failed"

**Solution**:

```bash
# Check if .env variables are set correctly
echo $VITE_FIREBASE_PROJECT_ID

# Restart dev server
pnpm dev
```

#### Issue: "Permission denied" in Firestore

**Solution**:

- Go to Firebase Console
- Firestore Database → Rules
- Update rules (see "Firebase Security Best Practices" section)
- Publish rules

#### Issue: "Grievances not appearing in dashboard"

**Solution**:

1. Check Firebase Console Firestore
2. Verify `grievances` collection exists
3. Check browser console for errors (F12)
4. Try refreshing page

#### Issue: "Cannot connect to Firestore"

**Solution**:

- Check internet connection
- Verify Firebase project ID in `.env`
- Go to Firebase Console and enable Firestore
- Check firewall settings

## Environment Variables Reference

### Development (Required)

```
GEMINI_API_KEY=your_key  # Optional, mock analysis used if missing
```

### Firebase (Optional)

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Testing Your Setup

### Test Script

```bash
#!/bin/bash

echo "🔍 Checking setup..."
echo ""

# Check Node.js
echo "Node.js version:"
node --version

# Check pnpm
echo "pnpm version:"
pnpm --version

# Check environment
echo ""
echo "Environment check:"
test -f .env && echo "✅ .env file exists" || echo "❌ .env file missing"

# Start dev server
echo ""
echo "Starting dev server..."
pnpm dev
```

## Next Steps

Once you have everything set up:

1. **Read the Code**
   - Understand how AI analysis works in `server/utils/ai-analysis.ts`
   - Review API endpoints in `server/routes/grievance.ts`
   - Check Firebase integration in `client/config/firebase.ts`

2. **Customize**
   - Modify grievance categories in `server/utils/ai-analysis.ts`
   - Update styling in `client/global.css` and `tailwind.config.ts`
   - Add custom validations in student form

3. **Deploy**
   - See [README.md](./README.md) for deployment instructions
   - Choose between Netlify or Vercel
   - Configure environment variables on hosting platform

## Support

For issues or questions:

- Check [README.md](./README.md) troubleshooting section
- Review server logs: `pnpm dev` shows all errors
- Check browser console: Press F12 in browser
- Verify API keys are correct and have access

Good luck with your Campus AI Grievance System! 🚀
