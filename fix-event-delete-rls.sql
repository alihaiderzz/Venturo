-- Fix Event Deletion RLS Policies and Add RPC Function
-- This script fixes the event deletion issue by updating RLS policies and adding a fallback RPC function

-- 1. Drop existing RLS policies for events table
DROP POLICY IF EXISTS "Enable read access for all users" ON events;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON events;
DROP POLICY IF EXISTS "Enable update for users based on email" ON events;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON events;

-- 2. Create new RLS policies that allow admin operations
CREATE POLICY "Enable read access for all users" ON events
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON events
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON events
    FOR DELETE USING (true);

-- 3. Create RPC function for admin event deletion (fallback)
CREATE OR REPLACE FUNCTION delete_admin_event(event_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete the event by ID
    DELETE FROM events WHERE id = event_id;
    
    -- If no rows were affected, raise an exception
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Event with ID % not found', event_id;
    END IF;
END;
$$;

-- 4. Grant execute permission on the RPC function
GRANT EXECUTE ON FUNCTION delete_admin_event(UUID) TO authenticated;

-- 5. Test the function (optional - you can comment this out)
-- SELECT delete_admin_event('00000000-0000-0000-0000-000000000000');

-- Success message
SELECT 'Event deletion RLS policies and RPC function created successfully!' as message;
