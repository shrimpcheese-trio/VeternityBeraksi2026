-- Migration: 00002_add_trust_engine_fields
-- Down: reverts all changes from the up migration

DROP TABLE IF EXISTS trust_score;

ALTER TABLE agreements DROP COLUMN IF EXISTS status;

ALTER TABLE community_verifications DROP COLUMN IF EXISTS rating;

ALTER TABLE proof_of_work DROP COLUMN IF EXISTS verified;

DROP TABLE IF EXISTS employer_profiles;
