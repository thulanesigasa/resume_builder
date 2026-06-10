-- ====================================================================
-- SUPABASE SCHEMA DEFINITIONS & ROW LEVEL SECURITY (RLS) POLICIES
-- Run this script in the Supabase SQL Editor to secure your database tables
-- and storage buckets for production deployment.
-- ====================================================================

-- 1. SCHEMA UPDATES (Run these if the tables/columns don't exist yet)
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS credits integer DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.payfast_orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    pf_payment_id text,
    m_payment_id text UNIQUE NOT NULL,
    amount_gross numeric NOT NULL,
    item_name text NOT NULL,
    status text DEFAULT 'PENDING',
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on Database Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payfast_orders ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 1. POLICIES FOR THE "profiles" TABLE
-- ==========================================
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- ==========================================
-- 2. POLICIES FOR THE "certificates" TABLE
-- ==========================================
CREATE POLICY "Users can view their own certificates" 
ON public.certificates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates" 
ON public.certificates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certificates" 
ON public.certificates 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certificates" 
ON public.certificates 
FOR DELETE 
USING (auth.uid() = user_id);

-- ==========================================
-- 3. POLICIES FOR THE "applications" TABLE
-- ==========================================
CREATE POLICY "Users can view their own applications" 
ON public.applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.applications 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications" 
ON public.applications 
FOR DELETE 
USING (auth.uid() = user_id);

-- ==========================================
-- 4. POLICIES FOR THE "payfast_orders" TABLE
-- ==========================================
-- Users can only view their own orders
CREATE POLICY "Users can view their own orders" 
ON public.payfast_orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Note: Inserts and Updates to payfast_orders are done via the backend Service Role Key, 
-- so we do not grant users insert/update permissions.

-- ====================================================================
-- 4. POLICIES FOR SUPABASE STORAGE (resumes bucket)
-- ====================================================================
-- Ensure storage RLS is enabled. Supabase Storage has policies in the
-- storage.objects table. Files are stored as: bucket_id / path_to_file
-- The path for users in this app is: {user_id}/master_cv/* or {user_id}/certificates/*

-- Allow users to download/read their own files in the "resumes" bucket
CREATE POLICY "Allow users to download their own files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to upload files to their own folder in the "resumes" bucket
CREATE POLICY "Allow users to upload their own files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own files in the "resumes" bucket
CREATE POLICY "Allow users to update their own files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files in the "resumes" bucket
CREATE POLICY "Allow users to delete their own files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
