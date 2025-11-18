# Complete Deployment Guide for SmartLedger

This guide will help you deploy your SmartLedger application to Vercel perfectly.

## Prerequisites

1. **GitHub Account** (or GitLab/Bitbucket)
2. **Vercel Account** (free tier works)
3. **Neon PostgreSQL Database** (already set up)
4. **Your DATABASE_URL** from Neon

## Step 1: Prepare Your Code

### 1.1 Ensure All Files Are Committed

```bash
git status
git add .
git commit -m "Ready for deployment"
```

### 1.2 Push to GitHub

```bash
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New Project"**

3. **Import Your Repository**
   - Select your `account` repository
   - Click "Import"

4. **Configure Project Settings:**
   - **Framework Preset**: `Other` or `Vite`
   - **Root Directory**: `.` (leave as root)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install && cd client && npm install`

5. **Add Environment Variables:**
   Click "Environment Variables" and add:
   
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon PostgreSQL connection string
     ```
     postgresql://neondb_owner:npg_DzCr2QIYVW5F@ep-bold-dawn-a1wkuci1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
     ```
   - **Environment**: Production, Preview, Development (select all)
   
   - **Name**: `PORT`
   - **Value**: `5000` (optional, Vercel handles this)
   - **Environment**: Production, Preview, Development

6. **Click "Deploy"**

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variables:**
   ```bash
   vercel env add DATABASE_URL
   # Paste your DATABASE_URL when prompted
   
   vercel env add PORT
   # Enter: 5000
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## Step 3: Initialize Database

After deployment, you need to initialize your database schema:

### Option A: Using Neon SQL Editor (Easiest)

1. Go to your Neon dashboard
2. Open SQL Editor
3. Run the contents of `sql/schema.sql`
4. Run the contents of `sql/seed.sql` (optional, for initial data)

### Option B: Using Vercel CLI

```bash
# Set DATABASE_URL locally
export DATABASE_URL="your-neon-connection-string"

# Run init script
node scripts/initDb.js
```

## Step 4: Verify Deployment

1. **Check API Health:**
   Visit: `https://your-project.vercel.app/api/health`
   Should return: `{"status":"ok"}`

2. **Check Database Connection:**
   Visit: `https://your-project.vercel.app/api/health/db`
   Should return: `{"status":"ok"}`

3. **Test Frontend:**
   Visit: `https://your-project.vercel.app`
   Should show your SmartLedger dashboard

4. **Test API Endpoints:**
   - `https://your-project.vercel.app/api/transactions`
   - `https://your-project.vercel.app/api/categories`
   - `https://your-project.vercel.app/api/subcategories?category=Revenue`

## Step 5: Post-Deployment Checklist

- [ ] Environment variables are set in Vercel
- [ ] Database schema is initialized
- [ ] API health check returns OK
- [ ] Database health check returns OK
- [ ] Frontend loads correctly
- [ ] Can create transactions
- [ ] Can view summary page
- [ ] Graphs display correctly
- [ ] All navigation links work

## Troubleshooting

### Issue: API Routes Return 404

**Solution**: Check that `vercel.json` has correct rewrites:
```json
{
  "source": "/api/(.*)",
  "destination": "/api/index.js"
}
```

### Issue: Frontend Shows Blank Page

**Solution**: 
1. Check build logs in Vercel dashboard
2. Verify `outputDirectory` is `client/dist`
3. Check browser console for errors

### Issue: Database Connection Fails

**Solution**:
1. Verify `DATABASE_URL` is set correctly in Vercel
2. Check that Neon database is active
3. Ensure connection string includes `?sslmode=require`

### Issue: Build Fails

**Solution**:
1. Check build logs for specific errors
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (should be 20.x)

### Issue: CORS Errors

**Solution**: Already handled in `index.js` with `cors()` middleware

## Project Structure

```
.
├── api/
│   └── index.js              # Vercel serverless function wrapper
├── client/
│   ├── dist/                  # Built React app (generated)
│   ├── src/                   # React source code
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   └── utils/             # Utilities (API config)
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
├── routes/                    # Express API routes
│   ├── transactions.js       # Transaction CRUD
│   └── categories.js         # Categories & subcategories
├── scripts/                   # Utility scripts
│   └── initDb.js             # Database initialization
├── sql/                      # SQL files
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Seed data
├── index.js                  # Express app (main entry)
├── db.js                     # Database connection
├── vercel.json               # Vercel configuration
└── package.json              # Backend dependencies
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `PORT` | Server port (optional on Vercel) | `5000` |

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Run builds automatically

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Test API endpoints directly
4. Verify environment variables are set correctly

---

**Your app should now be live at:** `https://your-project.vercel.app`

