ALTER TABLE agreements DROP CONSTRAINT agreements_status_check;
ALTER TABLE agreements ADD CONSTRAINT agreements_status_check
  CHECK (status IN ('active', 'completed', 'disputed'));
ALTER TABLE agreements ALTER COLUMN status SET DEFAULT 'active';
