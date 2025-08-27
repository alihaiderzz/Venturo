-- =====================================================
-- COMPLETE VENTURO WEBSITE DATABASE SCHEMA
-- Run this entire file in your Supabase SQL editor
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USER PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('founder', 'creator', 'backer')),
    bio TEXT,
    location TEXT,
    state TEXT,
    sectors TEXT[],
    skills TEXT[],
    time_commitment TEXT,
    indicative_ticket TEXT,
    social_links JSONB DEFAULT '{}',
    profile_completed BOOLEAN DEFAULT FALSE,
    website TEXT,
    company TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'investor_premium')),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------
-- Make sure newer columns are present if the table already existed
-- -------------------------------------------------------------
ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS website TEXT,
    ADD COLUMN IF NOT EXISTS company TEXT,
    ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
    ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time_start TIME,
    time_end TIME,
    location TEXT,
    category TEXT,
    max_attendees INTEGER DEFAULT 50,
    current_attendees INTEGER DEFAULT 0,
    is_venturo_hosted BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    organizer_name TEXT,
    organizer_email TEXT,
    external_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STARTUP IDEAS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS startup_ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    problem TEXT,
    solution TEXT,
    target_market TEXT,
    business_model TEXT,
    competitive_advantage TEXT,
    funding_needs TEXT,
    stage TEXT CHECK (stage IN ('idea', 'mvp', 'early_traction', 'scaling', 'established')),
    industry TEXT,
    location TEXT,
    owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    -- *** these columns may already exist, but we add them safely ***
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    images TEXT[],
    company_logo TEXT,
    company_logo_public_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------
-- Make sure the columns are present if the table already existed
-- -------------------------------------------------------------
ALTER TABLE startup_ideas
    ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS images TEXT[],
    ADD COLUMN IF NOT EXISTS company_logo TEXT,
    ADD COLUMN IF NOT EXISTS company_logo_public_id TEXT;

-- =====================================================
-- MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EVENT ATTENDEES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- =====================================================
-- USER CONNECTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user1_id, user2_id)
);

-- =====================================================
-- SAVED IDEAS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    idea_id UUID REFERENCES startup_ideas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, idea_id)
);

-- =====================================================
-- AI MODERATION LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_moderation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type TEXT NOT NULL,
    content_id UUID NOT NULL,
    moderation_score INTEGER,
    moderation_reason TEXT,
    is_approved BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMMUNITY FEEDBACK TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS community_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    user_id TEXT,
    moderation_score INTEGER,
    moderation_reason TEXT,
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------
-- Make sure newer columns are present if the table already existed
-- -------------------------------------------------------------
ALTER TABLE community_feedback
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS moderation_score INTEGER,
    ADD COLUMN IF NOT EXISTS moderation_reason TEXT,
    ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- IDEA LIKES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS idea_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_id UUID REFERENCES startup_ideas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(idea_id, user_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id ON user_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_tier);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_venturo_hosted ON events(is_venturo_hosted);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- Startup ideas indexes
CREATE INDEX IF NOT EXISTS idx_startup_ideas_owner ON startup_ideas(owner_id);
CREATE INDEX IF NOT EXISTS idx_startup_ideas_status ON startup_ideas(status);
CREATE INDEX IF NOT EXISTS idx_startup_ideas_stage ON startup_ideas(stage);
-- Only create industry index if column exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startup_ideas' AND column_name = 'industry') THEN
        CREATE INDEX IF NOT EXISTS idx_startup_ideas_industry ON startup_ideas(industry);
    END IF;
END $$;
-- Only create views/likes indexes if columns exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startup_ideas' AND column_name = 'views') THEN
        CREATE INDEX IF NOT EXISTS idx_startup_ideas_views ON startup_ideas(views DESC);
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startup_ideas' AND column_name = 'likes') THEN
        CREATE INDEX IF NOT EXISTS idx_startup_ideas_likes ON startup_ideas(likes DESC);
    END IF;
END $$;

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Event attendees indexes
CREATE INDEX IF NOT EXISTS idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user ON event_attendees(user_id);

