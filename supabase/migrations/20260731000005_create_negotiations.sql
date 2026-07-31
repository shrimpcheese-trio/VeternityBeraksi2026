-- Negotiation rounds for agreements: every offer/counter between the two parties.
CREATE TABLE negotiations (
  negotiation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID NOT NULL REFERENCES agreements(agreement_id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('employer', 'worker')),
  price NUMERIC(12,2) NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "negotiations_parties_read"
  ON negotiations FOR SELECT
  USING (
    auth.uid() = actor_id
    OR auth.uid() IN (
      SELECT worker_id FROM agreements WHERE agreement_id = negotiations.agreement_id
    )
    OR auth.uid() IN (
      SELECT employer_id FROM agreements
      WHERE agreement_id = negotiations.agreement_id AND employer_id IS NOT NULL
    )
  );

CREATE POLICY "negotiations_parties_insert"
  ON negotiations FOR INSERT
  WITH CHECK (
    auth.uid() = actor_id
    AND (
      auth.uid() IN (
        SELECT worker_id FROM agreements WHERE agreement_id = negotiations.agreement_id
      )
      OR auth.uid() IN (
        SELECT employer_id FROM agreements
        WHERE agreement_id = negotiations.agreement_id AND employer_id IS NOT NULL
      )
    )
  );
