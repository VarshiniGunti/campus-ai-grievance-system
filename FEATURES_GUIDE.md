# Campus AI Grievance System - Complete Features Guide

## 🎯 Overview

This guide covers all the new and existing features of the Campus AI Grievance Intelligence System, including recent enhancements for admin functionality, student grievance submission, and email notifications.

---

## 📚 Table of Contents

1. [Student Grievance Submission](#student-grievance-submission)
2. [Admin Login System](#admin-login-system)
3. [Admin Dashboard Features](#admin-dashboard-features)
4. [Email Notifications](#email-notifications)
5. [API Endpoints](#api-endpoints)

---

## 👨‍🎓 Student Grievance Submission

### Overview

Students can submit grievances with text descriptions and optional media attachments (images/videos).

### Access

- Navigate to homepage
- Click "Submit Grievance" button
- Or visit `/submit-grievance`

### Features

#### 1. **Basic Information**

- **Name**: Full name of the student (required)
- **Email**: Student's email address (required, validated)
- **Grievance Description**: Detailed complaint (minimum 20 characters)

#### 2. **File Upload** (NEW!)

- **Supported Formats**: JPG, PNG, GIF, MP4, WebM
- **File Size Limit**: 5MB per file
- **Maximum Files**: 5 files per grievance
- **Upload Features**:
  - Drag and drop support
  - Click to browse
  - Image preview thumbnails
  - Video indicators
  - Remove files individually
  - Character counter

#### 3. **Form Validation**

- Real-time error messages
- Email format validation
- Complaint length validation
- Clear error indicators

#### 4. **Success Response**

Upon successful submission, students receive:

- ✅ Grievance ID (for tracking)
- 🤖 AI Analysis Results:
  - Category (Hostel, Academics, Mess, Infrastructure, Safety, Health, Other)
  - Urgency Level (Low, Medium, High)
  - Sentiment (Neutral, Angry, Distressed)
  - Admin Summary (2-3 lines)
- 📧 Email confirmation notification

#### 5. **After Submission**

- View detailed analysis results
- Copy grievance ID for future reference
- See next steps
- Submit another grievance or return home

---

## 🔐 Admin Login System

### Overview

Secure authentication system for administrators to access the dashboard.

### Access

- Click "Admin Login" on homepage
- Or navigate to `/admin-login`

### Features

#### 1. **Email & PIN Authentication**

- **Email**: Administrator email address
- **PIN**: 4-digit numeric code
- Both fields are required

#### 2. **PIN Visibility Toggle** (NEW!)

- 👁️ **Eye Icon**: Click to show PIN
- 👁️‍🗨️ **Eye Off Icon**: Click to hide PIN
- Secure password input by default
- Smooth toggle animation

#### 3. **Demo Credentials** (for testing)

```
Account 1:
- Email: admin@campus.edu
- PIN: 1234

Account 2:
- Email: grievance@campus.edu
- PIN: 5678
```

#### 4. **Error Handling**

- Clear error messages for invalid credentials
- Toast notifications
- Form persists on error
- Accessibility features

#### 5. **Session Management**

- Automatic session storage
- Protected routes redirect to login
- One-click logout from dashboard

---

## 📊 Admin Dashboard Features

### Overview

Comprehensive dashboard for reviewing and managing all submitted grievances.

### Access

- Login with admin credentials
- Automatic redirect to `/admin-dashboard`
- Protected route - requires authentication

### Main Features

#### 1. **Statistics Overview** (4 Key Metrics)

- **Total**: All grievances submitted
- **High Urgency**: Grievances requiring immediate action
- **Viewed**: Grievances under review
- **Cleared**: Resolved grievances

#### 2. **Search by Grievance ID** (NEW!)

- **Search Box**: Enter grievance ID to find specific complaint
- **Real-time Search**: Instant results
- **Clear Search**: Reset to view all grievances
- **Error Handling**: Friendly message if ID not found
- **Search Format**: Copy-paste grievance ID from student confirmation

**Example Search:**

```
grievance_1704523456_abc123def456
```

#### 3. **Multi-Filter System** (NEW!)

Filter grievances by:

- ✅ **No Filter**: View all grievances
- 📂 **Category**: Hostel, Academics, Mess, Infrastructure, Safety, Health, Other
- 🚨 **Urgency**: Low, Medium, High
- 📌 **Status**: Submitted, Viewed, Cleared
- 📅 **Date Range**: From date to To date (inclusive)

**Combined Filters:**

- All filters work independently
- Can combine multiple criteria
- Clear all filters button
- Persistent filter selection

#### 4. **Status Management** (NEW!)

##### Status Options

1. **Submitted** (Default)
   - Initial state when grievance created
   - Not yet reviewed by admin

2. **Viewed** (Review State)
   - Admin has reviewed the grievance
   - Student notified via email
   - Optional message included

3. **Cleared** (Resolved State)
   - Grievance fully resolved
   - Student notified via email
   - Optional resolution message

##### How to Update Status

1. Click on any grievance card to expand details
2. Select "Mark as Viewed" or "Mark as Cleared"
3. (Optional) Add a message for the student
4. Click "Confirm"
5. Email automatically sent to student

#### 5. **Delete Functionality** (NEW!)

- **Delete Button**: Available in expanded grievance view
- **Confirmation**: Prevents accidental deletion
- **Permanent**: Cannot be undone
- **Immediate**: Instant removal from system

#### 6. **Detailed Grievance View**

Click any grievance card to expand and see:

- Full complaint text
- Student name and email
- Category, Urgency, Sentiment
- AI-generated summary
- Grievance ID
- Submission timestamp
- Current status
- Action buttons (Mark as Viewed/Cleared, Delete)

#### 7. **Color-Coded Information**

- **Urgency**:
  - 🔴 Red: High urgency
  - 🟡 Yellow: Medium urgency
  - 🟢 Green: Low urgency
- **Status**:
  - 🔵 Blue: Submitted
  - 🟡 Yellow: Viewed
  - 🟢 Green: Cleared
- **Sentiment**:
  - 🔴 Red: Angry
  - 🟡 Yellow: Distressed
  - ⚫ Gray: Neutral

#### 8. **Refresh Functionality**

- **Refresh Button**: Reload all data
- **Loading State**: Spinner during refresh
- **Manual Control**: Check updates anytime

#### 9. **Admin Session Info**

- Display logged-in admin email
- Quick logout button
- Prevents unauthorized access

---

## 📧 Email Notifications

### Overview

Automated email notifications sent to students when grievance status changes.

### Notification Triggers

#### 1. **When Marked as "Viewed"**

- **Subject**: ✅ Your Grievance Has Been Reviewed
- **Content**:
  - Confirmation of review
  - Grievance details (ID, Category, Urgency)
  - Optional admin message
  - Next steps information

#### 2. **When Marked as "Cleared"**

- **Subject**: 🎉 Your Grievance Has Been Resolved
- **Content**:
  - Confirmation of resolution
  - Grievance details (ID, Category, Urgency)
  - Optional resolution message
  - Contact information for follow-up

### Email Information Included

- Student name (personalized)
- Grievance ID (for reference)
- Category (issue type)
- Urgency level
- Status change details
- Optional admin message
- Footer with system branding

### Mock Email Service

**Current Implementation**: Console logging (development)

- Email logs displayed in server console
- Formatted for readability
- Useful for testing

**Production Implementation**:
For production deployment, integrate with:

- Nodemailer
- SendGrid
- AWS SES
- Gmail API
- Other SMTP services

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:8080/api
```

### Grievance Endpoints

#### 1. **Submit Grievance**

```
POST /api/grievances
```

**Request:**

```json
{
  "studentName": "John Doe",
  "studentEmail": "john@university.edu",
  "complaint": "The hostel Wi-Fi has been down for 3 days..."
}
```

**Response:**

```json
{
  "success": true,
  "grievanceId": "grievance_1704523456_abc123def456",
  "analysis": {
    "category": "Infrastructure",
    "urgency": "High",
    "sentiment": "Distressed",
    "summary": "Student reports persistent Wi-Fi outage..."
  }
}
```

#### 2. **Get All Grievances**

```
GET /api/grievances?category=Academics&urgency=High&startDate=2024-01-01&endDate=2024-12-31
```

**Query Parameters:**

- `category` (optional): Hostel, Academics, Mess, Infrastructure, Safety, Health, Other
- `urgency` (optional): Low, Medium, High
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response:**

```json
{
  "count": 5,
  "grievances": [
    {
      "id": "grievance_1704523456_abc123def456",
      "studentName": "John Doe",
      "studentEmail": "john@university.edu",
      "complaint": "...",
      "category": "Infrastructure",
      "urgency": "High",
      "sentiment": "Distressed",
      "summary": "...",
      "status": "submitted",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 3. **Search Grievance by ID**

```
GET /api/grievances/search/:id
```

**Example:**

```
GET /api/grievances/search/grievance_1704523456_abc123def456
```

**Response:**

```json
{
  "success": true,
  "grievance": {
    "id": "grievance_1704523456_abc123def456",
    "studentName": "John Doe",
    "studentEmail": "john@university.edu",
    "complaint": "...",
    "category": "Infrastructure",
    "urgency": "High",
    "sentiment": "Distressed",
    "summary": "...",
    "status": "submitted",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 4. **Update Grievance Status**

```
PATCH /api/grievances/:id/status
```

**Request:**

```json
{
  "status": "viewed",
  "message": "Your grievance has been reviewed. We are working on resolving it."
}
```

**Response:**

```json
{
  "success": true,
  "grievance": { ... },
  "emailNotificationSent": true,
  "message": "Grievance marked as viewed. Email notification sent."
}
```

#### 5. **Delete Grievance**

```
DELETE /api/grievances/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Grievance deleted successfully",
  "deletedGrievanceId": "grievance_1704523456_abc123def456"
}
```

#### 6. **Get Single Grievance**

```
GET /api/grievances/:id
```

**Response:**

```json
{
  "grievance": { ... }
}
```

#### 7. **Get Statistics**

```
GET /api/grievances/stats
```

**Response:**

```json
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
  },
  "byStatus": {
    "submitted": 20,
    "viewed": 15,
    "cleared": 7
  }
}
```

---

## 🎓 Student Workflow

```
1. Student visits homepage
   ↓
2. Clicks "Submit Grievance"
   ↓
3. Fills form (name, email, complaint)
   ↓
4. Optionally uploads media (images/videos)
   ↓
5. Submits form
   ↓
6. AI analyzes grievance
   ↓
7. Receives grievance ID and analysis
   ↓
8. Gets email confirmation
   ↓
9. Can track status later (future feature)
```

---

## 👨‍💼 Admin Workflow

```
1. Visit /admin-login
   ↓
2. Enter email and 4-digit PIN
   ↓
3. Toggle PIN visibility (optional)
   ↓
4. Click "Sign In"
   ↓
5. Access admin dashboard
   ↓
6. View statistics and grievances
   ↓
7. Search by grievance ID (optional)
   ↓
8. Apply filters by category, urgency, status, date
   ↓
9. Click grievance to expand details
   ↓
10. Mark as Viewed or Cleared
   ↓
11. Add optional message
   ↓
12. Student receives email notification
   ↓
13. Can delete grievance if needed
   ↓
14. Logout when done
```

---

## 🔒 Security Features

### Student Data

- ✅ Email validation
- ✅ Form validation
- ✅ Secure data transmission
- ✅ No sensitive data logging

### Admin Access

- ✅ PIN-based authentication
- ✅ Protected routes
- ✅ Session management
- ✅ Automatic logout option
- ✅ Email display in UI

### Database

- ✅ Mock data isolation (development)
- ✅ Ready for Firebase integration
- ✅ Prepared for backend authentication

---

## 📱 Responsive Design

All features are fully responsive:

- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

---

## 🚀 Future Enhancements

- [ ] Real file storage (AWS S3, Cloudinary)
- [ ] Advanced JWT authentication
- [ ] Two-factor authentication (2FA)
- [ ] Role-based access control (RBAC)
- [ ] Email template customization
- [ ] SMS notifications
- [ ] Automatic status escalation
- [ ] Analytics and reporting
- [ ] Department assignment
- [ ] Grievance tracking timeline

---

## 🆘 Troubleshooting

### Student Issues

**Q: My file won't upload**

- A: Check file size (max 5MB) and format (JPG, PNG, GIF, MP4, WebM)

**Q: I forgot my grievance ID**

- A: Check your email for confirmation message containing the ID

**Q: Form validation errors**

- A: Ensure all required fields are filled and email format is correct

### Admin Issues

**Q: PIN not showing/hiding**

- A: Click the eye icon toggle, ensure caps lock is off

**Q: Can't find grievance by ID**

- A: Double-check grievance ID for typos, use copy-paste from student email

**Q: Email not being sent**

- A: Currently in mock mode (console logging). Production needs email service configured.

**Q: Logout not working**

- A: Clear browser cache or try in private/incognito mode

---

## 📞 Support

For detailed setup and technical information, see:

- [README.md](./README.md) - Full documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Configuration guide
- [ADMIN_LOGIN_GUIDE.md](./ADMIN_LOGIN_GUIDE.md) - Admin authentication
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Architecture overview

---

**Campus AI Grievance Intelligence System** - Making campus feedback actionable 🚀
