-- Add boost-related columns to startup_ideas table
ALTER TABLE startup_ideas 
ADD COLUMN IF NOT EXISTS is_boosted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for boosted ideas
CREATE INDEX IF NOT EXISTS idx_startup_ideas_boosted 
ON startup_ideas(is_boosted, boost_expires_at) 
WHERE is_boosted = TRUE;

-- Add boost-related columns to user_profiles table if not exists
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS boost_credits INTEGER DEFAULT 0;

-- Success message
SELECT 'Boost columns added successfully!' as message;
