# Quick Deployment Guide - SmartLedger

## 🚀 Fast Track Deployment (5 Minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to **[vercel.com](https://vercel.com)** → Sign in with GitHub
2. Click **"Add New Project"**
3. **Import** your `account` repository
4. **Configure:**
   - Framework: `Other`
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install && cd client && npm install`
5. **Add Environment Variable:**
   - Name: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_DzCr2QIYVW5F@ep-bold-dawn-a1wkuci1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
6. Click **"Deploy"**

### Step 3: Initialize Database

1. Go to your **Neon Dashboard**
2. Open **SQL Editor**
3. Copy and run the contents of `sql/schema.sql`
4. (Optional) Run `sql/seed.sql` for sample data

### Step 4: Test Your App

Visit: `https://your-project.vercel.app`

✅ Test endpoints:
- `https://your-project.vercel.app/api/health`
- `https://your-project.vercel.app/api/health/db`
- `https://your-project.vercel.app/api/transactions`

---

## 📋 What's Configured

✅ **Vercel Configuration** (`vercel.json`)
- Serverless function for API routes
- Static file serving for React app
- Proper rewrites for SPA routing

✅ **Build Process**
- Frontend builds to `client/dist`
- Backend wrapped for serverless
- All dependencies included

✅ **Environment Setup**
- API base URL auto-detects production
- CORS configured
- Database connection ready

---

## 🔧 Troubleshooting

**Build fails?**
- Check Vercel logs
- Verify Node.js version (20.x)

**API returns 404?**
- Check `vercel.json` rewrites
- Verify `api/index.js` exists

**Database error?**
- Verify `DATABASE_URL` is set
- Check Neon database is active

**Frontend blank?**
- Check browser console
- Verify build completed successfully

---

## 📞 Need Help?

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed steps
2. Review [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) for pre-deployment checks
3. Check Vercel deployment logs

---

**Your app will be live at:** `https://your-project.vercel.app` 🎉

