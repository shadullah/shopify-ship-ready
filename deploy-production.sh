#!/bin/bash

# Shopify App Production Deployment Script
# Run this script to deploy your app to production

echo "🚀 Starting production deployment..."

# 1. Install Railway CLI if not already installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# 2. Login to Railway
echo "🔐 Logging into Railway..."
railway login

# 3. Initialize Railway project
echo "🏗️  Initializing Railway project..."
railway init

# 4. Add PostgreSQL database
echo "🗄️  Adding PostgreSQL database..."
railway add --database

# 5. Deploy application
echo "📡 Deploying application..."
railway up

# 6. Get production URL
PRODUCTION_URL=$(railway domain)
echo "✅ Production URL: $PRODUCTION_URL"

# 7. Update environment variables
echo "⚙️  Setting environment variables..."
railway variables set SHOPIFY_API_KEY=9e4921eeaae75ca4ac370907b1cedbae
railway variables set SHOPIFY_API_SECRET=112e08621fe49de85fa2de6f55849a8f
railway variables set SCOPES="write_products,read_metaobjects,write_metaobjects,read_orders,write_orders,read_customers,write_customers"
railway variables set TESTMODE=false

# 8. Update Shopify app configuration
echo "📝 Updating Shopify configuration..."
echo "Please update shopify.app.toml with:"
echo "application_url = \"$PRODUCTION_URL\""
echo "Then run: shopify app config push"

# 9. Run database migrations
echo "🔄 Running database migrations..."
railway run npx prisma migrate deploy

echo "✅ Production deployment complete!"
echo "🌐 Your app is now live at: $PRODUCTION_URL"
echo "📋 Next steps:"
echo "   1. Update shopify.app.toml with production URL"
echo "   2. Run: shopify app config push"
echo "   3. Test installation on a store"
echo "   4. Submit to Shopify App Store"
