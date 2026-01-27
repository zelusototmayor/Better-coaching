#!/bin/bash

# ===========================================
# Better Coaching - Railway Deployment Script
# ===========================================

set -e  # Exit on error

echo "🚀 Better Coaching - Railway Deployment"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found${NC}"
    echo "Install with: npm install -g @railway/cli"
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI found${NC}"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Railway${NC}"
    echo "Please login to Railway:"
    echo ""
    echo -e "${BLUE}railway login${NC}"
    echo ""
    read -p "Press enter after logging in..."
fi

# Verify login
if ! railway whoami &> /dev/null; then
    echo -e "${RED}❌ Still not logged in. Please run 'railway login' first.${NC}"
    exit 1
fi

USER=$(railway whoami)
echo -e "${GREEN}✅ Logged in as: $USER${NC}"
echo ""

# Check if project exists
if ! railway status &> /dev/null; then
    echo -e "${YELLOW}📦 No Railway project found. Creating new project...${NC}"

    read -p "Enter project name (default: bettercoaching): " PROJECT_NAME
    PROJECT_NAME=${PROJECT_NAME:-bettercoaching}

    railway init --name "$PROJECT_NAME"
    echo -e "${GREEN}✅ Project created${NC}"
else
    echo -e "${GREEN}✅ Railway project found${NC}"
fi

echo ""
railway status
echo ""

# Generate production secrets
echo -e "${BLUE}🔐 Generating production secrets...${NC}"

JWT_SECRET=$(openssl rand -hex 64)
JWT_REFRESH_SECRET=$(openssl rand -hex 64)
ENCRYPTION_KEY=$(openssl rand -hex 32)

echo -e "${GREEN}✅ Secrets generated${NC}"
echo ""

# Set environment variables
echo -e "${BLUE}⚙️  Setting environment variables...${NC}"

railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
railway variables set ENCRYPTION_KEY="$ENCRYPTION_KEY"

# Prompt for API keys
echo ""
echo -e "${YELLOW}📝 Please provide your API keys:${NC}"
echo ""

read -p "Anthropic API Key (required): " ANTHROPIC_KEY
if [ ! -z "$ANTHROPIC_KEY" ]; then
    railway variables set ANTHROPIC_API_KEY="$ANTHROPIC_KEY"
fi

read -p "OpenAI API Key (optional, press enter to skip): " OPENAI_KEY
if [ ! -z "$OPENAI_KEY" ]; then
    railway variables set OPENAI_API_KEY="$OPENAI_KEY"
fi

read -p "Google API Key (optional, press enter to skip): " GOOGLE_KEY
if [ ! -z "$GOOGLE_KEY" ]; then
    railway variables set GOOGLE_API_KEY="$GOOGLE_KEY"
fi

read -p "Production domain (e.g., https://bettercoaching.app): " DOMAIN
if [ ! -z "$DOMAIN" ]; then
    railway variables set CORS_ORIGIN="$DOMAIN"
else
    railway variables set CORS_ORIGIN="*"
fi

echo -e "${GREEN}✅ Environment variables set${NC}"
echo ""

# Add PostgreSQL database
echo -e "${BLUE}🗄️  Checking for database...${NC}"

if railway variables | grep -q "DATABASE_URL"; then
    echo -e "${GREEN}✅ Database already exists${NC}"
else
    echo -e "${YELLOW}Adding PostgreSQL database...${NC}"
    railway add --database postgres
    echo -e "${GREEN}✅ Database added${NC}"
    echo ""
    echo -e "${YELLOW}⏳ Waiting 10 seconds for database to initialize...${NC}"
    sleep 10
fi

echo ""

# Deploy backend
echo -e "${BLUE}🚀 Deploying backend...${NC}"
cd backend

# Build first to catch errors
echo "Building locally first..."
npm install
npm run build

echo ""
echo "Deploying to Railway..."
railway up

echo -e "${GREEN}✅ Backend deployed${NC}"
echo ""

# Run database migrations
echo -e "${BLUE}🗄️  Running database migrations...${NC}"
railway run npx prisma migrate deploy

echo ""
echo -e "${BLUE}🌱 Seeding database...${NC}"
railway run npm run db:seed

echo -e "${GREEN}✅ Database setup complete${NC}"
echo ""

# Get the domain
echo -e "${BLUE}🌐 Getting deployment URL...${NC}"
BACKEND_URL=$(railway domain)

echo ""
echo "========================================"
echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
echo "========================================"
echo ""
echo -e "${GREEN}Backend URL:${NC} $BACKEND_URL"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo ""
echo "1. Update mobile app:"
echo -e "   ${BLUE}cd ../mobile${NC}"
echo -e "   ${BLUE}echo \"EXPO_PUBLIC_API_URL=$BACKEND_URL/api\" > .env${NC}"
echo ""
echo "2. Test the deployment:"
echo -e "   ${BLUE}curl $BACKEND_URL/health${NC}"
echo ""
echo "3. Test login with demo account:"
echo "   Email: demo@bettercoaching.app"
echo "   Password: demo1234"
echo ""
echo "4. View logs:"
echo -e "   ${BLUE}railway logs${NC}"
echo ""
echo "5. Open Railway dashboard:"
echo -e "   ${BLUE}railway open${NC}"
echo ""
echo "========================================"
echo ""

# Save deployment info
cd ..
cat > .railway-deployment.txt <<EOF
Deployment Date: $(date)
Backend URL: $BACKEND_URL
Railway User: $USER

Environment Variables:
- NODE_ENV: production
- PORT: 3000
- JWT_SECRET: (generated)
- JWT_REFRESH_SECRET: (generated)
- ENCRYPTION_KEY: (generated)
- CORS_ORIGIN: ${DOMAIN:-*}
- ANTHROPIC_API_KEY: (set)
- DATABASE_URL: (auto-set by Railway)

Database:
- PostgreSQL with pgvector extension
- Migrations: applied
- Seed data: loaded

Next Steps:
1. Update mobile/.env with: EXPO_PUBLIC_API_URL=$BACKEND_URL/api
2. Test deployment: curl $BACKEND_URL/health
3. Monitor logs: railway logs
4. Dashboard: railway open
EOF

echo -e "${GREEN}✅ Deployment info saved to .railway-deployment.txt${NC}"
echo ""
