# Deploy to Render.com

## Quick Deploy

You can deploy this app to Render.com using either the **Render Blueprint** or **Manual Setup**.

### Option 1: Render Blueprint (Recommended)

1. **Create a new Web Service** on Render.com
2. **Connect your GitHub repository**
3. **Use the Blueprint file**: The `render.yaml` file is already configured
4. **Set Environment Variables**:
   - `SHOPIFY_API_KEY`: Your Shopify API key
   - `SHOPIFY_API_SECRET`: Your Shopify API secret
   - `SHOPIFY_APP_URL`: Your Render app URL (e.g., `https://your-app.onrender.com`)
   - `APP_URL`: Same as SHOPIFY_APP_URL

### Option 2: Manual Setup

1. **Create a new Web Service** on Render.com
2. **Environment**: Node
3. **Build Command**: `npm ci && npm run build`
4. **Start Command**: `npm run setup && npm run start`
5. **Node Version**: 20.x
6. **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=10000` (Render will set this automatically)
   - `DATABASE_URL` (from Render PostgreSQL database)
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `SHOPIFY_APP_URL`
   - `APP_URL`
   - `SCOPES=write_products,read_metaobjects,write_metaobjects,read_orders,write_orders,read_customers,write_customers`

## Database Setup

1. **Create a PostgreSQL database** on Render
2. **Copy the connection string** to `DATABASE_URL` environment variable
3. **The app will automatically run migrations** on startup

## Environment Variables Checklist

- [ ] `SHOPIFY_API_KEY`
- [ ] `SHOPIFY_API_SECRET`
- [ ] `SHOPIFY_APP_URL` (your Render URL)
- [ ] `APP_URL` (same as above)
- [ ] `DATABASE_URL` (from Render PostgreSQL)
- [ ] `SCOPES` (pre-configured in render.yaml)

## Post-Deployment

1. **Update your Shopify App** with the new Render URL
2. **Test the webhook endpoints**
3. **Verify database migrations** run successfully

## Troubleshooting

- **Build fails**: Ensure all dependencies are in the `dependencies` section, not `devDependencies`
- **Database connection issues**: Check `DATABASE_URL` format
- **Port issues**: Render uses port 10000 by default
- **Memory issues**: Upgrade to a larger plan if needed
