-- Add Featured Feedback Field
-- Run this in your Supabase SQL editor

-- Add is_featured column to community_feedback table
ALTER TABLE community_feedback 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_community_feedback_featured 
ON community_feedback(is_featured, is_approved);

-- Update RLS policies to allow admin operations
DROP POLICY IF EXISTS "Allow all operations on community_feedback" ON community_feedback;

-- Create new policies
CREATE POLICY "Allow all operations on community_feedback" ON community_feedback 
FOR ALL USING (true) WITH CHECK (true);

-- Create specific policy for admin updates
CREATE POLICY "Allow admin to update feedback" ON community_feedback 
FOR UPDATE USING (true) WITH CHECK (true);
