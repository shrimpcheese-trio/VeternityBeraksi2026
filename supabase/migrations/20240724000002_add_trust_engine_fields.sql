-- Migration: 00002_add_trust_engine_fields
-- Up: adds trust_score table, employer_profiles table, and missing columns for trust engine

-- ----------------------------
-- employer_profiles
-- ----------------------------
CREATE TABLE employer_profiles (
  employer_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employers_read_own_profile"
  ON employer_profiles FOR SELECT
  USING (auth.uid() = employer_id);

CREATE POLICY "employers_update_own_profile"
  ON employer_profiles FOR UPDATE
  USING (auth.uid() = employer_id)
  WITH CHECK (auth.uid() = employer_id);

-- ----------------------------
-- proof_of_work: add verified column
-- ----------------------------
ALTER TABLE proof_of_work ADD COLUMN verified BOOLEAN DEFAULT FALSE;

-- ----------------------------
-- community_verifications: add rating column
-- ----------------------------
ALTER TABLE community_verifications ADD COLUMN rating NUMERIC(3,1);

-- ----------------------------
-- agreements: add status column
-- ----------------------------
ALTER TABLE agreements ADD COLUMN status VARCHAR(20) DEFAULT 'active' NOT NULL
  CHECK (status IN ('active', 'completed', 'disputed'));

-- ----------------------------
-- trust_score table
-- ----------------------------
CREATE TABLE trust_score (
  worker_id UUID PRIMARY KEY REFERENCES worker_profiles(worker_id) ON DELETE CASCADE,
  score NUMERIC(5,2) DEFAULT 0,
  breakdown JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE trust_score ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workers_read_own_trust_score"
  ON trust_score FOR SELECT
  USING (auth.uid() = worker_id);

CREATE POLICY "employers_read_worker_trust_scores"
  ON trust_score FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "service_upsert_trust_score"
  ON trust_score FOR ALL
  USING (auth.role() = 'service_role');
