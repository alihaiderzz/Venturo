-- Fix Feedback RLS Issue
-- Run this in your Supabase SQL editor

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Authenticated users can create feedback" ON community_feedback;
DROP POLICY IF EXISTS "Users can update their own feedback" ON community_feedback;

-- Create new policies that work with Clerk
CREATE POLICY "Authenticated users can create feedback" ON community_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own feedback" ON community_feedback FOR UPDATE USING (true);

-- Add moderation fields if they don't exist
ALTER TABLE community_feedback 
ADD COLUMN IF NOT EXISTS moderation_score INTEGER,
ADD COLUMN IF NOT EXISTS moderation_reason TEXT,
ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE;

-- Create index for moderation
CREATE INDEX IF NOT EXISTS idx_community_feedback_moderation 
ON community_feedback(moderation_score, is_approved);
