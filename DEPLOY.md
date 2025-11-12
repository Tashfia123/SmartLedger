# Deploy to Vercel

## Prerequisites

1. Install Vercel CLI (if deploying via CLI):
   ```bash
   npm i -g vercel
   ```

2. Have your Neon PostgreSQL `DATABASE_URL` ready

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your repository**

5. **Configure Project Settings:**
   - Framework Preset: **Other**
   - Root Directory: `.` (root)
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install && cd client && npm install`

6. **Add Environment Variables:**
   - `DATABASE_URL` = Your Neon PostgreSQL connection string
   - `PORT` = (optional, Vercel sets this automatically)
   - `VITE_API_URL` = (leave empty for production, or set to your Vercel domain)

7. **Click "Deploy"**

### Option 2: Deploy via CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
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
   vercel env add PORT
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

- `DATABASE_URL`: Your Neon PostgreSQL connection string
  ```
  postgresql://user:pass@host/db?sslmode=require
  ```

- `PORT`: (Optional, Vercel handles this automatically)

## Post-Deployment

1. **Initialize Database:**
   After first deployment, run the DB init script:
   ```bash
   # Via Vercel CLI or SSH into your deployment
   node scripts/initDb.js
   ```

   Or use Neon's SQL Editor to run `sql/schema.sql` and `sql/seed.sql`

2. **Test Your API:**
   - Visit: `https://your-project.vercel.app/api/health`
   - Visit: `https://your-project.vercel.app/api/health/db`

3. **Update Frontend API URL (if needed):**
   If your frontend needs the API URL, set `VITE_API_URL` in Vercel environment variables to your Vercel domain.

## Troubleshooting

- **API routes not working**: Check that `api/index.js` exists and `vercel.json` routes are correct
- **Frontend not loading**: Verify `client/dist` is built and `outputDirectory` in `vercel.json` matches
- **Database connection errors**: Verify `DATABASE_URL` is set correctly in Vercel environment variables
- **Build fails**: Check build logs in Vercel dashboard for specific errors

## Project Structure

```
.
├── api/
│   └── index.js          # Vercel serverless function
├── client/
│   ├── dist/            # Built React app (generated)
│   └── src/             # React source
├── routes/              # Express API routes
├── sql/                 # Database schema & seed
├── index.js             # Express app (exported for Vercel)
├── vercel.json          # Vercel configuration
└── package.json         # Backend dependencies
```

