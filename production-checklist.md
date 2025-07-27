# Shopify App Production Deployment Checklist

## ✅ COMPLETED
- [x] Fixed metaobjects access issue
- [x] Updated scopes: read_metaobjects, write_metaobjects, write_products
- [x] Deployed new version to Partner Dashboard
- [x] Updated environment variables

## 🚀 IMMEDIATE NEXT STEPS

### 1. Database Migration (5 minutes)
```bash
# Option A: Railway (Recommended)
railway login
railway init
railway add --database
railway variables set DATABASE_URL

# Option B: Supabase
# Create project at supabase.com
# Copy DATABASE_URL
```

### 2. Production Hosting (10 minutes)
```bash
# Railway deployment
railway up
railway domain
```

### 3. Update Shopify Configuration (2 minutes)
```bash
# Update shopify.app.toml with production URL
# Run: shopify app config push
```

### 4. App Store Listing Requirements
- [ ] App icon (1024x1024 PNG)
- [ ] App screenshots (5-7 images, 1600x1200)
- [ ] App description (SEO optimized)
- [ ] Privacy policy URL
- [ ] Support email
- [ ] Pricing plans configured

### 5. Security & Performance
- [ ] SSL certificate (automatic with Railway)
- [ ] Rate limiting implemented
- [ ] Error handling for production
- [ ] Database connection pooling
- [ ] CDN for static assets

### 6. Testing Checklist
- [ ] Install on test store
- [ ] Test all features
- [ ] Test billing flow
- [ ] Test uninstall/reinstall
- [ ] Test on different themes

### 7. App Store Submission
- [ ] Complete app listing
- [ ] Submit for review
- [ ] Respond to review feedback
- [ ] Publish to App Store

## 🎯 EXACT COMMANDS TO RUN NOW

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Deploy to production
railway login
railway init
railway up

# 3. Get production URL
railway domain

# 4. Update Shopify config
# Copy the Railway URL and update shopify.app.toml
# Then run: shopify app config push
```

## 📋 REQUIRED FILES FOR APP STORE
1. `app/assets/icon.png` (1024x1024)
2. Screenshots in `docs/screenshots/`
3. Privacy policy at `/privacy-policy`
4. Terms of service at `/terms`
5. Support page at `/support`
