# Step-by-Step Guide: Running NotWrapper

This guide will walk you through running the NotWrapper application from scratch.

## Prerequisites Check

Before starting, make sure you have:

- ✅ **Node.js 18+** - [Download here](https://nodejs.org/)
- ✅ **Python 3.9+** - [Download here](https://www.python.org/downloads/)
- ✅ **Git** - [Download here](https://git-scm.com/downloads)
- ✅ **A Supabase account** - [Sign up free](https://supabase.com)

Verify installations:
```bash
node --version    # Should be v18 or higher
python --version  # Should be 3.9 or higher
git --version     # Any recent version
```

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/austynchalifour/NotWrapper.git
cd NotWrapper
```

---

## Step 2: Install Dependencies

### Option A: Use Setup Script (Recommended)

**Windows:**
```bash
scripts\setup.bat
```

**macOS/Linux:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Option B: Manual Installation

**1. Install root dependencies:**
```bash
npm install
```

**2. Install web app dependencies:**
```bash
cd apps/web
npm install
cd ../..
```

**3. Install backend dependencies:**
```bash
cd apps/backend
npm install
cd ../..
```

**4. Install Python analyzer dependencies:**
```bash
cd apps/analyzer

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

cd ../..
```

---

## Step 3: Set Up Supabase

### 3.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `notwrapper` (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize

### 3.2 Run Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open `supabase/schema.sql` from your project folder
4. Copy **all** the contents
5. Paste into the SQL Editor
6. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
7. You should see "Success. No rows returned"

### 3.3 Create Storage Buckets

1. In Supabase dashboard, click **"Storage"** in the left sidebar
2. Click **"Create bucket"**
3. Create these 4 buckets (one at a time):

   **Bucket 1: `videos`**
   - Name: `videos`
   - Public bucket: ✅ **Checked**
   - Click **"Create bucket"**

   **Bucket 2: `badges`**
   - Name: `badges`
   - Public bucket: ✅ **Checked**
   - Click **"Create bucket"**

   **Bucket 3: `scan-results`**
   - Name: `scan-results`
   - Public bucket: ✅ **Checked**
   - Click **"Create bucket"**

   **Bucket 4: `avatars`**
   - Name: `avatars`
   - Public bucket: ✅ **Checked**
   - Click **"Create bucket"**

### 3.4 Get API Credentials

1. In Supabase dashboard, click **"Settings"** (gear icon) → **"API"**
2. You'll need these values (keep this page open):
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys" → "anon public")
   - **service_role** key (under "Project API keys" → "service_role") - ⚠️ Keep this secret!

---

## Step 4: Configure Environment Variables

### 4.1 Web App Configuration

Create/edit `apps/web/.env.local`:

```bash
# Windows (PowerShell):
New-Item -Path "apps\web\.env.local" -ItemType File -Force
notepad apps\web\.env.local

# macOS/Linux:
touch apps/web/.env.local
nano apps/web/.env.local
```

Add these lines (replace with your actual values from Step 3.4):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_BACKEND_URL=http://localhost:3003
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_BACKEND_URL=http://localhost:3003
```

### 4.2 Backend Configuration

Create/edit `apps/backend/.env`:

```bash
# Windows (PowerShell):
New-Item -Path "apps\backend\.env" -ItemType File -Force
notepad apps\backend\.env

# macOS/Linux:
touch apps/backend/.env
nano apps/backend/.env
```

Add these lines:
```env
PORT=3003
NODE_ENV=development
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
ANALYZER_URL=http://localhost:5000
```

**Example:**
```env
PORT=3003
NODE_ENV=development
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANALYZER_URL=http://localhost:5000
```

---

## Step 5: Start Development Servers

You need **3 separate terminal windows/tabs**. Keep all 3 running!

### Terminal 1: Backend API Server

```bash
cd apps/backend
npm run dev
```

**Wait for this message:**
```
🚀 NotWrapper Backend running on port 3003
```

**Keep this terminal open!** ✅

---

### Terminal 2: Python Analyzer Service

```bash
cd apps/analyzer

# Activate virtual environment first!
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# Start the analyzer
python app.py
```

**Wait for this message:**
```
Running on http://127.0.0.1:5000
```

**Keep this terminal open!** ✅

---

### Terminal 3: Web Application

```bash
cd apps/web
npm run dev
```

**Wait for this message:**
```
Ready on http://localhost:3000
```

**Keep this terminal open!** ✅

---

## Step 6: Access the Application

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the NotWrapper homepage! 🎉

---

## Step 7: Test the Application

### Test 1: Web Interface

1. On the homepage, click **"Scan a Tool"** (or navigate to the scan page)
2. Enter a URL: `https://example.com`
3. Click **"Run Scan"** or **"Scan Tool"**
4. Wait for results (may take 10-30 seconds)
5. You should see a verdict and detailed breakdown

### Test 2: API Endpoint (Optional)

Open a new terminal and run:

```bash
curl -X POST http://localhost:3003/api/scan \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://example.com\"}"
```

You should get a JSON response with scan results.

---

## Troubleshooting

### ❌ Backend won't start

**Problem:** Port 3003 is already in use

**Solution:**
```bash
# Windows - Find and kill process on port 3003:
netstat -ano | findstr :3003
taskkill /PID <process_id> /F

# macOS/Linux - Find and kill process:
lsof -ti:3003 | xargs kill -9
```

Or change the port in `apps/backend/.env`:
```env
PORT=3004
```
And update `apps/web/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3004
```

---

### ❌ Analyzer won't start

**Problem:** "No module named 'flask'" or similar

**Solution:**
```bash
cd apps/analyzer

# Make sure virtual environment is activated
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Problem:** Python version too old

**Solution:**
```bash
python --version  # Check version
# If less than 3.9, install Python 3.9+ from python.org
```

---

### ❌ Web app shows errors

**Problem:** "Failed to fetch" or connection errors

**Solutions:**
1. **Check backend is running** - Terminal 1 should show it's running
2. **Check environment variables** - Make sure `NEXT_PUBLIC_BACKEND_URL` is correct
3. **Check browser console** - Press F12, look for errors
4. **Restart web app** - Stop Terminal 3 (Ctrl+C) and run `npm run dev` again

---

### ❌ Supabase connection errors

**Problem:** "Invalid API key" or connection refused

**Solutions:**
1. **Double-check credentials** in `.env` files
2. **Verify project is active** in Supabase dashboard
3. **Check you copied the full keys** (they're very long!)
4. **Make sure no extra spaces** in `.env` files

---

### ❌ Port 5000 already in use (Analyzer)

**Solution:**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

Or change port in `apps/analyzer/app.py` and update `apps/backend/.env`:
```env
ANALYZER_URL=http://localhost:5001
```

---

## Quick Reference

### All Services Running?

- ✅ **Backend**: http://localhost:3003
- ✅ **Analyzer**: http://localhost:5000
- ✅ **Web App**: http://localhost:3000

### Stop All Services

Press `Ctrl+C` in each terminal window to stop the servers.

### Restart Everything

1. Stop all terminals (Ctrl+C)
2. Start Terminal 1 (Backend)
3. Start Terminal 2 (Analyzer)
4. Start Terminal 3 (Web)

---

## Next Steps

- 📖 Read `DEVELOPMENT.md` for detailed development guide
- 🚀 See `DEPLOYMENT.md` to deploy to production
- 🐛 Check `CONTRIBUTING.md` to contribute
- 💡 Explore the codebase in `apps/` directory

---

## Need Help?

- Check the troubleshooting section above
- Review error messages in terminal windows
- Check browser console (F12) for frontend errors
- Verify all environment variables are set correctly
- Make sure all 3 services are running

---

**You're all set! Happy wrapper hunting! 🔍**

