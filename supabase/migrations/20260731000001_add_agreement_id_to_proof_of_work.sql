-- Migration: 20260731000001
-- Up: links proof_of_work rows to the agreement (job) they document

ALTER TABLE proof_of_work
  ADD COLUMN agreement_id UUID REFERENCES agreements(agreement_id) ON DELETE SET NULL;
