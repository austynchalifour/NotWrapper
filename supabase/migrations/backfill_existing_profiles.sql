-- Backfill profiles for existing users who don't have one yet
-- Run this after adding the trigger to create profiles for users who signed up before the trigger existed

INSERT INTO public.profiles (id, username, display_name)
SELECT 
  id,
  SPLIT_PART(email, '@', 1) as username,
  SPLIT_PART(email, '@', 1) as display_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Show results
SELECT 
  COUNT(*) as total_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  COUNT(*) - (SELECT COUNT(*) FROM profiles) as missing_profiles
FROM auth.users;

