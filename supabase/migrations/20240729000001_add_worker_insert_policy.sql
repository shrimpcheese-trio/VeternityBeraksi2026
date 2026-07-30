-- Migration: add_worker_insert_policy
-- Up: adds INSERT RLS policy for workers to create their own profile
-- (currently only SELECT and UPDATE policies exist, forcing admin client usage)

CREATE POLICY "workers_insert_own_profile"
  ON worker_profiles FOR INSERT
  WITH CHECK (auth.uid() = worker_id);

