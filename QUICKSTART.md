# NotWrapper - Quick Start Guide

Get the MVP running in 15 minutes.

## Prerequisites

- Node.js 18+
- Python 3.9+
- A Supabase account (free)

## 1. Clone & Install (5 minutes)

```bash
# Clone repository
git clone <repo-url>
cd notwrapper-mvp

# Run setup script
# macOS/Linux:
chmod +x scripts/setup.sh
./scripts/setup.sh

# Windows:
scripts\setup.bat
```

## 2. Set Up Supabase (5 minutes)

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name it "notwrapper"
4. Wait for it to initialize

### Run Schema
1. Open SQL Editor in Supabase
2. Copy contents of `supabase/schema.sql`
3. Paste and run

### Create Storage Buckets
1. Go to Storage
2. Click "Create bucket"
3. Create these buckets (all public):
   - `videos`
   - `badges`
   - `scan-results`
   - `avatars`

### Get Credentials
1. Go to Settings → API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

## 3. Configure Environment (2 minutes)

### Web App
Edit `apps/web/.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_BACKEND_URL=http://localhost:3003
```

### Backend API
Edit `apps/backend/.env`:
```bash
PORT=3003
NODE_ENV=development
SUPABASE_URL=<your-project-url>
SUPABASE_SERVICE_KEY=<your-service-role-key>
ANALYZER_URL=http://localhost:5000
```

## 4. Start Development Servers (3 minutes)

Open **4 terminal windows**:

### Terminal 1 - Backend
```bash
cd apps/backend
npm run dev
```
Wait for: `🚀 NotWrapper Backend running on port 3003`

### Terminal 2 - Analyzer
```bash
cd apps/analyzer
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

python app.py
```
Wait for: Running on `http://127.0.0.1:5000`

### Terminal 3 - Web App
```bash
cd apps/web
npm run dev
```
Wait for: `Ready on http://localhost:3000`

### Terminal 4 - Mobile App (Optional)
```bash
cd apps/mobile
npm start
```
Scan QR code with Expo Go app

## 5. Test It Out!

### Web App
1. Open http://localhost:3000
2. Click "Scan a Tool"
3. Enter URL: `https://example.com`
4. Click "Run Scan"
5. See results!

### API Test
```bash
curl -X POST http://localhost:3003/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Mobile App
1. Open Expo Go on your phone
2. Scan QR code from terminal
3. Tap "Scan a Tool"
4. Test the scanner

## Troubleshooting

### Backend won't start
- Check if port 3003 is available
- Verify Supabase credentials in `.env`

### Analyzer error
- Activate virtual environment first
- Check Python version: `python --version`
- Reinstall dependencies: `pip install -r requirements.txt`

### Web app can't connect
- Make sure backend is running
- Check `NEXT_PUBLIC_BACKEND_URL` points to `http://localhost:3003`

### Mobile app blank screen
- Backend URL must be your local IP (not localhost)
- Example: `http://192.168.1.5:3003`
- Clear Expo cache: `npm start -- -c`

## What's Next?

### Add Sample Data
```bash
# In Supabase SQL Editor, run:
# supabase/seed.sql
```

### Deploy to Production
See `DEPLOYMENT.md` for full deployment guide

### Customize
- Edit colors in `apps/web/tailwind.config.js`
- Modify detection patterns in `apps/analyzer/analyzer/wrapper_detector.py`
- Add new pages in `apps/web/src/app/`

### Learn More
- `DEVELOPMENT.md` - Detailed dev guide
- `CONTRIBUTING.md` - How to contribute
- `MANIFESTO.md` - Product vision

## Project Structure

```
notwrapper-mvp/
├── apps/
│   ├── web/          # Next.js (http://localhost:3000)
│   ├── mobile/       # React Native + Expo
│   ├── backend/      # Node.js API (port 3003)
│   └── analyzer/     # Python service (port 5000)
├── supabase/         # Database schema
└── scripts/          # Setup scripts
```

## Development Commands

```bash
# Backend
cd apps/backend && npm run dev

# Analyzer
cd apps/analyzer && python app.py

# Web
cd apps/web && npm run dev

# Mobile
cd apps/mobile && npm start

# Build for production
cd apps/web && npm run build
```

## Support

- 📖 Read `DEVELOPMENT.md` for detailed setup
- 🐛 Report issues on GitHub
- 💬 Join Discord (link in README)
- 📧 Email: dev@notwrapper.app

---

**You're ready to start detecting wrappers!** 🔍

Happy hunting! 🚀

