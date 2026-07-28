-- Migration: 00003_add_draft_status
-- Up: adds 'draft' to agreement status CHECK constraint, changes default to 'draft'

ALTER TABLE agreements DROP CONSTRAINT IF EXISTS agreements_status_check;
ALTER TABLE agreements ADD CONSTRAINT agreements_status_check
  CHECK (status IN ('draft', 'active', 'completed', 'disputed'));
ALTER TABLE agreements ALTER COLUMN status SET DEFAULT 'draft';
