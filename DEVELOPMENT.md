# NotWrapper Development Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Git
- A Supabase account (free tier works)
- Code editor (VS Code recommended)

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd notwrapper-mvp
```

### 2. Install Dependencies

```bash
# Root dependencies
npm install

# Web app
cd apps/web && npm install && cd ../..

# Mobile app
cd apps/mobile && npm install && cd ../..

# Backend
cd apps/backend && npm install && cd ../..

# Python analyzer
cd apps/analyzer
pip install -r requirements.txt
# OR use virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase/schema.sql`
3. Go to Storage and create buckets:
   - videos (public)
   - badges (public)
   - scan-results (public)
   - avatars (public)
4. Get your credentials from Settings → API

### 4. Configure Environment Variables

Create `.env.local` in each app directory:

**apps/web/.env.local**
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3003
```

**apps/backend/.env**
```bash
PORT=3003
NODE_ENV=development
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
ANALYZER_URL=http://localhost:5000
```

**apps/analyzer/.env** (optional)
```bash
PORT=5000
```

## Running the Development Stack

You'll need **4 terminal windows**:

### Terminal 1: Backend API

```bash
cd apps/backend
npm run dev
```

Server runs on `http://localhost:3003`

### Terminal 2: Python Analyzer

```bash
cd apps/analyzer
# If using venv: source venv/bin/activate
python app.py
```

Service runs on `http://localhost:5000`

### Terminal 3: Web App

```bash
cd apps/web
npm run dev
```

Web app runs on `http://localhost:3000`

### Terminal 4: Mobile App

```bash
cd apps/mobile
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Project Structure

```
notwrapper-mvp/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── src/
│   │   │   ├── app/           # App router pages
│   │   │   ├── components/    # React components
│   │   │   └── lib/           # Utilities
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   ├── mobile/                 # React Native mobile app
│   │   ├── app/               # Expo Router pages
│   │   ├── assets/            # Images, fonts
│   │   ├── app.json
│   │   └── package.json
│   │
│   ├── backend/                # Node.js API server
│   │   ├── src/
│   │   │   ├── routes/        # API endpoints
│   │   │   ├── config/        # Configuration
│   │   │   ├── utils/         # Utilities
│   │   │   └── server.js      # Entry point
│   │   └── package.json
│   │
│   └── analyzer/               # Python analysis service
│       ├── analyzer/          # Analysis modules
│       │   └── wrapper_detector.py
│       ├── app.py             # Flask entry point
│       ├── requirements.txt
│       └── Dockerfile
│
├── supabase/                   # Database
│   ├── schema.sql             # Database schema
│   └── seed.sql               # Seed data
│
├── package.json               # Workspace root
└── README.md
```

## Key Technologies

### Frontend
- **Next.js 14**: Web framework (App Router)
- **React Native + Expo**: Mobile framework
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

### Backend
- **Express.js**: Node.js API framework
- **Flask**: Python web framework
- **Supabase**: PostgreSQL database + auth + storage

### Analysis
- **BeautifulSoup**: HTML parsing
- **Requests**: HTTP client
- **Custom pattern matching**: Wrapper detection

## API Endpoints

### Backend (Node.js)

#### Scan
- `POST /api/scan` - Trigger new scan
- `GET /api/scan/:id` - Get scan results

#### Tools
- `GET /api/tools` - List tools (with filters)
- `GET /api/tools/:id` - Get tool details
- `POST /api/tools/:id/vote` - Vote on tool
- `POST /api/tools/:id/comments` - Add comment

#### Hunts
- `GET /api/hunts` - List hunts
- `GET /api/hunts/:id` - Get hunt details
- `POST /api/hunts` - Create hunt
- `POST /api/hunts/:id/vote` - Vote on hunt

#### Badges
- `POST /api/badges/generate` - Generate badge
- `GET /api/badges/:toolId` - Get badge

#### Leaderboard
- `GET /api/leaderboard` - Get rankings
- `GET /api/leaderboard/user/:userId` - Get user rank

#### Profiles
- `GET /api/profiles/:username` - Get profile
- `PUT /api/profiles/:id` - Update profile

### Analyzer (Python)

- `POST /analyze` - Analyze URL for wrapper signals

Request:
```json
{
  "url": "https://example.com"
}
```

Response:
```json
{
  "verdict": "NotWrapper",
  "confidence": 85,
  "receipts": { ... },
  "stack_dna": { ... }
}
```

## Database Schema

See `supabase/schema.sql` for complete schema.

**Main Tables:**
- `profiles` - User accounts
- `tools` - Scanned products
- `scans` - Individual scan results
- `hunts` - LiveHunt videos
- `badges` - Issued certificates
- `comments` - User comments
- `votes` - Upvotes/downvotes
- `leaderboard_points` - Weekly rankings

## Development Workflow

### Making Changes

1. **Backend Changes**
   - Edit files in `apps/backend/src/`
   - Server auto-restarts with nodemon
   - Test with curl or Postman

2. **Analyzer Changes**
   - Edit `apps/analyzer/analyzer/wrapper_detector.py`
   - Restart Flask server manually
   - Test with direct HTTP requests

3. **Web Changes**
   - Edit files in `apps/web/src/`
   - Hot reload automatically updates browser
   - Check browser console for errors

4. **Mobile Changes**
   - Edit files in `apps/mobile/app/`
   - Expo auto-refreshes app
   - Shake device to open dev menu

### Testing

#### Test Backend Endpoint

```bash
curl -X POST http://localhost:3003/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

