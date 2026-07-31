# Trust Score Weighting

The Trust Score is recomputed server-side in `lib/services/trust-engine.ts`. The score ranges 0-100 and no single input may exceed 25 points, so one fake verifier, review ring, or bad-faith confirmation cannot dominate the score.

## Components (total 100)

| Component | Formula | Cap | Source |
| --- | --- | --- | --- |
| Verification | community verification average rating x 4 | 20 | `community_verifications.rating` |
| Review | employer review average rating x 5 | 25 | `reviews.rating` |
| Proof of work | verified proof count x 5 | 25 | `proof_of_work` where `verified = true` |
| Completion | completed / (completed + disputed + active) x 25 | 25 | `agreements.status` |
| Tenure | months since profile creation x 0.5 | 5 | `worker_profiles.created_at` |

## Change log

- **2026-07-31**: employer reviews (`reviews.rating`) added as a first-class input. To keep the total at 100 and preserve the no-dominance guard, the community verification weight dropped from `avg x 8` (cap 40) to `avg x 4` (cap 20) and tenure from `x 1` (cap 10) to `x 0.5` (cap 5). Review weight is `avg x 5` (cap 25), matching proof and completion caps.

Submitting a review also marks the agreement's proof of work as `customer_confirmed = true`, so completed jobs become visible on the worker's public profile.
