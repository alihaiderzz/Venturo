-- Venturo Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Clerk user data)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('founder', 'creator', 'backer')),
  bio TEXT,
  location TEXT,
  website TEXT,
  company TEXT,
  state TEXT,
  sectors TEXT[],
  skills TEXT[],
  time_commitment TEXT,
  indicative_ticket TEXT,
  social_links JSONB DEFAULT '{}',
  profile_completed BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'investor')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_venturo_hosted BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  organizer_id UUID REFERENCES user_profiles(id),
  organizer_name TEXT,
  organizer_email TEXT,
  external_link TEXT,
  ai_generated_tags TEXT[],
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Startup ideas table
CREATE TABLE IF NOT EXISTS startup_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  one_liner TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  stage TEXT,
  owner_id UUID REFERENCES user_profiles(id),
  needs JSONB DEFAULT '{}',
  links JSONB DEFAULT '{}',
  tags TEXT[],
  images JSONB DEFAULT '[]', -- Array of image objects with URLs and public_ids
  company_logo TEXT, -- Company logo URL
  company_logo_public_id TEXT, -- Cloudinary public_id for company logo
  stats JSONB DEFAULT '{"views": 0, "saves": 0, "messages": 0}',
  boosted_until TIMESTAMP WITH TIME ZONE,
  ai_generated_tags TEXT[],
  ai_summary TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES user_profiles(id),
  receiver_id UUID REFERENCES user_profiles(id),
  idea_id UUID REFERENCES startup_ideas(id),
  subject TEXT,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User connections/follows
CREATE TABLE IF NOT EXISTS user_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Saved ideas
CREATE TABLE IF NOT EXISTS saved_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES startup_ideas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, idea_id)
);

-- Community feedback table
CREATE TABLE IF NOT EXISTS community_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Idea likes/saves table
CREATE TABLE IF NOT EXISTS idea_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES startup_ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- AI content moderation logs
CREATE TABLE IF NOT EXISTS ai_moderation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL, -- 'event', 'idea', 'message'
  content_id UUID NOT NULL,
  moderation_result TEXT NOT NULL, -- 'approved', 'rejected', 'flagged'
  ai_confidence DECIMAL(3,2),
  flagged_reasons TEXT[],
  ai_suggestions TEXT,
  moderated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id ON user_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_venturo_hosted ON events(is_venturo_hosted);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_startup_ideas_owner ON startup_ideas(owner_id);
CREATE INDEX IF NOT EXISTS idx_startup_ideas_category ON startup_ideas(category);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_startup_ideas_updated_at BEFORE UPDATE ON startup_ideas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_likes ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (clerk_user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

-- Events policies
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (organizer_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- Startup ideas policies
CREATE POLICY "Anyone can view ideas" ON startup_ideas FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create ideas" ON startup_ideas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own ideas" ON startup_ideas FOR UPDATE USING (owner_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON messages FOR SELECT USING (
  sender_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub') OR
  receiver_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Event attendees policies
CREATE POLICY "Anyone can view attendees" ON event_attendees FOR SELECT USING (true);
CREATE POLICY "Authenticated users can register for events" ON event_attendees FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own attendance" ON event_attendees FOR UPDATE USING (user_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- User connections policies
CREATE POLICY "Anyone can view connections" ON user_connections FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create connections" ON user_connections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete own connections" ON user_connections FOR DELETE USING (follower_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- Saved ideas policies
CREATE POLICY "Users can view own saved ideas" ON saved_ideas FOR SELECT USING (user_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));
CREATE POLICY "Authenticated users can save ideas" ON saved_ideas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete own saved ideas" ON saved_ideas FOR DELETE USING (user_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- Community feedback policies
CREATE POLICY "Anyone can view approved feedback" ON community_feedback FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can create feedback" ON community_feedback FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own feedback" ON community_feedback FOR UPDATE USING (user_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- Idea likes policies
CREATE POLICY "Anyone can view idea likes" ON idea_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like ideas" ON idea_likes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can unlike their own likes" ON idea_likes FOR DELETE USING (user_id = (SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));
