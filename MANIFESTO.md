# The NotWrapper Manifesto

## The Problem

The AI tool landscape is flooded with wrappers.

They take ChatGPT, slap on a Webflow template, add a Stripe checkout, and call it "revolutionary AI."

They expose API keys in the frontend. They use Zapier for "automation." They claim to be "building the future" while shipping nothing but a thin layer on top of someone else's API.

**This ends now.**

## The Solution

**NotWrapper** is a detection engine, a community, and a movement.

We scan any AI tool and expose what's under the hood:
- Is it built with Webflow/Bubble/Wix?
- Does it make direct OpenAI calls from the frontend?
- Are there obvious wrapper patterns?
- Is there any custom code at all?

We give you:
- **Instant Verdict**: NotWrapper, Wrapper Sus, or Wrapper Confirmed
- **Receipts**: Every framework, API call, and red flag we find
- **Transparency Score**: 0-100% based on custom code vs boilerplate

## The Vibe

**Dev-core. Hacker aesthetic. Mr. Robot meets Vercel.**

- Monochrome UI with neon green accents (#00ff41)
- Terminal-inspired design
- No fluff, just data
- Built by developers, for developers

We're not here to be pretty. We're here to expose the truth.

## The Features

### 1. WrapperCheck™ Engine
Paste a URL. Get a verdict in seconds.

Our engine crawls public pages, analyzes JavaScript assets, detects no-code platforms, checks for exposed API keys, and identifies boilerplate templates.

### 2. LiveHunt Mode
Record your investigation live. Narrate your findings, and share proof. Think: "Here's how I exposed this wrapper in 60 seconds."

Top hunts get featured. Climb the leaderboard. Earn credibility.

### 3. Certified NotWrapper™ Badge
For the builders who actually built something.

Scan your tool. Pass the test. Get a verified badge (SVG + PNG + embed code). Link it to your scan results so anyone can verify.

Wear it with pride.

### 4. Verified Marketplace
Product Hunt for real AI tools.

Every scanned tool gets a public listing with:
- Verdict & transparency score
- Stack DNA (frameworks detected)
- Receipts (evidence)
- Community votes & comments
- LiveHunt videos

Filter by "NotWrapper Only" to find legitimate builds.

### 5. Community Leaderboard
Points for:
- Running scans (+10)
- Publishing hunts (+50)
- Getting upvotes (+5 per vote)
- Accuracy (community verification)

Weekly resets. Top hunters get recognition.

## The Rules

1. **We don't gate-keep.** Anyone can scan. Anonymous or logged-in.

2. **We show receipts.** Every verdict comes with evidence. No arbitrary scores.

3. **We're open about our methods.** The wrapper detection patterns are visible. If you game the system, we'll update the engine.

4. **We support real builders.** If you built something custom, we celebrate that. Even if it uses third-party APIs, transparency matters.

5. **No witch hunts.** We detect wrappers. We don't harass founders. Criticism, yes. Harassment, no.

## What Counts as a Wrapper?

### 🚨 Wrapper Confirmed
- Built entirely on Webflow/Bubble/Wix
- Exposed API keys in frontend code
- Zero custom backend logic
- Just a UI on top of GPT-4 API
- Copy-pasted SaaS boilerplate with no changes

### ⚠️ Wrapper Sus
- Mix of custom code + heavy no-code tools
- Some custom logic but mostly third-party integrations
- Template-heavy with minimal differentiation
- Unclear if backend exists

### ✅ NotWrapper
- Custom-built frontend & backend
- Original ML models or significant API customization
- Real infrastructure (not just hosted functions)
- Clear engineering effort beyond templates

## Who This Is For

### Developers
Find real tools worth studying. Spot patterns to avoid. Learn what actual engineering looks like.

### Founders
Prove you built something real. Stand out from the noise. Get the badge.

### Investors
Due diligence tool. Check if the "proprietary AI" is actually proprietary.

### Users
Stop paying $29/month for tools you could build in 2 hours.

## The Tech Stack

**We eat our own dogfood.**

- Frontend: Next.js + React Native (no Webflow here)
- Backend: Node.js + Python
- Database: Supabase (PostgreSQL)
- Analysis: Custom engine (BeautifulSoup + pattern matching)
- Badge generation: Sharp (SVG + PNG)
- Deployment: Vercel + Render

Every line is custom. No wrappers. No irony.

## The Roadmap

### Phase 1: MVP (You Are Here)
- ✅ WrapperCheck™ scan engine
- ✅ LiveHunt video mode
- ✅ Badge generator
- ✅ Marketplace directory
- ✅ Leaderboard

### Phase 2: Community
- [ ] User profiles with scan history
- [ ] Follow other hunters
- [ ] Hunt playlists
- [ ] Bounties for exposing specific tools
- [ ] Browser extension for one-click scans

### Phase 3: Advanced Detection
- [ ] ML-based code analysis
- [ ] GitHub integration (verify repo activity)
- [ ] API fingerprinting (detect which LLM is actually used)
- [ ] Deployment analysis (check if infrastructure exists)

### Phase 4: Monetization (Maybe)
- [ ] API access for investors/analysts
- [ ] Enterprise version for due diligence
- [ ] Premium badge tier with extra verification

But we'll always keep the core free.

## Join the Movement

**We're not anti-AI. We're anti-wrapper.**

Real builders deserve recognition. Lazy wrappers deserve exposure.

Scan a tool. Record a hunt. Get the badge.

Let's clean up the AI ecosystem.

---

**Built by real devs, for real devs.**

No wrappers allowed.

🔍 **NOTWRAPPER** 🔍

