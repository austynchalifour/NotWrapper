# NotWrapper MVP 🔍

**Detect whether an AI tool is a real build or just a wrapper.**

Built with the dev-core aesthetic: Mr. Robot meets Vercel. Monochrome + neon glitch vibes.

## 🚀 Features

### WrapperCheck™ Engine
- Scan any tool URL for wrapper signatures
- Detect: Webflow/Bubble templates, Zapier automations, OpenAI wrappers, boilerplate templates
- Get verdict: **NotWrapper**, **Wrapper Sus**, or **Wrapper Confirmed**
- View receipts: detected frameworks, asset paths, network calls


### Certified NotWrapper™ Badges
- Scan your own tool
- Get a verified badge (SVG + PNG)
- Embed on your website
- Links to public profile + scan results

### Verified Marketplace
- Product Hunt for real AI builders
- Browse all scanned tools
- Filter by verdict, category, date
- Upvote, comment, save hunts

### Leaderboard
- Community rankings
- Based on hunts, accuracy, engagement
- Weekly resets

## 🛠 Tech Stack

- **Web**: Next.js 14 (App Router)
- **Backend**: Node.js + Express
- **Analyzer**: Python + Flask + Puppeteer + Scrapy
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth

## 📦 Project Structure

```
notwrapper-mvp/
├── apps/
│   ├── web/          # Next.js web app
│   ├── backend/      # Node.js API server
│   └── analyzer/     # Python analysis service
├── packages/
│   └── shared/       # Shared types & utilities
└── supabase/         # Database schema & migrations
```

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn
- Supabase account

### 1. Clone & Install

```bash
git clone <repo-url>
cd notwrapper-mvp
npm install
cd apps/web && npm install
cd ../backend && npm install
cd ../analyzer && pip install -r requirements.txt
```

### 2. Set Up Supabase

1. Create a new Supabase project
2. Run the SQL schema in `supabase/schema.sql`
3. Set up storage buckets: `videos`, `badges`, `scan-results`
4. Copy your credentials to `.env.local`

### 3. Configure Environment

```bash
cp .env.example .env.local
# Fill in your Supabase credentials
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 - Python Analyzer:**
```bash
cd apps/analyzer
python app.py
# Runs on http://localhost:5000
```

**Terminal 3 - Web App:**
```bash
cd apps/web
npm run dev
# Runs on http://localhost:3000
```

## 🚀 Deployment

### Web App (Vercel)

```bash
cd apps/web
vercel
```

Set environment variables in Vercel dashboard.

### Backend (Render)

1. Create new Web Service on Render
2. Connect repository
3. Build command: `cd apps/backend && npm install`
4. Start command: `cd apps/backend && npm start`
5. Add environment variables

### Python Analyzer (Render)

1. Create new Web Service
2. Build command: `cd apps/analyzer && pip install -r requirements.txt`
3. Start command: `cd apps/analyzer && gunicorn app:app`
4. Add Dockerfile for better performance

## 🎨 Branding

- **Colors**: Monochrome base (#000, #111, #1a1a1a) + Neon accent (#00ff41)
- **Fonts**: JetBrains Mono (code), Inter (UI)
- **Vibe**: Dev-core, hacker aesthetic, terminal-inspired

## 🗄 Database Schema

See `supabase/schema.sql` for complete schema.

**Key Tables:**
- `profiles` - User profiles
- `tools` - Scanned tools/products
- `scans` - Individual scan results
- `hunts` - LiveHunt videos
- `comments` - Community feedback
- `votes` - Upvotes on tools/hunts
- `badges` - Issued badges

## 📝 API Endpoints

### Backend (Node.js)

- `POST /api/scan` - Trigger new scan
- `GET /api/scan/:id` - Get scan results
- `POST /api/hunt` - Upload LiveHunt video
- `GET /api/tools` - List all tools
- `GET /api/tools/:id` - Get tool details
- `POST /api/badges/generate` - Generate badge
- `GET /api/leaderboard` - Get rankings

### Analyzer (Python)

- `POST /analyze` - Analyze URL for wrapper signals

## 🤝 Contributing

This is an MVP. Code is optimized for shipping fast, not perfection.

## 📄 License

MIT

---

Built with 🔥 by real developers, for real developers.

**No wrappers allowed.**

