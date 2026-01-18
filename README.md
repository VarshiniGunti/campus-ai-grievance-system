# Campus AI Grievance Intelligence System

A full-stack grievance management platform that enables students to submit campus-related grievances and allows administrators to manage, track, and resolve them efficiently through a real-time dashboard. The system is built using Firebase Firestore for live persistence and includes a scalable backend architecture designed for AI-powered complaint analysis.

**Built by:** *Varshini (IIT Bhilai)*
**Event:** *TechSprint Hackathon – GDG On Campus, IIT Bhilai*

---

## Table of Contents

* [Hackathon Submission](#hackathon-submission)
* [Overview](#overview)
* [Problem Statement](#problem-statement)
* [Solution](#solution)
* [Key Features](#key-features)
* [System Architecture](#system-architecture)
* [Application Flow](#application-flow)
* [Project Structure](#project-structure)
* [Screenshots](#screenshots)
* [Setup Instructions](#setup-instructions)
* [Firebase Setup](#firebase-setup)
* [Security Notes](#security-notes)
* [Future Enhancements](#future-enhancements)
* [Credits](#credits)
* [License](#license)

---

## Hackathon Submission

### Theme

Open Innovation : Identify and solve real-world problems relevant to their campus or local community by building innovative solutions using Google technologies.

### One-line Pitch

A real-time campus grievance platform that turns raw student complaints into structured, trackable cases with an admin dashboard for fast resolution and analytics.

### What it solves

In most campuses, grievances are:

* unstructured (scattered messages/forms)
* difficult to prioritize
* not transparent to students
* hard to track and audit

This system introduces a structured pipeline where every complaint becomes a trackable case with optional AI-powered insights.

### Why this is impactful

* Improves response time by centralizing all grievances in one dashboard
* Creates accountability using status transitions (Submitted → Viewed → Cleared)
* Enables administration to quickly filter and prioritize urgent grievances
* Provides scalable foundation for AI-driven summarization and categorization

### Technical novelty

* Firestore-backed real-time grievance management
* Built-in admin workflow tooling (filters, analytics, status updates)
* Attachment support designed to work even on free Firebase plans (Base64)
* Architecture ready for plugging Gemini AI + notifications without redesign

### Scalability

* Firestore enables high read/write throughput for real-time dashboards
* Server layer is modular: can add AI analysis + email notifications
* Can extend to multiple institutions with role-based admin access

### Demo Flow

1. Student submits a grievance with optional attachments
2. Firestore stores grievance + metadata
3. Admin dashboard displays all grievances instantly
4. Admin filters/searches grievances and updates status
5. System updates Firestore and reflects changes in dashboard

---

## Overview

Campus grievance handling is often slow, unstructured, and lacks transparency. This project provides a structured grievance pipeline with:

* simple student submission
* real-time persistence (Firestore)
* admin dashboard with filters and analytics
* clear status tracking (Submitted → Viewed → Cleared)
* attachment support

The platform is designed to scale into a complete “Grievance Intelligence System” with optional AI summarization/categorization and automated notifications.

---

## Problem Statement

Students face issues such as hostel maintenance, mess concerns, health center availability, safety incidents, and infrastructure breakdowns. Traditional complaint collection lacks:

* proper categorization
* priority detection
* tracking and auditability
* streamlined admin workflow

---

## Solution

This system introduces:

1. A minimal student submission portal
2. Centralized storage using Firebase Firestore
3. An admin dashboard with management controls and insights
4. A backend design ready for AI analysis and notifications

---

## Key Features

### Student Side

* Submit grievance with name/email/complaint
* Optional attachment upload

  * **Current mode:** attachments stored as Base64 in Firestore (works on free Firebase plan)
* Successful submission confirmation with grievance ID

### Admin Side

* Secure admin login (PIN-based demo login system)
* Dashboard listing all grievances
* Search by Firestore Document ID
* Filters:

  * Category
  * Urgency
  * Status
  * Date range
* Status transitions:

  * submitted → viewed → cleared
* Delete grievance
* Statistics cards:

  * total grievances
  * high urgency count
  * viewed count
  * cleared count
* Attachment preview support (image/video/file)

---

## System Architecture

###

```text
+-------------------+              +---------------------+
|     Student UI     |              |      Admin UI        |
| (Submit Grievance) |              | (Dashboard & Actions)|
+----------+---------+              +----------+-----------+
           |                                  |
           | Firestore Write/Read             | Firestore Read/Update/Delete
           v                                  v
+---------------------------------------------------------+
|                   Firebase Firestore                    |
|  grievances collection                                  |
|  - complaint details                                    |
|  - attachments (base64/url)                             |
|  - status + timestamps                                  |
+------------------------------+--------------------------+
                               |
                               | optional (future)
                               v
+---------------------------------------------------------+
|                    Node.js Backend                      |
|   - AI Analysis service (Gemini)                        |
|   - Email/notification service                          |
|   - Admin integrations                                  |
+---------------------------------------------------------+
```

---

## Application Flow

### Student Flow

```text
Student → Submit Form
        → (Optional) Add Attachments
        → Validate Inputs
        → Store Grievance in Firestore
        → Show Success + Grievance ID
```

### Admin Flow

```text
Admin → Login
      → Fetch grievances from Firestore
      → Apply search/filters
      → View grievance + attachments
      → Update status (viewed/cleared) OR delete
```

---

## Project Structure

```text
root/
│── client/
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── config/
│   │   └── firebase.ts        # Firebase initialization + CRUD helpers
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── SubmitGrievance.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── NotFound.tsx
│   ├── utils/
│   │   └── admin-auth.ts      # admin login utilities
│   ├── App.tsx
│   └── global.css
│
│── server/
│   ├── routes/                # API endpoints (extensible)
│   ├── utils/                 # helper utilities
│   └── index.ts               # Express server entry
│
│── shared/
│   └── api.ts                 # shared API types/contracts
│
│── README.md
│── package.json
│── pnpm-lock.yaml
│── vite.config.ts
│── netlify.toml
```

---

## Screenshots

### Home Page

**Hero Section**

**How It Works**

**Powered By**

---

### Student Portal

**Submission Form**

---

### Admin Portal

**Admin Login**

**Admin Dashboard**

**Expanded Grievance View**

---

## Setup Instructions

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2) Install dependencies

```bash
pnpm install
```

### 3) Run frontend

```bash
pnpm dev
```

### 4) Run server (optional)

```bash
pnpm --filter server dev
```

---

## Firebase Setup

### Create Firebase Project

1. Go to Firebase Console
2. Create a new project
3. Enable Firestore Database

### Add Firebase environment variables

Create a `.env` file in root:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

###


---

## Security Notes

* The current project is optimized for hackathon/demo use.
* Admin login is demo-based and should be replaced with:
  * Firebase Auth (email/password) or
  * Google OAuth + role-based access.

---

## Future Enhancements

* Gemini AI integration for:

  * category detection
  * urgency estimation
  * sentiment analysis
  * summary generation
* Email notifications:

  * grievance submitted
  * admin viewed
  * grievance cleared
* File storage upgrade:

  * Firebase Storage (requires billing plan)
* Role-based admin access
* Student grievance tracking page using grievance ID

---

## Credits

Developed by **Varshini (IIT Bhilai)** as part of **TechSprint Hackathon** hosted by **GDG On Campus, IIT Bhilai**.

---

## License

This project is intended for educational and hackathon purposes. You may reuse and modify it with attribution.
