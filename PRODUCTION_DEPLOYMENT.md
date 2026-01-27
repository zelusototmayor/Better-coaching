# 🚀 Production Deployment - Quick Start

This guide will get Better Coaching deployed to production in **under 10 minutes**.

## Automated Deployment (Recommended)

We've created an automated deployment script for Railway. Just run:

```bash
./deploy-railway.sh
```

The script will:
1. ✅ Check Railway CLI installation
2. ✅ Login to Railway (if needed)
3. ✅ Create new project
4. ✅ Generate secure secrets
5. ✅ Configure environment variables
6. ✅ Add PostgreSQL database
7. ✅ Deploy backend
8. ✅ Run database migrations
9. ✅ Seed demo data
10. ✅ Provide your production URL

**That's it!** The script handles everything automatically.

---

## Manual Deployment (Railway)

If you prefer to deploy manually:

### Step 1: Login to Railway

```bash
railway login
```

This opens your browser for authentication.

### Step 2: Create Project

```bash
railway init
```

Enter project name when prompted (e.g., "bettercoaching").

### Step 3: Add PostgreSQL Database

```bash
railway add --database postgres
```

Railway automatically sets `DATABASE_URL` environment variable.

### Step 4: Set Environment Variables

```bash
# Generate secrets
JWT_SECRET=$(openssl rand -hex 64)
JWT_REFRESH_SECRET=$(openssl rand -hex 64)
ENCRYPTION_KEY=$(openssl rand -hex 32)

# Set variables
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
railway variables set ENCRYPTION_KEY="$ENCRYPTION_KEY"
railway variables set ANTHROPIC_API_KEY="sk-ant-api03-..."
railway variables set OPENAI_API_KEY="sk-proj-..."
railway variables set CORS_ORIGIN="*"
```

### Step 5: Deploy Backend

```bash
cd backend
railway up
```

Railway builds using the Dockerfile and deploys automatically.

### Step 6: Run Database Migrations

```bash
railway run npx prisma migrate deploy
railway run npm run db:seed
```

### Step 7: Get Your URL

```bash
railway domain
```

Example output: `bettercoaching-production.up.railway.app`

### Step 8: Update Mobile App

```bash
cd ../mobile
echo "EXPO_PUBLIC_API_URL=https://bettercoaching-production.up.railway.app/api" > .env
```

### Step 9: Test Deployment

```bash
curl https://bettercoaching-production.up.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-01-27T...",
  "database": "connected"
}
```

---

## What Gets Deployed?

### Backend API (Node.js/Express)
- **URL**: `https://your-project.up.railway.app`
- **Port**: 3000
- **Database**: PostgreSQL with pgvector extension
- **Features**:
  - JWT authentication
  - AI chat with Claude, GPT, Gemini
  - Rate limiting
  - CORS protection
  - Health check endpoint

### Database (PostgreSQL)
- **Version**: 16
- **Extension**: pgvector (for embeddings)
- **Tables**: users, agents, conversations, messages, ratings, etc.
- **Seed Data**: 5 demo AI coaches
- **Demo Account**:
  - Email: `demo@bettercoaching.app`
  - Password: `demo1234`

---

## Cost Estimate

### Railway Pricing

**Hobby Plan** (Recommended for production):
- **Cost**: $5/month
- **Includes**:
  - 500 execution hours
  - 512 MB RAM
  - 1 GB storage
  - Custom domains
  - SSL certificates

**PostgreSQL Database**:
- **Cost**: $5/month
- **Includes**:
  - 1 GB RAM
  - 1 GB storage
  - Automated backups
  - High availability

**Total**: ~$10/month + AI API usage

### AI API Costs

Estimated for 1,000 conversations/month:

- **Claude Sonnet 4.5**: ~$50-100/month
- **GPT-5 Mini**: ~$30-60/month
- **Total AI costs**: ~$80-160/month

**Grand Total**: ~$90-170/month

