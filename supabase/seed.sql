-- Seed data for NotWrapper MVP

-- IMPORTANT: This seed file requires manual setup of test users first!
-- Follow these steps:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Create test users using email/password signup or invite
-- 3. After creating users, profiles will be auto-created via trigger (if you have one)
--    OR you can manually insert profiles using the actual user UUIDs
-- 4. Then uncomment and update the user-dependent sections below

-- For now, we'll insert tools without user references to get started

-- Insert demo tools (without user references for initial setup)
INSERT INTO tools (name, url, description, category, latest_verdict, transparency_score, submitted_by) VALUES
  ('ShipFast AI', 'https://shipfast-ai.example.com', 'Quick AI prototyping tool', 'Development', 'NotWrapper', 85, NULL),
  ('WrapperGPT Pro', 'https://wrappergpt.example.com', 'ChatGPT with a fancy UI', 'Productivity', 'Wrapper Confirmed', 15, NULL),
  ('CodeGen Studio', 'https://codegen.example.com', 'AI code generation platform', 'Development', 'Wrapper Sus', 45, NULL),
  ('MindMap AI', 'https://mindmap-ai.example.com', 'Visual thinking tool powered by AI', 'Productivity', 'NotWrapper', 78, NULL)
ON CONFLICT (url) DO NOTHING;

-- Uncomment and update these sections after creating real test users:

-- -- Insert demo profiles (replace UUIDs with actual user IDs from Supabase Auth)
-- INSERT INTO profiles (id, username, display_name, bio) VALUES
--   ('REPLACE-WITH-REAL-UUID-1', 'hunter_dev', 'The Hunter', 'Finding wrappers since 2024'),
--   ('REPLACE-WITH-REAL-UUID-2', 'real_builder', 'Real Builder', 'Shipping actual code, not wrappers')
-- ON CONFLICT (id) DO NOTHING;

-- -- Insert demo scans (uncomment after creating test users)
-- INSERT INTO scans (tool_id, scanned_by, verdict, confidence, receipts, stack_dna)
-- SELECT 
--   t.id,
--   'REPLACE-WITH-REAL-UUID-1',
--   t.latest_verdict,
--   CASE 
--     WHEN t.latest_verdict = 'NotWrapper' THEN 85
--     WHEN t.latest_verdict = 'Wrapper Sus' THEN 60
--     ELSE 95
--   END,
--   jsonb_build_object(
--     'detected_frameworks', ARRAY['React', 'Next.js'],
--     'suspicious_patterns', ARRAY[]::text[],
--     'api_endpoints_found', ARRAY['/api/chat']
--   ),
--   jsonb_build_object(
--     'frontend', 'React',
--     'backend', 'Node.js',
--     'has_custom_ml', t.latest_verdict = 'NotWrapper'
--   )
-- FROM tools t;

-- -- Update total_scans count (uncomment after adding scans)
-- UPDATE tools SET total_scans = 1;

