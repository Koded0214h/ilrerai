This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

### Option 1: Start Both Servers (Recommended)
Run the development script to start both frontend and backend:

```bash
start-dev.bat
```

### Option 2: Start Manually

First, start the backend server:
```bash
cd backend
npm run dev
```

Then, start the frontend server:
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend API

The backend server runs on [http://localhost:5000](http://localhost:5000) and provides:

- **Patient Management**: `/api/patient/list`, `/api/patient/login`, `/api/patient/register`
- **PHC Management**: `/api/phc/*`
- **USSD Integration**: `/api/ussd/*`

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
- **Backend**: Express.js, SQLite, Node.js
- **Database**: SQLite with sample PHC and patient data

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.