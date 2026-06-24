-- Seed the first admin user.
--
-- HOW TO USE:
-- 1. Go to https://supabase.com/dashboard → your project → Authentication → Users
-- 2. Click "Add user" → "Create new user"
-- 3. Enter email: owner@reinventionbeautybar.com  and a strong password
-- 4. Copy the UUID shown in the Users list for that account
-- 5. Replace '<PASTE_USER_UUID_HERE>' below with that UUID
-- 6. Run this migration via: supabase db push
--    OR paste the INSERT directly into the Supabase SQL editor and run it
--
-- Example:
--   INSERT INTO public.admin_users (user_id, email)
--   VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'owner@reinventionbeautybar.com')
--   ON CONFLICT DO NOTHING;

INSERT INTO public.admin_users (user_id, email)
VALUES ('<PASTE_USER_UUID_HERE>', 'owner@reinventionbeautybar.com')
ON CONFLICT DO NOTHING;
