# ngrok Setup Guide for NotWrapper

## What is ngrok?
ngrok creates a secure tunnel to your localhost, giving you a public URL to access your local development server. Perfect for:
- Testing authentication callbacks
- Sharing your dev environment with others
- Testing webhooks

## Prerequisites

1. **Install ngrok**: https://ngrok.com/download
2. **Sign up** for a free ngrok account
3. **Authenticate** ngrok with your auth token

## Quick Setup

### Step 1: Install ngrok

**Windows (PowerShell):**
```powershell
# Using Chocolatey
choco install ngrok

# Or download from https://ngrok.com/download
```

**Mac/Linux:**
```bash
# Using Homebrew
brew install ngrok/ngrok/ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Authenticate ngrok

Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

## NotWrapper Architecture

Your app has 3 services:
1. **Frontend (Next.js)** - Port 3000
2. **Backend (Express)** - Port 3003
3. **Analyzer (Python/Flask)** - Port 5000

## Configuration

### Option A: Expose Backend Only (Recommended)

This is the simplest approach - expose just the backend API:

#### 1. Start Backend

```bash
cd apps/backend
npm run dev
# Backend running on http://localhost:3003
```

#### 2. Start ngrok for Backend

```bash
ngrok http 3003
```

You'll see output like:
```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        United States (us)
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3003
```

Copy the `https://abc123.ngrok-free.app` URL.

#### 3. Update Frontend Environment

Create/update `apps/web/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=https://abc123.ngrok-free.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. Start Frontend

```bash
cd apps/web
npm run dev
# Frontend running on http://localhost:3000
```

Now your frontend talks to the backend via ngrok!

---

### Option B: Expose Both Frontend and Backend

If you need external access to the frontend too:

#### 1. Start Backend with ngrok

```bash
# Terminal 1: Start backend
cd apps/backend
npm run dev

# Terminal 2: Expose backend
ngrok http 3003
# Copy the URL, e.g., https://backend-abc.ngrok-free.app
```

#### 2. Update Backend .env

Create/update `apps/backend/.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
ANALYZER_URL=http://localhost:5000
PORT=3003
```

#### 3. Update Frontend .env.local

```env
NEXT_PUBLIC_BACKEND_URL=https://backend-abc.ngrok-free.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. Start Frontend with ngrok

```bash
# Terminal 3: Start frontend
cd apps/web
npm run dev

# Terminal 4: Expose frontend
ngrok http 3000
# Copy the URL, e.g., https://frontend-xyz.ngrok-free.app
```

Now you can access your app at `https://frontend-xyz.ngrok-free.app`

---

### Option C: Using ngrok Configuration File

For a more permanent setup, create `ngrok.yml`:

**Location**: `~/.ngrok2/ngrok.yml` or `%USERPROFILE%\.ngrok2\ngrok.yml` (Windows)

```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN_HERE

tunnels:
  backend:
    proto: http
    addr: 3003
    hostname: your-custom-domain.ngrok-free.app  # Only with paid plan
  
  frontend:
    proto: http
    addr: 3000
    hostname: your-other-domain.ngrok-free.app  # Only with paid plan
```

Start both tunnels:
```bash
ngrok start --all
```

---

## Troubleshooting

### Issue: "Visit Site" Button on ngrok

ngrok's free plan shows an interstitial page. Click "Visit Site" to continue.

**Solution**: Upgrade to ngrok paid plan, or handle in your app by checking for the ngrok warning page.

### Issue: CORS Errors

If you get CORS errors, make sure your backend has CORS configured:

**Update `apps/backend/src/server.js`:**

```javascript
const cors = require('cors');

// Add ngrok domain to CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://*.ngrok-free.app',
    'https://*.ngrok.io',
    // Add your specific ngrok URL
    'https://abc123.ngrok-free.app'
  ],
  credentials: true
}));
```

### Issue: Supabase Redirect URIs

If using OAuth or email confirmation, add ngrok URLs to Supabase:

1. Go to **Supabase Dashboard** → Authentication → URL Configuration
2. Add to **Redirect URLs**:
   ```
   https://your-frontend-ngrok-url.ngrok-free.app/**
   ```

### Issue: ngrok URL Changes on Restart

Free ngrok URLs change each time. Solutions:
- **Paid Plan**: Get a static domain
- **Script**: Create a script to auto-update .env files
- **Development**: Just update manually each time

### Issue: Webhook Timeouts

ngrok free has a timeout. For long-running operations:
- Upgrade to ngrok paid
- Use a cloud deployment (Render, Railway, Vercel)

---

## Scripts for Quick Setup

### Create `scripts/start-with-ngrok.sh`:

```bash
#!/bin/bash

echo "Starting NotWrapper with ngrok..."

# Start backend
cd apps/backend
npm run dev &
BACKEND_PID=$!

sleep 3

# Start ngrok for backend
ngrok http 3003 --log=stdout > ngrok.log &
NGROK_PID=$!

sleep 3

# Extract ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -n 1)

echo "Backend exposed at: $NGROK_URL"
echo "Update your .env.local with: NEXT_PUBLIC_BACKEND_URL=$NGROK_URL"

# Keep script running
wait
```

### Create `scripts/start-with-ngrok.bat` (Windows):

```batch
@echo off
echo Starting NotWrapper with ngrok...

REM Start backend
start cmd /k "cd apps\backend && npm run dev"

timeout /t 3

REM Start ngrok
start cmd /k "ngrok http 3003"

echo Check ngrok terminal for the public URL
echo Update apps\web\.env.local with NEXT_PUBLIC_BACKEND_URL=https://your-ngrok-url
pause
```

---

## Best Practices

1. **Restart ngrok**: If you restart ngrok, update your .env files with the new URL
2. **Security**: Don't share ngrok URLs publicly - they expose your local dev environment
3. **Environment Check**: Add checks in your code to detect if running via ngrok
4. **Logging**: Enable ngrok logging to debug issues
5. **Rate Limits**: Free ngrok has rate limits - upgrade if needed

---

## Alternative: Use Supabase Edge Functions

Instead of ngrok, consider deploying your backend to Supabase Edge Functions for a stable URL during development.

---

## Quick Reference Commands

```bash
# Start ngrok
ngrok http 3003

# Start with custom subdomain (paid only)
ngrok http 3003 --subdomain=notwrapper-dev

# Start with config file
ngrok start backend

# Check running tunnels
curl http://localhost:4040/api/tunnels

# View web interface
# Open http://localhost:4040 in browser
```

---

## Testing Checklist

- [ ] Backend accessible via ngrok URL
- [ ] Frontend can reach backend through ngrok
- [ ] Scans complete successfully
- [ ] Authentication works (Supabase redirects configured)
- [ ] No CORS errors in console

---

## Support

- ngrok Documentation: https://ngrok.com/docs
- ngrok Dashboard: https://dashboard.ngrok.com
- Check ngrok web interface: http://localhost:4040

Happy developing! 🚀


