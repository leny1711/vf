# Deployment Guide

Guide for deploying the Marketplace application to production.

## 🌐 Architecture Overview

The application consists of three parts:
- **Backend API** (Node.js/Express) - Can be deployed to Heroku, AWS, DigitalOcean, etc.
- **Frontend Web** (React/Vite) - Can be deployed to Vercel, Netlify, AWS S3, etc.
- **Mobile App** (React Native/Expo) - Can be built and published to App Store/Play Store

## 🔧 Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
brew install heroku/brew/heroku  # Mac
# or download from https://devcenter.heroku.com/articles/heroku-cli
```

2. **Create Heroku App**
```bash
cd backend
heroku create marketplace-backend
```

3. **Add PostgreSQL**
```bash
heroku addons:create heroku-postgresql:mini
```

4. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET="your-secure-secret"
heroku config:set STRIPE_SECRET_KEY="sk_live_..."
heroku config:set GOOGLE_MAPS_API_KEY="your-key"
heroku config:set NODE_ENV="production"
```

5. **Deploy**
```bash
git push heroku main
heroku run npx prisma migrate deploy
```

### Option 2: DigitalOcean App Platform

1. Connect your GitHub repository
2. Select the `backend` directory
3. Set build command: `npm install && npm run build`
4. Set run command: `npm start`
5. Add PostgreSQL database
6. Configure environment variables

### Option 3: AWS EC2

1. Launch EC2 instance (Ubuntu 20.04)
2. Install Node.js 18
3. Install PostgreSQL or use RDS
4. Clone repository
5. Setup PM2 for process management
```bash
npm install -g pm2
pm2 start dist/server.js --name marketplace-api
pm2 startup
pm2 save
```

## 🌍 Frontend Web Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Set Environment Variables** in Vercel Dashboard:
- `VITE_API_URL`: Your backend URL
- `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps key
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

### Option 2: Netlify

1. Build the project
```bash
cd frontend
npm run build
```

2. Deploy `dist` folder to Netlify
3. Set environment variables in Netlify Dashboard

### Option 3: AWS S3 + CloudFront

1. Build the project
```bash
cd frontend
npm run build
```

2. Create S3 bucket
3. Upload `dist` folder contents
4. Configure S3 for static website hosting
5. Create CloudFront distribution
6. Update DNS records

## 📱 Mobile App Deployment

### Build with Expo Application Services (EAS)

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
cd mobile
eas login
```

3. **Configure EAS**
```bash
eas build:configure
```

4. **Build for Android**
```bash
eas build --platform android
```

5. **Build for iOS**
```bash
eas build --platform ios
```

6. **Submit to Stores**
```bash
eas submit --platform android
eas submit --platform ios
```

### Manual Build

**Android:**
```bash
cd mobile
expo build:android
```

**iOS (Mac only):**
```bash
cd mobile
expo build:ios
```

## 🔒 Production Checklist

### Security

- [ ] Change all default secrets and passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS/SSL certificates
- [ ] Restrict API keys by domain/IP
- [ ] Enable CORS only for your domains
- [ ] Add rate limiting
- [ ] Enable security headers
- [ ] Use environment variables (never hardcode secrets)

### Database

- [ ] Use managed PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
- [ ] Setup automated backups
- [ ] Enable SSL connections
- [ ] Configure connection pooling
- [ ] Monitor database performance

### API

- [ ] Setup logging (Winston, Loggly, etc.)
- [ ] Configure error tracking (Sentry, Rollbar)
- [ ] Add health check endpoint
- [ ] Setup monitoring (New Relic, Datadog)
- [ ] Enable request logging
- [ ] Configure CORS properly

### Frontend

- [ ] Minimize bundle size
- [ ] Enable gzip compression
- [ ] Setup CDN
- [ ] Configure caching headers
- [ ] Add analytics (Google Analytics, Mixpanel)
- [ ] Setup error boundaries
- [ ] Enable service worker for PWA (optional)

### Mobile

- [ ] Update app version numbers
- [ ] Prepare app store assets (icons, screenshots)
- [ ] Write app descriptions
- [ ] Test on real devices
- [ ] Configure deep linking
- [ ] Setup push notifications (if needed)

## 📊 Monitoring

### Backend Monitoring

**Recommended Tools:**
- **Sentry**: Error tracking
- **New Relic**: Performance monitoring
- **LogRocket**: Session replay
- **Datadog**: Infrastructure monitoring

### Frontend Monitoring

**Recommended Tools:**
- **Google Analytics**: User analytics
- **Hotjar**: Heatmaps and recordings
- **Sentry**: Error tracking
- **Vercel Analytics**: Performance metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          working-directory: ./frontend
```

## 🚀 Scaling

### Backend Scaling

- **Horizontal Scaling**: Add more server instances
- **Load Balancer**: Distribute traffic (AWS ELB, Nginx)
- **Caching**: Redis for session/data caching
- **Database**: Read replicas for better performance
- **Queue System**: Bull/Redis for background jobs

### Database Optimization

- Add indexes for frequently queried columns
- Use database views for complex queries
- Implement connection pooling
- Consider read replicas

## 💰 Cost Estimation

### Minimal Setup ($50-100/month)

- **Backend**: Heroku Hobby ($7/month) or DigitalOcean Droplet ($5/month)
- **Database**: Heroku PostgreSQL ($9/month) or DigitalOcean Managed DB ($15/month)
- **Frontend**: Vercel (Free for hobby projects)
- **Storage**: AWS S3 (~$5/month)
- **Monitoring**: Free tiers of Sentry, etc.

### Production Setup ($200-500/month)

- **Backend**: Multiple instances on AWS/DigitalOcean
- **Database**: Managed PostgreSQL with backups
- **CDN**: CloudFlare or AWS CloudFront
- **Monitoring**: Paid tiers
- **Email**: SendGrid/Mailgun

## 📝 Environment Variables Reference

### Backend
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
STRIPE_SECRET_KEY=sk_live_...
GOOGLE_MAPS_API_KEY=...
NODE_ENV=production
PORT=3000
```

### Frontend
```
VITE_API_URL=https://api.your domain.com
VITE_GOOGLE_MAPS_API_KEY=...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Mobile
```
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## 🆘 Rollback Strategy

### Backend
```bash
# Heroku
heroku releases
heroku rollback v123

# Manual
git revert <commit-hash>
git push
```

### Frontend
```bash
# Vercel
vercel rollback
```

## 📚 Additional Resources

- [Heroku Node.js Deployment](https://devcenter.heroku.com/articles/deploying-nodejs)
- [Vercel Deployment](https://vercel.com/docs)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [AWS Deployment Best Practices](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
