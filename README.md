# IncentiveBox

A coupon management application with email integration.

## Project Structure

```
incentivebox/
├── frontend/             # Frontend React application
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── utils/            # Utility functions
├── backend/              # Backend Express server
│   ├── index.js          # Main server file
│   └── test-email.js     # Test script for email endpoint
└── public/               # Static assets
```

## Frontend (React)

The frontend is built with React and uses Supabase for authentication and data storage.

### Setup

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

### Features

- User authentication (sign up, login, logout)
- Coupon browsing and filtering
- Favorites management
- Email-to-coupon integration

## Backend (Express)

The backend server handles inbound emails from Postmark and processes them into coupons.

### Setup

1. Start the server:
```
npm run server
```

2. For development with auto-reload:
```
npm run server:dev
```

### Testing

To test the email processing functionality:
```
npm run test:email
```

## Deployment

### Frontend
Deploy the frontend to your preferred hosting service (Vercel, Netlify, etc.):
```
npm run build
```

### Backend
Deploy the backend to a server that can handle Express applications (Heroku, AWS, etc.).

## Environment Variables

Create a `.env` file in the root directory with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create a `.env` file in the server directory with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
```