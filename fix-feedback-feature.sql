-- Fix Feedback Feature Issue
-- Run this in your Supabase SQL editor

-- First, let's see what feedback we have
SELECT id, quote, author_name, is_approved, is_featured, created_at 
FROM community_feedback 
ORDER BY created_at DESC;

-- Update the feedback to be both approved and featured
UPDATE community_feedback 
SET 
    is_approved = true,
    is_featured = true,
    updated_at = NOW()
WHERE quote LIKE '%Great, amazing, excellent%' 
   OR quote LIKE '%Great platform for connecting%'
   OR quote LIKE '%The events are well-organized%';

-- Verify the update
SELECT id, quote, author_name, is_approved, is_featured, created_at 
FROM community_feedback 
WHERE is_approved = true AND is_featured = true
ORDER BY created_at DESC;
