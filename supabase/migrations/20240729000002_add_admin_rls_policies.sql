-- Migration: add_admin_rls_policies
-- Up: grants admin role full CRUD access on worker_profiles via RLS

CREATE POLICY "admin_select_all_profiles"
  ON worker_profiles FOR SELECT
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_update_all_profiles"
  ON worker_profiles FOR UPDATE
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_delete_profiles"
  ON worker_profiles FOR DELETE
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
