-- NotWrapper Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  twitter TEXT,
  github TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools table (scanned products/tools)
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  logo_url TEXT,
  submitted_by UUID REFERENCES profiles(id),
  latest_verdict TEXT CHECK (latest_verdict IN ('NotWrapper', 'Wrapper Sus', 'Wrapper Confirmed')),
  transparency_score INTEGER DEFAULT 0 CHECK (transparency_score >= 0 AND transparency_score <= 100),
  total_scans INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scans table (individual scan results)
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  scanned_by UUID REFERENCES profiles(id),
  verdict TEXT NOT NULL CHECK (verdict IN ('NotWrapper', 'Wrapper Sus', 'Wrapper Confirmed')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  receipts JSONB NOT NULL DEFAULT '{}'::jsonb,
  stack_dna JSONB NOT NULL DEFAULT '{}'::jsonb,
  analysis_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  scan_duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hunts table (LiveHunt videos)
CREATE TABLE hunts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id),
  creator_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  verdict TEXT CHECK (verdict IN ('NotWrapper', 'Wrapper Sus', 'Wrapper Confirmed')),
  total_views INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges table (Certified NotWrapper badges)
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL DEFAULT 'certified_notwrapper',
  issued_to UUID REFERENCES profiles(id),
  badge_svg_url TEXT,
  badge_png_url TEXT,
  embed_code TEXT,
  is_revoked BOOLEAN DEFAULT FALSE,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(tool_id, badge_type)
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  hunt_id UUID REFERENCES hunts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (tool_id IS NOT NULL OR hunt_id IS NOT NULL)
);

-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  hunt_id UUID REFERENCES hunts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (
    (tool_id IS NOT NULL AND hunt_id IS NULL AND comment_id IS NULL) OR
    (tool_id IS NULL AND hunt_id IS NOT NULL AND comment_id IS NULL) OR
    (tool_id IS NULL AND hunt_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, tool_id),
  UNIQUE(user_id, hunt_id),
  UNIQUE(user_id, comment_id)
);

-- Leaderboard points table
CREATE TABLE leaderboard_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  hunts_count INTEGER DEFAULT 0,
  scans_count INTEGER DEFAULT 0,
  upvotes_received INTEGER DEFAULT 0,
  accuracy_score INTEGER DEFAULT 0,
  week_start DATE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Create indexes
CREATE INDEX idx_tools_latest_verdict ON tools(latest_verdict);
CREATE INDEX idx_tools_created_at ON tools(created_at DESC);
CREATE INDEX idx_scans_tool_id ON scans(tool_id);
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX idx_hunts_creator_id ON hunts(creator_id);
CREATE INDEX idx_hunts_tool_id ON hunts(tool_id);
CREATE INDEX idx_hunts_created_at ON hunts(created_at DESC);
CREATE INDEX idx_comments_tool_id ON comments(tool_id);
CREATE INDEX idx_comments_hunt_id ON comments(hunt_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_leaderboard_week_points ON leaderboard_points(week_start DESC, points DESC);

-- Row Level Security (RLS) Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tools
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tools are viewable by everyone"
  ON tools FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tools"
  ON tools FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Scans
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scans are viewable by everyone"
  ON scans FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create scans"
  ON scans FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Hunts
ALTER TABLE hunts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hunts are viewable by everyone"
  ON hunts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create hunts"
  ON hunts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = creator_id);

CREATE POLICY "Hunt creators can update their hunts"
  ON hunts FOR UPDATE
  USING (auth.uid() = creator_id);

-- Badges
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  USING (true);

-- Comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Comment authors can update their comments"
  ON comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Comment authors can delete their comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id);

-- Votes
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage their votes"
  ON votes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Leaderboard
ALTER TABLE leaderboard_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard is viewable by everyone"
  ON leaderboard_points FOR SELECT
  USING (true);

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Auto-create profile when new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Update vote counts
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.tool_id IS NOT NULL THEN
      UPDATE tools SET total_votes = total_votes + NEW.vote_type WHERE id = NEW.tool_id;
    ELSIF NEW.hunt_id IS NOT NULL THEN
      UPDATE hunts SET total_votes = total_votes + NEW.vote_type WHERE id = NEW.hunt_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.tool_id IS NOT NULL THEN
      UPDATE tools SET total_votes = total_votes - OLD.vote_type WHERE id = OLD.tool_id;
    ELSIF OLD.hunt_id IS NOT NULL THEN
      UPDATE hunts SET total_votes = total_votes - OLD.vote_type WHERE id = OLD.hunt_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vote_counts_trigger
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vote_counts();

-- Storage buckets (run these in Supabase Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('badges', 'badges', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('scan-results', 'scan-results', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

