-- This migration creates a function to automatically delete unverified users
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Function to delete unverified users older than 7 days
CREATE OR REPLACE FUNCTION cleanup_unverified_users()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users
  WHERE created_at < NOW() - INTERVAL '7 days'
  AND email_confirmed_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Supabase doesn't support cron jobs directly in SQL
-- You'll need to call this function periodically using:
-- 1. A cron job on your server
-- 2. Supabase Edge Functions with a scheduled trigger
-- 3. External service like cron-job.org that calls your Supabase API

-- Example: Call this function manually or set up a scheduled job
-- SELECT cleanup_unverified_users();

