# IlerAI - Healthcare Management System

This is a full-stack healthcare management system with separate frontend and backend services.

## Project Structure

```
ilerai/
├── frontend/          # Next.js frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/           # Express.js backend API
│   ├── routes/
│   ├── utils/
│   ├── data/
│   ├── package.json
│   └── server.js
└── start-dev.bat     # Start both servers
```

## Getting Started

### Quick Start
Run both servers with one command:
```bash
start-dev.bat
```

### Manual Start

1. **Start Backend Server:**
```bash
cd backend
npm install
npm run dev
```

2. **Start Frontend Server:**
```bash
cd frontend
npm install
npm run dev
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Demo Credentials

**Staff Login:**
- Email: any@email.com
- Password: any

**Patient Login:**
- Phone: +234-801-234-567
- PIN: 1234

## Features

- ✅ Dual authentication (Staff/Patient)
- ✅ Patient management with real-time updates
- ✅ Risk level assessment
- ✅ Responsive design
- ✅ Backend API integration
- ✅ SQLite database with sample data

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, Redux Toolkit
- **Backend**: Express.js, SQLite, Node.js, Socket.IO
- **Database**: SQLite with sample PHC and patient data