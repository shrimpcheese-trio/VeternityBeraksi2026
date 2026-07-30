-- Migration: 20240730000001_create_worker_services
-- Up: creates worker_services table for workers to list service offerings

CREATE TABLE worker_services (
  service_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES worker_profiles(worker_id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  price_unit VARCHAR(50) NOT NULL DEFAULT 'fixed',
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE worker_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workers_manage_own_services"
  ON worker_services FOR ALL
  USING (auth.uid() = worker_id)
  WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "everyone_read_active_services"
  ON worker_services FOR SELECT
  USING (is_active = TRUE OR auth.uid() = worker_id);

-- Down: drop the table and policies
-- DROP POLICY IF EXISTS workers_manage_own_services ON worker_services;
-- DROP POLICY IF EXISTS everyone_read_active_services ON worker_services;
-- DROP TABLE IF EXISTS worker_services;
