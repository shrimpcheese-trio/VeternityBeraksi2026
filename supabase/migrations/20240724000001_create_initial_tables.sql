-- Migration: 00001_create_initial_tables
-- Up: creates all MVP tables with RLS policies

-- ----------------------------
-- worker_profiles
-- ----------------------------
CREATE TABLE worker_profiles (
  worker_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  job_category VARCHAR(100) NOT NULL,
  years_experience INT DEFAULT 0,
  trust_score NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workers_read_own_profile"
  ON worker_profiles FOR SELECT
  USING (auth.uid() = worker_id);

CREATE POLICY "workers_update_own_profile"
  ON worker_profiles FOR UPDATE
  USING (auth.uid() = worker_id)
  WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "employers_read_all_profiles"
  ON worker_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- ----------------------------
-- community_verifications
-- ----------------------------
CREATE TABLE community_verifications (
  verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES worker_profiles(worker_id) ON DELETE CASCADE,
  verifier_name VARCHAR(200) NOT NULL,
  verifier_role VARCHAR(100) NOT NULL,
  statement TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE community_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workers_read_own_verifications"
  ON community_verifications FOR SELECT
  USING (auth.uid() = worker_id);

CREATE POLICY "admins_manage_verifications"
  ON community_verifications FOR ALL
  USING (auth.role() = 'service_role');

-- ----------------------------
-- proof_of_work
-- ----------------------------
CREATE TABLE proof_of_work (
  proof_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES worker_profiles(worker_id) ON DELETE CASCADE,
  job_type VARCHAR(100) NOT NULL,
  job_value NUMERIC(12,2),
  photo_before_url TEXT,
  photo_after_url TEXT,
  location_lat NUMERIC(9,6),
  location_lng NUMERIC(9,6),
  customer_confirmed BOOLEAN DEFAULT FALSE,
  job_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE proof_of_work ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workers_manage_own_proofs"
  ON proof_of_work FOR ALL
  USING (auth.uid() = worker_id)
  WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "employers_read_confirmed_proofs"
  ON proof_of_work FOR SELECT
  USING (customer_confirmed = TRUE);

-- ----------------------------
-- wage_estimates
-- ----------------------------
CREATE TABLE wage_estimates (
  estimate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city VARCHAR(100) NOT NULL,
  job_type VARCHAR(100) NOT NULL,
  experience_band VARCHAR(50) NOT NULL,
  min_wage NUMERIC(12,2) NOT NULL,
  max_wage NUMERIC(12,2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE wage_estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "everyone_read_wage_estimates"
  ON wage_estimates FOR SELECT
  USING (TRUE);

CREATE POLICY "admins_manage_wage_estimates"
  ON wage_estimates FOR ALL
  USING (auth.role() = 'service_role');

-- ----------------------------
-- agreements
-- ----------------------------
CREATE TABLE agreements (
  agreement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES worker_profiles(worker_id) ON DELETE CASCADE,
  employer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  price NUMERIC(12,2) NOT NULL,
  location TEXT,
  work_hours TEXT,
  job_description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parties_read_own_agreements"
  ON agreements FOR SELECT
  USING (auth.uid() = worker_id OR auth.uid() = employer_id);

CREATE POLICY "employers_create_agreements"
  ON agreements FOR INSERT
  WITH CHECK (auth.uid() = employer_id);