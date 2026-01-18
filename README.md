# Campus AI Grievance Intelligence System

A full-stack grievance management platform that enables students to submit campus-related concerns and helps administrators track, prioritize, and resolve them through a real-time dashboard. Built using Firebase Firestore for live persistence and designed with an extensible architecture for future AI-powered grievance analysis.

**Author:** Varshini (IIT Bhilai)  
**Developed for:** TechSprint Hackathon – GDG On Campus, IIT Bhilai  

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Application Flow](#application-flow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Firebase Configuration](#firebase-configuration)
- [Deployment (Firebase Hosting)](#deployment-firebase-hosting)
- [Future Enhancements](#future-enhancements)
- [Credits](#credits)
- [License](#license)

---

## Overview

Grievance handling in campuses often suffers from unstructured reporting, weak prioritization, and lack of transparency. This project builds a structured grievance pipeline that transforms raw complaints into trackable cases with admin actions and analytics.

The platform supports:
- Student grievance submission (with proof attachments)
- Firestore-backed real-time case management
- Admin workflow controls: filtering, status updates, and deletions
- Architecture readiness for Gemini-based intelligence modules

---

## Key Features

### Student Portal
- Submit grievance with name, email, and description
- Optional attachments upload (proof images)
- Unique grievance ID generated after submission
- Attachments stored as **Base64 in Firestore** (works on free Firebase plan)

### Admin Dashboard
- Admin authentication (demo PIN-based login)
- Real-time grievance listing from Firestore
- Search directly using grievance document ID
- Filters:
  - Category
  - Urgency
  - Status
  - Date range
- Status pipeline:
  **Submitted → Viewed → Cleared**
- Grievance deletion and resolution updates
- Dashboard stats cards:
  - Total grievances
  - High urgency
  - Viewed
  - Cleared
- Attachment preview inside dashboard

---

## System Architecture

```text
+----------------------+              +-------------------------+
|      Student UI      |              |        Admin UI         |
|  (Submit Grievance)  |              | (Dashboard & Controls)  |
+----------+-----------+              +-----------+-------------+
           |                                      |
           | Firestore Write                      | Firestore Read/Update/Delete
           v                                      v
+---------------------------------------------------------------+
|                     Firebase Firestore                         |
| grievances collection                                          |
| - grievance metadata (category, urgency, sentiment, summary)   |
| - status workflow (submitted/viewed/cleared)                   |
| - attachments (base64/url)                                     |
+------------------------------+--------------------------------+
                               |
                               | (future enhancement)
                               v
+---------------------------------------------------------------+
|                      Backend (Node.js)                         |
| - Gemini AI-based grievance intelligence                        |
| - Notification & admin integrations                              |
+---------------------------------------------------------------+
````

---

## Application Flow

### Student Flow

```text
Student → Fill grievance form
        → Attach proof (optional)
        → Validation
        → Store grievance in Firestore
        → Success screen + grievance ID
```

### Admin Flow

```text
Admin → Login
      → Firestore grievance fetch
      → Search / Filter
      → View grievance + attachments
      → Mark Viewed / Mark Cleared / Delete
```

---

## Tech Stack

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Lucide Icons

### Backend

* Node.js + Express (extensible)

### Cloud & Database

* Firebase Firestore (real-time DB)
* Firebase Hosting (deployment)

### AI Readiness

* Gemini AI integration pipeline designed (future module for summary, sentiment, urgency, category)

---

## Project Structure

```text
root/
│── client/
│   ├── components/ui/       # shadcn/ui components
│   ├── config/firebase.ts   # Firebase config + CRUD helpers
│   ├── pages/               # Index, Submit, Admin Login, Admin Dashboard
│   ├── utils/admin-auth.ts  # admin login utilities
│   └── App.tsx
│
│── server/
│   ├── routes/              # extendable API endpoints
│   └── index.ts             # backend entry
│
│── shared/api.ts            # shared API types/contracts
│── firebase.json
│── vite.config.ts
│── package.json
│── README.md
```

---

## Setup Instructions

### 1) Clone repository

```bash
git clone https://github.com/VarshiniGunti/campus-ai-grievance-system.git
cd campus-ai-grievance-system
```

### 2) Install dependencies

```bash
pnpm install
```

### 3) Run locally

```bash
pnpm dev
```

---

## Firebase Configuration

1. Create a Firebase Project
2. Enable **Firestore Database**
3. Add environment variables in `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

---

## Deployment (Firebase Hosting)

### 1) Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2) Login

```bash
firebase login
```

### 3) Build

```bash
pnpm build
```

### 4) Deploy

```bash
firebase deploy
```

---

## Future Enhancements

* Gemini AI powered insights:

  * category prediction
  * urgency detection
  * sentiment analysis
  * complaint summarization
* Email / notification workflows
* Upgrade attachments to Firebase Storage (billing plan)
* Student grievance tracking page (using grievance ID)

---

## Credits

Built by **Varshini (IIT Bhilai)** for **TechSprint Hackathon**, organized by **GDG On Campus, IIT Bhilai**.

---

## License

This project is released for educational/hackathon use. Reuse is permitted with attribution.
