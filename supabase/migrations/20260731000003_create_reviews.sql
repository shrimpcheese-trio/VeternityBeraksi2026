-- Migration: 20260731000003
-- Up: creates the reviews table where employers review a completed job

CREATE TABLE reviews (
  review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID UNIQUE NOT NULL REFERENCES agreements(agreement_id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES worker_profiles(worker_id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 0 AND rating <= 5),
  comment TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parties_read_reviews"
  ON reviews FOR SELECT
  USING (auth.uid() = employer_id OR auth.uid() = worker_id);

CREATE POLICY "authenticated_read_worker_reviews"
  ON reviews FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "employers_insert_reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "employers_update_own_reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = employer_id)
  WITH CHECK (auth.uid() = employer_id);
