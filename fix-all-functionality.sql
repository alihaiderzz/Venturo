-- Fix All Functionality SQL Script
-- This script ensures all database tables and functions work properly

-- 1. Fix user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS boost_credits INTEGER DEFAULT 0;

-- 2. Fix startup_ideas table
ALTER TABLE startup_ideas 
ADD COLUMN IF NOT EXISTS is_boosted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS boosted_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS company_logo TEXT,
ADD COLUMN IF NOT EXISTS company_logo_public_id TEXT;

-- 3. Fix events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'upcoming',
ADD COLUMN IF NOT EXISTS current_attendees INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_venturo_hosted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS external_link TEXT;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id ON user_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_startup_ideas_owner ON startup_ideas(owner_id);
CREATE INDEX IF NOT EXISTS idx_startup_ideas_status ON startup_ideas(status);
CREATE INDEX IF NOT EXISTS idx_startup_ideas_boosted ON startup_ideas(is_boosted, boosted_until) WHERE is_boosted = TRUE;
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- 5. Create function to remove expired boosts
CREATE OR REPLACE FUNCTION remove_expired_boosts()
RETURNS void AS $$
BEGIN
  UPDATE startup_ideas 
  SET is_boosted = FALSE, boosted_until = NULL 
  WHERE is_boosted = TRUE AND boosted_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- 6. Create function to update attendee count
CREATE OR REPLACE FUNCTION update_event_attendees()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events 
    SET current_attendees = current_attendees + 1 
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events 
    SET current_attendees = current_attendees - 1 
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for event attendees
DROP TRIGGER IF EXISTS trigger_update_event_attendees ON event_attendees;
CREATE TRIGGER trigger_update_event_attendees
  AFTER INSERT OR DELETE ON event_attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_event_attendees();

-- 8. Fix RLS policies to be more permissive for development
DROP POLICY IF EXISTS "Enable all operations for user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable all operations for startup_ideas" ON startup_ideas;
DROP POLICY IF EXISTS "Enable all operations for events" ON events;

CREATE POLICY "Enable all operations for user_profiles" ON user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for startup_ideas" ON startup_ideas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for events" ON events FOR ALL USING (true) WITH CHECK (true);

-- 9. Grant permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_profiles TO anon;
GRANT ALL ON startup_ideas TO authenticated;
GRANT ALL ON startup_ideas TO anon;
GRANT ALL ON events TO authenticated;
GRANT ALL ON events TO anon;
GRANT ALL ON event_attendees TO authenticated;
GRANT ALL ON event_attendees TO anon;

-- 10. Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- 11. Update existing user to investor tier (if exists)
UPDATE user_profiles 
SET subscription_tier = 'investor', 
    profile_completed = true 
WHERE email = 'sm.alihaider.nz@gmail.com';

COMMIT;
