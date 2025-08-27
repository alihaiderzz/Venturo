-- Clear any existing fake/sample feedback
-- This will remove any feedback that was automatically approved and featured

-- Delete any feedback that looks like it was auto-generated
DELETE FROM community_feedback 
WHERE author_name IN ('Sarah Chen', 'Mike Johnson', 'Emma Wilson', 'Test User')
   OR quote LIKE '%Venturo helped me find%'
   OR quote LIKE '%Great platform for connecting%'
   OR quote LIKE '%The community here is amazing%'
   OR quote LIKE '%This is a test%';

-- Show current feedback count
SELECT 
    COUNT(*) as total_feedback,
    COUNT(*) FILTER (WHERE is_approved = true) as approved_feedback,
    COUNT(*) FILTER (WHERE is_featured = true) as featured_feedback
FROM community_feedback;

-- Show remaining feedback (if any)
SELECT id, quote, author_name, is_approved, is_featured, created_at 
FROM community_feedback 
ORDER BY created_at DESC;
