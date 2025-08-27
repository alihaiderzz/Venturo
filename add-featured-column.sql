-- Add missing is_featured column to community_feedback table
-- Run this in your Supabase SQL editor

-- Add the is_featured column if it doesn't exist
ALTER TABLE community_feedback 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_community_feedback_featured 
ON community_feedback(is_featured, is_approved);

-- Update existing feedback to be featured (optional)
UPDATE community_feedback 
SET is_featured = true, is_approved = true
WHERE quote LIKE '%Great, amazing, excellent%' 
   OR quote LIKE '%Great platform for connecting%'
   OR quote LIKE '%The events are well-organized%';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'community_feedback' 
AND column_name = 'is_featured';
