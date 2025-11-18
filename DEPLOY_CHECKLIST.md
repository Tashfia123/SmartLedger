# Pre-Deployment Checklist

Use this checklist before deploying to ensure everything is ready.

## ✅ Code Preparation

- [x] All code is committed to Git
- [x] `.gitignore` is properly configured
- [x] `vercel.json` is configured correctly
- [x] `package.json` has all dependencies
- [x] `client/package.json` has all dependencies
- [x] API routes are properly set up
- [x] Frontend build configuration is correct

## ✅ Configuration Files

- [x] `vercel.json` - Vercel deployment config
- [x] `api/index.js` - Serverless function wrapper
- [x] `client/vite.config.js` - Vite build config
- [x] `client/src/utils/api.js` - API base URL config
- [x] `.gitignore` - Excludes node_modules, .env, etc.

## ✅ Environment Variables Needed

Before deploying, ensure you have:

- [ ] `DATABASE_URL` - Your Neon PostgreSQL connection string
  ```
  postgresql://neondb_owner:npg_DzCr2QIYVW5F@ep-bold-dawn-a1wkuci1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  ```

## ✅ Database Setup

- [ ] Database schema is ready (`sql/schema.sql`)
- [ ] Seed data is ready (optional, `sql/seed.sql`)
- [ ] Database connection string is valid

## ✅ Testing Locally

Before deploying, test locally:

- [ ] Backend starts: `npm start`
- [ ] Frontend starts: `cd client && npm run dev`
- [ ] API endpoints work: `http://localhost:5000/api/health`
- [ ] Database connection works: `http://localhost:5000/api/health/db`
- [ ] Frontend loads: `http://localhost:5173`
- [ ] Can create transactions
- [ ] Can view summary
- [ ] Graphs display correctly

## ✅ Deployment Steps

1. [ ] Push code to GitHub
2. [ ] Go to vercel.com and import project
3. [ ] Set build command: `cd client && npm install && npm run build`
4. [ ] Set output directory: `client/dist`
5. [ ] Add environment variable: `DATABASE_URL`
6. [ ] Deploy
7. [ ] Initialize database (run `sql/schema.sql` in Neon SQL Editor)
8. [ ] Test deployed app

## ✅ Post-Deployment Verification

After deployment, verify:

- [ ] Health check: `https://your-app.vercel.app/api/health`
- [ ] DB health: `https://your-app.vercel.app/api/health/db`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Can create transactions
- [ ] Can view summary
- [ ] All navigation works
- [ ] Graphs display data

## Common Issues & Solutions

### Build Fails
- Check Node.js version (should be 20.x)
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

### API Returns 404
- Verify `vercel.json` rewrites are correct
- Check `api/index.js` exists
- Ensure routes are properly exported

### Database Connection Fails
- Verify `DATABASE_URL` is set in Vercel
- Check connection string format
- Ensure database is active in Neon

### Frontend Shows Blank Page
- Check browser console for errors
- Verify `client/dist` is built
- Check API base URL configuration

---

**Ready to deploy?** Follow the steps in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