---

## Monitoring & Maintenance

### View Logs

```bash
railway logs
```

Live tail logs:
```bash
railway logs -f
```

### Open Dashboard

```bash
railway open
```

### Check Deployment Status

```bash
railway status
```

### Redeploy (after code changes)

```bash
git push origin main
cd backend
railway up
```

### Database Backup

Railway automatically backs up your database daily. To create manual backup:

```bash
railway run pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

---

## Troubleshooting

### Deployment Failed

```bash
# Check logs
railway logs

# Rebuild locally first
cd backend
npm install
npm run build

# Try deploying again
railway up
```

### Database Connection Error

```bash
# Check if database is ready
railway variables | grep DATABASE_URL

# Test connection
railway run npx prisma db push
```

### Health Check Failing

```bash
# Test locally
curl https://your-project.up.railway.app/health

# Check if port is correct (should be 3000)
railway variables | grep PORT
```

### Out of Memory

Upgrade to Railway Pro plan ($20/month) for more resources.

---

## Custom Domain Setup

### Step 1: Add Domain in Railway

```bash
railway open
```

Go to Settings → Domains → Add Domain

### Step 2: Update DNS

Add CNAME record:
```
Type: CNAME
Name: api (or @)
Value: your-project.up.railway.app
```

### Step 3: Update CORS

```bash
railway variables set CORS_ORIGIN="https://yourdomain.com"
```

### Step 4: Update Mobile App

```bash
cd mobile
echo "EXPO_PUBLIC_API_URL=https://api.yourdomain.com/api" > .env
```

---

## Security Checklist

- [x] Generated secure JWT secrets (64+ characters)
- [x] Generated secure encryption key (32+ characters)
- [x] Using production API keys (not development keys)
- [x] Database uses SSL connection
- [x] CORS configured for specific domains (not "*")
- [x] Rate limiting enabled
- [x] Helmet security headers enabled
- [x] Health check endpoint working
- [x] Environment variables not committed to git
- [ ] Custom domain with HTTPS
- [ ] API key spending limits configured
- [ ] Monitoring alerts set up
- [ ] Database backups verified

---

## Next Steps After Deployment

### 1. Test Core Features

```bash
# Health check
curl https://your-url.railway.app/health

# Login
curl -X POST https://your-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@bettercoaching.app", "password": "demo1234"}'
```

### 2. Update Mobile App

```bash
cd mobile
echo "EXPO_PUBLIC_API_URL=https://your-url.railway.app/api" > .env
npx expo start
```

Test on your phone - the app should now connect to production backend.

### 3. Deploy Web App (Optional)

```bash
# Deploy to Vercel (free)
cd web
npx vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-url.railway.app/api
```

### 4. Set Up Monitoring

**Railway Alerts**:
1. Go to Railway dashboard
2. Settings → Alerts
3. Enable: Deployment Failed, High Memory, Database Down

**External Monitoring** (Optional):
- UptimeRobot: Free uptime monitoring
- Sentry: Error tracking
- LogRocket: Session replay

### 5. Configure RevenueCat (Subscriptions)

1. Create account at [revenuecat.com](https://www.revenuecat.com/)
2. Set up iOS/Android products
3. Get webhook secret
4. Add to Railway:
   ```bash
   railway variables set REVENUECAT_WEBHOOK_SECRET="your-secret"
   ```

---

## Support & Help

### Railway Documentation
- Website: https://railway.app
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### Better Coaching Issues
- GitHub: https://github.com/zelusototmayor/Better-coaching/issues

### Quick Commands Reference

```bash
# Deploy
./deploy-railway.sh

# Logs
railway logs -f

# Dashboard
railway open

# Variables
railway variables

# Restart
railway restart

# Destroy (⚠️ deletes everything)
railway delete
```

---

**Last Updated**: January 2026
**Deployment Time**: ~5-10 minutes
**Difficulty**: ⭐⭐ (Easy)
