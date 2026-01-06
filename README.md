# Campus AI Grievance Intelligence System

A full-stack web application powered by Google Gemini AI that empowers students to submit campus grievances and enables administrators to view structured, actionable insights through AI-powered analysis.

## 🎯 Problem Statement

Universities face challenges in:

- **Grievance Management**: Unstructured complaints arriving through multiple channels
- **Prioritization**: Difficulty determining which issues need immediate attention
- **Admin Insight**: Lack of structured data for decision-making
- **Student Communication**: Limited transparency in grievance resolution

This system transforms unstructured student complaints into categorized, prioritized, and summarized information for efficient resolution.

## ✨ Key Features

### Student Interface

- **Simple Submission**: Intuitive form for free-text grievance submission
- **Instant Confirmation**: Real-time feedback with grievance ID
- **AI Insights**: View AI-generated analysis of their complaint
- **Email Tracking**: Receive updates via email (future enhancement)

### Admin Dashboard

- **Comprehensive List**: View all submitted grievances
- **AI-Generated Insights**:
  - **Category**: Hostel, Academics, Mess, Infrastructure, Safety, Health, Other
  - **Urgency**: Low, Medium, High
  - **Sentiment**: Neutral, Angry, Distressed
  - **Summary**: 2-3 line concise summary for quick review
- **Advanced Filtering**: Filter by category and urgency level
- **Statistics Dashboard**: Overview of grievance distribution
- **Detailed View**: Expand any grievance to see full complaint, analysis, and sentiment

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (React + Vite)                    │
│  ┌──────────────────┐         ┌───────────────────────────────┐  │
│  │   Homepage       │         │  Student Submission Form      │  │
│  └──────────────────┘         └───────────────────────────────┘  │
│  ┌──────────────────┐         ┌───────────────────────────────┐  │
│  │  Admin Dashboard │◄────────┤  API Service Layer            │  │
│  │  (Filter, Sort)  │         │  (Axios + REST)               │  │
│  └──────────────────┘         └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
                    HTTP REST API (Port 8080)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Routes:                                             │   │
│  │  • POST /api/grievances - Submit & analyze               │   │
│  │  • GET /api/grievances - Fetch all (with filters)       │   │
│  │  • GET /api/grievances/:id - Get single grievance       │   │
│  │  • GET /api/grievances/stats - Dashboard statistics     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  AI Analysis Engine:                                     │   │
│  │  • Google Gemini API (Primary)                           │   │
│  │  • Mock Analysis (Fallback)                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                    Firebase SDK (Cloud Firestore)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│           Database (Firebase Firestore)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Collection: grievances                                  │   │
│  │  ├── studentName                                         │   │
│  │  ├── studentEmail                                        │   │
│  │  ├── complaint (raw text)                                │   │
│  │  ├── category (AI generated)                             │   │
│  │  ├── urgency (AI generated)                              │   │
│  │  ├── sentiment (AI generated)                            │   │
│  │  ├── summary (AI generated)                              │   │
│  │  └── timestamps                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🧠 AI Analysis System

### Gemini Integration

The system uses Google's Gemini Pro model to analyze complaints:

```
User Complaint Input
        ▼
AI Prompt Processing
        ▼
Gemini API Call
        ▼
JSON Response Parsing
        ▼
Structured Output: {category, urgency, sentiment, summary}
        ▼
Database Storage
        ▼
Admin Dashboard Display
```

### Fallback Strategy

- **Primary**: Google Gemini API (real AI analysis)
- **Fallback**: Rule-based mock analysis (if API unavailable)
- **Always Available**: System ensures insights are always provided

### AI Prompt Template

```
You are an AI assistant for a university grievance redressal system.
Given a student complaint:
1. Categorize the issue into Hostel, Academics, Mess, Infrastructure, Safety, Health, or Other.
2. Determine urgency: Low, Medium, or High.
3. Detect sentiment: Neutral, Angry, or Distressed.
4. Summarize the issue in 2–3 concise lines for administrators.
Return ONLY valid JSON in the format:
{
  "category": "string",
  "urgency": "string",
  "sentiment": "string",
  "summary": "string"
}
```

