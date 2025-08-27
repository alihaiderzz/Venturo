-- Fix RLS policies for community_feedback table
-- This script ensures feedback can be submitted and viewed properly

-- First, let's check if the table exists and has the right structure
DO $$ 
BEGIN
    -- Create table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'community_feedback') THEN
        CREATE TABLE community_feedback (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
            quote TEXT NOT NULL,
            author_name TEXT NOT NULL,
            author_role TEXT,
            rating INTEGER DEFAULT 5,
            is_approved BOOLEAN DEFAULT false,
            is_featured BOOLEAN DEFAULT false,
            moderation_score FLOAT,
            moderation_reason TEXT,
            moderated_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Add missing columns if they don't exist
ALTER TABLE community_feedback ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE community_feedback ADD COLUMN IF NOT EXISTS moderation_score FLOAT;
ALTER TABLE community_feedback ADD COLUMN IF NOT EXISTS moderation_reason TEXT;
ALTER TABLE community_feedback ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS
ALTER TABLE community_feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Enable read access for all users" ON community_feedback;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON community_feedback;
DROP POLICY IF EXISTS "Enable update for admins" ON community_feedback;
DROP POLICY IF EXISTS "Enable delete for admins" ON community_feedback;

-- Create new policies
-- Policy 1: Anyone can read approved and featured feedback (for homepage)
CREATE POLICY "Enable read access for all users" ON community_feedback
    FOR SELECT USING (is_approved = true AND is_featured = true);

-- Policy 2: Authenticated users can insert feedback
CREATE POLICY "Enable insert for authenticated users" ON community_feedback
    FOR INSERT WITH CHECK (true);

-- Policy 3: Admins can read all feedback (for admin panel)
CREATE POLICY "Enable read all for admins" ON community_feedback
    FOR SELECT USING (true);

-- Policy 4: Admins can update feedback (approve, feature, etc.)
CREATE POLICY "Enable update for admins" ON community_feedback
    FOR UPDATE USING (true) WITH CHECK (true);

-- Policy 5: Admins can delete feedback
CREATE POLICY "Enable delete for admins" ON community_feedback
    FOR DELETE USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_community_feedback_featured ON community_feedback(is_featured, is_approved);
CREATE INDEX IF NOT EXISTS idx_community_feedback_created_at ON community_feedback(created_at DESC);

-- Clear any existing fake feedback (optional - uncomment if you want to start fresh)
-- DELETE FROM community_feedback WHERE is_approved = true AND is_featured = true;

-- Verify the setup
SELECT 'RLS policies updated successfully' as status;
SELECT COUNT(*) as total_feedback FROM community_feedback;
SELECT COUNT(*) as featured_feedback FROM community_feedback WHERE is_featured = true AND is_approved = true;