#### Test Analyzer

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Adding New Features

#### Add New API Endpoint

1. Create route file in `apps/backend/src/routes/`
2. Define endpoint logic
3. Import in `apps/backend/src/server.js`
4. Test with curl

#### Add New Page (Web)

1. Create file in `apps/web/src/app/`
2. Use Server Components by default
3. Add 'use client' for interactivity
4. Test in browser

#### Add New Screen (Mobile)

1. Create file in `apps/mobile/app/`
2. Export default component
3. Add to navigation if needed
4. Test in Expo Go

## Common Issues

### Port Already in Use

```bash
# Find and kill process
# macOS/Linux
lsof -ti:3003 | xargs kill -9

# Windows
netstat -ano | findstr :3003
taskkill /PID <process_id> /F
```

### Supabase Connection Error

- Check credentials in `.env.local`
- Verify project is active in Supabase dashboard
- Check network connectivity

### Mobile App Not Loading

- Clear Expo cache: `expo start -c`
- Check BACKEND_URL points to correct IP (not localhost on physical device)
- Use your local IP address: `http://192.168.1.x:3003`

### Python Dependencies Error

```bash
# Recreate virtual environment
cd apps/analyzer
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Code Style

### TypeScript/JavaScript
- Use TypeScript for type safety
- Async/await over promises
- Functional components in React
- Descriptive variable names

### Python
- Follow PEP 8
- Type hints where possible
- Docstrings for functions
- Clean imports

### CSS
- Use Tailwind utility classes
- Follow design system colors
- Responsive by default

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### Commit Message Format

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

## Performance Tips

1. **Use database indexes** for common queries
2. **Cache API responses** where appropriate
3. **Optimize images** before uploading
4. **Lazy load** heavy components
5. **Minimize bundle size** in production builds

## Security Best Practices

- Never commit `.env` files
- Use environment variables for secrets
- Validate all user inputs
- Sanitize SQL queries (use parameterized queries)
- Enable RLS in Supabase
- Rate limit API endpoints
- Use HTTPS in production

## Debugging

### Backend
```javascript
// Add debug logs
console.log('Debug:', variable)

// Use debugger
debugger;
```

### Web (Next.js)
- Use React DevTools browser extension
- Check Network tab for API calls
- Use `console.log` liberally

### Mobile
- Shake device → Debug Remote JS
- React Native Debugger
- console.log shows in terminal

### Python
```python
# Add print statements
print(f"Debug: {variable}")

# Use pdb
import pdb; pdb.set_trace()
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Expo Docs](https://docs.expo.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com)
- [Flask Documentation](https://flask.palletsprojects.com)

## Getting Help

1. Check this documentation
2. Review error messages carefully
3. Search existing issues on GitHub
4. Ask in project Discord/Slack
5. Create detailed GitHub issue

---

Happy coding! 🚀