## 🚀 Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 3
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router 6
- **HTTP Client**: Axios
- **Notifications**: Sonner
- **State Management**: React Hooks + TanStack Query

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI**: Google Generative AI (Gemini)
- **Database**: Firebase Firestore
- **Type Safety**: TypeScript

### Deployment

- **Hosting**: Netlify (recommended) or Vercel
- **Database**: Firebase Firestore (Cloud)
- **API**: Express backend on Netlify Functions or similar

## 📋 Prerequisites

- **Node.js** >= 18.x
- **pnpm** (or npm/yarn)
- **Google Cloud Account** with Gemini API enabled (optional, mock data works too)
- **Firebase Project** (optional, mock data works too)

## 🛠️ Setup & Installation

### 1. Clone & Install Dependencies

```bash
# Clone the repository (if using git)
git clone <repository-url>
cd campus-ai-grievance

# Install dependencies
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Google Gemini API (Optional - for real AI analysis)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (Optional - for persistent storage)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Optional: Server configuration
PING_MESSAGE="pong"
```

### 3. Get Gemini API Key (Optional but Recommended)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Get API Key"
3. Select your project or create a new one
4. Copy the API key
5. Add it to your `.env` file as `GEMINI_API_KEY`

### 4. Setup Firebase (Optional but Recommended for Production)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Firestore Database**
4. Copy your Firebase configuration
5. Add credentials to `.env` file

## 🏃 Running Locally

### Development Mode

```bash
# Start development server (frontend + backend)
pnpm dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal)

### Building for Production

```bash
# Build both frontend and backend
pnpm build

# Start production server
pnpm start
```

## 📱 Application Routes

### Frontend Routes

- `/` - **Homepage**: Overview and navigation
- `/submit-grievance` - **Student Form**: Submit new grievance
- `/admin-dashboard` - **Admin Panel**: View and filter grievances

### Backend API Routes

- `POST /api/grievances` - Submit grievance with AI analysis
- `GET /api/grievances` - Fetch all grievances (with optional filters)
- `GET /api/grievances/:id` - Get single grievance details
- `GET /api/grievances/stats` - Get dashboard statistics

## 🎨 UI/UX Features

### Homepage

- Modern gradient background
- Clear value proposition
- Step-by-step process visualization
- Technology highlights
- Call-to-action buttons

### Student Form

- Form validation with error messages
- Real-time character count
- Loading states
- Success confirmation with analysis results
- Grievance ID display
- Next steps guidance

### Admin Dashboard

- Statistics cards (total, high urgency, categories)
- Filtering by category and urgency
- Expandable grievance cards
- Color-coded badges:
  - Categories: Different colors for each type
  - Urgency: Red (High), Yellow (Medium), Green (Low)
  - Sentiment: Red (Angry), Yellow (Distressed), Gray (Neutral)
- Responsive grid layout

## 📊 Data Model

### Grievance Document (Firestore)

```typescript
{
  id: string,                    // Auto-generated
  studentName: string,           // User input
  studentEmail: string,          // User input (validated)
  complaint: string,             // User input (free-text)
  category: string,              // AI-generated (Hostel|Academics|...)
  urgency: string,               // AI-generated (Low|Medium|High)
  sentiment: string,             // AI-generated (Neutral|Angry|Distressed)
  summary: string,               // AI-generated (2-3 lines)
  createdAt: Timestamp,          // Server timestamp
  updatedAt: Timestamp           // Server timestamp
}
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Type checking
pnpm typecheck

# Format code
pnpm format.fix
```

## 🚀 Deployment

### Deploy to Netlify (Recommended)

```bash
# Build for production
pnpm build

# Netlify automatically deploys from git
# Connect your repository to Netlify in their dashboard
```

### Deploy to Vercel

```bash
# Same build process
pnpm build

# Connect your repository to Vercel
# Vercel automatically deploys
```

### Manual Deployment

1. Build the project: `pnpm build`
2. Serve the `dist` folder as static content
3. Set up backend API separately (Express server)
4. Configure environment variables on your hosting platform

## 🔄 Scaling to Multiple Campuses

The system is designed for easy multi-campus deployment:

### Single Deployment, Multiple Campuses

```
1. Add "campus" field to grievance documents:
   {
     ...grievanceData,
     campus: "Main Campus" | "North Campus" | ...
   }

