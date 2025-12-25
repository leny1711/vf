# Installation Guide - Marketplace Application

Complete guide for setting up and running the Marketplace application.

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js** v18.x or higher ([Download](https://nodejs.org/))
- **npm** v9.x or higher (comes with Node.js)
- **Docker** (optional but recommended for PostgreSQL) ([Download](https://www.docker.com/))
- **Stripe Account** ([Sign up](https://stripe.com/))
- **Google Cloud Account** for Maps API ([Sign up](https://cloud.google.com/))

## 🚀 Quick Start (5 minutes)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd vf
```

### Step 2: Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This starts a PostgreSQL 15 database with:
- **Username**: marketplace
- **Password**: marketplace123
- **Database**: marketplace_db
- **Port**: 5432

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and update these values:
# - JWT_SECRET: Change to a secure random string
# - STRIPE_SECRET_KEY: Your Stripe secret key (sk_test_...)
# - GOOGLE_MAPS_API_KEY: Your Google Maps API key

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

Backend will run on **http://localhost:3000**

### Step 4: Setup Frontend Web

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and update:
# - VITE_GOOGLE_MAPS_API_KEY: Your Google Maps API key
# - VITE_STRIPE_PUBLISHABLE_KEY: Your Stripe publishable key (pk_test_...)

# Start frontend dev server
npm run dev
```

Frontend will run on **http://localhost:5173**

### Step 5: Setup Mobile App (Optional)

Open a new terminal:

```bash
cd mobile

# Install dependencies
npm install

# Install Expo CLI globally if not already installed
npm install -g expo-cli

# Copy environment file
cp .env.example .env

# Edit .env and update:
# - EXPO_PUBLIC_API_URL: http://YOUR_LOCAL_IP:3000/api
# Replace YOUR_LOCAL_IP with your computer's local IP (e.g., 192.168.1.100)
# On Mac/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
# On Windows: ipconfig and look for IPv4 Address

# Start Expo
npm start
```

Scan the QR code with Expo Go app on your phone.

## 🔑 Getting API Keys

### Stripe

1. Go to [https://dashboard.stripe.com/](https://dashboard.stripe.com/)
2. Create an account or login
3. Navigate to **Developers** → **API keys**
4. Copy your **Secret key** (sk_test_...) for backend
5. Copy your **Publishable key** (pk_test_...) for frontend

### Google Maps

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API** and **Geocoding API**
4. Navigate to **APIs & Services** → **Credentials**
5. Create **API Key**
6. Copy the API key

## 🧪 Testing the Application

### Create Test Accounts

1. Open **http://localhost:5173** in your browser
2. Click "Get Started" or "Register"
3. Create a **Client** account
4. Create another **Provider** account (use different email)

### Test Workflow

1. **As Client**: Login → Create a mission → Enter details → Submit
2. **As Provider**: Login → See nearby missions → Accept a mission
3. **As Provider**: Start the mission → Complete it
4. **As Client**: Pay for the mission using Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

## 🐛 Troubleshooting

### Backend Issues

**Error: "Cannot connect to database"**
- Check if Docker container is running: `docker ps`
- Verify DATABASE_URL in `.env` file
- Restart Docker: `docker-compose down && docker-compose up -d`

**Error: "Prisma Client not generated"**
```bash
cd backend
npx prisma generate
```

**Error: "Migration failed"**
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Frontend Issues

**Error: "Network Error" when calling API**
- Make sure backend is running on http://localhost:3000
- Check VITE_API_URL in frontend `.env` file
- Open browser console to see the actual error

**Google Maps not loading**
- Verify VITE_GOOGLE_MAPS_API_KEY in `.env`
- Check if Maps JavaScript API is enabled in Google Cloud Console
- Make sure API key has no restrictions or allows your localhost

### Mobile Issues

**Cannot connect to backend**
- Use your local IP address, not localhost
- Make sure phone and computer are on same WiFi network
- Check if backend is accessible: `curl http://YOUR_LOCAL_IP:3000/api`

**Expo app not starting**
```bash
npm start -- --clear
```

## 📚 Additional Commands

### Backend

```bash
# View database with Prisma Studio
npx prisma studio

# Build for production
npm run build

# Start production server
npm start

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Frontend Web

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Mobile

```bash
# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Run on web
npm run web
```

## 🔒 Security Notes

- Never commit `.env` files to git
- Change all default passwords in production
- Use environment-specific API keys
- Enable API key restrictions in production
- Use HTTPS in production

## 📖 Next Steps

- Read the [API Documentation](./API_DOCUMENTATION.md)
- Check the [Project Summary](./PROJECT_SUMMARY.md)
- Review the [Quick Start Guide](./QUICKSTART.md)

## ❓ Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the logs in terminal
3. Check browser console for errors
4. Verify all environment variables are set correctly
