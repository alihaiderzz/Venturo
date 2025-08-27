-- Fix Delete Ideas RLS Issue
-- Run this in your Supabase SQL editor

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can delete their own ideas" ON startup_ideas;
DROP POLICY IF EXISTS "Authenticated users can delete ideas" ON startup_ideas;

-- Create new policy that allows users to delete their own ideas
CREATE POLICY "Users can delete their own ideas" ON startup_ideas 
FOR DELETE USING (
  auth.jwt() ->> 'sub' IN (
    SELECT clerk_user_id FROM user_profiles WHERE id = startup_ideas.owner_id
  )
);

-- Alternative: Create a more permissive policy for testing
CREATE POLICY "Allow authenticated users to delete ideas" ON startup_ideas 
FOR DELETE USING (true);

-- Create RPC function for deleting ideas (alternative approach)
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
