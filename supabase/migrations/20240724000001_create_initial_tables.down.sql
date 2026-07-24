-- Migration: 00001_create_initial_tables
-- Down: reverts all MVP tables

DROP TABLE IF EXISTS agreements;
DROP TABLE IF EXISTS wage_estimates;
DROP TABLE IF EXISTS proof_of_work;
DROP TABLE IF EXISTS community_verifications;
DROP TABLE IF EXISTS worker_profiles;