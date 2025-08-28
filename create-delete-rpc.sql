-- Create RPC function for deleting user ideas
CREATE OR REPLACE FUNCTION delete_user_idea(idea_id UUID, user_clerk_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile_id UUID;
  idea_owner_id UUID;
BEGIN
  -- Get the user's profile ID
  SELECT id INTO user_profile_id
  FROM user_profiles
  WHERE clerk_user_id = user_clerk_id;
  
  IF user_profile_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get the idea's owner ID
  SELECT owner_id INTO idea_owner_id
  FROM startup_ideas
  WHERE id = idea_id;
  
  IF idea_owner_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user owns the idea
  IF idea_owner_id != user_profile_id THEN
    RETURN FALSE;
  END IF;
  
  -- Delete the idea
  DELETE FROM startup_ideas
  WHERE id = idea_id;
  
  RETURN TRUE;
END;
$$;