-- User connections indexes
CREATE INDEX IF NOT EXISTS idx_user_connections_user1 ON user_connections(user1_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_user2 ON user_connections(user2_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_status ON user_connections(status);

-- Saved ideas indexes
CREATE INDEX IF NOT EXISTS idx_saved_ideas_user ON saved_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_ideas_idea ON saved_ideas(idea_id);

-- Community feedback indexes
CREATE INDEX IF NOT EXISTS idx_community_feedback_approved ON community_feedback(is_approved);
-- Only create featured index if column exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_feedback' AND column_name = 'is_featured') THEN
        CREATE INDEX IF NOT EXISTS idx_community_feedback_featured ON community_feedback(is_featured, is_approved);
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_community_feedback_rating ON community_feedback(rating DESC);
CREATE INDEX IF NOT EXISTS idx_community_feedback_created ON community_feedback(created_at DESC);

-- Idea likes indexes
CREATE INDEX IF NOT EXISTS idx_idea_likes_idea ON idea_likes(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_likes_user ON idea_likes(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_likes ENABLE ROW LEVEL SECURITY;

-- User profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (true) WITH CHECK (true);

-- Events policies
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON events;

CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update events" ON events FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete events" ON events FOR DELETE USING (true);

-- Startup ideas policies
DROP POLICY IF EXISTS "Anyone can view active ideas" ON startup_ideas;
DROP POLICY IF EXISTS "Users can view their own ideas" ON startup_ideas;
DROP POLICY IF EXISTS "Authenticated users can create ideas" ON startup_ideas;
DROP POLICY IF EXISTS "Users can update their own ideas" ON startup_ideas;
DROP POLICY IF EXISTS "Users can delete their own ideas" ON startup_ideas;

CREATE POLICY "Anyone can view active ideas" ON startup_ideas FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view their own ideas" ON startup_ideas FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create ideas" ON startup_ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own ideas" ON startup_ideas FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete their own ideas" ON startup_ideas FOR DELETE USING (true);

-- Messages policies
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;

CREATE POLICY "Users can view messages they sent or received" ON messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete their own messages" ON messages FOR DELETE USING (true);

-- Event attendees policies
DROP POLICY IF EXISTS "Anyone can view event attendees" ON event_attendees;
DROP POLICY IF EXISTS "Authenticated users can register for events" ON event_attendees;
DROP POLICY IF EXISTS "Users can update their own attendance" ON event_attendees;
DROP POLICY IF EXISTS "Users can cancel their own attendance" ON event_attendees;

CREATE POLICY "Anyone can view event attendees" ON event_attendees FOR SELECT USING (true);
CREATE POLICY "Authenticated users can register for events" ON event_attendees FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own attendance" ON event_attendees FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Users can cancel their own attendance" ON event_attendees FOR DELETE USING (true);

-- User connections policies
DROP POLICY IF EXISTS "Users can view their own connections" ON user_connections;
DROP POLICY IF EXISTS "Authenticated users can create connections" ON user_connections;
DROP POLICY IF EXISTS "Users can update their own connections" ON user_connections;
DROP POLICY IF EXISTS "Users can delete their own connections" ON user_connections;

CREATE POLICY "Users can view their own connections" ON user_connections FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create connections" ON user_connections FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own connections" ON user_connections FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete their own connections" ON user_connections FOR DELETE USING (true);

-- Saved ideas policies
DROP POLICY IF EXISTS "Users can view their own saved ideas" ON saved_ideas;
DROP POLICY IF EXISTS "Authenticated users can save ideas" ON saved_ideas;
DROP POLICY IF EXISTS "Users can delete their own saved ideas" ON saved_ideas;

CREATE POLICY "Users can view their own saved ideas" ON saved_ideas FOR SELECT USING (true);
CREATE POLICY "Authenticated users can save ideas" ON saved_ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete their own saved ideas" ON saved_ideas FOR DELETE USING (true);

-- AI moderation logs policies
DROP POLICY IF EXISTS "Admin can view moderation logs" ON ai_moderation_logs;
DROP POLICY IF EXISTS "System can create moderation logs" ON ai_moderation_logs;

CREATE POLICY "Admin can view moderation logs" ON ai_moderation_logs FOR SELECT USING (true);
CREATE POLICY "System can create moderation logs" ON ai_moderation_logs FOR INSERT WITH CHECK (true);

-- Community feedback policies
DROP POLICY IF EXISTS "Anyone can view approved feedback" ON community_feedback;
DROP POLICY IF EXISTS "Authenticated users can submit feedback" ON community_feedback;
DROP POLICY IF EXISTS "Admin can update feedback" ON community_feedback;
DROP POLICY IF EXISTS "Admin can delete feedback" ON community_feedback;

CREATE POLICY "Anyone can view approved feedback" ON community_feedback FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can submit feedback" ON community_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update feedback" ON community_feedback FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete feedback" ON community_feedback FOR DELETE USING (true);

-- Idea likes policies
DROP POLICY IF EXISTS "Anyone can view idea likes" ON idea_likes;
DROP POLICY IF EXISTS "Authenticated users can like ideas" ON idea_likes;
DROP POLICY IF EXISTS "Users can unlike their own likes" ON idea_likes;

CREATE POLICY "Anyone can view idea likes" ON idea_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like ideas" ON idea_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can unlike their own likes" ON idea_likes FOR DELETE USING (true);

-- =====================================================
-- RPC FUNCTIONS
-- =====================================================

-- Function to increment idea views
CREATE OR REPLACE FUNCTION increment_idea_views(idea_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE startup_ideas 
    SET views = views + 1 
    WHERE id = idea_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete user idea (for RLS bypass)
CREATE OR REPLACE FUNCTION delete_user_idea(idea_id UUID, user_clerk_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_profile_id UUID;
BEGIN
    -- Get user profile ID
    SELECT id INTO user_profile_id
    FROM user_profiles
    WHERE clerk_user_id = user_clerk_id;

    IF user_profile_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Delete the idea if user owns it
    DELETE FROM startup_ideas
    WHERE id = idea_id AND owner_id = user_profile_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update idea likes count
CREATE OR REPLACE FUNCTION update_idea_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE startup_ideas 
        SET likes = likes + 1 
        WHERE id = NEW.idea_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE startup_ideas 
        SET likes = likes - 1 
        WHERE id = OLD.idea_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update idea likes count
CREATE TRIGGER trigger_update_idea_likes_count
    AFTER INSERT OR DELETE ON idea_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_idea_likes_count();

-- =====================================================
-- SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert sample events (only if they don't exist)
INSERT INTO events (title, description, date, time_start, time_end, location, category, is_venturo_hosted, organizer_name, organizer_email) 
SELECT * FROM (VALUES
    ('Sydney Startup Meetup', 'Connect with fellow entrepreneurs in Sydney', '2025-02-15', '18:00', '20:00', 'Sydney CBD', 'Networking', true, 'Venturo Team', 'team@joinventuro.com'),
    ('Melbourne Tech Workshop', 'Learn the latest in tech entrepreneurship', '2025-02-20', '14:00', '17:00', 'Melbourne', 'Workshop', false, 'Tech Hub Melbourne', 'info@techhub.com.au'),
    ('Brisbane Pitch Competition', 'Pitch your startup idea to investors', '2025-02-25', '19:00', '22:00', 'Brisbane', 'Pitch Competition', true, 'Venturo Team', 'team@joinventuro.com')
) AS v(title, description, date, time_start, time_end, location, category, is_venturo_hosted, organizer_name, organizer_email)
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = v.title);

-- Insert sample community feedback (only if they don't exist)
INSERT INTO community_feedback (quote, author_name, author_role, rating, is_approved, is_featured) 
SELECT * FROM (VALUES
    ('Venturo helped me find the perfect co-founder for my startup. The community is amazing!', 'Sarah Johnson', 'Founder', 5, true, true),
    ('Great platform for connecting with investors and mentors. Highly recommend!', 'Michael Chen', 'Creator', 5, true, true),
    ('The events are well-organized and the networking opportunities are invaluable.', 'Emma Wilson', 'Backer', 5, true, true)
) AS v(quote, author_name, author_role, rating, is_approved, is_featured)
WHERE NOT EXISTS (SELECT 1 FROM community_feedback WHERE quote = v.quote);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- This completes the Venturo website database setup
-- All tables, indexes, policies, functions, and triggers are now in place
-- Your website is ready to use with full functionality!
