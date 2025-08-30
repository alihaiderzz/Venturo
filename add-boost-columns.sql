-- Add boost-related columns to startup_ideas table
ALTER TABLE startup_ideas 
ADD COLUMN IF NOT EXISTS is_boosted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS boosted_until TIMESTAMP WITH TIME ZONE;

-- Create index for boosted ideas
CREATE INDEX IF NOT EXISTS idx_startup_ideas_boosted 
ON startup_ideas(is_boosted, boosted_until) 
WHERE is_boosted = TRUE;

-- Create a function to automatically remove expired boosts
CREATE OR REPLACE FUNCTION remove_expired_boosts()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE startup_ideas 
  SET 
    is_boosted = FALSE,
    boosted_until = NULL,
    updated_at = NOW()
  WHERE 
    is_boosted = TRUE 
    AND boosted_until < NOW();
END;
$$;

-- Create a scheduled job to run this function daily (if using pg_cron)
-- SELECT cron.schedule('remove-expired-boosts', '0 0 * * *', 'SELECT remove_expired_boosts();');

-- Add boost-related columns to user_profiles table if not exists
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS boost_credits INTEGER DEFAULT 0;

-- Success message
SELECT 'Boost columns and functions have been added successfully!' as status;
