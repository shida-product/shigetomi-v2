-- migration: init guests table and RLS policies

-- Enable specific extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the guests table
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    language TEXT NOT NULL,
    full_name TEXT NOT NULL,
    furigana TEXT,
    birth_date DATE NOT NULL,
    phone_number TEXT NOT NULL,
    has_domestic_address BOOLEAN NOT NULL,
    address TEXT NOT NULL,
    nationality TEXT,
    passport_number TEXT,
    passport_photo_url TEXT,
    arrival_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    departure_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    agree_terms BOOLEAN NOT NULL CHECK (agree_terms = true),
    visit_purposes TEXT[],
    group_id UUID
);

-- 2. Setup Row Level Security (RLS)
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from Edge Functions or directly if needed, but we plan to use Edge)
-- Wait, if we use Edge Functions, they will use the SERVICE_ROLE key, which bypasses RLS. 
-- So we can actually restrict insert to authenticated/service_role only if we don't insert from the client.
-- But just in case, here are the base policies. Overly restrictive on SELECT so clients can't read.
CREATE POLICY "Enable insert for authenticated and anon" ON public.guests 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for authenticated only" ON public.guests 
    FOR SELECT TO authenticated USING (true);

-- 3. Set up the pg_cron job for automatic data deletion (older than 3 years)
-- Note: pg_cron requires superuser privileges in Supabase, but you can schedule from the dashboard
-- Here is the SQL conceptually:
/*
SELECT cron.schedule(
  'delete-old-guests-daily',
  '0 3 * * *', -- Run every day at 3:00 AM
  $$
  DELETE FROM public.guests WHERE created_at < current_date - interval '3 years';
  $$
);
*/

-- 4. Create the storage bucket for passport photos
-- In Supabase, executing this via SQL requires accessing the storage schema
INSERT INTO storage.buckets (id, name, public) 
VALUES ('passport-photos', 'passport-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Setup Storage RLS
CREATE POLICY "Upload passport photos" 
    ON storage.objects FOR INSERT 
    WITH CHECK ( bucket_id = 'passport-photos' );

CREATE POLICY "View passport photos authenticated" 
    ON storage.objects FOR SELECT 
    TO authenticated USING ( bucket_id = 'passport-photos' );
