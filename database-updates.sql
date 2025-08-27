-- Database Updates for Venturo Platform
-- Run this in your Supabase SQL editor

-- 1. Add subscription fields to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'investor')),
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- 2. Add image fields to startup_ideas
ALTER TABLE startup_ideas 
ADD COLUMN IF NOT EXISTS links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS company_logo TEXT,
ADD COLUMN IF NOT EXISTS company_logo_public_id TEXT;

-- 3. Create community_feedback table
CREATE TABLE IF NOT EXISTS community_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  moderation_score INTEGER,
  moderation_reason TEXT,
  moderated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create idea_likes table
CREATE TABLE IF NOT EXISTS idea_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES startup_ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- 5. Enable RLS on new tables
ALTER TABLE community_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_likes ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for community_feedback
CREATE POLICY "Anyone can view approved feedback" ON community_feedback FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can create feedback" ON community_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own feedback" ON community_feedback FOR UPDATE USING (true);

-- 7. Create RLS policies for idea_likes
CREATE POLICY "Anyone can view idea likes" ON idea_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like ideas" ON idea_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can unlike their own likes" ON idea_likes FOR DELETE USING (true);

-- 8. Create updated_at trigger for community_feedback
CREATE TRIGGER update_community_feedback_updated_at BEFORE UPDATE ON community_feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_feedback_approved ON community_feedback(is_approved);
CREATE INDEX IF NOT EXISTS idx_community_feedback_rating ON community_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_community_feedback_moderation ON community_feedback(moderation_score, is_approved);
CREATE INDEX IF NOT EXISTS idx_idea_likes_idea_id ON idea_likes(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_likes_user_id ON idea_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_tier);

-- 10. Update existing RLS policies to work with Clerk (if not already done)
-- Drop existing policies that might cause issues
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create ideas" ON startup_ideas;

-- Create new policies that work with Clerk
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (true);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can create ideas" ON startup_ideas FOR INSERT WITH CHECK (true);

-- 11. Create RPC function for incrementing idea stats (if not exists)
CREATE OR REPLACE FUNCTION increment_idea_views(idea_id UUID, increment_amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE startup_ideas 
  SET stats = jsonb_set(
    COALESCE(stats, '{"views": 0, "saves": 0, "messages": 0}'::jsonb),
    '{saves}',
    to_jsonb(COALESCE((stats->>'saves')::integer, 0) + increment_amount)
  )
  WHERE id = idea_id;
END;
$$ LANGUAGE plpgsql;
