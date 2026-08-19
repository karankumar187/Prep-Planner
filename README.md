# Placement Prep Tracker

A full-stack web application for placement preparation planning and tracking.

## Features

- **Global Schedules** — Create and share preparation schedules for different companies
- **Personal Progress** — Follow any schedule and track your own completion independently
- **Date-wise Planning** — Calendar view with day-by-day task management
- **Analytics** — Category performance, daily progress, study time trends, streaks
- **JWT Authentication** — Secure user accounts

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Recharts + Lucide React
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken + bcryptjs)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
npm run install-all
```

### Development

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/placement-tracker
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
├── server/          # Express backend
│   ├── config/      # Database connection
│   ├── middleware/   # Auth middleware
│   ├── models/      # Mongoose schemas
│   └── routes/      # API routes
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React Context providers
│   │   └── utils/       # API helpers, constants
└── package.json     # Root scripts
```
