# NotWrapper Deployment Guide

This guide will walk you through deploying the complete NotWrapper MVP stack.

## Prerequisites

- Node.js 18+
- Python 3.9+
- Supabase account
- Vercel account (for web)
- Render account (for backend & analyzer)

## Step 1: Set Up Supabase

### 1.1 Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and set project name
4. Wait for project to be ready

### 1.2 Run Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL query
4. Verify tables are created in Table Editor

### 1.3 Set Up Storage Buckets

1. Go to Storage in your Supabase dashboard
2. Create the following buckets (all public):
   - `videos`
   - `badges`
   - `scan-results`
   - `avatars`

3. Set up storage policies for each bucket:

```sql
-- Videos bucket policy
CREATE POLICY "Public videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Repeat for other buckets
```

### 1.4 Seed Data (Optional)

1. Go to SQL Editor
2. Run `supabase/seed.sql`
3. Note: You'll need to create test users through Supabase Auth first

### 1.5 Get Credentials

Copy these values from Settings > API:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` (under Service Role Key)

## Step 2: Deploy Python Analyzer (Render)

### 2.1 Prepare Repository

Push your code to GitHub if not already done.

### 2.2 Deploy to Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: notwrapper-analyzer
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: apps/analyzer
   - **Environment**: Docker
   - **Plan**: Starter ($7/month)
5. Click "Create Web Service"
6. Wait for deployment to complete
7. Copy the service URL (e.g., `https://notwrapper-analyzer.onrender.com`)

### 2.3 Test Analyzer

```bash
curl -X POST https://notwrapper-analyzer.onrender.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## Step 3: Deploy Node.js Backend (Render)

### 3.1 Create Web Service

1. In Render dashboard, click "New +" → "Web Service"
2. Connect same GitHub repository
3. Configure:
   - **Name**: notwrapper-backend
   - **Region**: Same as analyzer
   - **Branch**: main
   - **Root Directory**: apps/backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Starter ($7/month)

### 3.2 Set Environment Variables

Add these in Environment Variables section:

```
NODE_ENV=production
PORT=3001
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_KEY=<your-service-key>
ANALYZER_URL=<your-analyzer-url>
```

### 3.3 Deploy

1. Click "Create Web Service"
2. Wait for deployment
3. Copy backend URL (e.g., `https://notwrapper-backend.onrender.com`)

### 3.4 Test Backend

```bash
curl https://notwrapper-backend.onrender.com/health
```

Should return: `{"status":"ok","service":"notwrapper-backend"}`

## Step 4: Deploy Web App (Vercel)

### 4.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 4.2 Deploy from CLI

```bash
cd apps/web
vercel
```

Or deploy from Vercel dashboard:

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: apps/web
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### 4.3 Set Environment Variables

In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_BACKEND_URL=<your-backend-url>
```

### 4.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your app at `<project-name>.vercel.app`

### 4.5 Set Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your domain
3. Configure DNS records as instructed

## Step 5: Configure CORS

Update backend to allow your web app domain:

In `apps/backend/src/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-domain.vercel.app',
    'https://notwrapper.app' // Your custom domain
  ]
}))
```

Redeploy backend after changes.

## Step 6: Monitoring & Maintenance

### Set Up Monitoring

1. **Render**: Built-in metrics in dashboard
2. **Vercel**: Built-in analytics
3. **Supabase**: Usage stats in dashboard

### Set Up Alerts

1. In Render, go to service → Settings → Alerts
2. Enable:
   - Service down alerts
   - High CPU usage
   - High memory usage

### Backup Database

Supabase has automatic backups. To manually backup:

1. Go to Database → Backups
2. Click "Create backup"

### Monitor Costs

- Render Starter: ~$14/month (2 services)
- Vercel Pro: ~$20/month (optional, free tier might suffice)
- Supabase Free: $0 (upgrade to Pro at $25/month if needed)
- **Total estimated**: $14-60/month depending on usage

## Troubleshooting

### Backend Can't Connect to Analyzer

- Check ANALYZER_URL environment variable
- Ensure both services are in same region for better performance
- Check Render service logs

### Web App Can't Connect to Backend

- Verify NEXT_PUBLIC_BACKEND_URL is set
- Check CORS configuration
- Inspect browser console for errors

### Database Connection Issues

- Verify Supabase credentials
- Check if service key has proper permissions
- Review RLS policies

### Storage Upload Failures

- Confirm storage buckets are created
- Verify storage policies allow uploads
- Check file size limits

## Scaling Considerations

### When to Upgrade

**Render**: Upgrade from Starter when:
- Response times > 1s consistently
- CPU usage > 80%
- Memory usage > 90%

**Supabase**: Upgrade from Free when:
- Database size > 500MB
- Bandwidth > 2GB/month
- Need custom domain for API

**Vercel**: Upgrade from Hobby when:
- Team collaboration needed
- Custom domains > 1
- Advanced analytics required

### Optimization Tips

1. **Enable CDN caching** for static assets
2. **Add Redis** for session management (optional)
3. **Implement rate limiting** in backend
4. **Set up database indexes** for common queries
5. **Use Vercel Edge Functions** for better performance

## Security Checklist

- [ ] Environment variables set correctly (never commit secrets)
- [ ] CORS configured properly
- [ ] Supabase RLS policies enabled
- [ ] API rate limiting implemented
- [ ] HTTPS enforced on all services
- [ ] Secrets rotated regularly
- [ ] Error messages don't expose sensitive data
- [ ] File upload validation in place

## Support

If you encounter issues:

1. Check service logs in Render/Vercel dashboards
2. Review Supabase logs in dashboard
3. Test each service individually
4. Verify environment variables
5. Check network connectivity between services

---

**Congratulations!** Your NotWrapper MVP is now live. 🎉

Test thoroughly before announcing to users.

