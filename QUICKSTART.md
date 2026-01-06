# Quick Start Guide

Get the Campus AI Grievance Intelligence System up and running in 5 minutes! ⚡

## Prerequisites

- **Node.js** 18+ installed
- **pnpm** (or npm/yarn)

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Step 3: Test the Application

### Try as a Student:

1. Click "Submit Grievance" on the homepage
2. Fill in your name, email, and complaint
3. Click "Submit" and see the AI analysis!

### Try as an Admin:

1. Click "Admin Dashboard" on the homepage
2. View all submitted grievances
3. Use filters to sort by category or urgency

## Step 4: (Optional) Enable Real AI Analysis

### Get Gemini API Key:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Get API Key"
3. Copy the key

### Configure:

1. Create a `.env` file in project root
2. Add: `GEMINI_API_KEY=your_copied_key`
3. Restart dev server

## Features Demo

### Student Form Features:

- ✅ Name and email validation
- ✅ Character count for grievance
- ✅ Real-time error messages
- ✅ Success confirmation with grievance ID
- ✅ AI-generated insights displayed

### Admin Dashboard Features:

- ✅ Statistics overview (total, high urgency, categories)
- ✅ Filter by category or urgency
- ✅ Expandable grievance details
- ✅ Color-coded priority badges
- ✅ Sentiment analysis display
- ✅ AI-generated summaries

## API Endpoints

The backend is automatically running with the dev server:

- **Submit Grievance**: `POST /api/grievances`
- **Get All Grievances**: `GET /api/grievances`
- **Get Grievance by ID**: `GET /api/grievances/:id`
- **Get Statistics**: `GET /api/grievances/stats`

## Troubleshooting

### Port in use?

```bash
# Find and kill process on port 5173/8080
# macOS/Linux:
lsof -i :5173
kill -9 <PID>

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Dependencies issue?

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Build issues?

```bash
pnpm typecheck
npm run build
```

## Next Steps

- 📖 Read [README.md](./README.md) for full documentation
- 🔧 Configure Firebase for persistent storage
- 🚀 Deploy to Netlify or Vercel
- 🧠 Explore the AI analysis capabilities
- 📊 Set up multi-campus support

## Key Files

- **Frontend**: `client/pages/Index.tsx`, `client/pages/SubmitGrievance.tsx`, `client/pages/AdminDashboard.tsx`
- **Backend**: `server/index.ts`, `server/routes/grievance.ts`, `server/utils/ai-analysis.ts`
- **Config**: `.env`, `tailwind.config.ts`, `client/global.css`

## Commands Reference

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Run production server
pnpm typecheck        # Check TypeScript
pnpm test             # Run tests
pnpm format.fix       # Format code
```

## Support

See [README.md](./README.md) for comprehensive documentation and troubleshooting.

Happy grievance managing! 🎓
