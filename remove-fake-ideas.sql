-- Remove any fake/sample ideas from the database
-- This script will clean up any test or sample data

-- Delete ideas that look like they were auto-generated or test data
DELETE FROM startup_ideas 
WHERE title ILIKE '%test%'
   OR title ILIKE '%sample%'
   OR title ILIKE '%example%'
   OR title ILIKE '%demo%'
   OR description ILIKE '%test%'
   OR description ILIKE '%sample%'
   OR description ILIKE '%example%'
   OR description ILIKE '%demo%'
   OR one_liner ILIKE '%test%'
   OR one_liner ILIKE '%sample%'
   OR one_liner ILIKE '%example%'
   OR one_liner ILIKE '%demo%';

-- Show current ideas count
SELECT 
    COUNT(*) as total_ideas,
    COUNT(*) FILTER (WHERE status = 'active') as active_ideas,
    COUNT(*) FILTER (WHERE status = 'inactive') as inactive_ideas
FROM startup_ideas;

-- Show remaining ideas (if any)
SELECT 
    id,
    title,
    category,
    status,
    created_at,
    boosted_until
FROM startup_ideas 
ORDER BY created_at DESC
LIMIT 10;