2. Add campus filter to admin dashboard:
   - Dropdown to select campus
   - Filter grievances by campus ID

3. Use Firestore query for campus-specific data:
   query(collection(db, 'grievances'),
         where('campus', '==', selectedCampus))
```

### Multi-Tenant Architecture

```
1. Create separate Firestore collections:
   - /campuses/{campusId}/grievances/{grievanceId}

2. Campus admin login:
   - Admin dashboard shows only their campus grievances

3. Dashboard URL structure:
   - /admin/campus/{campusId}/dashboard
```

## 🤖 Mock AI Data

When Gemini API is unavailable, the system provides mock analysis based on keywords:

| Keyword                     | Category       | Urgency | Sentiment  |
| --------------------------- | -------------- | ------- | ---------- |
| hostel, dorm, room          | Hostel         | -       | -          |
| class, exam, grade          | Academics      | -       | -          |
| mess, food, canteen         | Mess           | -       | -          |
| lab, library, building      | Infrastructure | -       | -          |
| safe, security, guard       | Safety         | -       | -          |
| health, medical, sick       | Health         | -       | -          |
| urgent, critical, emergency | -              | High    | -          |
| important, serious          | -              | Medium  | -          |
| angry, furious, outraged    | -              | -       | Angry      |
| worried, concerned, anxious | -              | -       | Distressed |

## 📚 API Documentation

### Submit Grievance

```bash
POST /api/grievances
Content-Type: application/json

{
  "studentName": "John Doe",
  "studentEmail": "john@university.edu",
  "complaint": "The hostel Wi-Fi is not working since yesterday..."
}

Response:
{
  "success": true,
  "grievanceId": "grievance_1234567890_abc123def456",
  "analysis": {
    "category": "Infrastructure",
    "urgency": "Medium",
    "sentiment": "Distressed",
    "summary": "Student reports persistent Wi-Fi outage in hostel area..."
  }
}
```

### Get All Grievances

```bash
GET /api/grievances?category=Academics&urgency=High

Response:
{
  "count": 5,
  "grievances": [
    {
      "id": "grievance_...",
      "studentName": "...",
      "studentEmail": "...",
      "complaint": "...",
      "category": "Academics",
      "urgency": "High",
      "sentiment": "Angry",
      "summary": "...",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Statistics

```bash
GET /api/grievances/stats

Response:
{
  "total": 42,
  "byCategory": {
    "Hostel": 12,
    "Academics": 15,
    "Mess": 8,
    "Infrastructure": 5,
    "Safety": 1,
    "Health": 1,
    "Other": 0
  },
  "byUrgency": {
    "High": 8,
    "Medium": 18,
    "Low": 16
  },
  "bySentiment": {
    "Angry": 5,
    "Distressed": 20,
    "Neutral": 17
  }
}
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill the process using the port
lsof -i :8080
kill -9 <PID>
```

### Firebase Connection Issues

- Verify Firebase credentials in `.env`
- Check internet connection
- Ensure Firestore database is enabled in Firebase Console

### Gemini API Errors

- Verify API key is correct
- Check API quotas in Google Cloud Console
- System will fall back to mock analysis

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear build cache
rm -rf dist
pnpm build
```


## 📄 License

This project is provided as-is for educational and institutional use.

## 🎓 Future Enhancements

- [ ] Email notifications for grievance updates
- [ ] SMS alerts for high-urgency grievances
- [ ] Grievance status tracking (Submitted → In Progress → Resolved)
- [ ] Admin response and resolution notes
- [ ] Analytics dashboard with trends
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced filtering (date range, sentiment analysis)
- [ ] Bulk actions for admin
- [ ] Grievance assignment to departments
- [ ] SLA tracking and monitoring
- [ ] Integration with university information system

## 🙏 Acknowledgments

- Built with Google Gemini AI for intelligent analysis
- Firebase Firestore for reliable data storage
- React and modern web technologies
- Project for Techsprint GDG on campus

---

**Campus AI Grievance Intelligence System** - Transforming campus feedback into actionable intelligence ⚡
